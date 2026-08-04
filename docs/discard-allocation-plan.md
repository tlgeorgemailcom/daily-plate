# Discard and Prepared-Material Allocation Plan

## Goal

Replace ingredient-level discard categories with clear, scope-appropriate controls:

- Ingredient rows use one generic control: `Remove this ingredient after prep [% / g]`.
- Marinade allocation remains section-level and is governed by the section's fill class and `Keep here` percentage.
- Rendered-fat allocation is section-level and appears only for heated prep sections.
- Explicitly reserved material uses the existing Reserved Pool; no separate rendered-fat pool is created.
- Nutrition must count each gram exactly once.

## Implementation Status (2026-08-04)

The allocation contract and the first end-to-end implementation are now in the
worktree. The following behavior has been implemented and verified manually:

- Shared allocation types, normalization, percent/gram conversion, four rendered-fat dispositions, pool allocation metadata, and structural validation live in `src/lib/nutrition/allocation.ts`.
- Ingredient-level removal is represented by the generic `removedAfterPrep`, `removalAmount`, and `removalUnit` fields. Legacy discard fields remain readable during the transition.
- RecipeForm maps, edits, and submits section pools, rendered-fat allocations, pool amounts, and generic ingredient removals. Builtin, moderator, draft, community-edit, and submit routes run the shared save-boundary validation.
- Rendered fat uses the existing Reserved Pool. General prepared material and rendered fat are separate nutrient components inside that pool, and a destination consumes the pool exactly once.
- The live preview exposes per-section rendered-fat estimates, allocation ledgers, source pool grams, and consumed pool grams.
- Direct nutrient fetches and SR28 food search both return `fat_drain` metadata.

### Unexpected implementation nuances

- `yieldFactorFat=1.0` does not mean that no fat renders. In `BKFST_002`, sausage fat remains in the finished gravy, so the final nutrition must retain it even though the section still needs an independent physical rendered-fat estimate for allocation.
- NDB 10219 (raw ground pork) has no `fat_drain` metadata. The `fried_meat` water binding is not a fat-rendering coefficient, so the builder uses a calibrated raw-to-cooked pork fallback based on the NDB 10219 to 10220 protein-conservation pair. The calibrated rendered fraction is `0.3559584629`.
- For the `BKFST_002` sausage section, the fallback estimates `11.5027g` rendered fat. Reserving 50% produces a `5.7514g` pool, displayed as `5.8 g`, and consuming the full pool adds those grams once to the gravy.
- Rendered-fat nutrients are partitioned out of the general prepared-material vector before `Keep here` is applied. Otherwise the same fat would be reduced by `Keep here` and then allocated again.
- The rendered-fat estimate is materialized when a section has a rendered-fat allocation, which matches the current progressive-disclosure UI and avoids presenting an allocation ledger for sections that have no rendered-fat choice.

### Verification completed

- Live `BKFST_002` preview compared the no-allocation baseline with a 50% rendered-fat reservation and full-pool consumption.
- The source section produced `11.5027g` estimated rendered fat and `5.7514g` reserved; the destination consumed exactly `5.7514g` once.
- `npm run check` passed with zero errors and warnings.
- `git diff --check` and diagnostics for the touched nutrition/search files passed.

### Remaining work

- Add automated regression coverage for the four rendered-fat dispositions, percent/gram equivalence, retained-rendered-fat with `yff=1`, discarded-fat with `yff<1`, exact-once pool consumption, and generic ingredient removal.
- Audit and migrate existing legacy marinade/rendered-fat records before removing legacy discard-category writes.
- Complete manual QA for renamed/deleted sections, unused pools, stale pool references, and all moderator/community round trips.

## 1. Define the allocation contract first

Before changing the UI, write down the accounting rules and use them as the shared contract for the client, server, and nutrition path.

### Ingredient-level removal

An ingredient row may be marked for removal after a heated prep step:

```text
Remove this ingredient after prep: [amount] [percent | grams]
```

This is for individual removable items such as bones, bay leaves, sachets, or solids removed after cooking. It has no category dropdown.

The control stores a normalized gram amount or percentage and may display both the entered unit and its gram equivalent. The meaning must be post-prep removal, not an additional ingredient and not a rendered-fat allocation.

### Section-level rendered fat

