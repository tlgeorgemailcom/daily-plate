import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { writeFileSync, readFileSync, existsSync, mkdirSync } from 'fs';
import { join } from 'path';

const DATA_DIR = join(process.cwd(), 'data', 'recipes');
const PENDING_FILE = join(DATA_DIR, 'pending.json');
const APPROVED_FILE = join(DATA_DIR, 'approved.json');

interface RecipeSubmission {
  id: string;
  recipeName: string;
  category: string;
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
  reviewedAt?: string;
  reviewedBy?: string;
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

export const POST: RequestHandler = async ({ request }) => {
  try {
    const body = await request.json();
    const { id, action, gameFoods, animalSpawns, reviewedBy } = body;
    
    if (!id || !action) {
      return json({ error: 'Missing id or action' }, { status: 400 });
    }
    
    if (!['approve', 'reject'].includes(action)) {
      return json({ error: 'Invalid action' }, { status: 400 });
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
      
      // Update recipe with moderator additions
      recipe.status = 'approved';
      recipe.gameFoods = gameFoods;
      recipe.animalSpawns = animalSpawns || [];
      recipe.reviewedAt = new Date().toISOString();
      recipe.reviewedBy = reviewedBy || 'Moderator';
      
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
