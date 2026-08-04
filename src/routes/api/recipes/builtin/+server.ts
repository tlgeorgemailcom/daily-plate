import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { queryAll, getGameDb } from '$lib/server/turso';
import { toDisplayRecipeCategory, toStoredRecipeCategory } from '$lib/farmers-basket/recipe-categories';
import { deleteRecipeImage, extractPublicId } from '$lib/server/cloudinary';
import { calcNutritionSR28 } from '$lib/server/calcNutritionSR28';
import { buildRecipeCommunityV3, type CommunitySectionV3 } from '$lib/nutrition/buildRecipeCommunityV3';
import type { CommunityIngredient } from '$lib/nutrition/types';
import { fetchNutrientsByNdb } from '$lib/server/nutrition/fetchNutrients';
import {
  normalizeIngredientRemoval,
  normalizeRenderedFatAllocation,
  validateRawAllocationIngredients,
  validateRawAllocationSections,
} from '$lib/nutrition/allocation';
import type {
  AllocationAmount,
  AllocationUnit,
  AllocationValidationIssue,
  ReservedPoolAllocation,
} from '$lib/nutrition/allocation';
import type { DiscardType, Level } from '$lib/farmers-basket/types';

interface BuiltinRecipeRow {
  recipe_id: string;
  recipe_name: string;
  category: string;
  dietary_category: string | null;
  cooking_method: string | null;
  cook_minutes: number | null;
  cook_temp_f: number | null;
  cook2_method: string | null;
  cook2_minutes: number | null;
  cook2_temp_f: number | null;
  cook3_method: string | null;
  cook3_minutes: number | null;
  cook3_temp_f: number | null;
  fill_class: string | null;
  cook2_fill_class: string | null;
  cook3_fill_class: string | null;
  dish_family: string | null;
  prep_time: string | null;
  servings: string | null;
  recipe: string | null;
  animal_spawns: string | null;
  recipe_instructions_json: string | null;
  recipe_ingredients_json: string | null;
  sections_json: string | null;
  nutrition_json: string | null;
  image_url: string | null;
  created_at: string;
  submitted_by: string;
}

interface NutritionJson {
  perServing: {
    cal: number;
    pro: number;
    fat: number;
    carb: number;
    fib: number;
    h2o: number;
    sug: number;
  };
  gramsPerServing: number;
  servings: number;
}

interface BuiltinOverride {
  id: string;
  name?: string;
  category?: string;
  dietaryCategory?: string;
  cookingMethod?: string;
  cookMinutes?: number;
  cookTempF?: number;
  cook2Method?: string;
  cook2Minutes?: number;
  cook2TempF?: number;
  cook3Method?: string;
  cook3Minutes?: number;
  cook3TempF?: number;
  fillClass?: string;
  cook2FillClass?: string;
  cook3FillClass?: string;
  dishFamily?: string;
  prepTime?: string;
  servings?: string;
  recipe?: string[];
  animalSpawns?: { type: string; delay: number }[];
  recipeInstructions?: string[];
  recipeIngredients?: NutritionLinkIngredient[];
  sections?: Level['sections'];
  nutritionJson?: NutritionJson | null;
  imageUrl?: string;
  editedAt: string;
  editedBy: string;
}

interface NewBuiltinRecipe {
  id: string;
  name: string;
  category: string;
  dietaryCategory: string;
  cookingMethod?: string;
  cookMinutes?: number;
  cookTempF?: number;
  cook2Method?: string;
  cook2Minutes?: number;
  cook2TempF?: number;
  cook3Method?: string;
  cook3Minutes?: number;
  cook3TempF?: number;
  fillClass?: string;
  cook2FillClass?: string;
  cook3FillClass?: string;
  dishFamily?: string;
  prepTime?: string;
  servings?: string;
  recipe: string[];
  animalSpawns: { type: string; delay: number }[];
  recipeInstructions?: string[];
  recipeIngredients?: NutritionLinkIngredient[];
  sections?: Level['sections'];
  nutritionJson?: NutritionJson | null;
  imageUrl?: string;
  createdAt: string;
}

type NutritionLinkIngredient = {
  name?: string;
  quantity?: string;
  foodWord?: string;
  ndbNo?: string;
  portionDesc?: string;
  portionGrams?: number;
  servingCount?: number;
  section?: string;
  exempt?: boolean;
  isDish?: boolean;
  componentRef?: string;
  componentPer100g?: Record<string, number>;
  componentName?: string;
  componentServingGrams?: number;
  is_optional?: boolean;
  isOptional?: boolean;
  discarded?: boolean;
  discardPercent?: number;
  discardType?: DiscardType;
  removedAfterPrep?: boolean;
  removalAmount?: number;
  removalUnit?: AllocationUnit;
};

function toFoodWord(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .replace(/-{2,}/g, '-');
}

function parseServingMeta(servings: string | null | undefined): { servingsCount: number | null; servingLabel: string | null } {
  if (!servings || !servings.trim()) {
    return { servingsCount: null, servingLabel: null };
  }

  const raw = servings.trim();
  const match = raw.match(/^(\d+(?:\.\d+)?)\s*(.*)$/);
  if (!match) {
    return { servingsCount: null, servingLabel: raw };
  }

  const count = Number(match[1]);
  const label = match[2]?.trim() || 'serving';
  return {
    servingsCount: Number.isFinite(count) ? count : null,
    servingLabel: label
  };
}

