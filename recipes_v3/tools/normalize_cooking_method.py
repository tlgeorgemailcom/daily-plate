"""
normalize_cooking_method.py
───────────────────────────
One-time migration: update every dev_recipes row whose cooking_method is stored
in pipeline format ('baked', 'pan grilled', 'boiled', …) to the UI format that
RecipeForm.svelte expects ('Bake', 'Pan grill', 'Boil', …).

Only SWEET recipes were ever saved through /moderate, which wrote the UI value
back. Every other recipe category still has the raw CSV pipeline value.

Usage:
    python recipes_v3/tools/normalize_cooking_method.py          # dry-run
    python recipes_v3/tools/normalize_cooking_method.py --commit  # write
"""
import argparse
import os
import sys
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parent.parent.parent
ENV_FILE = REPO_ROOT / ".env.local"


# ── Pipeline → UI mapping (must match normalizeCookingMethod in /moderate) ───
_MAP = {
    "baked":          "Bake",
    "baked covered":  "Bake (covered)",
    "bake covered":   "Bake (covered)",
    "boiled":         "Boil",
    "boiled covered": "Boil (covered)",
    "simmer":         "Simmer",
    "sub-simmer":     "Sub-simmer",
    "braise":         "Braise",
    "steamed":        "Steam",
    "microwave":      "Microwave",
    "pan grilled":    "Pan grill",
    "grilled":        "Grill",
    "broiled":        "Broil",
    "fried":          "Fry",
    "deep-fried":     "Deep-fry",
    "deep fry":       "Deep-fry",
    "stir-fried":     "Stir-fry",
    "stir fry":       "Stir-fry",
    "raw":            "No heat",
}

# Overrides for recipes with 'multi' (legacy composite value) — per-recipe decisions:
#   BKFST_002 (Biscuits & Gravy): baked biscuits are the primary component → Bake
#   BKFST_012 (Sausage Gravy): stovetop only → Boil
#   ENTR_124 (Vegetarian Cheese Enchiladas): oven-finished → Bake
#   ENTR_125 (Vegetarian Cheese Lasagna): oven-finished → Bake
_RECIPE_OVERRIDES = {
    "BKFST_002": "Bake",
    "BKFST_012": "Boil",
    "ENTR_124":  "Bake",
    "ENTR_125":  "Bake",
}

# UI-format values that are already correct — never touch these
_ALREADY_OK = {"Bake", "Bake (covered)", "Boil", "Boil (covered)", "Simmer", "Sub-simmer",
               "Braise", "Steam", "Microwave", "Sauté", "Stir-fry", "Pan sear", "Pan grill",
               "Grill", "Broil", "Fry", "Deep-fry", "No heat"}


def normalize(raw: str | None, recipe_id: str = "") -> str | None:
    if raw is None:
        return None
    if recipe_id in _RECIPE_OVERRIDES:
        return _RECIPE_OVERRIDES[recipe_id]
    if raw in _ALREADY_OK:
        return raw          # already correct
    mapped = _MAP.get(raw.lower())
    return mapped if mapped else raw   # unknown values pass through unchanged


def _load_env(path: Path) -> dict:
    env: dict = {}
    if path.exists():
        for line in path.read_text().splitlines():
            line = line.strip()
            if line and not line.startswith("#") and "=" in line:
                k, _, v = line.partition("=")
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


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--commit", action="store_true",
                        help="Write changes to Turso (default: dry-run)")
    args = parser.parse_args()

    conn = _connect()
    rows = conn.execute(
        "SELECT recipe_id, cooking_method FROM dev_recipes ORDER BY recipe_id"
    ).fetchall()

    updates: list[tuple[str, str]] = []   # (new_value, recipe_id)
    unchanged: list[tuple[str, str]] = []
    skipped: list[tuple[str, str]] = []

    for recipe_id, current in rows:
        new = normalize(current, recipe_id)
        if new is None or new == current:
            unchanged.append((recipe_id, current or "(null)"))
        elif new != current:
            updates.append((new, recipe_id))
            print(f"  {'UPDATE' if args.commit else 'would update'}  {recipe_id}: {current!r} → {new!r}")
        else:
            skipped.append((recipe_id, current))

    print(f"\n{len(updates)} rows need updating, {len(unchanged)} already correct.")

    if not updates:
        print("Nothing to do.")
        return

    if args.commit:
        for new_val, rid in updates:
            conn.execute(
                "UPDATE dev_recipes SET cooking_method = ? WHERE recipe_id = ?",
                (new_val, rid),
            )
        conn.commit()
        print(f"✅ {len(updates)} rows updated in Turso.")
    else:
        print("(dry-run — pass --commit to write)")


if __name__ == "__main__":
    main()
