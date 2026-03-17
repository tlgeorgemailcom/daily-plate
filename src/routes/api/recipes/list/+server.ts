import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { queryAll } from '$lib/server/turso';

interface RecipeRow {
  id: string;
  type: string;
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
}

export const GET: RequestHandler = async ({ url }) => {
  try {
    const status = url.searchParams.get('status');
    const type = url.searchParams.get('type');
    
    let sql = 'SELECT * FROM recipes WHERE 1=1';
    const args: string[] = [];
    
    if (status) {
      sql += ' AND status = ?';
      args.push(status);
    }
    
    if (type) {
      sql += ' AND type = ?';
      args.push(type);
    }
    
    sql += ' ORDER BY created_at DESC';
    
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
      type: row.type,
      linkType: row.link_type ?? undefined
    }));
    
    return json({ recipes });
    
  } catch (err) {
    console.error('Failed to load recipes:', err);
    return json({ error: 'Failed to load recipes' }, { status: 500 });
  }
};
