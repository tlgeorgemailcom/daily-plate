// Dietary Reference Intakes (DRI) — USDA values
// Source: Jetcool profile.db DRI table, exported 2026-03-21
// Units: kcal=kcal | macros/fiber/fatty acids=g | water=L
//        vitamins: a_rae=mcg RAE, thiamin/riboflavin/niacin/b6/e/c=mg, d/b12/folate/biotin/k=mcg
//        minerals: calcium/magnesium/phosphorus/iron/zinc/copper/iodine/selenium=mg or mcg (see field comments)
//        chloride/potassium/sodium=g, fluoride/manganese=mg, chromium=mcg

export type Gender = 'male' | 'female' | 'both';
export type LifeStage = 'standard' | 'pregnancy' | 'lactation';

export interface DRIRow {
  lifeStageGroup: string;
  ageMin: number;   // years (0 = infant < 1y)
  ageMax: number;   // years (150 = no upper bound)
  gender: Gender;
  lifeStage: LifeStage;
  kcal: number;
  protein: number;              // g
  fat: number;                  // g
  carbohydrate: number;         // g
  water: number;                // L
  fiber: number;                // g
  linoleic_acid: number;        // g (Omega-6)
  alpha_linolenic_acid: number; // g (Omega-3)
  vitamin_a_rae: number;        // mcg RAE
  thiamin: number;              // mg
  riboflavin: number;           // mg
  niacin: number;               // mg NE
  choline: number;              // mg
  pantothenic_acid: number;     // mg
  vitamin_b6: number;           // mg
  biotin: number;               // mcg
  folate: number;               // mcg DFE
  vitamin_b12: number;          // mcg
  vitamin_c: number;            // mg
  vitamin_d: number;            // mcg
  vitamin_e: number;            // mg AT
  vitamin_k: number;            // mcg
  calcium: number;              // mg
  chloride: number;             // g
  chromium: number;             // mcg
  copper: number;               // mcg
  fluoride: number;             // mg
  iodine: number;               // mcg
  iron: number;                 // mg
  magnesium: number;            // mg
  manganese: number;            // mg
  potassium: number;            // g
  phosphorus: number;           // mg
  selenium: number;             // mcg
  sodium: number;               // g
  zinc: number;                 // mg
}

