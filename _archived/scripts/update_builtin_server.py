#!/usr/bin/env python3
"""Rewrites the builtin/+server.ts with POST support, image_url, and newBuiltins."""

path = '/Volumes/training/Daily Food Chain/daily-food-chain/src/routes/api/recipes/builtin/+server.ts'

new_content = r"""import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { queryAll, getGameDb } from '$lib/server/turso';

interface BuiltinRecipeRow {
  id: string;
  name: string;
  category: string;
  dietary_category: string | null;
  prep_time: string | null;
  servings: string | null;
  recipe: string | null;
  animal_spawns: string | null;
  recipe_instructions: string | null;
  recipe_ingredients: string | null;
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
    // Get overrides: edits to existing TypeScript LEVELS (IDs like '1-1', '2-3')
    const overrideRows = await queryAll<BuiltinRecipeRow>(
      `SELECT id, name, category, dietary_category, prep_time, servings, 
              recipe, animal_spawns, recipe_instructions, recipe_ingredients,
              image_url, created_at, submitted_by
       FROM recipes 
       WHERE type = 'builtin'
         AND id NOT LIKE 'admin-%'
         AND (recipe_ingredients IS NOT NULL OR recipe_instructions IS NOT NULL)`
    );

    // Get admin-added new recipes (IDs like 'admin-1234567890')
    const newRows = await queryAll<BuiltinRecipeRow>(
      `SELECT id, name, category, dietary_category, prep_time, servings, 
              recipe, animal_spawns, recipe_instructions, recipe_ingredients,
              image_url, created_at, submitted_by
       FROM recipes 
       WHERE type = 'builtin' AND id LIKE 'admin-%'
       ORDER BY created_at ASC`
    );

    // Convert override rows to keyed format
    const overrides: Record<string, BuiltinOverride> = {};
    for (const row of overrideRows) {
      const override: BuiltinOverride = {
        id: row.id,
        editedAt: row.created_at,
        editedBy: row.submitted_by || 'System'
      };

      if (row.name) override.name = row.name;
      if (row.category) override.category = row.category;
      if (row.dietary_category) override.dietaryCategory = row.dietary_category;
      if (row.prep_time) override.prepTime = row.prep_time;
      if (row.servings) override.servings = row.servings;
      if (row.recipe) override.recipe = JSON.parse(row.recipe);
      if (row.animal_spawns) override.animalSpawns = JSON.parse(row.animal_spawns);
      if (row.recipe_instructions) override.recipeInstructions = JSON.parse(row.recipe_instructions);
      if (row.recipe_ingredients) override.recipeIngredients = JSON.parse(row.recipe_ingredients);
      if (row.image_url) override.imageUrl = row.image_url;

      overrides[row.id] = override;
    }

    // Convert new recipe rows to array format
    const newBuiltins: NewBuiltinRecipe[] = newRows.map(row => ({
      id: row.id,
      name: row.name,
      category: row.category || 'Other',
      dietaryCategory: row.dietary_category || 'all',
      prepTime: row.prep_time ?? undefined,
      servings: row.servings ?? undefined,
      recipe: row.recipe ? JSON.parse(row.recipe) : [],
      animalSpawns: row.animal_spawns ? JSON.parse(row.animal_spawns) : [{ type: 'rabbit', delay: 3000 }],
      recipeInstructions: row.recipe_instructions ? JSON.parse(row.recipe_instructions) : undefined,
      recipeIngredients: row.recipe_ingredients ? JSON.parse(row.recipe_ingredients) : undefined,
      imageUrl: row.image_url ?? undefined,
      createdAt: row.created_at
    }));

    return json({ overrides, newBuiltins });
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

    // Check if recipe exists
    const existing = await db.execute({
      sql: 'SELECT id FROM recipes WHERE id = ?',
      args: [id]
    });

    if (existing.rows.length === 0) {
      // Create new override entry
      await db.execute({
        sql: `INSERT INTO recipes (id, type, name, category, dietary_category, prep_time, servings,
              recipe, animal_spawns, recipe_instructions, recipe_ingredients,
              image_url, submitted_by, status, created_at)
              VALUES (?, 'builtin', ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NULL, 'approved', ?)`,
        args: [
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
          now
        ]
      });
    } else {
      // Update existing override
      await db.execute({
        sql: `UPDATE recipes SET
              name = COALESCE(?, name),
              category = COALESCE(?, category),
              dietary_category = COALESCE(?, dietary_category),
              prep_time = COALESCE(?, prep_time),
              servings = COALESCE(?, servings),
              recipe = COALESCE(?, recipe),
              animal_spawns = COALESCE(?, animal_spawns),
              recipe_instructions = COALESCE(?, recipe_instructions),
              recipe_ingredients = COALESCE(?, recipe_ingredients),
              image_url = ?,
              created_at = ?
              WHERE id = ?`,
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
          id
        ]
      });
    }

    console.log(`✏️ Saved builtin override for: "${id}" by ${editedBy || 'Moderator'}`);

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
      sql: `INSERT INTO recipes (id, type, name, category, dietary_category, prep_time, servings,
            recipe, animal_spawns, recipe_instructions, recipe_ingredients,
            image_url, submitted_by, status, created_at)
            VALUES (?, 'builtin', ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NULL, 'approved', ?)`,
      args: [
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
        now
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
      sql: 'SELECT id FROM recipes WHERE id = ? AND type = ?',
      args: [id, 'builtin']
    });

    if (existing.rows.length === 0) {
      return json({ error: 'No override found for this recipe' }, { status: 404 });
    }

    if (id.startsWith('admin-')) {
      // Admin-added recipes: delete entirely
      await db.execute({
        sql: "DELETE FROM recipes WHERE id = ? AND type = 'builtin'",
        args: [id]
      });
      console.log(`🗑️ Deleted admin-added recipe: "${id}"`);
      return json({ success: true, id, action: 'deleted' });
    }

    // Existing LEVELS overrides: clear override fields (revert to TypeScript defaults)
    await db.execute({
      sql: `UPDATE recipes SET
            recipe_instructions = NULL,
            recipe_ingredients = NULL
            WHERE id = ? AND type = 'builtin'`,
      args: [id]
    });

    console.log(`🔄 Reverted builtin recipe: "${id}" to original values`);

    return json({
      success: true,
      id,
      action: 'reverted'
    });

  } catch (err) {
    console.error('Failed to delete builtin override:', err);
    return json({ error: 'Failed to revert override' }, { status: 500 });
  }
};
"""

with open(path, 'w') as f:
    f.write(new_content)
print(f'Written {len(new_content)} bytes to {path}')
