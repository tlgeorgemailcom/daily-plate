"""Verified USDA cooking-yield profiles for ingredient-specific fill classes."""
from __future__ import annotations

from dataclasses import dataclass


@dataclass(frozen=True)
class UsdaYieldProfile:
    fill_class: str
    source_ndb_no: str
    cooking_yield_percent: float
    moisture_change_percent: float | None = None
    fat_change_percent: float | None = None


USDA_YIELD_PROFILE_CATALOG: tuple[UsdaYieldProfile, ...] = (
    # Beef ground profiles; USDA cooking-yield table, 2002/2003.
    UsdaYieldProfile("beef_ground_crumbles_low_fat", "23565", 69.0, -29.6, -1.4),
    UsdaYieldProfile("beef_ground_crumbles_medium_fat", "23575", 67.0, -27.8, -5.3),
    UsdaYieldProfile("beef_ground_crumbles_high_fat", "13494", 62.0, -25.0, -12.6),
    UsdaYieldProfile("beef_ground_patty_low_fat", "23564", 77.0, -21.3, -1.4),
    UsdaYieldProfile("beef_ground_patty_medium_fat", "23574", 73.0, -20.8, -6.2),
    UsdaYieldProfile("beef_ground_patty_high_fat", "13496", 69.0, -18.2, -12.4),

    # Beef cuts; USDA cooking-yield table, 2000/2003/2010/2011.
    UsdaYieldProfile("beef_flank_steak_boneless_pan_grilled", "13948", 81.0, -22.6, -1.0),
    UsdaYieldProfile("beef_inside_skirt_steak_boneless_grilled", "23214", 73.0, -30.0, -2.3),
    UsdaYieldProfile("beef_skirt_steak_boneless_pan_grilled", "23221", 68.0, -29.5, -4.2),
    UsdaYieldProfile("beef_ribeye_steak_boneless_pan_grilled", "23227", 82.0, -20.1, -2.0),
    UsdaYieldProfile("beef_tenderloin_steak_boneless_pan_grilled", "13918", 80.0, -21.3, -5.9),
    UsdaYieldProfile("beef_top_round_steak_boneless_grilled", "13893", 72.0, -28.4, -1.8),
    UsdaYieldProfile("beef_round_steak_boneless_pan_grilled", "13893", 72.0, -28.4, -1.8),
    UsdaYieldProfile("beef_top_loin_steak_boneless_grilled", "13910", 82.0, -24.8, -4.0),
    UsdaYieldProfile("beef_strip_steak_boneless_pan_grilled", "13910", 82.0, -24.8, -4.0),
    # Calculated composites using USDA strip (NDB 13910) and tenderloin
    # (NDB 13918) profiles; 17.5% bone is excluded before edible weighting.
    UsdaYieldProfile("beef_t_bone_steak_bone_in_pan_grilled", "13907", 81.8181818182, -24.5090909091, -4.1727272727),
    # Porterhouse uses a larger tenderloin component: 3:1 strip:tenderloin.
    UsdaYieldProfile("beef_porterhouse_steak_bone_in_pan_grilled", "13905", 81.5, -23.925, -4.475),
    UsdaYieldProfile("beef_top_sirloin_steak_boneless_pan_grilled", "13930", 80.0, -25.2, -2.7),
    UsdaYieldProfile("beef_shoulder_steak_boneless_grilled", "23554", 78.0, -28.4, -0.3),
    UsdaYieldProfile("beef_mock_tender_steak_boneless_braised", "23119", 71.0, -37.1, 1.7),
    UsdaYieldProfile("beef_shoulder_clod_tender_medallion_boneless_grilled", "23054", 77.0, -22.2, -0.7),
    UsdaYieldProfile("beef_shoulder_clod_top_center_steak_boneless_grilled", "23058", 76.0, -22.9, -0.02),
    UsdaYieldProfile("beef_top_blade_steak_boneless_grilled", "23060", 76.0, -23.2, -0.8),
    UsdaYieldProfile("beef_flat_iron_steak_boneless_pan_grilled", "23060", 76.0, -23.2, -0.8),
    UsdaYieldProfile("beef_denver_steak_boneless_grilled", "23105", 71.0, -26.3, -2.1),
    UsdaYieldProfile("beef_underblade_pot_roast_boneless_braised", "23099", 64.0, -34.8, -0.8),
    UsdaYieldProfile("beef_underblade_steak_boneless_braised", "23116", 65.0, -35.4, -2.8),
    UsdaYieldProfile("beef_tri_tip_roast_boneless_roasted", "13953", 84.0, -22.4, -0.1),
    UsdaYieldProfile("beef_tri_tip_roast_lean_only_roasted", "13985", 84.0, -25.3, 0.4),
    UsdaYieldProfile("beef_chuck_eye_roast_boneless_roasted", "23113", 80.0, -24.9, -0.4),
    UsdaYieldProfile("beef_round_tip_roast_boneless_roasted", "13421", 85.0, -24.7, -1.0),
    UsdaYieldProfile("beef_bottom_round_roast_boneless_roasted", "13870", 84.0, -20.6, -2.8),
    UsdaYieldProfile("beef_shoulder_pot_roast_boneless_braised", "23131", 66.0, -37.3, 0.3),
    UsdaYieldProfile("beef_rib_eye_roast_bone_in_roasted", "23191", 77.0, -17.6, -1.7),
    UsdaYieldProfile("beef_rib_eye_roast_boneless_roasted", "23198", 76.0, -21.8, -2.6),
    UsdaYieldProfile("beef_eye_of_round_roast_boneless_roasted", "13878", 81.0, -23.9, -1.2),
    UsdaYieldProfile("beef_pot_roast_boneless_braised", "13373", 71.0, -36.1, -8.3),
    UsdaYieldProfile("beef_short_ribs_boneless_braised", "23125", 66.0, -31.3, -4.2),

    # Pork profiles; USDA cooking-yield table, 2003/2011.
    UsdaYieldProfile("pork_sausage_high_fat_pan_fried", "7064", 80.0, -16.2, -3.9),
    UsdaYieldProfile("bacon_pan_fried", "10862", 31.0, -35.9, -33.8),
    UsdaYieldProfile("pork_chop_bone_in_pan_grilled", "10178", 82.0, -20.0, 1.3),
    UsdaYieldProfile("pork_cured_ham_boneless_roasted", "10883", 94.0, -6.1, -0.3),
    UsdaYieldProfile("pork_blade_roast_bone_in_roasted", "10031", 77.0, -22.2, 0.6),
    UsdaYieldProfile("pork_blade_roast_boneless_roasted", "10990", 75.0, -22.4, -0.2),
    UsdaYieldProfile("pork_center_loin_roast_bone_in_roasted", "10039", 77.0, -23.3, 0.9),
    UsdaYieldProfile("pork_center_rib_roast_bone_in_roasted", "10047", 75.0, -24.7, -0.1),
    UsdaYieldProfile("pork_tenderloin_lean_only_roasted", "10061", 80.0, -20.7, 0.5),
    UsdaYieldProfile("pork_top_loin_roast_lean_only_roasted", "10069", 79.0, -21.3, 0.9),
    UsdaYieldProfile("pork_country_style_ribs_boneless_braised", "10208", 71.0, -33.1, 4.4),
    UsdaYieldProfile("pork_back_ribs_bone_in_roasted", "10193", 82.0, -18.5, 1.3),
    UsdaYieldProfile("pork_back_ribs_bone_in_lean_only_roasted", "10981", 82.0, -21.0, 4.7),
    UsdaYieldProfile("pork_spareribs_bone_in_roasted", "10940", 76.0, -22.9, 0.2),
    UsdaYieldProfile("pork_leg_sirloin_tip_roast_boneless_braised", "10962", 79.0, -21.5, 0.01),
    UsdaYieldProfile("pork_sirloin_chop_bone_in_braised", "10053", 73.0, -27.0, 0.1),
    UsdaYieldProfile("pork_sirloin_chop_bone_in_lean_only_braised", "10057", 74.0, -28.0, 0.7),
    UsdaYieldProfile("pork_sirloin_chop_boneless_braised", "10211", 76.0, -22.7, 0.1),
    UsdaYieldProfile("pork_sirloin_chop_boneless_lean_only_braised", "10215", 75.0, -24.8, 0.7),
    UsdaYieldProfile("pork_blade_roast_bone_in_lean_only_roasted", "10035", 77.0, -24.7, 3.3),
    UsdaYieldProfile("pork_blade_roast_boneless_lean_only_roasted", "10983", 75.0, -24.2, 1.6),
    UsdaYieldProfile("pork_center_loin_roast_bone_in_lean_only_roasted", "10043", 77.0, -24.2, 2.3),
    UsdaYieldProfile("pork_center_rib_roast_bone_in_lean_only_roasted", "10051", 74.0, -27.1, 2.3),
    UsdaYieldProfile("pork_blade_chop_boneless_lean_only_pan_grilled", "10984", 79.0, -21.3, 1.5),
    UsdaYieldProfile("pork_chop_boneless_pan_grilled", "10212", 79.0, -23.2, 0.1),
    UsdaYieldProfile("pork_leg_rump_half_lean_only_roasted", "10015", 73.0, -26.9, 0.4),
    UsdaYieldProfile("pork_leg_shank_half_lean_only_roasted", "10019", 73.0, -27.5, 1.3),
    UsdaYieldProfile("pork_blade_chop_bone_in_braised", "10029", 78.0, -27.8, 6.5),
    UsdaYieldProfile("pork_blade_chop_bone_in_pan_grilled", "10030", 83.0, -16.3, -0.3),
    UsdaYieldProfile("pork_center_loin_chop_bone_in_braised", "10037", 74.0, -21.5, 2.2),
    UsdaYieldProfile("pork_center_loin_chop_bone_in_lean_only_braised", "10041", 73.0, -28.0, 1.9),
    UsdaYieldProfile("pork_center_loin_chop_bone_in_lean_only_pan_grilled", "10042", 82.0, -20.4, 2.3),
    UsdaYieldProfile("pork_ground_crumbles_high_fat", "10974", 66.0, -27.9, -6.5),
    UsdaYieldProfile("pork_ground_crumbles_low_fat", "10976", 68.0, -31.7, -0.2),
    UsdaYieldProfile("pork_ground_crumbles_medium_fat", "10975", 67.0, -30.3, -1.8),
    UsdaYieldProfile("pork_ground_patty_high_fat", "10977", 69.0, -25.3, -6.6),
    UsdaYieldProfile("pork_ground_patty_low_fat", "10979", 68.0, -32.7, 0.2),
    UsdaYieldProfile("pork_ground_patty_medium_fat", "10978", 68.0, -26.7, -1.9),

    # Chicken wing, meat and skin; nutrient-derived from raw NDB 5100 and
    # cooked NDBs 5101 (fried, batter), 5102 (fried, flour), 5103 (roasted),
    # and 5104 (stewed), respectively.
    UsdaYieldProfile("chicken_wing_dark_fried_batter", "5100", 88.173125, -28.445199, 6.380559),
    UsdaYieldProfile("chicken_wing_dark_fried_flour", "5100", 67.100728, -36.565626, 2.019521),
    UsdaYieldProfile("chicken_wing_dark_roasted", "5100", 73.644388, -25.445233, -0.426192),
    UsdaYieldProfile("chicken_wing_dark_stewed", "5100", 76.909570, -21.367629, 0.086190),

    # Chicken wing, meat only; nutrient-derived from raw NDB 5105 and cooked
    # NDBs 5106 (fried, flour), 5107 (roasted), and 5108 (stewed), respectively.
    UsdaYieldProfile("chicken_wing_dark_fried", "5105", 72.868988, -31.352484, 3.127512),
    UsdaYieldProfile("chicken_wing_dark_roasted_meat_only", "5105", 72.127380, -29.668431, 2.323956),
    UsdaYieldProfile("chicken_wing_dark_stewed_meat_only", "5105", 80.831494, -20.784816, 2.263701),

    # Chicken gizzard and liver; USDA Cooking Yield Data values from the 2003
    # variety meats study. Moisture and fat changes are published table values.
    UsdaYieldProfile("chicken_gizzard_stewed", "5023", 55.0, -41.9, -0.6),
    UsdaYieldProfile("chicken_liver_pan_grilled", "5027", 62.0, -35.8, -0.8),
    UsdaYieldProfile("turkey_gizzard_stewed", "5174", 85.0, -14.3, -1.3),
    UsdaYieldProfile("turkey_heart_stewed", "5176", 76.0, -21.7, -1.3),
    UsdaYieldProfile("turkey_liver_stewed", "5178", 83.0, -15.2, 0.6),
    UsdaYieldProfile("veal_liver_braised", "17203", 69.0, -29.6, -0.5),
    UsdaYieldProfile("veal_liver_pan_grilled", "17204", 68.0, -30.4, -0.5),
    UsdaYieldProfile("pork_chitterlings_stewed", "10099", 39.0, -49.9, -8.8),
    UsdaYieldProfile("pork_feet_stewed", "10173", 36.0, -42.6, -6.9),
    UsdaYieldProfile("pork_stomach_stewed", "10863", 69.0, -24.8, -5.1),
    UsdaYieldProfile("beef_brain_stewed", "13320", 85.0, -12.8, -1.4),
    UsdaYieldProfile("beef_heart_stewed", "13322", 57.0, -40.0, -1.3),
    UsdaYieldProfile("beef_kidneys_stewed", "13324", 53.0, -42.7, -0.6),
    UsdaYieldProfile("beef_liver_braised", "13326", 68.0, -30.6, -0.04),
    UsdaYieldProfile("beef_liver_pan_grilled", "13327", 73.0, -25.7, -0.2),
    UsdaYieldProfile("beef_tripe_stewed", "23640", 70.0, -27.3, -0.9),
    # Turkey whole, meat and skin; protein-conservation derivation from raw NDB
    # 5165 and cooked NDB 5166 in DataCentralCombo.
    UsdaYieldProfile("turkey_whole_meat_and_skin_roasted", "5165", 75.796847635727, -33.765087882496, -0.684626945386),
    # Turkey whole, meat only; protein-conservation derivation from raw NDB
    # 5167 and cooked NDB 5168 in DataCentralCombo.
    UsdaYieldProfile("turkey_whole_meat_only_roasted", "5167", 77.907777013076, -31.054149837174, 55.008219549333),
    # Turkey from whole, light meat and skin; protein-conservation derivation
    # from raw NDB 5181 and cooked NDB 5182 in DataCentralCombo.
    UsdaYieldProfile("turkey_light_meat_and_skin_roasted", "5181", 74.314720812183, -31.878172588832, -44.288964344030),
    # Turkey from whole, light meat only; protein-conservation derivation from
    # raw NDB 5185 and cooked NDB 5186 in DataCentralCombo.
    UsdaYieldProfile("turkey_light_meat_only_roasted", "5185", 78.526385662131, -28.823994408527, 10.361406876508),
    # Turkey dark meat and skin; protein-conservation derivation from raw NDB
    # 5183 and cooked NDB 5184 in DataCentralCombo.
    UsdaYieldProfile("turkey_dark_meat_and_skin_roasted", "5183", 72.643931059773, -37.001057817924, -19.419496762014),
    # Turkey from whole, dark meat only; protein-conservation derivation from
    # raw NDB 5187 and cooked NDB 5188 in DataCentralCombo.
    UsdaYieldProfile("turkey_dark_meat_only_roasted", "5187", 76.795380728979, -34.096004671079, 85.537639841213),
    # Ground turkey, 93% lean and 7% fat; protein-conservation derivation
    # from raw NDB 5665 and cooked NDB 5666 (pan-broiled crumbles).
    UsdaYieldProfile("turkey_ground_crumbles_pan_broiled", "5665", 69.114391143911, -41.905086337109, -3.869671790243),
    # Ground turkey, 93% lean and 7% fat; protein-conservation derivation
    # from raw NDB 5665 and cooked NDB 5667 (patties, broiled).
    UsdaYieldProfile("turkey_ground_patty_broiled", "5665", 72.428460943542, -37.753207598845, -0.562844338063),
    # Ground turkey, 85% lean and 15% fat; protein-conservation derivation
    # from raw NDB 5668 and cooked NDB 5669 (pan-broiled crumbles).
    UsdaYieldProfile("turkey_ground_85_15_crumbles_pan_broiled", "5668", 67.303863002788, -45.319230316347, -6.343508022437),
    # Ground turkey, 85% lean and 15% fat; protein-conservation derivation
    # from raw NDB 5668 and cooked NDB 5670 (patties, broiled).
    UsdaYieldProfile("turkey_ground_85_15_patty_broiled", "5668", 65.301391035549, -45.457326816451, -15.639351293789),
    # Turkey breast, meat and skin; protein-conservation derivation from raw
    # NDB 5191 and cooked NDB 5192 in DataCentralCombo.
    UsdaYieldProfile("turkey_breast_meat_and_skin_roasted", "5191", 76.245210727969, -31.188833372988, -19.518944231588),
    # Turkey leg, meat and skin; protein-conservation derivation from raw NDB
    # 5193 and cooked NDB 5194 in DataCentralCombo.
    UsdaYieldProfile("turkey_leg_meat_and_skin_roasted", "5193", 70.111230714029, -40.980792304423, 2.454209168418),
    # Turkey wing, meat and skin; protein-conservation derivation from raw NDB
    # 5195 and cooked NDB 5196 in DataCentralCombo.
    UsdaYieldProfile("turkey_wing_meat_and_skin_roasted", "5195", 73.849525200877, -33.925278174159, -25.491104038401),

    # Lamb domestic, separable lean and fat; protein-conservation derivations
    # from DataCentralCombo raw/cooked pairs.
    UsdaYieldProfile("lamb_foreshank_meat_and_fat_braised", "17007", 66.654917166020, -43.500980524848, -32.946548202195),
    UsdaYieldProfile("lamb_leg_shank_half_meat_and_fat_roasted", "17015", 70.352139341159, -36.466268089405, -35.071598606566),
    UsdaYieldProfile("lamb_leg_sirloin_half_meat_and_fat_roasted", "17019", 68.777913114089, -38.259561577685, -35.701516776653),
    UsdaYieldProfile("lamb_loin_meat_and_fat_broiled", "17023", 64.839094159714, -40.870873814033, -43.804495185648),
    UsdaYieldProfile("lamb_loin_meat_and_fat_roasted", "17023", 72.372505543237, -32.810671246331, -35.889320098950),
    UsdaYieldProfile("lamb_shoulder_meat_and_fat_braised", "17035", 57.810320781032, -57.435632850584, -33.834807684180),
    UsdaYieldProfile("lamb_shoulder_meat_and_fat_roasted", "17035", 73.656152820968, -32.498857180197, -31.425950031014),
    UsdaYieldProfile("lamb_stew_cubes_lean_only_braised", "17059", 59.988127040665, -54.256409228416, -0.019788265559),
    UsdaYieldProfile("lamb_new_zealand_leg_chop_bone_in_meat_and_fat_fast_fried", "17072", 76.834295136026, -27.309576961198, -32.478952759250),
    UsdaYieldProfile("lamb_new_zealand_leg_chop_bone_in_lean_only_fast_fried", "17074", 80.197643481566, -27.126391477948, 9.753240540505),
    UsdaYieldProfile("lamb_new_zealand_loin_chop_meat_and_fat_broiled", "17076", 65.727699530516, -41.724289605919, -40.069588973321),
    UsdaYieldProfile("lamb_new_zealand_loin_chop_lean_only_broiled", "17078", 68.167860798362, -41.895013890920, -18.357096950799),
    UsdaYieldProfile("lamb_new_zealand_partly_frenched_rack_meat_and_fat_fast_roasted", "17080", 82.139619220308, -21.942502665123, -18.880473243011),
    UsdaYieldProfile("lamb_new_zealand_partly_frenched_rack_lean_only_fast_roasted", "17082", 84.527220630372, -21.826761786034, 4.358229419380),
    UsdaYieldProfile("lamb_new_zealand_loin_chop_meat_and_fat_fast_fried", "17076", 71.627906976744, -36.895927268862, -25.855954252022),
    UsdaYieldProfile("lamb_australian_sirloin_chop_boneless_meat_and_fat_broiled", "17302", 71.184466019417, -36.172468772598, -31.538166547389),
    UsdaYieldProfile("lamb_australian_sirloin_chop_boneless_lean_only_broiled", "17304", 73.941368078176, -36.083058593693, 17.462865786104),
    UsdaYieldProfile("lamb_australian_frenched_rib_chop_bone_in_meat_and_fat_grilled", "17314", 74.648876404494, -40.085407153522, -6.302180001464),
    UsdaYieldProfile("lamb_australian_frenched_rib_chop_bone_in_lean_only_grilled", "17316", 74.844527363184, -40.181722100338, 56.383556279426),
    UsdaYieldProfile("lamb_new_zealand_fully_frenched_rack_lean_only_fast_roasted", "17397", 84.501845018450, -21.357987125288, -0.544176790082),
    UsdaYieldProfile("lamb_new_zealand_fully_frenched_rack_meat_and_fat_fast_roasted", "17420", 84.380305602716, -21.408477048297, -5.114515788110),

    # Emu; USDA Cooking Yield Data raw/cooked pairs from the 2001 game-meat study.
    UsdaYieldProfile("emu_ground_grilled", "5621", 80.091452690820, -27.646214757285, -7.586785356747),
    UsdaYieldProfile("emu_fan_fillet_broiled", "5623", 71.953949472338, -35.943435225846, 106.867604732971),
    UsdaYieldProfile("emu_full_rump_broiled", "5626", 67.805167805168, -43.056155998289, 10.803566901128),
    UsdaYieldProfile("emu_inside_drum_broiled", "5628", 68.622606547251, -40.945807211913, -7.428564322164),
    UsdaYieldProfile("cornish_game_hen_roasted_meat_and_skin", "5307", 77.009429726089, -33.720836956191, 0.024373417409),
    UsdaYieldProfile("cornish_game_hen_roasted_meat_only", "5309", 86.008583690987, -18.459689248655, -0.044078413177),

    UsdaYieldProfile("veal_top_round_braised", "17094", 58.019911504425, -56.958223404004, 19.242220721756),
    UsdaYieldProfile("veal_top_round_pan_fried_breaded", "17094", 76.877977281055, -47.264585370442, 129.136308909119),
    UsdaYieldProfile("veal_top_round_pan_fried_unbreaded", "17094", 66.078740157480, -48.462116299634, 79.142039063299),
    UsdaYieldProfile("veal_top_round_roasted", "17094", 75.740072202166, -33.069267746482, 14.347836279244),
    UsdaYieldProfile("veal_loin_braised", "17104", 66.478966545214, -50.198216594441, 13.614996449169),
    UsdaYieldProfile("veal_loin_roasted", "17104", 80.927419354839, -29.223470947302, -0.990485953167),
    UsdaYieldProfile("veal_loin_chop_grilled", "17104", 71.576319543509, -36.700723168679, -32.617327778305),
    UsdaYieldProfile("veal_hindshank_braised", "17276", 60.716550412175, -51.265732937498, 8.173164527438),
    UsdaYieldProfile("veal_rib_braised", "17110", 58.156028368794, -56.409543318232, -19.123747451610),
    UsdaYieldProfile("veal_rib_roasted", "17110", 78.714524207012, -33.720489877132, 21.959462589332),
    UsdaYieldProfile("veal_sirloin_braised", "17134", 61.004478566859, -53.735086470311, 2.637496590080),
    UsdaYieldProfile("veal_sirloin_roasted", "17134", 75.855210819411, -33.847077105855, 1.496408842874),
    UsdaYieldProfile("veal_breast_braised", "17271", 64.775676677790, -46.443045513191, -26.353349295828),
    UsdaYieldProfile("veal_ground_broiled", "17142", 76.210008203445, -23.098849037757, -55.884558804131),
    UsdaYieldProfile("veal_ground_pan_fried", "17142", 71.931862175765, -34.906883487560, -35.118121253407),

    # Bison; USDA Cooking Yield Data values from the 2001 alternate red meat study.
    UsdaYieldProfile("bison_chuck_shoulder_braised", "17334", 62.522202486679, -49.915988705256, 7.776368050751),
    UsdaYieldProfile("bison_ground_grilled", "17331", 77.0, -18.2, -4.2),
    UsdaYieldProfile("bison_top_round_grilled", "17337", 77.269715270585, -31.998470898261, 57.719254090034),
    UsdaYieldProfile("deer_ground_grilled", "17344", 83.0, -17.7, -0.1),
    UsdaYieldProfile("elk_ground_grilled", "17339", 84.0, -15.0, -1.5),
    UsdaYieldProfile("game_antelope_roasted", "17144", 75.993209168081, -32.398050369978, -0.048340669084),
    UsdaYieldProfile("game_bear_simmered", "17146", 61.998766193708, -53.370309512724, 0.019695930736),
    UsdaYieldProfile("game_beaver_roasted", "17150", 69.010043041607, -43.679558968498, 0.064562348553),
    UsdaYieldProfile("game_beefalo_roasted", "17152", 75.994781474233, -33.856989145177, 0.059795930821),
    UsdaYieldProfile("game_bison_lean_roasted", "17156", 76.019691983122, -32.166418095970, -0.017580913828),
    UsdaYieldProfile("game_boar_roasted", "17158", 76.007067137809, -33.077317911498, -0.026740657944),
    UsdaYieldProfile("game_buffalo_roasted", "17160", 75.997018263138, -31.463239357766, -0.149903375299),
    UsdaYieldProfile("game_caribou_roasted", "17162", 76.016123614377, -33.580313754967, -0.002598702790),
    UsdaYieldProfile("game_deer_roasted", "17164", 76.001323402185, -32.614293584072, 0.183563590654),
    UsdaYieldProfile("game_elk_roasted", "17166", 76.018548523352, -32.259889236368, -0.389486878417),
    UsdaYieldProfile("game_horse_roasted", "17170", 76.012793176972, -33.040087110940, -0.026652383921),
    UsdaYieldProfile("game_moose_roasted", "17172", 75.982234028014, -31.781932901304, -0.401665993628),
    UsdaYieldProfile("game_muskrat_roasted", "17174", 68.993021269525, -44.706098128865, -0.002707563474),
    UsdaYieldProfile("game_rabbit_domesticated_roasted", "17177", 68.995181700620, -42.573496008550, 0.074093273704),
    UsdaYieldProfile("game_rabbit_domesticated_stewed", "17177", 65.997367583207, -46.690948550678, 0.006820918034),
    UsdaYieldProfile("game_rabbit_wild_stewed", "17180", 65.990308903698, -45.647224781450, -0.161214078464),
    UsdaYieldProfile("game_squirrel_roasted", "17183", 68.995774764056, -41.994205959627, 0.806911355355),
    # Ostrich; USDA Cooking Yield Data raw/cooked pairs from the 2001 game-meat study.
    UsdaYieldProfile("ostrich_ground_grilled", "5641", 77.323135755258, -26.974407318237, -37.163842552911),
    UsdaYieldProfile("ostrich_inside_leg_cooked", "5644", 77.180282661151, -28.935622322660, -12.947820719399),
    UsdaYieldProfile("ostrich_inside_strip_cooked", "5646", 80.660537963909, -27.638274127038, 19.726094678136),
    UsdaYieldProfile("ostrich_outside_strip_cooked", "5649", 81.821366024518, -26.626267635830, 41.799018947469),
    UsdaYieldProfile("ostrich_oyster_cooked", "5651", 74.800416522041, -33.182119332665, -19.085108012942),
    UsdaYieldProfile("ostrich_tip_trimmed_cooked", "5655", 76.693576693577, -30.973765905453, -14.303264303264),
    UsdaYieldProfile("ostrich_top_loin_cooked", "5657", 77.062588904694, -30.505601644672, 1.095667478361),

    # Chicken thigh, meat only; USDA yield table (1975), with moisture and fat
    # changes derived from raw NDB 5096 and cooked NDB 5098.
    UsdaYieldProfile("chicken_thigh_dark_pan_grilled", "5096", 69.0, -30.0, 1.5),

    # Chicken thigh, meat and skin; protein-conservation yield and moisture/fat
    # changes derived from raw NDB 5091 and cooked NDB 5094.
    UsdaYieldProfile("chicken_thigh_dark_roasted", "5091", 71.023216, -22.464015, -6.162485),

    # Chicken thigh, meat and skin; nutrient-derived from raw NDB 5091 and
    # cooked NDB 5092 (fried, batter), NDB 5093 (fried, flour), and NDB 5095
    # (stewed), respectively.
    UsdaYieldProfile("chicken_thigh_dark_fried", "5096", 69.765791, -34.841909, 3.065877),
    UsdaYieldProfile("chicken_thigh_dark_fried_batter", "5091", 76.446090, -27.100264, -3.973461),
    UsdaYieldProfile("chicken_thigh_dark_fried_flour", "5091", 61.757009, -33.034755, -7.358800),
    UsdaYieldProfile("chicken_thigh_dark_stewed", "5091", 71.023216, -21.647248, -6.141178),
    UsdaYieldProfile("chicken_thigh_dark_rotisserie", "5096", 81.712386, -24.013957, 4.941904),
    UsdaYieldProfile("chicken_thigh_dark_rotisserie_meat_and_skin", "5091", 72.045355, -22.997833, -5.298879),

    # Chicken breast, meat and skin; nutrient-derived from raw NDB 5057 and
    # cooked NDBs 5058 (fried, batter), 5059 (fried, flour), 5060 (roasted),
    # 5061 (stewed), and 5348 (rotisserie), respectively.
    UsdaYieldProfile("chicken_breast_light_rotisserie", "5057", 75.873671, -12.907132, -1.733457),
    UsdaYieldProfile("chicken_breast_light_fried_batter", "5057", 83.937198, -12.028295, 1.105230),
    UsdaYieldProfile("chicken_breast_light_fried_flour", "5057", 65.493090, -16.212817, -3.615128),
    UsdaYieldProfile("chicken_breast_light_roasted", "5057", 70.134228, -6.091414, -3.787725),
    UsdaYieldProfile("chicken_breast_light_stewed", "5057", 76.373398, -8.694558, -3.588933),

    # Chicken breast, meat only; nutrient-derived from raw NDB 5062 and
    # cooked NDBs 5063 (fried), 5064 (roasted), 5065 (stewed), and 5342
    # (rotisserie), respectively.
    UsdaYieldProfile("chicken_breast_light_fried", "5062", 67.284689, -33.387889, 0.549109),
    UsdaYieldProfile("chicken_breast_light_roasted_meat_only", "5062", 72.533849, -26.564410, -0.030542),
    UsdaYieldProfile("chicken_breast_light_stewed_meat_only", "5062", 77.639752, -20.895342, -0.267516),
    UsdaYieldProfile("chicken_breast_light_rotisserie_meat_only", "5062", 80.357143, -19.072321, -0.378036),

    # Chicken back, meat and skin; nutrient-derived from raw NDB 5048 and
    # cooked NDBs 5049 (fried, batter), 5050 (fried, flour), 5051 (roasted),
    # 5052 (stewed), and 5347 (rotisserie), respectively.
    UsdaYieldProfile("chicken_back_fried_batter", "5048", 63.950842, -29.635480, -14.728371),
    UsdaYieldProfile("chicken_back_fried_flour", "5048", 50.557755, -35.874811, -18.254322),
    UsdaYieldProfile("chicken_back_roasted", "5048", 54.142582, -29.122890, -17.386301),
    UsdaYieldProfile("chicken_back_stewed", "5048", 63.345356, -19.503674, -17.249152),
    UsdaYieldProfile("chicken_back_rotisserie_meat_and_skin", "5048", 60.482135, -23.963883, -17.496371),

    # Chicken back, meat only; nutrient-derived from raw NDB 5053 and cooked
    # NDBs 5054 (fried), 5055 (roasted), 5056 (stewed), and 5341 (rotisserie),
    # respectively.
    UsdaYieldProfile("chicken_back_fried", "5053", 65.221741, -44.088353, 4.071971),
    UsdaYieldProfile("chicken_back_roasted_meat_only", "5053", 69.386307, -34.545545, 3.211238),
    UsdaYieldProfile("chicken_back_stewed_meat_only", "5053", 77.281707, -25.594678, 2.727823),
    UsdaYieldProfile("chicken_back_rotisserie_meat_only", "5053", 77.190213, -28.038713, 2.987751),

    # Chicken neck, meat and skin; nutrient-derived from raw NDB 5084 and
    # cooked NDBs 5085 (fried, batter), 5086 (fried, flour), and 5087
    # (simmered), respectively.
    UsdaYieldProfile("chicken_neck_fried_batter", "5084", 70.988900, -26.682008, -9.543411),
    UsdaYieldProfile("chicken_neck_fried_flour", "5084", 58.600583, -32.160583, -12.404402),
    UsdaYieldProfile("chicken_neck_simmered", "5084", 71.749108, -15.699276, -13.253412),

    # Chicken neck, meat only; nutrient-derived from raw NDB 5088 and cooked
    # NDBs 5089 (fried) and 5090 (simmered), respectively.
    UsdaYieldProfile("chicken_neck_fried", "5088", 65.314477, -32.823870, -1.020640),
    UsdaYieldProfile("chicken_neck_simmered_meat_only", "5088", 71.457655, -23.257643, -2.934764),

    # Chicken drumstick, meat and skin; nutrient-derived from raw NDB 5066 and
    # cooked NDBs 5067 (fried, batter), 5068 (fried, flour), 5069 (roasted),
    # and 5070 (stewed), respectively.
    UsdaYieldProfile("chicken_drumstick_dark_fried_batter", "5066", 82.369021, -28.993868, 3.773121),
    UsdaYieldProfile("chicken_drumstick_dark_fried_flour", "5066", 67.062315, -34.415549, 0.000950),
    UsdaYieldProfile("chicken_drumstick_dark_roasted", "5066", 77.430407, -21.053953, -1.340814),
    UsdaYieldProfile("chicken_drumstick_dark_stewed", "5066", 71.406003, -25.960411, -1.602401),

    # Chicken drumstick, meat only; nutrient-derived from raw NDB 5071 and
    # cooked NDBs 5072 (fried), 5073 (roasted), and 5074 (stewed), respectively.
    UsdaYieldProfile("chicken_drumstick_dark_fried", "5071", 67.819706, -34.569015, 1.769832),
    UsdaYieldProfile("chicken_drumstick_dark_roasted_meat_only", "5071", 80.074257, -20.784072, 0.854233),
    UsdaYieldProfile("chicken_drumstick_dark_stewed_meat_only", "5071", 70.581818, -29.080807, 0.320222),
    UsdaYieldProfile("chicken_drumstick_dark_rotisserie", "5071", 67.536534, -34.198215, 0.889238),
    UsdaYieldProfile("chicken_drumstick_dark_rotisserie_meat_and_skin", "5066", 67.311988, -32.220894, -1.136024),

    # Beef brisket raw/cooked pairs from USDA FoodData Central group 1300.
    UsdaYieldProfile(
        fill_class="beef_brisket_whole_separable_lean_only_0in_braised",
        source_ndb_no="13023",
        cooking_yield_percent=69.647058823529,
        moisture_change_percent=-42.817872176613,
        fat_change_percent=-4.743235693192,
    ),
    UsdaYieldProfile(
        fill_class="beef_brisket_whole_separable_lean_and_fat_1_8in_braised",
        source_ndb_no="13803",
        cooking_yield_percent=71.257253384913,
        moisture_change_percent=-42.158896155468,
        fat_change_percent=-8.404894652132,
    ),
    UsdaYieldProfile(
        fill_class="beef_brisket_flat_separable_lean_and_fat_1_8in_braised",
        source_ndb_no="13805",
        cooking_yield_percent=62.248438584316,
        moisture_change_percent=-44.696156138396,
        fat_change_percent=-48.304046946659,
    ),
    UsdaYieldProfile(
        fill_class="beef_brisket_flat_separable_lean_only_1_8in_braised",
        source_ndb_no="23596",
        cooking_yield_percent=65.067873303167,
        moisture_change_percent=-46.532486430247,
        fat_change_percent=1.668552036199,
    ),
    UsdaYieldProfile(
        fill_class="beef_brisket_point_separable_lean_and_fat_1_8in_braised",
        source_ndb_no="13807",
        cooking_yield_percent=72.336065573770,
        moisture_change_percent=-41.730620960422,
        fat_change_percent=-6.321692009564,
    ),
    UsdaYieldProfile(
        fill_class="beef_corned_brisket_cooked",
        source_ndb_no="13346",
        cooking_yield_percent=80.792515134838,
        moisture_change_percent=-27.425112982092,
        fat_change_percent=2.915566259008,
    ),
)

USDA_YIELD_PROFILE_CLASSES: tuple[str, ...] = tuple(
    dict.fromkeys(profile.fill_class for profile in USDA_YIELD_PROFILE_CATALOG)
)


def matching_profile(fill_class: str, ndb_no: str) -> UsdaYieldProfile | None:
    """Return a profile only when the class and source NDB both qualify."""
    return next(
        (
            profile
            for profile in USDA_YIELD_PROFILE_CATALOG
            if profile.fill_class == fill_class and str(ndb_no) == profile.source_ndb_no
        ),
        None,
    )


def profile_retained_water(
    profile: UsdaYieldProfile,
    raw_grams: float,
    raw_water_grams: float,
) -> float:
    """Return retained water for the matched USDA sample, in grams."""
    if profile.moisture_change_percent is None:
        return raw_water_grams
    return max(0.0, raw_water_grams + raw_grams * profile.moisture_change_percent / 100.0)


def profile_fat_loss(profile: UsdaYieldProfile, raw_grams: float) -> float:
    """Return only negative USDA fat change as a positive loss in grams."""
    if profile.fat_change_percent is None or profile.fat_change_percent >= 0.0:
        return 0.0
    return raw_grams * abs(profile.fat_change_percent) / 100.0