For a heated prep section, the fill class calculates an estimated rendered-fat amount. The section then allocates that amount using one of four mutually exclusive choices:

- Retain all here - no draining
- Drain and discard all - `[estimated grams]` discarded
- Drain; retain `[amount]` here
- Drain; reserve `[amount]` for another section

For an estimate of 20 g and a retained or reserved amount of 14.2 g:

```text
Rendered fat estimated: 20.0 g
Retained or reserved:   14.2 g
Discarded by draining:   5.8 g
```

The entered amount may be a percentage or a familiar cooking unit such as tablespoons, but the canonical value is grams.

### Marinade allocation

Marinade, brine, soak, and similar multi-ingredient preparations are section-level behavior. They must not appear in the ingredient-level discard controls.

The marinade section uses:

- Its fill class to estimate absorption/retention.
- `Keep here` to determine how much prepared material remains in the current section.
- Existing Reserved Pool behavior when material is intentionally set aside for another section.

Do not apply the fill-class absorption and `Keep here` as two independent reductions of the same grams.

## 2. Reuse the existing Reserved Pool

Do not add a second pool type or a second selector.

When rendered fat is reserved for another section:

- Add its grams to the source section's existing Reserved Pool.
- Keep allocation metadata so the pool can identify rendered-fat grams if nutrition handling requires it.
- Let the destination section use the existing Reserved Pool selector.
- Treat the transfer as an allocation of material already produced by the source section, not as a new ingredient.

A pool may contain more than one allocation, for example:

```text
Reserved Pool from sauteed onions: 34.2 g
  General prepared material:       20.0 g
  Rendered fat:                    14.2 g
```

The displayed pool total is the sum of its allocations. The component allocations are metadata, not additional nutrition rows.

Keep general reserved material and explicitly reserved rendered fat separate in the accounting, even though they share one pool. This prevents `Keep here` from reducing rendered fat a second time.

## 3. Refactor the form UI

### Ingredient rows

1. Remove the ingredient-level discard-type select.
2. Remove the `Marinade`, `Rendered fat`, and `Other` choices from ingredient rows.
3. Add one generic control:

   ```text
   Remove this ingredient after prep: [checkbox] [percent / grams]
   ```

4. Show it for ingredients assigned to a heated prep section.
5. Preserve the control for unlinked ingredients so the choice is not lost before nutrition linking.
6. Keep ingredient removal independent from section-level rendered-fat allocation.

### Section header

Keep the existing section header controls, including `Keep here` and the existing Reserved Pool selector. Add a progressive-disclosure panel for rendered fat to heated prep sections:

```text
Rendered fat after prep: estimated 20 g

( ) Retain all here - no draining
( ) Drain and discard all - 20 g discarded
( ) Drain; retain [amount] here
( ) Drain; reserve [amount] for another section
```

For the retain/reserve choices:

- Show an amount input with `%` and cooking-unit/gram modes.
- Display the converted gram value immediately.
- Display the resulting discarded amount.
- For reserve, show that the amount is being added to the existing Reserved Pool.
- Do not show rendered-fat controls for raw, unheated, or finish sections.

Add a short explanation near `Keep here` and an information icon for the longer explanation. The short text should explain that `Keep here` controls prepared material remaining in the section, while rendered-fat choices allocate the separately calculated rendered-fat amount.

## 4. Update the data model and persistence

Add explicit section-level rendered-fat allocation fields rather than overloading the old percentage-only field. The model should represent:

- Disposition: retain all, discard all, retain here, or reserve.
- Entered amount and unit mode when applicable.
- Normalized retained grams.
- Normalized reserved grams.
- Calculated rendered-fat grams.
- Calculated discarded grams.
- Existing output pool identity and allocation metadata.

For ingredient rows, persist the generic post-prep removal amount without a discard category.

Stop writing new `discardType` values. Continue reading legacy `discardType` values during the transition so existing recipes do not lose information.

Update all round-trip paths consistently:

- RecipeForm initial-data mapping.
- RecipeForm submit payload.
- Moderator loading and save payloads.
- Community recipe loading and save payloads.
- Builtin recipe normalization.
- Any server-side recipe serialization and validation.

## 5. Migrate legacy discard data safely

Before deleting legacy fields, audit existing recipes containing:

- Ingredient-level `marinade` discard types.
- Ingredient-level `rendered_fat` discard types.
- Section-level marinade percentages.
- Section-level rendered-fat percentages.

Migration rules:

- Generic individual removals become `Remove this ingredient after prep`.
- Ingredient-level marinade records are reviewed and consolidated into section-level marinade behavior where they represent one marinade preparation.
- Ingredient-level rendered-fat records are reviewed and converted to the heated section's rendered-fat allocation.
- Ambiguous records are surfaced in Edit/Review rather than silently reinterpreted.
- Preserve legacy read support until migrated data has been verified.

## 6. Add shared validation at every save boundary

Use one allocation-validation implementation for both client feedback and server-authoritative validation.

Run it during:

- Moderator Edit/Review.
- Moderator Save changes.
- Community draft save.
- Community recipe edit save.
- Community recipe submission.

Validation rules:

- Retained or reserved rendered fat cannot exceed the fill class estimate.
- Amounts cannot be negative.
- Reserved Pool consumption cannot exceed available grams.
- A section cannot consume its own pool.
- Deleted or renamed sections cannot leave orphaned pool references.
- `Keep here` and explicit reservations cannot count the same grams twice.
- A reserved amount must be represented in the existing pool.
- An unused pool produces a warning; an invalid or over-consumed pool blocks saving.
- Raw and finish sections cannot carry rendered-fat allocation.
- Ingredient post-prep removal cannot exceed the ingredient's calculated post-prep amount.

## 7. Integrate nutrition without double counting

The nutrition path must distinguish three operations:

1. Ingredient removal after prep.
2. General prepared material reserved from a section.
3. Rendered fat retained, discarded, or reserved.

Do not add a reserved amount as a new ingredient row. It is already part of the source section's calculated output.

For each source section, calculate a complete allocation ledger:

```text
prepared output
- retained in source section
- general material in Reserved Pool
- rendered fat retained in source section
- rendered fat in Reserved Pool
- discarded material
= zero unexplained remainder
```

When a destination section consumes Reserved Pool grams, restore the corresponding nutrition exactly once. Add tests before changing the nutrition builder so any regression is localized.

## 8. Implement in small slices

Recommended execution order:

1. Add shared allocation types and normalization helpers.
2. Add unit conversion and allocation-balance calculations.
3. Refactor the ingredient row to the generic removal control.
4. Replace the old section rendered-fat percentage field with the four-way section allocation panel.
5. Extend the existing Reserved Pool representation with allocation metadata.
6. Update RecipeForm submit/load round trips.
7. Update moderator and community API persistence paths.
8. Add client and server validation at every save boundary.
9. Add legacy migration/read compatibility.
10. Integrate nutrition allocation only after UI and validation behavior is stable.
11. Remove obsolete discard-category writes after migration verification.

Run `npm run check` after each substantive slice.

## 9. Required tests and manual QA

### Rendered fat

- 20 g estimated, retain all: 20 g retained, 0 g discarded.
- 20 g estimated, discard all: 0 g retained, 20 g discarded.
- 20 g estimated, retain 14.2 g here: 14.2 g retained, 5.8 g discarded.
- 20 g estimated, reserve 14.2 g: 14.2 g in the existing Reserved Pool, 5.8 g discarded.
- Reserved rendered fat consumed by another section is counted exactly once.
- Retain/reserve amounts above the estimate are rejected.
- Percentage and gram entry modes produce the same normalized result.

### Ingredient removal

- A heated-section ingredient can be marked for generic removal without a nutrition link.
- The removal setting survives linking, save, reload, and community editing.
- Removal cannot exceed the calculated post-prep amount.
- No marinade or rendered-fat dropdown appears on an ingredient row.

### Marinades and pools

- Marinade behavior is controlled at the section level.
- Fill classes for different marinade durations produce the expected retained amount.
- `Keep here` does not reduce rendered fat twice.
- General prepared material and rendered fat can share one Reserved Pool without being double-counted.

### Section visibility and persistence

- Raw, unheated, and finish sections do not show rendered-fat controls.
- Moderator Edit/Review detects stale or invalid pools.
- Moderator and community saves use the same validation rules.
- Deleted sections, renamed sections, self-pools, over-consumption, and unused pools are handled correctly.
