-- Migration 003: ALL·IN tier + household members
-- Created: March 2026
--
-- Changes:
--   1. players.subscription_tier — extend allowed values to include 'plus' and 'allin'
--      (SQLite has no enum; the column stays TEXT, app logic enforces the values)
--   2. players.billing_owner_id — links an ALL·IN seat holder back to the player
--      who owns the subscription (NULL = this player is the billing owner)
--   3. New table: household_members — sub-profiles added by an ALL·IN subscriber
--      to track DRI targets and nutrient goals for family / household members.
--      These are NOT separate player accounts; they are data owned by the owner.

-- ── 1. players: add billing_owner_id ─────────────────────────────────────────
-- NULL  → this row is its own billing owner (Free / Plus / ALL·IN primary)
-- value → this is a shared seat; the billing owner holds the ALL·IN subscription
ALTER TABLE players ADD COLUMN billing_owner_id TEXT REFERENCES players(id);

CREATE INDEX IF NOT EXISTS idx_players_billing_owner ON players(billing_owner_id);

-- ── 2. household_members ─────────────────────────────────────────────────────
-- One row per person added by an ALL·IN subscriber via Settings → Sharing.
-- Field names deliberately mirror Jetcool's profile table (profile_columns.dart)
-- so that data written here is structurally compatible with the mobile app.
--
-- DRI lookup key = groupage || age  e.g. 'Males' + '19_30y' = 'Males19_30y'
-- EER (personalised calories) is derived at runtime from height/weight/activity_level.

CREATE TABLE household_members (
  id TEXT PRIMARY KEY,              -- UUID generated client-side

  -- Ownership
  owner_id TEXT NOT NULL,           -- FK → players.id (the ALL·IN subscriber)

  -- Identity / avatar
  display_name TEXT NOT NULL,
  avatar_icon  TEXT NOT NULL DEFAULT '👤',   -- emoji or icon key
  avatar_color TEXT NOT NULL DEFAULT '#60a5fa', -- hex colour for avatar circle

  -- DRI profile fields — same column names as Jetcool profile table
  groupage       TEXT NOT NULL,     -- 'Infants' | 'Children' | 'Males' | 'Females' | 'Pregnancy' | 'Lactation'
  age            TEXT NOT NULL,     -- age bracket e.g. '19_30y', '0_6mo', '>70y'
  height         TEXT NOT NULL DEFAULT '', -- numeric string e.g. '68'
  height_unit    TEXT NOT NULL DEFAULT 'inches', -- 'inches' | 'cm'
  weight         TEXT NOT NULL DEFAULT '', -- numeric string e.g. '154'
  weight_unit    TEXT NOT NULL DEFAULT 'pounds', -- 'pounds' | 'kilos'
  activity_level TEXT NOT NULL DEFAULT 'Sedentary', -- 'Sedentary' | 'Low Active' | 'Active' | 'Very Active'

  -- Sort order within the owner's household list
  sort_order INTEGER NOT NULL DEFAULT 0,

  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now')),

  FOREIGN KEY (owner_id) REFERENCES players(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_household_owner ON household_members(owner_id);
