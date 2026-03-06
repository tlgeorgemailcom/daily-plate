import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { queryAll } from '$lib/server/turso';

interface RecipeRow {
  id: string;
  type: string;
  name: string;
  category: string;
  dietary_category: string | null;
  level_num: number | null;
  prep_time: string | null;
  servings: string | null;
  recipe: string | null;
  recipe_ingredients: string | null;
  recipe_instructions: string | null;
  food_supply: string | null;
  tools: string | null;
  animal_spawns: string | null;
  image_url: string | null;
  submitted_by: string | null;
  status: string;
  created_at: string;
}

export const GET: RequestHandler = async () => {
  try {
    // Get all approved community recipes
    const rows = await queryAll<RecipeRow>(
      `SELECT * FROM recipes 
       WHERE status = 'approved' AND type = 'community'
       ORDER BY created_at ASC`
    );
    
    // Convert to game Level format
    const levels = rows.map((row, index) => {
      const gameFoods = row.recipe ? JSON.parse(row.recipe) : [];
      const ingredients = row.recipe_ingredients ? JSON.parse(row.recipe_ingredients) : [];
      const instructions = row.recipe_instructions ? JSON.parse(row.recipe_instructions) : [];
      const animalSpawns = row.animal_spawns ? JSON.parse(row.animal_spawns) : [];
      const tools = row.tools ? JSON.parse(row.tools) : [];
      const foodSupply = row.food_supply ? JSON.parse(row.food_supply) : 
        // Default: count game foods
        gameFoods.reduce((acc: Record<string, number>, food: string) => {
          acc[food] = (acc[food] || 0) + 1;
          return acc;
        }, {});
      
      return {
        id: row.id,
        levelNum: row.level_num || (100 + index + 1), // Community recipes start at 101
        name: row.name,
        category: row.category,
        dietaryCategory: row.dietary_category,
        recipe: gameFoods,
        foodSupply,
        animalSpawns: animalSpawns.map((spawn: { type: string; delay: number }) => ({
          type: spawn.type,
          delay: spawn.delay * 1000, // Convert to ms
          from: 'left' as const
        })),
        tools,
        prepTime: row.prep_time,
        servings: row.servings,
        recipeInstructions: instructions,
        recipeIngredients: ingredients,
        imageUrl: row.image_url,
        submittedBy: row.submitted_by || 'Community',
        isCommunityRecipe: true
      };
    });
    
    return json({ recipes: levels }, {
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate'
      }
    });
    
  } catch (err) {
    console.error('Failed to load approved recipes:', err);
    return json({ error: 'Failed to load recipes' }, { status: 500 });
  }
};
