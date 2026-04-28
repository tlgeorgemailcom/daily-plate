#!/usr/bin/env node

import { createClient } from '@libsql/client';
import { readFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { ADDED_SUGAR_RULES } from './added-sugar-rules.mjs';

const BASE = '/Volumes/training/Daily Food Chain/daily-food-chain';
const RECIPES_CSV = resolve(BASE, 'src/lib/data/recipes.csv');
const INGREDIENTS_CSV = resolve(BASE, 'src/lib/data/recipe_ingredients.csv');
const FOOD_PORTIONS_CSV = resolve(BASE, 'food-portions-complete.csv');
const COMBOO_DB = '/Users/macminidata/vscode/jetfooddata/jetcool/assets/comboo.db';
const LOCAL_RECIPES_DB = resolve(BASE, 'recipes_dev.db');
const DEFAULT_RECIPE_ID = 'SWEET_001';
const NUTRIENT_VERSION = 'dev-recipes-v1';
const RETENTION_MODEL_VERSION = 'retained-weight-v1';
const SOURCE_MATCH_VERSION = 'canonical-first-defect-fallback-v1';

const NUTRIENT_COLS = [
  'Energy_KCal', 'Water', 'Protein', 'TotalLipidFat', 'Carbohydrate',
  'FiberTotalDietary', 'SugarsTotal', 'Cholesterol',
  'FattyAcids_totalSaturated', 'FattyAcids_totalMonounsaturated',
  'FattyAcids_totalPolyunsaturated',
  'LinoleicAcid', 'alphaLinolenicAcid',
  'EPA_20_5n3', 'DPA_22_5n3', 'DHA_22_6n3', 'omega3', 'omega6',
  'VitaminA_RAE', 'Retinol', 'Carotene_beta',
  'VitaminD', 'VitaminE_alphaTocopherol', 'VitaminK_phylloquinone',
  'VitaminC_totalAscorbicAcid', 'Thiamin', 'Riboflavin', 'Niacin',
  'PantothenicAcid', 'VitaminB6',
  'Folate_total', 'Folate_food', 'Folate_DFE', 'FolicAcid',
  'VitaminB12', 'Choline_total', 'Betaine',
  'LuteinZeaxanthin', 'Lycopene',
  'Calcium_Ca', 'Iron_Fe', 'Magnesium_Mg', 'Phosphorus_P',
  'Potassium_K', 'Sodium_Na', 'Zinc_Zn', 'Copper_Cu',
  'Manganese_Mn', 'Selenium_Se',
  'Tryptophan', 'Threonine', 'Isoleucine', 'Leucine',
  'Lysine', 'Methionine', 'Cystine', 'Phenylalanine',
  'Tyrosine', 'Valine', 'Arginine', 'Histidine',
  'Alanine', 'AsparticAcid', 'GlutamicAcid', 'Glycine', 'Proline', 'Serine'
];

const BUILT_TO_CANONICAL = {
  kcal: 'Energy_KCal',
  protein: 'Protein',
  fat: 'TotalLipidFat',
  carbs: 'Carbohydrate',
  fiber: 'FiberTotalDietary',
  sugar: 'SugarsTotal',
  water: 'Water',
  sodium: 'Sodium_Na',
  calcium: 'Calcium_Ca',
  iron: 'Iron_Fe',
  potassium: 'Potassium_K',
  vitaminC: 'VitaminC_totalAscorbicAcid',
  vitaminA: 'VitaminA_RAE',
  cholesterol: 'Cholesterol',
  saturatedFat: 'FattyAcids_totalSaturated',
  monoFat: 'FattyAcids_totalMonounsaturated',
  polyFat: 'FattyAcids_totalPolyunsaturated',
  omega3: 'omega3',
  omega6: 'omega6'
};

function loadEnvFile(filePath) {
  if (!existsSync(filePath)) return;
  const text = readFileSync(filePath, 'utf8');
  for (const rawLine of text.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith('#')) continue;
    const idx = line.indexOf('=');
    if (idx === -1) continue;
    const key = line.slice(0, idx).trim();
    const value = line.slice(idx + 1).trim();
    if (!(key in process.env)) process.env[key] = value;
  }
}

