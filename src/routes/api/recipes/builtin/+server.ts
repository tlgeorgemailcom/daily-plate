import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { queryAll, getGameDb } from '$lib/server/turso';
import { toDisplayRecipeCategory, toStoredRecipeCategory } from '$lib/farmers-basket/recipe-categories';
import { deleteRecipeImage, extractPublicId } from '$lib/server/cloudinary';
import { calcNutritionSR28 } from '$lib/server/calcNutritionSR28';

interface BuiltinRecipeRow {
  recipe_id: string;
  recipe_name: string;
  category: string;
  dietary_category: string | null;
  cooking_method: string | null;
  cook_minutes: number | null;
  cook_temp_f: number | null;
  dish_family: string | null;
  prep_time: string | null;
  servings: string | null;
  recipe: string | null;
  animal_spawns: string | null;
  recipe_instructions_json: string | null;
  recipe_ingredients_json: string | null;
  sections_json: string | null;
  nutrition_json: string | null;
  image_url: string | null;
  created_at: string;
  submitted_by: string;
}

interface NutritionJson {
  perServing: {
    cal: number;
    pro: number;
    fat: number;
    carb: number;
    fib: number;
    h2o: number;
    sug: number;
  };
  gramsPerServing: number;
  servings: number;
}

interface BuiltinOverride {
  id: string;
  name?: string;
  category?: string;
  dietaryCategory?: string;
  cookingMethod?: string;
  dishFamily?: string;
  prepTime?: string;
  servings?: string;
  recipe?: string[];
  animalSpawns?: { type: string; delay: number }[];
  recipeInstructions?: string[];
  recipeIngredients?: NutritionLinkIngredient[];
  nutritionJson?: NutritionJson | null;
  imageUrl?: string;
  editedAt: string;
  editedBy: string;
}

interface NewBuiltinRecipe {
  id: string;
  name: string;
  category: string;
  dietaryCategory: string;
  cookingMethod?: string;
  dishFamily?: string;
  prepTime?: string;
  servings?: string;
  recipe: string[];
  animalSpawns: { type: string; delay: number }[];
  recipeInstructions?: string[];
  recipeIngredients?: NutritionLinkIngredient[];
  nutritionJson?: NutritionJson | null;
  imageUrl?: string;
  createdAt: string;
}

type NutritionLinkIngredient = {
  name?: string;
  quantity?: string;
  foodWord?: string;
  ndbNo?: string;
  portionDesc?: string;
  portionGrams?: number;
  servingCount?: number;
  exempt?: boolean;
  isDish?: boolean;
};

function toFoodWord(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .replace(/-{2,}/g, '-');
}

function parseServingMeta(servings: string | null | undefined): { servingsCount: number | null; servingLabel: string | null } {
  if (!servings || !servings.trim()) {
    return { servingsCount: null, servingLabel: null };
  }

  const raw = servings.trim();
  const match = raw.match(/^(\d+(?:\.\d+)?)\s*(.*)$/);
  if (!match) {
    return { servingsCount: null, servingLabel: raw };
  }

  const count = Number(match[1]);
  const label = match[2]?.trim() || 'serving';
  return {
    servingsCount: Number.isFinite(count) ? count : null,
    servingLabel: label
  };
}

function deriveLinkType(ingredients: NutritionLinkIngredient[]): 'ingredient' | 'dish' | 'mixed' {
  const hasDish = ingredients.some((ing) => ing.isDish === true);
  const hasIngredientLinks = ingredients.some(
    (ing) => ing.isDish !== true && !!(ing.foodWord || ing.ndbNo) && typeof ing.portionGrams === 'number'
  );
  if (hasDish && hasIngredientLinks) return 'mixed';
  if (hasDish) return 'dish';
  return 'ingredient';
}

