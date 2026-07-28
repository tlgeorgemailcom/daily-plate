import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { queryAll, execute } from '$lib/server/turso';
import { buildRecipeCommunityV3, type CommunitySectionV3 } from '$lib/nutrition/buildRecipeCommunityV3';
import type { CommunityIngredient } from '$lib/nutrition/types';
import { fetchNutrientsByNdb } from '$lib/server/nutrition/fetchNutrients';
import { toDisplayRecipeCategory, toStoredRecipeCategory } from '$lib/farmers-basket/recipe-categories';

interface RecipeRow {
  recipe_id: string;
  recipe_name: string;
  category: string;
  dietary_category: string | null;
  prep_time: string | null;
  servings: string | null;
  recipe_ingredients_json: string | null;
  recipe_instructions_json: string | null;
  sections_json: string | null;
  image_url: string | null;
  submitted_by: string;
  submitter_name: string | null;
  status: string;
  created_at: string;
  moderator_note: string | null;
  nutrition_json: string | null;
  link_type: string | null;
  cooking_method: string | null;
  fill_class: string | null;
  cook2_fill_class: string | null;
  cook3_fill_class: string | null;
  dish_family: string | null;
}

const EMPTY_NUTRITION_JSON = '{}';

function hasValidLink(row: unknown): boolean {
  if (!row || typeof row !== 'object') return false;
  const obj = row as Record<string, unknown>;
  const hasFood = (typeof obj.foodWord === 'string' && obj.foodWord.trim().length > 0)
    || (typeof obj.ndbNo === 'string' && obj.ndbNo.trim().length > 0)
    || (typeof obj.componentRef === 'string' && obj.componentRef.trim().length > 0);
  const portion = Number(obj.portionGrams ?? 0);
  return hasFood && Number.isFinite(portion) && portion > 0;
}

function hasAllIngredientLinks(ingredients: unknown[], linkType: string): boolean {
  if (linkType === 'dish') {
    // In dish mode, regular ingredients are bare display items — only the dishLink matters.
    return true;
  }
  // Skip exempt items and isDish entries; they don't need individual nutrition links.
  const required = ingredients.filter((row) => {
    if (!row || typeof row !== 'object') return true;
    const obj = row as Record<string, unknown>;
    return !obj.exempt && !obj.isDish;
  });
  return required.length > 0 && required.every((row) => hasValidLink(row));
}

