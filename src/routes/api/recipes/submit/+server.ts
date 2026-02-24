import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { writeFileSync, readFileSync, existsSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';

// Path to store pending recipes (JSON)
const DATA_DIR = join(process.cwd(), 'data', 'recipes');
const PENDING_FILE = join(DATA_DIR, 'pending.json');
const PENDING_CSV = join(DATA_DIR, 'pending.csv');

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
}

// Ensure data directory exists
function ensureDataDir() {
  if (!existsSync(DATA_DIR)) {
    mkdirSync(DATA_DIR, { recursive: true });
  }
}

// Load existing pending recipes
function loadPending(): RecipeSubmission[] {
  ensureDataDir();
  if (!existsSync(PENDING_FILE)) {
    return [];
  }
  try {
    const data = readFileSync(PENDING_FILE, 'utf-8');
    return JSON.parse(data);
  } catch {
    return [];
  }
}

// Save pending recipes to JSON
function savePendingJSON(recipes: RecipeSubmission[]) {
  ensureDataDir();
  writeFileSync(PENDING_FILE, JSON.stringify(recipes, null, 2));
}

// Append to CSV for easy viewing/editing
function appendToCSV(recipe: RecipeSubmission) {
  ensureDataDir();
  
  // Create header if file doesn't exist
  if (!existsSync(PENDING_CSV)) {
    const header = 'id,recipeName,category,submitterName,prepTime,servings,ingredients,instructions,submittedAt,status\n';
    writeFileSync(PENDING_CSV, header);
  }
  
  // Escape CSV values
  const escapeCSV = (val: string) => `"${val.replace(/"/g, '""')}"`;
  
  const ingredientsStr = recipe.ingredients
    .map(i => `${i.quantity} ${i.name}`)
    .join('; ');
  
  const instructionsStr = recipe.instructions.join('; ');
  
  const row = [
    recipe.id,
    escapeCSV(recipe.recipeName),
    recipe.category,
    escapeCSV(recipe.submitterName),
    escapeCSV(recipe.prepTime),
    escapeCSV(recipe.servings),
    escapeCSV(ingredientsStr),
    escapeCSV(instructionsStr),
    recipe.submittedAt,
    recipe.status
  ].join(',') + '\n';
  
  writeFileSync(PENDING_CSV, row, { flag: 'a' });
}

// Generate unique ID
function generateId(): string {
  return `recipe-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

export const POST: RequestHandler = async ({ request }) => {
  try {
    const body = await request.json();
    
    // Validate required fields
    if (!body.recipeName || !body.category || !body.ingredients?.length || !body.instructions?.length) {
      return json({ error: 'Missing required fields' }, { status: 400 });
    }
    
    // Create submission record
    const submission: RecipeSubmission = {
      id: generateId(),
      recipeName: body.recipeName,
      category: body.category,
      submitterName: body.submitterName || 'Anonymous',
      prepTime: body.prepTime || '',
      servings: body.servings || '',
      ingredients: body.ingredients,
      instructions: body.instructions,
      submittedAt: body.submittedAt || new Date().toISOString(),
      status: 'pending'
    };
    
    // Save to JSON (append to existing)
    const pending = loadPending();
    pending.push(submission);
    savePendingJSON(pending);
    
    // Also append to CSV for easy viewing
    appendToCSV(submission);
    
    console.log(`✅ New recipe submitted: "${submission.recipeName}" by ${submission.submitterName}`);
    
    return json({ 
      success: true, 
      id: submission.id,
      message: 'Recipe submitted for review!'
    });
    
  } catch (err) {
    console.error('Failed to save recipe:', err);
    return json({ error: 'Failed to submit recipe' }, { status: 500 });
  }
};
