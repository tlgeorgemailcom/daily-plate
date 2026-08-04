import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { execute, queryOne } from '$lib/server/turso';
import { buildRecipeCommunityV3, type CommunitySectionV3, type PrimaryCookStage } from '$lib/nutrition/buildRecipeCommunityV3';
import type { CommunityIngredient } from '$lib/nutrition/types';
import { normalizeIngredientRemoval, validateRawAllocationIngredients, validateRawAllocationSections, type AllocationValidationIssue } from '$lib/nutrition/allocation';
import { fetchNutrientsByNdb } from '$lib/server/nutrition/fetchNutrients';
import { toStoredRecipeCategory } from '$lib/farmers-basket/recipe-categories';

const EMPTY_NUTRITION_JSON = '{}';
const DEFAULT_VERSION = 'pending';

function isNutritionPreview(value: unknown): value is { perServing?: { cal?: number } } {
  return typeof value === 'object' && value !== null;
}

function hasValidLink(row: unknown): boolean {
  if (!row || typeof row !== 'object') return false;
  const obj = row as Record<string, unknown>;
  const hasFood = (typeof obj.foodWord === 'string' && obj.foodWord.trim().length > 0)
    || (typeof obj.ndbNo === 'string' && obj.ndbNo.trim().length > 0)
    || (typeof obj.componentRef === 'string' && obj.componentRef.trim().length > 0);
  const portion = Number(obj.portionGrams ?? 0);
  return hasFood && Number.isFinite(portion) && portion > 0;
}

function hasAllIngredientLinks(ingredients: unknown[]): boolean {
  return ingredients.length > 0 && ingredients.every((row) => hasValidLink(row));
}