// ── Community nutrition builder ────────────────────────────────────────────────
async function calcCommunityNutrition(
  ingredientsRaw: unknown[],
  sectionsRaw: unknown[],
  servings: unknown,
  gramsPerServing: unknown,
  dishCookMethod?: unknown,
  fillClass?: unknown,
): Promise<{ nutritionJson: object | null; plausibilityFlags: string[]; blocked: boolean; missingIngredients: Array<{ ndbNo: string; displayName?: string }> }> {
  const sections = (sectionsRaw as unknown[]).filter(
    (s): s is CommunitySectionV3 =>
      !!s && typeof s === 'object' && typeof (s as Record<string, unknown>).sectionKey === 'string',
  );
  const ingredients: CommunityIngredient[] = (ingredientsRaw as unknown[]).map(r => {
    const obj = r as Record<string, unknown>;
    return {
      ndbNo:        String(obj.ndbNo ?? ''),
      displayName:  String(obj.name ?? obj.displayName ?? ''),
      portionGrams: Number(obj.portionGrams ?? 0),
      sectionKey:   typeof obj.section === 'string' ? obj.section : undefined,
      isOptional:   obj.ingredientStatus === 'optional' || obj.exempt === true,
      exempt:       obj.ingredientStatus === 'exempt',
      discarded:    obj.discarded === true,
      discardPercent: typeof obj.discardPercent === 'number' ? obj.discardPercent : undefined,
      ...(obj.componentRef ? { componentRef: String(obj.componentRef) } : {}),
      ...(obj.componentPer100g ? { componentPer100g: obj.componentPer100g as Record<string, number> } : {}),
    };
  }).filter(i => (i.ndbNo || i.componentPer100g) && i.portionGrams > 0);

  if (ingredients.length === 0) return { nutritionJson: null, plausibilityFlags: [], blocked: false, missingIngredients: [] };

  const ndbNos = ingredients
    .filter(i => !i.isOptional && !i.exempt)
    .map(i => i.ndbNo);

  const nutrientMap = await fetchNutrientsByNdb(ndbNos);
  const servingsNum        = Math.max(1, Number(servings ?? 1));
  const gramsPerServingNum = Math.max(1, Number(gramsPerServing ?? 100));

  const result = buildRecipeCommunityV3(
    sections,
    ingredients,
    nutrientMap,
    servingsNum,
    gramsPerServingNum,
    typeof dishCookMethod === 'string' ? dishCookMethod : undefined,
    undefined,
    undefined,
    typeof fillClass === 'string' ? fillClass : undefined,
  );

  const p100  = result.per100g;
  const gps   = result.gramsPerServing;
  const scale = gps / 100;
  const nutritionJson = {
    perServing: {
      cal:  (p100.energy_KCal       ?? 0) * scale,
      pro:  (p100.protein           ?? 0) * scale,
      fat:  (p100.totalLipidFat     ?? 0) * scale,
      carb: (p100.carbohydrate      ?? 0) * scale,
      fib:  (p100.fiberTotalDietary ?? 0) * scale,
      sug:  (p100.sugarsTotal       ?? 0) * scale,
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
  };
  return { nutritionJson, plausibilityFlags: result.plausibility.flags, blocked: result.plausibility.blocked, missingIngredients: result.plausibility.missingIngredients };
}

// GET: Fetch recipes by IDs (anonymous) OR by player_id (subscribers)
export const GET: RequestHandler = async ({ url }) => {
  try {
    // For subscribers: query by player_id
    const playerId = url.searchParams.get('player_id');
    
    if (playerId) {
      // Subscriber: fetch all their recipes across devices
      const rows = await queryAll<RecipeRow>(
        `SELECT recipe_id, recipe_name, category, dietary_category, prep_time, servings,
          recipe_ingredients_json, recipe_instructions_json, sections_json, image_url, submitted_by, submitter_name, status, created_at,
                moderator_note, nutrition_json, link_type, cooking_method, dish_family,
                cook_minutes, cook_temp_f, fill_class, cook2_fill_class, cook3_fill_class
         FROM player_recipes 
         WHERE submitted_by = ?
         ORDER BY created_at DESC`,
        [playerId]
      );
      
      const recipes = rows.map(row => ({
        id: row.recipe_id,
        recipeName: row.recipe_name,
        category: toDisplayRecipeCategory(row.category),
        dietaryCategory: row.dietary_category || 'all',
        prepTime: row.prep_time || '',
        servings: row.servings || '',
        ingredients: row.recipe_ingredients_json ? JSON.parse(row.recipe_ingredients_json) : [],
        instructions: row.recipe_instructions_json ? JSON.parse(row.recipe_instructions_json) : [],
        sections: row.sections_json ? JSON.parse(row.sections_json) : [],
        imageUrl: row.image_url || null,
        submitterName: row.submitter_name || row.submitted_by,
        status: row.status,
        moderatorNote: row.moderator_note || null,
        submittedAt: row.created_at,
        linkType: row.link_type ?? null,
        cookingMethod: row.cooking_method || 'Bake',
        fillClass: row.fill_class || undefined,
        cook2FillClass: row.cook2_fill_class || undefined,
        cook3FillClass: row.cook3_fill_class || undefined,
        dishFamily: row.dish_family || null,
        cookMinutes: row.cook_minutes ?? undefined,
        cookTempF: row.cook_temp_f ?? undefined,
        nutritionJson: row.nutrition_json && row.nutrition_json !== EMPTY_NUTRITION_JSON
          ? JSON.parse(row.nutrition_json)
          : null
      }));
      
      return json({ recipes });
    }
    
    // For anonymous: query by IDs from localStorage
    const idsParam = url.searchParams.get('ids');
    
    if (!idsParam) {
      return json({ error: 'Missing ids or player_id parameter' }, { status: 400 });
    }
    
    const ids = idsParam.split(',').filter(id => id.trim());
    
    if (ids.length === 0) {
      return json({ recipes: [] });
    }
    
    // Build query with placeholders
    const placeholders = ids.map(() => '?').join(', ');
    const rows = await queryAll<RecipeRow>(
      `SELECT recipe_id, recipe_name, category, dietary_category, prep_time, servings,
              recipe_ingredients_json, recipe_instructions_json, sections_json, image_url, submitted_by, submitter_name, status, created_at,
              moderator_note, nutrition_json, link_type, cooking_method, dish_family,
              cook_minutes, cook_temp_f, fill_class, cook2_fill_class, cook3_fill_class
       FROM player_recipes 
       WHERE recipe_id IN (${placeholders})
       ORDER BY created_at DESC`,
      ids
    );
    
    // Convert to frontend format
    const recipes = rows.map(row => ({
      id: row.recipe_id,
      recipeName: row.recipe_name,
      category: toDisplayRecipeCategory(row.category),
      dietaryCategory: row.dietary_category || 'all',
      prepTime: row.prep_time || '',
      servings: row.servings || '',
      ingredients: row.recipe_ingredients_json ? JSON.parse(row.recipe_ingredients_json) : [],
      instructions: row.recipe_instructions_json ? JSON.parse(row.recipe_instructions_json) : [],
      sections: row.sections_json ? JSON.parse(row.sections_json) : [],
      imageUrl: row.image_url || null,
      submitterName: row.submitter_name || row.submitted_by,
      status: row.status,
      moderatorNote: row.moderator_note || null,
      submittedAt: row.created_at,
      linkType: row.link_type ?? null,
      cookingMethod: row.cooking_method || 'Bake',
      fillClass: row.fill_class || undefined,
      cook2FillClass: row.cook2_fill_class || undefined,
      cook3FillClass: row.cook3_fill_class || undefined,
      dishFamily: row.dish_family || null,
      cookMinutes: row.cook_minutes ?? undefined,
      cookTempF: row.cook_temp_f ?? undefined,
    }));
    
    return json({ recipes });
    
  } catch (err) {
    console.error('Failed to fetch player recipes:', err);
    return json({ error: 'Failed to fetch recipes' }, { status: 500 });
  }
};

// PATCH: Update a pending recipe (player can only edit their own pending recipes)
export const PATCH: RequestHandler = async ({ request }) => {
  try {
    const body = await request.json();
    const { id, updates, submitterName } = body;
    
    if (!id) {
      return json({ error: 'Missing recipe id' }, { status: 400 });
    }
    
    if (!updates || typeof updates !== 'object') {
      return json({ error: 'Missing updates object' }, { status: 400 });
    }
    
    // Verify the recipe exists, is pending, and belongs to this submitter
    const existing = await queryAll<RecipeRow>(
      'SELECT recipe_id, status, submitted_by, recipe_name, category, dietary_category, prep_time, servings, recipe_ingredients_json, recipe_instructions_json, image_url, submitter_name, moderator_note, nutrition_json, link_type, created_at FROM player_recipes WHERE recipe_id = ?',
      [id]
    );
    
    if (existing.length === 0) {
      return json({ error: 'Recipe not found' }, { status: 404 });
    }
    
    const recipe = existing[0];
    
    if (!['pending', 'needs_changes', 'approved'].includes(recipe.status)) {
      return json({ error: 'Can only edit pending, needs_changes, or approved recipes' }, { status: 403 });
    }
    
    // Note: We rely on localStorage tracking for ownership since we don't have auth
    // The frontend only sends requests for recipes in the player's localStorage
    
    // Reset approved recipes back to pending (re-approval required)
    const shouldResetToPending = recipe.status === 'needs_changes' || recipe.status === 'approved';

    // Compute nutrition_json if linkType is provided
    const linkType = typeof updates.linkType === 'string' ? updates.linkType : null;
    const rawIngs: unknown[] = Array.isArray(updates.ingredients) ? updates.ingredients : [];
    // dishLink may be sent explicitly or embedded as the isDish entry in ingredients
    const explicitDishLink = (updates as { dishLink?: unknown }).dishLink;
    const embeddedDishLink = rawIngs.find(
      (r) => r && typeof r === 'object' && (r as Record<string, unknown>).isDish === true
    );
    const resolvedDishLink = explicitDishLink ?? embeddedDishLink;
    if (linkType && !hasAllIngredientLinks(rawIngs, linkType)) {
      const unlinked = rawIngs.filter((r) => {
        if (!r || typeof r !== 'object') return true;
        const obj = r as Record<string, unknown>;
        if (obj.exempt || obj.isDish) return false;
        return !hasValidLink(r);
      }).map((r) => (r as Record<string, unknown>).name ?? '?');
      return json({ error: `All ingredients must be linked before saving (unlinked: ${unlinked.join(', ')})` }, { status: 400 });
    }
    if ((linkType === 'dish' || linkType === 'mixed') && !hasValidLink(resolvedDishLink)) {
      return json({ error: 'Dish link is required and must be complete for this link mode' }, { status: 400 });
    }
    let nutritionJson: string | null = null;
    let plausibilityFlags: string[] = [];
    const updateSections = Array.isArray(updates.sections) ? updates.sections : [];
    const hasCommunityBuild =
      updateSections.length > 0 &&
      rawIngs.length > 0 &&
      rawIngs
        .filter((r: unknown) => {
          const obj = r as Record<string, unknown>;
          return obj.ingredientStatus !== 'exempt' && obj.ingredientStatus !== 'optional' && obj.exempt !== true;
        })
        .every((r: unknown) => {
          const obj = r as Record<string, unknown>;
          return (typeof obj.ndbNo === 'string' && (obj.ndbNo as string).trim().length > 0)
            || !!obj.componentPer100g;
        });
    if (hasCommunityBuild) {
      const comm = await calcCommunityNutrition(
        rawIngs,
        updateSections,
        updates.servings,
        (updates as { gramsPerServing?: unknown }).gramsPerServing ?? 100,
        (updates as { cookingMethod?: unknown }).cookingMethod,
        (updates as { fillClass?: unknown }).fillClass,
      );
      if (comm.blocked) {
        return json({ error: 'missing_ndb', missingIngredients: comm.missingIngredients }, { status: 422 });
      }
      if (comm.nutritionJson) nutritionJson = JSON.stringify(comm.nutritionJson);
      plausibilityFlags = comm.plausibilityFlags;
    }

    // Update the recipe and reset to pending (clears any needs_changes or approved state)
    const sql = shouldResetToPending
      ? `UPDATE player_recipes SET
        recipe_name = COALESCE(?, recipe_name),
          category = COALESCE(?, category),
          dietary_category = COALESCE(?, dietary_category),
          prep_time = COALESCE(?, prep_time),
          servings = COALESCE(?, servings),
        recipe_ingredients_json = COALESCE(?, recipe_ingredients_json),
        recipe_instructions_json = COALESCE(?, recipe_instructions_json),
        sections_json = COALESCE(?, sections_json),
          image_url = COALESCE(?, image_url),
          link_type = COALESCE(?, link_type),
          cooking_method = COALESCE(?, cooking_method),
          fill_class = ?,
          cook2_fill_class = ?,
          cook3_fill_class = ?,
          dish_family = COALESCE(?, dish_family),
          nutrition_json = ?,
          plausibility_flags = ?,
        updated_at = datetime('now'),
          status = 'pending',
          moderator_note = NULL
         WHERE recipe_id = ?`
      : `UPDATE player_recipes SET
        recipe_name = COALESCE(?, recipe_name),
          category = COALESCE(?, category),
          dietary_category = COALESCE(?, dietary_category),
          prep_time = COALESCE(?, prep_time),
          servings = COALESCE(?, servings),
        recipe_ingredients_json = COALESCE(?, recipe_ingredients_json),
        recipe_instructions_json = COALESCE(?, recipe_instructions_json),
        sections_json = COALESCE(?, sections_json),
          image_url = COALESCE(?, image_url),
          link_type = COALESCE(?, link_type),
          cooking_method = COALESCE(?, cooking_method),
          fill_class = ?,
          cook2_fill_class = ?,
          cook3_fill_class = ?,
          dish_family = COALESCE(?, dish_family),
          nutrition_json = ?,
          plausibility_flags = ?,
        updated_at = datetime('now'),
          status = 'pending'
         WHERE recipe_id = ?`;
    await execute(sql,
      [
        updates.recipeName || null,
        (updates.category ? toStoredRecipeCategory(updates.category) : null),
        updates.dietaryCategory || null,
        updates.prepTime || null,
        updates.servings || null,
        updates.ingredients ? JSON.stringify(updates.ingredients) : null,
        updates.instructions ? JSON.stringify(updates.instructions) : null,
        Array.isArray(updates.sections) && updates.sections.length > 0
          ? JSON.stringify(updates.sections)
          : null,
        updates.imageUrl || null,
        linkType,
        updates.cookingMethod || null,
        typeof (updates as { fillClass?: unknown }).fillClass === 'string' ? (updates as { fillClass: string }).fillClass : null,
        typeof (updates as { cook2FillClass?: unknown }).cook2FillClass === 'string' ? (updates as { cook2FillClass: string }).cook2FillClass : null,
        typeof (updates as { cook3FillClass?: unknown }).cook3FillClass === 'string' ? (updates as { cook3FillClass: string }).cook3FillClass : null,
        updates.dishFamily || null,
        nutritionJson || EMPTY_NUTRITION_JSON,
        plausibilityFlags.length > 0 ? JSON.stringify(plausibilityFlags) : null,
        id
      ]
    );

    console.log(`✏️ Player edited pending recipe: "${updates.recipeName || id}"`);

    return json({
      success: true,
      id,
      message: 'Recipe updated!',
      nutritionJson: nutritionJson ? JSON.parse(nutritionJson) : null,
      plausibilityFlags
    });
    
  } catch (err) {
    console.error('Failed to update recipe:', err);
    return json({ error: 'Failed to update recipe' }, { status: 500 });
  }
};

// DELETE: Withdraw a pending recipe
export const DELETE: RequestHandler = async ({ request }) => {
  try {
    const body = await request.json();
    const { id } = body;
    
    if (!id) {
      return json({ error: 'Missing recipe id' }, { status: 400 });
    }
    
    // Verify the recipe exists and is pending
    const existing = await queryAll<RecipeRow>(
      'SELECT recipe_id, recipe_name, status, submitted_by, category, dietary_category, prep_time, servings, recipe_ingredients_json, recipe_instructions_json, image_url, submitter_name, moderator_note, nutrition_json, link_type, created_at FROM player_recipes WHERE recipe_id = ?',
      [id]
    );
    
    if (existing.length === 0) {
      return json({ error: 'Recipe not found' }, { status: 404 });
    }
    
    const recipe = existing[0];
    
    if (recipe.status !== 'pending') {
      return json({ error: 'Can only withdraw pending recipes' }, { status: 403 });
    }
    
    // Delete the recipe
    await execute('DELETE FROM player_recipes WHERE recipe_id = ? AND status = ?', [id, 'pending']);
    
    console.log(`🗑️ Player withdrew pending recipe: "${recipe.recipe_name}"`);
    
    return json({ 
      success: true, 
      id,
      message: 'Recipe withdrawn'
    });
    
  } catch (err) {
    console.error('Failed to withdraw recipe:', err);
    return json({ error: 'Failed to withdraw recipe' }, { status: 500 });
  }
};
