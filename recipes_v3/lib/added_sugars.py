"""Added vs intrinsic sugar classification for v3.

Ported from scripts/added-sugar-rules.mjs.

Lookup priority:
  1. Explicit ingredient row override (ingredient_key starts with 'sugar_'
     or section == 'sweetener' implies all_added — minor heuristic)
  2. ADDED_SUGAR_RULES NDB lookup
  3. Long_Desc text heuristic (estimated=True)
  4. Default: none_added (estimated=True)

Returned policy for each ingredient is consumed by build.py to split the
ingredient's sugar contribution into AddedSugars and IntrinsicSugars.
"""
from __future__ import annotations

from typing import Literal, TypedDict


class SugarPolicy(TypedDict, total=False):
    policy: Literal["all_added", "none_added", "partial"]
    ratio: float  # only for 'partial'
    reason: str


# NDB-keyed canonical lookup table. Source of truth.
ADDED_SUGAR_RULES: dict[str, SugarPolicy] = {
    # Pure sugars
    "19335": {"policy": "all_added", "reason": "Sugars, granulated"},
    "19334": {"policy": "all_added", "reason": "Sugars, brown"},
    "19336": {"policy": "all_added", "reason": "Sugars, powdered"},
    "19340": {"policy": "all_added", "reason": "Sugars, maple"},
    "19908": {"policy": "all_added", "reason": "Sugar, turbinado"},
    "19906": {"policy": "all_added", "reason": "Sweetener for baking, brown"},
    "19907": {"policy": "all_added", "reason": "Sweetener for baking"},
    "19909": {"policy": "all_added", "reason": "Sweetener, sugar substitute, granulated brown"},
    "43216": {"policy": "all_added", "reason": "Sweeteners, tabletop fructose, dry"},
    "44018": {"policy": "all_added", "reason": "Sweeteners, tabletop fructose, liquid"},
    # Honey / Molasses / Agave
    "19296": {"policy": "all_added", "reason": "Honey"},
    "19304": {"policy": "all_added", "reason": "Molasses"},
    "19912": {"policy": "all_added", "reason": "Sweetener, syrup, agave"},
    # Maple syrups
    "19353": {"policy": "all_added", "reason": "Syrups, maple"},
    "19911": {"policy": "all_added", "reason": "Syrup, maple, Canadian"},
    "90480": {"policy": "all_added", "reason": "Syrup, Cane"},
    # Corn syrups
    "19349": {"policy": "all_added", "reason": "Syrups, corn, dark"},
    "19350": {"policy": "all_added", "reason": "Syrups, corn, light"},
    "19351": {"policy": "all_added", "reason": "Syrups, corn, HFCS"},
    # Pancake / table blends
    "19129": {"policy": "all_added", "reason": "Syrups, table blends, pancake"},
    "19128": {"policy": "all_added", "reason": "Syrups, table blends, pancake, reduced-calorie"},
    "19360": {"policy": "all_added", "reason": "Syrups, table blends, pancake, with 2% maple"},
    "19720": {"policy": "all_added", "reason": "Syrups, table blends, pancake, with 2% maple, added K"},
    "19113": {"policy": "all_added", "reason": "Syrups, table blends, pancake, with butter"},
    "19361": {"policy": "all_added", "reason": "Syrups, table blends, cane and 15% maple"},
    "19362": {"policy": "all_added", "reason": "Syrups, table blends, corn refiner & sugar"},
    # Other syrups
    "19352": {"policy": "all_added", "reason": "Syrups, malt"},
    "19355": {"policy": "all_added", "reason": "Syrups, sorghum"},
    "42040": {"policy": "all_added", "reason": "Syrups, grenadine"},
    "19018": {"policy": "all_added", "reason": "Fruit syrup"},
    "19030": {"policy": "all_added", "reason": "Syrup, fruit flavored"},
    # Chocolate / caramel syrups
    "14181": {"policy": "all_added", "reason": "Beverages, Chocolate syrup"},
    "19924": {"policy": "all_added", "reason": "Syrup, NESTLE chocolate"},
    "19348": {"policy": "all_added", "reason": "Syrups, chocolate, fudge-type"},
    # Jam / jelly / preserves
    "43344": {"policy": "partial", "ratio": 0.5, "reason": "Jams/preserves, reduced sugar"},
    "44110": {"policy": "all_added", "reason": "Jellies, reduced sugar, home preserved"},
    "9310":  {"policy": "partial", "ratio": 0.7, "reason": "Rhubarb, frozen, cooked with sugar"},
    # Whole raw fruits
    "9003":  {"policy": "none_added", "reason": "Apples, raw, with skin"},
    "9004":  {"policy": "none_added", "reason": "Apples, raw, without skin"},
    "9005":  {"policy": "none_added", "reason": "Apples, raw, without skin, boiled"},
    "9006":  {"policy": "none_added", "reason": "Apples, raw, without skin, microwave"},
    "9500":  {"policy": "none_added", "reason": "Apples, raw, red delicious"},
    "9501":  {"policy": "none_added", "reason": "Apples, raw, golden delicious"},
    "9502":  {"policy": "none_added", "reason": "Apples, raw, granny smith"},
    "9503":  {"policy": "none_added", "reason": "Apples, raw, gala"},
    "9504":  {"policy": "none_added", "reason": "Apples, raw, fuji"},
    "9040":  {"policy": "none_added", "reason": "Bananas, raw"},
    "9050":  {"policy": "none_added", "reason": "Blueberries, raw"},
    "9316":  {"policy": "none_added", "reason": "Strawberries, raw"},
    "9131":  {"policy": "none_added", "reason": "Grapes, american type"},
    "9132":  {"policy": "none_added", "reason": "Grapes, red or green"},
    "9152":  {"policy": "none_added", "reason": "Lemon juice, raw"},
    "9200":  {"policy": "none_added", "reason": "Oranges, raw, navels"},
    "9201":  {"policy": "none_added", "reason": "Oranges, raw, all"},
    "9089":  {"policy": "none_added", "reason": "Dates, medjool"},
    "9087":  {"policy": "none_added", "reason": "Dates, deglet noor"},
    "9094":  {"policy": "none_added", "reason": "Figs, raw"},
    "9270":  {"policy": "none_added", "reason": "Pineapple, canned, heavy syrup — intrinsic only"},
    # Plain dairy
    "1077":  {"policy": "none_added", "reason": "Milk, whole"},
    "1082":  {"policy": "none_added", "reason": "Milk, lowfat"},
    "1085":  {"policy": "none_added", "reason": "Milk, nonfat"},
    "1080":  {"policy": "none_added", "reason": "Milk, reduced fat"},
    "1093":  {"policy": "none_added", "reason": "Milk, whole, dry"},
    "1097":  {"policy": "none_added", "reason": "Milk, nonfat, dry"},
    "1116":  {"policy": "none_added", "reason": "Yogurt, plain, whole milk"},
    "1117":  {"policy": "none_added", "reason": "Yogurt, plain, low fat"},
    "1118":  {"policy": "none_added", "reason": "Yogurt, plain, nonfat"},
    "1145":  {"policy": "none_added", "reason": "Butter, without salt"},
    "1001":  {"policy": "none_added", "reason": "Butter, salted"},
    # Plain grains / starches / vegetables
    "20581": {"policy": "none_added", "reason": "Wheat flour, white, AP, enriched"},
    "20080": {"policy": "none_added", "reason": "Wheat flour, white, AP, unenriched"},
    "20027": {"policy": "none_added", "reason": "Cornstarch"},
    "11124": {"policy": "none_added", "reason": "Carrots, raw"},
    "11457": {"policy": "none_added", "reason": "Spinach, raw"},
    "11253": {"policy": "none_added", "reason": "Lettuce, raw"},
    # Neutral
    "2047":  {"policy": "none_added", "reason": "Salt, table"},
    "4031":  {"policy": "none_added", "reason": "Shortening"},
    "14411": {"policy": "none_added", "reason": "Water, tap, drinking"},
    "2010":  {"policy": "none_added", "reason": "Spices, cinnamon"},
    "2011":  {"policy": "none_added", "reason": "Spices, cloves"},
    "2001":  {"policy": "none_added", "reason": "Spices, allspice"},
    # Candied / sweetened fruit
    "9426":  {"policy": "all_added", "reason": "Candied fruit"},
    "9079":  {"policy": "all_added", "reason": "Cranberries, dried, sweetened"},
    "9328":  {"policy": "all_added", "reason": "Maraschino cherries"},
    # Sweetened coconut
    "12179": {"policy": "all_added", "reason": "Coconut, dried, sweetened, shredded"},
    "12109": {"policy": "all_added", "reason": "Coconut, dried, sweetened, flaked"},
    # Chocolate / confectionery
    "19080": {"policy": "all_added", "reason": "Candies, semisweet chocolate"},
    "18166": {"policy": "all_added", "reason": "Cookies, chocolate sandwich w/ creme"},
    "18173": {"policy": "all_added", "reason": "Cookies, graham crackers"},
    # Vanilla extract
    "2050":  {"policy": "none_added", "reason": "Vanilla extract"},
    # Dried fruit
    "9298":  {"policy": "none_added", "reason": "Raisins, seedless"},
    "9297":  {"policy": "none_added", "reason": "Raisins, golden seedless"},
    "9085":  {"policy": "none_added", "reason": "Currants, zante, dried"},
    "9421":  {"policy": "none_added", "reason": "Dates, medjool"},
    "9032":  {"policy": "none_added", "reason": "Apricots, dried, sulfured"},
    "9354":  {"policy": "none_added", "reason": "Pineapple, canned, juice pack, drained"},
    # Raw / plain fruit
    "9063":  {"policy": "none_added", "reason": "Cherries, sour, red, raw"},
    "9236":  {"policy": "none_added", "reason": "Peaches, yellow, raw"},
    "9156":  {"policy": "none_added", "reason": "Lemon peel, raw"},
    # Plain dairy extras
    "1096":  {"policy": "none_added", "reason": "Milk, evaporated, plain"},
    "1230":  {"policy": "none_added", "reason": "Buttermilk, fluid, whole"},
    "1049":  {"policy": "none_added", "reason": "Cream, half and half"},
    "1053":  {"policy": "none_added", "reason": "Cream, heavy whipping"},
    "1017":  {"policy": "none_added", "reason": "Cheese, cream"},
    "1056":  {"policy": "none_added", "reason": "Cream, sour"},
    # Peanut butter
    "16098": {"policy": "none_added", "reason": "Peanut butter, smooth, salted"},
    # Nuts
    "12142": {"policy": "none_added", "reason": "Pecans"},
    # Spices
    "2021":  {"policy": "none_added", "reason": "Ginger, ground"},
    "2025":  {"policy": "none_added", "reason": "Nutmeg, ground"},
    "2035":  {"policy": "none_added", "reason": "Pumpkin pie spice"},
    # Vegetables
    "11424": {"policy": "none_added", "reason": "Pumpkin, canned"},
    # Grain products
    "18079": {"policy": "none_added", "reason": "Bread crumbs, dry, plain"},
    # Cocoa
    "19165": {"policy": "none_added", "reason": "Cocoa, dry, unsweetened"},
    # Eggs
    "1123":  {"policy": "none_added", "reason": "Egg, whole, raw"},
    "1124":  {"policy": "none_added", "reason": "Egg, white, raw"},
    "1125":  {"policy": "none_added", "reason": "Egg, yolk, raw"},
    # Oats / grain
    "8120":  {"policy": "none_added", "reason": "Oats, regular and quick"},
    "20084": {"policy": "none_added", "reason": "Wheat flour, white, cake"},
    "18211": {"policy": "none_added", "reason": "Puff pastry, baked"},
    # Baking agents
    "18370": {"policy": "none_added", "reason": "Baking powder"},
    "18372": {"policy": "none_added", "reason": "Baking soda"},
    "18373": {"policy": "none_added", "reason": "Cream of tartar"},
    # Fats / oils
    "4610":  {"policy": "none_added", "reason": "Margarine, regular"},
    # Beverages
    "14106": {"policy": "none_added", "reason": "Wine, table, white"},
    # Coconut products
    "12118": {"policy": "none_added", "reason": "Coconut milk, canned, no added sugar"},
}


