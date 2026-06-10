import type { InValue, Row } from '@libsql/client';
import type { Food, FoodGroup, Portion } from '$lib/data/food-portions';
import type { NutrientRow } from '$lib/nutrition/types';
import { getSR28Db } from '$lib/server/turso';

export type Sr28SearchScope = 'all' | 'baby';

const DEFAULT_LIMIT = 80;
const CUSTOM_PORTION: Portion = { amt: 1, desc: 'custom (g)', gm: 100 };
const SEARCH_FIELDS = ['keyword', 'key0', 'key1', 'key2', 'key3', 'key4', 'key5', 'key6', 'key7', 'key8'];

function mapFdGroupToFoodGroups(fdGrpCd: string): FoodGroup[] {
  switch (fdGrpCd) {
    case '100': return ['dairy'];
    case '200': return ['spice'];
    case '300': return ['prepared'];
    case '400': return ['fats'];
    case '500':
    case '700':
    case '1000':
    case '1300':
    case '1500':
    case '1700': return ['protein'];
    case '600': return ['condiment'];
    case '800':
    case '1800':
    case '2000': return ['grain'];
    case '900': return ['fruit'];
    case '1100': return ['vegetable'];
    case '1200': return ['nuts'];
    case '1400': return ['beverage'];
    case '1600': return ['legume'];
    case '1900': return ['sweets'];
    case '2100':
    case '2200':
    case '2500':
    case '3500':
    case '4300': return ['prepared'];
    default: return ['prepared'];
  }
}

function normalizeDisplay(longDesc: string): string {
  return longDesc
    .replace(/\s+/g, ' ')
    .replace(/^Babyfood/i, 'Baby food')
    .trim();
}

function buildWord(ndbNo: string, longDesc: string): string {
  const slug = longDesc
    .toUpperCase()
    .replace(/[^A-Z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '')
    .slice(0, 48);
  return `${slug || 'SR28'}_${ndbNo}`;
}

function rowToFood(row: Row): Food {
  const ndb = String(row.NDB_NO ?? '');
  const desc = String(row.Long_Desc ?? '');
  const fdGrpCd = String(row.FdGrp_Cd ?? '');
  return {
    word: buildWord(ndb, desc),
    display: normalizeDisplay(desc),
    groups: mapFdGroupToFoodGroups(fdGrpCd),
    ndb,
    desc,
    cal: Number(row.Energy_KCal ?? 0),
    pro: Number(row.Protein ?? 0),
    fat: Number(row.TotalLipidFat ?? 0),
    carb: Number(row.Carbohydrate ?? 0),
    fib: Number(row.FiberTotalDietary ?? 0),
    h2o: Number(row.Water ?? 0),
    sug: Number(row.SugarsTotal ?? 0),
    portions: [CUSTOM_PORTION]
  };
}

function buildSearchWhere(query: string, scope: Sr28SearchScope): { sql: string; args: InValue[] } {
  const terms = query
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s]/g, ' ')   // strip commas and other punctuation (handles USDA Long_Desc format)
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 4);                    // cap at 4 terms — USDA Long_Desc qualifiers ("year round average") break AND chains

  const clauses: string[] = [];
  const args: InValue[] = [];

  // Baby foods and infant formula (FdGrp_Cd = 300) are handled separately.
  clauses.push('COALESCE("FdGrp_Cd", \'\') <> ?');
  args.push('300');

  for (const term of terms) {
    const fieldClauses = SEARCH_FIELDS.map((field) => `LOWER(COALESCE("${field}", '')) LIKE ?`);
    clauses.push(`(${fieldClauses.join(' OR ')})`);
    const like = `%${term}%`;
    args.push(...SEARCH_FIELDS.map(() => like));
  }

  const sql = clauses.length > 0 ? `WHERE ${clauses.join(' AND ')}` : '';
  return { sql, args };
}