async function computeBuiltinNutrition(
  recipeIngredients: NutritionLinkIngredient[] | undefined,
  servings: string | null | undefined,
  cookingMethod: string | null | undefined,
  yieldFactorWater?: number,
  yieldFactorFat?: number
): Promise<{ gramsPerServing: number; nutritionJson: string }> {
  if (!recipeIngredients || recipeIngredients.length === 0) {
    return { gramsPerServing: 0, nutritionJson: '{}' };
  }

  const linkedRows = recipeIngredients.map((ing) => ({
    ndbNo: ing.ndbNo,
    foodWord: ing.foodWord,
    portionGrams: typeof ing.portionGrams === 'number' ? ing.portionGrams : undefined,
    servingCount: typeof ing.servingCount === 'number' ? ing.servingCount : undefined,
    exempt: ing.exempt === true,
    isDish: ing.isDish === true
  }));

  const linkType = deriveLinkType(recipeIngredients);
  const yieldOpts = {
    ...(typeof yieldFactorWater === 'number' ? { yieldFactorWater } : {}),
    ...(typeof yieldFactorFat   === 'number' ? { yieldFactorFat }   : {}),
  };
  const nutrition = await calcNutritionSR28(linkedRows, linkType, servings, cookingMethod, yieldOpts);

  if (!nutrition) {
    return { gramsPerServing: 0, nutritionJson: '{}' };
  }

  return {
    gramsPerServing: Number(nutrition.gramsPerServing) || 0,
    nutritionJson: JSON.stringify(nutrition)
  };
}

async function resolveBuiltinNutrition(
  explicitNutrition: unknown,
  recipeIngredients: NutritionLinkIngredient[] | undefined,
  servings: string | null | undefined,
  cookingMethod: string | null | undefined,
  yieldFactorWater?: number,
  yieldFactorFat?: number
): Promise<{ gramsPerServing: number; nutritionJson: string }> {
  if (explicitNutrition && typeof explicitNutrition === 'object') {
    const grams = Number((explicitNutrition as { gramsPerServing?: unknown }).gramsPerServing ?? 0);
    return {
      gramsPerServing: Number.isFinite(grams) && grams > 0 ? grams : 0,
      nutritionJson: JSON.stringify(explicitNutrition)
    };
  }
  return await computeBuiltinNutrition(recipeIngredients, servings, cookingMethod, yieldFactorWater, yieldFactorFat);
}

function normalizeRecipeInstructions(value: string | null): string[] | undefined {
  if (!value) return undefined;
  const parsed = JSON.parse(value);
  if (!Array.isArray(parsed)) return undefined;

  return parsed
    .map((item) => {
      if (typeof item === 'string') return item;
      if (item && typeof item === 'object' && 'text' in item && typeof item.text === 'string') {
        return item.text;
      }
      return null;
    })
    .filter((item): item is string => Boolean(item && item.trim()));
}

function normalizeRecipeIngredients(value: string | null): BuiltinOverride['recipeIngredients'] {
  if (!value) return undefined;
  const parsed = JSON.parse(value);
  if (!Array.isArray(parsed)) return undefined;

  return parsed
    .map((item) => {
      if (!item || typeof item !== 'object') return null;

      const source = item as Record<string, unknown>;
      const name = typeof source.name === 'string'
        ? source.name
        : typeof source.ing_name === 'string'
          ? source.ing_name
          : '';

      if (!name && !source.row_type) return null;

      return {
        name,
        quantity: typeof source.quantity === 'string'
          ? source.quantity
          : typeof source.ing_qty === 'string'
            ? source.ing_qty
            : undefined,
        section: typeof source.section === 'string'
          ? source.section
          : typeof source.notes === 'string'
            ? source.notes.split(';').find((note) => note.startsWith('section='))?.slice('section='.length)
            : undefined,
        foodWord: typeof source.foodWord === 'string'
          ? source.foodWord
          : typeof source.game_food === 'string' && source.game_food.length > 0
            ? source.game_food
            : undefined,
        ndbNo: typeof source.ndbNo === 'string'
          ? source.ndbNo
          : typeof source.ndb_no === 'string'
            ? source.ndb_no
            : undefined,
        portionDesc: typeof source.portionDesc === 'string'
          ? source.portionDesc
          : typeof source.portion_desc === 'string'
            ? source.portion_desc
            : undefined,
        portionGrams: typeof source.portionGrams === 'number'
          ? source.portionGrams
          : typeof source.portion_grams === 'number'
            ? source.portion_grams
            : undefined,
        servingCount: typeof source.servingCount === 'number'
          ? source.servingCount
          : typeof source.serving_count === 'number'
            ? source.serving_count
            : undefined,
        exempt: typeof source.exempt === 'boolean'
          ? source.exempt
          : source.row_type === 'exempt',
        isDish: typeof source.isDish === 'boolean'
          ? source.isDish
          : source.row_type === 'dish',
        componentRef: typeof source.componentRef === 'string'
          ? source.componentRef
          : undefined,
        is_optional: typeof source.is_optional === 'boolean'
          ? source.is_optional
          : undefined
      };
    })
    .filter((item): item is NonNullable<typeof item> => item !== null && Boolean(item.name || item.isDish)) as NonNullable<BuiltinOverride['recipeIngredients']>;
}

