import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { writeFileSync, readFileSync, existsSync, mkdirSync } from 'fs';
import { join } from 'path';
import { queryAll, execute } from '$lib/server/turso';

const DATA_DIR = join(process.cwd(), 'data', 'recipes');
const PENDING_FILE = join(DATA_DIR, 'pending.json');
const APPROVED_FILE = join(DATA_DIR, 'approved.json');

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
  status: 'pending' | 'approved' | 'rejected';
  // Added by moderator
  gameFoods?: string[];  // Food types for gameplay: ['lettuce', 'tomato', 'cheese']
  animalSpawns?: { type: string; delay: number }[];
  foodSupply?: Record<string, number>;  // How many of each food: { lettuce: 3, tomato: 2 }
  // Enhanced ingredient mapping (game food + animal per ingredient)
  modIngredients?: { 
    name: string; 
    quantity: string; 
    gameFood?: string | null; 
    animal?: string | null; 
  }[];
  imageUrl?: string;  // Cloudinary URL for recipe photo
  reviewedAt?: string;
  reviewedBy?: string;
  // Edit tracking
  editedAt?: string;
  editedBy?: string;
}

function ensureDataDir() {
  if (!existsSync(DATA_DIR)) {
    mkdirSync(DATA_DIR, { recursive: true });
  }
}

function loadJSON(filepath: string): RecipeSubmission[] {
  if (!existsSync(filepath)) {
    return [];
  }
  try {
    return JSON.parse(readFileSync(filepath, 'utf-8'));
  } catch {
    return [];
  }
}

function saveJSON(filepath: string, data: RecipeSubmission[]) {
  ensureDataDir();
  writeFileSync(filepath, JSON.stringify(data, null, 2));
}

