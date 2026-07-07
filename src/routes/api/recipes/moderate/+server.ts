import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { execute, queryAll } from '$lib/server/turso';
import { toDisplayRecipeCategory, toStoredRecipeCategory } from '$lib/farmers-basket/recipe-categories';
import { deleteRecipeImage, extractPublicId } from '$lib/server/cloudinary';

interface RecipeSubmission {
  id: string;
  recipeName: string;
  category: string;
  dietaryCategory?: string;
  submitterName: string;
  prepTime: string;
  servings: string;
  ingredients: { name: string; quantity: string }[];
  instructions: string[];
  submittedAt: string;
  status: 'pending' | 'approved' | 'rejected' | 'needs_changes' | 'published';
  gameFoods?: string[];
  animalSpawns?: { type: string; delay: number }[];
  foodSupply?: Record<string, number>;
  modIngredients?: {
    name: string;
    quantity: string;
    gameFood?: string | null;
    animal?: string | null;
  }[];
  srRule?: string;
  imageUrl?: string;
  reviewedAt?: string;
  reviewedBy?: string;
  editedAt?: string;
  editedBy?: string;
  cookingMethod?: string;
  dishFamily?: string | null;
  linkType?: 'ingredient' | 'dish' | 'mixed';
  nutritionJson?: unknown | null;
  sections?: unknown[];
}

function parseJson<T>(value: string | null | undefined, fallback: T): T {
  if (!value) return fallback;
  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
}

function buildPlayerSubmission(row: Record<string, unknown>): RecipeSubmission {
  const ingredients = parseJson<{ name: string; quantity: string }[]>(row.ingredients as string | null, []);
  return {
    id: row.id as string,
    recipeName: row.recipeName as string,
    category: toDisplayRecipeCategory((row.category as string) || 'Other'),
    dietaryCategory: (row.dietaryCategory as string | null) || 'all',
    submitterName: (row.submitterName as string | null) || 'Player',
    prepTime: (row.prepTime as string | null) || '',
    servings: (row.servings as string | null) || '',
    ingredients,
    instructions: parseJson<string[]>(row.instructions as string | null, []),
    submittedAt: row.submittedAt as string,
    status: row.status as RecipeSubmission['status'],
    gameFoods: parseJson<string[] | undefined>(row.gameFoods as string | null, undefined),
    animalSpawns: parseJson<{ type: string; delay: number }[] | undefined>(row.animalSpawns as string | null, undefined),
    foodSupply: parseJson<Record<string, number> | undefined>(row.foodSupply as string | null, undefined),
    modIngredients: ingredients,
    imageUrl: (row.imageUrl as string | null) || undefined,
    reviewedAt: (row.updatedAt as string | null) || undefined,
    editedAt: (row.updatedAt as string | null) || undefined,
    cookingMethod: (row.cookingMethod as string | null) || undefined,
    dishFamily: (row.dishFamily as string | null) || null,
    linkType: (row.linkType as 'ingredient' | 'dish' | 'mixed' | null) || undefined,
    nutritionJson: row.nutritionJson ? parseJson(row.nutritionJson as string, null) : null,
    sections: row.sectionsJson ? parseJson(row.sectionsJson as string, undefined) : undefined
  };
}

function buildDevSubmission(row: Record<string, unknown>): RecipeSubmission {
  const ingredients = parseJson<{ name: string; quantity: string }[]>(row.ingredients as string | null, []);
  return {
    id: row.id as string,
    recipeName: row.recipeName as string,
    category: toDisplayRecipeCategory((row.category as string) || 'Other'),
    dietaryCategory: (row.dietaryCategory as string | null) || 'all',
    submitterName: (row.submitterName as string | null) || 'System',
    prepTime: (row.prepTime as string | null) || '',
    servings: (row.servings as string | null) || '',
    ingredients,
    instructions: parseJson<string[]>(row.instructions as string | null, []),
    submittedAt: row.submittedAt as string,
    status: row.status as RecipeSubmission['status'],
    gameFoods: parseJson<string[] | undefined>(row.gameFoods as string | null, undefined),
    animalSpawns: parseJson<{ type: string; delay: number }[] | undefined>(row.animalSpawns as string | null, undefined),
    foodSupply: parseJson<Record<string, number> | undefined>(row.foodSupply as string | null, undefined),
    modIngredients: ingredients,
    imageUrl: (row.imageUrl as string | null) || undefined,
    reviewedAt: (row.updatedAt as string | null) || undefined,
    reviewedBy: (row.submitterName as string | null) || undefined,
    editedAt: (row.updatedAt as string | null) || undefined,
    editedBy: (row.submitterName as string | null) || undefined,
    cookingMethod: (row.cookingMethod as string | null) || undefined,
    dishFamily: (row.dishFamily as string | null) || null,
    linkType: (row.linkType as 'ingredient' | 'dish' | 'mixed' | null) || undefined,
    nutritionJson: row.nutritionJson ? parseJson(row.nutritionJson as string, null) : null,
    sections: row.sectionsJson ? parseJson(row.sectionsJson as string, undefined) : undefined
  };
}