# Heuristic keyword sets for fallback Long_Desc text matching.
_ADDED_KEYWORDS = (
    "sugar", "syrup", "honey", "molasses", "agave", "glucose", "sucrose",
    "fructose", "candy", "candies", "chocolate chip", "sweetened",
)
_NONE_ADDED_KEYWORDS = (
    "raw", "fresh", "plain", "unsweetened", "dried", "frozen, unsweetened",
    "without added", "no sugar", "uncooked",
)


def classify(ndb_no: str, long_desc: str = "") -> tuple[SugarPolicy, bool]:
    """Return (policy_dict, is_estimated).

    is_estimated=True when policy comes from heuristic OR default fallback.
    """
    ndb = str(ndb_no or "").lstrip("0") or str(ndb_no or "")
    # Try both with and without leading zeros
    for key in (ndb, str(ndb_no), str(ndb_no).lstrip("0")):
        if key in ADDED_SUGAR_RULES:
            return ADDED_SUGAR_RULES[key], False

    desc = (long_desc or "").lower()
    if desc:
        for kw in _ADDED_KEYWORDS:
            if kw in desc:
                return {"policy": "all_added", "reason": f"heuristic: '{kw}' in Long_Desc"}, True
        for kw in _NONE_ADDED_KEYWORDS:
            if kw in desc:
                return {"policy": "none_added", "reason": f"heuristic: '{kw}' in Long_Desc"}, True

    return {"policy": "none_added", "reason": "default fallback"}, True


def split_sugar(sugar_g: float, policy: SugarPolicy) -> tuple[float, float]:
    """Return (added_g, intrinsic_g) per the policy."""
    p = policy.get("policy", "none_added")
    if p == "all_added":
        return sugar_g, 0.0
    if p == "none_added":
        return 0.0, sugar_g
    # partial
    ratio = float(policy.get("ratio", 0.5))
    return sugar_g * ratio, sugar_g * (1.0 - ratio)
