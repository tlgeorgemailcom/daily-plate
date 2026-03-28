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

    // daily_meal_log: natural-key schema migration
    // Check whether the new schema (no id column, UNIQUE natural key) is already in place.
    const mlSchema = await db.execute('PRAGMA table_info(daily_meal_log)');
    const mlCols = mlSchema.rows.map((r: Record<string, unknown>) => r['name'] as string);
    results['meal_log_columns'] = mlCols;

    if (mlCols.includes('id')) {
      // Old schema present — migrate to natural-key schema.
      // Step 1: rename old table as backup (skip if already renamed from a previous run).
      const v1Tables = await db.execute("SELECT name FROM sqlite_master WHERE type='table' AND name='daily_meal_log_v1'");
      if (v1Tables.rows.length === 0) {
        await db.execute('ALTER TABLE daily_meal_log RENAME TO daily_meal_log_v1');
        results['meal_log_renamed_to_v1'] = true;
      }

      // Step 2: create new table with UNIQUE natural key.
      await db.execute(`
        CREATE TABLE IF NOT EXISTS daily_meal_log (
          user_id             TEXT NOT NULL,
          meal_date           TEXT NOT NULL,
          meal_category       TEXT NOT NULL,
          food_id             TEXT NOT NULL,
          food_name           TEXT,
          brand_name          TEXT,
          quantity_grams      REAL NOT NULL DEFAULT 0,
          serving_description TEXT,
          kcal                REAL NOT NULL DEFAULT 0,
          protein             REAL NOT NULL DEFAULT 0,
          carbohydrate        REAL NOT NULL DEFAULT 0,
          fat                 REAL NOT NULL DEFAULT 0,
          sugar               REAL DEFAULT 0,
          fiber               REAL DEFAULT 0,
          sodium              REAL DEFAULT 0,
          water               REAL DEFAULT 0,
          extended_nutrients  TEXT,
          notes               TEXT,
          is_favorite         INTEGER NOT NULL DEFAULT 0,
          updated_at          TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%SZ','now')),
          UNIQUE (user_id, meal_date, meal_category, food_id)
        )
      `);

      // Step 3: copy data from v1, keeping most-recent row per natural key.
      await db.execute(`
        INSERT OR IGNORE INTO daily_meal_log
          (user_id, meal_date, meal_category, food_id,
           food_name, brand_name, quantity_grams, serving_description,
           kcal, protein, carbohydrate, fat, sugar, fiber, sodium, water,
           extended_nutrients, notes, is_favorite, updated_at)
        SELECT
          user_id, meal_date, meal_category, food_id,
          food_name, brand_name, quantity_grams, serving_description,
          kcal, protein, carbohydrate, fat, sugar, fiber, sodium, water,
          extended_nutrients, notes, is_favorite, MAX(updated_at)
        FROM daily_meal_log_v1
        GROUP BY user_id, meal_date, meal_category, food_id
      `);

      results['meal_log_migrated'] = true;
    } else {
      // New schema already in place — ensure table exists (first deploy).
      await db.execute(`
        CREATE TABLE IF NOT EXISTS daily_meal_log (
          user_id             TEXT NOT NULL,
          meal_date           TEXT NOT NULL,
          meal_category       TEXT NOT NULL,
          food_id             TEXT NOT NULL,
          food_name           TEXT,
          brand_name          TEXT,
          quantity_grams      REAL NOT NULL DEFAULT 0,
          serving_description TEXT,
          kcal                REAL NOT NULL DEFAULT 0,
          protein             REAL NOT NULL DEFAULT 0,
          carbohydrate        REAL NOT NULL DEFAULT 0,
          fat                 REAL NOT NULL DEFAULT 0,
          sugar               REAL DEFAULT 0,
          fiber               REAL DEFAULT 0,
          sodium              REAL DEFAULT 0,
          water               REAL DEFAULT 0,
          extended_nutrients  TEXT,
          notes               TEXT,
          is_favorite         INTEGER NOT NULL DEFAULT 0,
          updated_at          TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%SZ','now')),
          UNIQUE (user_id, meal_date, meal_category, food_id)
        )
      `);
      results['daily_meal_log'] = 'ok';
    }

    await db.execute(
      'CREATE INDEX IF NOT EXISTS idx_meal_log_user_date ON daily_meal_log(user_id, meal_date)'
    );
    await db.execute(
      'CREATE INDEX IF NOT EXISTS idx_meal_log_updated ON daily_meal_log(user_id, updated_at)'
    );

    // planned_meals: future meal planning
    await db.execute(`
      CREATE TABLE IF NOT EXISTS planned_meals (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        planned_date TEXT NOT NULL,
        meal_category TEXT NOT NULL,
        food_id TEXT NOT NULL,
        food_name TEXT NOT NULL,
        quantity_grams REAL NOT NULL,
        serving_description TEXT,
        source TEXT NOT NULL DEFAULT 'web',
        created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
      )
    `);
    await db.execute(
      'CREATE INDEX IF NOT EXISTS idx_planned_meals_user_date ON planned_meals(user_id, planned_date)'
    );
    results['planned_meals'] = 'ok';

    // meal_templates: saved named day plans
    await db.execute(`
      CREATE TABLE IF NOT EXISTS meal_templates (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        name TEXT NOT NULL,
        description TEXT,
        meal_data TEXT NOT NULL,
        created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
      )
    `);
    await db.execute(
      'CREATE INDEX IF NOT EXISTS idx_meal_templates_user ON meal_templates(user_id)'
    );
    results['meal_templates'] = 'ok';

    // meal_templates: add saved_from_date column if missing
    const tmplSchema = await db.execute('PRAGMA table_info(meal_templates)');
    const tmplCols = tmplSchema.rows.map((r: Record<string, unknown>) => r['name']);
    if (!tmplCols.includes('saved_from_date')) {
      await db.execute('ALTER TABLE meal_templates ADD COLUMN saved_from_date TEXT');
      results['added_saved_from_date'] = true;
    } else {
      results['saved_from_date_already_exists'] = true;
    }
    if (!tmplCols.includes('total_kcal')) {
      await db.execute('ALTER TABLE meal_templates ADD COLUMN total_kcal REAL DEFAULT 0');
      results['added_total_kcal'] = true;
    } else {
      results['total_kcal_already_exists'] = true;
    }

    // meal_categories: user-defined custom meal slots (ALL·IN only)
    await db.execute(`
      CREATE TABLE IF NOT EXISTS meal_categories (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id TEXT NOT NULL,
        name TEXT NOT NULL,
        label TEXT NOT NULL,
        emoji TEXT NOT NULL DEFAULT '🍽️',
        color TEXT NOT NULL DEFAULT '#6B7280',
        sort_order INTEGER NOT NULL DEFAULT 0,
        is_active INTEGER NOT NULL DEFAULT 1,
        created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(user_id, name)
      )
    `);
    await db.execute(
      'CREATE INDEX IF NOT EXISTS idx_meal_categories_user ON meal_categories(user_id, is_active)'
    );
    results['meal_categories'] = 'ok';

    // daily_meal_log: add custom_category_id column if missing
    const logSchema = await db.execute('PRAGMA table_info(daily_meal_log)');
    const logCols = logSchema.rows.map((r: Record<string, unknown>) => r['name']);
    if (!logCols.includes('custom_category_id')) {
      await db.execute('ALTER TABLE daily_meal_log ADD COLUMN custom_category_id INTEGER');
      results['added_custom_category_id'] = true;
    } else {
      results['custom_category_id_already_exists'] = true;
    }

    // household_members: jetcool_sharing_behavior (controls Auto Share vs Prompt per member)
    const memberSchema = await db.execute('PRAGMA table_info(household_members)');
    const memberCols = memberSchema.rows.map((r: Record<string, unknown>) => r['name']);
    if (!memberCols.includes('jetcool_sharing_behavior')) {
      await db.execute(
        "ALTER TABLE household_members ADD COLUMN jetcool_sharing_behavior TEXT NOT NULL DEFAULT 'prompt'"
      );
      results['added_jetcool_sharing_behavior'] = true;
    } else {
      results['jetcool_sharing_behavior_already_exists'] = true;
    }

    // player_settings: owner demographic fields (drive "You" profile on jetcool)
    const settingsSchema = await db.execute('PRAGMA table_info(player_settings)');
    const settingsCols = settingsSchema.rows.map((r: Record<string, unknown>) => r['name']);
    const demographicCols: [string, string][] = [
      ['owner_groupage',      "TEXT DEFAULT ''"],
      ['owner_age',           "TEXT DEFAULT ''"],
      ['owner_height',        "TEXT DEFAULT ''"],
      ['owner_height_unit',   "TEXT DEFAULT 'cm'"],
      ['owner_weight',        "TEXT DEFAULT ''"],
      ['owner_weight_unit',   "TEXT DEFAULT 'kilos'"],
      ['owner_activity_level',"TEXT DEFAULT ''"],
      ['owner_use_dri_macros',"INTEGER DEFAULT 1"],
      ['owner_custom_kcal',   "TEXT DEFAULT ''"],
      ['owner_custom_water_cups', "TEXT DEFAULT ''"],
      ['owner_custom_sugar_max',  "TEXT DEFAULT ''"],
      ['owner_custom_fiber_g',    "TEXT DEFAULT ''"],
    ];
    for (const [col, def] of demographicCols) {
    // password_reset_tokens table
    await db.execute(`
      CREATE TABLE IF NOT EXISTS password_reset_tokens (
        token       TEXT PRIMARY KEY,
        email       TEXT NOT NULL,
        expires_at  TEXT NOT NULL,
        created_at  TEXT NOT NULL DEFAULT (datetime('now'))
      )
    `);
    await db.execute(`CREATE INDEX IF NOT EXISTS idx_prt_email ON password_reset_tokens(email)`);
    results['password_reset_tokens'] = 'ok';

    return json({ success: true, ...results });
  } catch (err) {
    return json({ success: false, error: String(err) });
  }
};

