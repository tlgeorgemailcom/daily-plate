"""Single source of paths for the v3 pipeline.

Every v3 module that needs to touch a file outside `recipes_v3/` must import
from here. No other v3 file may hardcode an absolute path.

Override any of these with an environment variable of the same name.
"""
from __future__ import annotations

import os
from pathlib import Path

# ── Anchors ──────────────────────────────────────────────────────────────────
# This file lives at recipes_v3/config.py.
RECIPES_V3_ROOT: Path = Path(__file__).resolve().parent
REPO_ROOT: Path = RECIPES_V3_ROOT.parent

# ── v3-owned directories ─────────────────────────────────────────────────────
DATA_DIR: Path = RECIPES_V3_ROOT / "data"
LIB_DIR: Path = RECIPES_V3_ROOT / "lib"
TOOLS_DIR: Path = RECIPES_V3_ROOT / "tools"
OUTPUT_DIR: Path = RECIPES_V3_ROOT / "output"
BUILDS_DIR: Path = OUTPUT_DIR / "builds"
AUDITS_DIR: Path = OUTPUT_DIR / "audits"
COMPARE_DIR: Path = OUTPUT_DIR / "compare"
UPLOAD_LOG_DIR: Path = OUTPUT_DIR / "upload_log"

# ── v3 input CSVs ────────────────────────────────────────────────────────────
RECIPES_CSV: Path = DATA_DIR / "recipes.csv"
INGREDIENTS_LEDGER_CSV: Path = DATA_DIR / "ingredients_ledger.csv"
RECIPE_INGREDIENTS_CSV: Path = DATA_DIR / "recipe_ingredients.csv"
RECIPE_INSTRUCTIONS_CSV: Path = DATA_DIR / "recipe_instructions.csv"
RECIPE_SECTIONS_CSV: Path = DATA_DIR / "recipe_sections.csv"
GAME_DESIGN_CSV: Path = DATA_DIR / "game_design.csv"

# ── External read-only references ────────────────────────────────────────────
# comboo.db is the USDA SR-Legacy nutrient database. It is shared with the
# jetcool Flutter app and any other game in the JetFoodData family, so v3 does
# NOT own a copy. Override with the RECIPES_V3_COMBOO_DB env var.
_DEFAULT_COMBOO_DB = Path(
    "/Users/macminidata/vscode/jetfooddata/jetcool/assets/comboo.db"
)
COMBOO_DB: Path = Path(
    os.environ.get("RECIPES_V3_COMBOO_DB", str(_DEFAULT_COMBOO_DB))
)

# ── Bundle output (the one place v3 writes outside its own tree) ─────────────
# `generate_bundle.py` writes the SvelteKit bundle here.
BUNDLE_OUTPUT: Path = Path(
    os.environ.get(
        "RECIPES_V3_BUNDLE_OUTPUT",
        str(REPO_ROOT / "src" / "lib" / "farmers-basket" / "generated-levels.ts"),
    )
)


def assert_inputs_exist() -> None:
    """Raise FileNotFoundError early if a required input is missing."""
    missing = [
        p for p in (
            COMBOO_DB,
            RECIPES_CSV,
            INGREDIENTS_LEDGER_CSV,
            RECIPE_INGREDIENTS_CSV,
            RECIPE_INSTRUCTIONS_CSV,
        )
        if not p.exists()
    ]
    if missing:
        raise FileNotFoundError(
            "Missing v3 inputs:\n  "
            + "\n  ".join(str(p) for p in missing)
            + "\n\nIf comboo.db lives elsewhere, set RECIPES_V3_COMBOO_DB."
        )