export const GET: RequestHandler = async ({ url }) => {
  try {
    const filter = url.searchParams.get('filter');

    const pending = await queryAll(`
          SELECT recipe_id AS id, recipe_name AS recipeName, category, dietary_category AS dietaryCategory,
            COALESCE(submitter_name, submitted_by) AS submitterName, prep_time AS prepTime,
             servings, recipe_ingredients_json AS ingredients,
             recipe_instructions_json AS instructions, created_at AS submittedAt,
             status, recipe AS gameFoods, animal_spawns AS animalSpawns,
             food_supply AS foodSupply, image_url AS imageUrl, updated_at AS updatedAt,
             cooking_method AS cookingMethod, dish_family AS dishFamily,
             link_type AS linkType, nutrition_json AS nutritionJson,
             sections_json AS sectionsJson,
             cook_minutes AS cookMinutes, cook_temp_f AS cookTempF
      FROM player_recipes
      WHERE status IN ('pending', 'needs_changes')
      ORDER BY created_at ASC
    `).then((rows) => rows.map((row) => buildPlayerSubmission(row as Record<string, unknown>)));

    const approvedDev = await queryAll(`
      SELECT recipe_id AS id, recipe_name AS recipeName, category,
             dietary_category AS dietaryCategory, COALESCE(submitted_by, 'System') AS submitterName,
             prep_time AS prepTime, servings, recipe_ingredients_json AS ingredients,
             recipe_instructions_json AS instructions, created_at AS submittedAt,
             status, recipe AS gameFoods, animal_spawns AS animalSpawns,
             food_supply AS foodSupply, image_url AS imageUrl, updated_at AS updatedAt,
             cooking_method AS cookingMethod, dish_family AS dishFamily,
             link_type AS linkType, nutrition_json AS nutritionJson,
             sections_json AS sectionsJson,
             cook_minutes AS cookMinutes, cook_temp_f AS cookTempF
      FROM dev_recipes
      WHERE status = 'published'
      ORDER BY created_at ASC
    `).then((rows) => rows.map((row) => buildDevSubmission(row as Record<string, unknown>)));

    const approvedPlayer = await queryAll(`
      SELECT recipe_id AS id, recipe_name AS recipeName, category, dietary_category AS dietaryCategory,
             COALESCE(submitter_name, submitted_by) AS submitterName, prep_time AS prepTime,
             servings, recipe_ingredients_json AS ingredients,
             recipe_instructions_json AS instructions, created_at AS submittedAt,
             status, recipe AS gameFoods, animal_spawns AS animalSpawns,
             food_supply AS foodSupply, image_url AS imageUrl, updated_at AS updatedAt,
             cooking_method AS cookingMethod, dish_family AS dishFamily,
             link_type AS linkType, nutrition_json AS nutritionJson,
             sections_json AS sectionsJson,
             cook_minutes AS cookMinutes, cook_temp_f AS cookTempF
      FROM player_recipes
      WHERE status = 'approved'
      ORDER BY created_at ASC
    `).then((rows) => rows.map((row) => buildPlayerSubmission(row as Record<string, unknown>)));

    const approved = [...approvedDev, ...approvedPlayer];

    if (filter === 'pending') {
      return json({ recipes: pending });
    }
    if (filter === 'approved') {
      return json({ recipes: approved });
    }

    return json({
      pending,
      approved,
      counts: {
        pending: pending.length,
        approved: approved.length
      }
    });
  } catch (err) {
    console.error('Failed to load recipes for moderation:', err);
    return json({ error: 'Failed to load recipes' }, { status: 500 });
  }
};