function parseCsv(text) {
  const rows = [];
  let row = [];
  let cell = '';
  let inQuotes = false;

  for (let i = 0; i < text.length; i += 1) {
    const ch = text[i];
    if (inQuotes) {
      if (ch === '"') {
        if (text[i + 1] === '"') {
          cell += '"';
          i += 1;
        } else {
          inQuotes = false;
        }
      } else {
        cell += ch;
      }
      continue;
    }
    if (ch === '"') {
      inQuotes = true;
    } else if (ch === ',') {
      row.push(cell);
      cell = '';
    } else if (ch === '\n') {
      row.push(cell);
      rows.push(row);
      row = [];
      cell = '';
    } else if (ch !== '\r') {
      cell += ch;
    }
  }
  if (cell.length > 0 || row.length > 0) {
    row.push(cell);
    rows.push(row);
  }
  const [header, ...body] = rows;
  return body.filter(r => r.length && r.some(v => v !== '')).map(cols => Object.fromEntries(header.map((h, idx) => [h, cols[idx] ?? ''])));
}

function parseServingsCount(servingsText) {
  if (!servingsText) return 1;
  const match = servingsText.match(/(\d+(?:\.\d+)?)/);
  if (!match) return 1;
  const value = Number.parseFloat(match[1]);
  return Number.isFinite(value) && value > 0 ? value : 1;
}

function parseNotes(notes) {
  const flags = new Set();
  const values = {};
  if (!notes) return { flags, values };
  for (const part of notes.split(';')) {
    const token = part.trim();
    if (!token) continue;
    if (token.includes('=')) {
      const [key, value] = token.split('=', 2);
      values[key.trim().toLowerCase()] = value.trim();
    } else {
      flags.add(token.toLowerCase());
    }
  }
  return { flags, values };
}

