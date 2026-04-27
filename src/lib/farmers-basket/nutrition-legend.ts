export type NutritionLegendKey = 'usda' | 'usda-plus' | 'calc' | 'calc-plus' | 'shared';

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
    title: 'USDA exact dish data',
    description: 'Direct USDA dish-level data for this recipe. The per-serving nutrients come from a matching SR Legacy dish entry.'
  },
  {
    key: 'usda-plus',
    label: 'USDA+',
    title: 'USDA dish data with calculated fill-ins',
    description: 'USDA dish-level data form SR Legacy is used first, then missing values such as sugar or fiber are filled from the recipe ingredients in SR Legacy.'
  },
  {
    key: 'calc',
    label: 'Calc',
    title: 'Calculated from recipe ingredients',
    description: 'The app calculates nutrients from the recipe ingredients in SR Legacy because the closest USDA commercial dish is too different from the homemade version.'
  },
  {
    key: 'calc-plus',
    label: 'Recipe',
    title: 'Recipe-based estimate',
    description: 'The app calculates nutrients directly from the recipe ingredients in SR Legacy because there is no matching USDA dish entry for this recipe.'
  },
  {
    key: 'shared',
    label: 'Shared',
    title: 'Shared recipe',
    description: 'This recipe was submitted by a player rather than shipped as a built-in recipe. An attempted is made by both the player and moderator to link ingredients to SR Legacy'
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

  return items;
}