// Generate unique ID
function generateId(): string {
  return `recipe-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

// ── Community nutrition builder ────────────────────────────────────────────────
// Called when sections[] are present and ingredients have ndbNo.
// Returns { nutritionJson, plausibilityFlags, blocked, missingIngredients } or null if insufficient data.
async function calcCommunityNutrition(
  ingredientsRaw: unknown[],
  sectionsRaw: unknown[],
  servings: unknown,
  gramsPerServing: unknown,
  dishCookMethod?: unknown,
  dishCookTempF?: unknown,
  dishCookMinutes?: unknown,
  fillClass?: unknown,
  cook2Method?: unknown,
  cook2Minutes?: unknown,
  cook2TempF?: unknown,
  cook2FillClass?: unknown,
  cook3Method?: unknown,
  cook3Minutes?: unknown,
  cook3TempF?: unknown,
  cook3FillClass?: unknown,
): Promise<{ nutritionJson: object | null; plausibilityFlags: string[]; blocked: boolean; missingIngredients: Array<{ ndbNo: string; displayName?: string }>; allocationIssues: AllocationValidationIssue[] }> {
  const sections = (sectionsRaw as unknown[]).filter(
    (s): s is CommunitySectionV3 =>
      !!s && typeof s === 'object' && typeof (s as Record<string, unknown>).sectionKey === 'string',
  );
  const ingredients: CommunityIngredient[] = (ingredientsRaw as unknown[]).map(r => {
    const obj = r as Record<string, unknown>;
    const removal = normalizeIngredientRemoval(obj);
    return {
      ndbNo:        String(obj.ndbNo ?? ''),
      displayName:  String(obj.name ?? obj.displayName ?? ''),
      portionGrams: Number(obj.portionGrams ?? 0) * Math.max(1, Number(obj.servingCount ?? 1)),
      sectionKey:   typeof (obj.sectionKey ?? obj.section) === 'string' ? String(obj.sectionKey ?? obj.section) : undefined,
      isOptional:   obj.ingredientStatus === 'optional' || obj.exempt === true,
      exempt:       obj.ingredientStatus === 'exempt',
      removedAfterPrep: removal.removedAfterPrep,
      removalAmount: removal.removalAmount,
      removalUnit: removal.removalUnit,
      discarded:    obj.discarded === true,
      discardPercent: typeof obj.discardPercent === 'number' ? obj.discardPercent : undefined,
      ...(obj.componentRef ? { componentRef: String(obj.componentRef) } : {}),
      ...(obj.componentPer100g ? { componentPer100g: obj.componentPer100g as Record<string, number> } : {}),
    };
  }).filter(i => (i.ndbNo || i.componentPer100g) && i.portionGrams > 0);

  if (ingredients.length === 0) return { nutritionJson: null, plausibilityFlags: [], blocked: false, missingIngredients: [], allocationIssues: [] };

  const ndbNos = ingredients
    .filter(i => !i.isOptional && !i.exempt)
    .map(i => i.ndbNo)
    .filter((ndbNo) => ndbNo.trim().length > 0);

  const nutrientMap = await fetchNutrientsByNdb(ndbNos);

  const servingsNum        = Math.max(1, Number(servings ?? 1));
  const gramsPerServingNum = Math.max(1, Number(gramsPerServing ?? 100));
  const primaryCookStages: PrimaryCookStage[] = [
    {
      stage: 2,
      method: typeof cook2Method === 'string' ? cook2Method : undefined,
      minutes: typeof cook2Minutes === 'number' ? cook2Minutes : undefined,
      tempF: typeof cook2TempF === 'number' ? cook2TempF : undefined,
      fillClass: typeof cook2FillClass === 'string' ? cook2FillClass : undefined,
    },
    {
      stage: 3,
      method: typeof cook3Method === 'string' ? cook3Method : undefined,
      minutes: typeof cook3Minutes === 'number' ? cook3Minutes : undefined,
      tempF: typeof cook3TempF === 'number' ? cook3TempF : undefined,
      fillClass: typeof cook3FillClass === 'string' ? cook3FillClass : undefined,
    },
  ];

  const result = buildRecipeCommunityV3(
    sections,
    ingredients,
    nutrientMap,
    servingsNum,
    gramsPerServingNum,
    typeof dishCookMethod === 'string' ? dishCookMethod : undefined,
    typeof dishCookTempF === 'number' ? dishCookTempF : undefined,
    typeof dishCookMinutes === 'number' ? dishCookMinutes : undefined,
    typeof fillClass === 'string' ? fillClass : undefined,
    primaryCookStages,
  );

  const p100  = result.per100g;
  const gps   = result.servings > 0 ? result.totalCookedGrams / result.servings : result.gramsPerServing;
  const scale = gps / 100;
  const nutritionJson = {
    perServing: {
      cal:  (p100.energy_KCal    ?? 0) * scale,
      pro:  (p100.protein        ?? 0) * scale,
      fat:  (p100.totalLipidFat  ?? 0) * scale,
      carb: (p100.carbohydrate   ?? 0) * scale,
      fib:  (p100.fiberTotalDietary ?? 0) * scale,
      sug:  (p100.sugarsTotal    ?? 0) * scale,
    },
    per100g: {
      Energy_KCal:       p100.energy_KCal       ?? 0,
      Protein:           p100.protein           ?? 0,
      TotalLipidFat:     p100.totalLipidFat     ?? 0,
      Carbohydrate:      p100.carbohydrate      ?? 0,
      FiberTotalDietary: p100.fiberTotalDietary ?? 0,
      SugarsTotal:       p100.sugarsTotal       ?? 0,
      Water:             p100.water             ?? 0,
    },
    gramsPerServing: gps,
    servings:        servingsNum,
    allocationSections: result.sections.map((section) => ({
      sectionKey: section.sectionKey,
      cookedGrams: section.cookedGrams,
      renderedFatEstimateGrams: section.renderedFatEstimateGrams,
      renderedFatAllocation: section.renderedFatAllocation,
      reservedPoolGrams: section.reservedPoolGrams,
      consumedReservedPoolGrams: section.consumedReservedPoolGrams,
    })),
  };

  return {
    nutritionJson,
    plausibilityFlags: result.plausibility.flags,
    blocked: result.plausibility.blocked,
    missingIngredients: result.plausibility.missingIngredients,
    allocationIssues: result.allocationIssues ?? [],
  };
}

// PATCH — promote a draft recipe to pending, or update its data
// Auth: creator uses playerId; collaborators use edit code (code field).
// Collaborators can only save (submit=false) — they cannot submit for approval.
export const PATCH: RequestHandler = async ({ request }) => {
  try {
    const body = await request.json();
    const { recipeId, playerId, code, submit, ...fields } = body;
    const normalizedCategory = fields.category ? toStoredRecipeCategory(fields.category) : null;

    if (!recipeId || (!playerId && !code)) {
      return json({ error: 'Missing recipeId and playerId or code' }, { status: 400 });
    }

    const recipe = await queryOne<{ submitted_by: string; status: string; edit_code: string | null }>(
      'SELECT submitted_by, status, edit_code FROM player_recipes WHERE recipe_id = ?',
      [recipeId]
    );
    if (!recipe) return json({ error: 'Recipe not found' }, { status: 404 });
    if (recipe.status !== 'draft') return json({ error: 'Only draft recipes can be updated here' }, { status: 400 });

    const isCreator = playerId && recipe.submitted_by === playerId;
    const isCollaborator = code && recipe.edit_code && recipe.edit_code === code.toUpperCase().trim();

    if (!isCreator && !isCollaborator) {
      return json({ error: 'Not authorized' }, { status: 403 });
    }
    if (isCollaborator && submit) {
      return json({ error: 'Only the recipe creator can submit for approval' }, { status: 403 });
    }
    if (isCreator && submit) {
      const creator = await queryOne<{ subscription_tier: string }>(
        'SELECT subscription_tier FROM players WHERE id = ?',
        [playerId]
      );
      if (!creator || creator.subscription_tier === 'free') {
        return json({ error: 'Subscription required to submit recipes' }, { status: 403 });
      }
    }

    const newStatus = submit ? 'pending' : 'draft';

    const patchLinkType = typeof fields.linkType === 'string' ? fields.linkType : null;
    const patchIngredients = Array.isArray(fields.ingredients) ? fields.ingredients : [];
    if (patchLinkType && !hasAllIngredientLinks(patchIngredients)) {
      return json({ error: 'All ingredients must be linked before saving' }, { status: 400 });
    }
    if ((patchLinkType === 'dish' || patchLinkType === 'mixed') && !hasValidLink(fields.dishLink)) {
      return json({ error: 'Dish link is required and must be complete for this link mode' }, { status: 400 });
    }

    const canonicalPreview = isNutritionPreview(fields.nutritionJsonPreview) ? fields.nutritionJsonPreview : null;

    // Community recipe path: when sections are present and all active ingredients
    // have SR nutrition or component recipe nutrition, build authoritative nutrition.
    const patchSections = Array.isArray(fields.sections) ? fields.sections : [];
    const patchAllocationIssues = [
      ...validateRawAllocationSections(patchSections),
      ...validateRawAllocationIngredients(patchIngredients),
    ];
    const patchAllocationErrors = patchAllocationIssues.filter((issue) => issue.severity === 'error');
    if (patchAllocationErrors.length > 0) {
      return json({ error: 'Invalid allocation metadata', allocationIssues: patchAllocationErrors }, { status: 400 });
    }
    for (const issue of patchAllocationIssues.filter((candidate) => candidate.severity === 'warning')) {
      console.warn('[ALLOCATIONS]', issue.message, issue.poolId ?? issue.sectionKey ?? '');
    }
    const patchHasCommunityBuild =
      patchSections.length > 0 &&
      patchIngredients.length > 0 &&
      patchIngredients
        .filter((r: unknown) => {
          const obj = r as Record<string, unknown>;
          return obj.ingredientStatus !== 'exempt' && obj.ingredientStatus !== 'optional' && obj.exempt !== true;
        })
        .every((r: unknown) => {
          const obj = r as Record<string, unknown>;
          return (typeof obj.ndbNo === 'string' && (obj.ndbNo as string).trim().length > 0)
            || !!obj.componentPer100g;
        });

    let patchNutritionJson: object | null = null;
    let patchPlausibilityFlags: string[] = [];
    if (patchHasCommunityBuild) {
      const comm = await calcCommunityNutrition(
        patchIngredients,
        patchSections,
        fields.servings,
        fields.gramsPerServing ?? 100,
        fields.cookingMethod,
        fields.cookTempF,
        fields.cookMinutes,
        fields.fillClass,
        fields.cook2Method,
        fields.cook2Minutes,
        fields.cook2TempF,
        fields.cook2FillClass,
        fields.cook3Method,
        fields.cook3Minutes,
        fields.cook3TempF,
        fields.cook3FillClass,
      );
      if (comm.allocationIssues.length > 0) {
        return json({ error: 'Invalid allocation metadata', allocationIssues: comm.allocationIssues }, { status: 400 });
      }
      if (comm.blocked) {
        return json({ error: 'missing_ndb', missingIngredients: comm.missingIngredients }, { status: 422 });
      }
      patchNutritionJson = comm.nutritionJson;
      patchPlausibilityFlags = comm.plausibilityFlags;
    } else if (canonicalPreview) {
      patchNutritionJson = canonicalPreview;
    }
    const nutritionJson = patchNutritionJson;

    if (fields.recipeName) {
      await execute(
        `UPDATE player_recipes SET
          recipe_name = ?, category = ?, dietary_category = ?,
          prep_time = ?, servings = ?,
          recipe_ingredients_json = ?, recipe_instructions_json = ?,
          sections_json = ?,
          image_url = COALESCE(?, image_url),
          link_type = COALESCE(?, link_type),
          cooking_method = COALESCE(?, cooking_method),
          cook2_method = ?,
          cook2_minutes = ?,
          cook2_temp_f = ?,
          cook3_method = ?,
          cook3_minutes = ?,
          cook3_temp_f = ?,
          fill_class = ?,
          cook2_fill_class = ?,
          cook3_fill_class = ?,
          dish_family = COALESCE(?, dish_family),
          nutrition_json = ?,
          plausibility_flags = ?,
          cook_minutes = ?,
          cook_temp_f = ?,
          updated_at = datetime('now'),
          status = ?
        WHERE recipe_id = ?`,
        [
          fields.recipeName,
          normalizedCategory,
          fields.dietaryCategory || null,
          fields.prepTime || null,
          fields.servings || null,
          JSON.stringify(fields.ingredients || []),
          JSON.stringify(fields.instructions || []),
          Array.isArray(fields.sections) && fields.sections.length > 0
            ? JSON.stringify(fields.sections)
            : null,
          fields.imageUrl || null,
          fields.linkType || null,
          fields.cookingMethod || fields.cookMethod || null,
          typeof fields.cook2Method === 'string' ? fields.cook2Method : null,
          typeof fields.cook2Minutes === 'number' ? fields.cook2Minutes : null,
          typeof fields.cook2TempF === 'number' ? fields.cook2TempF : null,
          typeof fields.cook3Method === 'string' ? fields.cook3Method : null,
          typeof fields.cook3Minutes === 'number' ? fields.cook3Minutes : null,
          typeof fields.cook3TempF === 'number' ? fields.cook3TempF : null,
          typeof fields.fillClass === 'string' ? fields.fillClass : null,
          typeof fields.cook2FillClass === 'string' ? fields.cook2FillClass : null,
          typeof fields.cook3FillClass === 'string' ? fields.cook3FillClass : null,
          fields.dishFamily || null,
          nutritionJson ? JSON.stringify(nutritionJson) : EMPTY_NUTRITION_JSON,
          patchPlausibilityFlags.length > 0 ? JSON.stringify(patchPlausibilityFlags) : null,
          typeof fields.cookMinutes === 'number' ? fields.cookMinutes : null,
          typeof fields.cookTempF   === 'number' ? fields.cookTempF   : null,
          newStatus,
          recipeId
        ]
      );
    } else {
      // status-only change (just submitting)
      await execute('UPDATE player_recipes SET status = ?, updated_at = datetime(\'now\') WHERE recipe_id = ?', [newStatus, recipeId]);
    }

    return json({ success: true, id: recipeId, status: newStatus, nutritionJson });
  } catch (err) {
    console.error('Failed to update draft recipe:', err);
    return json({ error: 'Failed to update draft' }, { status: 500 });
  }
};

interface RecipeRow {
  id: string;
  name: string;
  category: string;
  submitted_by: string;
  status: string;
  created_at: string;
}

export const POST: RequestHandler = async ({ request }) => {
  try {
    const body = await request.json();
    const normalizedCategory = toStoredRecipeCategory(body.category);
    
    // Require player ID and paid subscription - free users cannot submit recipes
    if (!body.playerId) {
      return json({ error: 'Login required to submit recipes' }, { status: 401 });
    }
    
    // Verify player has paid subscription (database usage costs money)
    const player = await queryOne<{ subscription_tier: string }>(
      'SELECT subscription_tier FROM players WHERE id = ?',
      [body.playerId]
    );
    
    if (!player || player.subscription_tier === 'free') {
      return json({ error: 'Subscription required to submit recipes' }, { status: 403 });
    }
    
    // Validate required fields
    // Drafts only need a recipe name — collaborators fill in the rest.
    // Full submissions require ingredients and instructions too.
    if (!body.recipeName || !normalizedCategory) {
      return json({ error: 'Missing required fields' }, { status: 400 });
    }
    if (body.draft !== true && (!body.ingredients?.length || !body.instructions?.length)) {
      return json({ error: 'Ingredients and instructions are required to submit for approval' }, { status: 400 });
    }
    
    const recipeId = generateId();
    
    const submittedBy = body.playerId;
    const submitterName = body.submitterName || 'Player';
    const status = body.draft === true ? 'draft' : 'pending';

    const postLinkType = typeof body.linkType === 'string' ? body.linkType : null;
    const postIngredients = Array.isArray(body.ingredients) ? body.ingredients : [];
    if (postLinkType && !hasAllIngredientLinks(postIngredients)) {
      return json({ error: 'All ingredients must be linked before saving' }, { status: 400 });
    }
    if ((postLinkType === 'dish' || postLinkType === 'mixed') && !hasValidLink(body.dishLink)) {
      return json({ error: 'Dish link is required and must be complete for this link mode' }, { status: 400 });
    }

    const canonicalPreview = isNutritionPreview(body.nutritionJsonPreview) ? body.nutritionJsonPreview : null;

    // Community recipe path: sections present + all active ingredients have SR or component nutrition.
    const postSections = Array.isArray(body.sections) ? body.sections : [];
    const postAllocationIssues = [
      ...validateRawAllocationSections(postSections),
      ...validateRawAllocationIngredients(Array.isArray(body.ingredients) ? body.ingredients : []),
    ];
    const postAllocationErrors = postAllocationIssues.filter((issue) => issue.severity === 'error');
    if (postAllocationErrors.length > 0) {
      return json({ error: 'Invalid allocation metadata', allocationIssues: postAllocationErrors }, { status: 400 });
    }
    for (const issue of postAllocationIssues.filter((candidate) => candidate.severity === 'warning')) {
      console.warn('[ALLOCATIONS]', issue.message, issue.poolId ?? issue.sectionKey ?? '');
    }
    const postHasCommunityBuild =
      postSections.length > 0 &&
      postIngredients.length > 0 &&
      postIngredients
        .filter((r: unknown) => {
          const obj = r as Record<string, unknown>;
          return obj.ingredientStatus !== 'exempt' && obj.ingredientStatus !== 'optional' && obj.exempt !== true;
        })
        .every((r: unknown) => {
          const obj = r as Record<string, unknown>;
          return (typeof obj.ndbNo === 'string' && (obj.ndbNo as string).trim().length > 0)
            || !!obj.componentPer100g;
        });

    let computedNutrition: object | null = null;
    let postPlausibilityFlags: string[] = [];
    if (postHasCommunityBuild) {
      const comm = await calcCommunityNutrition(
        postIngredients,
        postSections,
        body.servings,
        body.gramsPerServing ?? 100,
        body.cookingMethod,
        body.cookTempF,
        body.cookMinutes,
        body.fillClass,
        body.cook2Method,
        body.cook2Minutes,
        body.cook2TempF,
        body.cook2FillClass,
        body.cook3Method,
        body.cook3Minutes,
        body.cook3TempF,
        body.cook3FillClass,
      );
      if (comm.allocationIssues.length > 0) {
        return json({ error: 'Invalid allocation metadata', allocationIssues: comm.allocationIssues }, { status: 400 });
      }
      if (comm.blocked) {
        return json({ error: 'missing_ndb', missingIngredients: comm.missingIngredients }, { status: 422 });
      }
      computedNutrition = comm.nutritionJson;
      postPlausibilityFlags = comm.plausibilityFlags;
    } else if (canonicalPreview) {
      computedNutrition = canonicalPreview;
    }

    const nutritionJson = computedNutrition ? JSON.stringify(computedNutrition) : EMPTY_NUTRITION_JSON;
    const ingHash = Array.isArray(body.ingredients)
      ? body.ingredients.map((r: any) => `${r.ndbNo || r.foodWord || 'unlinked'}:${r.portionGrams}`).join('|')
      : '';
    console.log(`[SUBMIT] linkType=${body.linkType} community=${postHasCommunityBuild} rows=${body.ingredients?.length ?? 0} cal=${(computedNutrition as any)?.perServing?.cal ?? 'null'} ings=[${ingHash}]`);
    const gramsPerServing = (computedNutrition as any)?.gramsPerServing ?? 0;
    
    // Insert into Turso
    await execute(
      `INSERT INTO player_recipes (
        recipe_id, submitted_by, recipe_name, category, dietary_category,
        prep_time, servings,
        recipe_ingredients_json, recipe_instructions_json,
        sections_json,
        image_url, link_type, cooking_method,
        cook2_method, cook2_minutes, cook2_temp_f,
        cook3_method, cook3_minutes, cook3_temp_f,
        fill_class, cook2_fill_class, cook3_fill_class, dish_family, nutrition_json,
        plausibility_flags,
        cook_minutes, cook_temp_f,
        submitter_name, status, created_at, updated_at,
        grams_per_serving, nutrient_version, retention_model_version, source_match_version
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'), ?, ?, ?, ?)`,
      [
        recipeId,
        submittedBy,
        body.recipeName,
        normalizedCategory,
        body.dietaryCategory || null,
        body.prepTime || null,
        body.servings || null,
        JSON.stringify(body.ingredients),
        JSON.stringify(body.instructions),
        Array.isArray(body.sections) && body.sections.length > 0
          ? JSON.stringify(body.sections)
          : null,
        body.imageUrl || null,
        body.linkType || null,
        body.cookingMethod || body.cookMethod || null,
        typeof body.cook2Method === 'string' ? body.cook2Method : null,
        typeof body.cook2Minutes === 'number' ? body.cook2Minutes : null,
        typeof body.cook2TempF === 'number' ? body.cook2TempF : null,
        typeof body.cook3Method === 'string' ? body.cook3Method : null,
        typeof body.cook3Minutes === 'number' ? body.cook3Minutes : null,
        typeof body.cook3TempF === 'number' ? body.cook3TempF : null,
        typeof body.fillClass === 'string' ? body.fillClass : null,
        typeof body.cook2FillClass === 'string' ? body.cook2FillClass : null,
        typeof body.cook3FillClass === 'string' ? body.cook3FillClass : null,
        body.dishFamily || null,
        nutritionJson,
        postPlausibilityFlags.length > 0 ? JSON.stringify(postPlausibilityFlags) : null,
        typeof body.cookMinutes === 'number' ? body.cookMinutes : null,
        typeof body.cookTempF   === 'number' ? body.cookTempF   : null,
        submitterName,
        status
        ,gramsPerServing,
        DEFAULT_VERSION,
        DEFAULT_VERSION,
        DEFAULT_VERSION
      ]
    );
    
    console.log(`✅ New recipe ${status === 'draft' ? 'draft saved' : 'submitted'}: "${body.recipeName}" by ${submitterName} (player: ${submittedBy})`);
    
    return json({ 
      success: true, 
      id: recipeId,
      status,
      message: status === 'draft' ? 'Draft saved!' : 'Recipe submitted for review!'
    });
    
  } catch (err) {
    console.error('Failed to save recipe:', err);
    return json({ error: 'Failed to submit recipe' }, { status: 500 });
  }
};
