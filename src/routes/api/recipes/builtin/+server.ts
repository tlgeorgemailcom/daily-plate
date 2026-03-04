import { json } from '@sveltejs/kit';
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
  editedAt: string;
  editedBy: string;
}

// GET: Fetch all built-in recipe overrides from Turso
export const GET: RequestHandler = async () => {
  try {
    // Get builtin recipes where there's been custom edits (recipe_ingredients/instructions set)
    const rows = await queryAll<BuiltinRecipeRow>(
      `SELECT id, name, category, dietary_category, prep_time, servings, 
              recipe, animal_spawns, recipe_instructions, recipe_ingredients, 
              created_at, submitted_by
       FROM recipes 
       WHERE type = 'builtin' 
         AND (recipe_ingredients IS NOT NULL OR recipe_instructions IS NOT NULL)`
    );
    
    // Convert rows to override format
    const overrides: Record<string, BuiltinOverride> = {};
    for (const row of rows) {
      const override: BuiltinOverride = {
        id: row.id,
        editedAt: row.created_at,
        editedBy: row.submitted_by || 'System'
      };
      
      // Only include fields that have been overridden
      if (row.name) override.name = row.name;
      if (row.category) override.category = row.category;
      if (row.dietary_category) override.dietaryCategory = row.dietary_category;
      if (row.prep_time) override.prepTime = row.prep_time;
      if (row.servings) override.servings = row.servings;
      if (row.recipe) override.recipe = JSON.parse(row.recipe);
      if (row.animal_spawns) override.animalSpawns = JSON.parse(row.animal_spawns);
      if (row.recipe_instructions) override.recipeInstructions = JSON.parse(row.recipe_instructions);
      if (row.recipe_ingredients) override.recipeIngredients = JSON.parse(row.recipe_ingredients);
      
      overrides[row.id] = override;
    }
    
    return json({ overrides });
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
    
    // Always use 'System' for builtin edits (FK constraint on players table)
    const submittedBy = 'System';
    
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
              submitted_by, status, created_at)
              VALUES (?, 'builtin', ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'approved', ?)`,
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
          submittedBy,
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
              submitted_by = ?,
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
          submittedBy,
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

// DELETE: Remove an override (revert to original built-in values)
export const DELETE: RequestHandler = async ({ request }) => {
  try {
    const body = await request.json();
    const { id } = body;
    
    if (!id) {
      return json({ error: 'Missing recipe id' }, { status: 400 });
    }
    
    const db = getGameDb();
    
    // Check if the override exists
    const existing = await db.execute({
      sql: 'SELECT id FROM recipes WHERE id = ? AND type = ?',
      args: [id, 'builtin']
    });
    
    if (existing.rows.length === 0) {
      return json({ error: 'No override found for this recipe' }, { status: 404 });
    }
    
    // Clear the override fields (set instructions/ingredients to null)
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
