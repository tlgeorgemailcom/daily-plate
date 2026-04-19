import type { InValue, Row } from '@libsql/client';
import type { Food, FoodGroup, Portion } from '$lib/data/food-portions';
import { getSR28Db } from '$lib/server/turso';

export type Sr28SearchScope = 'all' | 'baby';

const DEFAULT_LIMIT = 80;
const CUSTOM_PORTION: Portion = { amt: 1, desc: 'custom (g)', gm: 100 };

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
    .split(/\s+/)
    .filter(Boolean);

  const clauses: string[] = [];
  const args: InValue[] = [];

  if (scope === 'baby') {
    clauses.push('"FdGrp_Cd" = ?');
    args.push('300');
  } else {
    clauses.push('COALESCE("FdGrp_Cd", \'\') <> ?');
    args.push('300');
  }

  for (const term of terms) {
    clauses.push('(LOWER(COALESCE("Long_Desc", \'\')) LIKE ? OR LOWER(COALESCE("keyword", \'\')) LIKE ?)');
    const like = `%${term}%`;
    args.push(like, like);
  }

  const sql = clauses.length > 0 ? `WHERE ${clauses.join(' AND ')}` : '';
  return { sql, args };
}

export async function searchSr28Foods(query: string, scope: Sr28SearchScope, limit = DEFAULT_LIMIT): Promise<Food[]> {
  const db = getSR28Db();
  const safeLimit = Math.max(1, Math.min(limit, 100));
  const trimmedQuery = query.trim();
  const loweredQuery = trimmedQuery.toLowerCase();
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
        SugarsTotal
      FROM DataCentralCombo
      ${sql}
      ORDER BY
        CASE
          WHEN ? <> '' AND LOWER(COALESCE("Long_Desc", '')) = ? THEN 0
          WHEN ? <> '' AND LOWER(COALESCE("Long_Desc", '')) LIKE ? THEN 1
          ELSE 2
        END,
        "Long_Desc" ASC
      LIMIT ?
    `,
    args: [
      ...args,
      loweredQuery,
      loweredQuery,
      loweredQuery,
      `${loweredQuery}%`,
      safeLimit
    ]
  });

  return result.rows.map(rowToFood);
}