function deriveLinkType(ingredients: NutritionLinkIngredient[]): 'ingredient' | 'dish' | 'mixed' {
  const hasDish = ingredients.some((ing) => ing.isDish === true);
  const hasIngredientLinks = ingredients.some(
    (ing) => ing.isDish !== true && !!(ing.foodWord || ing.ndbNo) && typeof ing.portionGrams === 'number'
  );
  if (hasDish && hasIngredientLinks) return 'mixed';
  if (hasDish) return 'dish';
  return 'ingredient';
}

async function computeBuiltinNutrition(
  recipeIngredients: NutritionLinkIngredient[] | undefined,
  servings: string | null | undefined,
  cookingMethod: string | null | undefined,
  yieldFactorWater?: number,
  yieldFactorFat?: number,
  sections?: Level['sections'],
): Promise<{ gramsPerServing: number; nutritionJson: string; allocationIssues?: AllocationValidationIssue[] }> {
  if (!recipeIngredients || recipeIngredients.length === 0) {
    return { gramsPerServing: 0, nutritionJson: '{}' };
  }

  const allocationAware = recipeIngredients.some((ingredient) => {
    const removal = normalizeIngredientRemoval(ingredient as unknown as Record<string, unknown>);
    return removal.removedAfterPrep;
  }) || (sections ?? []).some((section) =>
    (section.keepHerePercent ?? 100) < 100
    || !!section.outputPoolId
    || !!section.reservedPoolId
    || !!section.renderedFatAllocation
  );

  if (allocationAware) {
    const activeIngredients = recipeIngredients.filter((ingredient) =>
      !ingredient.exempt && !ingredient.isDish && (ingredient.portionGrams ?? 0) > 0
    );
    const unsupportedIngredient = activeIngredients.some((ingredient) =>
      !ingredient.ndbNo && !ingredient.componentPer100g
    );
    if (!unsupportedIngredient) {
      const ndbNos = activeIngredients
        .map((ingredient) => ingredient.ndbNo)
        .filter((ndbNo): ndbNo is string => typeof ndbNo === 'string' && ndbNo.length > 0);
      const nutrientMap = await fetchNutrientsByNdb(ndbNos);
      if (activeIngredients.every((ingredient) =>
        !!ingredient.componentPer100g || (!!ingredient.ndbNo && nutrientMap.has(ingredient.ndbNo))
      )) {
        const communityIngredients: CommunityIngredient[] = recipeIngredients.map((ingredient) => {
          const removal = normalizeIngredientRemoval(ingredient as unknown as Record<string, unknown>);
          return {
            ndbNo: ingredient.ndbNo ?? '',
            portionGrams: (ingredient.portionGrams ?? 0) * (ingredient.servingCount ?? 1),
            sectionKey: ingredient.section,
            isOptional: ingredient.isOptional === true || ingredient.is_optional === true,
            exempt: ingredient.exempt === true,
            displayName: ingredient.name,
            removedAfterPrep: removal.removedAfterPrep,
            removalAmount: removal.removalAmount,
            removalUnit: removal.removalUnit,
            discarded: ingredient.discarded === true,
            discardPercent: ingredient.discardPercent,
            ...(ingredient.componentPer100g ? { componentPer100g: ingredient.componentPer100g } : {}),
          };
        });
        const communitySections: CommunitySectionV3[] = (sections ?? []).map((section) => ({
          sectionKey: section.section_key ?? section.key,
          sectionLabel: section.label,
          cookMethod: section.cookingMethod,
          yieldFactorWater: section.yieldFactorWater,
          yieldFactorFat: section.yieldFactorFat,
          yieldFactorOther: section.yieldFactorOther,
          prepMethod: section.prepMethod,
          stages: section.stages,
          boilMinutes: section.boilMinutes,
          prepTempF: section.prepTempF,
          fillClass: section.fillClass,
          primaryEntryStage: section.primaryEntryStage,
          keepHerePercent: section.keepHerePercent,
          outputPoolId: section.outputPoolId,
          reservedPoolId: section.reservedPoolId,
          reservedPoolAmount: section.reservedPoolAmount,
          outputPoolAllocations: section.outputPoolAllocations,
          renderedFatAllocation: section.renderedFatAllocation,
        }));
        const servingsNum = Math.max(1, Number.parseInt(servings ?? '1', 10) || 1);
        const result = buildRecipeCommunityV3(
          communitySections,
          communityIngredients,
          nutrientMap,
          servingsNum,
          100,
          cookingMethod ?? undefined,
        );
        const gramsPerServing = result.totalCookedGrams / servingsNum;
        const scale = gramsPerServing / 100;
        const p100 = result.per100g;
        return {
          gramsPerServing,
          allocationIssues: result.allocationIssues,
          nutritionJson: JSON.stringify({
            perServing: {
              cal: (p100.energy_KCal ?? 0) * scale,
              pro: (p100.protein ?? 0) * scale,
              fat: (p100.totalLipidFat ?? 0) * scale,
              carb: (p100.carbohydrate ?? 0) * scale,
              fib: (p100.fiberTotalDietary ?? 0) * scale,
              h2o: (p100.water ?? 0) * scale,
              sug: (p100.sugarsTotal ?? 0) * scale,
            },
            per100g: {
              Energy_KCal: p100.energy_KCal ?? 0,
              Protein: p100.protein ?? 0,
              TotalLipidFat: p100.totalLipidFat ?? 0,
              Carbohydrate: p100.carbohydrate ?? 0,
              FiberTotalDietary: p100.fiberTotalDietary ?? 0,
              SugarsTotal: p100.sugarsTotal ?? 0,
              Water: p100.water ?? 0,
            },
            gramsPerServing,
            servings: servingsNum,
            allocationSections: result.sections.map((section) => ({
              sectionKey: section.sectionKey,
              cookedGrams: section.cookedGrams,
              renderedFatEstimateGrams: section.renderedFatEstimateGrams,
              renderedFatAllocation: section.renderedFatAllocation,
              reservedPoolGrams: section.reservedPoolGrams,
              consumedReservedPoolGrams: section.consumedReservedPoolGrams,
            })),
          }),
        };
      }
    }
  }

  const linkedRows = recipeIngredients.map((ing) => ({
    ndbNo: ing.ndbNo,
    foodWord: ing.foodWord,
    portionGrams: typeof ing.portionGrams === 'number' ? ing.portionGrams : undefined,
    servingCount: typeof ing.servingCount === 'number' ? ing.servingCount : undefined,
    exempt: ing.exempt === true,
    isDish: ing.isDish === true,
    discarded: ing.discarded === true,
    discardPercent: typeof ing.discardPercent === 'number' ? ing.discardPercent : undefined
  }));

  const linkType = deriveLinkType(recipeIngredients);
  const yieldOpts = {
    ...(typeof yieldFactorWater === 'number' ? { yieldFactorWater } : {}),
    ...(typeof yieldFactorFat   === 'number' ? { yieldFactorFat }   : {}),
  };
  const nutrition = await calcNutritionSR28(linkedRows, linkType, servings, cookingMethod, yieldOpts);

  if (!nutrition) {
    return { gramsPerServing: 0, nutritionJson: '{}' };
  }

  return {
    gramsPerServing: Number(nutrition.gramsPerServing) || 0,
    nutritionJson: JSON.stringify(nutrition)
  };
}

