# Database Migrations

This folder contains SQL migration files that are automatically run when pushed to GitHub.

## How it works

1. Add a new `.sql` file with your migration (use timestamp prefix for ordering)
2. Commit and push to `main` branch
3. GitHub Actions detects the new migration file
4. Turso CLI runs the migration automatically

## Naming convention

Use timestamps to ensure correct ordering:
```
2026-03-04-001-add-submitter-name.sql
2026-03-05-001-add-index.sql
```

## Example migration

```sql
-- migrations/2026-03-04-001-add-column.sql
ALTER TABLE recipes ADD COLUMN new_column TEXT;
```

## Important notes

- Migrations are **not idempotent** - they run once per commit
- Test migrations locally first: `npx turso db shell daily-food-chain < migrations/your-file.sql`
- The workflow only runs migrations for files changed in the commit
- Keep migrations small and focused

## Current schema

See `schema.sql` in the project root for the complete database schema.
