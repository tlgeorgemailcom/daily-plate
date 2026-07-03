"""First-time INSERT for recipes not yet in dev_recipes.

Usage:
    python tools/insert_new.py                  # dry-run
    python tools/insert_new.py --commit         # actually insert
    python tools/insert_new.py --recipe-id CRUST_001 --commit
"""
from __future__ import annotations

import argparse
import json
import os
import sys
from datetime import datetime, timezone
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
REPO_ROOT = ROOT.parent
sys.path.insert(0, str(ROOT))

from lib.build import to_turso_nutrition_json  # noqa: E402
from lib.load import load_ingredients, load_instructions, load_ledger, load_recipes  # noqa: E402

BUILDS_DIR = ROOT / "output" / "builds"
ENV_FILE = REPO_ROOT / ".env.local"
DATA_DIR = ROOT / "data"


def _load_env(path: Path) -> dict[str, str]:
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


_CATEGORY_MAP = {
    "sweets & desserts": "sweets-desserts",
    "sweets-desserts": "sweets-desserts",
    "entrees & main courses": "entrees-main-courses",
    "entrees-main-courses": "entrees-main-courses",
    "breakfast": "breakfast",
    "breakfast & brunch": "breakfast",
    "breakfast-brunch": "breakfast",
    "soups & stews": "soups-stews",
    "soups-stews": "soups-stews",
    "salads": "salads",
    "sides": "sides",
    "snacks & appetizers": "snacks-appetizers",
    "snacks-appetizers": "snacks-appetizers",
    "beverages": "beverages",
    "cocktails": "cocktails",
    "cocktail": "cocktails",
    "alcoholic beverages": "cocktails",
    "alcoholic-beverages": "cocktails",
    "sauces & condiments": "sauces-condiments",
    "sauces-condiments": "sauces-condiments",
    "sandwiches & burgers": "sandwiches-burgers",
    "sandwiches-burgers": "sandwiches-burgers",
    "pasta & pizza": "pasta-pizza",
    "pasta-pizza": "pasta-pizza",
}


def _stored_category(raw: str) -> str:
    return _CATEGORY_MAP.get(raw.strip().lower(), "entrees-main-courses")


_COOK_METHOD_MAP = {
    "baked":       "Bake",
    "boiled":      "Boil",
    "simmer":      "Simmer",
    "sub-simmer":  "Sub-simmer",
    "braise":      "Braise",
    "pan grilled": "Pan grill",
    "grilled":     "Grill",
    "fried":       "Fry",
    "raw":         "No heat",
    "steamed":     "No heat",
    "microwave":   "No heat",
}


def _normalize_cook_method(raw: str | None) -> str | None:
    if not raw:
        return None
    return _COOK_METHOD_MAP.get(raw.lower(), raw) or None


def _load_extra_recipe_fields() -> dict[str, dict]:
    """Read dietary_category and prep_time from recipes.csv (not in Recipe dataclass)."""
    import csv
    extras: dict[str, dict] = {}
    with open(DATA_DIR / "recipes.csv", newline="", encoding="utf-8") as f:
        reader = csv.DictReader(f)
        for row in reader:
            rid = row.get("recipe_id", "").strip()
            if rid:
                extras[rid] = {
                    "dietary_category": row.get("dietary_category", "").strip() or None,
                    "prep_time": row.get("prep_time", "").strip() or None,
                }
    return extras


def _parse_serving_label(servings_text: str) -> str:
    """Extract the label part after the leading count digit."""
    import re
    m = re.match(r"^(\d+(?:\.\d+)?)\s*(.*)$", servings_text.strip())
    if m:
        return m.group(2).strip() or "serving"
    return servings_text.strip()


_INSERT_SQL = """\
INSERT INTO dev_recipes (
  recipe_id, food_word, recipe_name, category, dietary_category,
  cooking_method, dish_family, prep_time, servings,
  servings_count, serving_label,
  recipe, animal_spawns, recipe_instructions_json, recipe_ingredients_json,
  image_url, submitted_by, status, created_at, updated_at,
  grams_per_serving, nutrition_json, nutrient_version,
  retention_model_version, source_match_version,
  source_ndb_no, locked
) VALUES (
  ?, ?, ?, ?, ?,
  ?, ?, ?, ?,
  ?, ?,
  ?, ?, ?, ?,
  ?, ?, 'published', ?, ?,
  ?, ?, ?,
  ?, ?,
  ?, ?
)
"""


