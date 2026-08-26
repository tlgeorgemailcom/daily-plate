# Onion Saute Physics Calibration

Status: temporary calibration data; not production physics.

## Purpose

Record measured onion mass loss for short skillet cooking so a future onion-specific
physics model can be evaluated without changing recipe output yet.

## Measurement Conditions

- Food: red, white, and yellow onions
- Normalized starting batch: 100 g onions
- Pan temperature: approximately 330 F
- Scale precision: 0.01 g
- Oil remains in the pan and is included in the pan-plus-onion measurements
- Onion-only retention is calculated after subtracting the oil/pan contribution

For a batch with initial onion mass `B`, initial pan-plus-onion mass `C`, and pan-plus-onion
mass after cooking `D`, onion retention is:

```text
onion_remaining = D - A
retention = (D - A) / B
```

where `A` is the pan-plus-oil mass without onions. Equivalently, onion loss is measured
from the onion-only mass rather than from the combined pan mass.

## Cumulative Onion Loss

Independent 100 g batch measurements:

| Minute | Cumulative loss | Retained mass |
|---:|---:|---:|
| 1 | 15.98% | 84.02 g |
| 2 | 26.00% | 74.00 g |
| 3 | 35.48% | 64.52 g |
| 4 | 44.11% | 55.89 g |
| 5 | 49.97% | 50.03 g |
| 6 | 54.58% | 45.42 g |
| 7 | 58.82% | 41.18 g |

The first-minute example was 69.71 g starting onions, 10.33 g loss, and 59.38 g
remaining, giving retention of approximately 0.8518.

## Interval Loss

| Interval | Loss during interval |
|---:|---:|
| 0-1 min | 15.98% |
| 1-2 min | 10.02% |
| 2-3 min | 9.48% |
| 3-4 min | 8.63% |
| 4-5 min | 5.86% |
| 5-6 min | 4.61% |
| 6-7 min | 4.24% |

The 6.564% value discussed during calibration is the average interval loss from minutes
2 through 7, not a constant loss for every minute.

## Temporary Piecewise Model

For elapsed time `t` in minutes, use cumulative loss `L(t)`:

```text
L(t) = 0.1598 t                         for 0 <= t <= 1
L(t) = 0.1598 + 0.1002 (t - 1)         for 1 < t <= 2
L(t) = 0.2600 + 0.06564 (t - 2)        for t > 2
```

For starting onion mass `M0`, estimated retained mass is:

```text
Mt = M0 * (1 - L(t))
```

This is an interpolation model for the measured short-cook range, not a validated
universal onion yield factor.

## Interpretation and Limits

- Red, white, and yellow onions are currently treated as one generic short-cook model;
  observed first-minute variety differences were only about one percentage point.
- The data describe open skillet cooking near 330 F. They do not validate covered,
  low-heat onion sweating.
- The covered 30-40 minute Soubise process remains a separate calibration problem.
  See the `covered_sweat_aromatic` deferred work in `docs/recipe_development.md`.
- Do not replace existing recipe locks or add this model to Python/TypeScript physics
  until the model is reviewed against a reference cooked onion profile.
