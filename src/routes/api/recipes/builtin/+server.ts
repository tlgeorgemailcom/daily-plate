import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { queryAll, getGameDb } from '$lib/server/turso';

interface BuiltinRecipeRow {
  recipe_id: string;
  recipe_name: string;
  category: string;
  dietary_category: string | null;
  prep_time: string | null;
  servings: string | null;
  recipe: string | null;
  animal_spawns: string | null;
  recipe_instructions_json: string | null;
  recipe_ingredients_json: string | null;
  image_url: string | null;
  created_at: string;
  submitted_by: string;
}

interface BuiltinOverride {
  id: string;
  name?: string;
  category?: string;
  dietaryCategory?: string;
  prepTime?: string;
  servings?: string;
  recipe?: string[];
  animalSpawns?: { type: string; delay: number }[];
  recipeInstructions?: string[];
  recipeIngredients?: { name: string; quantity?: string }[];
  imageUrl?: string;
  editedAt: string;
  editedBy: string;
}

interface NewBuiltinRecipe {
  id: string;
  name: string;
  category: string;
  dietaryCategory: string;
  prepTime?: string;
  servings?: string;
  recipe: string[];
  animalSpawns: { type: string; delay: number }[];
  recipeInstructions?: string[];
  recipeIngredients?: { name: string; quantity?: string }[];
  imageUrl?: string;
  createdAt: string;
}

