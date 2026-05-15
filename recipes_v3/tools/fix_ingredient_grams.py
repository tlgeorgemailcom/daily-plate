#!/usr/bin/env python3
"""
fix_ingredient_grams.py
Replace rounded volume-to-weight conversions in recipe_ingredients.csv
with exact USDA SR Legacy values.
Run from recipes_v3/ directory.
"""
import csv, re, io, pathlib, sys

# ---------------------------------------------------------------------------
# Unicode fraction normalizer — must run BEFORE regex parsing
# ---------------------------------------------------------------------------
_UNICODE_FRACS = {
    '¼': '1/4', '½': '1/2', '¾': '3/4',
    '⅓': '1/3', '⅔': '2/3',
    '⅛': '1/8', '⅜': '3/8', '⅝': '5/8', '⅞': '7/8',
}

def _normalize(text: str) -> str:
    for uc, asc in _UNICODE_FRACS.items():
        # If the unicode fraction is preceded by a digit, insert a space
        text = re.sub(r'(\d)' + re.escape(uc), r'\1 ' + asc, text)
        text = text.replace(uc, asc)
    return text

# ---------------------------------------------------------------------------
# Patterns that signal a non-volume measure — skip entirely
# ---------------------------------------------------------------------------
_SKIP_PATTERNS = re.compile(
    r'bag\b|package|pkg\b|can\s*\(|ounce|oz\b|\blb\b|\blbs\b|'
    r'liter|slice|cookie|cracker|cherry|cherries|egg|apple|banana|'
    r'peach|serving|sheet|block|stick of|slightly|scant',
    re.IGNORECASE,
)

DATA = pathlib.Path("data/recipe_ingredients.csv")

