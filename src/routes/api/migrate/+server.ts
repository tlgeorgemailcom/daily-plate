import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { getGameDb } from '$lib/server/turso';

export const GET: RequestHandler = async () => {
  try {
    const db = getGameDb();
    const results: Record<string, unknown> = {};

    // players: last_login_at
    const playerSchema = await db.execute('PRAGMA table_info(players)');
    const playerCols = playerSchema.rows.map((r: Record<string, unknown>) => r['name']);
    results['player_columns'] = playerCols;

    if (!playerCols.includes('last_login_at')) {
      await db.execute('ALTER TABLE players ADD COLUMN last_login_at TEXT');
      results['added_last_login_at'] = true;
    } else {
      results['last_login_at_already_exists'] = true;
    }

    // recipes: link_type
    const recipeSchema = await db.execute('PRAGMA table_info(recipes)');
    const recipeCols = recipeSchema.rows.map((r: Record<string, unknown>) => r['name']);
    results['recipe_columns'] = recipeCols;

    if (!recipeCols.includes('link_type')) {
      await db.execute('ALTER TABLE recipes ADD COLUMN link_type TEXT');
      results['added_link_type'] = true;
    } else {
      results['link_type_already_exists'] = true;
    }

    if (!recipeCols.includes('nutrition_json')) {
      await db.execute('ALTER TABLE recipes ADD COLUMN nutrition_json TEXT');
      results['added_nutrition_json'] = true;
    } else {
      results['nutrition_json_already_exists'] = true;
    }

    return json({ success: true, ...results });
  } catch (err) {
    return json({ success: false, error: String(err) });
  }
};