export const DRI_TABLE: readonly DRIRow[] = [
  {
    lifeStageGroup: 'Infants0_6mo', ageMin: 0, ageMax: 0, gender: 'both', lifeStage: 'standard',
    kcal: 520, protein: 9.1, fat: 31, carbohydrate: 60, water: 0.7, fiber: 0,
    linoleic_acid: 4.4, alpha_linolenic_acid: 0.5,
    vitamin_a_rae: 400, thiamin: 0.2, riboflavin: 0.3, niacin: 2, choline: 125,
    pantothenic_acid: 1.7, vitamin_b6: 0.1, biotin: 5, folate: 65, vitamin_b12: 0.4,
    vitamin_c: 40, vitamin_d: 5, vitamin_e: 4, vitamin_k: 2,
    calcium: 210, chloride: 0.18, chromium: 0.2, copper: 200, fluoride: 0.01,
    iodine: 110, iron: 0.27, magnesium: 30, manganese: 0.003, potassium: 0.4,
    phosphorus: 100, selenium: 15, sodium: 0.12, zinc: 2,
  },
  {
    lifeStageGroup: 'Infants7_12mo', ageMin: 0, ageMax: 1, gender: 'both', lifeStage: 'standard',
    kcal: 676, protein: 11, fat: 30, carbohydrate: 95, water: 0.8, fiber: 0,
    linoleic_acid: 4.6, alpha_linolenic_acid: 0.5,
    vitamin_a_rae: 500, thiamin: 0.3, riboflavin: 0.4, niacin: 4, choline: 150,
    pantothenic_acid: 1.8, vitamin_b6: 0.3, biotin: 6, folate: 80, vitamin_b12: 0.5,
    vitamin_c: 50, vitamin_d: 5, vitamin_e: 5, vitamin_k: 2.5,
    calcium: 270, chloride: 0.57, chromium: 5.5, copper: 220, fluoride: 0.5,
    iodine: 130, iron: 11, magnesium: 75, manganese: 0.6, potassium: 0.7,
    phosphorus: 275, selenium: 20, sodium: 0.37, zinc: 3,
  },
  {
    lifeStageGroup: 'Children1_3y', ageMin: 1, ageMax: 3, gender: 'both', lifeStage: 'standard',
    kcal: 1046, protein: 13, fat: 38.1, carbohydrate: 130, water: 1.3, fiber: 19,
    linoleic_acid: 7, alpha_linolenic_acid: 0.7,
    vitamin_a_rae: 300, thiamin: 0.5, riboflavin: 0.5, niacin: 6, choline: 200,
    pantothenic_acid: 2, vitamin_b6: 0.5, biotin: 8, folate: 150, vitamin_b12: 0.9,
    vitamin_c: 15, vitamin_d: 5, vitamin_e: 6, vitamin_k: 30,
    calcium: 500, chloride: 1.5, chromium: 11, copper: 340, fluoride: 0.7,
    iodine: 90, iron: 7, magnesium: 80, manganese: 1.2, potassium: 3,
    phosphorus: 460, selenium: 20, sodium: 1, zinc: 3,
  },
  {
    lifeStageGroup: 'Children4_8y', ageMin: 4, ageMax: 8, gender: 'both', lifeStage: 'standard',
    kcal: 1742, protein: 19, fat: 39.7, carbohydrate: 130, water: 1.7, fiber: 25,
    linoleic_acid: 10, alpha_linolenic_acid: 0.9,
    vitamin_a_rae: 400, thiamin: 0.6, riboflavin: 0.6, niacin: 8, choline: 250,
    pantothenic_acid: 3, vitamin_b6: 0.6, biotin: 12, folate: 200, vitamin_b12: 1.2,
    vitamin_c: 25, vitamin_d: 5, vitamin_e: 7, vitamin_k: 55,
    calcium: 800, chloride: 1.9, chromium: 15, copper: 440, fluoride: 1,
    iodine: 90, iron: 10, magnesium: 130, manganese: 1.5, potassium: 3.8,
    phosphorus: 500, selenium: 30, sodium: 1.2, zinc: 5,
  },
  {
    lifeStageGroup: 'Males9_13y', ageMin: 9, ageMax: 13, gender: 'male', lifeStage: 'standard',
    kcal: 2279, protein: 34, fat: 43.6, carbohydrate: 130, water: 2.4, fiber: 31,
    linoleic_acid: 12, alpha_linolenic_acid: 1.2,
    vitamin_a_rae: 600, thiamin: 0.9, riboflavin: 0.9, niacin: 12, choline: 375,
    pantothenic_acid: 4, vitamin_b6: 1, biotin: 20, folate: 300, vitamin_b12: 1.8,
    vitamin_c: 45, vitamin_d: 5, vitamin_e: 11, vitamin_k: 60,
    calcium: 1300, chloride: 2.3, chromium: 25, copper: 700, fluoride: 2,
    iodine: 120, iron: 8, magnesium: 240, manganese: 1.9, potassium: 4.5,
    phosphorus: 1250, selenium: 40, sodium: 1.5, zinc: 8,
  },
  {
    lifeStageGroup: 'Males14_18y', ageMin: 14, ageMax: 18, gender: 'male', lifeStage: 'standard',
    kcal: 3152, protein: 52, fat: 48, carbohydrate: 130, water: 3.3, fiber: 38,
    linoleic_acid: 16, alpha_linolenic_acid: 1.6,
    vitamin_a_rae: 900, thiamin: 1.2, riboflavin: 1.3, niacin: 16, choline: 550,
    pantothenic_acid: 5, vitamin_b6: 1.3, biotin: 25, folate: 400, vitamin_b12: 2.4,
    vitamin_c: 75, vitamin_d: 5, vitamin_e: 15, vitamin_k: 75,
    calcium: 1300, chloride: 2.3, chromium: 35, copper: 890, fluoride: 3,
    iodine: 150, iron: 11, magnesium: 410, manganese: 2.2, potassium: 4.7,
    phosphorus: 1250, selenium: 55, sodium: 1.5, zinc: 11,
  },
  {
    lifeStageGroup: 'Males19_30y', ageMin: 19, ageMax: 30, gender: 'male', lifeStage: 'standard',
    kcal: 3067, protein: 56, fat: 48.9, carbohydrate: 130, water: 3.7, fiber: 38,
    linoleic_acid: 17, alpha_linolenic_acid: 1.6,
    vitamin_a_rae: 900, thiamin: 1.2, riboflavin: 1.3, niacin: 16, choline: 550,
    pantothenic_acid: 5, vitamin_b6: 1.3, biotin: 30, folate: 400, vitamin_b12: 2.4,
    vitamin_c: 90, vitamin_d: 5, vitamin_e: 15, vitamin_k: 120,
    calcium: 1000, chloride: 2.3, chromium: 35, copper: 900, fluoride: 4,
    iodine: 150, iron: 8, magnesium: 400, manganese: 2.3, potassium: 4.7,
    phosphorus: 700, selenium: 55, sodium: 1.5, zinc: 11,
  },
  {
    lifeStageGroup: 'Males31_50y', ageMin: 31, ageMax: 50, gender: 'male', lifeStage: 'standard',
    kcal: 2966, protein: 56, fat: 48.9, carbohydrate: 130, water: 3.7, fiber: 38,
    linoleic_acid: 17, alpha_linolenic_acid: 1.6,
    vitamin_a_rae: 900, thiamin: 1.2, riboflavin: 1.3, niacin: 16, choline: 550,
    pantothenic_acid: 5, vitamin_b6: 1.3, biotin: 30, folate: 400, vitamin_b12: 2.4,
    vitamin_c: 90, vitamin_d: 5, vitamin_e: 15, vitamin_k: 120,
    calcium: 1000, chloride: 2.3, chromium: 35, copper: 900, fluoride: 4,
    iodine: 150, iron: 8, magnesium: 420, manganese: 2.3, potassium: 4.7,
    phosphorus: 700, selenium: 55, sodium: 1.5, zinc: 11,
  },
  {
    lifeStageGroup: 'Males51_70y', ageMin: 51, ageMax: 70, gender: 'male', lifeStage: 'standard',
    kcal: 2813, protein: 56, fat: 48.9, carbohydrate: 130, water: 3.7, fiber: 30,
    linoleic_acid: 14, alpha_linolenic_acid: 1.6,
    vitamin_a_rae: 900, thiamin: 1.2, riboflavin: 1.3, niacin: 16, choline: 550,
    pantothenic_acid: 5, vitamin_b6: 1.7, biotin: 30, folate: 400, vitamin_b12: 2.4,
    vitamin_c: 90, vitamin_d: 10, vitamin_e: 15, vitamin_k: 120,
    calcium: 1200, chloride: 2, chromium: 30, copper: 900, fluoride: 4,
    iodine: 150, iron: 8, magnesium: 420, manganese: 2.3, potassium: 4.7,
    phosphorus: 700, selenium: 55, sodium: 1.3, zinc: 11,
  },
  {
    lifeStageGroup: 'Males>70y', ageMin: 71, ageMax: 150, gender: 'male', lifeStage: 'standard',
    kcal: 2519, protein: 56, fat: 48.9, carbohydrate: 130, water: 3.7, fiber: 30,
    linoleic_acid: 14, alpha_linolenic_acid: 1.6,
    vitamin_a_rae: 900, thiamin: 1.2, riboflavin: 1.3, niacin: 16, choline: 550,
    pantothenic_acid: 5, vitamin_b6: 1.7, biotin: 30, folate: 400, vitamin_b12: 2.4,
    vitamin_c: 90, vitamin_d: 15, vitamin_e: 15, vitamin_k: 120,
    calcium: 1200, chloride: 1.8, chromium: 30, copper: 900, fluoride: 4,
    iodine: 150, iron: 8, magnesium: 420, manganese: 2.3, potassium: 4.7,
    phosphorus: 700, selenium: 55, sodium: 1.2, zinc: 11,
  },
  {
    lifeStageGroup: 'Females9_13y', ageMin: 9, ageMax: 13, gender: 'female', lifeStage: 'standard',
    kcal: 2071, protein: 34, fat: 43.6, carbohydrate: 130, water: 2.1, fiber: 26,
    linoleic_acid: 10, alpha_linolenic_acid: 1,
    vitamin_a_rae: 600, thiamin: 0.9, riboflavin: 0.9, niacin: 12, choline: 375,
    pantothenic_acid: 4, vitamin_b6: 1, biotin: 20, folate: 300, vitamin_b12: 1.8,
    vitamin_c: 45, vitamin_d: 5, vitamin_e: 11, vitamin_k: 60,
    calcium: 1300, chloride: 2.3, chromium: 21, copper: 120, fluoride: 2,
    iodine: 120, iron: 8, magnesium: 240, manganese: 1.6, potassium: 4.5,
    phosphorus: 1250, selenium: 40, sodium: 1.5, zinc: 8,
  },
  {
    lifeStageGroup: 'Females14_18y', ageMin: 14, ageMax: 18, gender: 'female', lifeStage: 'standard',
    kcal: 2368, protein: 46, fat: 46.6, carbohydrate: 130, water: 2.3, fiber: 26,
    linoleic_acid: 1, alpha_linolenic_acid: 1.1,
    vitamin_a_rae: 700, thiamin: 1, riboflavin: 1, niacin: 14, choline: 400,
    pantothenic_acid: 5, vitamin_b6: 1.2, biotin: 25, folate: 400, vitamin_b12: 2.4,
    vitamin_c: 65, vitamin_d: 5, vitamin_e: 15, vitamin_k: 75,
    calcium: 1300, chloride: 2.3, chromium: 24, copper: 150, fluoride: 3,
    iodine: 150, iron: 15, magnesium: 360, manganese: 1.6, potassium: 4.7,
    phosphorus: 1250, selenium: 55, sodium: 1.5, zinc: 9,
  },
  {
    lifeStageGroup: 'Females19_30y', ageMin: 19, ageMax: 30, gender: 'female', lifeStage: 'standard',
    kcal: 2403, protein: 46, fat: 46.6, carbohydrate: 130, water: 2.7, fiber: 25,
    linoleic_acid: 12, alpha_linolenic_acid: 1.1,
    vitamin_a_rae: 700, thiamin: 1.1, riboflavin: 1.1, niacin: 14, choline: 425,
    pantothenic_acid: 5, vitamin_b6: 1.3, biotin: 30, folate: 400, vitamin_b12: 2.4,
    vitamin_c: 75, vitamin_d: 5, vitamin_e: 15, vitamin_k: 90,
    calcium: 100, chloride: 2.3, chromium: 25, copper: 150, fluoride: 3,
    iodine: 150, iron: 18, magnesium: 310, manganese: 1.8, potassium: 4.7,
    phosphorus: 700, selenium: 55, sodium: 1.5, zinc: 8,
  },
  {
    lifeStageGroup: 'Females31_50y', ageMin: 31, ageMax: 50, gender: 'female', lifeStage: 'standard',
    kcal: 2338, protein: 46, fat: 46.6, carbohydrate: 130, water: 2.7, fiber: 25,
    linoleic_acid: 12, alpha_linolenic_acid: 1.1,
    vitamin_a_rae: 700, thiamin: 1.1, riboflavin: 1.1, niacin: 14, choline: 425,
    pantothenic_acid: 5, vitamin_b6: 1.3, biotin: 30, folate: 400, vitamin_b12: 2.4,
    vitamin_c: 75, vitamin_d: 5, vitamin_e: 15, vitamin_k: 90,
    calcium: 100, chloride: 2.3, chromium: 25, copper: 150, fluoride: 3,
    iodine: 150, iron: 18, magnesium: 320, manganese: 1.8, potassium: 4.7,
    phosphorus: 700, selenium: 55, sodium: 1.5, zinc: 8,
  },
  {
    lifeStageGroup: 'Females51_70y', ageMin: 51, ageMax: 70, gender: 'female', lifeStage: 'standard',
    kcal: 2231, protein: 46, fat: 46.6, carbohydrate: 130, water: 2.7, fiber: 21,
    linoleic_acid: 11, alpha_linolenic_acid: 1.1,
    vitamin_a_rae: 700, thiamin: 1.1, riboflavin: 1.1, niacin: 14, choline: 425,
    pantothenic_acid: 5, vitamin_b6: 1.5, biotin: 30, folate: 400, vitamin_b12: 2.4,
    vitamin_c: 75, vitamin_d: 10, vitamin_e: 15, vitamin_k: 90,
    calcium: 1200, chloride: 2, chromium: 20, copper: 150, fluoride: 3,
    iodine: 150, iron: 8, magnesium: 320, manganese: 1.8, potassium: 4.7,
    phosphorus: 700, selenium: 55, sodium: 1.3, zinc: 8,
  },
  {
    lifeStageGroup: 'Females>70y', ageMin: 71, ageMax: 150, gender: 'female', lifeStage: 'standard',
    kcal: 1997, protein: 46, fat: 46.6, carbohydrate: 130, water: 2.7, fiber: 21,
    linoleic_acid: 11, alpha_linolenic_acid: 1.1,
    vitamin_a_rae: 700, thiamin: 1.1, riboflavin: 1.1, niacin: 14, choline: 425,
    pantothenic_acid: 5, vitamin_b6: 1.5, biotin: 30, folate: 400, vitamin_b12: 2.4,
    vitamin_c: 75, vitamin_d: 15, vitamin_e: 15, vitamin_k: 90,
    calcium: 1200, chloride: 1.8, chromium: 20, copper: 150, fluoride: 3,
    iodine: 150, iron: 8, magnesium: 320, manganese: 1.8, potassium: 4.7,
    phosphorus: 700, selenium: 55, sodium: 1.2, zinc: 8,
  },
  {
    lifeStageGroup: 'Pregnancy14_18y', ageMin: 14, ageMax: 18, gender: 'female', lifeStage: 'pregnancy',
    kcal: 2568, protein: 71, fat: 61.6, carbohydrate: 175, water: 3, fiber: 28,
    linoleic_acid: 13, alpha_linolenic_acid: 1.4,
    vitamin_a_rae: 750, thiamin: 1.4, riboflavin: 1.4, niacin: 18, choline: 450,
    pantothenic_acid: 6, vitamin_b6: 1.9, biotin: 30, folate: 600, vitamin_b12: 2.6,
    vitamin_c: 80, vitamin_d: 5, vitamin_e: 15, vitamin_k: 75,
    calcium: 1300, chloride: 2.3, chromium: 29, copper: 400, fluoride: 3,
    iodine: 220, iron: 27, magnesium: 400, manganese: 2, potassium: 4.7,
    phosphorus: 1250, selenium: 60, sodium: 1.5, zinc: 12,
  },
  {
    lifeStageGroup: 'Pregnancy19_30y', ageMin: 19, ageMax: 30, gender: 'female', lifeStage: 'pregnancy',
    kcal: 2603, protein: 71, fat: 61.6, carbohydrate: 175, water: 3, fiber: 28,
    linoleic_acid: 13, alpha_linolenic_acid: 1.4,
    vitamin_a_rae: 770, thiamin: 1.4, riboflavin: 1.4, niacin: 18, choline: 450,
    pantothenic_acid: 6, vitamin_b6: 1.9, biotin: 30, folate: 600, vitamin_b12: 2.6,
    vitamin_c: 85, vitamin_d: 5, vitamin_e: 15, vitamin_k: 90,
    calcium: 1000, chloride: 2.3, chromium: 30, copper: 350, fluoride: 3,
    iodine: 220, iron: 27, magnesium: 350, manganese: 2, potassium: 4.7,
    phosphorus: 700, selenium: 60, sodium: 1.5, zinc: 11,
  },
  {
    lifeStageGroup: 'Pregnancy31_50y', ageMin: 31, ageMax: 50, gender: 'female', lifeStage: 'pregnancy',
    kcal: 2538, protein: 71, fat: 61.6, carbohydrate: 175, water: 3, fiber: 28,
    linoleic_acid: 13, alpha_linolenic_acid: 1.4,
    vitamin_a_rae: 770, thiamin: 1.4, riboflavin: 1.4, niacin: 18, choline: 450,
    pantothenic_acid: 6, vitamin_b6: 1.9, biotin: 30, folate: 600, vitamin_b12: 2.6,
    vitamin_c: 85, vitamin_d: 5, vitamin_e: 15, vitamin_k: 90,
    calcium: 1000, chloride: 2.3, chromium: 30, copper: 360, fluoride: 3,
    iodine: 220, iron: 27, magnesium: 350, manganese: 2, potassium: 4.7,
    phosphorus: 700, selenium: 60, sodium: 1.5, zinc: 11,
  },
  {
    lifeStageGroup: 'Lactation14_18y', ageMin: 14, ageMax: 18, gender: 'female', lifeStage: 'lactation',
    kcal: 2818, protein: 71, fat: 71.1, carbohydrate: 210, water: 3.8, fiber: 29,
    linoleic_acid: 13, alpha_linolenic_acid: 1.3,
    vitamin_a_rae: 1200, thiamin: 1.4, riboflavin: 1.6, niacin: 17, choline: 550,
    pantothenic_acid: 7, vitamin_b6: 2, biotin: 35, folate: 500, vitamin_b12: 2.8,
    vitamin_c: 115, vitamin_d: 5, vitamin_e: 19, vitamin_k: 75,
    calcium: 1300, chloride: 2.3, chromium: 44, copper: 360, fluoride: 3,
    iodine: 290, iron: 10, magnesium: 360, manganese: 2.6, potassium: 5.1,
    phosphorus: 1250, selenium: 70, sodium: 1.5, zinc: 13,
  },
  {
    lifeStageGroup: 'Lactation19_30y', ageMin: 19, ageMax: 30, gender: 'female', lifeStage: 'lactation',
    kcal: 2853, protein: 71, fat: 71.1, carbohydrate: 210, water: 3.8, fiber: 29,
    linoleic_acid: 13, alpha_linolenic_acid: 1.3,
    vitamin_a_rae: 1200, thiamin: 1.4, riboflavin: 1.6, niacin: 17, choline: 550,
    pantothenic_acid: 7, vitamin_b6: 2, biotin: 35, folate: 500, vitamin_b12: 2.8,
    vitamin_c: 120, vitamin_d: 5, vitamin_e: 19, vitamin_k: 90,
    calcium: 1000, chloride: 2.3, chromium: 45, copper: 310, fluoride: 3,
    iodine: 290, iron: 9, magnesium: 310, manganese: 2.6, potassium: 5.1,
    phosphorus: 700, selenium: 70, sodium: 1.5, zinc: 12,
  },
  {
    lifeStageGroup: 'Lactation31_50y', ageMin: 31, ageMax: 50, gender: 'female', lifeStage: 'lactation',
    kcal: 2788, protein: 71, fat: 71.1, carbohydrate: 210, water: 3.8, fiber: 29,
    linoleic_acid: 13, alpha_linolenic_acid: 1.3,
    vitamin_a_rae: 1200, thiamin: 1.4, riboflavin: 1.6, niacin: 17, choline: 550,
    pantothenic_acid: 7, vitamin_b6: 2, biotin: 35, folate: 500, vitamin_b12: 2.8,
    vitamin_c: 120, vitamin_d: 5, vitamin_e: 19, vitamin_k: 90,
    calcium: 1000, chloride: 2.3, chromium: 45, copper: 320, fluoride: 3,
    iodine: 290, iron: 9, magnesium: 320, manganese: 2.6, potassium: 5.1,
    phosphorus: 700, selenium: 70, sodium: 1.5, zinc: 12,
  },
];

