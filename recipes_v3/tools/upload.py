"""Upload v3 builds to Turso ``dev_recipes``.

Phase-6 writer. Replaces scripts/upload-dev-recipe.mjs.

Usage:
    python tools/upload.py                            # dry-run all 40 (no writes)
    python tools/upload.py --commit                   # actually write all 40
    python tools/upload.py --recipe SWEET_001              # single recipe (alias)
    python tools/upload.py --recipe-id SWEET_001 --commit
    python tools/upload.py --recipe SWEET_001 --commit
    python tools/upload.py --diff-only                # only show recipes whose
                                                      # nutrition_json would change
    python tools/upload.py --force-locked --commit    # also overwrite locked=2
                                                      # rows that disagree (default
                                                      # behavior already overwrites
                                                      # locked=2; flag is reserved
                                                      # for future read-only mode)

Reads .env.local from the daily-food-chain repo root for TURSO_DATABASE_URL +
TURSO_AUTH_TOKEN.

Writes a per-run audit log to ``recipes_v3/output/upload_log/<UTC>.json``.

This script BYPASSES /api/recipes/builtin PATCH because that endpoint
recomputes nutrition_json via calcNutritionSR28 (7 macros only) and would
strip v3's full ~60-nutrient panel. v3 is now the source of truth; the
endpoint is being gated in a follow-up commit.
"""
from __future__ import annotations

import argparse
import json
import os
import sys
import time
from datetime import datetime, timezone
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
REPO_ROOT = ROOT.parent  # daily-food-chain/
sys.path.insert(0, str(ROOT))

from lib.build import to_turso_nutrition_json  # noqa: E402
from lib.load import load_ingredients, load_instructions, load_ledger, load_recipes, load_sections  # noqa: E402

BUILDS_DIR = ROOT / "output" / "builds"
LOG_DIR = ROOT / "output" / "upload_log"

ENV_FILE = REPO_ROOT / ".env.local"


def _load_env(path: Path) -> dict[str, str]:
    """Minimal .env parser: KEY=value lines only, ignores quotes/comments."""
    env: dict[str, str] = {}
    if not path.exists():
        return env
    for line in path.read_text().splitlines():
        line = line.strip()
        if not line or line.startswith("#"):
            continue
        if "=" not in line:
            continue
        k, v = line.split("=", 1)
        env[k.strip()] = v.strip().strip('"').strip("'")
    return env


def _connect():
    env = _load_env(ENV_FILE)
    url = env.get("TURSO_DATABASE_URL") or os.environ.get("TURSO_DATABASE_URL")
    token = env.get("TURSO_AUTH_TOKEN") or os.environ.get("TURSO_AUTH_TOKEN")
    if not url or not token:
        sys.exit(
            "ERROR: TURSO_DATABASE_URL / TURSO_AUTH_TOKEN missing.\n"
            f"Looked in {ENV_FILE} and process env."
        )
    try:
        import libsql_experimental as libsql  # type: ignore
    except ImportError:
        sys.exit("ERROR: pip install libsql-experimental")
    return libsql.connect(database=url, auth_token=token)