// GET: Fetch recipes for moderation (pending + approved for editing)
export const GET: RequestHandler = async ({ url }) => {
  try {
    const filter = url.searchParams.get('filter'); // 'pending', 'approved', or 'all'
    
    const pending = loadJSON(PENDING_FILE);
    const approved = loadJSON(APPROVED_FILE);
    
    if (filter === 'pending') {
      return json({ recipes: pending });
    } else if (filter === 'approved') {
      return json({ recipes: approved });
    } else {
      return json({ 
        pending,
        approved,
        counts: {
          pending: pending.length,
          approved: approved.length
        }
      });
    }
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
      // New fields for full recipe editing on approval
      recipeName,
      category,
      dietaryCategory,
      prepTime,
      servings,
      ingredients,
      instructions
    } = body;
    
    if (!action) {
      return json({ error: 'Missing action' }, { status: 400 });
    }
    
    // Handle creating new built-in recipes
    if (action === 'create-builtin') {
      if (!gameFoods || gameFoods.length === 0) {
        return json({ error: 'Game foods required' }, { status: 400 });
      }
      if (!recipeName || !recipeName.trim()) {
        return json({ error: 'Recipe name required' }, { status: 400 });
      }
      
      const newRecipe: RecipeSubmission = {
        id: `builtin-${Date.now()}`,
        recipeName: recipeName,
        category: category || 'Dinner',
        dietaryCategory: dietaryCategory || 'all',
        submitterName: 'Built-in',
        prepTime: prepTime || '',
        servings: servings || '',
        ingredients: ingredients?.map((ing: { name: string; quantity: string }) => ({
          name: ing.name,
          quantity: ing.quantity
        })) || [],
        instructions: instructions || [],
        submittedAt: new Date().toISOString(),
        status: 'approved',
        gameFoods: gameFoods,
        animalSpawns: animalSpawns || [{ type: 'rabbit', delay: 3 }],
        foodSupply: foodSupply || {},
        modIngredients: ingredients,
        reviewedAt: new Date().toISOString(),
        reviewedBy: 'Moderator'
      };
      
      const approved = loadJSON(APPROVED_FILE);
      approved.push(newRecipe);
      saveJSON(APPROVED_FILE, approved);
      
      console.log(`➕ Created new recipe: "${newRecipe.recipeName}"`);
      
      return json({ 
        success: true, 
        action: 'create-builtin',
        recipe: newRecipe.recipeName,
        id: newRecipe.id
      });
    }
    
    if (!['approve', 'reject'].includes(action)) {
      return json({ error: 'Invalid action' }, { status: 400 });
    }
    
    // For approve/reject, id is required
    if (!id) {
      return json({ error: 'Missing recipe id' }, { status: 400 });
    }
    
    // Load pending recipes
    const pending = loadJSON(PENDING_FILE);
    const recipeIndex = pending.findIndex(r => r.id === id);
    
    if (recipeIndex === -1) {
      return json({ error: 'Recipe not found' }, { status: 404 });
    }
    
    const recipe = pending[recipeIndex];
    
    if (action === 'approve') {
      // Require game foods for approval
      if (!gameFoods || gameFoods.length === 0) {
        return json({ error: 'Game foods required for approval' }, { status: 400 });
      }
      
      // Update recipe with moderator additions and any edits
      recipe.status = 'approved';
      recipe.gameFoods = gameFoods;
      recipe.animalSpawns = animalSpawns || [];
      recipe.foodSupply = foodSupply || {};
      recipe.reviewedAt = new Date().toISOString();
      recipe.reviewedBy = reviewedBy || 'Moderator';
      
      // Apply any moderator edits to the recipe data
      if (recipeName) recipe.recipeName = recipeName;
      if (category) recipe.category = category;
      if (dietaryCategory) recipe.dietaryCategory = dietaryCategory;
      if (prepTime !== undefined) recipe.prepTime = prepTime;
      if (servings !== undefined) recipe.servings = servings;
      if (instructions) recipe.instructions = instructions;
      
      // Store enhanced ingredients with game mappings
      if (ingredients) {
        recipe.ingredients = ingredients.map((ing: { name: string; quantity: string }) => ({
          name: ing.name,
          quantity: ing.quantity
        }));
        // Also store the enhanced modIngredients with game/animal mappings
        recipe.modIngredients = ingredients;
      }
      
      // Move to approved file
      const approved = loadJSON(APPROVED_FILE);
      approved.push(recipe);
      saveJSON(APPROVED_FILE, approved);
      
      console.log(`✅ Approved recipe: "${recipe.recipeName}"`);
    } else {
      // Mark as rejected
      recipe.status = 'rejected';
      recipe.reviewedAt = new Date().toISOString();
      recipe.reviewedBy = reviewedBy || 'Moderator';
      
      console.log(`❌ Rejected recipe: "${recipe.recipeName}"`);
    }
    
    // Remove from pending (or keep with updated status)
    pending.splice(recipeIndex, 1);
    saveJSON(PENDING_FILE, pending);
    
    return json({ 
      success: true, 
      action,
      recipe: recipe.recipeName
    });
    
  } catch (err) {
    console.error('Failed to moderate recipe:', err);
    return json({ error: 'Failed to moderate recipe' }, { status: 500 });
  }
};