function round2(value) {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function parseAddedSugarOverride(notes) {
  const { values } = parseNotes(notes);
  const rawRatio = values.addedsugar_ratio || values.added_sugar_ratio;
  if (rawRatio != null) {
    const ratio = Number.parseFloat(String(rawRatio));
    if (Number.isFinite(ratio)) {
      return { ratio: clamp(ratio, 0, 1), estimated: false, reason: 'notes_ratio' };
    }
  }

  const rawFlag = String(values.addedsugar || values.added_sugar || '').toLowerCase();
  if (rawFlag === 'all' || rawFlag === 'true' || rawFlag === 'yes') {
    return { ratio: 1, estimated: false, reason: 'notes_all' };
  }
  if (rawFlag === 'none' || rawFlag === 'false' || rawFlag === 'no') {
    return { ratio: 0, estimated: false, reason: 'notes_none' };
  }
  return null;
}

function inferAddedSugarRatio(longDesc) {
  const text = String(longDesc || '').toLowerCase();
  if (!text) return { ratio: 0, estimated: true, reason: 'missing_long_desc' };

  const allAddedSugarPatterns = [
    /\bsugars?\b/,
    /\bbrown\s+sugars?\b/,
    /\bpowdered\s+sugars?\b/,
    /\bconfectioners?\s+sugars?\b/,
    /\bcorn\s+syrup\b/,
    /\bhigh\s+fructose\b/,
    /\bhfcs\b/,
    /\bmolasses\b/,
    /\bhoney\b/,
    /\bmaple\s+syrup\b/,
    /\bagave\b/,
    /\bfructose\b/,
    /\bdextrose\b/,
    /\bglucose\b/,
    /\bsucrose\b/,
    /\bmaltose\b/,
    /\bcane\s+syrup\b/,
    /\binvert\s+sugar\b/,
    /\bsimple\s+syrup\b/
  ];
  if (allAddedSugarPatterns.some((pattern) => pattern.test(text))) {
    return { ratio: 1, estimated: false, reason: 'keyword_all_added' };
  }

  const noneAddedKeywords = [
    'apple', 'banana', 'berry', 'orange', 'grape', 'date', 'raisin', 'fig',
    'milk', 'yogurt, plain', 'plain yogurt', 'lactose', 'fruit', 'vegetable'
  ];
  if (noneAddedKeywords.some((k) => text.includes(k))) {
    return { ratio: 0, estimated: false, reason: 'keyword_intrinsic' };
  }

  const partialKeywords = [
    'ketchup', 'barbecue sauce', 'teriyaki', 'sweetened', 'jam', 'jelly', 'preserves'
  ];
  if (partialKeywords.some((k) => text.includes(k))) {
    return { ratio: 0.5, estimated: true, reason: 'keyword_partial' };
  }

  return { ratio: 0, estimated: true, reason: 'default_intrinsic' };
}

async function estimateAddedSugarWhole(combooDb, ingredientRows) {
  const ndbNos = Array.from(
    new Set(
      ingredientRows
        .filter((row) => ['ingredient', 'dish_ingredient', 'exempt'].includes(row.row_type))
        .map((row) => String(row.ndb_no || '').trim())
        .filter(Boolean)
    )
  );

  const nutrientByNdb = new Map();
  if (ndbNos.length > 0) {
    const placeholders = ndbNos.map(() => '?').join(', ');
    const result = await combooDb.execute({
      sql: `SELECT NDB_NO, SugarsTotal, Long_Desc FROM DataCentralCombo WHERE NDB_NO IN (${placeholders})`,
      args: ndbNos,
    });
    for (const row of result.rows) {
      nutrientByNdb.set(String(row.NDB_NO), {
        sugarsPer100g: Number(row.SugarsTotal || 0),
        longDesc: String(row.Long_Desc || ''),
      });
    }
  }

  let addedWhole = 0;
  let estimated = false;
  const reasons = new Set();

  for (const row of ingredientRows) {
    if (!['ingredient', 'dish_ingredient', 'exempt'].includes(row.row_type)) continue;
    const { flags, values } = parseNotes(row.notes);
    if (flags.has('optional')) continue;

    const portionGrams = Number.parseFloat(row.portion_grams || '0');
    if (!Number.isFinite(portionGrams) || portionGrams <= 0) continue;
    const servingCount = Number.parseFloat(row.serving_count || '1');
    let grams = portionGrams;
    if (values.retained) {
      const retained = Number.parseFloat(values.retained);
      if (Number.isFinite(retained)) grams *= retained;
    }
    const gramsUsed = grams * (Number.isFinite(servingCount) && servingCount > 0 ? servingCount : 1);
    if (gramsUsed <= 0) continue;

    const ndbNo = String(row.ndb_no || '').trim();
    const nutrient = nutrientByNdb.get(ndbNo);
    if (!nutrient) continue;

    const sugarsWhole = round2((nutrient.sugarsPer100g || 0) * gramsUsed / 100);
    if (sugarsWhole <= 0) continue;

    const override = parseAddedSugarOverride(row.notes);
    const ndbRule = ADDED_SUGAR_RULES.get(ndbNo);
    const ndbDecision = ndbRule
      ? {
          ratio: ndbRule.policy === 'all_added' ? 1 : ndbRule.policy === 'none_added' ? 0 : (ndbRule.ratio ?? 0),
          estimated: false,
          reason: `ndb_rule:${ndbRule.reason}`,
        }
      : null;
    const decision = override || ndbDecision || inferAddedSugarRatio(nutrient.longDesc);
    if (decision.estimated) estimated = true;
    reasons.add(decision.reason);
    addedWhole += sugarsWhole * decision.ratio;
  }

  return {
    addedWhole: round2(addedWhole),
    estimated,
    reasons: Array.from(reasons),
  };
}

function pickCanonicalServingGrams(foodRow) {
  if (!foodRow) return null;
  let fallback = null;
  for (let idx = 0; idx <= 12; idx += 1) {
    const desc = String(foodRow[`M${idx}_Desc`] || '').trim().toLowerCase();
    const grams = Number.parseFloat(String(foodRow[`M${idx}_Gm`] || ''));
    if (!desc || !Number.isFinite(grams) || grams <= 0) continue;
    if (desc === 'custom (g)') {
      fallback = grams;
      continue;
    }
    if (desc === 'oz') continue;
    return grams;
  }
  return fallback;
}

function isDefectiveCanonical(canonicalValue, builtValue) {
  if (canonicalValue == null || !Number.isFinite(canonicalValue)) return true;
  if (canonicalValue === 0 && builtValue != null && Number.isFinite(builtValue) && builtValue !== 0) return true;
  return false;
}

function macroSnapshot(perServing) {
  return {
    cal: round2(perServing.Energy_KCal || 0),
    pro: round2(perServing.Protein || 0),
    fat: round2(perServing.TotalLipidFat || 0),
    carb: round2(perServing.Carbohydrate || 0),
    fib: round2(perServing.FiberTotalDietary || 0),
    h2o: round2(perServing.Water || 0),
    sug: round2(perServing.SugarsTotal || 0)
  };
}

async function loadCanonicalWhole(combooDb, ndbNo, totalRecipeGrams) {
  const sql = `SELECT ${NUTRIENT_COLS.join(', ')}, Long_Desc FROM DataCentralCombo WHERE NDB_NO = ? LIMIT 1`;
  const result = await combooDb.execute({ sql, args: [ndbNo] });
  const row = result.rows[0];
  if (!row) throw new Error(`Canonical NDB ${ndbNo} not found in DataCentralCombo`);
  const scale = totalRecipeGrams / 100;
  const whole = {};
  for (const col of NUTRIENT_COLS) {
    whole[col] = round2(Number(row[col] || 0) * scale);
  }
  return {
    whole,
    longDesc: String(row.Long_Desc || '')
  };
}

async function loadBuiltRecipe(localDb, recipeId) {
  const result = await localDb.execute({
    sql: `SELECT id, name, category, dietary_category, prep_time, servings, recipe, animal_spawns, food_supply,
                 recipe_ingredients, recipe_instructions, link_type, nutrition_json, image_url
          FROM recipes WHERE id = ? LIMIT 1`,
    args: [recipeId]
  });
  const row = result.rows[0];
  if (!row) throw new Error(`Local built recipe ${recipeId} not found in recipes_dev.db recipes table`);
  return row;
}

async function loadRemoteExisting(remoteDb, recipeId) {
  const result = await remoteDb.execute({
    sql: 'SELECT recipe_id, updated_at FROM dev_recipes WHERE recipe_id = ? LIMIT 1',
    args: [recipeId]
  });
  return result.rows[0] || null;
}

async function main() {
  loadEnvFile(resolve(BASE, '.env.local'));
  loadEnvFile(resolve(BASE, '.env'));

  const recipeId = process.argv[2] || DEFAULT_RECIPE_ID;
  const url = process.env.TURSO_DATABASE_URL?.trim();
  const authToken = process.env.TURSO_AUTH_TOKEN?.trim();
  if (!url || !authToken) {
    throw new Error('Missing TURSO_DATABASE_URL or TURSO_AUTH_TOKEN after loading .env files');
  }

  const recipes = parseCsv(readFileSync(RECIPES_CSV, 'utf8'));
  const ingredients = parseCsv(readFileSync(INGREDIENTS_CSV, 'utf8'));
  const foodPortions = parseCsv(readFileSync(FOOD_PORTIONS_CSV, 'utf8'));
  const recipeMeta = recipes.find(row => row.recipe_id === recipeId);
  if (!recipeMeta) throw new Error(`Recipe ${recipeId} not found in recipes.csv`);
  const ingredientRows = ingredients.filter(row => row.recipe_id === recipeId);
  if (ingredientRows.length === 0) throw new Error(`No ingredient rows found for ${recipeId}`);

  const dishRow = ingredientRows.find(row => row.row_type === 'dish');
  if (!dishRow) throw new Error(`Dish row not found for ${recipeId}`);
  const hasCanonicalNdb = Boolean(dishRow.ndb_no);

  const servingsCount = parseServingsCount(recipeMeta.servings);
  if (!servingsCount) throw new Error(`Unable to parse servings count from recipes.csv for ${recipeId}`);

  const canonicalFoodRow = foodPortions.find((row) => row.NDB_NO === String(dishRow.ndb_no || ''))
    || foodPortions.find((row) => row.word === String(recipeMeta.food_word || ''));
  const canonicalServingGrams = pickCanonicalServingGrams(canonicalFoodRow);

  let totalRecipeGrams = 0;
  for (const row of ingredientRows) {
    if (!['ingredient', 'dish_ingredient', 'exempt'].includes(row.row_type)) continue;
    const { flags, values } = parseNotes(row.notes);
    if (flags.has('optional')) continue;
    const portionGrams = Number.parseFloat(row.portion_grams || '0');
    if (!Number.isFinite(portionGrams) || portionGrams <= 0) continue;
    const servingCount = Number.parseFloat(row.serving_count || '1');
    let grams = portionGrams;
    if (values.retained) {
      const retained = Number.parseFloat(values.retained);
      if (Number.isFinite(retained)) grams *= retained;
    }
    totalRecipeGrams += grams * (Number.isFinite(servingCount) && servingCount > 0 ? servingCount : 1);
  }
  totalRecipeGrams = round2(totalRecipeGrams);
  const gramsPerServing = round2(canonicalServingGrams || (totalRecipeGrams / servingsCount));

  const localDb = createClient({ url: pathToFileURL(LOCAL_RECIPES_DB).href });
  const combooDb = createClient({ url: pathToFileURL(COMBOO_DB).href });
  const remoteDb = createClient({ url, authToken });

  const builtRow = await loadBuiltRecipe(localDb, recipeId);
  const builtNutrition = JSON.parse(String(builtRow.nutrition_json || '{}'));

  let canonicalWhole, longDesc;
  if (hasCanonicalNdb) {
    ({ whole: canonicalWhole, longDesc } = await loadCanonicalWhole(combooDb, dishRow.ndb_no, totalRecipeGrams));
  } else {
    // No canonical NDB — build the whole from ingredient-computed nutrition
    canonicalWhole = {};
    for (const [builtKey, canonicalKey] of Object.entries(BUILT_TO_CANONICAL)) {
      canonicalWhole[canonicalKey] = round2(Number(builtNutrition[builtKey] || 0));
    }
    longDesc = '';
  }

  const mergedWhole = { ...canonicalWhole };
  const fallback = [];
  if (hasCanonicalNdb) {
    for (const [builtKey, canonicalKey] of Object.entries(BUILT_TO_CANONICAL)) {
      const builtValue = Number(builtNutrition[builtKey] || 0);
      const canonicalValue = Number(canonicalWhole[canonicalKey] || 0);
      if (isDefectiveCanonical(canonicalValue, builtValue)) {
        mergedWhole[canonicalKey] = round2(builtValue);
        fallback.push(canonicalKey);
      }
    }
  }

  const mergedPerServing = {};
  const mergedPer100g = {};
  for (const col of NUTRIENT_COLS) {
    mergedPer100g[col] = round2((mergedWhole[col] || 0) * 100 / totalRecipeGrams);
    mergedPerServing[col] = round2((mergedPer100g[col] || 0) * gramsPerServing / 100);
  }

  const addedSugarEstimate = await estimateAddedSugarWhole(combooDb, ingredientRows);
  const totalSugarPer100g = Number(mergedPer100g.SugarsTotal || 0);
  const addedSugarsPer100g = round2(
    totalRecipeGrams > 0
      ? clamp((addedSugarEstimate.addedWhole * 100) / totalRecipeGrams, 0, totalSugarPer100g)
      : 0
  );
  const intrinsicSugarsPer100g = round2(Math.max(0, totalSugarPer100g - addedSugarsPer100g));
  mergedPer100g.AddedSugars = addedSugarsPer100g;
  mergedPer100g.IntrinsicSugars = intrinsicSugarsPer100g;
  mergedPerServing.AddedSugars = round2(addedSugarsPer100g * gramsPerServing / 100);
  mergedPerServing.IntrinsicSugars = round2(intrinsicSugarsPer100g * gramsPerServing / 100);

  const perServingMacros = macroSnapshot(mergedPerServing);
  // Keep micros aligned to per100g units for UI consistency.
  const micros = Object.fromEntries(
    Object.entries(mergedPer100g).filter(([key]) => ![
      'Energy_KCal', 'Protein', 'TotalLipidFat', 'Carbohydrate', 'FiberTotalDietary', 'Water', 'SugarsTotal'
    ].includes(key))
  );

  const perServing = {
    ...perServingMacros,
    AddedSugars: mergedPerServing.AddedSugars,
    IntrinsicSugars: mergedPerServing.IntrinsicSugars,
  };

  const nutritionJson = {
    ...perServingMacros,
    perServing,
    micros,
    gramsPerServing,
    servings: servingsCount,
    per100g: mergedPer100g,
    addedSugars: mergedPerServing.AddedSugars,
    intrinsicSugars: mergedPerServing.IntrinsicSugars,
    isAddedSugarsEstimated: addedSugarEstimate.estimated,
    addedSugarsBasis: addedSugarEstimate.reasons,
    nutrientVersion: NUTRIENT_VERSION,
    retentionModelVersion: RETENTION_MODEL_VERSION,
    sourceMatchVersion: SOURCE_MATCH_VERSION,
    sourceNdbNo: dishRow.ndb_no || null,
    sourceLongDesc: longDesc || null,
    mergeBasis: hasCanonicalNdb ? 'whole_recipe' : 'ingredient_build'
  };

  const sourceKcal = hasCanonicalNdb ? round2(canonicalWhole.Energy_KCal || 0) : 0;
  const reconstructedKcal = round2(Number(builtNutrition.kcal || 0));
  const gapPct = hasCanonicalNdb && sourceKcal !== 0
    ? round2(((reconstructedKcal - sourceKcal) / sourceKcal) * 100)
    : null;

  let gapStatus, validationNotes;
  if (!hasCanonicalNdb) {
    gapStatus = 'build_only';
    validationNotes = [
      'basis=ingredient_build',
      'canonical_primary=false',
      'no_canonical_ndb=true',
      `sr28_rule=${String(recipeMeta.sr28_rule || 'unknown')}`
    ].join('; ');
  } else {
    const macroKeys = ['Energy_KCal', 'Protein', 'TotalLipidFat', 'Carbohydrate', 'Water'];
    const macrosWithin5Pct = macroKeys.every((key) => {
      const c = Number(canonicalWhole[key] || 0);
      const b = key === 'Energy_KCal'
        ? Number(builtNutrition.kcal || 0)
        : key === 'Protein'
          ? Number(builtNutrition.protein || 0)
          : key === 'TotalLipidFat'
            ? Number(builtNutrition.fat || 0)
            : key === 'Carbohydrate'
              ? Number(builtNutrition.carbs || 0)
              : Number(builtNutrition.water || 0);
      if (!c) return true;
      return Math.abs((b - c) / c) <= 0.05;
    });
    const anomalyNames = [];
    for (const [builtKey, canonicalKey] of Object.entries(BUILT_TO_CANONICAL)) {
      const c = Number(canonicalWhole[canonicalKey] || 0);
      const b = Number(builtNutrition[builtKey] || 0);
      if (!c || !Number.isFinite(c) || !Number.isFinite(b)) continue;
      if (Math.abs((b - c) / c) > 0.05 && !fallback.includes(canonicalKey)) {
        anomalyNames.push(canonicalKey);
      }
    }
    gapStatus = fallback.length > 0
      ? 'fallback_used'
      : (macrosWithin5Pct ? 'strong_match' : 'needs_review');
    validationNotes = [
      'basis=whole_recipe',
      'canonical_primary=true',
      `fallback=${fallback.length ? fallback.join(',') : 'none'}`,
      `major_anomalies=${anomalyNames.length ? anomalyNames.join(',') : 'none'}`,
      `macros_within_5pct=${macrosWithin5Pct}`
    ].join('; ');
  }

  const existing = await loadRemoteExisting(remoteDb, recipeId);

  const args = [
    recipeId,
    String(recipeMeta.food_word || ''),
    String(recipeMeta.recipe_name || builtRow.name || ''),
    null,
    null,
    servingsCount,
    gramsPerServing,
    String(recipeMeta.servings || ''),
    null,
    String(builtRow.recipe_ingredients || '[]'),
    String(builtRow.recipe_instructions || '[]'),
    JSON.stringify(nutritionJson),
    NUTRIENT_VERSION,
    RETENTION_MODEL_VERSION,
    SOURCE_MATCH_VERSION,
    String(dishRow.ndb_no),
    longDesc,
    JSON.stringify({ servingsCount, gramsPerServing, servingsLabel: String(recipeMeta.servings || '') }),
    sourceKcal,
    reconstructedKcal,
    gapPct,
    gapStatus,
    validationNotes,
    'published',
    String(recipeMeta.category || builtRow.category || ''),
    String(recipeMeta.dietary_category || builtRow.dietary_category || ''),
    String(recipeMeta.prep_time || builtRow.prep_time || ''),
    String(recipeMeta.servings || builtRow.servings || ''),
    String(builtRow.recipe || '[]'),
    String(builtRow.animal_spawns || '[]'),
    String(builtRow.image_url || ''),
    null,
    String(builtRow.food_supply || '{}')
  ];

  await remoteDb.execute({
    sql: `INSERT INTO dev_recipes (
      recipe_id, food_word, recipe_name, dish_family, cooking_method,
      servings_count, grams_per_serving, serving_label, serving_options_json,
      recipe_ingredients_json, recipe_instructions_json, nutrition_json,
      nutrient_version, retention_model_version, source_match_version,
      source_ndb_no, source_long_desc, source_servings_json,
      source_kcal, reconstructed_kcal, gap_pct, gap_status, validation_notes,
      status, category, dietary_category, prep_time, servings,
      recipe, animal_spawns, image_url, submitted_by, food_supply,
      updated_at, created_at
    ) VALUES (
      ?, ?, ?, ?, ?,
      ?, ?, ?, ?,
      ?, ?, ?,
      ?, ?, ?,
      ?, ?, ?,
      ?, ?, ?, ?, ?,
      ?, ?, ?, ?, ?,
      ?, ?, ?, ?, ?,
      datetime('now'), datetime('now')
    )
    ON CONFLICT(recipe_id) DO UPDATE SET
      food_word = excluded.food_word,
      recipe_name = excluded.recipe_name,
      dish_family = excluded.dish_family,
      cooking_method = excluded.cooking_method,
      servings_count = excluded.servings_count,
      grams_per_serving = excluded.grams_per_serving,
      serving_label = excluded.serving_label,
      serving_options_json = excluded.serving_options_json,
      recipe_ingredients_json = excluded.recipe_ingredients_json,
      recipe_instructions_json = excluded.recipe_instructions_json,
      nutrition_json = excluded.nutrition_json,
      nutrient_version = excluded.nutrient_version,
      retention_model_version = excluded.retention_model_version,
      source_match_version = excluded.source_match_version,
      source_ndb_no = excluded.source_ndb_no,
      source_long_desc = excluded.source_long_desc,
      source_servings_json = excluded.source_servings_json,
      source_kcal = excluded.source_kcal,
      reconstructed_kcal = excluded.reconstructed_kcal,
      gap_pct = excluded.gap_pct,
      gap_status = excluded.gap_status,
      validation_notes = excluded.validation_notes,
      status = excluded.status,
      category = excluded.category,
      dietary_category = excluded.dietary_category,
      prep_time = excluded.prep_time,
      servings = excluded.servings,
      recipe = excluded.recipe,
      animal_spawns = excluded.animal_spawns,
      image_url = excluded.image_url,
      submitted_by = excluded.submitted_by,
      food_supply = excluded.food_supply,
      updated_at = datetime('now')`,
    args
  });

  const uploaded = await remoteDb.execute({
    sql: `SELECT recipe_id, food_word, recipe_name, status, gap_status, source_ndb_no, updated_at
          FROM dev_recipes WHERE recipe_id = ? LIMIT 1`,
    args: [recipeId]
  });
  const row = uploaded.rows[0];

  console.log(`${existing ? 'Updated' : 'Inserted'} dev_recipes row for ${recipeId}`);
  console.log(JSON.stringify({
    recipeId: row?.recipe_id,
    foodWord: row?.food_word,
    recipeName: row?.recipe_name,
    status: row?.status,
    gapStatus: row?.gap_status,
    sourceNdbNo: row?.source_ndb_no,
    fallback,
    gramsPerServing,
    servingsCount,
    sourceKcal,
    reconstructedKcal,
    gapPct,
    updatedAt: row?.updated_at
  }, null, 2));
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
});