// GET: Fetch all built-in recipe overrides and admin-added recipes from Turso
export const GET: RequestHandler = async () => {
  try {
    // Get published dev recipes that override existing local LEVELS rows.
    const overrideRows = await queryAll<BuiltinRecipeRow>(
      `SELECT recipe_id, recipe_name, category, dietary_category, prep_time, servings, 
              recipe, animal_spawns, recipe_instructions_json, recipe_ingredients_json,
              image_url, created_at, submitted_by
       FROM dev_recipes 
       WHERE status = 'published'
         AND recipe_id NOT LIKE 'admin-%'
         AND (recipe_ingredients_json IS NOT NULL OR recipe_instructions_json IS NOT NULL)`
    );

    // Get admin-added new dev recipes.
    const newRows = await queryAll<BuiltinRecipeRow>(
      `SELECT recipe_id, recipe_name, category, dietary_category, prep_time, servings, 
              recipe, animal_spawns, recipe_instructions_json, recipe_ingredients_json,
              image_url, created_at, submitted_by
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
      if (row.category) override.category = row.category;
      if (row.dietary_category) override.dietaryCategory = row.dietary_category;
      if (row.prep_time) override.prepTime = row.prep_time;
      if (row.servings) override.servings = row.servings;
      if (row.recipe) override.recipe = JSON.parse(row.recipe);
      if (row.animal_spawns) override.animalSpawns = JSON.parse(row.animal_spawns);
      if (row.recipe_instructions_json) override.recipeInstructions = JSON.parse(row.recipe_instructions_json);
      if (row.recipe_ingredients_json) override.recipeIngredients = JSON.parse(row.recipe_ingredients_json);
      if (row.image_url) override.imageUrl = row.image_url;

      overrides[row.recipe_id] = override;
    }

    // Convert new recipe rows to array format
    const newBuiltins: NewBuiltinRecipe[] = newRows.map(row => ({
      id: row.recipe_id,
      name: row.recipe_name,
      category: row.category || 'Other',
      dietaryCategory: row.dietary_category || 'all',
      prepTime: row.prep_time ?? undefined,
      servings: row.servings ?? undefined,
      recipe: row.recipe ? JSON.parse(row.recipe) : [],
      animalSpawns: row.animal_spawns ? JSON.parse(row.animal_spawns) : [{ type: 'rabbit', delay: 3000 }],
      recipeInstructions: row.recipe_instructions_json ? JSON.parse(row.recipe_instructions_json) : undefined,
      recipeIngredients: row.recipe_ingredients_json ? JSON.parse(row.recipe_ingredients_json) : undefined,
      imageUrl: row.image_url ?? undefined,
      createdAt: row.created_at
    }));

    return json({ overrides, newBuiltins }, {
      headers: { 'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400' }
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

    const db = getGameDb();
    const now = new Date().toISOString();

    // Check if dev recipe exists
    const existing = await db.execute({
      sql: 'SELECT recipe_id FROM dev_recipes WHERE recipe_id = ?',
      args: [id]
    });

    if (existing.rows.length === 0) {
      // Create new dev recipe row.
      await db.execute({
        sql: `INSERT INTO dev_recipes (
              recipe_id, food_word, recipe_name, category, dietary_category, prep_time, servings,
              recipe, animal_spawns, recipe_instructions_json, recipe_ingredients_json,
              image_url, submitted_by, status, created_at, updated_at,
              grams_per_serving, nutrition_json, nutrient_version, retention_model_version, source_match_version
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'published', ?, ?, ?, ?, ?, ?, ?)`,
        args: [
          id,
          id,
          updates.name || null,
          updates.category || null,
          updates.dietaryCategory || null,
          updates.prepTime || null,
          updates.servings || null,
          updates.recipe ? JSON.stringify(updates.recipe) : null,
          updates.animalSpawns ? JSON.stringify(updates.animalSpawns) : null,
          updates.recipeInstructions ? JSON.stringify(updates.recipeInstructions) : null,
          updates.recipeIngredients ? JSON.stringify(updates.recipeIngredients) : null,
          updates.imageUrl || null,
          editedBy || 'Moderator',
          now,
          now,
          0,
          '{}',
          'legacy',
          'legacy',
          'legacy'
        ]
      });
    } else {
      // Update existing dev recipe row.
      await db.execute({
        sql: `UPDATE dev_recipes SET
              recipe_name = COALESCE(?, recipe_name),
              category = COALESCE(?, category),
              dietary_category = COALESCE(?, dietary_category),
              prep_time = COALESCE(?, prep_time),
              servings = COALESCE(?, servings),
              recipe = COALESCE(?, recipe),
              animal_spawns = COALESCE(?, animal_spawns),
              recipe_instructions_json = COALESCE(?, recipe_instructions_json),
              recipe_ingredients_json = COALESCE(?, recipe_ingredients_json),
              image_url = ?,
              updated_at = ?,
              submitted_by = COALESCE(?, submitted_by)
              WHERE recipe_id = ?`,
        args: [
          updates.name || null,
          updates.category || null,
          updates.dietaryCategory || null,
          updates.prepTime || null,
          updates.servings || null,
          updates.recipe ? JSON.stringify(updates.recipe) : null,
          updates.animalSpawns ? JSON.stringify(updates.animalSpawns) : null,
          updates.recipeInstructions ? JSON.stringify(updates.recipeInstructions) : null,
          updates.recipeIngredients ? JSON.stringify(updates.recipeIngredients) : null,
          updates.imageUrl || null,
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

    await db.execute({
      sql: `INSERT INTO dev_recipes (
            recipe_id, food_word, recipe_name, category, dietary_category, prep_time, servings,
            recipe, animal_spawns, recipe_instructions_json, recipe_ingredients_json,
            image_url, submitted_by, status, created_at, updated_at,
            grams_per_serving, nutrition_json, nutrient_version, retention_model_version, source_match_version
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'published', ?, ?, ?, ?, ?, ?, ?)`,
      args: [
        id,
        id,
        data.name.trim(),
        data.category || 'Other',
        data.dietaryCategory || 'all',
        data.prepTime || null,
        data.servings || null,
        data.recipe ? JSON.stringify(data.recipe) : null,
        data.animalSpawns ? JSON.stringify(data.animalSpawns) : null,
        data.recipeInstructions ? JSON.stringify(data.recipeInstructions) : null,
        data.recipeIngredients ? JSON.stringify(data.recipeIngredients) : null,
        data.imageUrl || null,
        'Moderator',
        now,
        now,
        0,
        '{}',
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