export const POST: RequestHandler = async ({ request }) => {
  try {
    const body = await request.json();
    const {
      id,
      action,
      gameFoods,
      animalSpawns,
      reviewedBy,
      foodSupply,
      moderatorNote,
      recipeName,
      category,
      dietaryCategory,
      cookingMethod,
      dishFamily,
      prepTime,
      servings,
      ingredients,
      instructions,
      sections
    } = body;

    if (!action) {
      return json({ error: 'Missing action' }, { status: 400 });
    }

    if (action === 'create-builtin') {
      if (!gameFoods || gameFoods.length === 0) {
        return json({ error: 'Game foods required' }, { status: 400 });
      }
      if (!recipeName || !recipeName.trim()) {
        return json({ error: 'Recipe name required' }, { status: 400 });
      }

      const newId = `admin-${Date.now()}`;
      const now = new Date().toISOString();
      await execute(
        `INSERT INTO dev_recipes (
          recipe_id, food_word, recipe_name, category, dietary_category, cooking_method, dish_family, prep_time, servings,
          recipe, animal_spawns, recipe_ingredients_json, recipe_instructions_json,
          food_supply, image_url, submitted_by, status, created_at, updated_at,
          grams_per_serving, nutrition_json, nutrient_version, retention_model_version, source_match_version,
          sections_json
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'published', ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          newId,
          newId,
          recipeName,
          toStoredRecipeCategory(category),
          dietaryCategory || 'all',
          cookingMethod || null,
          dishFamily || null,
          prepTime || '',
          servings || '',
          JSON.stringify(gameFoods),
          JSON.stringify(animalSpawns || [{ type: 'rabbit', delay: 3 }]),
          JSON.stringify(ingredients || []),
          JSON.stringify(instructions || []),
          JSON.stringify(foodSupply || {}),
          null,
          reviewedBy || 'Moderator',
          now,
          now,
          0,
          '{}',
          'legacy',
          'legacy',
          'legacy',
          sections ? JSON.stringify(sections) : null
        ]
      );

      return json({ success: true, action, recipe: recipeName, id: newId });
    }

    if (!['approve', 'reject', 'needs_changes'].includes(action)) {
      return json({ error: 'Invalid action' }, { status: 400 });
    }
    if (!id) {
      return json({ error: 'Missing recipe id' }, { status: 400 });
    }

    const existing = await queryAll<{ id: string; recipeName: string; status: string }>(
      `SELECT recipe_id AS id, recipe_name AS recipeName, status FROM player_recipes WHERE recipe_id = ?`,
      [id]
    );
    if (existing.length === 0) {
      return json({ error: 'Recipe not found' }, { status: 404 });
    }
    if (!['pending', 'needs_changes'].includes(existing[0].status)) {
      return json({ error: 'Recipe is not pending' }, { status: 409 });
    }

    const currentName = existing[0].recipeName;

    if (action === 'approve') {
      if (!gameFoods || gameFoods.length === 0) {
        return json({ error: 'Game foods required for approval' }, { status: 400 });
      }

      await execute(
        `UPDATE player_recipes SET
          status = 'approved',
          recipe_name = COALESCE(?, recipe_name),
          category = COALESCE(?, category),
          dietary_category = COALESCE(?, dietary_category),
          cooking_method = COALESCE(?, cooking_method),
          dish_family = COALESCE(?, dish_family),
          prep_time = COALESCE(?, prep_time),
          servings = COALESCE(?, servings),
          recipe_ingredients_json = COALESCE(?, recipe_ingredients_json),
          recipe_instructions_json = COALESCE(?, recipe_instructions_json),
          sections_json = COALESCE(?, sections_json),
          recipe = ?,
          animal_spawns = ?,
          food_supply = ?,
          updated_at = datetime('now')
         WHERE recipe_id = ?`,
        [
          recipeName || null,
          (category ? toStoredRecipeCategory(category) : null),
          dietaryCategory || null,
          cookingMethod || null,
          dishFamily || null,
          prepTime !== undefined ? prepTime : null,
          servings !== undefined ? servings : null,
          ingredients ? JSON.stringify(ingredients) : null,
          instructions ? JSON.stringify(instructions) : null,
          sections ? JSON.stringify(sections) : null,
          JSON.stringify(gameFoods),
          JSON.stringify(animalSpawns || []),
          JSON.stringify(foodSupply || {}),
          id
        ]
      );
    } else if (action === 'needs_changes') {
      if (!moderatorNote || !moderatorNote.trim()) {
        return json({ error: 'Moderator note is required for requesting changes' }, { status: 400 });
      }
      await execute(
        `UPDATE player_recipes SET status = 'needs_changes', moderator_note = ?, updated_at = datetime('now') WHERE recipe_id = ?`,
        [moderatorNote.trim(), id]
      );
    } else {
      await execute(
        `DELETE FROM player_recipes WHERE recipe_id = ?`,
        [id]
      );
    }

    return json({ success: true, action, recipe: recipeName || currentName });
  } catch (err) {
    console.error('Failed to moderate recipe:', err);
    return json({ error: 'Failed to moderate recipe' }, { status: 500 });
  }
};

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

    const hasImageUrlUpdate = Object.prototype.hasOwnProperty.call(updates, 'imageUrl');
    const shouldClearImage = hasImageUrlUpdate && (updates.imageUrl === null || updates.imageUrl === '');
    const nextImageUrl = hasImageUrlUpdate && typeof updates.imageUrl === 'string' && updates.imageUrl.trim().length > 0
      ? updates.imageUrl.trim()
      : null;

    const isPlayerRecipe = id.startsWith('recipe-');

    if (isPlayerRecipe) {
      const existing = await queryAll<{ id: string; recipeName: string; imageUrl: string | null }>(
        'SELECT recipe_id AS id, recipe_name AS recipeName, image_url AS imageUrl FROM player_recipes WHERE recipe_id = ?',
        [id]
      );
      if (existing.length === 0) {
        return json({ error: 'Player recipe not found' }, { status: 404 });
      }

      if (shouldClearImage && existing[0].imageUrl) {
        const oldPublicId = extractPublicId(existing[0].imageUrl);
        if (oldPublicId) {
          try {
            await deleteRecipeImage(oldPublicId);
          } catch (err) {
            console.warn('Failed to delete old player recipe image:', oldPublicId, err);
          }
        }
      }

      const playerImageUrl = shouldClearImage ? null : (nextImageUrl !== null ? nextImageUrl : (existing[0].imageUrl ?? null));

      await execute(
        `UPDATE player_recipes SET
          recipe_name = COALESCE(?, recipe_name),
          category = COALESCE(?, category),
          dietary_category = COALESCE(?, dietary_category),
          cooking_method = COALESCE(?, cooking_method),
          dish_family = COALESCE(?, dish_family),
          prep_time = COALESCE(?, prep_time),
          servings = COALESCE(?, servings),
          recipe = COALESCE(?, recipe),
          recipe_ingredients_json = COALESCE(?, recipe_ingredients_json),
          recipe_instructions_json = COALESCE(?, recipe_instructions_json),
          animal_spawns = COALESCE(?, animal_spawns),
          sections_json = COALESCE(?, sections_json),
          image_url = ?,
          updated_at = datetime('now')
         WHERE recipe_id = ?`,
        [
          updates.recipeName || null,
          (updates.category ? toStoredRecipeCategory(updates.category) : null),
          updates.dietaryCategory || null,
          updates.cookingMethod || null,
          updates.dishFamily || null,
          updates.prepTime || null,
          updates.servings || null,
          updates.gameFoods ? JSON.stringify(updates.gameFoods) : null,
          updates.ingredients ? JSON.stringify(updates.ingredients) : (updates.modIngredients ? JSON.stringify(updates.modIngredients) : null),
          updates.instructions ? JSON.stringify(updates.instructions) : null,
          updates.animalSpawns ? JSON.stringify(updates.animalSpawns) : null,
          updates.sections ? JSON.stringify(updates.sections) : null,
          playerImageUrl,
          id
        ]
      );

      return json({ success: true, recipe: updates.recipeName || existing[0].recipeName, editedAt: new Date().toISOString() });
    }

    const existingDev = await queryAll<{ recipe_id: string; recipe_name: string; image_url: string | null }>(
      'SELECT recipe_id, recipe_name, image_url FROM dev_recipes WHERE recipe_id = ?',
      [id]
    );
    if (existingDev.length === 0) {
      return json({ error: 'Dev recipe not found' }, { status: 404 });
    }

    if (shouldClearImage && existingDev[0].image_url) {
      const oldPublicId = extractPublicId(existingDev[0].image_url);
      if (oldPublicId) {
        try {
          await deleteRecipeImage(oldPublicId);
        } catch (err) {
          console.warn('Failed to delete old dev recipe image:', oldPublicId, err);
        }
      }
    }

    const devImageUrl = shouldClearImage ? null : (nextImageUrl !== null ? nextImageUrl : (existingDev[0].image_url ?? null));

    await execute(
      `UPDATE dev_recipes SET
        recipe_name = COALESCE(?, recipe_name),
        category = COALESCE(?, category),
        dietary_category = COALESCE(?, dietary_category),
        cooking_method = COALESCE(?, cooking_method),
        dish_family = COALESCE(?, dish_family),
        prep_time = COALESCE(?, prep_time),
        servings = COALESCE(?, servings),
        recipe = COALESCE(?, recipe),
        recipe_ingredients_json = COALESCE(?, recipe_ingredients_json),
        recipe_instructions_json = COALESCE(?, recipe_instructions_json),
        animal_spawns = COALESCE(?, animal_spawns),
        sections_json = COALESCE(?, sections_json),
        image_url = ?,
        updated_at = datetime('now'),
        submitted_by = COALESCE(?, submitted_by)
       WHERE recipe_id = ?`,
      [
        updates.recipeName || null,
        (updates.category ? toStoredRecipeCategory(updates.category) : null),
        updates.dietaryCategory || null,
        updates.cookingMethod || null,
        updates.dishFamily || null,
        updates.prepTime || null,
        updates.servings || null,
        updates.gameFoods ? JSON.stringify(updates.gameFoods) : null,
        updates.ingredients ? JSON.stringify(updates.ingredients) : (updates.modIngredients ? JSON.stringify(updates.modIngredients) : null),
        updates.instructions ? JSON.stringify(updates.instructions) : null,
        updates.animalSpawns ? JSON.stringify(updates.animalSpawns) : null,
        updates.sections ? JSON.stringify(updates.sections) : null,
        devImageUrl,
        editedBy || 'Moderator',
        id
      ]
    );

    return json({ success: true, recipe: updates.recipeName || existingDev[0].recipe_name, editedAt: new Date().toISOString() });
  } catch (err) {
    console.error('Failed to edit recipe:', err);
    return json({ error: 'Failed to edit recipe' }, { status: 500 });
  }
};

export const DELETE: RequestHandler = async ({ request }) => {
  try {
    const body = await request.json();
    const { id } = body;

    if (!id) {
      return json({ error: 'Missing recipe id' }, { status: 400 });
    }

    if (id.startsWith('recipe-')) {
      const playerRows = await queryAll<{ id: string; recipe_name: string }>('SELECT recipe_id AS id, recipe_name FROM player_recipes WHERE recipe_id = ?', [id]);
      if (playerRows.length === 0) {
        return json({ error: 'Player recipe not found' }, { status: 404 });
      }
      await execute(`DELETE FROM player_recipes WHERE recipe_id = ?`, [id]);
      return json({ success: true, recipe: playerRows[0].recipe_name, action: 'unpublished' });
    }

    const devRows = await queryAll<{ recipe_id: string; recipe_name: string }>('SELECT recipe_id, recipe_name FROM dev_recipes WHERE recipe_id = ?', [id]);
    if (devRows.length === 0) {
      return json({ error: 'Dev recipe not found' }, { status: 404 });
    }
    await execute('DELETE FROM dev_recipes WHERE recipe_id = ?', [id]);
    return json({ success: true, recipe: devRows[0].recipe_name, action: 'unpublished' });
  } catch (err) {
    console.error('Failed to unpublish recipe:', err);
    return json({ error: 'Failed to unpublish recipe' }, { status: 500 });
  }
};