-- Daily Food Chain Database Schema
-- Created: March 4, 2026

-- Players & Subscriptions
CREATE TABLE players (
  id TEXT PRIMARY KEY,              -- UUID or auth provider ID
  email TEXT UNIQUE,
  display_name TEXT,
  password_hash TEXT,               -- Hashed password for authentication
  subscription_tier TEXT DEFAULT 'free',  -- 'free' | 'plus' | 'allin' | 'subscriber' | 'moderator'
  subscription_expires_at TEXT,
  billing_owner_id TEXT,            -- NULL = this player is the billing owner; value = shared ALL·IN seat
  created_at TEXT DEFAULT (datetime('now')),
  last_login_at TEXT,
  FOREIGN KEY (billing_owner_id) REFERENCES players(id)
);

CREATE INDEX idx_players_email ON players(email);
CREATE INDEX idx_players_tier ON players(subscription_tier);
CREATE INDEX idx_players_billing_owner ON players(billing_owner_id);

-- Game Statistics
CREATE TABLE game_stats (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  player_id TEXT NOT NULL,
  game TEXT NOT NULL,               -- 'farmers-basket' | 'tower' | 'scrambled' | etc.
  level_id TEXT,                    -- For level-based games
  completed_at TEXT,
  score INTEGER,
  time_seconds INTEGER,
  attempts INTEGER DEFAULT 1,
  FOREIGN KEY (player_id) REFERENCES players(id),
  UNIQUE(player_id, game, level_id)
);

CREATE INDEX idx_stats_player ON game_stats(player_id);
CREATE INDEX idx_stats_game ON game_stats(game);

