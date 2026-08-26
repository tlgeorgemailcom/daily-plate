/**
 * SR28 Ingredient Matcher
 *
 * Accepts a free-text ingredient string (e.g. "2 tbsp olive oil" or
 * "chicken breast roasted") and returns the top N ranked SR28 NDB matches
 * from DataCentralCombo.
 *
 * Works in dev against a local SQLite file (TURSO_SR28_URL=file:/path/to/comboo.db)
 * and in prod against Turso once DataCentralCombo is synced there.
 */

import { getSR28Db } from '$lib/server/turso';
import type { Row } from '@libsql/client';

// ── Types ─────────────────────────────────────────────────────────────────────

export interface IngredientMatch {
  ndb_no: string;
  long_desc: string;
  energy_kcal: number;
  score: number;
}

// ── Unit/quantity stripping ───────────────────────────────────────────────────

const UNIT_PATTERN =
  /^\s*[\d¼½¾⅓⅔⅛⅜⅝⅞]+[\d\s\/\.\-]*\s*(tsp|tbsp|tablespoon|teaspoon|cup|cups|oz|ounce|lb|pound|g|gram|kg|ml|l|liter|pinch|dash|clove|cloves|slice|slices|piece|pieces|can|cans|jar|jars|bunch|head|stalk|stalks|sprig|sprigs|fillet|fillets|strip|strips|scoop|scoops|drop|drops)\s*/gi;

const PREP_NOISE =
  /\b(finely|coarsely|roughly|thinly|freshly|lightly|well|small|medium|large|extra|about|approx|approximately|chopped|sliced|diced|minced|shredded|grated|beaten|melted|softened|room temperature|to taste)\b/gi;

export function stripQuantity(raw: string): string {
  return raw
    .replace(UNIT_PATTERN, '')
    .replace(PREP_NOISE, '')
    .replace(/\s{2,}/g, ' ')
    .trim();
}

// ── Synonym / alias map ───────────────────────────────────────────────────────
// Keys are lowercase normalised user input; values replace the search query.

const SYNONYMS: Record<string, string> = {
  'ap flour':                   'wheat flour white all-purpose',
  'all purpose flour':          'wheat flour white all-purpose',
  'all-purpose flour':          'wheat flour white all-purpose',
  'plain flour':                'wheat flour white all-purpose',
  'whole wheat flour':          'wheat flour whole-grain',
  'ww flour':                   'wheat flour whole-grain',
  'cake flour':                 'wheat flour cake',
  'bread flour':                'wheat flour bread',
  'cornstarch':                 'cornstarch',
  'corn starch':                'cornstarch',
  'egg roll wrapper':           'wonton wrapper',
  'egg roll wrappers':          'wonton wrapper',
  'wonton wrapper':             'wonton wrapper',
  'ground beef':                'beef ground',
  'ground pork':                'pork ground',
  'ground turkey':              'turkey ground',
  'ground chicken':             'chicken ground',
  'peanut butter':              'peanut butter',
  'pb':                         'peanut butter',
  'evaporated milk':            'milk evaporated canned',
  'condensed milk':             'milk condensed sweetened canned',
  'heavy cream':                'cream heavy whipping',
  'heavy whipping cream':       'cream heavy whipping',
  'sour cream':                 'cream sour cultured',
  'cream cheese':               'cheese cream',
  'half and half':              'milk half and half',
  'half & half':                'milk half and half',
  'dark corn syrup':            'syrups corn dark',
  'light corn syrup':           'syrups corn light',
  'powdered sugar':             'sugars powdered',
  'icing sugar':                'sugars powdered',
  'confectioners sugar':        'sugars powdered',
  'brown sugar':                'sugars brown',
  'baking soda':                'leavening agents baking soda',
  'baking powder':              'leavening agents baking powder',
  'active dry yeast':           'leavening agents yeast baker active dry',
  'instant yeast':              'leavening agents yeast baker active dry',
  'olive oil':                  'oil olive',
  'canola oil':                 'oil canola',
  'vegetable oil':              'oil salad dressing',
  'sesame oil':                 'oil sesame',
  'coconut oil':                'oil coconut',
  'chicken broth':              'soup stock chicken',
  'beef broth':                 'soup stock beef',
  'vegetable broth':            'soup stock vegetable',
  'tahini':                     'tahini',
  'sesame paste':               'tahini',
  'soy sauce':                  'soy sauce tamari',
  'tamari':                     'soy sauce tamari',
  'green onion':                'onions spring scallions',
  'green onions':               'onions spring scallions',
  'scallion':                   'onions spring scallions',
  'scallions':                  'onions spring scallions',
  'spring onion':               'onions spring scallions',
  'jalapeño':                   'peppers jalapeno',
  'jalapeno':                   'peppers jalapeno',
  'bell pepper':                'peppers sweet raw',
  'red pepper':                 'peppers sweet red raw',
  'green pepper':               'peppers sweet green raw',
  'ice cream':                  'ice cream',
  'chocolate syrup':            'syrups chocolate',
  'choc syrup':                 'syrups chocolate',
  'lemon juice':                'lemon juice raw',
  'lime juice':                 'lime juice raw',
  'orange juice':               'orange juice raw',
  'tomato paste':               'tomato products canned paste',
  'tomato sauce':               'sauce pasta spaghetti marinara',
  'crushed tomatoes':           'tomatoes crushed canned',
  'diced tomatoes':             'tomatoes red ripe canned',
  'canned tomatoes':            'tomatoes red ripe canned',
  'chickpeas':                  'chickpeas canned',
  'garbanzo beans':             'chickpeas canned',
  'black beans':                'beans black cooked',
  'kidney beans':               'beans kidney red cooked',
  'pinto beans':                'beans pinto cooked',
  'navy beans':                 'beans navy cooked',
  'lentils':                    'lentils cooked',
  'tuna':                       'fish tuna',
  'canned tuna':                'fish tuna light canned water',
  'light tuna':                 'fish tuna light',
  'albacore tuna':              'fish tuna white canned water',
  'whole milk':                 'milk whole',
  'skim milk':                  'milk nonfat fluid',
  'nonfat milk':                'milk nonfat fluid',
  '2% milk':                    'milk lowfat fluid',
  'lowfat milk':                'milk lowfat fluid',
  'whole wheat bread':          'bread whole-wheat',
  'white bread':                'bread white commercially prepared',
  'butter unsalted':            'butter without salt',
  'unsalted butter':            'butter without salt',
  'salted butter':              'butter salted',
  'cream butter':               'butter salted',
  'cocoa powder':               'cocoa dry powder unsweetened',
  'unsweetened cocoa':          'cocoa dry powder unsweetened',
  'dark chocolate':             'chocolate dark bittersweet',
  'semi-sweet chocolate':       'chocolate semi-sweet',
  'chocolate chips':            'chocolate semi-sweet morsels',
  'choc chips':                 'chocolate semi-sweet morsels',
  'vanilla extract':            'vanilla extract',
  'cream of mushroom soup':     'soup cream mushroom canned condensed',
  'cream of chicken soup':      'soup cream chicken canned condensed',
  'worcestershire sauce':       'worcestershire sauce',
  'hot sauce':                  'sauce hot pepper tabasco',
  'maple syrup':                'syrups maple',
  'honey':                      'honey',
  'molasses':                   'molasses',
};

