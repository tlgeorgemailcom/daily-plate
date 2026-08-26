# Foundation Foods Local Import

USDA Foundation Foods is kept as a local source on this Mac. The extracted
release belongs in `data/foundation/`; the mapping process is preserved in
`recipes_v3/tools/import_foundation_foods.py`.

The importer writes only to the local SQLite database and never contacts
Turso. Foundation identifiers remain distinguishable from SR Legacy by one
leading zero: Foundation `100252` becomes `0100252` in `DataCentralCombo.NDB_NO`.

## Search ranking

Foundation rows receive a positive `key10` ranking during import. If the
unprefixed Foundation NDB matches an SR Legacy row, the Foundation row
inherits that row's `key10` value. Foundation-only rows receive the default
rank `1`. This keeps search priority attached to the replacement food; any
later retirement of the SR Legacy row should set only the old row's `key10`
to `0`.

## Update process

1. Download and extract the newest Foundation JSON release into `data/foundation/`.
2. Preview the mapping:

   ```bash
   python recipes_v3/tools/import_foundation_foods.py
   ```

3. Apply it to the local database only:

   ```bash
   python recipes_v3/tools/import_foundation_foods.py --commit
   ```

The script selects the newest extracted JSON automatically. Use `--input`
and `--db` when testing a particular release or local database copy.

## Sugar completeness

When a Foundation record has no aggregate sugar field but does report
individual sugars, the importer sets `SugarsTotal` to the sum of sucrose,
glucose, fructose, galactose, lactose, and maltose. Each reconstructed record
is printed as `FLAG sugar fallback` during both dry runs and imports. The
importer never estimates sugar from total carbohydrate.

## Energy precedence

Energy values are stored in `Energy_KCal` using this precedence:

1. Generic `Energy` reported in `kcal`.
2. `Energy (Atwater Specific Factors)` when generic kcal is absent.
3. `Energy (Atwater General Factors)` when neither generic nor specific kcal
   is available.

Generic `Energy` values reported in `kJ` are ignored; they must never be
stored as kcal. Specific factors are preferred for foods with unusual
composition or digestibility, while General Factors remain the fallback.

## Fat completeness

Foundation sometimes omits `Total lipid (fat)` while reporting `Total fat
(NLEA)`. The importer uses the values in this order: `Total lipid (fat)`,
`Total fat (NLEA)`, then the sum of the four reported fatty-acid aggregates:
saturated, monounsaturated, polyunsaturated, and trans fat. The component sum
is used only when both aggregate fat totals are absent. When Foundation
reports NLEA, the importer prints a `FLAG fat component check` line so the
component sum can be compared against that independent total.

Differences up to `0.01 g/100g` are accepted as rounding agreement. This
covers the three very-low-fat records whose component sums differ from NLEA by
only `0.002–0.005 g/100g`; their reported fat remains minor and is not treated
as a data-quality failure.

In the April 30, 2026 release, four missing-lipid records have all four
components; their sums agree with NLEA to rounding precision. Fifteen other
missing-lipid records have neither a usable NLEA total nor all four components,
so their fat remains unknown rather than being inferred.

In the April 30, 2026 release, the flagged records are:

| Foundation NDB | Description | Reconstructed sugar (g/100g) |
|---|---|---:|
| `0100275` | Soy milk, sweetened, plain, refrigerated | 2.58 |
| `0100276` | Almond milk, unsweetened, plain, refrigerated | 0.039 |
| `01088` | Buttermilk, low fat | 3.66 |

## Ledger replacement pairs

Generate the ledger-centered replacement list with:

```bash
python recipes_v3/tools/build_foundation_ledger_pairs.py
```

This writes [foundation_ledger_pairs.csv](foundation_ledger_pairs.csv). It
contains one row per matching ledger entry, so aliases that share one legacy
NDB remain visible. The report pairs the ledger ingredient key and description
with the leading-zero Foundation NDB, description, and inherited `key10` rank.