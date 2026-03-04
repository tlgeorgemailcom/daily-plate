// Migrate existing JSON data to Turso database
// Run: node migrate_json_data.mjs

import { createClient } from '@libsql/client';
import { readFileSync, existsSync } from 'fs';

const TURSO_URL = "libsql://daily-food-chain-tlgeorge.aws-us-east-1.turso.io";
const TURSO_TOKEN = "eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE3NzI2MjQxOTAsImlkIjoiMDE5Y2I4YTItNTQwMS03Y2VmLWFkMjYtNjAwZWJiYTUwNzkyIiwicmlkIjoiY2ZiMjkyYmYtNjViNC00NTQ1LThiYzgtMjM5ZDVhODQzYzYwIn0.C2ZB6niPeWPmKA16_IzNbSLn8VAOELLjrdml6ZXp12cfKfMtS6f4w1w32LFlUPjiJLiYhg9yGbjzojvUGPqNDg";

const client = createClient({
  url: TURSO_URL,
  authToken: TURSO_TOKEN
});

// Migrate approved community recipes
async function migrateApprovedRecipes() {
  const file = 'data/recipes/approved.json';
  if (!existsSync(file)) {
    console.log('⚠️  No approved.json file found');
    return 0;
  }
  
  const recipes = JSON.parse(readFileSync(file, 'utf-8'));
  if (!recipes.length) {
    console.log('   No approved recipes to migrate');
    return 0;
  }
  
  let count = 0;
  for (const recipe of recipes) {
    // Check if already exists
    const existing = await client.execute({
      sql: 'SELECT id FROM recipes WHERE id = ?',
      args: [recipe.id]
    });
    
    if (existing.rows.length > 0) {
      console.log(`   ⏭️  Skipping ${recipe.recipeName} (already exists)`);
      continue;
    }
    
    // Build food supply from game foods
    const foodSupply = (recipe.gameFoods || []).reduce((acc, food) => {
      acc[food] = (acc[food] || 0) + 1;
      return acc;
    }, {});
    
    await client.execute({
      sql: `INSERT INTO recipes (
        id, type, name, category, dietary_category,
        prep_time, servings,
        recipe, recipe_ingredients, recipe_instructions,
        food_supply, animal_spawns,
        submitted_by, status, created_at, edited_at, edited_by
      ) VALUES (?, 'community', ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'approved', ?, ?, ?)`,
      args: [
        recipe.id,
        recipe.recipeName || '',
        recipe.category || '',
        recipe.dietaryCategory || null,
        recipe.prepTime || null,
        recipe.servings || null,
        JSON.stringify(recipe.gameFoods || []),
        JSON.stringify(recipe.ingredients || []),
        JSON.stringify(recipe.instructions || []),
        JSON.stringify(foodSupply),
        JSON.stringify(recipe.animalSpawns || []),
        'Anonymous',  // Always use Anonymous player ID for FK constraint
        recipe.submittedAt || new Date().toISOString(),
        recipe.editedAt || null,
        recipe.editedBy || null
      ]
    });
    console.log(`   ✅ ${recipe.recipeName}`);
    count++;
  }
  
  return count;
}

// Apply builtin overrides to existing builtin recipes
async function applyBuiltinOverrides() {
  const file = 'data/recipes/builtin-overrides.json';
  if (!existsSync(file)) {
    console.log('⚠️  No builtin-overrides.json file found');
    return 0;
  }
  
  const overrides = JSON.parse(readFileSync(file, 'utf-8'));
  const keys = Object.keys(overrides);
  if (!keys.length) {
    console.log('   No overrides to apply');
    return 0;
  }
  
  let count = 0;
  for (const id of keys) {
    const override = overrides[id];
    const builtinId = `builtin-${id}`;
    
    await client.execute({
      sql: `UPDATE recipes SET
        name = COALESCE(?, name),
        category = COALESCE(?, category),
        dietary_category = COALESCE(?, dietary_category),
        prep_time = COALESCE(?, prep_time),
        servings = COALESCE(?, servings),
        recipe = COALESCE(?, recipe),
        recipe_ingredients = COALESCE(?, recipe_ingredients),
        recipe_instructions = COALESCE(?, recipe_instructions),
        animal_spawns = COALESCE(?, animal_spawns),
        edited_at = ?,
        edited_by = ?
      WHERE id = ?`,
      args: [
        override.name || null,
        override.category || null,
        override.dietaryCategory || null,
        override.prepTime || null,
        override.servings || null,
        override.recipe ? JSON.stringify(override.recipe) : null,
        override.recipeIngredients ? JSON.stringify(override.recipeIngredients) : null,
        override.recipeInstructions ? JSON.stringify(override.recipeInstructions) : null,
        override.animalSpawns ? JSON.stringify(override.animalSpawns) : null,
        override.editedAt || new Date().toISOString(),
        override.editedBy || 'Moderator',
        builtinId
      ]
    });
    console.log(`   ✅ Applied override to ${override.name}`);
    count++;
  }
  
  return count;
}

// Main
console.log('📦 Migrating JSON data to Turso...\n');

console.log('🥗 Migrating approved community recipes...');
const approvedCount = await migrateApprovedRecipes();
console.log(`   Migrated ${approvedCount} approved recipes\n`);

console.log('🔧 Applying builtin overrides...');
const overrideCount = await applyBuiltinOverrides();
console.log(`   Applied ${overrideCount} overrides\n`);

// Verify final counts
const result = await client.execute("SELECT type, COUNT(*) as count FROM recipes GROUP BY type");
console.log('📊 Final recipe counts:');
for (const row of result.rows) {
  console.log(`   ${row.type}: ${row.count}`);
}