/** Look up a DRI row directly by the LifeStageGroup key (e.g. 'Males19_30y'). */
export function getDRIByGroup(lifeStageGroup: string): DRIRow | undefined {
  return DRI_TABLE.find(r => r.lifeStageGroup === lifeStageGroup);
}

// ─── EER helpers (mirrors Jetcool nutrition_calculators.dart) ───────────────

/** Physical Activity (PA) multipliers — same values as Jetcool NutritionConstants.paValues */
const PA_VALUES: Record<string, number> = {
  'sedentary':  1.0,
  'low active': 1.11,
  'active':     1.25,
  'very active': 1.48,
};

/**
 * Mirrors Jetcool's ageCategoryMatcher.dart.
 * Maps an exact numeric age (years) + groupage to a DRI bracket string.
 * e.g. ageCategoryMatcher('Males', 25) → '19_30y'
 * Infants: use fractional years (0.25 = 3 months, 0.75 = 9 months).
 */
export function ageCategoryMatcher(groupage: string, age: number): string | null {
  switch (groupage) {
    case 'Infants':
      if (age >= 0 && age <= 0.5)  return '0_6mo';
      if (age > 0.5 && age <= 1)   return '7_12mo';
      break;
    case 'Children':
      if (age >= 1 && age <= 3)    return '1_3y';
      if (age >= 4 && age <= 8)    return '4_8y';
      break;
    case 'Males':
    case 'Females':
      if (age >= 9  && age <= 13)  return '9_13y';
      if (age >= 14 && age <= 18)  return '14_18y';
      if (age >= 19 && age <= 30)  return '19_30y';
      if (age >= 31 && age <= 50)  return '31_50y';
      if (age >= 51 && age <= 70)  return '51_70y';
      if (age > 70)                return '>70y';
      break;
    case 'Pregnancy':
    case 'Lactation':
      if (age >= 14 && age <= 18)  return '14_18y';
      if (age >= 19 && age <= 30)  return '19_30y';
      if (age >= 31 && age <= 50)  return '31_50y';
      break;
  }
  return null;
}

