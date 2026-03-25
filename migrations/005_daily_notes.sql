-- Migration 005: Daily notes (diary model)
-- Created: 2026
--
-- One note per user per calendar day, compatible with the Jetcool app schema.
-- sentiment_flag: 'positive' | 'negative' | 'neutral'
-- symptoms: JSON array (null for Phase 1 — symptoms UI ships in Phase 2)
-- life_stage_group: DRI LifeStageGroup key, e.g. "Adults19_30y_M" (optional)
--
-- UNIQUE(user_id, note_date) enforces the one-per-day model;
-- API uses INSERT OR REPLACE so upsert semantics work naturally.

CREATE TABLE IF NOT EXISTS daily_notes (
  id               INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id          TEXT NOT NULL,
  note_date        TEXT NOT NULL,
  note_content     TEXT NOT NULL,
  sentiment_flag   TEXT CHECK(sentiment_flag IN ('positive', 'negative', 'neutral')),
  symptoms         TEXT,
  life_stage_group TEXT,
  created_at       TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%SZ', 'now')),
  updated_at       TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%SZ', 'now')),
  UNIQUE(user_id, note_date)
);