// ── Cooking state tokens (matched against Long_Desc) ─────────────────────────

const COOKING_STATES = new Set([
  'raw', 'cooked', 'baked', 'roasted', 'fried', 'canned', 'frozen',
  'dried', 'boiled', 'steamed', 'grilled', 'smoked', 'prepared',
  'uncooked', 'fresh', 'dehydrated', 'pickled', 'fermented',
]);

// ── Penalty keywords (lower confidence branded/restaurant entries) ────────────

const PENALTY_PHRASES = [
  'fast food', 'fast foods', 'restaurant', 'babyfood', 'baby food',
  'infant', 'toddler', 'strained', 'junior', 'subway', 'taco bell',
  'mcdonald', "wendy's", 'burger king', 'kfc', 'pizza hut', 'domino',
  'kraft', 'stouffer', 'progresso', 'campbell', 'heinz', 'nestle',
  "hershey's", 'nabisco', 'kellogg', "mcdonald's",
  // Branded cereal / packaged food companies
  'quaker', 'general mills', 'post brand', 'malt-o-meal', 'honey bunches',
  'cheerios', 'wheaties', 'frosted flakes', 'pillsbury', 'betty crocker',
  'pepperidge', 'arnolds', 'wonder bread', 'thomas', 'jell-o', 'kool-aid',
];

// ── Score a single candidate ──────────────────────────────────────────────────

function scoreCandidate(
  queryTokens: string[],
  stateTokens: string[],
  ndb_no: string,
  long_desc: string,
): number {
  const desc  = long_desc.toLowerCase();
  const words = desc.split(/[\s,\(\)]+/).filter(Boolean);

  let score = 0;

  // Word overlap — exact word match scores higher than substring
  for (const qt of queryTokens) {
    if (qt.length < 2) continue;
    if (words.includes(qt))   score += 3;
    else if (desc.includes(qt)) score += 1;
  }

  // Cooking state match in Long_Desc
  for (const st of stateTokens) {
    if (desc.includes(st)) score += 5;
  }

  // SR28 generic bonus: NDB_NO < 25000 tends to be standard SR entries
  const ndbNum = parseInt(ndb_no, 10);
  if (!isNaN(ndbNum) && ndbNum < 25000) score += 2;

  // "Starts-with" bonus: Long_Desc begins with the primary query word
  // e.g. "Milk, whole..." beats "Cheese, mozzarella, whole milk" for query "whole milk"
  if (queryTokens.length > 0 && words[0] === queryTokens[0]) score += 4;

  // Branded / restaurant / baby-food penalty
  for (const phrase of PENALTY_PHRASES) {
    if (desc.includes(phrase)) { score -= 4; break; }
  }

  // Penalise very long Long_Desc — generic entries tend to be concise
  if (long_desc.length > 80) score -= 1;

  return score;
}

