import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { queryAll } from '$lib/server/turso';

interface RecipeRow {
  id: string;
  name: string;
  category: string;
  dietary_category: string | null;
  prep_time: string | null;
  servings: string | null;
  recipe: string | null;
  recipe_ingredients: string | null;
  recipe_instructions: string | null;
  food_supply: string | null;
  tools: string | null;
  animal_spawns: string | null;
  submitted_by: string | null;
  status: string;
  created_at: string;
  edited_at: string | null;
  edited_by: string | null;
  link_type: string | null;
  source_type: 'dev' | 'player';
}

export const GET: RequestHandler = async ({ url }) => {
  try {
    const status = url.searchParams.get('status');
    const type = url.searchParams.get('type');
    
    let sql = '';
    const args: string[] = [];

    const wantDev = !type || ['builtin', 'developer', 'dev'].includes(type);
    const wantPlayer = !type || ['community', 'player'].includes(type);

    const queries: string[] = [];
    if (wantDev) {
      queries.push(`SELECT recipe_id AS id, recipe_name AS name, category, dietary_category,
              prep_time, servings, recipe, recipe_ingredients_json AS recipe_ingredients,
              recipe_instructions_json AS recipe_instructions, food_supply, NULL AS tools,
              animal_spawns, submitted_by, status, created_at, updated_at AS edited_at,
              submitted_by AS edited_by, NULL AS link_type, 'dev' AS source_type
       FROM dev_recipes${status ? ' WHERE status = ?' : ''}`);
      if (status) args.push(status);
    }
    if (wantPlayer) {
      queries.push(`SELECT id, title AS name, category, dietary_category,
              prep_time, servings, recipe, recipe_ingredients_json AS recipe_ingredients,
              recipe_instructions_json AS recipe_instructions, food_supply, NULL AS tools,
              animal_spawns, user_id AS submitted_by, status, created_at, updated_at AS edited_at,
              user_id AS edited_by, link_type, 'player' AS source_type
       FROM player_recipes${status ? ' WHERE status = ?' : ''}`);
      if (status) args.push(status);
    }

    sql = `${queries.join(' UNION ALL ')} ORDER BY created_at DESC`;
    
    const rows = await queryAll<RecipeRow>(sql, args);
    
    // Convert to API format
    const recipes = rows.map(row => ({
      id: row.id,
      recipeName: row.name,
      category: row.category,
      dietaryCategory: row.dietary_category,
      submitterName: row.submitted_by || 'System',
      prepTime: row.prep_time || '',
      servings: row.servings || '',
      ingredients: row.recipe_ingredients ? JSON.parse(row.recipe_ingredients) : [],
      instructions: row.recipe_instructions ? JSON.parse(row.recipe_instructions) : [],
      submittedAt: row.created_at,
      status: row.status,
      type: row.source_type,
      linkType: row.link_type ?? undefined
    }));
    
    return json({ recipes });
    
  } catch (err) {
    console.error('Failed to load recipes:', err);
    return json({ error: 'Failed to load recipes' }, { status: 500 });
  }
};
