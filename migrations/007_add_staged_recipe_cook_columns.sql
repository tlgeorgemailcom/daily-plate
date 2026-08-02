-- Add the optional second and third cook stages used by player recipes.
ALTER TABLE player_recipes ADD COLUMN cook2_method TEXT;
ALTER TABLE player_recipes ADD COLUMN cook2_minutes INTEGER;
ALTER TABLE player_recipes ADD COLUMN cook2_temp_f REAL;
ALTER TABLE player_recipes ADD COLUMN cook3_method TEXT;
ALTER TABLE player_recipes ADD COLUMN cook3_minutes INTEGER;
ALTER TABLE player_recipes ADD COLUMN cook3_temp_f REAL;