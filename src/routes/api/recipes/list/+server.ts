import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { readFileSync, existsSync } from 'fs';
import { join } from 'path';

const DATA_DIR = join(process.cwd(), 'data', 'recipes');
const PENDING_FILE = join(DATA_DIR, 'pending.json');

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

export const GET: RequestHandler = async ({ url }) => {
  try {
    if (!existsSync(PENDING_FILE)) {
      return json({ recipes: [] });
    }
    
    const data = readFileSync(PENDING_FILE, 'utf-8');
    const recipes: RecipeSubmission[] = JSON.parse(data);
    
    // Filter by status if provided
    const status = url.searchParams.get('status');
    const filtered = status 
      ? recipes.filter(r => r.status === status)
      : recipes;
    
    return json({ recipes: filtered });
    
  } catch (err) {
    console.error('Failed to load recipes:', err);
    return json({ error: 'Failed to load recipes' }, { status: 500 });
  }
};
