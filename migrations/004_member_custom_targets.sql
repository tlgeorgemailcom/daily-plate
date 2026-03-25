-- Migration 004: Per-member custom target overrides
-- Created: March 2026
--
-- Adds three override columns to household_members so that an ALL·IN subscriber
-- can override the DRI-calculated kcal, water (cups), and sugar max for each
-- household member independently of the DRI profile fields.
--
-- Empty string = "use DRI calculated value" (same pattern as height/weight).

ALTER TABLE household_members ADD COLUMN custom_kcal        TEXT NOT NULL DEFAULT '';
ALTER TABLE household_members ADD COLUMN custom_water_cups  TEXT NOT NULL DEFAULT '';
ALTER TABLE household_members ADD COLUMN custom_sugar_max   TEXT NOT NULL DEFAULT '';