async function resolveBuiltinNutrition(
  explicitNutrition: unknown,
  recipeIngredients: NutritionLinkIngredient[] | undefined,
  servings: string | null | undefined,
  cookingMethod: string | null | undefined,
  yieldFactorWater?: number,
  yieldFactorFat?: number,
  sections?: Level['sections'],
): Promise<{ gramsPerServing: number; nutritionJson: string; allocationIssues?: AllocationValidationIssue[] }> {
  const allocationAware = (recipeIngredients ?? []).some((ingredient) =>
    normalizeIngredientRemoval(ingredient as unknown as Record<string, unknown>).removedAfterPrep
  ) || (sections ?? []).some((section) =>
    (section.keepHerePercent ?? 100) < 100
    || !!section.outputPoolId
    || !!section.reservedPoolId
    || !!section.renderedFatAllocation
  );
  if (allocationAware) {
    const computed = await computeBuiltinNutrition(
      recipeIngredients,
      servings,
      cookingMethod,
      yieldFactorWater,
      yieldFactorFat,
      sections,
    );
    if (computed.nutritionJson !== '{}') return computed;
  }
  if (explicitNutrition && typeof explicitNutrition === 'object') {
    const grams = Number((explicitNutrition as { gramsPerServing?: unknown }).gramsPerServing ?? 0);
    return {
      gramsPerServing: Number.isFinite(grams) && grams > 0 ? grams : 0,
      nutritionJson: JSON.stringify(explicitNutrition)
    };
  }
  return await computeBuiltinNutrition(recipeIngredients, servings, cookingMethod, yieldFactorWater, yieldFactorFat, sections);
}

function normalizeRecipeInstructions(value: string | null): string[] | undefined {
  if (!value) return undefined;
  const parsed = JSON.parse(value);
  if (!Array.isArray(parsed)) return undefined;

  return parsed
    .map((item) => {
      if (typeof item === 'string') return item;
      if (item && typeof item === 'object' && 'text' in item && typeof item.text === 'string') {
        return item.text;
      }
      return null;
    })
    .filter((item): item is string => Boolean(item && item.trim()));
}