def _build_payload(rid, recipes, ings, ledger, instrs, extras):
    build_path = BUILDS_DIR / f"{rid}.json"
    if not build_path.exists():
        raise FileNotFoundError(f"No build for {rid}; run build_all.py first")
    build = json.loads(build_path.read_text())
    rec = recipes[rid]
    ex = extras.get(rid, {})
    nutrition_json = to_turso_nutrition_json(build)

    ri_rows = ings.get(rid, [])
    recipe_ingredients = []
    for r in ri_rows:
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

    recipe_instructions = json.dumps(instrs.get(rid, []), separators=(",", ":"))
    servings_text = rec.servings_label or "1 serving"

    return {
        "recipe_id": rid,
        "food_word": rec.food_word,
        "recipe_name": rec.recipe_name,
        "category": _stored_category(rec.category or ""),
        "dietary_category": ex.get("dietary_category"),
        "cooking_method": _normalize_cook_method(rec.cooking_method),
        "dish_family": None,
        "prep_time": ex.get("prep_time"),
        "servings": servings_text,
        "servings_count": float(rec.servings_count),
        "serving_label": _parse_serving_label(servings_text),
        "recipe": None,
        "animal_spawns": None,
        "recipe_instructions_json": recipe_instructions,
        "recipe_ingredients_json": json.dumps(recipe_ingredients, separators=(",", ":")),
        "image_url": None,
        "submitted_by": "v3-build",
        # status is hardcoded in SQL as 'published'
        "grams_per_serving": float(build["grams_per_serving"]),
        "nutrition_json": json.dumps(nutrition_json, separators=(",", ":")),
        "nutrient_version": "v3",
        "retention_model_version": "v3-r6",
        "source_match_version": "v3-greenfield",
        "source_ndb_no": rec.canonical_ndb_no or "",
        "locked": 2,
    }


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--commit", action="store_true", help="Actually write to Turso")
    ap.add_argument("--recipe-id", action="append", default=[])
    args = ap.parse_args()

    recipes = load_recipes()
    ings = load_ingredients()
    ledger = load_ledger()
    instrs = load_instructions()
    extras = _load_extra_recipe_fields()

    target_ids = sorted(args.recipe_id) if args.recipe_id else sorted(recipes)

    conn = _connect()
    now_utc = datetime.now(timezone.utc).isoformat()
    inserted = 0

    for rid in target_ids:
        # Check if row already exists — skip if so
        row = conn.execute(
            "SELECT 1 FROM dev_recipes WHERE recipe_id = ?", (rid,)
        ).fetchone()
        if row is not None:
            print(f"  {rid}  SKIP: already exists in dev_recipes")
            continue

        try:
            p = _build_payload(rid, recipes, ings, ledger, instrs, extras)
        except FileNotFoundError as e:
            print(f"  {rid}  SKIP: {e}", file=sys.stderr)
            continue

        args_tuple = (
            p["recipe_id"], p["food_word"], p["recipe_name"],
            p["category"], p["dietary_category"],
            p["cooking_method"], p["dish_family"], p["prep_time"], p["servings"],
            p["servings_count"], p["serving_label"],
            p["recipe"], p["animal_spawns"],
            p["recipe_instructions_json"], p["recipe_ingredients_json"],
            p["image_url"], p["submitted_by"],
            now_utc, now_utc,
            p["grams_per_serving"], p["nutrition_json"],
            p["nutrient_version"], p["retention_model_version"], p["source_match_version"],
            p["source_ndb_no"], p["locked"],
        )

        print(f"  {rid}  INSERT  gps={p['grams_per_serving']}g  "
              f"servings={p['servings_count']}  category={p['category']}  locked={p['locked']}")

        if args.commit:
            conn.execute(_INSERT_SQL, args_tuple)
            inserted += 1

    if args.commit:
        conn.commit()
        print(f"\nCOMMIT: inserted {inserted} recipe(s) to Turso")
    else:
        print("\n(dry-run — pass --commit to write)")

    return 0


if __name__ == "__main__":
    sys.exit(main())
