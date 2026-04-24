"""Recipe fingerprint: sha256 over canonical-form representation.

A change to canonical NDB, ingredient ledger references, gram weights, cook
method, yield factors, or instruction text changes the fingerprint.
Display-only fields (qty_display, display_name_override) do NOT change it.
"""
from __future__ import annotations

import hashlib
import json
import re

from .data import RecipeIngredient, RecipeMeta

_WHITESPACE_RE = re.compile(r"\s+")


def _normalize_text(s: str) -> str:
    return _WHITESPACE_RE.sub(" ", (s or "").strip())


def canonical_payload(
    meta: RecipeMeta,
    ingredients: list[RecipeIngredient],
    instructions: list[str],
) -> dict:
    """The exact data the fingerprint hashes. Stable, sorted, normalized."""
    sorted_ings = sorted(
        [
            {
                "ingredient_key": ri.ingredient_key,
                "grams": round(ri.grams, 2),
                "is_optional": ri.is_optional,
            }
            for ri in ingredients
        ],
        key=lambda r: (r["ingredient_key"], r["grams"]),
    )
    return {
        "recipe_id": meta.recipe_id,
        "canonical_ndb_no": meta.canonical_ndb_no,
        "cook_method": meta.cook_method,
        "yield_factor_water": round(meta.yield_factor_water, 4),
        "yield_factor_fat": round(meta.yield_factor_fat, 4),
        "yield_factor_other": round(meta.yield_factor_other, 4),
        "ingredients": sorted_ings,
        "instructions": [_normalize_text(s) for s in instructions],
    }


def compute_fingerprint(
    meta: RecipeMeta,
    ingredients: list[RecipeIngredient],
    instructions: list[str],
) -> str:
    payload = canonical_payload(meta, ingredients, instructions)
    blob = json.dumps(payload, sort_keys=True, separators=(",", ":")).encode("utf-8")
    return hashlib.sha256(blob).hexdigest()


def verify_fingerprint(
    meta: RecipeMeta,
    ingredients: list[RecipeIngredient],
    instructions: list[str],
) -> tuple[bool, str]:
    """Return (matches, current_fingerprint)."""
    current = compute_fingerprint(meta, ingredients, instructions)
    if not meta.fingerprint:
        return False, current
    return meta.fingerprint == current, current