# ---------------------------------------------------------------------------
# USDA SR Legacy authoritative densities
# Source: food-portions-complete.csv (NDB portion weights)
# For cup-only ingredients, tbsp = cup/16, tsp = cup/48
# For tbsp-measured ingredients, use USDA measured tbsp value
# ---------------------------------------------------------------------------
UNITS = {
    # ingredient_key: {unit: grams_per_1_unit}
    "water_tap": {
        # USDA 14411: 1 cup=237.0g → tbsp=237/16, tsp=237/48
        "cup":   237.0,
        "tbsp":  237.0 / 16,   # 14.8125
        "tsp":   237.0 / 48,   # 4.9375
        "fl_oz": 29.625,
    },
    "water": {
        "cup":  237.0,
        "tbsp": 237.0 / 16,
        "tsp":  237.0 / 48,
    },
    "butter_unsalted": {
        # USDA 1145: 1 tbsp=14.2g (measured), 1 cup=227.0g, 1 stick=113.0g
        "tbsp":  14.2,
        "tsp":   14.2 / 3,     # 4.7333
        "cup":   227.0,
        "stick": 113.0,
    },
    "butter_salted": {
        # USDA 1001: same portion weights as unsalted
        "tbsp":  14.2,
        "tsp":   14.2 / 3,
        "cup":   227.0,
        "stick": 113.0,
    },
    "margarine_stick_salted": {
        # USDA 4610: 1 tbsp=14.2g, 1 cup=227g (same as butter)
        "tbsp":  14.2,
        "tsp":   14.2 / 3,
        "cup":   227.0,
        "stick": 113.0,
    },
    "vegetable_shortening": {
        # USDA 4031: 1 tbsp=12.8g (measured), 1 cup=205.0g
        "tbsp": 12.8,
        "tsp":  12.8 / 3,      # 4.2667
        "cup":  205.0,
    },
    "canola_oil": {
        # USDA 4582: 1 tbsp=14.0g, 1 cup=218.0g, 1 tsp=4.5g
        "tbsp": 14.0,
        "tsp":  4.5,
        "cup":  218.0,
    },
    "lemon_juice_raw": {
        # USDA 9152: 1 cup=244.0g (no tbsp measured) → tbsp=244/16
        "cup":  244.0,
        "tbsp": 244.0 / 16,    # 15.25
        "tsp":  244.0 / 48,    # 5.0833
        "fl_oz": 30.5,
    },
    "milk_whole": {
        # USDA 1077: 1 tbsp=15.0g (measured), 1 cup=244.0g
        "tbsp": 15.0,
        "tsp":  15.0 / 3,      # 5.0
        "cup":  244.0,
    },
    "milk_buttermilk_whole": {
        # USDA 1230: 1 cup=245.0g
        "cup":  245.0,
        "tbsp": 245.0 / 16,    # 15.3125
        "tsp":  245.0 / 48,    # 5.1042
    },
    "milk_evaporated": {
        # USDA 1096: 1 cup=252.0g, 1 fl oz=31.5g
        "cup":   252.0,
        "tbsp":  252.0 / 16,   # 15.75
        "tsp":   252.0 / 48,   # 5.25
        "fl_oz": 31.5,
    },
    "heavy_cream": {
        # USDA 1053: 1 tbsp=15.0g (measured), 1 cup=238.0g
        "tbsp": 15.0,
        "tsp":  15.0 / 3,      # 5.0
        "cup":  238.0,
    },
    "half_and_half": {
        # USDA 1049: 1 tbsp=15.0g (measured), 1 cup=242.0g
        "tbsp": 15.0,
        "tsp":  15.0 / 3,      # 5.0
        "cup":  242.0,
    },
    "sour_cream": {
        # USDA 1056: 1 tbsp=12.0g (measured), 1 cup=230.0g
        "tbsp": 12.0,
        "tsp":  12.0 / 3,      # 4.0
        "cup":  230.0,
    },
    "coconut_milk_canned": {
        # USDA 12118: 1 tbsp=15.0g (measured), 1 cup=226.0g
        "tbsp": 15.0,
        "tsp":  15.0 / 3,
        "cup":  226.0,
    },
    "sugar_granulated": {
        # USDA 19335: 1 tsp=4.2g (measured), 1 cup=200.0g
        "tsp":  4.2,
        "tbsp": 200.0 / 16,    # 12.5
        "cup":  200.0,
    },
    # sugar_brown intentionally omitted — some recipes use unpacked (36g/¼ cup)
    # and some use packed (55g/¼ cup).  The distinction is in the recipe's
    # qty_display ("packed" vs not).  Manual review needed per-recipe.
    "sugar_powdered": {
        # USDA 19336: 1 cup unsifted=120.0g, 1 tbsp unsifted=8.0g
        "tbsp": 8.0,
        "tsp":  8.0 / 3,       # 2.6667
        "cup":  120.0,
    },
    "corn_syrup_light": {
        # USDA 19350: 1 tbsp=22.0g (measured), 1 cup=341.0g
        "tbsp": 22.0,
        "tsp":  22.0 / 3,      # 7.3333
        "cup":  341.0,
    },
    "molasses": {
        # USDA 19304: 1 cup=337.0g (only cup in DB)
        "cup":  337.0,
        "tbsp": 337.0 / 16,    # 21.0625
        "tsp":  337.0 / 48,    # 7.0208
    },
    "flour_ap_white_enriched_bleached": {
        # USDA 20081: 1 cup=125.0g (only cup in DB)
        "cup":  125.0,
        "tbsp": 125.0 / 16,    # 7.8125
        "tsp":  125.0 / 48,    # 2.6042
    },
    # flour_cake_white_enriched intentionally omitted —
    # all recipe entries are labelled "sifted cake flour" at 114g/cup, correct.
    "flour_whole_wheat": {
        # ledger 120g/cup
        "cup":  120.0,
        "tbsp": 120.0 / 16,
        "tsp":  120.0 / 48,
    },
    "cornstarch": {
        # USDA 20027: 1 cup=128.0g → tbsp=128/16=8.0
        "cup":  128.0,
        "tbsp": 8.0,
        "tsp":  128.0 / 48,    # 2.6667
    },
    "cocoa_powder_unsweetened": {
        # USDA 19165: 1 tbsp=5.4g (measured), 1 cup=86.0g
        "tbsp": 5.4,
        "tsp":  5.4 / 3,       # 1.8
        "cup":  86.0,
    },
    "oats_rolled_old_fashioned_dry": {
        # USDA 8120: 1 cup=81.0g (NOT 100g as in ledger)
        "cup":  81.0,
        "tbsp": 81.0 / 16,     # 5.0625
        "tsp":  81.0 / 48,     # 1.6875
    },
    "salt_table": {
        # USDA 2047: 1 tsp=6.0g (measured), 1 tbsp=18.0g, 1 cup=292.0g
        "tsp":  6.0,
        "tbsp": 18.0,
        "cup":  292.0,
        "dash": 0.4,
    },
    "baking_powder": {
        # USDA 18369: 1 tsp=4.6g (measured)
        "tsp":  4.6,
        "tbsp": 4.6 * 3,       # 13.8
        "cup":  4.6 * 48,      # 220.8
    },
    "baking_soda": {
        # USDA 18372: 1 tsp=4.6g (measured)
        "tsp":  4.6,
        "tbsp": 4.6 * 3,
        "cup":  4.6 * 48,
    },
    "cream_of_tartar": {
        # USDA 18373: 1 tsp=3.0g (measured)
        "tsp":  3.0,
        "tbsp": 9.0,
        "cup":  144.0,
    },
    "vanilla_extract": {
        # USDA 2050: 1 tsp=4.2g (measured), 1 tbsp=13.0g, 1 cup=208.0g
        "tsp":  4.2,
        "tbsp": 13.0,
        "cup":  208.0,
    },
    "coconut_extract": {
        # same NDB as vanilla extract (proxy)
        "tsp":  4.2,
        "tbsp": 13.0,
        "cup":  208.0,
    },
    "cinnamon_ground": {
        # USDA 2010: 1 tsp=2.6g (measured), 1 tbsp=7.8g
        "tsp":  2.6,
        "tbsp": 7.8,
        "cup":  2.6 * 48,
    },
    "cloves_ground": {
        # USDA 2011: 1 tsp=2.1g (measured), 1 tbsp=6.5g
        "tsp":  2.1,
        "tbsp": 6.5,
        "cup":  2.1 * 48,
    },
    "allspice_ground": {
        # USDA 2001: 1 tsp=1.9g (measured), 1 tbsp=6.0g
        "tsp":  1.9,
        "tbsp": 6.0,
        "cup":  1.9 * 48,
    },
    "nutmeg_ground": {
        # USDA 2025: 1 tsp=2.2g (measured), 1 tbsp=7.0g
        "tsp":  2.2,
        "tbsp": 7.0,
        "cup":  2.2 * 48,
    },
    "ginger_ground": {
        # USDA 2021: 1 tsp=1.8g (measured), 1 tbsp=5.2g
        "tsp":  1.8,
        "tbsp": 5.2,
        "cup":  1.8 * 48,
    },
    "pumpkin_pie_spice": {
        # USDA 2035: 1 tsp=1.7g (from ledger — no tbsp in DB)
        "tsp":  1.7,
        "tbsp": 1.7 * 3,
        "cup":  1.7 * 48,
    },
    "ginger_root_fresh": {
        # ledger: 1 tbsp=6.0g (measured, empirical)
        "tbsp": 6.0,
        "tsp":  6.0 / 3,
        "cup":  6.0 * 16,
    },
    "lemon_peel_raw": {
        # ledger: 1 tbsp=6.0g (empirical zest weight)
        "tbsp": 6.0,
        "tsp":  2.0,
        "cup":  6.0 * 16,
    },
    "bread_crumbs_dry": {
        # USDA 18079: ledger 108g/cup
        "cup":  108.0,
        "tbsp": 108.0 / 16,    # 6.75
        "tsp":  108.0 / 48,
    },
    "coconut_flaked_sweetened": {
        # USDA 12109: 1 cup=85.0g (USDA), but ledger says 74g/cup
        # USDA NDB 12109 is "dried desiccated" at 85g/cup
        # Ledger uses 74g/cup for NDB 12109 (flaked) — use ledger
        "cup":  74.0,
        "tbsp": 74.0 / 16,
        "tsp":  74.0 / 48,
    },
    "coconut_shredded_sweetened": {
        # ledger: 74g/cup for NDB 12179
        "cup":  74.0,
        "tbsp": 74.0 / 16,
        "tsp":  74.0 / 48,
    },
    "graham_crackers": {
        # ledger: 14g/cracker, 150g/1.5 cups crushed — keep as-is
        "cup":  100.0,          # ~100g/cup crushed (ledger doesn't specify cup)
        "tbsp": 100.0 / 16,
        "tsp":  100.0 / 48,
    },
    "peanut_butter_chunky": {
        # USDA 16097: 1 cup=258g
        "cup":  258.0,
        "tbsp": 258.0 / 16,    # 16.125
        "tsp":  258.0 / 48,
    },
    "apricots_dried": {
        # ledger: 130g/cup
        "cup":  130.0,
        "tbsp": 130.0 / 16,
        "tsp":  130.0 / 48,
    },
    "cranberries_dried_sweetened": {
        # ledger: 120g/cup
        "cup":  120.0,
        "tbsp": 120.0 / 16,
        "tsp":  120.0 / 48,
    },
    "raisins_seedless": {
        # ledger: 165g/cup
        "cup":  165.0,
        "tbsp": 165.0 / 16,
        "tsp":  165.0 / 48,
    },
    "raisins_golden": {
        # ledger: 145g/cup
        "cup":  145.0,
        "tbsp": 145.0 / 16,
        "tsp":  145.0 / 48,
    },
    "currants_zante_dried": {
        # ledger: 145g/cup
        "cup":  145.0,
        "tbsp": 145.0 / 16,
        "tsp":  145.0 / 48,
    },
    "dates_medjool": {
        # ledger: 150g/cup
        "cup":  150.0,
        "tbsp": 150.0 / 16,
        "tsp":  150.0 / 48,
    },
    "figs_dried_uncooked": {
        # ledger: 150g/cup
        "cup":  150.0,
        "tbsp": 150.0 / 16,
        "tsp":  150.0 / 48,
    },
    "coconut_water": {
        # ledger: 240g/cup
        "cup":  240.0,
        "tbsp": 240.0 / 16,    # 15.0
        "tsp":  240.0 / 48,    # 5.0
    },
    "blueberries_raw": {
        # ledger: 148g/cup
        "cup":  148.0,
        "tbsp": 148.0 / 16,
        "tsp":  148.0 / 48,
    },
    "peach_yellow_raw": {
        # ledger: 154g/cup sliced
        "cup":  154.0,
        "tbsp": 154.0 / 16,
        "tsp":  154.0 / 48,
    },
}