// PATCH: Edit an approved recipe (JSON file or database)
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
    
    // Check if this is a database recipe (community recipe IDs start with 'recipe-')
    const isDatabaseRecipe = id.startsWith('recipe-');
    
    if (isDatabaseRecipe) {
      // Update in database
      interface RecipeRow {
        id: string;
        name: string;
        status: string;
      }
      
      const existing = await queryAll<RecipeRow>(
        'SELECT id, name, status FROM recipes WHERE id = ? AND type = ?',
        [id, 'community']
      );
      
      if (existing.length === 0) {
        return json({ error: 'Recipe not found in database' }, { status: 404 });
      }
      
      // Build SQL update
      await execute(
        `UPDATE recipes SET 
          name = COALESCE(?, name),
          category = COALESCE(?, category),
          dietary_category = COALESCE(?, dietary_category),
          prep_time = COALESCE(?, prep_time),
          servings = COALESCE(?, servings),
          recipe = COALESCE(?, recipe),
          recipe_ingredients = COALESCE(?, recipe_ingredients),
          recipe_instructions = COALESCE(?, recipe_instructions),
          animal_spawns = COALESCE(?, animal_spawns),
          image_url = COALESCE(?, image_url)
         WHERE id = ?`,
        [
          updates.recipeName || null,
          updates.category || null,
          updates.dietaryCategory || null,
          updates.prepTime || null,
          updates.servings || null,
          updates.gameFoods ? JSON.stringify(updates.gameFoods) : null,
          updates.ingredients ? JSON.stringify(updates.ingredients) : 
            (updates.modIngredients ? JSON.stringify(updates.modIngredients) : null),
          updates.instructions ? JSON.stringify(updates.instructions) : null,
          updates.animalSpawns ? JSON.stringify(updates.animalSpawns) : null,
          updates.imageUrl !== undefined ? (updates.imageUrl || null) : null,
          id
        ]
      );
      
      console.log(`✏️ Edited database recipe: "${updates.recipeName || existing[0].name}" by ${editedBy || 'Moderator'}`);
      
      return json({ 
        success: true, 
        recipe: updates.recipeName || existing[0].name,
        editedAt: new Date().toISOString()
      });
    }
    
    // Otherwise, update in JSON file
    const approved = loadJSON(APPROVED_FILE);
    const recipeIndex = approved.findIndex(r => r.id === id);
    
    if (recipeIndex === -1) {
      return json({ error: 'Recipe not found in approved list' }, { status: 404 });
    }
    
    const recipe = approved[recipeIndex];
    
    // Allowed fields to update
    const allowedFields = [
      'recipeName',
      'category',
      'dietaryCategory',
      'prepTime',
      'servings',
      'ingredients',
      'modIngredients',
      'instructions',
      'gameFoods',
      'animalSpawns',
      'imageUrl'
    ];
    
    // Apply updates
    for (const field of allowedFields) {
      if (updates[field] !== undefined) {
        (recipe as unknown as Record<string, unknown>)[field] = updates[field];
      }
    }
    
    // Track edit
    recipe.editedAt = new Date().toISOString();
    recipe.editedBy = editedBy || 'Moderator';
    
    // Save
    approved[recipeIndex] = recipe;
    saveJSON(APPROVED_FILE, approved);
    
    console.log(`✏️ Edited recipe: "${recipe.recipeName}" by ${recipe.editedBy}`);
    
    return json({ 
      success: true, 
      recipe: recipe.recipeName,
      editedAt: recipe.editedAt
    });
    
  } catch (err) {
    console.error('Failed to edit recipe:', err);
    return json({ error: 'Failed to edit recipe' }, { status: 500 });
  }
};

// DELETE: Remove an approved recipe (unpublish)
export const DELETE: RequestHandler = async ({ request }) => {
  try {
    const body = await request.json();
    const { id, deletedBy } = body;
    
    if (!id) {
      return json({ error: 'Missing recipe id' }, { status: 400 });
    }
    
    // Load approved recipes
    const approved = loadJSON(APPROVED_FILE);
    const recipeIndex = approved.findIndex(r => r.id === id);
    
    if (recipeIndex === -1) {
      return json({ error: 'Recipe not found in approved list' }, { status: 404 });
    }
    
    const recipe = approved[recipeIndex];
    
    // Remove from approved
    approved.splice(recipeIndex, 1);
    saveJSON(APPROVED_FILE, approved);
    
    console.log(`🗑️ Unpublished recipe: "${recipe.recipeName}" by ${deletedBy || 'Moderator'}`);
    
    return json({ 
      success: true, 
      recipe: recipe.recipeName,
      action: 'unpublished'
    });
    
  } catch (err) {
    console.error('Failed to unpublish recipe:', err);
    return json({ error: 'Failed to unpublish recipe' }, { status: 500 });
  }
};