export async function searchSr28Foods(query: string, scope: Sr28SearchScope, limit = DEFAULT_LIMIT): Promise<Food[]> {
  const db = getSR28Db();
  const safeLimit = Math.max(1, Math.min(limit, 100));
  const trimmedQuery = query.trim();
  const { sql, args } = buildSearchWhere(trimmedQuery, scope);

  const result = await db.execute({
    sql: `
      SELECT
        "NDB_NO",
        "FdGrp_Cd",
        "Long_Desc",
        "Energy_KCal",
        Protein,
        TotalLipidFat,
        Carbohydrate,
        FiberTotalDietary,
        Water,
        SugarsTotal,
        key10
      FROM DataCentralCombo
      ${sql}
      ORDER BY
        CAST(COALESCE(key10, '0') AS INTEGER) DESC,
        "Long_Desc" ASC
      LIMIT ?
    `,
    args: [
      ...args,
      safeLimit
    ]
  });

  return result.rows.map(rowToFood);
}

/** Food with full per-100g NutrientRow embedded — used by recipe ingredient search */
export type FoodWithNutrients = Food & { nutrients: NutrientRow };

function rowToNutrientRow(row: Row, ndb: string, longDesc: string, fdGrpCd: string): NutrientRow {
  const n = (key: string): number => {
    const v = (row as Record<string, unknown>)[key];
    if (v === null || v === undefined) return 0;
    const num = Number(v);
    return isNaN(num) ? 0 : num;
  };
  return {
    ndbNo: ndb,
    longDesc,
    fdGrpCd,
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
    ...((() => { const f = parseFloat(String((row as Record<string, unknown>)['bin'] ?? '')); return isNaN(f) ? {} : { absorptionFactor: f }; })()),
  };
}

/**
 * Search SR28 foods and embed full NutrientRow in each result.
 * Used by the recipe ingredient food-search endpoint so the browser can cache
 * nutrient data for live community recipe build without extra Turso reads.
 */
export async function searchSr28FoodsWithNutrients(
  query: string,
  scope: Sr28SearchScope,
  limit = DEFAULT_LIMIT,
): Promise<FoodWithNutrients[]> {
  const db = getSR28Db();
  const safeLimit = Math.max(1, Math.min(limit, 100));
  const trimmedQuery = query.trim();
  const { sql, args } = buildSearchWhere(trimmedQuery, scope);

  const result = await db.execute({
    sql: `
      SELECT
        "NDB_NO", "FdGrp_Cd", "Long_Desc",
        "Energy_KCal", Protein, TotalLipidFat, Carbohydrate, FiberTotalDietary,
        Water, SugarsTotal, Ash,
        FattyAcids_totalSaturated, FattyAcids_totalMonounsaturated, FattyAcids_totalPolyunsaturated,
        Cholesterol, Calcium_Ca, Iron_Fe, Magnesium_Mg, Phosphorus_P, Potassium_K,
        Sodium_Na, Zinc_Zn, VitaminC_totalAscorbicAcid, Thiamin, Riboflavin,
        Niacin, VitaminB6, Folate_DFE, VitaminB12, VitaminA_RAE, VitaminD,
        VitaminE_alphaTocopherol, VitaminK_phylloquinone,
        key10, bin
      FROM DataCentralCombo
      ${sql}
      ORDER BY
        CAST(COALESCE(key10, '0') AS INTEGER) DESC,
        "Long_Desc" ASC
      LIMIT ?
    `,
    args: [...args, safeLimit],
  });

  return result.rows.map((row) => {
    const ndb      = String((row as Record<string, unknown>)['NDB_NO'] ?? '');
    const longDesc = String((row as Record<string, unknown>)['Long_Desc'] ?? '');
    const fdGrpCd  = String((row as Record<string, unknown>)['FdGrp_Cd'] ?? '');
    const food     = rowToFood(row);
    return { ...food, nutrients: rowToNutrientRow(row, ndb, longDesc, fdGrpCd) };
  });
}