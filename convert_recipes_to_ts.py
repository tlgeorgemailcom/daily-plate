#!/usr/bin/env python3
"""Convert recipes CSV files to TypeScript data file.

Reads three source CSVs:
  recipes.csv             — one row per recipe (metadata)
  recipe_ingredients.csv  — one row per ingredient/dish-link
  recipe_instructions.csv — one row per preparation step

Outputs:
  src/lib/data/recipes.ts — nested Recipe[] export
"""
import csv
import json
from collections import defaultdict

BASE = "/Volumes/training/Daily Food Chain/daily-food-chain/src/lib/data"
RECIPES_CSV      = f"{BASE}/recipes.csv"
INGREDIENTS_CSV  = f"{BASE}/recipe_ingredients.csv"
INSTRUCTIONS_CSV = f"{BASE}/recipe_instructions.csv"
OUTPUT_TS        = f"{BASE}/recipes.ts"


def read_csv(path):
    with open(path, encoding='utf-8') as f:
        return list(csv.DictReader(f))


def parse_float(val):
    try:
        return float(val) if val.strip() else None
    except (ValueError, AttributeError):
        return None


def parse_int(val):
    try:
        return int(val) if val.strip() else None
    except (ValueError, AttributeError):
        return None


def main():
    recipes_rows      = read_csv(RECIPES_CSV)
    ingredients_rows  = read_csv(INGREDIENTS_CSV)
    instructions_rows = read_csv(INSTRUCTIONS_CSV)

    # Group ingredients and instructions by recipe_id
    ingredients_by_id  = defaultdict(list)
    instructions_by_id = defaultdict(list)

    for row in ingredients_rows:
        rid = row['recipe_id']
        ing = {
            'row_order':     parse_int(row.get('row_order', '')),
            'row_type':      row.get('row_type', '').strip(),
            'ing_name':      row.get('ing_name', '').strip(),
            'ing_qty':       row.get('ing_qty', '').strip(),
            'sr28_long_desc':row.get('sr28_long_desc', '').strip(),
            'ndb_no':        row.get('ndb_no', '').strip(),
            'portion_desc':  row.get('portion_desc', '').strip(),
            'portion_grams': parse_float(row.get('portion_grams', '')),
            'serving_count': parse_float(row.get('serving_count', '')),
            'notes':         row.get('notes', '').strip(),
            'game_food':     row.get('game_food', '').strip(),
            'animal':        row.get('animal', '').strip(),
        }
        # Drop None/empty to keep output tidy
        ing = {k: v for k, v in ing.items() if v not in (None, '')}
        ingredients_by_id[rid].append(ing)

    for row in instructions_rows:
        rid = row['recipe_id']
        step = {
            'step_order': parse_int(row.get('step_order', '')),
            'step_text':  row.get('step_text', '').strip(),
        }
        instructions_by_id[rid].append(step)

    # Build nested recipe objects
    recipes = []
    for row in recipes_rows:
        rid = row['recipe_id']
        recipe = {
            'recipe_id':        rid,
            'food_word':        row.get('food_word', '').strip(),
            'recipe_name':      row.get('recipe_name', '').strip(),
            'category':         row.get('category', '').strip(),
            'dietary_category': row.get('dietary_category', '').strip(),
            'link_type':        row.get('link_type', '').strip(),
            'prep_time':        row.get('prep_time', '').strip(),
            'servings':         row.get('servings', '').strip(),
            'sr28_rule':        row.get('sr28_rule', '').strip(),
            'sr28_notes':       row.get('sr28_notes', '').strip(),
            'status':           row.get('status', '').strip(),
            'ingredients':      sorted(ingredients_by_id[rid], key=lambda x: x.get('row_order', 999)),
            'instructions':     sorted(instructions_by_id[rid], key=lambda x: x.get('step_order', 999)),
        }
        # Drop empty optional strings
        recipe = {k: v for k, v in recipe.items() if v not in (None, '')}
        # Always keep ingredients and instructions (even if empty arrays)
        recipe.setdefault('ingredients', [])
        recipe.setdefault('instructions', [])
        recipes.append(recipe)

    # Stats
    total = len(recipes)
    has_ings = sum(1 for r in recipes if r['ingredients'])
    has_steps = sum(1 for r in recipes if r['instructions'])
    todo = sum(1 for r in recipes if r.get('status') == 'todo')
    done = sum(1 for r in recipes if r.get('status') == 'published')

    print(f"Recipes:      {total}")
    print(f"With ingredients:  {has_ings}")
    print(f"With instructions: {has_steps}")
    print(f"Status todo:       {todo}")
    print(f"Status published:  {done}")

    ts = f'''// Auto-generated from recipes.csv, recipe_ingredients.csv, recipe_instructions.csv
// DO NOT EDIT - regenerate with convert_recipes_to_ts.py

export type LinkType = 'ingredient' | 'dish' | 'mixed';
export type RowType  = 'dish' | 'ingredient' | 'dish_ingredient' | 'exempt';
export type RecipeStatus = 'todo' | 'draft' | 'review' | 'published';

export interface RecipeIngredient {{
  row_order?: number;
  row_type: RowType;
  ing_name?: string;   // optional — row_type='dish' reference rows have no ingredient name
  ing_qty?: string;
  sr28_long_desc?: string;
  ndb_no?: string;
  portion_desc?: string;
  portion_grams?: number;
  serving_count?: number;
  notes?: string;
  game_food?: string;
  animal?: string;
}}

export interface RecipeInstruction {{
  step_order: number;
  step_text: string;
}}

export interface Recipe {{
  recipe_id: string;
  food_word?: string;       // word key in food-portions-complete.csv (blank for ingredient-only recipes)
  recipe_name: string;
  category: string;
  dietary_category: string;
  link_type: LinkType;
  prep_time?: string;
  servings?: string;
  sr28_rule?: string;
  sr28_notes?: string;
  status: RecipeStatus;
  ingredients: RecipeIngredient[];
  instructions: RecipeInstruction[];
}}

export const RECIPES: Recipe[] = {json.dumps(recipes, indent=2)};

/** Look up a recipe by its food_word key */
export function getRecipeByWord(word: string): Recipe | undefined {{
  return RECIPES.find(r => r.food_word === word);
}}

/** All published recipes */
export function publishedRecipes(): Recipe[] {{
  return RECIPES.filter(r => r.status === 'published');
}}
'''

    with open(OUTPUT_TS, 'w', encoding='utf-8') as f:
        f.write(ts)

    print(f"\nWritten to {OUTPUT_TS}")


if __name__ == '__main__':
    main()
