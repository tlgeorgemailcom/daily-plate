#!/usr/bin/env node
/**
 * Migration script: Copy built-in recipes (LEVELS) from game-state.svelte.ts into Turso.
 * Safe to re-run - uses INSERT OR REPLACE (upsert by id).
 *
 * Usage:
 *   node scripts/copy-builtin-to-turso.mjs
 *   node scripts/copy-builtin-to-turso.mjs --dry-run
 */

import { readFileSync } from 'fs';
import { createClient } from '@libsql/client';
import { fileURLToPath } from 'url';
import path from 'path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const isDryRun = process.argv.includes('--dry-run');

// ── Load .env.local ──────────────────────────────────────────────────────────
function loadEnv() {
  const envPath = path.join(__dirname, '..', '.env.local');
  const lines = readFileSync(envPath, 'utf8').split('\n');
  const env = {};
  for (const line of lines) {
    const match = line.match(/^([A-Z_]+)=(.+)$/);
    if (match) env[match[1]] = match[2].trim();
  }
  return env;
}

// ── Extract LEVELS array from game-state.svelte.ts ──────────────────────────
function extractLevels() {
  const filePath = path.join(__dirname, '../src/lib/farmers-basket/game-state.svelte.ts');
  const src = readFileSync(filePath, 'utf8');

  // Find the LEVELS array: from "= [" on line 101 to "];" on line 905
  const marker = 'export const LEVELS: Level[] = [';
  const startIdx = src.indexOf(marker);
  if (startIdx === -1) throw new Error('Could not find LEVELS array');

  const arrayStart = startIdx + marker.length - 1; // points at the final '[' of the marker
  
  // Find the matching closing bracket
  let depth = 0;
  let arrayEnd = -1;
  for (let i = arrayStart; i < src.length; i++) {
    if (src[i] === '[') depth++;
    else if (src[i] === ']') {
      depth--;
      if (depth === 0) { arrayEnd = i; break; }
    }
  }
  if (arrayEnd === -1) throw new Error('Could not find end of LEVELS array');

  const arrayStr = src.slice(arrayStart, arrayEnd + 1);

  // Eval the array in a safe context (it's our own source code)
  const fn = new Function(`return ${arrayStr}`);
  return fn();
}

// ── Main ─────────────────────────────────────────────────────────────────────
async function main() {
  const env = loadEnv();
  const levels = extractLevels();
  console.log(`Found ${levels.length} built-in levels`);

  if (isDryRun) {
    console.log('DRY RUN - first 3 levels:');
    levels.slice(0, 3).forEach(l => console.log(`  ${l.id} - ${l.name} (${l.category})`));
    console.log('  ...');
    console.log('DRY RUN complete. No data written.');
    return;
  }

  const db = createClient({
    url: env.TURSO_DATABASE_URL,
    authToken: env.TURSO_AUTH_TOKEN,
  });

  let inserted = 0;
  let skipped = 0;

  for (const level of levels) {
    // Normalize animalSpawns: game-state uses delay in ms, but approved API
    // divides by 1000. Store raw ms so both paths round-trip correctly.
    const animalSpawns = (level.animalSpawns || []).map(spawn => ({
      type: spawn.type,
      delay: spawn.delay,  // store as-is (ms)
      ...(spawn.from ? { from: spawn.from } : {}),
    }));

    try {
      await db.execute({
        sql: `INSERT OR REPLACE INTO recipes (
          id, name, type, status, category, dietary_category, level_num,
          recipe, food_supply, animal_spawns, tools,
          prep_time, servings, recipe_instructions, recipe_ingredients,
          submitted_by, created_at
        ) VALUES (?, ?, 'builtin', 'approved', ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NULL, datetime('now'))`,
        args: [
          level.id,
          level.name,
          level.category || null,
          level.dietaryCategory || null,
          level.levelNum ?? null,
          JSON.stringify(level.recipe || []),
          JSON.stringify(level.foodSupply || {}),
          JSON.stringify(animalSpawns),
          JSON.stringify(level.tools || []),
          level.prepTime ?? null,
          level.servings ?? null,
          JSON.stringify(level.recipeInstructions || []),
          JSON.stringify(level.recipeIngredients || []),
        ],
      });
      console.log(`  ✅ ${level.id} - ${level.name}`);
      inserted++;
    } catch (err) {
      console.error(`  ❌ ${level.id} - ${level.name}: ${err.message}`);
      skipped++;
    }
  }

  console.log(`\nDone: ${inserted} inserted/updated, ${skipped} failed`);
  process.exit(0);
}

main().catch(err => { console.error(err); process.exit(1); });
