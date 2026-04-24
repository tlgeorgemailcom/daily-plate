"""Status state machine: draft -> built -> reviewed -> approved -> published.

Each transition has a gate. Gates can be skipped with force=True.
"""
from __future__ import annotations

import json
from pathlib import Path
from typing import Callable

from .data import DELTAS_DIR, SNAPSHOTS_DIR, RecipeMeta

STATES = ["draft", "built", "reviewed", "approved", "published"]
TRANSITIONS = {
    "draft": ["built"],
    "built": ["reviewed"],
    "reviewed": ["approved"],
    "approved": ["published", "reviewed"],  # demote allowed without force
    "published": ["approved"],              # demote allowed without force
}


def _gate_built(meta: RecipeMeta) -> tuple[bool, str]:
    p = DELTAS_DIR / f"{meta.recipe_id}.json"
    if not p.exists():
        return False, f"missing delta report at {p}"
    return True, "delta report exists"


def _gate_reviewed(meta: RecipeMeta) -> tuple[bool, str]:
    p = DELTAS_DIR / f"{meta.recipe_id}.json"
    if not p.exists():
        return False, f"missing delta report at {p}"
    payload = json.loads(p.read_text())
    if not payload.get("deltas"):
        return False, "delta report is empty"
    return True, "delta report present and non-empty"


def _gate_approved(meta: RecipeMeta) -> tuple[bool, str]:
    p = DELTAS_DIR / f"{meta.recipe_id}.json"
    if not p.exists():
        return False, f"missing delta report at {p}"
    payload = json.loads(p.read_text())
    summary = payload.get("summary", {})
    majors = summary.get("majors", [])
    if majors:
        return False, f"major deltas remain (use --force to override): {majors}"
    if not meta.fingerprint:
        return False, "fingerprint not yet computed (run pipeline build first)"
    return True, "no major deltas; fingerprint set"


def _gate_published(meta: RecipeMeta) -> tuple[bool, str]:
    snap = SNAPSHOTS_DIR / f"{meta.recipe_id}.json"
    if not snap.exists():
        return False, f"missing snapshot at {snap} (run --snapshot first)"
    if not meta.fingerprint:
        return False, "fingerprint not set"
    return True, "snapshot exists; fingerprint set"


GATES: dict[str, Callable[[RecipeMeta], tuple[bool, str]]] = {
    "built": _gate_built,
    "reviewed": _gate_reviewed,
    "approved": _gate_approved,
    "published": _gate_published,
}


def can_transition(meta: RecipeMeta, target: str) -> tuple[bool, str]:
    if target not in STATES:
        return False, f"unknown state: {target!r}"
    allowed = TRANSITIONS.get(meta.status, [])
    if target not in allowed:
        return False, (
            f"transition {meta.status!r} -> {target!r} not allowed "
            f"(allowed from {meta.status!r}: {allowed})"
        )
    gate = GATES.get(target)
    if not gate:
        return True, "no gate defined"
    return gate(meta)


def transition(meta: RecipeMeta, target: str, force: bool = False) -> tuple[bool, str]:
    ok, reason = can_transition(meta, target)
    if not ok and not force:
        return False, reason
    meta.status = target
    note = reason if ok else f"FORCED: {reason}"
    return True, note