-- Recipes (Farmer's Basket)
CREATE TABLE recipes (
  id TEXT PRIMARY KEY,
  type TEXT NOT NULL,               -- 'builtin' | 'community'
  name TEXT NOT NULL,
  category TEXT,
  dietary_category TEXT,
  level_num INTEGER,
  prep_time TEXT,
  servings TEXT,
  recipe JSON,                      -- game foods: ["lettuce", "tomato"]
  recipe_ingredients JSON,          -- [{name, quantity}]
  recipe_instructions JSON,         -- steps array
  food_supply JSON,
  tools JSON,
  animal_spawns JSON,
  submitted_by TEXT,                -- player_id (FK to players) or 'System'/'Anonymous'
  submitter_name TEXT,              -- Display name for the submitter
  status TEXT DEFAULT 'pending',    -- 'pending' | 'approved' | 'rejected'
  created_at TEXT DEFAULT (datetime('now')),
  edited_at TEXT,
  edited_by TEXT,
  link_type TEXT,                   -- 'ingredient' | 'dish' | 'mixed' | NULL (unlinked)
  FOREIGN KEY (submitted_by) REFERENCES players(id)
);

CREATE INDEX idx_recipes_status ON recipes(status);
CREATE INDEX idx_recipes_type ON recipes(type);
CREATE INDEX idx_recipes_category ON recipes(category);

-- Leaderboards
CREATE TABLE leaderboard (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  game TEXT NOT NULL,
  level_id TEXT,
  player_id TEXT NOT NULL,
  score INTEGER NOT NULL,
  achieved_at TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (player_id) REFERENCES players(id)
);

CREATE INDEX idx_leaderboard_game ON leaderboard(game, score DESC);

-- Player Settings (Balanced Diet)
CREATE TABLE player_settings (
  player_id TEXT PRIMARY KEY,
  
  -- Calorie targets
  calorie_target INTEGER DEFAULT 2000,
  is_custom_calories INTEGER DEFAULT 0,
  custom_calories INTEGER DEFAULT 2000,
  
  -- Macro ratios (% of calories)
  protein_ratio INTEGER DEFAULT 25,
  carbs_ratio INTEGER DEFAULT 45,
  fats_ratio INTEGER DEFAULT 30,
  
  -- Plate ratios (food group %)
  veg_plate_ratio INTEGER DEFAULT 30,
  fruit_plate_ratio INTEGER DEFAULT 20,
  grain_plate_ratio INTEGER DEFAULT 25,
  protein_plate_ratio INTEGER DEFAULT 25,
  
  -- Individual nutrient targets (empty string = use default)
  water_target TEXT DEFAULT '',
  protein_target TEXT DEFAULT '',
  carbs_target TEXT DEFAULT '',
  fats_target TEXT DEFAULT '',
  fiber_target TEXT DEFAULT '',
  sugar_target TEXT DEFAULT '',
  
  updated_at TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (player_id) REFERENCES players(id)
);

-- Custom Foods (User-Created)
CREATE TABLE custom_foods (
  id TEXT PRIMARY KEY,              -- 'custom-{timestamp}-{random}'
  player_id TEXT NOT NULL,
  
  -- Food details
  name TEXT NOT NULL,
  food_group TEXT NOT NULL,         -- vegetable|fruit|grain|protein|dairy|etc.
  
  -- Nutrition per 100g
  calories REAL NOT NULL,           -- kcal
  protein REAL NOT NULL,            -- grams
  carbs REAL NOT NULL,              -- grams
  fat REAL NOT NULL,                -- grams
  fiber REAL DEFAULT 0,             -- grams
  sugar REAL DEFAULT 0,             -- grams
  water REAL DEFAULT 0,             -- grams
  
  -- Portions (JSON array of {amt, desc, gm})
  portions JSON NOT NULL,
  
  created_at TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (player_id) REFERENCES players(id)
);

CREATE INDEX idx_custom_foods_player ON custom_foods(player_id);
CREATE INDEX idx_custom_foods_group ON custom_foods(food_group);

-- Daily Meal Logs (Optional - for History)
CREATE TABLE meal_logs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  player_id TEXT NOT NULL,
  log_date TEXT NOT NULL,           -- 'YYYY-MM-DD'
  
  -- Snapshot of day's configuration
  meals JSON NOT NULL,              -- [{id, name, foods: []}] meal slots
  added_foods JSON NOT NULL,        -- Full AddedFood[] array with nutrients
  targets JSON,                     -- DailyTargets snapshot
  nutrient_targets JSON,            -- NutrientTargets snapshot
  
  -- Summary stats (for quick queries)
  total_calories INTEGER,
  total_protein REAL,
  total_carbs REAL,
  total_fat REAL,
  
  created_at TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (player_id) REFERENCES players(id),
  UNIQUE(player_id, log_date)
);

CREATE INDEX idx_meal_logs_player_date ON meal_logs(player_id, log_date DESC);

-- Household Members (ALL·IN tier — sub-profiles for DRI tracking)
-- Field names mirror Jetcool's profile table (profile_columns.dart) for cross-app compatibility.
-- DRI key = groupage || age  e.g. 'Males19_30y'. EER is derived at runtime.
CREATE TABLE household_members (
  id TEXT PRIMARY KEY,              -- UUID generated client-side
  owner_id TEXT NOT NULL,           -- FK → players.id (the ALL·IN subscriber)
  display_name TEXT NOT NULL,
  avatar_icon  TEXT NOT NULL DEFAULT '👤',
  avatar_color TEXT NOT NULL DEFAULT '#60a5fa',
  groupage       TEXT NOT NULL,     -- 'Infants'|'Children'|'Males'|'Females'|'Pregnancy'|'Lactation'
  age            TEXT NOT NULL,     -- bracket e.g. '19_30y', '0_6mo', '>70y'
  height         TEXT NOT NULL DEFAULT '',
  height_unit    TEXT NOT NULL DEFAULT 'inches',  -- 'inches'|'cm'
  weight         TEXT NOT NULL DEFAULT '',
  weight_unit    TEXT NOT NULL DEFAULT 'pounds',  -- 'pounds'|'kilos'
  activity_level TEXT NOT NULL DEFAULT 'Sedentary',
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (owner_id) REFERENCES players(id) ON DELETE CASCADE
);

CREATE INDEX idx_household_owner ON household_members(owner_id);