def _build_payload(rid: str, recipes, ings, ledger, instrs, sections_map) -> dict:
    """Read v3 build JSON for `rid` and assemble Turso column updates."""
    build_path = BUILDS_DIR / f"{rid}.json"
    if not build_path.exists():
        raise FileNotFoundError(f"No v3 build for {rid}: run tools/build_all.py first")
    build = json.loads(build_path.read_text())
    rec = recipes[rid]
    nutrition_json = to_turso_nutrition_json(build)

    # recipe_ingredients_json: shape consumed by /api/recipes/builtin GET +
    # RecipeForm.svelte (matches normalizeRecipeIngredients in builtin/+server.ts).
    ri_rows = ings.get(rid, [])
    recipe_ingredients = []
    for r in ri_rows:
        # Phase 8c: component-ref ingredient — pull display data from the child
        # build/recipe rather than the ledger (no NDB exists for a child dish).
        if r.ingredient_key.startswith("@"):
            child_id = r.ingredient_key[1:]
            child_rec = recipes.get(child_id)
            child_path = BUILDS_DIR / f"{child_id}.json"
            child_build = json.loads(child_path.read_text()) if child_path.exists() else {}
            child_name = (
                r.display_name_override
                or (child_rec.recipe_name if child_rec else child_build.get("recipe_name", child_id))
            )
            recipe_ingredients.append({
                "name": child_name,
                "quantity": r.qty_display,
                "section": r.section,
                "foodWord": child_rec.food_word if child_rec else "",
                "ndbNo": child_rec.canonical_ndb_no if child_rec else "",
                "portionDesc": "g",
                "portionGrams": r.grams,
                "servingCount": 1,
                "exempt": False,
                "isDish": True,
                "componentRef": child_id,
            })
            continue
        entry = ledger.get(r.ingredient_key)
        if not entry:
            continue
        recipe_ingredients.append({
            "name": r.display_name_override or entry.default_display_name or r.ingredient_key,
            "quantity": r.qty_display,
            "section": r.section,
            "foodWord": entry.food_word,
            "ndbNo": entry.ndb_no,
            "portionDesc": "g",
            "portionGrams": r.grams,
            "servingCount": 1,
            "exempt": False,
            "isDish": False,
        })

    # recipe_instructions_json: ordered list of step strings from recipe_instructions.csv.
    # Auto-append the Suggestions step if it was not explicitly authored.
    _SUGGESTIONS_MARKER = "Suggestions (not included):"
    instr_list = list(instrs.get(rid, []))
    if instr_list and not instr_list[-1].startswith(_SUGGESTIONS_MARKER):
        instr_list.append(_SUGGESTIONS_MARKER)
    recipe_instructions = json.dumps(instr_list, separators=(",", ":"))

    # sections_json: ordered list of section objects for the community edit form.
    # Keyed by section_key; fields match the Section dataclass (snake_case).
    # The community fillFromSuggestion path reads this directly from Turso —
    # no bundle/levelToFormData involvement needed for paid-tier users.
    #
    # yield_factor_water may be None in recipe_sections.csv when it is derived
    # from filling_class + cook_stages (e.g. dense_fruit bake). In that case
    # fall back to the computed value already present in the build JSON so the
    # community form receives the correct pre-computed factor, not null.
    sections_list = sections_map.get(rid, [])
    _build_sec = {s["section_key"]: s for s in build.get("sections", [])}

    def _component_cook_method(child_id: str) -> str:
        """Return the actual cooking method for a component-ref child recipe.

        Component-ref sections in recipe_sections.csv carry cook_method='raw'
        because the parent recipe's pipeline skips retention/yield for those
        sections — the child's already-built per-100g panel is used directly.
        But the *display* method (shown in section headers, prep-time bars)
        should be the child's real heat method (e.g. 'baked' for BKFST_001).
        Writing this correct value to Turso means enrichSection() in the
        v3-build API is no longer needed for form population.
        """
        child_rec = recipes.get(child_id)
        method = child_rec.cooking_method if child_rec else ""
        if method and method != "multi":
            return method
        # Multi-section child: use dominant section by final_grams in build JSON.
        child_path = BUILDS_DIR / f"{child_id}.json"
        if child_path.exists():
            child_build = json.loads(child_path.read_text())
            method = child_build.get("cooking_method") or child_build.get("cook_method") or ""
            if method and method != "multi":
                return method
            child_secs = child_build.get("sections", [])
            if child_secs:
                dominant = max(child_secs, key=lambda x: x.get("final_grams", 0))
                return dominant.get("cook_method", "") or ""
        return ""

    def _parse_cook_stages(raw: str) -> list:
        """Parse '425:15,350:37' → [{tempF,minutes},…]. Empty string → []."""
        if not raw:
            return []
        out = []
        for part in raw.split(","):
            halves = part.strip().split(":")
            if len(halves) == 2:
                try:
                    out.append({"tempF": int(halves[0]), "minutes": int(halves[1])})
                except ValueError:
                    pass
        return out

    def _parse_boil_minutes(raw: str) -> int:
        """Parse '8' → 8. Empty/non-numeric → 0."""
        try:
            return int(raw.strip()) if raw.strip() else 0
        except ValueError:
            return 0

    sections_json = json.dumps(
        [
            {
                "section_key": s.section_key,
                "section_label": s.section_label,
                "prep_method": s.prep_method,
                "cook_method": _component_cook_method(s.source_recipe) if s.source_recipe else s.cook_method,
                "yield_factor_water": (
                    s.yield_factor_water
                    if s.yield_factor_water is not None
                    else _build_sec.get(s.section_key, {}).get("yield_factor_water")
                ),
                "yield_factor_fat": s.yield_factor_fat,
                "yield_factor_protein": s.yield_factor_protein,
                "yield_factor_carbohydrate": s.yield_factor_carbohydrate,
                "yield_factor_other": s.yield_factor_other,
                # Physics-model inputs — allow V1 compound model to recompute
                # yieldWater correctly when the user edits boilMinutes or stages.
                "boil_minutes": _parse_boil_minutes(s.boil_stages),
                "cook_stages": _parse_cook_stages(s.cook_stages),
                "fill_class": s.filling_class or "",
            }
            for s in sections_list
        ],
        separators=(",", ":"),
    ) if sections_list else None

    # cook_minutes and cook_temp_f are direct values from recipes.csv columns.
    # No derivation — these are explicit top-bar data inputs.
    cook_minutes_val: int | None = rec.cook_minutes
    cook_temp_f_val:  int | None = rec.cook_temp_f

    # v3 owns all dev recipe columns except game/identity keys (food_word, category,
    # dietary_category, serving_label, servings, submitted_by).
    # cooking_method is now written by upload.py — recipes.csv is authoritative.
    return {
        "recipe_id": rid,
        "recipe_name": rec.recipe_name,
        "servings_count": float(rec.servings_count),
        "grams_per_serving": float(build["grams_per_serving"]),
        "recipe_ingredients_json": json.dumps(recipe_ingredients, separators=(",", ":")),
        "recipe_instructions_json": recipe_instructions,
        "nutrition_json": json.dumps(nutrition_json, separators=(",", ":")),

        "nutrient_version": "v3",
        "retention_model_version": "v3-r6",
        "source_match_version": "v3-greenfield",
        "source_ndb_no": rec.canonical_ndb_no or "",
        "sections_json": sections_json,
        "cook_minutes": cook_minutes_val,
        "cook_temp_f":  cook_temp_f_val,
        "cooking_method": rec.cooking_method or "",
    }


