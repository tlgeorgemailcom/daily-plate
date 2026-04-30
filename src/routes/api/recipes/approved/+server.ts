import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { queryAll } from '$lib/server/turso';
import { toDisplayRecipeCategory } from '$lib/farmers-basket/recipe-categories';

interface RecipeRow {
  id: string;
  title: string;
  category: string;
  dietary_category: string | null;
  prep_time: string | null;
  servings: string | null;
  recipe: string | null;
  recipe_ingredients_json: string | null;
  recipe_instructions_json: string | null;
  food_supply: string | null;
  animal_spawns: string | null;
  image_url: string | null;
  user_id: string | null;
  submitter_name: string | null;
  status: string;
  created_at: string;
  link_type: string | null;
  nutrition_json: string | null;
}

export const GET: RequestHandler = async () => {
  try {
    // Get all approved player recipes
    const rows = await queryAll<RecipeRow>(
      `SELECT id, title, category, dietary_category, prep_time, servings, recipe,
              recipe_ingredients_json, recipe_instructions_json, food_supply,
              animal_spawns, image_url, user_id, submitter_name, status, created_at,
              link_type, nutrition_json
       FROM player_recipes 
       WHERE status = 'approved'
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
        levelNum: 100 + index + 1,
        name: row.title,
        category: toDisplayRecipeCategory(row.category),
        dietaryCategory: row.dietary_category,
        recipe: gameFoods,
        foodSupply,
        animalSpawns: animalSpawns.map((spawn: { type: string; delay: number }) => ({
          type: spawn.type,
          delay: spawn.delay * 1000, // Convert to ms
          from: 'left' as const
        })),
        tools: [],
        prepTime: row.prep_time,
        servings: row.servings,
        recipeInstructions: instructions,
        recipeIngredients: ingredients,
        imageUrl: row.image_url,
        submittedBy: row.submitter_name || row.user_id || 'Player',
        isCommunityRecipe: true,
        linkType: (row.link_type as 'ingredient' | 'dish' | 'mixed') ?? undefined,
        nutritionJson: row.nutrition_json ? JSON.parse(row.nutrition_json) : null
      };
    });
    
    return json({ recipes: levels }, {
      headers: {
        'Cache-Control': 'public, s-maxage=30, stale-while-revalidate=300'
      }
    });
    
  } catch (err) {
    console.error('Failed to load approved recipes:', err);
    return json({ error: 'Failed to load recipes' }, { status: 500 });
  }
};