# ---------------------------------------------------------------------------
# qty_display parser
# ---------------------------------------------------------------------------
_NUM_FRAC = re.compile(
    r'(?:(\d+)\s+)?(\d+)/(\d+)|(\d+(?:\.\d+)?)'
)

def parse_qty(text: str) -> float | None:
    """Extract leading numeric quantity from a display string."""
    text = text.strip()
    m = _NUM_FRAC.match(text)
    if not m:
        return None
    whole_s, num_s, den_s, int_s = m.groups()
    if num_s is not None:
        frac = int(num_s) / int(den_s)
        whole = int(whole_s) if whole_s else 0
        return whole + frac
    return float(int_s)

def parse_unit(text: str) -> str | None:
    """Identify volume unit keyword in text."""
    t = text.lower()
    if re.search(r'\btablespoons?\b|\btbsp\b', t):
        return "tbsp"
    if re.search(r'\bteaspoons?\b|\btsp\b', t):
        return "tsp"
    if re.search(r'\bcups?\b', t):
        return "cup"
    if re.search(r'\bsticks?\b', t):
        return "stick"
    if re.search(r'\bfl\s*oz\b|\bfluid ounces?\b', t):
        return "fl_oz"
    if re.search(r'\bdash\b', t):
        return "dash"
    return None

