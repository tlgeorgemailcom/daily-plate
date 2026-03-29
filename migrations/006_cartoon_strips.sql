-- Migration 006: cartoon_strips
-- Created: March 2026
--
-- Purpose: Store daily Feather & Spag comic strip metadata.
--          Strip images are stored on Cloudinary.
--          This table holds metadata and the publication schedule.

CREATE TABLE IF NOT EXISTS cartoon_strips (
  id           INTEGER PRIMARY KEY AUTOINCREMENT,
  publish_date TEXT    NOT NULL UNIQUE,              -- 'YYYY-MM-DD'
  image_url    TEXT    NOT NULL,                     -- Cloudinary delivery URL
  alt_text     TEXT    NOT NULL DEFAULT '',          -- accessibility + SEO
  strip_type   TEXT    NOT NULL DEFAULT 'weekday',   -- 'weekday' | 'sunday'
  created_at   TEXT    NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_cartoon_publish_date ON cartoon_strips(publish_date DESC);
