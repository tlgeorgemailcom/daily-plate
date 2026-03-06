#!/usr/bin/env node
/**
 * Prebuild script: sync admin-added built-in recipes from Turso → TypeScript LEVELS
 *
 * When a moderator adds a new built-in recipe via the Recipe Book form, it is
 * saved to Turso with an id like 'admin-1234567890'. This script runs before
 * every build (prebuild hook) and inserts any such recipes that are not already
 * in the LEVELS array in game-state.svelte.ts.
 *
 * This ensures:
 *   - Free/guest users see the new recipe (served from compiled TypeScript, zero Turso reads)
 *   - Premium users also see it (from Turso overrides while awaiting deploy)
 *   - The script is idempotent — running it multiple times does not duplicate entries
 */

import { createClient } from '@libsql/client';
import { readFileSync, writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const GAME_STATE_PATH = join(__dirname, '../src/lib/farmers-basket/game-state.svelte.ts');

const ALL_FOODS = ['lettuce', 'tomato', 'carrot', 'cheese', 'egg', 'bread', 'apple', 'grapes', 'bacon', 'butter', 'chicken', 'fish'];

async function main() {
  const url = process.env.TURSO_DATABASE_URL;
  const authToken = process.env.TURSO_AUTH_TOKEN;

  if (!url || !authToken) {
    console.warn('⚠️  TURSO_DATABASE_URL or TURSO_AUTH_TOKEN not set — skipping recipe sync.');
    return;
  }

  const db = createClient({ url, authToken });

  const result = await db.execute(`
    SELECT id, name, category, dietary_category, prep_time, servings,
           recipe, animal_spawns, recipe_instructions, recipe_ingredients,
           image_url
    FROM recipes
    WHERE type = 'builtin' AND id LIKE 'admin-%'
    ORDER BY created_at ASC
  `);

  if (result.rows.length === 0) {
    console.log('✅ No admin-added recipes in Turso — nothing to sync.');
    return;
  }

  const content = readFileSync(GAME_STATE_PATH, 'utf-8');

  // Collect IDs already in the file
  const existingIds = new Set(
    [...content.matchAll(/id:\s*['"]([^'"]+)['"]/g)].map(m => m[1])
  );

  // Find the highest levelNum to continue the sequence
  const levelNums = [...content.matchAll(/levelNum:\s*(\d+)/g)].map(m => parseInt(m[1]));
  let nextLevelNum = levelNums.length > 0 ? Math.max(...levelNums) + 1 : 25;

  const newRows = result.rows.filter(row => !existingIds.has(String(row.id)));

  if (newRows.length === 0) {
    console.log('✅ All admin recipes already in TypeScript LEVELS — nothing to add.');
    return;
  }

  const entries = newRows.map((row, i) => {
    const recipeFoods = JSON.parse(String(row.recipe || '[]'));
    const animalSpawns = JSON.parse(String(row.animal_spawns || '[{"type":"rabbit","delay":3000}]'));
    const instructions = row.recipe_instructions ? JSON.parse(String(row.recipe_instructions)) : [];
    const ingredients = row.recipe_ingredients ? JSON.parse(String(row.recipe_ingredients)) : [];

    // Give each required food a supply of 5, others 0
    const foodSupplyStr = ALL_FOODS.map(f => `${f}: ${recipeFoods.includes(f) ? 5 : 0}`).join(', ');

    const spawnsStr = animalSpawns
      .map(s => `{ type: '${s.type}' as AnimalType, delay: ${s.delay} }`)
      .join(', ');

    const escape = s => String(s || '').replace(/\\/g, '\\\\').replace(/'/g, "\\'");

    const instructionsStr = instructions.length > 0
      ? `[\n      ${instructions.map(t => `'${escape(t)}'`).join(',\n      ')}\n    ]`
      : 'undefined';

    const ingredientsStr = ingredients.length > 0
      ? `[\n      ${ingredients.map(ing => `{ name: '${escape(ing.name)}', quantity: '${escape(ing.quantity)}' }`).join(',\n      ')}\n    ]`
      : 'undefined';

    const foodsStr = recipeFoods.map(f => `'${f}' as FoodType`).join(', ');

    const optionals = [
      row.servings ? `    servings: '${escape(row.servings)}',` : null,
      row.prep_time ? `    prepTime: '${escape(row.prep_time)}',` : null,
      `    recipeInstructions: ${instructionsStr},`,
      `    recipeIngredients: ${ingredientsStr},`,
      row.image_url ? `    imageUrl: '${escape(row.image_url)}',` : null,
    ].filter(Boolean).join('\n');

    return `  {
    id: '${escape(row.id)}',
    name: '${escape(row.name)}',
    category: '${escape(row.category || 'Other')}',
    dietaryCategory: '${escape(row.dietary_category || 'all')}',
    levelNum: ${nextLevelNum + i},
    recipe: [${foodsStr}],
    tools: [
      { type: 'fence' as const, count: 2, emoji: '🚧' },
      { type: 'wall' as const, count: 5, emoji: '🧱' }
    ],
    animalSpawns: [${spawnsStr}],
    foodSupply: { ${foodSupplyStr} },
${optionals}
  }`;
  }).join(',\n');

  // Insert before the one `];` that closes the LEVELS array (line starts with `];`)
  const levelsCloseIndex = content.indexOf('\n];');
  if (levelsCloseIndex === -1) {
    console.error('❌ Could not find closing `];` of LEVELS array in game-state.svelte.ts');
    process.exit(1);
  }

  const newContent =
    content.slice(0, levelsCloseIndex) +
    ',\n' + entries +
    '\n];' +
    content.slice(levelsCloseIndex + 3);

  writeFileSync(GAME_STATE_PATH, newContent, 'utf-8');

  console.log(`✅ Synced ${newRows.length} admin recipe(s) into TypeScript LEVELS:`);
  newRows.forEach(r => console.log(`   - ${r.name} (${r.id})`));
}

main().catch(err => {
  // Warn but don't fail the build if Turso is unreachable
  console.warn('⚠️  Recipe sync failed (build will continue):', err.message);
});
