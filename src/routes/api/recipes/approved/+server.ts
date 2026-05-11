import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { queryAll } from '$lib/server/turso';
import { toDisplayRecipeCategory } from '$lib/farmers-basket/recipe-categories';

interface RecipeRow {
  recipe_id: string;
  recipe_name: string;
  category: string;
  dietary_category: string | null;
  prep_time: string | null;
  servings: string | null;
  recipe_ingredients_json: string | null;
  recipe_instructions_json: string | null;
  image_url: string | null;
  submitted_by: string | null;
  status: string;
  created_at: string;
  link_type: string | null;
  cooking_method: string | null;
  dish_family: string | null;
  nutrition_json: string | null;
  recipe: string | null;
  animal_spawns: string | null;
  food_supply: string | null;
}

export const GET: RequestHandler = async () => {
  try {
    // Get all approved player recipes
    const rows = await queryAll<RecipeRow>(
      `SELECT recipe_id, recipe_name, category, dietary_category, prep_time, servings,
              recipe_ingredients_json, recipe_instructions_json,
              image_url, submitted_by, status, created_at,
              link_type, cooking_method, dish_family, nutrition_json,
              recipe, animal_spawns, food_supply
       FROM player_recipes 
       WHERE status = 'approved'
       ORDER BY created_at ASC`
    );
    
    // Convert to game Level format
    const levels = rows.map((row, index) => {
      const ingredients = row.recipe_ingredients_json ? JSON.parse(row.recipe_ingredients_json) : [];
      const instructions = row.recipe_instructions_json ? JSON.parse(row.recipe_instructions_json) : [];
      
      const gameFoods = row.recipe ? JSON.parse(row.recipe) : [];
      const animalSpawns = row.animal_spawns ? JSON.parse(row.animal_spawns) : [];
      const foodSupply = row.food_supply ? JSON.parse(row.food_supply) : {};
      return {
        id: row.recipe_id,
        levelNum: 100 + index + 1,
        name: row.recipe_name,
        category: toDisplayRecipeCategory(row.category),
        dietaryCategory: row.dietary_category,
        recipe: gameFoods,
        foodSupply,
        animalSpawns,
        tools: [],
        prepTime: row.prep_time,
        servings: row.servings,
        cookingMethod: row.cooking_method ?? undefined,
        dishFamily: row.dish_family ?? undefined,
        recipeInstructions: instructions,
        recipeIngredients: ingredients,
        imageUrl: row.image_url,
        submittedBy: row.submitted_by || 'Player',
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