function normalizeRecipeIngredients(value: string | null): BuiltinOverride['recipeIngredients'] {
  if (!value) return undefined;
  const parsed = JSON.parse(value);
  if (!Array.isArray(parsed)) return undefined;

  return parsed
    .map((item) => {
      if (!item || typeof item !== 'object') return null;

      const source = item as Record<string, unknown>;
      const name = typeof source.name === 'string'
        ? source.name
        : typeof source.ing_name === 'string'
          ? source.ing_name
          : '';

      if (!name && !source.row_type) return null;

      return {
        name,
        quantity: typeof source.quantity === 'string'
          ? source.quantity
          : typeof source.ing_qty === 'string'
            ? source.ing_qty
            : undefined,
        section: typeof source.section === 'string'
          ? source.section
          : typeof source.notes === 'string'
            ? source.notes.split(';').find((note) => note.startsWith('section='))?.slice('section='.length)
            : undefined,
        foodWord: typeof source.foodWord === 'string'
          ? source.foodWord
          : typeof source.game_food === 'string' && source.game_food.length > 0
            ? source.game_food
            : undefined,
        ndbNo: typeof source.ndbNo === 'string'
          ? source.ndbNo
          : typeof source.ndb_no === 'string'
            ? source.ndb_no
            : undefined,
        portionDesc: typeof source.portionDesc === 'string'
          ? source.portionDesc
          : typeof source.portion_desc === 'string'
            ? source.portion_desc
            : undefined,
        portionGrams: typeof source.portionGrams === 'number'
          ? source.portionGrams
          : typeof source.portion_grams === 'number'
            ? source.portion_grams
            : undefined,
        servingCount: typeof source.servingCount === 'number'
          ? source.servingCount
          : typeof source.serving_count === 'number'
            ? source.serving_count
            : undefined,
        exempt: typeof source.exempt === 'boolean'
          ? source.exempt
          : source.row_type === 'exempt',
        isDish: typeof source.isDish === 'boolean'
          ? source.isDish
          : source.row_type === 'dish',
        componentRef: typeof source.componentRef === 'string'
          ? source.componentRef
          : undefined,
        isOptional: typeof source.isOptional === 'boolean'
          ? source.isOptional
          : undefined,
        is_optional: typeof source.is_optional === 'boolean'
          ? source.is_optional
          : undefined,
        discarded: typeof source.discarded === 'boolean'
          ? source.discarded
          : undefined,
        discardPercent: typeof source.discardPercent === 'number'
          ? source.discardPercent
          : undefined,
        discardType: source.discardType === 'marinade' || source.discardType === 'rendered_fat' || source.discardType === 'other'
          ? source.discardType
          : undefined,
        ...(() => {
          const removal = normalizeIngredientRemoval(source);
          return {
            removedAfterPrep: removal.removedAfterPrep,
            removalAmount: removal.removalAmount,
            removalUnit: removal.removalUnit,
          };
        })()
      };
    })
    .filter((item): item is NonNullable<typeof item> => item !== null && Boolean(item.name || item.isDish)) as NonNullable<BuiltinOverride['recipeIngredients']>;
}

function normalizeAllocationAmountValue(value: unknown): AllocationAmount | undefined {
  if (!value || typeof value !== 'object') return undefined;
  const raw = value as Record<string, unknown>;
  const amount = Number(raw.value);
  if (!Number.isFinite(amount) || amount < 0) return undefined;
  return {
    value: amount,
    unit: raw.unit === 'grams' ? 'grams' : 'percent',
  };
}

function normalizePoolAllocations(value: unknown): ReservedPoolAllocation[] | undefined {
  if (!Array.isArray(value)) return undefined;
  const allocations = value.flatMap((item) => {
    if (!item || typeof item !== 'object') return [];
    const raw = item as Record<string, unknown>;
    if (raw.kind !== 'prepared_material' && raw.kind !== 'rendered_fat') return [];
    const grams = Number(raw.grams);
    return Number.isFinite(grams) && grams >= 0
      ? [{ kind: raw.kind, grams } as ReservedPoolAllocation]
      : [];
  });
  return allocations.length > 0 ? allocations : undefined;
}

function normalizeRecipeSections(value: string | null): Level['sections'] {
  if (!value) return undefined;
  const parsed = JSON.parse(value);
  if (!Array.isArray(parsed)) return undefined;

  return parsed
    .map((item) => {
      if (!item || typeof item !== 'object') return null;
      const source = item as Record<string, unknown>;
      const key = String(source.section_key ?? source.key ?? '');
      if (!key) return null;
      const prepMethod = String(source.prep_method ?? source.prepMethod ?? '');
      const isUnheated = !prepMethod || prepMethod === 'raw' || prepMethod === 'none';
      const rawKeepHere = source.keep_here_percent ?? source.keepHerePercent;
      const parsedKeepHere = rawKeepHere === undefined || rawKeepHere === null || rawKeepHere === ''
        ? 100
        : Number(rawKeepHere);
      const rawStages = Array.isArray(source.cook_stages)
        ? source.cook_stages
        : (Array.isArray(source.stages) ? source.stages : []);

      return {
        key,
        label: String(source.section_label ?? source.label ?? ''),
        cookingMethod: String(source.cook_method ?? source.cookingMethod ?? 'raw'),
        prepMethod,
        boilMinutes: isUnheated ? 0 : (typeof source.boil_minutes === 'number' ? source.boil_minutes : 0),
        stages: rawStages,
        fillClass: String(source.fill_class ?? source.fillClass ?? ''),
        primaryEntryStage: String(source.primary_entry_stage ?? source.primaryEntryStage ?? ''),
        keepHerePercent: Number.isFinite(parsedKeepHere) ? parsedKeepHere : 100,
        outputPoolId: typeof (source.output_pool_id ?? source.outputPoolId) === 'string'
          ? String(source.output_pool_id ?? source.outputPoolId)
          : undefined,
        reservedPoolId: typeof (source.reserved_pool_id ?? source.reservedPoolId) === 'string'
          ? String(source.reserved_pool_id ?? source.reservedPoolId)
          : undefined,
        reservedPoolAmount: normalizeAllocationAmountValue(
          source.reserved_pool_amount ?? source.reservedPoolAmount
        ),
        outputPoolAllocations: normalizePoolAllocations(
          source.output_pool_allocations ?? source.outputPoolAllocations
        ),
        renderedFatAllocation: normalizeRenderedFatAllocation(source),
        discardedFatPercent: typeof (source.discarded_fat_percent ?? source.discardedFatPercent) === 'number'
          ? Number(source.discarded_fat_percent ?? source.discardedFatPercent)
          : undefined,
        discardedMarinadePercent: typeof (source.discarded_marinade_percent ?? source.discardedMarinadePercent) === 'number'
          ? Number(source.discarded_marinade_percent ?? source.discardedMarinadePercent)
          : undefined,
      };
    })
    .filter((item): item is NonNullable<typeof item> => item !== null) as Level['sections'];
}

