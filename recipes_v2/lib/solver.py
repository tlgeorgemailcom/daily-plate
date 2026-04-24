"""Ingredient-gram solver.

Given the canonical per-100g target and a fixed ingredient set with
[grams_min, grams_max] bounds per ingredient, solve for ingredient grams
that minimize weighted squared error vs. canonical macros, accounting for
the recipe's cooking yield model.

Requires scipy. Install with:
    pip3 install --break-system-packages scipy
"""
from __future__ import annotations

from typing import Optional

from .build import build_recipe
from .data import MACRO_KEYS, LedgerEntry, RecipeIngredient, RecipeMeta

# Default macro weights for the objective. Sodium can be missing; weight 0
# avoids dragging the fit when sodium data is unreliable. Calories are
# weighted high because they are the most user-visible target.
DEFAULT_WEIGHTS = {
    "cal": 3.0,
    "pro": 2.0,
    "fat": 2.0,
    "carb": 2.0,
    "fib": 1.0,
    "h2o": 1.0,
    "sug": 2.0,
    "sodium": 0.0,
}


def solve_grams(
    meta: RecipeMeta,
    ingredients: list[RecipeIngredient],
    ledger: dict[str, LedgerEntry],
    canonical_per100g: dict,
    weights: Optional[dict] = None,
    max_iter: int = 200,
) -> tuple[list[RecipeIngredient], dict]:
    """Return (optimized_ingredients, diagnostics)."""
    try:
        import numpy as np
        from scipy.optimize import minimize
    except ImportError as e:
        raise RuntimeError(
            "solver requires numpy + scipy. "
            "Install: pip3 install --break-system-packages numpy scipy"
        ) from e

    w = {k: (weights or DEFAULT_WEIGHTS).get(k, 0.0) for k in MACRO_KEYS}
    targets = np.array([canonical_per100g.get(k, 0.0) for k in MACRO_KEYS])
    weight_vec = np.array([w[k] for k in MACRO_KEYS])

    initial = np.array([ri.grams for ri in ingredients], dtype=float)
    bounds = [
        (
            ri.grams_min if ri.grams_min > 0 else max(ri.grams * 0.5, 1.0),
            ri.grams_max if ri.grams_max > 0 else ri.grams * 2.0,
        )
        for ri in ingredients
    ]

    def objective(x: "np.ndarray") -> float:
        # Build a candidate ingredient list with the trial grams
        trial = []
        for ri, g in zip(ingredients, x):
            trial.append(RecipeIngredient(
                recipe_id=ri.recipe_id, row_order=ri.row_order,
                ingredient_key=ri.ingredient_key, qty_display=ri.qty_display,
                grams=float(g), grams_min=ri.grams_min, grams_max=ri.grams_max,
                section=ri.section, is_optional=ri.is_optional,
                display_name_override=ri.display_name_override,
            ))
        result = build_recipe(meta, trial, ledger)
        built = np.array([result.per100g_cooked.get(k, 0.0) for k in MACRO_KEYS])
        # Normalized squared error per nutrient, weighted
        denom = np.where(targets != 0, np.abs(targets), 1.0)
        err = ((built - targets) / denom) ** 2
        return float(np.sum(weight_vec * err))

    res = minimize(
        objective,
        initial,
        method="L-BFGS-B",
        bounds=bounds,
        options={"maxiter": max_iter, "ftol": 1e-9},
    )

    optimized = []
    for ri, g in zip(ingredients, res.x):
        optimized.append(RecipeIngredient(
            recipe_id=ri.recipe_id, row_order=ri.row_order,
            ingredient_key=ri.ingredient_key, qty_display=ri.qty_display,
            grams=round(float(g), 2),
            grams_min=ri.grams_min, grams_max=ri.grams_max,
            section=ri.section, is_optional=ri.is_optional,
            display_name_override=ri.display_name_override,
        ))

    diagnostics = {
        "initial_objective": float(objective(initial)),
        "final_objective": float(res.fun),
        "iterations": int(res.nit),
        "converged": bool(res.success),
        "message": str(res.message),
        "weights": w,
    }
    return optimized, diagnostics
