/**
 * Migration: Add sections_json column to dev_recipes and populate it.
 *
 * Priority order per recipe:
 *   1. MANUAL map  — hand-crafted section metadata with correct cookingMethod/yf
 *   2. Build JSON  — pipeline-validated multi-section data (5 recipes)
 *   3. Ingredient key derivation — wrap single ing-level section key
 *   4. null        — simple recipes with no meaningful sections
 *
 * Also fixes SWEET_001's recipe_ingredients_json (all "baked" → crust/filling).
 */

import { createClient } from '@libsql/client';
import { readFileSync, existsSync } from 'fs';

const db = createClient({
  url: 'libsql://daily-food-chain-tlgeorge.aws-us-east-1.turso.io',
  authToken: 'eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE3NzI2MjQxOTAsImlkIjoiMDE5Y2I4YTItNTQwMS03Y2VmLWFkMjYtNjAwZWJiYTUwNzkyIiwicmlkIjoiY2ZiMjkyYmYtNjViNC00NTQ1LThiYzgtMjM5ZDVhODQzYzYwIn0.C2ZB6niPeWPmKA16_IzNbSLn8VAOELLjrdml6ZXp12cfKfMtS6f4w1w32LFlUPjiJLiYhg9yGbjzojvUGPqNDg'
});

const BUILD_DIR = 'recipes_v3/output/builds';

// ── Section key → default cooking method and whether it's "dry" (yf=1.0) ──────
const KEY_COOKING = {
  crust:      'baked',
  cake:       'baked',
  batter:     'baked',
  pastry:     'baked',
  biscuit:    'baked',
  rolling:    'baked',
  shortbread: 'baked',
  cookies:    'baked',
  macaroons:  'baked',
  filling:    'baked',   // default — overridden per recipe in MANUAL
  topping:    'raw',
  frosting:   'raw',
  glaze:      'raw',
  wash:       'raw',
  assembly:   'raw',
  finish:     'raw',
};
const RAW_KEYS = new Set(['topping','frosting','glaze','wash','assembly','finish']);

// ── Friendly labels ────────────────────────────────────────────────────────────
const KEY_LABEL = {
  crust:      'Pie crust',
  cake:       'Cake',
  batter:     'Batter',
  pastry:     'Pastry',
  biscuit:    'Biscuit',
  filling:    'Filling',
  frosting:   'Frosting',
  glaze:      'Glaze',
  wash:       'Egg wash',
  topping:    'Topping',
  assembly:   'Assembly',
  finish:     'Finish',
  rolling:    'Rolling dough',
  shortbread: 'Shortbread',
  cookies:    'Cookies',
  macaroons:  'Macaroons',
};

