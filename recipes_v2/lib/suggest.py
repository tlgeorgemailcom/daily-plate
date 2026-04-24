"""Candidate ingredient suggester.

Given a canonical dish per-100g profile, scan DataCentralCombo for ingredient
NDB rows whose per-100g profile contributes meaningfully to the dish's
dominant macros.

Strategy: for each candidate row, score it by cosine similarity over the
normalized macro vector. Rank top N.
"""
from __future__ import annotations

import sqlite3
from typing import Optional

from .data import COMBOO_DB, COMBO_TO_MACRO, MACRO_KEYS

# Categorical filter: which Long_Desc fragments to include/exclude depending
# on the dish profile. Kept simple and tunable.
EXCLUDE_FRAGMENTS_DEFAULT = (
    "infant", "baby food", "supplement", "fortified", "powder, dry",
)


def _vector(row: dict) -> list[float]:
    return [
        float(row.get(combo_col) or 0.0)
        for combo_col in COMBO_TO_MACRO.keys()
    ]


def _norm(v: list[float]) -> float:
    return sum(x * x for x in v) ** 0.5


def _cosine(a: list[float], b: list[float]) -> float:
    na, nb = _norm(a), _norm(b)
    if na == 0 or nb == 0:
        return 0.0
    return sum(x * y for x, y in zip(a, b)) / (na * nb)


def suggest_ingredients(
    canonical_per100g: dict,
    top_n: int = 25,
    exclude_fragments: tuple = EXCLUDE_FRAGMENTS_DEFAULT,
    min_score: float = 0.5,
) -> list[dict]:
    target_vec = [canonical_per100g.get(k, 0.0) for k in COMBO_TO_MACRO.values()]

    cols = list(COMBO_TO_MACRO.keys()) + ["NDB_NO", "Long_Desc"]
    sql = f"SELECT {', '.join(cols)} FROM DataCentralCombo"

    candidates: list[dict] = []
    with sqlite3.connect(str(COMBOO_DB)) as conn:
        conn.row_factory = sqlite3.Row
        for row in conn.execute(sql):
            desc = (row["Long_Desc"] or "").lower()
            if any(frag in desc for frag in exclude_fragments):
                continue
            vec = _vector({k: row[k] for k in COMBO_TO_MACRO.keys()})
            if _norm(vec) == 0:
                continue
            score = _cosine(target_vec, vec)
            if score < min_score:
                continue
            macros = {COMBO_TO_MACRO[k]: float(row[k] or 0.0) for k in COMBO_TO_MACRO}
            candidates.append({
                "ndb_no": row["NDB_NO"],
                "long_desc": row["Long_Desc"],
                "score": round(score, 4),
                "per100g": macros,
            })

    candidates.sort(key=lambda c: c["score"], reverse=True)
    return candidates[:top_n]


def format_suggestions_table(suggestions: list[dict]) -> str:
    rows = ["score   NDB     description (cal/pro/fat/carb)"]
    rows.append("-" * 80)
    for s in suggestions:
        m = s["per100g"]
        rows.append(
            f"{s['score']:.3f}  {s['ndb_no']:>5}  {s['long_desc'][:48]:48}  "
            f"({m['cal']:.0f}/{m['pro']:.1f}/{m['fat']:.1f}/{m['carb']:.1f})"
        )
    return "\n".join(rows)
