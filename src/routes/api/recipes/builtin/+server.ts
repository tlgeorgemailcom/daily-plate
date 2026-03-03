import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { writeFileSync, readFileSync, existsSync, mkdirSync } from 'fs';
import { join } from 'path';

const DATA_DIR = join(process.cwd(), 'data', 'recipes');
const BUILTIN_OVERRIDES_FILE = join(DATA_DIR, 'builtin-overrides.json');
const STATIC_OVERRIDES_FILE = join(process.cwd(), 'static', 'builtin-overrides.json');

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

function ensureDataDir() {
  if (!existsSync(DATA_DIR)) {
    mkdirSync(DATA_DIR, { recursive: true });
  }
}

function loadOverrides(): Record<string, BuiltinOverride> {
  if (!existsSync(BUILTIN_OVERRIDES_FILE)) {
    return {};
  }
  try {
    return JSON.parse(readFileSync(BUILTIN_OVERRIDES_FILE, 'utf-8'));
  } catch {
    return {};
  }
}

function saveOverrides(data: Record<string, BuiltinOverride>) {
  ensureDataDir();
  const jsonStr = JSON.stringify(data, null, 2);
  // Save to both locations - data folder and static folder
  writeFileSync(BUILTIN_OVERRIDES_FILE, jsonStr);
  writeFileSync(STATIC_OVERRIDES_FILE, jsonStr);
}

// GET: Fetch all built-in overrides
export const GET: RequestHandler = async () => {
  try {
    const overrides = loadOverrides();
    return json({ overrides });
  } catch (err) {
    console.error('Failed to load builtin overrides:', err);
    return json({ error: 'Failed to load overrides' }, { status: 500 });
  }
};

// PATCH: Save/update an override for a built-in recipe
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
    
    // Load existing overrides
    const overrides = loadOverrides();
    
    // Create or update the override
    overrides[id] = {
      id,
      ...updates,
      editedAt: new Date().toISOString(),
      editedBy: editedBy || 'Moderator'
    };
    
    // Save
    saveOverrides(overrides);
    
    console.log(`✏️ Saved builtin override for: "${id}" by ${editedBy || 'Moderator'}`);
    
    return json({ 
      success: true, 
      id,
      editedAt: overrides[id].editedAt
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
    
    // Load existing overrides
    const overrides = loadOverrides();
    
    if (!overrides[id]) {
      return json({ error: 'No override found for this recipe' }, { status: 404 });
    }
    
    // Remove the override
    delete overrides[id];
    saveOverrides(overrides);
    
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
