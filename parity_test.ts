/**
 * Parity test — verifies the /api/recipes/preview-nutrition endpoint
 * returns values that match independent manual calculation.
 *
 * Uses food words ABALONE and BUTTERFISH with known per-100g values from
 * src/lib/data/food-portions.ts. No cooking method → retention factors = 1.0.
 *
 * Run with:  npx tsx parity_test.ts
 * (Requires dev server at http://localhost:3001)
 */

const BASE = 'http://localhost:3001';

function round1(v: number): number {
  return Math.round(v * 10) / 10;
}

// Known nutrient values per 100g (from food-portions.ts)
const ABALONE    = { cal: 105.0, pro: 17.1, fat: 0.8,  carb: 6.0,  fib: 0.0, h2o: 74.6,  sug: 0.0 };
const BUTTERFISH = { cal: 187.0, pro: 22.1, fat: 10.3, carb: 0.0,  fib: 0.0, h2o: 66.8,  sug: 0.0 };

function computeExpected(
  rows: Array<{ food: typeof ABALONE; portionGrams: number; servingCount: number }>,
  servings: number
) {
  const keys = ['cal','pro','fat','carb','fib','h2o','sug'] as const;
  const totals = Object.fromEntries(keys.map(k => [k, 0])) as Record<typeof keys[number], number>;
  let totalGrams = 0;
  for (const r of rows) {
    const g = r.portionGrams * r.servingCount;
    const scale = g / 100;
    totalGrams += g;
    for (const k of keys) totals[k] += r.food[k] * scale;
  }
  const perServing = Object.fromEntries(keys.map(k => [k, round1(totals[k] / servings)]));
  return { perServing, gramsPerServing: round1(totalGrams / servings), servings };
}

async function runTest(
  label: string,
  payload: object,
  expected: ReturnType<typeof computeExpected>
) {
  console.log(`\n=== ${label} ===`);
  const res = await fetch(`${BASE}/api/recipes/preview-nutrition`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    console.error('  FAIL — HTTP', res.status, await res.text());
    return;
  }
  const data = await res.json() as { nutritionJson: typeof expected | null };
  if (!data.nutritionJson) {
    console.error('  FAIL — nutritionJson is null');
    return;
  }
  const got = data.nutritionJson;
  const keys = ['cal','pro','fat','carb','fib','h2o','sug'] as const;
  let pass = true;
  for (const k of keys) {
    const e = (expected.perServing as Record<string,number>)[k];
    const g = (got.perServing as Record<string,number>)[k];
    if (e !== g) {
      console.error(`  MISMATCH perServing.${k}: expected ${e}, got ${g}`);
      pass = false;
    }
  }
  if (expected.gramsPerServing !== got.gramsPerServing) {
    console.error(`  MISMATCH gramsPerServing: expected ${expected.gramsPerServing}, got ${got.gramsPerServing}`);
    pass = false;
  }
  if (expected.servings !== got.servings) {
    console.error(`  MISMATCH servings: expected ${expected.servings}, got ${got.servings}`);
    pass = false;
  }
  if (pass) console.log('  PASS ✓');
}

// ── Test 1: ingredient mode, 4 servings, no cooking ──────────────────────────
const test1Rows = [
  { food: ABALONE,    portionGrams: 100, servingCount: 2 }, // 200g total
  { food: BUTTERFISH, portionGrams: 187, servingCount: 1 }, // 187g total
];
const test1Expected = computeExpected(test1Rows, 4);
const test1Payload = {
  linkType: 'ingredient',
  servings: '4',
  cookingMethod: null,
  ingredients: [
    { foodWord: 'ABALONE',    portionGrams: 100, servingCount: 2 },
    { foodWord: 'BUTTERFISH', portionGrams: 187, servingCount: 1 },
  ],
};

// ── Test 2: ingredient mode, 1 serving ────────────────────────────────────────
const test2Rows = [
  { food: ABALONE, portionGrams: 85, servingCount: 1 }, // 85g
];
const test2Expected = computeExpected(test2Rows, 1);
const test2Payload = {
  linkType: 'ingredient',
  servings: '1',
  cookingMethod: null,
  ingredients: [
    { foodWord: 'ABALONE', portionGrams: 85, servingCount: 1 },
  ],
};

// ── Test 3: dish mode ─────────────────────────────────────────────────────────
// ABALONE 150g per serving, 6 servings → scale=1.5, divided individually
const dishPG = 150, dishSC = 6;
const test3Expected = {
  perServing: Object.fromEntries(
    (['cal','pro','fat','carb','fib','h2o','sug'] as const).map(k => [k, round1(ABALONE[k] * (dishPG/100))])
  ) as Record<string,number>,
  gramsPerServing: dishPG,
  servings: dishSC,
};
const test3Payload = {
  linkType: 'dish',
  servings: '6',
  cookingMethod: null,
  ingredients: [],
  dishLink: { foodWord: 'ABALONE', portionGrams: dishPG, servingCount: dishSC },
};

(async () => {
  await runTest('Test 1: ingredient mode, 4 servings (ABALONE+BUTTERFISH)', test1Payload, test1Expected as any);
  await runTest('Test 2: ingredient mode, 1 serving (ABALONE 85g)', test2Payload, test2Expected as any);
  await runTest('Test 3: dish mode (ABALONE 150g × 6 servings)', test3Payload, test3Expected as any);
  console.log('\nDone.');
})();