/**
 * Returns the numeric midpoint age (years) for a Jetcool age bracket string.
 * e.g. '19_30y' → 24.5 | '>70y' → 75 | '1_3y' → 2
 * Month brackets: '0_6mo' → 0.25 | '7_12mo' → 0.79
 */
function ageBracketMidpoint(age: string): number {
  if (age.endsWith('mo')) {
    // Month-based infant brackets — convert to fractional years
    const [lo, hi] = age.replace('mo', '').split('_').map(Number);
    return ((lo + hi) / 2) / 12;
  }
  if (age.startsWith('>')) {
    const lower = parseInt(age.replace('>', '').replace('y', ''));
    return lower + 5; // e.g. >70y → 75
  }
  const [lo, hi] = age.replace('y', '').split('_').map(Number);
  return (lo + hi) / 2;
}

/**
 * Estimated Energy Requirement — mirrors _calculateEER() in Jetcool.
 * Uses IOM DRI equations (Institute of Medicine 2002/2005).
 *
 * @param groupage  'Males' | 'Females' | 'Children' (case-insensitive)
 * @param ageMid    numeric age (years) — midpoint of bracket
 * @param weightKg  body weight in kg
 * @param heightM   height in metres
 * @param pa        Physical Activity multiplier (from PA_VALUES)
 */