// GET: Fetch all built-in recipe overrides and admin-added recipes from Turso
export const GET: RequestHandler = async () => {
  try {
    // Get published dev recipes that override existing local LEVELS rows.
    const overrideRows = await queryAll<BuiltinRecipeRow>(
      `SELECT recipe_id, recipe_name, category, dietary_category, cooking_method, cook_minutes, cook_temp_f,
              dish_family, prep_time, servings,
              recipe, animal_spawns, recipe_instructions_json, recipe_ingredients_json,
              sections_json, nutrition_json, image_url, created_at, submitted_by
       FROM dev_recipes 
       WHERE status = 'published'
         AND recipe_id NOT LIKE 'admin-%'
         AND (recipe_ingredients_json IS NOT NULL OR recipe_instructions_json IS NOT NULL)`
    );

    // Get admin-added new dev recipes.
    const newRows = await queryAll<BuiltinRecipeRow>(
      `SELECT recipe_id, recipe_name, category, dietary_category, cooking_method, cook_minutes, cook_temp_f,
              dish_family, prep_time, servings,
              recipe, animal_spawns, recipe_instructions_json, recipe_ingredients_json,
              sections_json, nutrition_json, image_url, created_at, submitted_by
       FROM dev_recipes 
       WHERE status = 'published' AND recipe_id LIKE 'admin-%'
       ORDER BY created_at ASC`
    );

    // Convert override rows to keyed format
    const overrides: Record<string, BuiltinOverride> = {};
    for (const row of overrideRows) {
      const override: BuiltinOverride = {
        id: row.recipe_id,
        editedAt: row.created_at,
        editedBy: row.submitted_by || 'System'
      };

      if (row.recipe_name) override.name = row.recipe_name;
      if (row.category) override.category = toDisplayRecipeCategory(row.category);
      if (row.dietary_category) override.dietaryCategory = row.dietary_category;
      if (row.cooking_method) override.cookingMethod = row.cooking_method;
      if (row.dish_family) override.dishFamily = row.dish_family;
      if (row.prep_time) override.prepTime = row.prep_time;
      if (row.servings) override.servings = row.servings;
      if (row.recipe) override.recipe = JSON.parse(row.recipe);
      if (row.animal_spawns) override.animalSpawns = JSON.parse(row.animal_spawns);
      if (row.recipe_instructions_json) override.recipeInstructions = normalizeRecipeInstructions(row.recipe_instructions_json);
      if (row.recipe_ingredients_json) override.recipeIngredients = normalizeRecipeIngredients(row.recipe_ingredients_json);
      if (row.cook_minutes != null) override.cookMinutes = row.cook_minutes as number;
      if (row.cook_temp_f  != null) override.cookTempF   = row.cook_temp_f  as number;
      if (row.sections_json) override.sections = JSON.parse(row.sections_json);
      if (row.nutrition_json && row.nutrition_json !== '{}') override.nutritionJson = JSON.parse(row.nutrition_json);
      if (row.image_url) override.imageUrl = row.image_url;

      overrides[row.recipe_id] = override;
    }

    // Convert new recipe rows to array format
    const newBuiltins: NewBuiltinRecipe[] = newRows.map(row => ({
      id: row.recipe_id,
      name: row.recipe_name,
      category: toDisplayRecipeCategory(row.category || 'Other'),
      dietaryCategory: row.dietary_category || 'all',
      cookingMethod: row.cooking_method ?? undefined,
      dishFamily: row.dish_family ?? undefined,
      prepTime: row.prep_time ?? undefined,
      servings: row.servings ?? undefined,
      recipe: row.recipe ? JSON.parse(row.recipe) : [],
      animalSpawns: row.animal_spawns ? JSON.parse(row.animal_spawns) : [{ type: 'rabbit', delay: 3000 }],
      recipeInstructions: normalizeRecipeInstructions(row.recipe_instructions_json),
      recipeIngredients: normalizeRecipeIngredients(row.recipe_ingredients_json),
      nutritionJson: row.nutrition_json && row.nutrition_json !== '{}' ? JSON.parse(row.nutrition_json) : undefined,
      imageUrl: row.image_url ?? undefined,
      createdAt: row.created_at
    }));

    return json({ overrides, newBuiltins }, {
      headers: { 'Cache-Control': 'no-store, max-age=0, must-revalidate' }
    });
  } catch (err) {
    console.error('Failed to load builtin overrides:', err);
    return json({ error: 'Failed to load overrides' }, { status: 500 });
  }
};