_UPDATE_SQL = """\
UPDATE dev_recipes SET
  recipe_name              = ?,
  servings_count           = ?,
  grams_per_serving        = ?,
  recipe_ingredients_json  = ?,
  recipe_instructions_json = ?,
  nutrition_json           = ?,
  nutrient_version         = ?,
  retention_model_version  = ?,
  source_match_version     = ?,
  source_ndb_no            = ?,
  sections_json            = ?,
  cook_minutes             = ?,
  cook_temp_f              = ?,
  cooking_method           = ?,
  updated_at               = ?
WHERE recipe_id = ?
"""

_UPDATE_COLS = (
    "recipe_name",
    "servings_count",
    "grams_per_serving",
    "recipe_ingredients_json", "recipe_instructions_json", "nutrition_json",
    "nutrient_version", "retention_model_version", "source_match_version",
    "source_ndb_no", "sections_json", "cook_minutes", "cook_temp_f", "cooking_method",
)


def _diff_payload(conn, payload: dict) -> dict | None:
    """Return per-column diff (existing vs new) or None if row missing."""
    cur = conn.execute(
        "SELECT " + ", ".join(_UPDATE_COLS) + " FROM dev_recipes WHERE recipe_id = ?",
        (payload["recipe_id"],),
    )
    row = cur.fetchone()
    if row is None:
        return None
    existing = dict(zip(_UPDATE_COLS, row, strict=False))
    diff: dict = {}
    for col in _UPDATE_COLS:
        old = existing.get(col)
        new = payload.get(col)
        if col in ("nutrition_json", "recipe_ingredients_json"):
            try:
                old_j = json.loads(old) if old else None
                new_j = json.loads(new) if new else None
                if old_j != new_j:
                    diff[col] = {"old_len": len(old or ""), "new_len": len(new or "")}
            except Exception:
                if (old or "") != (new or ""):
                    diff[col] = {"old_len": len(old or ""), "new_len": len(new or "")}
        elif col == "sections_json":
            try:
                old_j = json.loads(old) if old else None
                new_j = json.loads(new) if new else None
                if old_j != new_j:
                    diff[col] = {"old_len": len(old or ""), "new_len": len(new or "")}
            except Exception:
                if (old or "") != (new or ""):
                    diff[col] = {"old_len": len(old or ""), "new_len": len(new or "")}
        else:
            if (old if old is not None else "") != (new if new is not None else ""):
                diff[col] = {"old": old, "new": new}
    return diff


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--commit", action="store_true",
                    help="Actually write to Turso (default is dry-run)")
    ap.add_argument("--recipe-id", "--recipe", action="append", default=[],
                    dest="recipe_id",
                    help="Limit to specific recipe_id (may repeat)")
    ap.add_argument("--diff-only", action="store_true",
                    help="Only show recipes whose payload differs from Turso")
    ap.add_argument("--force-locked", action="store_true",
                    help="(Reserved) Currently a no-op; locked=2 are always overwritten "
                         "in Phase 6 per docs/v3.md \u00a714a cutover decision.")
    args = ap.parse_args()

    recipes = load_recipes()
    ings = load_ingredients()
    ledger = load_ledger()
    instrs = load_instructions()
    sections_map = load_sections()

    target_ids = sorted(args.recipe_id) if args.recipe_id else sorted(recipes)
    missing = [r for r in target_ids if r not in recipes]
    if missing:
        sys.exit(f"Unknown recipe_id(s): {missing}")

    conn = _connect()
    log_entries: list[dict] = []
    now_utc = datetime.now(timezone.utc).isoformat()
    written = 0
    diffs = 0

    for rid in target_ids:
        try:
            payload = _build_payload(rid, recipes, ings, ledger, instrs, sections_map)
        except FileNotFoundError as e:
            print(f"  {rid}  SKIP: {e}", file=sys.stderr)
            continue

        diff = _diff_payload(conn, payload)
        if diff is None:
            print(f"  {rid}  SKIP: no row in dev_recipes (Phase 6 expects pre-existing rows)")
            continue
        if not diff:
            if not args.diff_only:
                print(f"  {rid}  unchanged")
            log_entries.append({"recipe_id": rid, "status": "unchanged"})
            continue

        diffs += 1
        # Compact diff print
        cols_changed = sorted(diff.keys())
        print(f"  {rid}  changed cols: {', '.join(cols_changed)}")
        for col in cols_changed:
            d = diff[col]
            if "old" in d:
                print(f"      {col}: {d['old']!r} -> {d['new']!r}")
            else:
                print(f"      {col}: len {d['old_len']} -> {d['new_len']}")

        if args.commit:
            conn.execute(_UPDATE_SQL, (
                payload["recipe_name"],
                payload["servings_count"],
                payload["grams_per_serving"],
                payload["recipe_ingredients_json"],
                payload["recipe_instructions_json"],
                payload["nutrition_json"],
                payload["nutrient_version"],
                payload["retention_model_version"],
                payload["source_match_version"],
                payload["source_ndb_no"],
                payload["sections_json"],
                payload["cook_minutes"],
                payload["cook_temp_f"],
                payload["cooking_method"],
                now_utc,
                payload["recipe_id"],
            ))
            written += 1
            log_entries.append({
                "recipe_id": rid, "status": "written",
                "cols_changed": cols_changed,
            })
        else:
            log_entries.append({
                "recipe_id": rid, "status": "dry-run",
                "cols_changed": cols_changed,
            })

    if args.commit:
        conn.commit()
        print(f"\nCOMMIT: wrote {written} recipe(s) to Turso")
    else:
        print(f"\nDRY-RUN: {diffs} recipe(s) would change. Re-run with --commit to write.")

    LOG_DIR.mkdir(parents=True, exist_ok=True)
    log_path = LOG_DIR / f"{int(time.time())}-{'commit' if args.commit else 'dryrun'}.json"
    log_path.write_text(json.dumps({
        "timestamp_utc": now_utc,
        "mode": "commit" if args.commit else "dry-run",
        "recipes": target_ids,
        "entries": log_entries,
    }, indent=2))
    print(f"Audit log: {log_path}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