// ── Main exported function ────────────────────────────────────────────────────

/**
 * Match a free-text ingredient description against SR28 DataCentralCombo.
 * Returns up to `limit` matches sorted by descending score.
 */
export async function matchIngredient(
  raw: string,
  limit = 5,
): Promise<IngredientMatch[]> {
  if (!raw?.trim()) return [];

  // 1. Strip quantity and prep words
  const cleaned = stripQuantity(raw.toLowerCase());

  // 2. Extract state tokens from original BEFORE synonym substitution
  //    so e.g. "tuna canned" preserves "canned" even when "tuna" → "fish tuna"
  const origStateTokens: string[] = cleaned
    .split(/[\s,\-\/]+/)
    .filter(t => COOKING_STATES.has(t));

  // 3. Apply synonym map (longest match wins)
  let query = cleaned;
  const sortedSynKeys = Object.keys(SYNONYMS).sort((a, b) => b.length - a.length);
  for (const k of sortedSynKeys) {
    if (query.includes(k)) {
      query = SYNONYMS[k];
      break;
    }
  }

  // 4. Tokenise — drop stop words and very short tokens
  // Extended stop list — generic qualifiers that flood LIKE results
  const STOP = new Set([
    'with', 'and', 'or', 'the', 'a', 'an', 'in', 'of', 'for', 'to', 'by', 'at', 'from',
    'all', 'purpose', 'light', 'style', 'regular', 'type', 'added', 'without',
    'no', 'not', 'reduced', 'low', 'high', 'free', 'extra', 'original',
  ]);
  const allTokens   = query.split(/[\s,\-\/]+/).filter(t => t.length > 1 && !STOP.has(t));
  const stateTokens = [
    ...new Set([...allTokens.filter(t => COOKING_STATES.has(t)), ...origStateTokens]),
  ];
  const queryTokens = allTokens.filter(t => !COOKING_STATES.has(t));

  if (queryTokens.length === 0 && stateTokens.length === 0) return [];

  // 5. Build SQL — AND-first (all tokens must match) for precision;
  //    fall back to OR if AND yields fewer than 15 rows
  const searchTokens = [...queryTokens, ...stateTokens].slice(0, 5);
  const likeArgs     = searchTokens.map(t => `%${t}%`);

  const db = getSR28Db();

  let rows: Row[] = [];

  if (searchTokens.length > 1) {
    const andClauses = searchTokens.map(() => 'Long_Desc LIKE ?').join(' AND ');
    const andResult  = await db.execute({
      sql:  `SELECT NDB_NO, Long_Desc, Energy_KCal FROM DataCentralCombo WHERE CAST(COALESCE(key10, '0') AS INTEGER) > 0 AND ${andClauses} LIMIT 100`,
      args: likeArgs,
    });
    rows = andResult.rows;
  }

  // Fall back to OR when AND returns too few (or for single-token queries)
  if (rows.length < 15) {
    const orClauses = searchTokens.map(() => 'Long_Desc LIKE ?').join(' OR ');
    const orResult  = await db.execute({
      sql:  `SELECT NDB_NO, Long_Desc, Energy_KCal FROM DataCentralCombo WHERE CAST(COALESCE(key10, '0') AS INTEGER) > 0 AND (${orClauses}) LIMIT 400`,
      args: likeArgs,
    });
    // Merge: AND results + OR results, deduplicated by NDB_NO
    const seen = new Set(rows.map(r => r.NDB_NO as string));
    for (const r of orResult.rows) {
      if (!seen.has(r.NDB_NO as string)) rows.push(r);
    }
  }

  // 6. Score every candidate
  const scored: IngredientMatch[] = rows.map((row) => ({
    ndb_no:      row.NDB_NO  as string,
    long_desc:   row.Long_Desc as string,
    energy_kcal: Number(row.Energy_KCal),
    score:       scoreCandidate(queryTokens, stateTokens, row.NDB_NO as string, row.Long_Desc as string),
  }));

  // 7. Sort descending by score, break ties by ascending NDB_NO (SR28 entries first)
  scored.sort((a, b) =>
    b.score !== a.score
      ? b.score - a.score
      : parseInt(a.ndb_no) - parseInt(b.ndb_no),
  );

  return scored.slice(0, limit);
}
