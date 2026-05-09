import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { execute, queryOne } from '$lib/server/turso';
import { calcNutritionSR28 } from '$lib/server/calcNutritionSR28';
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
    || (typeof obj.ndbNo === 'string' && obj.ndbNo.trim().length > 0);
  const portion = Number(obj.portionGrams ?? 0);
  return hasFood && Number.isFinite(portion) && portion > 0;
}

function hasAllIngredientLinks(ingredients: unknown[]): boolean {
  return ingredients.length > 0 && ingredients.every((row) => hasValidLink(row));
}

function withDefaultServingCount(row: unknown): unknown {
  if (!row || typeof row !== 'object') return row;
  const obj = row as Record<string, unknown>;
  const count = Number(obj.servingCount ?? 1);
  return {
    ...obj,
    servingCount: Number.isFinite(count) && count > 0 ? count : 1,
  };
}

// Generate unique ID
function generateId(): string {
  return `recipe-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
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

    const normalizedPatchIngs = patchIngredients.map((row: unknown) => withDefaultServingCount(row));
    const normalizedPatchDish = withDefaultServingCount(fields.dishLink);

    const canonicalPreview = isNutritionPreview(fields.nutritionJsonPreview) ? fields.nutritionJsonPreview : null;
    const nutritionJson = canonicalPreview ?? (
      (patchLinkType && patchIngredients.length > 0)
        ? await calcNutritionSR28(
            ((patchLinkType === 'dish' || patchLinkType === 'mixed')
              ? [{ isDish: true, ...(normalizedPatchDish as object) }, ...normalizedPatchIngs]
              : normalizedPatchIngs) as Parameters<typeof calcNutritionSR28>[0],
            fields.linkType,
            fields.servings,
            fields.cookingMethod ?? fields.cookMethod ?? null
          )
        : null
    );

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
          dish_family = COALESCE(?, dish_family),
          nutrition_json = ?,
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
          fields.dishFamily || null,
          nutritionJson ? JSON.stringify(nutritionJson) : EMPTY_NUTRITION_JSON,
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

    const normalizedPostIngs = postIngredients.map((row: unknown) => withDefaultServingCount(row));
    const normalizedPostDish = withDefaultServingCount(body.dishLink);

    const canonicalPreview = isNutritionPreview(body.nutritionJsonPreview) ? body.nutritionJsonPreview : null;
    const computedNutrition = canonicalPreview ?? (
      (postLinkType && postIngredients.length > 0)
        ? await calcNutritionSR28(
            ((postLinkType === 'dish' || postLinkType === 'mixed')
              ? [{ isDish: true, ...(normalizedPostDish as object) }, ...normalizedPostIngs]
              : normalizedPostIngs) as Parameters<typeof calcNutritionSR28>[0],
            body.linkType,
            body.servings,
            body.cookingMethod ?? body.cookMethod ?? null
          )
        : null
    );
    const nutritionJson = computedNutrition ? JSON.stringify(computedNutrition) : EMPTY_NUTRITION_JSON;
    const ingHash = Array.isArray(body.ingredients)
      ? body.ingredients.map((r: any) => `${r.ndbNo || r.foodWord || 'unlinked'}:${r.portionGrams}`).join('|')
      : '';
    console.log(`[SUBMIT] linkType=${body.linkType} rows=${body.ingredients?.length ?? 0} cal=${computedNutrition?.perServing?.cal ?? 'null'} ings=[${ingHash}]`);
    const gramsPerServing = computedNutrition?.gramsPerServing ?? 0;
    
    // Insert into Turso
    await execute(
      `INSERT INTO player_recipes (
        recipe_id, submitted_by, recipe_name, category, dietary_category,
        prep_time, servings,
        recipe_ingredients_json, recipe_instructions_json,
        sections_json,
        image_url, link_type, cooking_method, dish_family, nutrition_json,
        submitter_name, status, created_at, updated_at,
        grams_per_serving, nutrient_version, retention_model_version, source_match_version
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'), ?, ?, ?, ?)`,
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
        body.dishFamily || null,
        nutritionJson,
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
