export const RECIPE_CATEGORY_OPTIONS = [
  { id: 'breakfast', label: 'Breakfast' },
  { id: 'soups-stews', label: 'Soups & Stews' },
  { id: 'sandwiches-burgers', label: 'Sandwiches & Burgers' },
  { id: 'salads', label: 'Salads' },
  { id: 'pasta-pizza', label: 'Pasta & Pizza' },
  { id: 'entrees-main-courses', label: 'Entrees & Main Courses' },
  { id: 'sides', label: 'Sides' },
  { id: 'sweets-desserts', label: 'Sweets & Desserts' },
  { id: 'beverages', label: 'Beverages' },
  { id: 'sauces-condiments', label: 'Sauces & Condiments' }
] as const;

export type RecipeCategoryId = typeof RECIPE_CATEGORY_OPTIONS[number]['id'];

const DEFAULT_RECIPE_CATEGORY: RecipeCategoryId = 'entrees-main-courses';

const CATEGORY_LABEL_BY_ID: Record<RecipeCategoryId, string> = Object.fromEntries(
  RECIPE_CATEGORY_OPTIONS.map((option) => [option.id, option.label])
) as Record<RecipeCategoryId, string>;

const CATEGORY_ID_BY_INPUT = Object.fromEntries(
  [
    ...RECIPE_CATEGORY_OPTIONS.map((option) => [option.id, option.id]),
    ...RECIPE_CATEGORY_OPTIONS.map((option) => [option.label.toLowerCase(), option.id]),
    ['desserts', 'sweets-desserts'],
    ['sweets & desserts', 'sweets-desserts'],
    ['breakfast & brunch', 'breakfast'],
    ['breakfast-brunch', 'breakfast'],
    ['dinner', 'entrees-main-courses'],
    ['other', 'entrees-main-courses']
  ]
) as Record<string, RecipeCategoryId>;

export function toStoredRecipeCategory(category: string | null | undefined): RecipeCategoryId {
  const value = category?.trim().toLowerCase();
  if (!value) return DEFAULT_RECIPE_CATEGORY;
  return CATEGORY_ID_BY_INPUT[value] ?? DEFAULT_RECIPE_CATEGORY;
}

export function toDisplayRecipeCategory(category: string | null | undefined): string {
  return CATEGORY_LABEL_BY_ID[toStoredRecipeCategory(category)];
}