// ── Manual section definitions for Group B ─────────────────────────────────────
// (recipes with correct ingredient keys in Turso but single-section build JSON)
// yieldFactorFat is 1.0 across the board for all desserts here.
const MANUAL = {

  // SWEET_001 (Pie Apple) — ALSO needs ingredient key fix (first 5 → crust, rest → filling)
  // Crust: raw (goes into oven uncooked; dish-level "Bake" covers the final bake)
  // Filling: apples simmered first (boiled), then placed in raw crust and baked together
  SWEET_001: [
    { key: 'crust',   label: 'Pie crust',    cookingMethod: 'raw',    yieldFactorWater: 0.82, yieldFactorFat: 1.0 },
    { key: 'filling', label: 'Apple filling', cookingMethod: 'boiled', yieldFactorWater: 0.85, yieldFactorFat: 1.0 },
  ],

  // SWEET_002 (Apple Strudel) — puff pastry baked, apple filling simmered, egg wash raw
  SWEET_002: [
    { key: 'pastry',  label: 'Puff pastry',   cookingMethod: 'baked',  yieldFactorWater: 0.83, yieldFactorFat: 1.0 },
    { key: 'filling', label: 'Apple filling',  cookingMethod: 'boiled', yieldFactorWater: 0.88, yieldFactorFat: 1.0 },
    { key: 'finish',  label: 'Egg wash',       cookingMethod: 'raw',    yieldFactorWater: 1.0,  yieldFactorFat: 1.0 },
  ],

  // SWEET_004 (Pie Blueberry) — crust baked, blueberry filling bakes in-crust, wash raw
  SWEET_004: [
    { key: 'crust',   label: 'Pie crust',         cookingMethod: 'baked', yieldFactorWater: 0.82, yieldFactorFat: 1.0 },
    { key: 'filling', label: 'Blueberry filling',  cookingMethod: 'baked', yieldFactorWater: 0.85, yieldFactorFat: 1.0 },
    { key: 'wash',    label: 'Egg wash',           cookingMethod: 'raw',   yieldFactorWater: 1.0,  yieldFactorFat: 1.0 },
  ],

  // SWEET_005 (Pie Cherry) — same structure as blueberry
  SWEET_005: [
    { key: 'crust',   label: 'Pie crust',       cookingMethod: 'baked', yieldFactorWater: 0.82, yieldFactorFat: 1.0 },
    { key: 'filling', label: 'Cherry filling',   cookingMethod: 'baked', yieldFactorWater: 0.85, yieldFactorFat: 1.0 },
    { key: 'wash',    label: 'Egg wash',         cookingMethod: 'raw',   yieldFactorWater: 1.0,  yieldFactorFat: 1.0 },
  ],

  // SWEET_007 (Pie Mince) — mincemeat filling bakes in-crust
  SWEET_007: [
    { key: 'crust',   label: 'Pie crust',          cookingMethod: 'baked', yieldFactorWater: 0.82, yieldFactorFat: 1.0 },
    { key: 'filling', label: 'Mincemeat filling',   cookingMethod: 'baked', yieldFactorWater: 0.85, yieldFactorFat: 1.0 },
    { key: 'wash',    label: 'Egg wash',            cookingMethod: 'raw',   yieldFactorWater: 1.0,  yieldFactorFat: 1.0 },
  ],

  // SWEET_008 (Pie Peach) — peach filling bakes in-crust
  SWEET_008: [
    { key: 'crust',   label: 'Pie crust',       cookingMethod: 'baked', yieldFactorWater: 0.82, yieldFactorFat: 1.0 },
    { key: 'filling', label: 'Peach filling',    cookingMethod: 'baked', yieldFactorWater: 0.85, yieldFactorFat: 1.0 },
    { key: 'wash',    label: 'Egg wash',         cookingMethod: 'raw',   yieldFactorWater: 1.0,  yieldFactorFat: 1.0 },
  ],

  // SWEET_009 (Pecan Pie) — custard-style filling bakes in-crust (both sections baked)
  SWEET_009: [
    { key: 'crust',   label: 'Pie crust',    cookingMethod: 'baked', yieldFactorWater: 0.82, yieldFactorFat: 1.0 },
    { key: 'filling', label: 'Pecan filling', cookingMethod: 'baked', yieldFactorWater: 0.88, yieldFactorFat: 1.0 },
  ],

  // SWEET_010 (Pumpkin Pie) — custard filling bakes in shell
  SWEET_010: [
    { key: 'crust',   label: 'Pie crust',       cookingMethod: 'baked', yieldFactorWater: 0.82, yieldFactorFat: 1.0 },
    { key: 'filling', label: 'Pumpkin filling',  cookingMethod: 'baked', yieldFactorWater: 0.90, yieldFactorFat: 1.0 },
  ],

  // SWEET_012 (Boston Cream Pie) — cake baked, pastry cream boiled, chocolate glaze raw
  SWEET_012: [
    { key: 'cake',    label: 'Sponge cake',      cookingMethod: 'baked',  yieldFactorWater: 0.85, yieldFactorFat: 1.0 },
    { key: 'filling', label: 'Pastry cream',      cookingMethod: 'boiled', yieldFactorWater: 0.92, yieldFactorFat: 1.0 },
    { key: 'glaze',   label: 'Chocolate glaze',   cookingMethod: 'raw',    yieldFactorWater: 1.0,  yieldFactorFat: 1.0 },
  ],

  // SWEET_015 (Egg Custard Pie) — blind-baked crust, custard filling bakes in shell
  SWEET_015: [
    { key: 'crust',   label: 'Pie crust',          cookingMethod: 'baked', yieldFactorWater: 0.82, yieldFactorFat: 1.0 },
    { key: 'filling', label: 'Egg custard filling', cookingMethod: 'baked', yieldFactorWater: 0.90, yieldFactorFat: 1.0 },
  ],

  // SWEET_017 (White Cake with Coconut Frosting) — cake baked, frosting applied raw
  SWEET_017: [
    { key: 'cake',     label: 'White cake',       cookingMethod: 'baked', yieldFactorWater: 0.85, yieldFactorFat: 1.0 },
    { key: 'frosting', label: 'Coconut frosting', cookingMethod: 'raw',   yieldFactorWater: 1.0,  yieldFactorFat: 1.0 },
  ],

  // SWEET_020 (Yellow Cake with Chocolate Glaze) — cake baked, glaze applied raw
  SWEET_020: [
    { key: 'cake',     label: 'Yellow cake',      cookingMethod: 'baked', yieldFactorWater: 0.85, yieldFactorFat: 1.0 },
    { key: 'frosting', label: 'Chocolate glaze',  cookingMethod: 'raw',   yieldFactorWater: 1.0,  yieldFactorFat: 1.0 },
  ],

  // SWEET_022 (Pineapple Upside-Down Cake) — caramelised topping and cake both bake together
  SWEET_022: [
    { key: 'topping', label: 'Pineapple topping', cookingMethod: 'baked', yieldFactorWater: 0.88, yieldFactorFat: 1.0 },
    { key: 'cake',    label: 'Cake batter',        cookingMethod: 'baked', yieldFactorWater: 0.85, yieldFactorFat: 1.0 },
  ],

  // SWEET_026 (Cheesecake NY-Style) — graham cracker crust baked, cheesecake filling baked
  SWEET_026: [
    { key: 'crust',   label: 'Graham cracker crust', cookingMethod: 'baked', yieldFactorWater: 0.95, yieldFactorFat: 1.0 },
    { key: 'filling', label: 'Cheesecake filling',    cookingMethod: 'baked', yieldFactorWater: 0.88, yieldFactorFat: 1.0 },
  ],

  // SWEET_027 (Sour Cream Coffee Cake) — cake and streusel topping both bake together
  SWEET_027: [
    { key: 'cake',    label: 'Coffee cake',      cookingMethod: 'baked', yieldFactorWater: 0.85, yieldFactorFat: 1.0 },
    { key: 'topping', label: 'Streusel topping', cookingMethod: 'baked', yieldFactorWater: 0.90, yieldFactorFat: 1.0 },
  ],

  // SWEET_035 (Fig Bars) — fig filling simmered, cookie crust baked around it
  SWEET_035: [
    { key: 'filling', label: 'Fig filling',   cookingMethod: 'boiled', yieldFactorWater: 0.88, yieldFactorFat: 1.0 },
    { key: 'crust',   label: 'Cookie crust',  cookingMethod: 'baked',  yieldFactorWater: 0.90, yieldFactorFat: 1.0 },
  ],

  // SWEET_040 (Buttermilk Pie) — blind-baked crust, custard filling bakes in shell
  SWEET_040: [
    { key: 'crust',   label: 'Pie crust',           cookingMethod: 'baked', yieldFactorWater: 0.82, yieldFactorFat: 1.0 },
    { key: 'filling', label: 'Buttermilk filling',   cookingMethod: 'baked', yieldFactorWater: 0.90, yieldFactorFat: 1.0 },
  ],
};