function validateBuiltinAllocationPayload(rawSections: unknown, rawIngredients?: unknown) {
  const issues = [
    ...validateRawAllocationSections(Array.isArray(rawSections) ? rawSections : []),
    ...validateRawAllocationIngredients(Array.isArray(rawIngredients) ? rawIngredients : []),
  ];
  return {
    errors: issues.filter((issue) => issue.severity === 'error'),
    warnings: issues.filter((issue) => issue.severity === 'warning'),
  };
}

// GET: Fetch all built-in recipe overrides and admin-added recipes from Turso
export const GET: RequestHandler = async () => {
  try {
    // Get published dev recipes that override existing local LEVELS rows.
    const overrideRows = await queryAll<BuiltinRecipeRow>(
            `SELECT recipe_id, recipe_name, category, dietary_category, cooking_method, cook_minutes, cook_temp_f,
              cook2_method, cook2_minutes, cook2_temp_f,
              cook3_method, cook3_minutes, cook3_temp_f,
              fill_class, cook2_fill_class, cook3_fill_class,
              dish_family, prep_time, servings,
              recipe, animal_spawns, recipe_instructions_json, recipe_ingredients_json,
              sections_json, nutrition_json, image_url, created_at, submitted_by
       FROM dev_recipes 
       WHERE status = 'published'
         AND recipe_id NOT LIKE 'admin-%'
         AND (recipe_ingredients_json IS NOT NULL OR recipe_instructions_json IS NOT NULL)`
    );

    // Get admin-added new dev recipes.
    const newRows = await queryAll<BuiltinRecipeRow>(
            `SELECT recipe_id, recipe_name, category, dietary_category, cooking_method, cook_minutes, cook_temp_f,
              cook2_method, cook2_minutes, cook2_temp_f,
              cook3_method, cook3_minutes, cook3_temp_f,
              fill_class, cook2_fill_class, cook3_fill_class,
              dish_family, prep_time, servings,
              recipe, animal_spawns, recipe_instructions_json, recipe_ingredients_json,
              sections_json, nutrition_json, image_url, created_at, submitted_by
       FROM dev_recipes 
       WHERE status = 'published' AND recipe_id LIKE 'admin-%'
       ORDER BY created_at ASC`
    );

    // Convert override rows to keyed format
    const overrides: Record<string, BuiltinOverride> = {};
    for (const row of overrideRows) {
      const override: BuiltinOverride = {
        id: row.recipe_id,
        editedAt: row.created_at,
        editedBy: row.submitted_by || 'System'
      };

      if (row.recipe_name) override.name = row.recipe_name;
      if (row.category) override.category = toDisplayRecipeCategory(row.category);
      if (row.dietary_category) override.dietaryCategory = row.dietary_category;
      override.cookingMethod = row.cooking_method ?? '';
      if (row.cook_minutes != null) override.cookMinutes = row.cook_minutes as number;
      if (row.cook_temp_f  != null) override.cookTempF   = row.cook_temp_f  as number;
      if (row.cook2_method) override.cook2Method = row.cook2_method;
      if (row.cook2_minutes != null) override.cook2Minutes = row.cook2_minutes as number;
      if (row.cook2_temp_f != null) override.cook2TempF = row.cook2_temp_f as number;
      if (row.cook3_method) override.cook3Method = row.cook3_method;
      if (row.cook3_minutes != null) override.cook3Minutes = row.cook3_minutes as number;
      if (row.cook3_temp_f != null) override.cook3TempF = row.cook3_temp_f as number;
      if (row.fill_class) override.fillClass = row.fill_class;
      if (row.cook2_fill_class) override.cook2FillClass = row.cook2_fill_class;
      if (row.cook3_fill_class) override.cook3FillClass = row.cook3_fill_class;
      if (row.dish_family) override.dishFamily = row.dish_family;
      if (row.prep_time) override.prepTime = row.prep_time;
      if (row.servings) override.servings = row.servings;
      if (row.recipe) override.recipe = JSON.parse(row.recipe);
      if (row.animal_spawns) override.animalSpawns = JSON.parse(row.animal_spawns);
      if (row.recipe_instructions_json) override.recipeInstructions = normalizeRecipeInstructions(row.recipe_instructions_json);
      if (row.recipe_ingredients_json) override.recipeIngredients = normalizeRecipeIngredients(row.recipe_ingredients_json);
      if (row.sections_json) override.sections = normalizeRecipeSections(row.sections_json);
      if (row.nutrition_json && row.nutrition_json !== '{}') override.nutritionJson = JSON.parse(row.nutrition_json);
      if (row.image_url) override.imageUrl = row.image_url;

      overrides[row.recipe_id] = override;
    }

    // Convert new recipe rows to array format
    const newBuiltins: NewBuiltinRecipe[] = newRows.map(row => ({
      id: row.recipe_id,
      name: row.recipe_name,
      category: toDisplayRecipeCategory(row.category || 'Other'),
      dietaryCategory: row.dietary_category || 'all',
      cookingMethod: row.cooking_method ?? undefined,
      cookMinutes: row.cook_minutes ?? undefined,
      cookTempF: row.cook_temp_f ?? undefined,
      cook2Method: row.cook2_method ?? undefined,
      cook2Minutes: row.cook2_minutes ?? undefined,
      cook2TempF: row.cook2_temp_f ?? undefined,
      cook3Method: row.cook3_method ?? undefined,
      cook3Minutes: row.cook3_minutes ?? undefined,
      cook3TempF: row.cook3_temp_f ?? undefined,
      fillClass: row.fill_class ?? undefined,
      cook2FillClass: row.cook2_fill_class ?? undefined,
      cook3FillClass: row.cook3_fill_class ?? undefined,
      dishFamily: row.dish_family ?? undefined,
      prepTime: row.prep_time ?? undefined,
      servings: row.servings ?? undefined,
      recipe: row.recipe ? JSON.parse(row.recipe) : [],
      animalSpawns: row.animal_spawns ? JSON.parse(row.animal_spawns) : [{ type: 'rabbit', delay: 3000 }],
      recipeInstructions: normalizeRecipeInstructions(row.recipe_instructions_json),
      recipeIngredients: normalizeRecipeIngredients(row.recipe_ingredients_json),
      sections: normalizeRecipeSections(row.sections_json),
      nutritionJson: row.nutrition_json && row.nutrition_json !== '{}' ? JSON.parse(row.nutrition_json) : undefined,
      imageUrl: row.image_url ?? undefined,
      createdAt: row.created_at
    }));

    return json({ overrides, newBuiltins }, {
      headers: { 'Cache-Control': 'no-store, max-age=0, must-revalidate' }
    });
  } catch (err) {
    console.error('Failed to load builtin overrides:', err);
    return json({ error: 'Failed to load overrides' }, { status: 500 });
  }
};

