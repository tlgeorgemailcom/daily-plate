# Cocktail Aliases Fix — Pickup 2026-06-25

## The Problem

Every alias added in Group 6 and Group 7 (2026-06-24) is **wrong**.
A "ledger alias" = two ledger keys pointing to the same NDB. The recipe pipeline resolves correctly,
but when a **community user types the ingredient name into the recipe editor search box**, it queries
`DataCentralCombo.Long_Desc` — and if that word isn't in the Long_Desc, nothing is found.

Example: `palo_cortado` → NDB 14772, Long_Desc = "...sherry, Amontillado..." — user searches "palo cortado" → 0 results.

**Every ingredient that a recipe author or community user might look up needs its own NDB row
with a Long_Desc that contains the natural search term.**

---

## Affected Aliases — Need New NDBs

All were added 2026-06-24. The existing alias ledger rows can stay (they don't hurt), but each
needs a NEW NDB added to comboo.db + Turso, with a proper Long_Desc, and the ledger key
must be updated to point to the new NDB instead of the aliased one.

Next available NDB: **14783**

### Group A — Genuinely broken for search (Long_Desc doesn't contain the search term)

| New NDB | Ledger Key | Long_Desc | E | Alc | C | Su | W | FdGrp | Old alias NDB |
|---|---|---|---|---|---|---|---|---|---|
| 14783 | `raspberry_liqueur` | Alcoholic beverage, liqueur, raspberry, 34 proof | 205 | 12.4 | 29.5 | 29.5 | 57.6 | 1400 | was →14724 (chambord) |
| 14784 | `espadin_mezcal` | Alcoholic beverage, distilled, mezcal, espadin agave, 80 proof | 231 | 33.4 | 0 | 0 | 66.6 | 1400 | was →14742 (mezcal) |
| 14785 | `palo_cortado` | Alcoholic beverage, wine, sherry, palo cortado, dry, 40 proof | 138 | 15.8 | 5.5 | 3.5 | 78.7 | 1400 | was →14772 (amontillado) |
| 14786 | `martinique_molasses_rhum` | Alcoholic beverage, distilled, rhum, Martinique, molasses, 80 proof | 231 | 33.4 | 0 | 0 | 66.6 | 1400 | was →14748 (dark rum) |
| 14787 | `smirnoff_vodka` | Alcoholic beverage, vodka, Smirnoff, 80 proof | 231 | 33.4 | 0 | 0 | 66.6 | 1400 | was →14037 (generic 80-proof) |
| 14788 | `port_wine` | Alcoholic beverage, wine, port, tawny, red, 20 proof | 160 | 15.3 | 13.7 | 7.8 | 70.5 | 1400 | was →14057 (wine dessert sweet) |
| 14789 | `creme_de_cacao_brown` | Alcoholic beverage, liqueur, creme de cacao, brown, 50 proof | 286 | 18.4 | 39.3 | 39.3 | 41.8 | 1400 | was →14715 (creme de cacao white) |

### Group B — Technically searchable but still need own NDB per requirement

| New NDB | Ledger Key | Long_Desc | Old alias NDB | Note |
|---|---|---|---|---|
| 14790 | `maraschino` | Alcoholic beverage, liqueur, maraschino, Luxardo, cherry, 64 proof | 14702 | old Long_Desc had "maraschino cherry" |
| 14791 | `creme_de_mure` | Alcoholic beverage, liqueur, blackberry, creme de mure, 36 proof | 14713 | old Long_Desc had "creme de mure" |
| 14792 | `orgeat_syrup` | Beverage, syrup, orgeat, almond syrup, non-alcoholic | 14718 | old Long_Desc had "orgeat" |
| 14793 | `passion_fruit_liqueur` | Alcoholic beverage, liqueur, passoa, passion fruit, 34 proof | 14730 | old Long_Desc had "passion fruit" |
| 14794 | `red_wine` | Alcoholic beverage, wine, table, red, dry | 14096 | old Long_Desc had "wine, table, red" |

---

## Nutrition Values for New NDBs

### Group A (14783–14789) — full values:

```
14783 raspberry_liqueur:    E=205, EJ=858,  P=0,   F=0,   C=29.5, Fi=0, Su=29.5, Alc=12.4, W=57.6, Ash=0.5
14784 espadin_mezcal:       E=231, EJ=967,  P=0,   F=0,   C=0,    Fi=0, Su=0,    Alc=33.4, W=66.6, Ash=0
14785 palo_cortado:         E=138, EJ=577,  P=0.2, F=0,   C=5.5,  Fi=0, Su=3.5,  Alc=15.8, W=78.7, Ash=0.3
14786 martinique_molasses:  E=231, EJ=967,  P=0,   F=0,   C=0,    Fi=0, Su=0,    Alc=33.4, W=66.6, Ash=0
14787 smirnoff_vodka:       E=231, EJ=967,  P=0,   F=0,   C=0,    Fi=0, Su=0,    Alc=33.4, W=66.6, Ash=0
14788 port_wine:            E=160, EJ=669,  P=0.2, F=0,   C=13.7, Fi=0, Su=7.8,  Alc=15.3, W=70.5, Ash=0.3
14789 creme_de_cacao_brown: E=286, EJ=1197, P=0,   F=0.2, C=39.3, Fi=0, Su=39.3, Alc=18.4, W=41.8, Ash=0.3
```

### Group B (14790–14794) — copy nutrition verbatim from old alias NDB:

```python
# In the script, query the old alias NDB and copy all nutrient values:
14790 maraschino:          copy from NDB 14702
14791 creme_de_mure:       copy from NDB 14713
14792 orgeat_syrup:        copy from NDB 14718
14793 passion_fruit_liq:   copy from NDB 14730
14794 red_wine:            copy from NDB 14096
```

M-series for all alcoholic items: M1=1 fl oz (30g), M2=1.5 fl oz (45g), M3=2 fl oz (60g).
M-series for orgeat_syrup: M1=1 fl oz (30g), M2=2 fl oz (60g), M3=4 fl oz (120g).

---

## food_words for New NDBs (food-portions-complete.csv, all 3 copies)

| Ledger Key | New NDB | food_word | display |
|---|---|---|---|
| raspberry_liqueur | 14783 | RASPBERRYLIQUEUR | Raspberry Liqueur |
| espadin_mezcal | 14784 | ESPADINMEZCAL | Espadin Mezcal |
| palo_cortado | 14785 | PALOCORTADO | Palo Cortado Sherry |
| martinique_molasses_rhum | 14786 | MARTINIQUERHUM | Martinique Molasses Rhum |
| smirnoff_vodka | 14787 | VODKASMIRNOFF | Smirnoff Vodka |
| port_wine | 14788 | PORTWINE | Tawny Port Wine |
| creme_de_cacao_brown | 14789 | CREMEDECACAOBROWN | Crème de Cacao (Brown) |
| maraschino | 14790 | MARASCHINO | Maraschino Liqueur |
| creme_de_mure | 14791 | CREMEDMURE | Crème de Mûre |
| orgeat_syrup | 14792 | ORGEATYRUP | Orgeat Syrup |
| passion_fruit_liqueur | 14793 | PASSIONFRUITLEUR | Passion Fruit Liqueur |
| red_wine | 14794 | REDWINE | Red Wine |

---

## What the Script (add_group8.py) Must Do

1. **INSERT** 12 new NDB rows (14783–14794) into local `comboo.db`
2. **SYNC** to Turso SR28 (same libsql_experimental pattern as add_group*.py)
3. **UPDATE ledger** — for each affected key, change `ndb_no`, `food_word`, and `default_long_desc`
   - Read full CSV, update matching rows, rewrite entire file (do NOT just append)
4. **APPEND** 12 new rows to food-portions-complete.csv (all 3 copies)
5. **Run** `python3 scripts/dev/convert_to_ts.py`
6. **Run** `python3 recipes_v3/tools/validate_ledger.py`
7. **Commit** everything

### Ledger UPDATE pattern (Python):

```python
import csv

LEDGER = "recipes_v3/data/ingredients_ledger.csv"
UPDATES = {
    "raspberry_liqueur":        ("14783", "RASPBERRYLIQUEUR", "Alcoholic beverage, liqueur, raspberry, 34 proof"),
    "espadin_mezcal":           ("14784", "ESPADINMEZCAL",    "Alcoholic beverage, distilled, mezcal, espadin agave, 80 proof"),
    "palo_cortado":             ("14785", "PALOCORTADO",      "Alcoholic beverage, wine, sherry, palo cortado, dry, 40 proof"),
    "martinique_molasses_rhum": ("14786", "MARTINIQUERHUM",   "Alcoholic beverage, distilled, rhum, Martinique, molasses, 80 proof"),
    "smirnoff_vodka":           ("14787", "VODKASMIRNOFF",    "Alcoholic beverage, vodka, Smirnoff, 80 proof"),
    "port_wine":                ("14788", "PORTWINE",         "Alcoholic beverage, wine, port, tawny, red, 20 proof"),
    "creme_de_cacao_brown":     ("14789", "CREMEDECACAOBROWN","Alcoholic beverage, liqueur, creme de cacao, brown, 50 proof"),
    "maraschino":               ("14790", "MARASCHINO",       "Alcoholic beverage, liqueur, maraschino, Luxardo, cherry, 64 proof"),
    "creme_de_mure":            ("14791", "CREMEDMURE",       "Alcoholic beverage, liqueur, blackberry, creme de mure, 36 proof"),
    "orgeat_syrup":             ("14792", "ORGEATYRUP",       "Beverage, syrup, orgeat, almond syrup, non-alcoholic"),
    "passion_fruit_liqueur":    ("14793", "PASSIONFRUITLEUR", "Alcoholic beverage, liqueur, passoa, passion fruit, 34 proof"),
    "red_wine":                 ("14794", "REDWINE",          "Alcoholic beverage, wine, table, red, dry"),
}

with open(LEDGER) as f:
    rows = list(csv.DictReader(f))
    fieldnames = csv.DictReader(open(LEDGER)).fieldnames

for row in rows:
    if row["ingredient_key"] in UPDATES:
        ndb, fw, desc = UPDATES[row["ingredient_key"]]
        row["ndb_no"] = ndb
        row["food_word"] = fw
        row["default_long_desc"] = desc

with open(LEDGER, "w", newline="") as f:
    writer = csv.DictWriter(f, fieldnames=fieldnames)
    writer.writeheader()
    writer.writerows(rows)
```

---

## Commits Already Made (do NOT revert)

- `6a69e93` — Group 6: added alias NDBs for raspberry_liqueur, espadin_mezcal, palo_cortado, martinique_molasses_rhum
- `3219ee0` — Group 7: added alias NDBs for smirnoff_vodka, red_wine, port_wine, creme_de_cacao_brown, maraschino, creme_de_mure, orgeat_syrup, passion_fruit_liqueur

The new commit (Group 8) will fix the ledger pointers and add proper NDB rows.
The old alias NDB rows in comboo.db are harmless — leave them.
