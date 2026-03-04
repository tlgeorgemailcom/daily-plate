// Seed built-in recipes to Turso database
// Run from project root: node seed_recipes.mjs

import { createClient } from '@libsql/client';
import { readFileSync } from 'fs';

const TURSO_URL = "libsql://daily-food-chain-tlgeorge.aws-us-east-1.turso.io";
const TURSO_TOKEN = "eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE3NzI2MjQxOTAsImlkIjoiMDE5Y2I4YTItNTQwMS03Y2VmLWFkMjYtNjAwZWJiYTUwNzkyIiwicmlkIjoiY2ZiMjkyYmYtNjViNC00NTQ1LThiYzgtMjM5ZDVhODQzYzYwIn0.C2ZB6niPeWPmKA16_IzNbSLn8VAOELLjrdml6ZXp12cfKfMtS6f4w1w32LFlUPjiJLiYhg9yGbjzojvUGPqNDg";

// Parse levels from TypeScript file
function parseLevelsFromFile(filepath) {
  const content = readFileSync(filepath, 'utf-8');
  
  // Find LEVELS array (everything between export const LEVELS and the closing ];)
  const levelsMatch = content.match(/export const LEVELS: Level\[\] = \[([\s\S]*?)\n\];/);
  if (!levelsMatch) {
    throw new Error('Could not find LEVELS array in file');
  }
  
  const levelsContent = levelsMatch[1];
  const levels = [];
  
  // Split by level start pattern (line starting with "  {" after a comma or start)
  const levelBlocks = levelsContent.split(/\n  \{/).filter(b => b.includes("id:"));
  
  for (const block of levelBlocks) {
    const level = {};
    
    // Extract string fields
    const stringFields = ['id', 'name', 'category', 'dietaryCategory', 'servings', 'prepTime'];
    for (const field of stringFields) {
      const match = block.match(new RegExp(`${field}: '([^']*)'`));
      if (match) level[field] = match[1];
    }
    
    // Extract levelNum
    const numMatch = block.match(/levelNum: (\d+)/);
    if (numMatch) level.levelNum = parseInt(numMatch[1]);
    
    // Extract recipe array
    const recipeMatch = block.match(/recipe: \[([^\]]*)\]/);
    if (recipeMatch) {
      level.recipe = [...recipeMatch[1].matchAll(/'([^']*)'/g)].map(m => m[1]);
    }
    
    // Extract foodSupply
    const supplyMatch = block.match(/foodSupply: \{([^}]+)\}/);
    if (supplyMatch) {
      level.foodSupply = {};
      for (const [, key, val] of supplyMatch[1].matchAll(/(\w+): (\d+)/g)) {
        level.foodSupply[key] = parseInt(val);
      }
    }
    
    // Extract tools
    level.tools = [...block.matchAll(/\{ type: '(\w+)', count: (\d+), emoji: '([^']+)' \}/g)]
      .map(m => ({ type: m[1], count: parseInt(m[2]), emoji: m[3] }));
    
    // Extract animalSpawns
    level.animalSpawns = [...block.matchAll(/\{ type: '(\w+)', delay: (\d+)/g)]
      .map(m => ({ type: m[1], delay: parseInt(m[2]) }));
    
    // Extract recipeInstructions
    const instrMatch = block.match(/recipeInstructions: \[([\s\S]*?)\]/);
    if (instrMatch) {
      level.recipeInstructions = [...instrMatch[1].matchAll(/'([^']*)'/g)].map(m => m[1]);
    }
    
    // Extract recipeIngredients
    level.recipeIngredients = [...block.matchAll(/\{ name: '([^']+)', quantity: '([^']+)' \}/g)]
      .map(m => ({ name: m[1], quantity: m[2] }));
    
    if (level.id) {
      levels.push(level);
    }
  }
  
  return levels;
}

async function seedToTurso(levels) {
  const client = createClient({
    url: TURSO_URL,
    authToken: TURSO_TOKEN
  });
  
  // Clear existing builtin recipes
  await client.execute("DELETE FROM recipes WHERE type = 'builtin'");
  console.log('🗑️  Cleared existing built-in recipes');
  
  // Insert each level
  for (const level of levels) {
    await client.execute({
      sql: `INSERT INTO recipes (
        id, type, name, category, dietary_category, level_num,
        prep_time, servings,
        recipe, recipe_ingredients, recipe_instructions,
        food_supply, tools, animal_spawns,
        submitted_by, status, created_at
      ) VALUES (?, 'builtin', ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'System', 'approved', datetime('now'))`,
      args: [
        `builtin-${level.id}`,
        level.name || '',
        level.category || '',
        level.dietaryCategory || null,
        level.levelNum || null,
        level.prepTime || null,
        level.servings || null,
        JSON.stringify(level.recipe || []),
        JSON.stringify(level.recipeIngredients || []),
        JSON.stringify(level.recipeInstructions || []),
        JSON.stringify(level.foodSupply || {}),
        JSON.stringify(level.tools || []),
        JSON.stringify(level.animalSpawns || [])
      ]
    });
    console.log(`   ✅ ${level.name}`);
  }
  
  // Verify count
  const result = await client.execute("SELECT COUNT(*) as count FROM recipes WHERE type = 'builtin'");
  console.log(`\n🎉 Seeded ${result.rows[0].count} built-in recipes to Turso`);
}

// Main
const tsFile = 'src/lib/farmers-basket/game-state.svelte.ts';
console.log(`📖 Parsing levels from ${tsFile}...`);
const levels = parseLevelsFromFile(tsFile);
console.log(`   Found ${levels.length} levels\n`);

console.log('🌱 Seeding to Turso...');
await seedToTurso(levels);