// PATCH: Save/update an override for a built-in recipe in Turso
export const PATCH: RequestHandler = async ({ request }) => {
  try {
    const body = await request.json();
    const { id, updates, editedBy } = body;

    if (!id) {
      return json({ error: 'Missing recipe id' }, { status: 400 });
    }

    if (!updates || typeof updates !== 'object') {
      return json({ error: 'Missing updates object' }, { status: 400 });
    }

    // Phase 6 (v3) gate: dev_recipes is now owned by the v3 pipeline
    // (recipes_v3/tools/upload.py). The PATCH path here recomputes
    // nutrition_json via calcNutritionSR28 (7 macros only) and would silently
    // strip v3's full ~60-nutrient panel. Block PATCHes for any row marked
    // locked=2 unless an explicit v3 token is supplied.
    // See docs/v3.md §14a / §14b.
    const db = getGameDb();
    const lockCheck = await db.execute({
      sql: 'SELECT locked FROM dev_recipes WHERE recipe_id = ?',
      args: [id]
    });
    const lockedVal = lockCheck.rows[0]?.locked;
    const isLocked2 = lockedVal === 2 || lockedVal === '2';
    const v3Token = (updates as Record<string, unknown>)._v3_uploader_token;
    const expectedToken = process.env.V3_UPLOADER_TOKEN;
    if (isLocked2 && (!expectedToken || v3Token !== expectedToken)) {
      return json({
        error: 'Recipe is v3-managed (locked=2). Edit recipes_v3/data/*.csv and run tools/upload.py.',
        code: 'V3_LOCKED'
      }, { status: 423 });
    }
    const now = new Date().toISOString();
    const hasImageUrlUpdate = Object.prototype.hasOwnProperty.call(updates, 'imageUrl');
    const shouldClearImage = hasImageUrlUpdate && (updates.imageUrl === null || updates.imageUrl === '');
    const nextImageUrl = hasImageUrlUpdate && typeof updates.imageUrl === 'string' && updates.imageUrl.trim().length > 0
      ? updates.imageUrl.trim()
      : null;
    const hasSectionsUpdate = Object.prototype.hasOwnProperty.call(updates, 'sections');
    if (hasSectionsUpdate && !Array.isArray(updates.sections)) {
      return json({ error: 'Sections must be an array', code: 'INVALID_SECTIONS' }, { status: 400 });
    }
    const allocation = validateBuiltinAllocationPayload(updates.sections, updates.ingredients);
    if (allocation.errors.length > 0) {
      return json({ error: 'Invalid allocation metadata', allocationIssues: allocation.errors }, { status: 400 });
    }
    for (const issue of allocation.warnings) {
      console.warn('[ALLOCATIONS]', issue.message, issue.poolId ?? issue.sectionKey ?? '');
    }
    const sectionsJson = hasSectionsUpdate ? JSON.stringify(updates.sections) : null;
    const nextName = typeof updates.name === 'string' && updates.name.trim().length > 0
      ? updates.name.trim()
      : null;
    const nextFoodWord = nextName ? toFoodWord(nextName) : null;
    const servingMeta = parseServingMeta((updates.servings as string | null | undefined) ?? null);
    const recipeIngredientsForNutrition = updates.recipeIngredients as NutritionLinkIngredient[] | undefined;
    const updateYieldWater = typeof updates.yieldFactorWater === 'number' ? updates.yieldFactorWater as number : undefined;
    const updateYieldFat   = typeof updates.yieldFactorFat   === 'number' ? updates.yieldFactorFat   as number : undefined;
    const computedNutrition = await resolveBuiltinNutrition(
      updates.nutritionJson,
      recipeIngredientsForNutrition,
      (updates.servings as string | null | undefined) ?? null,
      (updates.cookingMethod as string | null | undefined) ?? null,
      updateYieldWater,
      updateYieldFat,
      updates.sections as Level['sections'] | undefined,
    );
    if (computedNutrition.allocationIssues && computedNutrition.allocationIssues.length > 0) {
      return json({ error: 'Invalid allocation metadata', allocationIssues: computedNutrition.allocationIssues }, { status: 400 });
    }

    // Check if dev recipe exists
    const existing = await db.execute({
      sql: 'SELECT recipe_id, image_url FROM dev_recipes WHERE recipe_id = ?',
      args: [id]
    });

    if (existing.rows.length === 0) {
      // Create new dev recipe row.
      await db.execute({
        sql: `INSERT INTO dev_recipes (
              recipe_id, food_word, recipe_name, category, dietary_category, cooking_method, dish_family, prep_time, servings,
              servings_count, serving_label,
              recipe, animal_spawns, recipe_instructions_json, recipe_ingredients_json, sections_json,
              image_url, submitted_by, status, created_at, updated_at,
              grams_per_serving, nutrition_json, nutrient_version, retention_model_version, source_match_version
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'published', ?, ?, ?, ?, ?, ?, ?, ?)`,
        args: [
          id,
          nextFoodWord || id,
          nextName,
          (updates.category ? toStoredRecipeCategory(updates.category) : null),
          updates.dietaryCategory || null,
          updates.cookingMethod || null,
          updates.dishFamily || null,
          updates.prepTime || null,
          updates.servings || null,
          servingMeta.servingsCount,
          servingMeta.servingLabel,
          updates.recipe ? JSON.stringify(updates.recipe) : null,
          updates.animalSpawns ? JSON.stringify(updates.animalSpawns) : null,
          updates.recipeInstructions ? JSON.stringify(updates.recipeInstructions) : null,
          updates.recipeIngredients ? JSON.stringify(updates.recipeIngredients) : null,
          sectionsJson,
          updates.imageUrl || null,
          editedBy || 'Moderator',
          now,
          now,
          computedNutrition.gramsPerServing,
          computedNutrition.nutritionJson,
          'legacy',
          'legacy',
          'legacy'
        ]
      });
    } else {
      if (shouldClearImage) {
        const currentImageUrl = existing.rows[0].image_url as string | null;
        if (currentImageUrl) {
          const oldPublicId = extractPublicId(currentImageUrl);
          if (oldPublicId) {
            try {
              await deleteRecipeImage(oldPublicId);
            } catch (err) {
              console.warn('Failed to delete old builtin recipe image:', oldPublicId, err);
            }
          }
        }
      }

      // Update existing dev recipe row.
      await db.execute({
        sql: `UPDATE dev_recipes SET
              recipe_name = COALESCE(?, recipe_name),
            food_word = COALESCE(?, food_word),
              category = COALESCE(?, category),
              dietary_category = COALESCE(?, dietary_category),
              cooking_method = COALESCE(?, cooking_method),
              dish_family = COALESCE(?, dish_family),
              prep_time = COALESCE(?, prep_time),
              servings = COALESCE(?, servings),
            servings_count = CASE WHEN ? IS NOT NULL THEN ? ELSE servings_count END,
            serving_label = COALESCE(?, serving_label),
              recipe = COALESCE(?, recipe),
              animal_spawns = COALESCE(?, animal_spawns),
              recipe_instructions_json = COALESCE(?, recipe_instructions_json),
              recipe_ingredients_json = COALESCE(?, recipe_ingredients_json),
              sections_json = CASE WHEN ? = 1 THEN ? ELSE sections_json END,
              grams_per_serving = CASE WHEN ? > 0 THEN ? ELSE grams_per_serving END,
              nutrition_json = CASE WHEN ? != '{}' THEN ? ELSE nutrition_json END,
              image_url = CASE
                WHEN ? = 1 THEN NULL
                WHEN ? IS NOT NULL THEN ?
                ELSE image_url
              END,
              updated_at = ?,
              submitted_by = COALESCE(?, submitted_by)
              WHERE recipe_id = ?`,
        args: [
          nextName,
          nextFoodWord,
          (updates.category ? toStoredRecipeCategory(updates.category) : null),
          updates.dietaryCategory || null,
          updates.cookingMethod || null,
          updates.dishFamily || null,
          updates.prepTime || null,
          updates.servings || null,
          servingMeta.servingsCount,
          servingMeta.servingsCount,
          servingMeta.servingLabel,
          updates.recipe ? JSON.stringify(updates.recipe) : null,
          updates.animalSpawns ? JSON.stringify(updates.animalSpawns) : null,
          updates.recipeInstructions ? JSON.stringify(updates.recipeInstructions) : null,
          updates.recipeIngredients ? JSON.stringify(updates.recipeIngredients) : null,
          hasSectionsUpdate ? 1 : 0,
          sectionsJson,
          computedNutrition.gramsPerServing,
          computedNutrition.gramsPerServing,
          computedNutrition.nutritionJson,
          computedNutrition.nutritionJson,
          shouldClearImage ? 1 : 0,
          nextImageUrl,
          nextImageUrl,
          now,
          editedBy || 'Moderator',
          id
        ]
      });
    }

    console.log(`✏️ Saved dev recipe for: "${id}" by ${editedBy || 'Moderator'}`);

    return json({
      success: true,
      id,
      editedAt: now
    });

  } catch (err) {
    console.error('Failed to save builtin override:', err);
    return json({ error: 'Failed to save override' }, { status: 500 });
  }
};