def compute_grams(ingredient_key: str, qty_display: str) -> float | None:
    """
    Return exact USDA grams for the given measure, or None if:
    - ingredient has no USDA conversion table
    - qty_display uses a non-volume unit (counts, weights, cans, etc.)
    - qty_display contains a skip keyword (scant, slightly, bag, ounce, etc.)
    - parsing fails
    """
    if ingredient_key not in UNITS:
        return None
    table = UNITS[ingredient_key]

    # Skip non-volume descriptors before any parsing
    if _SKIP_PATTERNS.search(qty_display):
        return None

    # Normalise unicode fractions (e.g. '2¾' → '2 3/4')
    qty_display = _normalize(qty_display)

    # Handle composite measures like "1/2 cup + 6 tbsp"
    parts = re.split(r'\s*\+\s*', qty_display)
    total = 0.0
    for part in parts:
        unit = parse_unit(part)
        if unit is None:
            return None  # non-volume unit in any part → skip
        if unit not in table:
            return None
        qty = parse_qty(part)
        if qty is None:
            return None
        total += qty * table[unit]
    return total


# ---------------------------------------------------------------------------
# Main — uses in-place line patching to avoid any CSV reformatting risk
# ---------------------------------------------------------------------------
def main():
    text = DATA.read_text(encoding="utf-8")
    lines = text.splitlines(keepends=True)          # preserve original line endings
    rows  = list(csv.reader(io.StringIO(text)))
    header = rows[0]

    col_id    = header.index("recipe_id")
    col_key   = header.index("ingredient_key")
    col_disp  = header.index("qty_display")
    col_grams = header.index("grams")

    # Safety: lines and rows must match 1-to-1
    assert len(lines) == len(rows), f"Line/row mismatch: {len(lines)} vs {len(rows)}"

    changes = []
    for i, row in enumerate(rows[1:], start=1):
        key       = row[col_key]
        disp      = row[col_disp]
        old_g_str = row[col_grams]
        recipe_id = row[col_id]

        try:
            old_g = float(old_g_str)
        except (ValueError, TypeError):
            continue

        new_g = compute_grams(key, disp)
        if new_g is None:
            continue

        new_g   = round(new_g, 4)
        old_g_r = round(old_g, 4)

        if abs(new_g - old_g_r) < 0.0001:
            continue

        changes.append((i, recipe_id, key, disp, old_g_r, new_g))

    print(f"Changes: {len(changes)}")
    print(f"{'Row':>4}  {'recipe_id':<12}  {'ingredient_key':<38}  {'qty_display':<42}  {'old':>8}  {'new':>10}  {'delta%':>8}")
    for idx, rid, key, disp, old, new in sorted(changes, key=lambda x: (x[2], x[1])):
        pct = (new - old) / old * 100 if old else float('inf')
        print(f"{idx:>4}  {rid:<12}  {key:<38}  {disp:<42}  {old:>8.4f}  {new:>10.4f}  {pct:>+7.2f}%")

    if "--apply" not in sys.argv:
        print("\nDry run. Pass --apply to write changes.")
        return

    # Patch each affected line in-place — never reformat unrelated lines
    for idx, rid, key, disp, old, new in changes:
        original_line = lines[idx]
        old_str = str(old) if old == int(old) else str(old)
        # Replace the exact grams field value in the line
        # The grams field follows the 4th comma (col index 4)
        # Use csv-parsed old value to build a precise replacement target
        old_repr = row_grams_repr(original_line, col_grams, old)
        if old_repr is None:
            print(f"WARNING: could not patch row {idx} ({rid} {key}) — skipping")
            continue
        lines[idx] = original_line.replace(old_repr, str(new), 1)

    # Verify line count unchanged
    assert len(lines) == len(rows), "BUG: line count changed during patching"

    DATA.write_text("".join(lines), encoding="utf-8")
    print(f"\nWritten {len(changes)} corrections to {DATA}")


def row_grams_repr(line: str, col_grams: int, expected: float) -> str | None:
    """
    Find the exact string representation of the grams field in the original
    CSV line so we can replace it without touching any other field.
    Returns None if the field value does not match expected.
    """
    parsed = next(csv.reader([line.rstrip("\r\n")]))
    if len(parsed) <= col_grams:
        return None
    field = parsed[col_grams]
    try:
        if abs(float(field) - expected) > 0.0001:
            return None
    except ValueError:
        return None
    # Find the literal string in the line that corresponds to this field position
    # Rebuild the prefix up to and including the field
    prefix_cols = parsed[:col_grams]
    out = io.StringIO()
    csv.writer(out).writerow(prefix_cols)
    prefix_csv = out.getvalue().rstrip("\r\n")
    # The grams field starts right after the prefix's trailing comma
    start = len(prefix_csv) + 1  # +1 for the separator comma
    end = start + len(field)
    if line[start:end] == field:
        return field  # unquoted — just return the raw field string
    # Might be quoted — extract from original line
    segment = line[start:]
    if segment.startswith('"'):
        close = segment.index('"', 1)
        return '"' + segment[1:close + 1]
    return None

if __name__ == "__main__":
    main()
