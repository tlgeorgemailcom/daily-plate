"""Game-design rules for the SvelteKit bundle.

This module owns the *rules* (mappings + algorithms) that translate a recipe's
food list and category into board-game metadata: tools, animal spawns, food
supply. It is the v3 home for what used to be Python literals at the top of
the project-root `generate_levels.py`.

Per-recipe data (which foods belong to which recipe) lives in
`recipes_v3/data/game_design.csv` — load it with `load_recipe_foods()`.
"""
from __future__ import annotations

import csv

from config import GAME_DESIGN_CSV

ALL_FOODS: tuple[str, ...] = (
    "lettuce", "tomato", "carrot", "cheese", "egg", "bread",
    "apple", "grapes", "bacon", "butter", "chicken", "fish",
)

FOOD_ANIMAL: dict[str, str] = {
    "lettuce": "rabbit", "carrot": "rabbit",
    "cheese":  "mouse",  "bread":  "mouse",
    "grapes":  "bird",   "fish":   "bird",
    "egg":     "fox",    "bacon":  "fox", "chicken": "fox",
    "apple":   "squirrel",
    "tomato":  "raccoon", "butter": "raccoon",
}

# Difficulty 1=easiest, 4=hardest. Keyed on `recipes.csv::category`.
CATEGORY_DIFFICULTY: dict[str, int] = {
    "Beverages":         1,
    "Breakfast":         2,
    "Salads":            2,
    "Sides":             2,
    "Snacks":            3,
    "Lunch":             3,
    "Sweets & Desserts": 3,
    "Dinner":            4,
    "Japan":             3,
}


def load_recipe_foods() -> dict[str, list[str]]:
    """Return {recipe_id: [food, ...]} from data/game_design.csv."""
    out: dict[str, list[str]] = {}
    with open(GAME_DESIGN_CSV, newline="", encoding="utf-8") as f:
        for row in csv.DictReader(f):
            foods = [s for s in (row["foods"] or "").split("|") if s]
            out[row["recipe_id"]] = foods
    return out


def get_tools(difficulty: int) -> list[dict]:
    wall = min(3 + difficulty, 7)
    fence = 2 if difficulty >= 2 else 1
    tools = [
        {"type": "wall",  "count": wall,  "emoji": "🧱"},
        {"type": "fence", "count": fence, "emoji": "🚧"},
    ]
    if difficulty >= 3:
        tools.append({"type": "scarecrow", "count": 1, "emoji": "🧹"})
    if difficulty >= 4:
        tools.append({"type": "cat", "count": 1, "emoji": "🐱"})
    return tools


def get_animal_spawns(foods: list[str], difficulty: int) -> list[dict]:
    seen: set[str] = set()
    spawns: list[dict] = []
    base_delay = max(8000 - difficulty * 1500, 2500)
    for food in foods:
        animal = FOOD_ANIMAL.get(food)
        if animal and animal not in seen:
            seen.add(animal)
            spawns.append({"type": animal, "delay": base_delay})
            base_delay += 1500
    if difficulty >= 4 and "raccoon" not in seen and len(spawns) < 4:
        spawns.append({"type": "raccoon", "delay": base_delay + 1000})
    return spawns


def get_food_supply(foods: list[str], difficulty: int) -> dict[str, int]:
    supply = {f: 0 for f in ALL_FOODS}
    base = 2 + difficulty
    for i, food in enumerate(foods):
        supply[food] = max(2, base - i)
    return supply
