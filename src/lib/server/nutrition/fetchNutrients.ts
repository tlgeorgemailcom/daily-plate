/**
 * fetchNutrients.ts — Server-only Turso helper for NutrientRow lookups.
 *
 * SERVER ONLY — do not import in browser components or pure lib files.
 * Place in src/lib/server/nutrition/ so SvelteKit enforces the boundary.
 *
 * Functions
 * ─────────
 *  fetchNutrientByNdb(ndbNo)            → NutrientRow | null
 *  fetchNutrientsByNdb(ndbNos)          → Map<ndbNo, NutrientRow>
 *  fetchWaterNdb()                      → NutrientRow | null   (NDB 14429 = water)
 *
 * Query pattern: uses getSR28Db().execute() directly (not queryOne/queryAll which
 * target the game DB). Columns match DataCentralCombo exactly.
 *
 * See docs/vercel_pipeline.md §3 for architecture.
 */

import { getSR28Db } from '$lib/server/turso.js';
import type { NutrientRow } from '$lib/nutrition/types.js';

// ── Column list ───────────────────────────────────────────────────────────────
// Subset of DataCentralCombo columns needed for the nutrition build.
// Must match NutrientRow field names (mapped in buildRecipeCommunity.ts).
const SELECT_COLUMNS = `
  NDB_NO,
  FdGrp_Cd,
  Long_Desc,
  Energy_KCal,
  Water,
  Protein,
  TotalLipidFat,
  Carbohydrate,
  SugarsTotal,
  FiberTotalDietary,
  Ash,
  FattyAcids_totalSaturated,
  FattyAcids_totalMonounsaturated,
  FattyAcids_totalPolyunsaturated,
  Cholesterol,
  Calcium_Ca,
  Iron_Fe,
  Magnesium_Mg,
  Phosphorus_P,
  Potassium_K,
  Sodium_Na,
  Zinc_Zn,
  VitaminC_totalAscorbicAcid,
  Thiamin,
  Riboflavin,
  Niacin,
  VitaminB6,
  Folate_DFE,
  VitaminB12,
  VitaminA_RAE,
  VitaminD,
  VitaminE_alphaTocopherol,
  VitaminK_phylloquinone
`.trim();

// ── Row mapper ────────────────────────────────────────────────────────────────

function rowToNutrientRow(row: Record<string, unknown>): NutrientRow {
  const n = (key: string): number => {
    const v = row[key];
    if (v === null || v === undefined) return 0;
    const num = Number(v);
    return isNaN(num) ? 0 : num;
  };
  return {
    ndbNo:                          String(row['NDB_NO']  ?? ''),
    longDesc:                       String(row['Long_Desc'] ?? ''),
    fdGrpCd:                        String(row['FdGrp_Cd'] ?? ''),
    energy_KCal:                    n('Energy_KCal'),
    water:                          n('Water'),
    protein:                        n('Protein'),
    totalLipidFat:                  n('TotalLipidFat'),
    carbohydrate:                   n('Carbohydrate'),
    sugarsTotal:                    n('SugarsTotal'),
    fiberTotalDietary:              n('FiberTotalDietary'),
    ash:                            n('Ash'),
    fattyAcids_totalSaturated:     n('FattyAcids_totalSaturated'),
    fattyAcids_totalMonounsaturated: n('FattyAcids_totalMonounsaturated'),
    fattyAcids_totalPolyunsaturated: n('FattyAcids_totalPolyunsaturated'),
    cholesterol:                    n('Cholesterol'),
    calcium_Ca:                     n('Calcium_Ca'),
    iron_Fe:                        n('Iron_Fe'),
    magnesium_Mg:                   n('Magnesium_Mg'),
    phosphorus_P:                   n('Phosphorus_P'),
    potassium_K:                    n('Potassium_K'),
    sodium_Na:                      n('Sodium_Na'),
    zinc_Zn:                        n('Zinc_Zn'),
    vitaminC_totalAscorbicAcid:    n('VitaminC_totalAscorbicAcid'),
    thiamin:                        n('Thiamin'),
    riboflavin:                     n('Riboflavin'),
    niacin:                         n('Niacin'),
    vitaminB6:                      n('VitaminB6'),
    folateDFE:                      n('Folate_DFE'),
    vitaminB12:                     n('VitaminB12'),
    vitaminA_RAE:                   n('VitaminA_RAE'),
    vitaminD:                       n('VitaminD'),
    vitaminE_alphaTocopherol:      n('VitaminE_alphaTocopherol'),
    vitaminK_phylloquinone:        n('VitaminK_phylloquinone'),
  };
}

// ── Public API ────────────────────────────────────────────────────────────────

/**
 * Fetch a single NutrientRow by NDB number.
 * Returns null if not found.
 */
export async function fetchNutrientByNdb(ndbNo: string): Promise<NutrientRow | null> {
  const db = getSR28Db();
  const result = await db.execute({
    sql:  `SELECT ${SELECT_COLUMNS} FROM DataCentralCombo WHERE NDB_NO = ? LIMIT 1`,
    args: [ndbNo],
  });
  if (result.rows.length === 0) return null;
  return rowToNutrientRow(result.rows[0] as Record<string, unknown>);
}

/**
 * Fetch NutrientRows for a batch of NDB numbers.
 * Returns a Map keyed by ndbNo. Missing NDB numbers are absent from the map.
 * Deduplicates the input list before querying.
 */
export async function fetchNutrientsByNdb(
  ndbNos: string[],
): Promise<Map<string, NutrientRow>> {
  const unique = [...new Set(ndbNos.filter(Boolean))];
  if (unique.length === 0) return new Map();

  // SQLite supports up to 999 bind parameters; batch if needed
  const BATCH = 500;
  const map = new Map<string, NutrientRow>();

  for (let i = 0; i < unique.length; i += BATCH) {
    const chunk      = unique.slice(i, i + BATCH);
    const placeholders = chunk.map(() => '?').join(', ');
    const db         = getSR28Db();
    const result     = await db.execute({
      sql:  `SELECT ${SELECT_COLUMNS} FROM DataCentralCombo WHERE NDB_NO IN (${placeholders})`,
      args: chunk,
    });
    for (const row of result.rows) {
      const nr = rowToNutrientRow(row as Record<string, unknown>);
      map.set(nr.ndbNo, nr);
    }
  }

  return map;
}

/**
 * Fetch the NutrientRow for plain water.
 * Used by the yield-water initialisation step (initial_water = actual water mass,
 * not from a water-NDB ingredient unless the recipe includes it explicitly).
 * NDB 14429 = Water, tap, drinking.
 */
export async function fetchWaterNdb(): Promise<NutrientRow | null> {
  return fetchNutrientByNdb('14429');
}
