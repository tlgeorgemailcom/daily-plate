"""
preview_ingredients.py — Render the exact ingredient list a recipe will display in the UI.

Replicates RecipeBook.svelte::formatIngredientLine exactly, including the singular-unit
match and the deduplication guard, so what you see here is what the user sees in the app.

Usage:
    python recipes_v3/tools/preview_ingredients.py --recipe ENTR_103
    python recipes_v3/tools/preview_ingredients.py --recipe ENTR_103 --raw

Options:
    --recipe RECIPE_ID   Required. The recipe to preview.
    --raw                Also show qty_display and display_name columns for debugging.
    --all                Preview all recipes (for bulk QA).
"""

import argparse
import csv
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
DATA = ROOT / "recipes_v3" / "data"


# ── Replicates RecipeBook.svelte::formatIngredientLine exactly ────────────────

def format_ingredient_line(quantity: str, name: str) -> str:
    """
    Mirrors the TypeScript implementation:

      1. No quantity → return name
      2. quantity == "1 <unit>" and last word of name == unit → return "1 <name>"
      3. quantity (lowercase) contains name (lowercase) → return quantity  (dedup guard)
      4. Default → return "quantity name"
    """
    quantity = (quantity or "").strip()
    name = (name or "").strip()

    if not quantity:
        return name

    # Rule 2: singular unit match  ("1 sprig" + "thyme sprig" → "1 thyme sprig")
    import re
    m = re.match(r"^1\s+(\S+)$", quantity, re.IGNORECASE)
    if m:
        unit = m.group(1).lower()
        name_words = name.split()
        last_word = name_words[-1].lower() if name_words else ""
        if last_word == unit:
            return f"1 {name}"

    # Rule 3: dedup guard
    if name.lower() in quantity.lower():
        return quantity

    # Rule 4: default
    return f"{quantity} {name}"


# ── Load data ─────────────────────────────────────────────────────────────────

def load_ledger() -> dict:
    """ingredient_key → {default_display_name, food_word}"""
    ledger = {}
    with open(DATA / "ingredients_ledger.csv", newline="") as f:
        for r in csv.DictReader(f):
            ledger[r["ingredient_key"]] = r
    return ledger


def load_sections() -> dict:
    """(recipe_id, section_key) → section_label"""
    sections = {}
    with open(DATA / "recipe_sections.csv", newline="") as f:
        for r in csv.DictReader(f):
            sections[(r["recipe_id"], r["section_key"])] = r.get("section_label", r["section_key"])
    return sections


def load_recipes() -> dict:
    """recipe_id → recipe_name"""
    recipes = {}
    with open(DATA / "recipes.csv", newline="") as f:
        for r in csv.DictReader(f):
            recipes[r["recipe_id"]] = r.get("recipe_name", r["recipe_id"])
    return recipes


def load_ingredients(recipe_id: str) -> list:
    rows = []
    with open(DATA / "recipe_ingredients.csv", newline="") as f:
        for r in csv.DictReader(f):
            if r["recipe_id"] == recipe_id:
                rows.append(r)
    def _row_order_key(r):
        try:
            return int(r.get("row_order") or 0)
        except ValueError:
            return 0
    rows.sort(key=_row_order_key)
    return rows


# ── Rendering ─────────────────────────────────────────────────────────────────

def render_recipe(recipe_id: str, show_raw: bool, ledger: dict, sections: dict, recipes: dict):
    name = recipes.get(recipe_id, recipe_id)
    rows = load_ingredients(recipe_id)

    if not rows:
        print(f"  [no ingredient rows found for {recipe_id}]")
        return

    # Group by section (preserving first-seen order)
    seen_sections = []
    by_section: dict[str, list] = {}
    for r in rows:
        sec = r.get("section") or ""
        if sec not in by_section:
            seen_sections.append(sec)
            by_section[sec] = []
        by_section[sec].append(r)

    print(f"\n{'═' * 60}")
    print(f"  {recipe_id}  {name}")
    print(f"{'═' * 60}")

    warnings = []

    for sec_key in seen_sections:
        sec_label = sections.get((recipe_id, sec_key), sec_key)
        print(f"\n  ── {sec_label}: ──")

        for r in by_section[sec_key]:
            key = r["ingredient_key"]
            qty = r.get("qty_display", "")
            override = (r.get("display_name_override") or "").strip()

            # Resolve display name (same logic as upload.py / insert_new.py)
            ledger_entry = ledger.get(key, {})
            default_name = ledger_entry.get("default_display_name", key)
            display_name = override if override else default_name

            rendered = format_ingredient_line(qty, display_name)

            # Warn if the rendered line contains the name twice
            dn_lower = display_name.lower()
            rendered_lower = rendered.lower()
            # Count how many times the display name appears in the rendered output
            count = rendered_lower.count(dn_lower)
            # Also check for partial-word doubling (e.g. "thyme" appearing in "thyme leaves thyme leaves")
            has_double = count >= 2

            if show_raw:
                print(f"  - {rendered}")
                print(f"      qty_display    : {repr(qty)}")
                print(f"      display_name   : {repr(display_name)}")
                if override:
                    print(f"      override active: {repr(override)}")
                if has_double:
                    print(f"      ⚠️  POSSIBLE DOUBLING DETECTED")
            else:
                flag = "  ⚠️  POSSIBLE DOUBLING" if has_double else ""
                print(f"  - {rendered}{flag}")

            if has_double:
                warnings.append((recipe_id, key, rendered, qty, display_name))

    if warnings:
        print(f"\n  {'─' * 56}")
        print(f"  ⚠️  DOUBLING WARNINGS — fix qty_display or display_name_override before upload:")
        for _, k, rend, q, dn in warnings:
            print(f"     ingredient_key : {k}")
            print(f"     qty_display    : {repr(q)}")
            print(f"     display_name   : {repr(dn)}")
            print(f"     rendered       : {repr(rend)}")
    else:
        print(f"\n  ✓ No doubling detected.")

    return warnings


# ── Entry point ───────────────────────────────────────────────────────────────

def main():
    parser = argparse.ArgumentParser(description="Preview rendered ingredient lines for a recipe.")
    parser.add_argument("--recipe", metavar="RECIPE_ID", help="Recipe ID to preview (e.g. ENTR_103)")
    parser.add_argument("--raw", action="store_true", help="Show qty_display and display_name columns")
    parser.add_argument("--all", dest="all_recipes", action="store_true", help="Preview all recipes")
    args = parser.parse_args()

    if not args.recipe and not args.all_recipes:
        parser.print_help()
        sys.exit(1)

    ledger = load_ledger()
    sections = load_sections()
    recipes = load_recipes()

    total_warnings = []

    if args.all_recipes:
        for recipe_id in sorted(recipes.keys()):
            w = render_recipe(recipe_id, args.raw, ledger, sections, recipes)
            if w:
                total_warnings.extend(w)
    else:
        recipe_id = args.recipe.upper()
        if recipe_id not in recipes:
            print(f"Error: {recipe_id} not found in recipes.csv", file=sys.stderr)
            sys.exit(1)
        render_recipe(recipe_id, args.raw, ledger, sections, recipes)

    if args.all_recipes and total_warnings:
        print(f"\n\n{'═' * 60}")
        print(f"  SUMMARY: {len(total_warnings)} doubling warning(s) across all recipes")
        print(f"{'═' * 60}")
        for recipe_id, key, rend, q, dn in total_warnings:
            print(f"  {recipe_id}  {key}")
            print(f"    rendered: {repr(rend)}")
    elif args.all_recipes:
        print(f"\n  ✓ All recipes: no doubling detected.")


if __name__ == "__main__":
    main()