function calculateEER(
  groupage: string,
  ageMid: number,
  weightKg: number,
  heightM: number,
  pa: number,
): number | null {
  switch (groupage.toLowerCase()) {
    case 'males':
      return 662 - 9.53 * ageMid + pa * (15.91 * weightKg + 539.6 * heightM);
    case 'females':
      return 354 - 6.91 * ageMid + pa * (9.36 * weightKg + 726 * heightM);
    case 'children':
      return 88.5 - 61.9 * ageMid + pa * (26.7 * weightKg + 903 * heightM) + 20;
    case 'infants':
      return 89 * weightKg - 100 + 175 * heightM + 7 * ageMid;
    case 'pregnancy':
      return 354 - 6.91 * ageMid + 9.36 * weightKg + 726 * heightM + 300;
    case 'lactation':
      return 354 - 6.91 * ageMid + 9.36 * weightKg + 726 * heightM + 500;
    default:
      return null;
  }
}

export interface MemberProfile {
  groupage: string;      // 'Males' | 'Females' | 'Children' etc.
  age: string;           // exact numeric age string e.g. '35', OR legacy bracket e.g. '19_30y'
  height: string;        // numeric string e.g. '68'
  height_unit: string;   // 'inches' | 'cm'
  weight: string;        // numeric string e.g. '154'
  weight_unit: string;   // 'pounds' | 'kilos'
  activity_level: string; // 'Sedentary' | 'Low Active' | 'Active' | 'Very Active'
}

