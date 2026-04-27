import { writable } from 'svelte/store';
import type { NutritionLegendKey } from '$lib/farmers-basket/nutrition-legend';

type NutritionLegendState = {
  open: boolean;
  focusKey: NutritionLegendKey | null;
};

const initialState: NutritionLegendState = {
  open: false,
  focusKey: null
};

export const nutritionLegendModal = writable<NutritionLegendState>(initialState);

export function openNutritionLegend(focusKey: NutritionLegendKey | null = null) {
  nutritionLegendModal.set({ open: true, focusKey });
}

export function closeNutritionLegend() {
  nutritionLegendModal.set(initialState);
}