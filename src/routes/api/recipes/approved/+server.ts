import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { readFileSync, existsSync } from 'fs';
import { join } from 'path';

const DATA_DIR = join(process.cwd(), 'data', 'recipes');
const APPROVED_FILE = join(DATA_DIR, 'approved.json');

interface ApprovedRecipe {
  id: string;
  recipeName: string;
  category: string;
  submitterName: string;
  prepTime: string;
  servings: string;
  ingredients: { name: string; quantity: string }[];
  instructions: string[];
  submittedAt: string;
  status: 'approved';
  gameFoods: string[];
  animalSpawns: { type: string; delay: number }[];
  reviewedAt: string;
  reviewedBy: string;
}

export const GET: RequestHandler = async () => {
  try {
    if (!existsSync(APPROVED_FILE)) {
      return json({ recipes: [] });
    }
    
    const data = readFileSync(APPROVED_FILE, 'utf-8');
    const recipes: ApprovedRecipe[] = JSON.parse(data);
    
    // Convert to game Level format
    const levels = recipes.map((recipe, index) => ({
      id: recipe.id,
      levelNum: 100 + index + 1, // Community recipes start at 101
      name: recipe.recipeName,
      category: recipe.category,
      recipe: recipe.gameFoods,
      foodSupply: recipe.gameFoods.reduce((acc, food) => {
        acc[food] = (acc[food] || 0) + 1;
        return acc;
      }, {} as Record<string, number>),
      animalSpawns: recipe.animalSpawns.map(spawn => ({
        type: spawn.type,
        delay: spawn.delay * 1000, // Convert to ms
        from: 'left' as const
      })),
      tools: [], // Default tools
      prepTime: recipe.prepTime ? `${recipe.prepTime} mins` : undefined,
      servings: recipe.servings ? `${recipe.servings} servings` : undefined,
      recipeInstructions: recipe.instructions,
      submittedBy: recipe.submitterName,
      isCommunityRecipe: true
    }));
    
    return json({ recipes: levels });
    
  } catch (err) {
    console.error('Failed to load approved recipes:', err);
    return json({ error: 'Failed to load recipes' }, { status: 500 });
  }
};
