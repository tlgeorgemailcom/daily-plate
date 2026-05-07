// One-off: rebuild the SWEET_003 recipe_ingredients in v1 form
// from the tuned recipes_v2 CSV. Updates BOTH:
//   - src/lib/data/recipe_ingredients.csv (rows for SWEET_003 replaced)
//   - recipes_dev.db (recipes.recipe_ingredients JSON for SWEET_003 replaced)
// Leaves all other recipes untouched.
import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { createClient } from '@libsql/client';

const ROOT = '/Volumes/training/Daily Food Chain/daily-food-chain';
const RECIPE_ID = 'SWEET_003';
const V2_INGR = resolve(ROOT, 'recipes_v2/data/recipe_ingredients.csv');
const V2_LEDGER = resolve(ROOT, 'recipes_v2/data/ingredients_ledger.csv');
const V2_RECIPES = resolve(ROOT, 'recipes_v2/data/recipes.csv');
const V1_INGR = resolve(ROOT, 'src/lib/data/recipe_ingredients.csv');
const LOCAL_DB = resolve(ROOT, 'recipes_dev.db');

function parseCsv(text) {
  const rows = [];
  let row = [], cell = '', q = false;
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (q) {
      if (ch === '"') { if (text[i + 1] === '"') { cell += '"'; i++; } else { q = false; } }
      else cell += ch;
      continue;
    }
    if (ch === '"') q = true;
    else if (ch === ',') { row.push(cell); cell = ''; }
    else if (ch === '\n') { row.push(cell); rows.push(row); row = []; cell = ''; }
    else if (ch !== '\r') cell += ch;
  }
  if (cell.length || row.length) { row.push(cell); rows.push(row); }
  const [hdr, ...body] = rows;
  return body.filter(r => r.length && r.some(v => v !== ''))
    .map(c => Object.fromEntries(hdr.map((h, i) => [h, c[i] ?? ''])));
}

function csvEscape(v) {
  const s = v == null ? '' : String(v);
  if (/[",\n]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
  return s;
}

const ledger = Object.fromEntries(parseCsv(readFileSync(V2_LEDGER, 'utf8')).map(r => [r.ingredient_key, r]));
const v2Ings = parseCsv(readFileSync(V2_INGR, 'utf8')).filter(r => r.recipe_id === RECIPE_ID);
const v2Recipe = parseCsv(readFileSync(V2_RECIPES, 'utf8')).find(r => r.recipe_id === RECIPE_ID);
if (!v2Recipe) throw new Error('Recipe not in v2 recipes.csv');
if (!v2Ings.length) throw new Error('No v2 ingredient rows');

const recipeName = 'Pie Banana Cream';
const canonNdb = v2Recipe.canonical_ndb_no;
const servingsCount = v2Recipe.servings_count || '8';

// Build v1-shaped rows: dish row first, then ingredients.
const dishRow = {
  recipe_id: RECIPE_ID,
  recipe_name: recipeName,
  row_order: '0',
  row_type: 'dish',
  ing_name: '',
  ing_qty: 'custom (g)',
  sr28_long_desc: 'Pie, banana cream, prepared from recipe',
  ndb_no: canonNdb,
  portion_desc: 'custom (g)',
  portion_grams: '100.0',
  serving_count: '1',
  notes: '',
  game_food: '',
  animal: ''
};

const ingRows = v2Ings
  .sort((a, b) => Number(a.row_order) - Number(b.row_order))
  .map((r) => {
    const led = ledger[r.ingredient_key];
    if (!led) throw new Error(`Missing ledger entry for ${r.ingredient_key}`);
    const notes = [];
    if (r.section) notes.push(`section=${r.section}`);
    if (r.is_optional === 'true') notes.unshift('optional');
    return {
      recipe_id: RECIPE_ID,
      recipe_name: recipeName,
      row_order: String(r.row_order),
      row_type: 'ingredient',
      ing_name: r.display_name_override || led.default_display_name,
      ing_qty: r.qty_display,
      sr28_long_desc: led.default_long_desc,
      ndb_no: led.ndb_no,
      portion_desc: 'g',
      portion_grams: String(r.grams),
      serving_count: '1',
      notes: notes.join(';'),
      game_food: '',
      animal: ''
    };
  });

const newRows = [dishRow, ...ingRows];

// ── Rewrite src/lib/data/recipe_ingredients.csv ──
const csvText = readFileSync(V1_INGR, 'utf8');
const lines = csvText.split('\n');
const header = lines[0];
const cols = ['recipe_id','recipe_name','row_order','row_type','ing_name','ing_qty','sr28_long_desc','ndb_no','portion_desc','portion_grams','serving_count','notes','game_food','animal'];
const otherLines = lines.slice(1).filter(l => l && !l.startsWith(`${RECIPE_ID},`));
const newCsvLines = newRows.map(r => cols.map(c => csvEscape(r[c])).join(','));
// Insert SWEET_003 block in row_order — find approximate location by appending then
// keeping recipe groups together. Simplest: prepend SWEET_003 block at top after header,
// since order doesn't affect downstream pipelines (they group_by recipe_id).
const out = [header, ...newCsvLines, ...otherLines].join('\n');
writeFileSync(V1_INGR, out.endsWith('\n') ? out : out + '\n');
console.log(`Rewrote ${V1_INGR} (${newCsvLines.length} new rows for ${RECIPE_ID})`);

// ── Update recipes_dev.db ──
const db = createClient({ url: pathToFileURL(LOCAL_DB).href });
const jsonRows = newRows.map(r => ({
  row_order: Number(r.row_order),
  row_type: r.row_type,
  ing_name: r.ing_name,
  ing_qty: r.ing_qty,
  ndb_no: r.ndb_no,
  portion_desc: r.portion_desc,
  portion_grams: Number(r.portion_grams),
  serving_count: Number(r.serving_count),
  notes: r.notes,
  game_food: r.game_food,
  animal: r.animal,
}));
await db.execute({
  sql: 'UPDATE recipes SET recipe_ingredients = ? WHERE id = ?',
  args: [JSON.stringify(jsonRows), RECIPE_ID]
});
console.log(`Updated recipes_dev.db.recipes.recipe_ingredients for ${RECIPE_ID} (${jsonRows.length} rows)`);
