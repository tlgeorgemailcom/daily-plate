/**
 * added-sugar-rules.mjs
 *
 * NDB-keyed classification table for Added Sugars estimation.
 *
 * Policy values:
 *   'all_added'  — 100% of this ingredient's sugar is considered added sugar
 *                  (pure sweeteners, syrups, honey, molasses, agave, etc.)
 *   'none_added' — 0% added; all sugar in this ingredient is intrinsic
 *                  (whole fruits, plain milk/dairy, plain vegetables, whole grains)
 *   'partial'    — Use the supplied ratio (0–1) as the added fraction.
 *                  For mixed products where some sugar is added and some intrinsic.
 *
 * Lookup priority during dev-recipe build:
 *   1. Explicit notes override on the ingredient row (addedsugar_ratio=, etc.)
 *   2. This NDB rules table  ← handles known exact ingredients
 *   3. Text heuristic on Long_Desc  ← fallback with estimated=true flag
 *   4. Default: none_added + estimated=true
 */

/** @type {Map<string, { policy: 'all_added' | 'none_added' | 'partial', ratio?: number, reason: string }>} */
export const ADDED_SUGAR_RULES = new Map([

  // ── Pure sugars ───────────────────────────────────────────────────────────
  ['19335', { policy: 'all_added', reason: 'Sugars, granulated' }],
  ['19334', { policy: 'all_added', reason: 'Sugars, brown' }],
  ['19336', { policy: 'all_added', reason: 'Sugars, powdered' }],
  ['19340', { policy: 'all_added', reason: 'Sugars, maple' }],
  ['19908', { policy: 'all_added', reason: 'Sugar, turbinado' }],
  ['19906', { policy: 'all_added', reason: 'Sweetener for baking, brown (sugar+sucralose)' }],
  ['19907', { policy: 'all_added', reason: 'Sweetener for baking (sugar+sucralose)' }],
  ['19909', { policy: 'all_added', reason: 'Sweetener, sugar substitute, granulated brown' }],
  ['43216', { policy: 'all_added', reason: 'Sweeteners, tabletop fructose, dry' }],
  ['44018', { policy: 'all_added', reason: 'Sweeteners, tabletop fructose, liquid' }],

  // ── Honey ─────────────────────────────────────────────────────────────────
  ['19296', { policy: 'all_added', reason: 'Honey' }],

  // ── Molasses ─────────────────────────────────────────────────────────────
  ['19304', { policy: 'all_added', reason: 'Molasses' }],

  // ── Agave ─────────────────────────────────────────────────────────────────
  ['19912', { policy: 'all_added', reason: 'Sweetener, syrup, agave' }],

  // ── Maple syrups ──────────────────────────────────────────────────────────
  ['19353', { policy: 'all_added', reason: 'Syrups, maple' }],
  ['19911', { policy: 'all_added', reason: 'Syrup, maple, Canadian' }],
  ['90480', { policy: 'all_added', reason: 'Syrup, Cane' }],

  // ── Corn syrups ───────────────────────────────────────────────────────────
  ['19349', { policy: 'all_added', reason: 'Syrups, corn, dark' }],
  ['19350', { policy: 'all_added', reason: 'Syrups, corn, light' }],
  ['19351', { policy: 'all_added', reason: 'Syrups, corn, high-fructose (HFCS)' }],

  // ── Pancake / table blend syrups ──────────────────────────────────────────
  ['19129', { policy: 'all_added', reason: 'Syrups, table blends, pancake' }],
  ['19128', { policy: 'all_added', reason: 'Syrups, table blends, pancake, reduced-calorie' }],
  ['19360', { policy: 'all_added', reason: 'Syrups, table blends, pancake, with 2% maple' }],
  ['19720', { policy: 'all_added', reason: 'Syrups, table blends, pancake, with 2% maple, added K' }],
  ['19113', { policy: 'all_added', reason: 'Syrups, table blends, pancake, with butter' }],
  ['19361', { policy: 'all_added', reason: 'Syrups, table blends, cane and 15% maple' }],
  ['19362', { policy: 'all_added', reason: 'Syrups, table blends, corn, refiner, and sugar' }],

  // ── Other pure syrups ─────────────────────────────────────────────────────
  ['19352', { policy: 'all_added', reason: 'Syrups, malt' }],
  ['19355', { policy: 'all_added', reason: 'Syrups, sorghum' }],
  ['42040', { policy: 'all_added', reason: 'Syrups, grenadine' }],
  ['19018', { policy: 'all_added', reason: 'Fruit syrup (pure added sweetener)' }],
  ['19030', { policy: 'all_added', reason: 'Syrup, fruit flavored' }],

  // ── Chocolate/caramel syrups ──────────────────────────────────────────────
  ['14181', { policy: 'all_added', reason: 'Beverages, Chocolate syrup' }],
  ['19924', { policy: 'all_added', reason: 'Syrup, NESTLE chocolate' }],
  ['19348', { policy: 'all_added', reason: 'Syrups, chocolate, fudge-type' }],

  // ── Jam / jelly / preserves ───────────────────────────────────────────────
  // Regular jams are mostly added sugar; use partial for reduced-sugar varieties
  ['43344', { policy: 'partial', ratio: 0.5, reason: 'Jams/preserves, reduced sugar (partial fruit/added split)' }],
  ['44110', { policy: 'all_added', reason: 'Jellies, reduced sugar, home preserved' }],
  ['9310',  { policy: 'partial', ratio: 0.7, reason: 'Rhubarb, frozen, cooked with sugar' }],

  // ── Whole raw fruits — intrinsic sugar only ───────────────────────────────
  ['9003',  { policy: 'none_added', reason: 'Apples, raw, with skin' }],
  ['9004',  { policy: 'none_added', reason: 'Apples, raw, without skin' }],
  ['9005',  { policy: 'none_added', reason: 'Apples, raw, without skin, cooked boiled' }],
  ['9006',  { policy: 'none_added', reason: 'Apples, raw, without skin, cooked microwave' }],
  ['9500',  { policy: 'none_added', reason: 'Apples, raw, red delicious, with skin' }],
  ['9501',  { policy: 'none_added', reason: 'Apples, raw, golden delicious, with skin' }],
  ['9502',  { policy: 'none_added', reason: 'Apples, raw, granny smith, with skin' }],
  ['9503',  { policy: 'none_added', reason: 'Apples, raw, gala, with skin' }],
  ['9504',  { policy: 'none_added', reason: 'Apples, raw, fuji, with skin' }],
  ['9040',  { policy: 'none_added', reason: 'Bananas, raw' }],
  ['9050',  { policy: 'none_added', reason: 'Blueberries, raw' }],
  ['9316',  { policy: 'none_added', reason: 'Strawberries, raw' }],
  ['9131',  { policy: 'none_added', reason: 'Grapes, american type, raw' }],
  ['9132',  { policy: 'none_added', reason: 'Grapes, red or green, European type, raw' }],
  ['9152',  { policy: 'none_added', reason: 'Lemon juice, raw' }],
  ['9200',  { policy: 'none_added', reason: 'Oranges, raw, navels' }],
  ['9201',  { policy: 'none_added', reason: 'Oranges, raw, all commercial varieties' }],
  ['9089',  { policy: 'none_added', reason: 'Dates, medjool' }],
  ['9087',  { policy: 'none_added', reason: 'Dates, deglet noor' }],
  ['9094',  { policy: 'none_added', reason: 'Figs, raw' }],
  ['9270',  { policy: 'none_added', reason: 'Pineapple, canned, heavy syrup — intrinsic fruit only' }],

  // ── Plain dairy — intrinsic lactose only ─────────────────────────────────
  ['1077',  { policy: 'none_added', reason: 'Milk, whole, 3.25% milkfat' }],
  ['1082',  { policy: 'none_added', reason: 'Milk, lowfat, 1% milkfat' }],
  ['1085',  { policy: 'none_added', reason: 'Milk, nonfat, fluid' }],
  ['1080',  { policy: 'none_added', reason: 'Milk, reduced fat, 2% milkfat' }],
  ['1093',  { policy: 'none_added', reason: 'Milk, whole, dry' }],
  ['1097',  { policy: 'none_added', reason: 'Milk, nonfat, dry' }],
  ['1116',  { policy: 'none_added', reason: 'Yogurt, plain, whole milk' }],
  ['1117',  { policy: 'none_added', reason: 'Yogurt, plain, low fat' }],
  ['1118',  { policy: 'none_added', reason: 'Yogurt, plain, nonfat' }],
  ['1145',  { policy: 'none_added', reason: 'Butter, without salt' }],
  ['1001',  { policy: 'none_added', reason: 'Butter, salted' }],

  // ── Plain grains / starches / vegetables — no added sugar ────────────────
  ['20081', { policy: 'none_added', reason: 'Wheat flour, white, all-purpose, enriched' }],
  ['20080', { policy: 'none_added', reason: 'Wheat flour, white, all-purpose, unenriched' }],
  ['20027', { policy: 'none_added', reason: 'Cornstarch' }],
  ['11124', { policy: 'none_added', reason: 'Carrots, raw' }],
  ['11457', { policy: 'none_added', reason: 'Spinach, raw' }],
  ['11253', { policy: 'none_added', reason: 'Lettuce, raw' }],

  // ── Neutral — ingredients that contain no meaningful sugars ───────────────
  ['2047',  { policy: 'none_added', reason: 'Salt, table' }],
  ['4031',  { policy: 'none_added', reason: 'Shortening, household, soybean/cottonseed' }],
  ['14411', { policy: 'none_added', reason: 'Water, tap, drinking' }],
  ['2010',  { policy: 'none_added', reason: 'Spices, cinnamon, ground' }],
  ['2011',  { policy: 'none_added', reason: 'Spices, cloves, ground' }],
  ['2001',  { policy: 'none_added', reason: 'Spices, allspice, ground' }],

  // ── Candied / sweetened fruit products — added sugar dominant ────────────
  ['9426',  { policy: 'all_added', reason: 'Candied fruit (sugar-coated)' }],
  ['9079',  { policy: 'all_added', reason: 'Cranberries, dried, sweetened' }],
  ['9328',  { policy: 'all_added', reason: 'Maraschino cherries, canned, drained' }],

  // ── Sweetened coconut ──────────────────────────────────────────────────────
  ['12179', { policy: 'all_added', reason: 'Coconut meat, dried, sweetened, shredded' }],
  ['12109', { policy: 'all_added', reason: 'Coconut meat, dried, sweetened, flaked' }],

  // ── Chocolate / confectionery ─────────────────────────────────────────────
  ['19080', { policy: 'all_added', reason: 'Candies, semisweet chocolate' }],
  ['18166', { policy: 'all_added', reason: 'Cookies, chocolate sandwich with creme filling (Oreo-type)' }],
  ['18173', { policy: 'all_added', reason: 'Cookies, graham crackers, plain or honey' }],

  // ── Vanilla extract — sugar carrier, but used in tiny amounts ────────────
  // Most of the sugar in vanilla extract is intrinsic to the ethanol/water base;
  // commercially it often has no added sugar. Classify as none_added.
  ['2050',  { policy: 'none_added', reason: 'Vanilla extract (no significant added sugar)' }],

  // ── Dried fruit — concentrated intrinsic sugar, no added sugar ───────────
  ['9298',  { policy: 'none_added', reason: 'Raisins, seedless (natural dried fruit)' }],
  ['9297',  { policy: 'none_added', reason: 'Raisins, golden seedless (natural dried fruit)' }],
  ['9085',  { policy: 'none_added', reason: 'Currants, zante, dried (natural dried fruit)' }],
  ['9421',  { policy: 'none_added', reason: 'Dates, medjool (natural dried fruit)' }],
  ['9032',  { policy: 'none_added', reason: 'Apricots, dried, sulfured, uncooked (no added sugar)' }],
  ['9354',  { policy: 'none_added', reason: 'Pineapple, canned, juice pack, drained (no syrup)' }],

  // ── Raw / plain fruit ─────────────────────────────────────────────────────
  ['9063',  { policy: 'none_added', reason: 'Cherries, sour, red, raw' }],
  ['9236',  { policy: 'none_added', reason: 'Peaches, yellow, raw' }],
  ['9156',  { policy: 'none_added', reason: 'Lemon peel, raw' }],

  // ── Plain dairy ───────────────────────────────────────────────────────────
  ['1096',  { policy: 'none_added', reason: 'Milk, canned, evaporated, plain (no added sugar)' }],
  ['1230',  { policy: 'none_added', reason: 'Milk, buttermilk, fluid, whole' }],
  ['1049',  { policy: 'none_added', reason: 'Cream, fluid, half and half' }],
  ['1053',  { policy: 'none_added', reason: 'Cream, fluid, heavy whipping' }],
  ['1017',  { policy: 'none_added', reason: 'Cheese, cream (plain)' }],
  ['1056',  { policy: 'none_added', reason: 'Cream, sour, cultured' }],

  // ── Peanut butter — no added sugar in plain variety ───────────────────────
  ['16098', { policy: 'none_added', reason: 'Peanut butter, smooth style, with salt (no added sugar)' }],

  // ── Nuts ──────────────────────────────────────────────────────────────────
  ['12142', { policy: 'none_added', reason: 'Nuts, pecans' }],

  // ── Spices and flavourings ────────────────────────────────────────────────
  ['2021',  { policy: 'none_added', reason: 'Spices, ginger, ground' }],
  ['2025',  { policy: 'none_added', reason: 'Spices, nutmeg, ground' }],
  ['2035',  { policy: 'none_added', reason: 'Spices, pumpkin pie spice' }],

  // ── Vegetables ────────────────────────────────────────────────────────────
  ['11424', { policy: 'none_added', reason: 'Pumpkin, canned, without salt' }],

  // ── Grain products ────────────────────────────────────────────────────────
  ['18079', { policy: 'none_added', reason: 'Bread crumbs, dry, grated, plain' }],

  // ── Cocoa ─────────────────────────────────────────────────────────────────
  ['19165', { policy: 'none_added', reason: 'Cocoa, dry powder, unsweetened' }],

  // ── Eggs ──────────────────────────────────────────────────────────────────
  ['1123',  { policy: 'none_added', reason: 'Egg, whole, raw, fresh' }],
  ['1124',  { policy: 'none_added', reason: 'Egg, white, raw, fresh' }],
  ['1125',  { policy: 'none_added', reason: 'Egg, yolk, raw, fresh' }],

  // ── Oats / grain ──────────────────────────────────────────────────────────
  ['8120',  { policy: 'none_added', reason: 'Cereals, oats, regular and quick, not fortified, dry' }],
  ['20084', { policy: 'none_added', reason: 'Wheat flour, white, cake, enriched' }],
  ['18211', { policy: 'none_added', reason: 'Puff pastry, frozen, ready-to-bake, baked' }],

  // ── Baking agents ─────────────────────────────────────────────────────────
  ['18369', { policy: 'none_added', reason: 'Baking powder, double-acting, sodium aluminium' }],
  ['18372', { policy: 'none_added', reason: 'Leavening agents, baking soda' }],
  ['18373', { policy: 'none_added', reason: 'Leavening agents, cream of tartar' }],

  // ── Fats / oils ───────────────────────────────────────────────────────────
  ['4610',  { policy: 'none_added', reason: 'Margarine, regular, 80% fat, composite, stick' }],

  // ── Beverages ─────────────────────────────────────────────────────────────
  ['14106', { policy: 'none_added', reason: 'Alcoholic beverage, wine, table, white' }],

  // ── Coconut products ──────────────────────────────────────────────────────
  ['12118', { policy: 'none_added', reason: 'Coconut milk, canned (no added sugar)' }],
]);