// PATCH: Save/update an override for a built-in recipe in Turso
export const PATCH: RequestHandler = async ({ request }) => {
  try {
    const body = await request.json();
    const { id, updates, editedBy } = body;

    if (!id) {
      return json({ error: 'Missing recipe id' }, { status: 400 });
    }

    if (!updates || typeof updates !== 'object') {
      return json({ error: 'Missing updates object' }, { status: 400 });
    }

    // Phase 6 (v3) gate: dev_recipes is now owned by the v3 pipeline
    // (recipes_v3/tools/upload.py). The PATCH path here recomputes
    // nutrition_json via calcNutritionSR28 (7 macros only) and would silently
    // strip v3's full ~60-nutrient panel. Block PATCHes for any row marked
    // locked=2 unless an explicit v3 token is supplied.
    // See docs/v3.md §14a / §14b.
    const db = getGameDb();
    const lockCheck = await db.execute({
      sql: 'SELECT locked FROM dev_recipes WHERE recipe_id = ?',
      args: [id]
    });
    const lockedVal = lockCheck.rows[0]?.locked;
    const isLocked2 = lockedVal === 2 || lockedVal === '2';
    const v3Token = (updates as Record<string, unknown>)._v3_uploader_token;
    const expectedToken = process.env.V3_UPLOADER_TOKEN;
    if (isLocked2 && (!expectedToken || v3Token !== expectedToken)) {
      return json({
        error: 'Recipe is v3-managed (locked=2). Edit recipes_v3/data/*.csv and run tools/upload.py.',
        code: 'V3_LOCKED'
      }, { status: 423 });
    }
    const now = new Date().toISOString();
    const hasImageUrlUpdate = Object.prototype.hasOwnProperty.call(updates, 'imageUrl');
    const shouldClearImage = hasImageUrlUpdate && (updates.imageUrl === null || updates.imageUrl === '');
    const nextImageUrl = hasImageUrlUpdate && typeof updates.imageUrl === 'string' && updates.imageUrl.trim().length > 0
      ? updates.imageUrl.trim()
      : null;
    const nextName = typeof updates.name === 'string' && updates.name.trim().length > 0
      ? updates.name.trim()
      : null;
    const nextFoodWord = nextName ? toFoodWord(nextName) : null;
    const servingMeta = parseServingMeta((updates.servings as string | null | undefined) ?? null);
    const recipeIngredientsForNutrition = updates.recipeIngredients as NutritionLinkIngredient[] | undefined;
    const updateYieldWater = typeof updates.yieldFactorWater === 'number' ? updates.yieldFactorWater as number : undefined;
    const updateYieldFat   = typeof updates.yieldFactorFat   === 'number' ? updates.yieldFactorFat   as number : undefined;
    const computedNutrition = await resolveBuiltinNutrition(
      updates.nutritionJson,
      recipeIngredientsForNutrition,
      (updates.servings as string | null | undefined) ?? null,
      (updates.cookingMethod as string | null | undefined) ?? null,
      updateYieldWater,
      updateYieldFat
    );

    // Check if dev recipe exists
    const existing = await db.execute({
      sql: 'SELECT recipe_id, image_url FROM dev_recipes WHERE recipe_id = ?',
      args: [id]
    });

    if (existing.rows.length === 0) {
      // Create new dev recipe row.
      await db.execute({
        sql: `INSERT INTO dev_recipes (
              recipe_id, food_word, recipe_name, category, dietary_category, cooking_method, dish_family, prep_time, servings,
              servings_count, serving_label,
              recipe, animal_spawns, recipe_instructions_json, recipe_ingredients_json,
              image_url, submitted_by, status, created_at, updated_at,
              grams_per_serving, nutrition_json, nutrient_version, retention_model_version, source_match_version
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'published', ?, ?, ?, ?, ?, ?, ?)`,
        args: [
          id,
          nextFoodWord || id,
          nextName,
          (updates.category ? toStoredRecipeCategory(updates.category) : null),
          updates.dietaryCategory || null,
          updates.cookingMethod || null,
          updates.dishFamily || null,
          updates.prepTime || null,
          updates.servings || null,
          servingMeta.servingsCount,
          servingMeta.servingLabel,
          updates.recipe ? JSON.stringify(updates.recipe) : null,
          updates.animalSpawns ? JSON.stringify(updates.animalSpawns) : null,
          updates.recipeInstructions ? JSON.stringify(updates.recipeInstructions) : null,
          updates.recipeIngredients ? JSON.stringify(updates.recipeIngredients) : null,
          updates.imageUrl || null,
          editedBy || 'Moderator',
          now,
          now,
          computedNutrition.gramsPerServing,
          computedNutrition.nutritionJson,
          'legacy',
          'legacy',
          'legacy'
        ]
      });
    } else {
      if (shouldClearImage) {
        const currentImageUrl = existing.rows[0].image_url as string | null;
        if (currentImageUrl) {
          const oldPublicId = extractPublicId(currentImageUrl);
          if (oldPublicId) {
            try {
              await deleteRecipeImage(oldPublicId);
            } catch (err) {
              console.warn('Failed to delete old builtin recipe image:', oldPublicId, err);
            }
          }
        }
      }

      // Update existing dev recipe row.
      await db.execute({
        sql: `UPDATE dev_recipes SET
              recipe_name = COALESCE(?, recipe_name),
            food_word = COALESCE(?, food_word),
              category = COALESCE(?, category),
              dietary_category = COALESCE(?, dietary_category),
              cooking_method = COALESCE(?, cooking_method),
              dish_family = COALESCE(?, dish_family),
              prep_time = COALESCE(?, prep_time),
              servings = COALESCE(?, servings),
            servings_count = CASE WHEN ? IS NOT NULL THEN ? ELSE servings_count END,
            serving_label = COALESCE(?, serving_label),
              recipe = COALESCE(?, recipe),
              animal_spawns = COALESCE(?, animal_spawns),
              recipe_instructions_json = COALESCE(?, recipe_instructions_json),
              recipe_ingredients_json = COALESCE(?, recipe_ingredients_json),
              grams_per_serving = CASE WHEN ? > 0 THEN ? ELSE grams_per_serving END,
              nutrition_json = CASE WHEN ? != '{}' THEN ? ELSE nutrition_json END,
              image_url = CASE
                WHEN ? = 1 THEN NULL
                WHEN ? IS NOT NULL THEN ?
                ELSE image_url
              END,
              updated_at = ?,
              submitted_by = COALESCE(?, submitted_by)
              WHERE recipe_id = ?`,
        args: [
          nextName,
          nextFoodWord,
          (updates.category ? toStoredRecipeCategory(updates.category) : null),
          updates.dietaryCategory || null,
          updates.cookingMethod || null,
          updates.dishFamily || null,
          updates.prepTime || null,
          updates.servings || null,
          servingMeta.servingsCount,
          servingMeta.servingsCount,
          servingMeta.servingLabel,
          updates.recipe ? JSON.stringify(updates.recipe) : null,
          updates.animalSpawns ? JSON.stringify(updates.animalSpawns) : null,
          updates.recipeInstructions ? JSON.stringify(updates.recipeInstructions) : null,
          updates.recipeIngredients ? JSON.stringify(updates.recipeIngredients) : null,
          computedNutrition.gramsPerServing,
          computedNutrition.gramsPerServing,
          computedNutrition.nutritionJson,
          computedNutrition.nutritionJson,
          shouldClearImage ? 1 : 0,
          nextImageUrl,
          nextImageUrl,
          now,
          editedBy || 'Moderator',
          id
        ]
      });
    }

    console.log(`✏️ Saved dev recipe for: "${id}" by ${editedBy || 'Moderator'}`);

    return json({
      success: true,
      id,
      editedAt: now
    });

  } catch (err) {
    console.error('Failed to save builtin override:', err);
    return json({ error: 'Failed to save override' }, { status: 500 });
  }
};

