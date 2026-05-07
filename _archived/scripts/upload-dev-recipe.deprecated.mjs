#!/usr/bin/env node
// RETIRED 2026-05-06 (Phase 6 cutover). See docs/v3.md §14b.
//
// The v1 uploader has been retired. dev_recipes is now written by:
//   recipes_v3/tools/upload.py  (run from the daily-food-chain repo root)
//
// To upload v3 builds:
//   cd recipes_v3
//   python3 tools/build_all.py             # rebuild from CSVs
//   python3 tools/upload.py                # dry-run diff
//   python3 tools/upload.py --commit       # write to Turso
//
// The original v1 implementation is preserved in git history if needed.
console.error(
  'upload-dev-recipe.mjs is retired.\n' +
  'Use recipes_v3/tools/upload.py instead. See docs/v3.md §14b.'
);
process.exit(1);