export interface MemberTargets {
  driRow: DRIRow;        // base DRI micronutrients for this life-stage group
  kcal: number;          // personalised EER (rounded), or driRow.kcal if no biometrics
  kcalIsPersonalised: boolean;
}

/**
 * Derive personalised nutrient targets for a household member.
 *
 * **Micronutrients** come from the DRI table via `groupage + age` → `LifeStageGroup` key.
 * **Calories** are the IOM EER calculated from height, weight, and activity level
 * (the same formula Jetcool uses in nutrition_calculators.dart).  If height or
 * weight are missing the population-average `kcal` from the DRI table is used instead.
 */
export function getMemberTargets(member: MemberProfile): MemberTargets | null {
  // 1. Derive age bracket — accept exact numeric age ('35') or legacy bracket ('19_30y')
  const numericAge = parseFloat(member.age);
  const ageBracket = !isNaN(numericAge)
    ? (ageCategoryMatcher(member.groupage, numericAge) ?? member.age)
    : member.age;

  // 2. Build the LifeStageGroup key and look up the DRI row
  const lifeStageGroup = member.groupage + ageBracket; // e.g. 'Males19_30y'
  const driRow = getDRIByGroup(lifeStageGroup);
  if (!driRow) return null;

  // 3. Parse biometrics — missing values return null (no EER)
  const heightVal = parseFloat(member.height);
  const weightVal = parseFloat(member.weight);

  if (!heightVal || !weightVal) {
    return { driRow, kcal: driRow.kcal, kcalIsPersonalised: false };
  }

  // 4. Convert to SI units
  const heightM = member.height_unit === 'cm'
    ? heightVal * 0.01
    : heightVal * 0.0254; // inches → metres

  const weightKg = member.weight_unit === 'kilos'
    ? weightVal
    : weightVal * 0.453592; // pounds → kg

  // 5. Physical Activity multiplier (lookup is case-insensitive)
  const pa = PA_VALUES[member.activity_level.toLowerCase()] ?? PA_VALUES['sedentary'];

  // 6. Age midpoint — use exact numeric age if available, else derive from bracket
  const ageMid = !isNaN(numericAge) ? numericAge : ageBracketMidpoint(ageBracket);

  // 7. EER
  const eer = calculateEER(member.groupage, ageMid, weightKg, heightM, pa);

  if (!eer || eer < 500) {
    return { driRow, kcal: driRow.kcal, kcalIsPersonalised: false };
  }

  return {
    driRow,
    kcal: Math.round(eer),
    kcalIsPersonalised: true,
  };
}

/**
 * Get the DRI row for a given age (whole years), gender, and life stage.
 * - Ages 0–0 map to Infants0_6mo; pass age=1 for Infants7_12mo–Children1_3y boundary.
 * - Children 1–8 return the same row regardless of gender.
 * - lifeStage defaults to 'standard'; use 'pregnancy' or 'lactation' for females.
 */
export function getDRI(
  age: number,
  gender: 'male' | 'female',
  lifeStage: LifeStage = 'standard',
): DRIRow | undefined {
  // For age 0, prefer the 7-12 month row as the generally applicable infant row
  const effectiveAge = age === 0 ? 0 : age;
  return DRI_TABLE.find(r => {
    if (effectiveAge < r.ageMin || effectiveAge > r.ageMax) return false;
    if (r.gender !== 'both' && r.gender !== gender) return false;
    if (r.lifeStage !== lifeStage) return false;
    return true;
  });
}