function loadBuild(id) {
  const path = `${BUILD_DIR}/${id}.json`;
  if (!existsSync(path)) return null;
  return JSON.parse(readFileSync(path, 'utf8'));
}

async function main() {
  // ── Step 1: Add column ──────────────────────────────────────────────────────
  try {
    await db.execute('ALTER TABLE dev_recipes ADD COLUMN sections_json TEXT');
    console.log('✅ Added sections_json column to dev_recipes');
  } catch (e) {
    if (String(e.message).includes('duplicate column') || String(e.message).includes('already exists')) {
      console.log('ℹ️  sections_json column already exists — skipping DDL');
    } else {
      throw e;
    }
  }

  // ── Step 2: Load all dev_recipes ───────────────────────────────────────────
  const result = await db.execute(
    'SELECT recipe_id, recipe_name, recipe_ingredients_json, nutrition_json FROM dev_recipes ORDER BY recipe_id'
  );

  let updated = 0, skipped = 0;

  for (const row of result.rows) {
    const id = String(row.recipe_id);
    const name = String(row.recipe_name);
    let sections = null;

    // Priority 1: Manual definition
    if (MANUAL[id]) {
      sections = MANUAL[id];

    } else {
      // Priority 2: Build JSON with multiple sections (pipeline-validated)
      const build = loadBuild(id);
      if (build?.sections?.length > 1) {
        sections = build.sections.map(s => ({
          key: s.section_key,
          label: s.section_label,
          cookingMethod: s.cooking_method,
          yieldFactorWater: s.yield_factor_water,
          yieldFactorFat: s.yield_factor_fat ?? 1.0,
        }));

      } else {
        // Priority 3: Derive from ingredient section keys already in Turso
        const ings = JSON.parse(String(row.recipe_ingredients_json ?? '[]')).filter(i => !i.isDish);
        const seen = new Set();
        const keys = [];
        for (const ing of ings) {
          const k = ing.section;
          if (k && !seen.has(k)) { seen.add(k); keys.push(k); }
        }

        if (keys.length > 0 && !(keys.length === 1 && keys[0] === 'baked')) {
          // Get overall yieldFactorWater from nutrition_json as baked-section fallback
          let overallYf = 0.85;
          try {
            const nj = JSON.parse(String(row.nutrition_json ?? '{}'));
            if (typeof nj.yieldFactorWater === 'number') overallYf = nj.yieldFactorWater;
          } catch { /* leave default */ }

          sections = keys.map(k => ({
            key: k,
            label: KEY_LABEL[k] ?? (k.charAt(0).toUpperCase() + k.slice(1)),
            cookingMethod: KEY_COOKING[k] ?? 'baked',
            yieldFactorWater: RAW_KEYS.has(k) ? 1.0 : overallYf,
            yieldFactorFat: 1.0,
          }));
        }
        // else: sections stays null — simple single-technique recipes don't need headers
      }
    }

    if (sections) {
      await db.execute({
        sql: 'UPDATE dev_recipes SET sections_json = ? WHERE recipe_id = ?',
        args: [JSON.stringify(sections), id],
      });
      const keys = sections.map(s => `${s.key}(${s.cookingMethod})`).join(', ');
      console.log(`✅ ${id.padEnd(14)} ${name.padEnd(35)} → [${keys}]`);
      updated++;
    } else {
      console.log(`⬜ ${id.padEnd(14)} ${name.padEnd(35)} → null (no sections)`);
      skipped++;
    }
  }

  // ── Step 3: Fix SWEET_001 ingredient section keys ───────────────────────────
  // generated-levels.ts: first 5 ingredients = crust, remaining = filling
  // Turso currently stores all 15 as section: "baked"
  const s1 = await db.execute(
    "SELECT recipe_ingredients_json FROM dev_recipes WHERE recipe_id = 'SWEET_001'"
  );
  const ings001 = JSON.parse(String(s1.rows[0].recipe_ingredients_json));
  const fixed001 = ings001.map((ing, idx) => ({ ...ing, section: idx < 5 ? 'crust' : 'filling' }));
  await db.execute({
    sql: "UPDATE dev_recipes SET recipe_ingredients_json = ? WHERE recipe_id = 'SWEET_001'",
    args: [JSON.stringify(fixed001)],
  });
  console.log('\n✅ Fixed SWEET_001 ingredient keys: first 5 → crust, remaining → filling');

  console.log(`\nDone. ${updated} recipes populated, ${skipped} left null.`);
  db.close();
}

main().catch(e => { console.error('Migration failed:', e.message); db.close(); process.exit(1); });
