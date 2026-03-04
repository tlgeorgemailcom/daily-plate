-- Migration: Add password_hash column to players table
-- Created: March 4, 2026

-- Add password_hash column for player authentication
ALTER TABLE players ADD COLUMN password_hash TEXT;

-- Create index for faster login lookups
CREATE INDEX IF NOT EXISTS idx_players_password ON players(password_hash);
