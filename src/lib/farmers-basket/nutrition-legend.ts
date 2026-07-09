export type NutritionLegendKey = 'usda' | 'usda-plus' | 'calc' | 'calc-plus' | 'shared' | 'pending-review';

export interface NutritionLegendItem {
  key: NutritionLegendKey;
  label: string;
  title: string;
  description: string;
}

export const NUTRITION_LEGEND_ITEMS: NutritionLegendItem[] = [
  {
    key: 'usda',
    label: 'USDA',
    title: 'Matches USDA — full agreement',
    description: 'Nutrients are calculated from the recipe ingredients, and the result agrees with USDA SR Legacy\u2019s matching dish entry within ±5% on every macro (calories, protein, fat, carbs, fiber, sugar, water).'
  },
  {
    key: 'usda-plus',
    label: 'USDA+',
    title: 'Matches USDA — fills gaps in USDA',
    description: 'A matching USDA SR Legacy dish exists but is missing some values (commonly fiber or sugar are listed as zero). The recipe-ingredient calculation supplies those missing values; everything USDA does report agrees within ±5%.'
  },
  {
    key: 'calc',
    label: 'Calc',
    title: 'Recipe calculation differs from USDA',
    description: 'A USDA SR Legacy dish with the same name exists, but it is a commercial-composite entry that differs from a from-scratch home version by more than ±5% on at least one macro. The displayed nutrients come from the recipe-ingredient calculation, which better reflects this homemade version.'
  },
  {
    key: 'calc-plus',
    label: 'Scratch',
    title: 'Recipe calculation only',
    description: 'No USDA SR Legacy dish entry matches this recipe by name. Nutrients are calculated entirely from the recipe ingredients in SR Legacy.'
  },
  {
    key: 'shared',
    label: 'Shared',
    title: 'Shared recipe',
    description: 'This recipe was submitted by a player rather than shipped as a built-in. Both the player and a moderator link each ingredient to SR Legacy so the nutrient calculation uses real USDA composition data.'
  },
  {
    key: 'pending-review',
    label: 'Est.',
    title: 'Nutrition estimated — pending curator review',
    description: 'Nutrition was calculated from the recipe ingredients using SR Legacy data. One or more plausibility checks flagged this recipe for curator review. Values are a reasonable estimate but may be refined after review.'
  }
];

const SR28_RULE_TO_KEY: Record<string, NutritionLegendKey> = {
  'Rule A': 'usda',
  'Rule B': 'usda-plus',
  'Rule C': 'calc',
  'Rule D': 'calc-plus'
};

const LEGEND_BY_KEY = new Map(NUTRITION_LEGEND_ITEMS.map((item) => [item.key, item]));

export function getNutritionLegendKey(sr28Rule?: string | null): NutritionLegendKey | null {
  if (!sr28Rule) return null;
  return SR28_RULE_TO_KEY[sr28Rule] ?? null;
}

export function getNutritionLegendItem(key: NutritionLegendKey): NutritionLegendItem {
  return LEGEND_BY_KEY.get(key) ?? NUTRITION_LEGEND_ITEMS[0];
}

export function getRecipeLegendItems(recipe: {
  sr28Rule?: string | null;
  isCommunityRecipe?: boolean | null;
  plausibilityFlags?: string[] | null;
} | null | undefined): NutritionLegendItem[] {
  if (!recipe) return [];

  const items: NutritionLegendItem[] = [];
  const nutritionKey = getNutritionLegendKey(recipe.sr28Rule);

  if (nutritionKey) {
    items.push(getNutritionLegendItem(nutritionKey));
  }

  if (recipe.isCommunityRecipe) {
    items.push(getNutritionLegendItem('shared'));
  }

  if (recipe.plausibilityFlags && recipe.plausibilityFlags.length > 0) {
    items.push(getNutritionLegendItem('pending-review'));
  }

  return items;
}