// POST: Create a brand-new built-in recipe (admin-added, not in TypeScript LEVELS)
export const POST: RequestHandler = async ({ request }) => {
  try {
    const body = await request.json();
    const { recipe: data } = body;

    if (!data || !data.name || !data.name.trim()) {
      return json({ error: 'Recipe name is required' }, { status: 400 });
    }

    if (data.sections !== undefined && !Array.isArray(data.sections)) {
      return json({ error: 'Sections must be an array', code: 'INVALID_SECTIONS' }, { status: 400 });
    }
    const allocation = validateBuiltinAllocationPayload(data.sections, data.ingredients);
    if (allocation.errors.length > 0) {
      return json({ error: 'Invalid allocation metadata', allocationIssues: allocation.errors }, { status: 400 });
    }
    for (const issue of allocation.warnings) {
      console.warn('[ALLOCATIONS]', issue.message, issue.poolId ?? issue.sectionKey ?? '');
    }

    const db = getGameDb();
    const now = new Date().toISOString();
    const id = `admin-${Date.now()}`;
    const servingMeta = parseServingMeta((data.servings as string | null | undefined) ?? null);
    const baseFoodWord = toFoodWord(data.name.trim());
    let foodWord = baseFoodWord || id;

    if (foodWord !== id) {
      const duplicate = await db.execute({
        sql: 'SELECT 1 FROM dev_recipes WHERE food_word = ? LIMIT 1',
        args: [foodWord]
      });
      if (duplicate.rows.length > 0) {
        foodWord = `${foodWord}-${id.replace('admin-', '')}`;
      }
    }

    const recipeIngredientsForNutrition = data.recipeIngredients as NutritionLinkIngredient[] | undefined;
    const dataYieldWater = typeof data.yieldFactorWater === 'number' ? data.yieldFactorWater as number : undefined;
    const dataYieldFat   = typeof data.yieldFactorFat   === 'number' ? data.yieldFactorFat   as number : undefined;
    const computedNutrition = await resolveBuiltinNutrition(
      data.nutritionJson,
      recipeIngredientsForNutrition,
      (data.servings as string | null | undefined) ?? null,
      (data.cookingMethod as string | null | undefined) ?? null,
      dataYieldWater,
      dataYieldFat,
      data.sections as Level['sections'] | undefined,
    );

    await db.execute({
      sql: `INSERT INTO dev_recipes (
            recipe_id, food_word, recipe_name, category, dietary_category, cooking_method, dish_family, prep_time, servings,
            servings_count, serving_label,
            recipe, animal_spawns, recipe_instructions_json, recipe_ingredients_json, sections_json,
            image_url, submitted_by, status, created_at, updated_at,
            grams_per_serving, nutrition_json, nutrient_version, retention_model_version, source_match_version
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'published', ?, ?, ?, ?, ?, ?, ?, ?)`,
      args: [
        id,
        foodWord,
        data.name.trim(),
        toStoredRecipeCategory(data.category),
        data.dietaryCategory || 'all',
        data.cookingMethod || null,
        data.dishFamily || null,
        data.prepTime || null,
        data.servings || null,
        servingMeta.servingsCount,
        servingMeta.servingLabel,
        data.recipe ? JSON.stringify(data.recipe) : null,
        data.animalSpawns ? JSON.stringify(data.animalSpawns) : null,
        data.recipeInstructions ? JSON.stringify(data.recipeInstructions) : null,
        data.recipeIngredients ? JSON.stringify(data.recipeIngredients) : null,
        data.sections !== undefined ? JSON.stringify(data.sections) : null,
        data.imageUrl || null,
        'Moderator',
        now,
        now,
        computedNutrition.gramsPerServing,
        computedNutrition.nutritionJson,
        'legacy',
        'legacy',
        'legacy'
      ]
    });

    console.log(`➕ Added new built-in recipe: "${data.name.trim()}" (id: ${id})`);

    return json({ success: true, id });
  } catch (err) {
    console.error('Failed to create new built-in recipe:', err);
    return json({ error: 'Failed to create recipe' }, { status: 500 });
  }
};

// DELETE: Remove an override or admin-added recipe
export const DELETE: RequestHandler = async ({ request }) => {
  try {
    const body = await request.json();
    const { id } = body;

    if (!id) {
      return json({ error: 'Missing recipe id' }, { status: 400 });
    }

    const db = getGameDb();

    const existing = await db.execute({
      sql: 'SELECT recipe_id FROM dev_recipes WHERE recipe_id = ?',
      args: [id]
    });

    if (existing.rows.length === 0) {
      return json({ error: 'No override found for this recipe' }, { status: 404 });
    }

    if (id.startsWith('admin-')) {
      await db.execute({
        sql: 'DELETE FROM dev_recipes WHERE recipe_id = ?',
        args: [id]
      });
      console.log(`🗑️ Deleted admin-added recipe: "${id}"`);
      return json({ success: true, id, action: 'deleted' });
    }

    return json({ error: 'Non-admin dev recipes should be edited, not reverted' }, { status: 400 });

  } catch (err) {
    console.error('Failed to delete dev recipe:', err);
    return json({ error: 'Failed to update dev recipes' }, { status: 500 });
  }
};