// POST: Create a brand-new built-in recipe (admin-added, not in TypeScript LEVELS)
export const POST: RequestHandler = async ({ request }) => {
  try {
    const body = await request.json();
    const { recipe: data } = body;

    if (!data || !data.name || !data.name.trim()) {
      return json({ error: 'Recipe name is required' }, { status: 400 });
    }

    const db = getGameDb();
    const now = new Date().toISOString();
    const id = `admin-${Date.now()}`;
    const servingMeta = parseServingMeta((data.servings as string | null | undefined) ?? null);
    const baseFoodWord = toFoodWord(data.name.trim());
    let foodWord = baseFoodWord || id;

    if (foodWord !== id) {
      const duplicate = await db.execute({
        sql: 'SELECT 1 FROM dev_recipes WHERE food_word = ? LIMIT 1',
        args: [foodWord]
      });
      if (duplicate.rows.length > 0) {
        foodWord = `${foodWord}-${id.replace('admin-', '')}`;
      }
    }

    const recipeIngredientsForNutrition = data.recipeIngredients as NutritionLinkIngredient[] | undefined;
    const dataYieldWater = typeof data.yieldFactorWater === 'number' ? data.yieldFactorWater as number : undefined;
    const dataYieldFat   = typeof data.yieldFactorFat   === 'number' ? data.yieldFactorFat   as number : undefined;
    const computedNutrition = await resolveBuiltinNutrition(
      data.nutritionJson,
      recipeIngredientsForNutrition,
      (data.servings as string | null | undefined) ?? null,
      (data.cookingMethod as string | null | undefined) ?? null,
      dataYieldWater,
      dataYieldFat
    );

    await db.execute({
      sql: `INSERT INTO dev_recipes (
            recipe_id, food_word, recipe_name, category, dietary_category, cooking_method, dish_family, prep_time, servings,
            servings_count, serving_label,
            recipe, animal_spawns, recipe_instructions_json, recipe_ingredients_json,
            image_url, submitted_by, status, created_at, updated_at,
            grams_per_serving, nutrition_json, nutrient_version, retention_model_version, source_match_version
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'published', ?, ?, ?, ?, ?, ?, ?)`,
      args: [
        id,
        foodWord,
        data.name.trim(),
        toStoredRecipeCategory(data.category),
        data.dietaryCategory || 'all',
        data.cookingMethod || null,
        data.dishFamily || null,
        data.prepTime || null,
        data.servings || null,
        servingMeta.servingsCount,
        servingMeta.servingLabel,
        data.recipe ? JSON.stringify(data.recipe) : null,
        data.animalSpawns ? JSON.stringify(data.animalSpawns) : null,
        data.recipeInstructions ? JSON.stringify(data.recipeInstructions) : null,
        data.recipeIngredients ? JSON.stringify(data.recipeIngredients) : null,
        data.imageUrl || null,
        'Moderator',
        now,
        now,
        computedNutrition.gramsPerServing,
        computedNutrition.nutritionJson,
        'legacy',
        'legacy',
        'legacy'
      ]
    });

    console.log(`➕ Added new built-in recipe: "${data.name.trim()}" (id: ${id})`);

    return json({ success: true, id });
  } catch (err) {
    console.error('Failed to create new built-in recipe:', err);
    return json({ error: 'Failed to create recipe' }, { status: 500 });
  }
};

// DELETE: Remove an override or admin-added recipe
export const DELETE: RequestHandler = async ({ request }) => {
  try {
    const body = await request.json();
    const { id } = body;

    if (!id) {
      return json({ error: 'Missing recipe id' }, { status: 400 });
    }

    const db = getGameDb();

    const existing = await db.execute({
      sql: 'SELECT recipe_id FROM dev_recipes WHERE recipe_id = ?',
      args: [id]
    });

    if (existing.rows.length === 0) {
      return json({ error: 'No override found for this recipe' }, { status: 404 });
    }

    if (id.startsWith('admin-')) {
      await db.execute({
        sql: 'DELETE FROM dev_recipes WHERE recipe_id = ?',
        args: [id]
      });
      console.log(`🗑️ Deleted admin-added recipe: "${id}"`);
      return json({ success: true, id, action: 'deleted' });
    }

    return json({ error: 'Non-admin dev recipes should be edited, not reverted' }, { status: 400 });

  } catch (err) {
    console.error('Failed to delete dev recipe:', err);
    return json({ error: 'Failed to update dev recipes' }, { status: 500 });
  }
};
