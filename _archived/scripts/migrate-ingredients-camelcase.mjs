#!/usr/bin/env node
/**
 * One-time migration: remap recipe_ingredients_json and recipe_instructions_json
 * in ALL dev_recipes rows (including locked ones) from snake_case to camelCase.
 *
 * Run once:
 *   node scripts/migrate-ingredients-camelcase.mjs
 *
 * Dry-run (print diffs, no writes):
 *   node scripts/migrate-ingredients-camelcase.mjs --dry-run
 */

import { createClient } from '@libsql/client';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const BASE = '/Volumes/training/Daily Food Chain/daily-food-chain';
const ENV_FILES = [resolve(BASE, '.env.local'), resolve(BASE, '.env')];

// ── Load env files (later files do not override earlier) ─────────────────────
function parseEnv(raw) {
  const env = {};
  for (const line of raw.split('\n')) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*"?([^"#\n]*)"?\s*$/i);
    if (m) env[m[1]] = m[2].trim();
  }
  return env;
}

for (const envFile of ENV_FILES) {
  try {
    const raw = readFileSync(envFile, 'utf8');
    const parsed = parseEnv(raw);
    for (const [k, v] of Object.entries(parsed)) {
      if (!process.env[k]) process.env[k] = v;
    }
  } catch {
    // file missing — skip
  }
}

const TURSO_URL   = process.env.TURSO_DATABASE_URL?.trim();
const TURSO_TOKEN = process.env.TURSO_AUTH_TOKEN?.trim();

if (!TURSO_URL || !TURSO_TOKEN) {
  console.error('Missing TURSO_DATABASE_URL or TURSO_AUTH_TOKEN in .env.local / .env');
  process.exit(1);
}

const dryRun = process.argv.includes('--dry-run');

// ── Normalize one ingredient row ──────────────────────────────────────────────
function normalizeIngredient(ing) {
  return {
    rowOrder:     ing.rowOrder     ?? ing.row_order     ?? 0,
    rowType:      ing.rowType      ?? ing.row_type      ?? 'ingredient',
    isDish:       ing.isDish       ?? (ing.row_type === 'dish' || false),
    name:         ing.name         ?? ing.ing_name      ?? '',
    quantity:     ing.quantity     ?? ing.ing_qty       ?? '',
    ndbNo:        ing.ndbNo        ?? ing.ndb_no        ?? '',
    foodWord:     ing.foodWord     ?? ing.food_word     ?? '',
    portionDesc:  ing.portionDesc  ?? ing.portion_desc  ?? '',
    portionGrams: ing.portionGrams ?? ing.portion_grams ?? null,
    servingCount: ing.servingCount ?? ing.serving_count ?? null,
    notes:        ing.notes        ?? '',
    gameFood:     ing.gameFood     ?? ing.game_food     ?? '',
    animal:       ing.animal       ?? '',
    exempt:       ing.exempt       ?? false,
  };
}

// ── Normalize one instruction ─────────────────────────────────────────────────
function normalizeInstruction(step) {
  if (typeof step === 'string') return step;
  return step.text ?? step.step_text ?? '';
}

// ── Main ──────────────────────────────────────────────────────────────────────
const db = createClient({ url: TURSO_URL, authToken: TURSO_TOKEN });

const result = await db.execute('SELECT recipe_id, recipe_ingredients_json, recipe_instructions_json FROM dev_recipes');

let updated = 0;
let skipped = 0;
let failed  = 0;

for (const row of result.rows) {
  const recipeId = row.recipe_id;

  let ingredients, instructions;
  try {
    ingredients  = JSON.parse(String(row.recipe_ingredients_json  || '[]'));
    instructions = JSON.parse(String(row.recipe_instructions_json || '[]'));
  } catch (e) {
    console.error(`[SKIP] ${recipeId}: JSON parse error — ${e.message}`);
    failed++;
    continue;
  }

  const normalized = ingredients.map(normalizeIngredient);
  const normalizedInstr = instructions.map(normalizeInstruction);

  // Check if already camelCase (skip if no snake_case keys present)
  const hasSnakeCase = ingredients.some(
    (ing) => 'ing_name' in ing || 'ndb_no' in ing || 'row_type' in ing || 'ing_qty' in ing
  );
  const instrNeedsUpdate = instructions.some((s) => typeof s !== 'string');

  if (!hasSnakeCase && !instrNeedsUpdate) {
    console.log(`[OK]   ${recipeId}: already camelCase, skipping`);
    skipped++;
    continue;
  }

  if (dryRun) {
    console.log(`[DRY]  ${recipeId}: would remap ${ingredients.length} ingredient(s), ${instructions.length} instruction(s)`);
    updated++;
    continue;
  }

  try {
    await db.execute({
      sql: `UPDATE dev_recipes
            SET recipe_ingredients_json  = ?,
                recipe_instructions_json = ?
            WHERE recipe_id = ?`,
      args: [
        JSON.stringify(normalized),
        JSON.stringify(normalizedInstr),
        recipeId,
      ],
    });
    console.log(`[DONE] ${recipeId}: remapped ${ingredients.length} ingredient(s), ${instructions.length} instruction(s)`);
    updated++;
  } catch (e) {
    console.error(`[FAIL] ${recipeId}: ${e.message}`);
    failed++;
  }
}

console.log(`\nSummary: updated=${updated}  skipped=${skipped}  failed=${failed}`);
await db.close();
