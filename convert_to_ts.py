#!/usr/bin/env python3
"""Convert food-portions-complete.csv to TypeScript data file"""
import csv
import json

INPUT_CSV = "/Volumes/training/Daily Food Chain/daily-food-chain/food-portions-complete.csv"
OUTPUT_TS = "/Volumes/training/Daily Food Chain/daily-food-chain/src/lib/data/food-portions.ts"

# Nutrient columns per 100g
NUTRIENT_COLS = ['cal_100g', 'pro_100g', 'fat_100g', 'carb_100g', 'fib_100g', 'h2o_100g', 'sug_100g']

# Valid food groups (lowercase)
VALID_GROUPS = {'vegetable', 'fruit', 'grain', 'protein', 'dairy', 'legume', 'nuts', 'fats', 'spice', 'prepared', 'beverage'}

def normalize_group(g: str) -> str | None:
    """Normalize group name to valid FoodGroup or None if invalid."""
    g_lower = g.lower().strip()
    if g_lower in VALID_GROUPS:
        return g_lower
    return None  # Skip invalid group values (notes, descriptions, etc.)

def main():
    foods = []
    
    with open(INPUT_CSV, 'r', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        
        for row in reader:
            # Collect and normalize groups (non-empty group1-4, skip invalid)
            raw_groups = [row[f'group{i}'] for i in range(1, 5) if row.get(f'group{i}')]
            groups = [normalize_group(g) for g in raw_groups]
            groups = [g for g in groups if g]  # Remove None values
            
            # Extract nutrients per 100g
            nutrients = {}
            for col in NUTRIENT_COLS:
                val = row.get(col, '')
                try:
                    nutrients[col] = float(val) if val else 0
                except ValueError:
                    nutrients[col] = 0
            
            # Collect portions M0-M12 (amt, desc, and gm)
            portions = []
            for n in range(0, 13):
                desc = row.get(f'M{n}_Desc', '').strip()
                if desc:
                    amt = row.get(f'M{n}_Amt', '')
                    gm = row.get(f'M{n}_Gm', '')
                    try:
                        portions.append({
                            'amt': float(amt) if amt else 1.0,
                            'desc': desc,
                            'gm': float(gm) if gm else 0,
                        })
                    except ValueError:
                        pass
            
            food = {
                'word': row['word'],
                'display': row.get('display', row['word'].capitalize()),
                'groups': groups,
                'ndb': row.get('NDB_NO', ''),
                'desc': row.get('usda_desc', ''),  # USDA LONG_DESC
                # Nutrients per 100g
                'cal': nutrients['cal_100g'],
                'pro': nutrients['pro_100g'],
                'fat': nutrients['fat_100g'],
                'carb': nutrients['carb_100g'],
                'fib': nutrients['fib_100g'],
                'h2o': nutrients['h2o_100g'],
                'sug': nutrients['sug_100g'],
                'portions': portions
            }
            foods.append(food)
    
    # Generate TypeScript
    ts_content = '''// Auto-generated from food-portions-complete.csv
// DO NOT EDIT - regenerate with convert_to_ts.py

export type FoodGroup = 
  | 'vegetable' | 'fruit' | 'grain' | 'protein' | 'dairy'
  | 'legume' | 'nuts' | 'fats' | 'spice' | 'prepared' | 'beverage';

export interface Portion {
  amt: number;      // Amount (e.g., 1, 0.5, 2)
  desc: string;     // Description (e.g., "cup, sliced" or "custom (g)")
  gm: number;       // Weight in grams
}

export interface Food {
  word: string;
  display: string;  // Readable name (e.g., "Chicken Wing")
  groups: FoodGroup[];
  ndb: string;       // USDA NDB number (primary key)
  desc: string;      // USDA LONG_DESC
  // Nutrients per 100g
  cal: number;      // Calories (Energy_KCal)
  pro: number;      // Protein (g)
  fat: number;      // Total Fat (g)
  carb: number;     // Carbohydrates (g)
  fib: number;      // Fiber (g)
  h2o: number;      // Water (g)
  sug: number;      // Total Sugar (g)
  portions: Portion[];  // [0] is always custom (100g base)
}

export interface NutrientValues {
  grams: number;
  calories: number;
  protein: number;
  fat: number;
  carbs: number;
  fiber: number;
  water: number;
  sugar: number;
}

export const FOODS: Food[] = ''' + json.dumps(foods, indent=2) + ''';

// Calculate nutrients for a given portion and multiplier
export function calculateNutrients(food: Food, portionIndex: number, multiplier: number = 1): NutrientValues {
  const portion = food.portions[portionIndex] || food.portions[0];
  const grams = portion.gm * multiplier;
  const ratio = grams / 100;
  
  return {
    grams: Math.round(grams),
    calories: Math.round(food.cal * ratio),
    protein: Math.round(food.pro * ratio * 10) / 10,
    fat: Math.round(food.fat * ratio * 10) / 10,
    carbs: Math.round(food.carb * ratio * 10) / 10,
    fiber: Math.round(food.fib * ratio * 10) / 10,
    water: Math.round(food.h2o * ratio * 10) / 10,
    sugar: Math.round(food.sug * ratio * 10) / 10,
  };
}

// Calculate nutrients for custom gram amount
export function calculateNutrientsForGrams(food: Food, grams: number): NutrientValues {
  const ratio = grams / 100;
  
  return {
    grams: Math.round(grams),
    calories: Math.round(food.cal * ratio),
    protein: Math.round(food.pro * ratio * 10) / 10,
    fat: Math.round(food.fat * ratio * 10) / 10,
    carbs: Math.round(food.carb * ratio * 10) / 10,
    fiber: Math.round(food.fib * ratio * 10) / 10,
    water: Math.round(food.h2o * ratio * 10) / 10,
    sugar: Math.round(food.sug * ratio * 10) / 10,
  };
}

// Group colors
export const GROUP_COLORS: Record<FoodGroup, string> = {
  vegetable: '#22c55e',
  fruit: '#ef4444',
  grain: '#a16207',
  protein: '#a855f7',
  dairy: '#fef3c7',
  legume: '#f97316',
  nuts: '#92400e',
  fats: '#fcd34d',
  spice: '#14b8a6',
  prepared: '#6b7280',
  beverage: '#3b82f6'
};

// Group display names
export const GROUP_NAMES: Record<FoodGroup, string> = {
  vegetable: 'Vegetables',
  fruit: 'Fruits',
  grain: 'Grains',
  protein: 'Protein',
  dairy: 'Dairy',
  legume: 'Legumes',
  nuts: 'Nuts & Seeds',
  fats: 'Fats & Oils',
  spice: 'Herbs & Spices',
  prepared: 'Prepared Foods',
  beverage: 'Beverages'
};
'''
    
    with open(OUTPUT_TS, 'w', encoding='utf-8') as f:
        f.write(ts_content)
    
    print(f"Generated {OUTPUT_TS}")
    print(f"  {len(foods)} foods with nutrients per 100g + portions")

if __name__ == "__main__":
    main()
