export interface UsdaYieldProfile {
  fillClass: string;
  sourceNdbNo: string;
  cookingYieldPercent: number;
  moistureChangePercent?: number;
  fatChangePercent?: number;
}

export const USDA_YIELD_PROFILE_CATALOG: UsdaYieldProfile[] = [
  // Beef ground profiles; USDA cooking-yield table, 2002/2003.
  { fillClass: 'beef_ground_crumbles_low_fat', sourceNdbNo: '23565', cookingYieldPercent: 69.0, moistureChangePercent: -29.6, fatChangePercent: -1.4 },
  { fillClass: 'beef_ground_crumbles_medium_fat', sourceNdbNo: '23575', cookingYieldPercent: 67.0, moistureChangePercent: -27.8, fatChangePercent: -5.3 },
  { fillClass: 'beef_ground_crumbles_high_fat', sourceNdbNo: '13494', cookingYieldPercent: 62.0, moistureChangePercent: -25.0, fatChangePercent: -12.6 },
  { fillClass: 'beef_ground_patty_low_fat', sourceNdbNo: '23564', cookingYieldPercent: 77.0, moistureChangePercent: -21.3, fatChangePercent: -1.4 },
  { fillClass: 'beef_ground_patty_medium_fat', sourceNdbNo: '23574', cookingYieldPercent: 73.0, moistureChangePercent: -20.8, fatChangePercent: -6.2 },
  { fillClass: 'beef_ground_patty_high_fat', sourceNdbNo: '13496', cookingYieldPercent: 69.0, moistureChangePercent: -18.2, fatChangePercent: -12.4 },

  // Beef cuts; USDA cooking-yield table, 2000/2003/2010/2011.
  { fillClass: 'beef_flank_steak_boneless_pan_grilled', sourceNdbNo: '13948', cookingYieldPercent: 81.0, moistureChangePercent: -22.6, fatChangePercent: -1.0 },
  { fillClass: 'beef_inside_skirt_steak_boneless_grilled', sourceNdbNo: '23214', cookingYieldPercent: 73.0, moistureChangePercent: -30.0, fatChangePercent: -2.3 },
  { fillClass: 'beef_skirt_steak_boneless_pan_grilled', sourceNdbNo: '23221', cookingYieldPercent: 68.0, moistureChangePercent: -29.5, fatChangePercent: -4.2 },
  { fillClass: 'beef_ribeye_steak_boneless_pan_grilled', sourceNdbNo: '23227', cookingYieldPercent: 82.0, moistureChangePercent: -20.1, fatChangePercent: -2.0 },
  { fillClass: 'beef_tenderloin_steak_boneless_pan_grilled', sourceNdbNo: '13918', cookingYieldPercent: 80.0, moistureChangePercent: -21.3, fatChangePercent: -5.9 },
  { fillClass: 'beef_top_round_steak_boneless_grilled', sourceNdbNo: '13893', cookingYieldPercent: 72.0, moistureChangePercent: -28.4, fatChangePercent: -1.8 },
  { fillClass: 'beef_round_steak_boneless_pan_grilled', sourceNdbNo: '13893', cookingYieldPercent: 72.0, moistureChangePercent: -28.4, fatChangePercent: -1.8 },
  { fillClass: 'beef_top_loin_steak_boneless_grilled', sourceNdbNo: '13910', cookingYieldPercent: 82.0, moistureChangePercent: -24.8, fatChangePercent: -4.0 },
  { fillClass: 'beef_strip_steak_boneless_pan_grilled', sourceNdbNo: '13910', cookingYieldPercent: 82.0, moistureChangePercent: -24.8, fatChangePercent: -4.0 },
  // Calculated composites using USDA strip (NDB 13910) and tenderloin (NDB 13918) profiles; 17.5% bone is excluded before edible weighting.
  { fillClass: 'beef_t_bone_steak_bone_in_pan_grilled', sourceNdbNo: '13907', cookingYieldPercent: 81.8181818182, moistureChangePercent: -24.5090909091, fatChangePercent: -4.1727272727 },
  // Porterhouse uses a larger tenderloin component: 3:1 strip:tenderloin.
  { fillClass: 'beef_porterhouse_steak_bone_in_pan_grilled', sourceNdbNo: '13905', cookingYieldPercent: 81.5, moistureChangePercent: -23.925, fatChangePercent: -4.475 },
  { fillClass: 'beef_top_sirloin_steak_boneless_pan_grilled', sourceNdbNo: '13930', cookingYieldPercent: 80.0, moistureChangePercent: -25.2, fatChangePercent: -2.7 },
  { fillClass: 'beef_shoulder_steak_boneless_grilled', sourceNdbNo: '23554', cookingYieldPercent: 78.0, moistureChangePercent: -28.4, fatChangePercent: -0.3 },
  { fillClass: 'beef_mock_tender_steak_boneless_braised', sourceNdbNo: '23119', cookingYieldPercent: 71.0, moistureChangePercent: -37.1, fatChangePercent: 1.7 },
  { fillClass: 'beef_shoulder_clod_tender_medallion_boneless_grilled', sourceNdbNo: '23054', cookingYieldPercent: 77.0, moistureChangePercent: -22.2, fatChangePercent: -0.7 },
  { fillClass: 'beef_shoulder_clod_top_center_steak_boneless_grilled', sourceNdbNo: '23058', cookingYieldPercent: 76.0, moistureChangePercent: -22.9, fatChangePercent: -0.02 },
  { fillClass: 'beef_top_blade_steak_boneless_grilled', sourceNdbNo: '23060', cookingYieldPercent: 76.0, moistureChangePercent: -23.2, fatChangePercent: -0.8 },
  { fillClass: 'beef_flat_iron_steak_boneless_pan_grilled', sourceNdbNo: '23060', cookingYieldPercent: 76.0, moistureChangePercent: -23.2, fatChangePercent: -0.8 },
  { fillClass: 'beef_denver_steak_boneless_grilled', sourceNdbNo: '23105', cookingYieldPercent: 71.0, moistureChangePercent: -26.3, fatChangePercent: -2.1 },
  { fillClass: 'beef_underblade_pot_roast_boneless_braised', sourceNdbNo: '23099', cookingYieldPercent: 64.0, moistureChangePercent: -34.8, fatChangePercent: -0.8 },
  { fillClass: 'beef_underblade_steak_boneless_braised', sourceNdbNo: '23116', cookingYieldPercent: 65.0, moistureChangePercent: -35.4, fatChangePercent: -2.8 },
  { fillClass: 'beef_tri_tip_roast_boneless_roasted', sourceNdbNo: '13953', cookingYieldPercent: 84.0, moistureChangePercent: -22.4, fatChangePercent: -0.1 },
  { fillClass: 'beef_tri_tip_roast_lean_only_roasted', sourceNdbNo: '13985', cookingYieldPercent: 84.0, moistureChangePercent: -25.3, fatChangePercent: 0.4 },
  { fillClass: 'beef_chuck_eye_roast_boneless_roasted', sourceNdbNo: '23113', cookingYieldPercent: 80.0, moistureChangePercent: -24.9, fatChangePercent: -0.4 },
  { fillClass: 'beef_round_tip_roast_boneless_roasted', sourceNdbNo: '13421', cookingYieldPercent: 85.0, moistureChangePercent: -24.7, fatChangePercent: -1.0 },
  { fillClass: 'beef_bottom_round_roast_boneless_roasted', sourceNdbNo: '13870', cookingYieldPercent: 84.0, moistureChangePercent: -20.6, fatChangePercent: -2.8 },
  { fillClass: 'beef_shoulder_pot_roast_boneless_braised', sourceNdbNo: '23131', cookingYieldPercent: 66.0, moistureChangePercent: -37.3, fatChangePercent: 0.3 },
  { fillClass: 'beef_rib_eye_roast_bone_in_roasted', sourceNdbNo: '23191', cookingYieldPercent: 77.0, moistureChangePercent: -17.6, fatChangePercent: -1.7 },
  { fillClass: 'beef_rib_eye_roast_boneless_roasted', sourceNdbNo: '23198', cookingYieldPercent: 76.0, moistureChangePercent: -21.8, fatChangePercent: -2.6 },
  { fillClass: 'beef_eye_of_round_roast_boneless_roasted', sourceNdbNo: '13878', cookingYieldPercent: 81.0, moistureChangePercent: -23.9, fatChangePercent: -1.2 },
  { fillClass: 'beef_pot_roast_boneless_braised', sourceNdbNo: '13373', cookingYieldPercent: 71.0, moistureChangePercent: -36.1, fatChangePercent: -8.3 },
  { fillClass: 'beef_short_ribs_boneless_braised', sourceNdbNo: '23125', cookingYieldPercent: 66.0, moistureChangePercent: -31.3, fatChangePercent: -4.2 },

  // Pork profiles; USDA cooking-yield table, 2003/2011.
  { fillClass: 'pork_sausage_high_fat_pan_fried', sourceNdbNo: '7064', cookingYieldPercent: 80.0, moistureChangePercent: -16.2, fatChangePercent: -3.9 },
  { fillClass: 'bacon_pan_fried', sourceNdbNo: '10862', cookingYieldPercent: 31.0, moistureChangePercent: -35.9, fatChangePercent: -33.8 },
  { fillClass: 'pork_chop_bone_in_pan_grilled', sourceNdbNo: '10178', cookingYieldPercent: 82.0, moistureChangePercent: -20.0, fatChangePercent: 1.3 },
  { fillClass: 'pork_cured_ham_boneless_roasted', sourceNdbNo: '10883', cookingYieldPercent: 94.0, moistureChangePercent: -6.1, fatChangePercent: -0.3 },
  { fillClass: 'pork_blade_roast_bone_in_roasted', sourceNdbNo: '10031', cookingYieldPercent: 77.0, moistureChangePercent: -22.2, fatChangePercent: 0.6 },
  { fillClass: 'pork_blade_roast_boneless_roasted', sourceNdbNo: '10990', cookingYieldPercent: 75.0, moistureChangePercent: -22.4, fatChangePercent: -0.2 },
  { fillClass: 'pork_center_loin_roast_bone_in_roasted', sourceNdbNo: '10039', cookingYieldPercent: 77.0, moistureChangePercent: -23.3, fatChangePercent: 0.9 },
  { fillClass: 'pork_center_rib_roast_bone_in_roasted', sourceNdbNo: '10047', cookingYieldPercent: 75.0, moistureChangePercent: -24.7, fatChangePercent: -0.1 },
  { fillClass: 'pork_tenderloin_lean_only_roasted', sourceNdbNo: '10061', cookingYieldPercent: 80.0, moistureChangePercent: -20.7, fatChangePercent: 0.5 },
  { fillClass: 'pork_top_loin_roast_lean_only_roasted', sourceNdbNo: '10069', cookingYieldPercent: 79.0, moistureChangePercent: -21.3, fatChangePercent: 0.9 },
  { fillClass: 'pork_country_style_ribs_boneless_braised', sourceNdbNo: '10208', cookingYieldPercent: 71.0, moistureChangePercent: -33.1, fatChangePercent: 4.4 },
  { fillClass: 'pork_back_ribs_bone_in_roasted', sourceNdbNo: '10193', cookingYieldPercent: 82.0, moistureChangePercent: -18.5, fatChangePercent: 1.3 },
  { fillClass: 'pork_back_ribs_bone_in_lean_only_roasted', sourceNdbNo: '10981', cookingYieldPercent: 82.0, moistureChangePercent: -21.0, fatChangePercent: 4.7 },
  { fillClass: 'pork_spareribs_bone_in_roasted', sourceNdbNo: '10940', cookingYieldPercent: 76.0, moistureChangePercent: -22.9, fatChangePercent: 0.2 },
  { fillClass: 'pork_leg_sirloin_tip_roast_boneless_braised', sourceNdbNo: '10962', cookingYieldPercent: 79.0, moistureChangePercent: -21.5, fatChangePercent: 0.01 },
  { fillClass: 'pork_sirloin_chop_bone_in_braised', sourceNdbNo: '10053', cookingYieldPercent: 73.0, moistureChangePercent: -27.0, fatChangePercent: 0.1 },
  { fillClass: 'pork_sirloin_chop_bone_in_lean_only_braised', sourceNdbNo: '10057', cookingYieldPercent: 74.0, moistureChangePercent: -28.0, fatChangePercent: 0.7 },
  { fillClass: 'pork_sirloin_chop_boneless_braised', sourceNdbNo: '10211', cookingYieldPercent: 76.0, moistureChangePercent: -22.7, fatChangePercent: 0.1 },
  { fillClass: 'pork_sirloin_chop_boneless_lean_only_braised', sourceNdbNo: '10215', cookingYieldPercent: 75.0, moistureChangePercent: -24.8, fatChangePercent: 0.7 },
  { fillClass: 'pork_blade_roast_bone_in_lean_only_roasted', sourceNdbNo: '10035', cookingYieldPercent: 77.0, moistureChangePercent: -24.7, fatChangePercent: 3.3 },
  { fillClass: 'pork_blade_roast_boneless_lean_only_roasted', sourceNdbNo: '10983', cookingYieldPercent: 75.0, moistureChangePercent: -24.2, fatChangePercent: 1.6 },
  { fillClass: 'pork_center_loin_roast_bone_in_lean_only_roasted', sourceNdbNo: '10043', cookingYieldPercent: 77.0, moistureChangePercent: -24.2, fatChangePercent: 2.3 },
  { fillClass: 'pork_center_rib_roast_bone_in_lean_only_roasted', sourceNdbNo: '10051', cookingYieldPercent: 74.0, moistureChangePercent: -27.1, fatChangePercent: 2.3 },
  { fillClass: 'pork_blade_chop_boneless_lean_only_pan_grilled', sourceNdbNo: '10984', cookingYieldPercent: 79.0, moistureChangePercent: -21.3, fatChangePercent: 1.5 },
  { fillClass: 'pork_chop_boneless_pan_grilled', sourceNdbNo: '10212', cookingYieldPercent: 79.0, moistureChangePercent: -23.2, fatChangePercent: 0.1 },
  { fillClass: 'pork_leg_rump_half_lean_only_roasted', sourceNdbNo: '10015', cookingYieldPercent: 73.0, moistureChangePercent: -26.9, fatChangePercent: 0.4 },
  { fillClass: 'pork_leg_shank_half_lean_only_roasted', sourceNdbNo: '10019', cookingYieldPercent: 73.0, moistureChangePercent: -27.5, fatChangePercent: 1.3 },
  { fillClass: 'pork_blade_chop_bone_in_braised', sourceNdbNo: '10029', cookingYieldPercent: 78.0, moistureChangePercent: -27.8, fatChangePercent: 6.5 },
  { fillClass: 'pork_blade_chop_bone_in_pan_grilled', sourceNdbNo: '10030', cookingYieldPercent: 83.0, moistureChangePercent: -16.3, fatChangePercent: -0.3 },
  { fillClass: 'pork_center_loin_chop_bone_in_braised', sourceNdbNo: '10037', cookingYieldPercent: 74.0, moistureChangePercent: -21.5, fatChangePercent: 2.2 },
  { fillClass: 'pork_center_loin_chop_bone_in_lean_only_braised', sourceNdbNo: '10041', cookingYieldPercent: 73.0, moistureChangePercent: -28.0, fatChangePercent: 1.9 },
  { fillClass: 'pork_center_loin_chop_bone_in_lean_only_pan_grilled', sourceNdbNo: '10042', cookingYieldPercent: 82.0, moistureChangePercent: -20.4, fatChangePercent: 2.3 },
  { fillClass: 'pork_ground_crumbles_high_fat', sourceNdbNo: '10974', cookingYieldPercent: 66.0, moistureChangePercent: -27.9, fatChangePercent: -6.5 },
  { fillClass: 'pork_ground_crumbles_low_fat', sourceNdbNo: '10976', cookingYieldPercent: 68.0, moistureChangePercent: -31.7, fatChangePercent: -0.2 },
  { fillClass: 'pork_ground_crumbles_medium_fat', sourceNdbNo: '10975', cookingYieldPercent: 67.0, moistureChangePercent: -30.3, fatChangePercent: -1.8 },
  { fillClass: 'pork_ground_patty_high_fat', sourceNdbNo: '10977', cookingYieldPercent: 69.0, moistureChangePercent: -25.3, fatChangePercent: -6.6 },
  { fillClass: 'pork_ground_patty_low_fat', sourceNdbNo: '10979', cookingYieldPercent: 68.0, moistureChangePercent: -32.7, fatChangePercent: 0.2 },
  { fillClass: 'pork_ground_patty_medium_fat', sourceNdbNo: '10978', cookingYieldPercent: 68.0, moistureChangePercent: -26.7, fatChangePercent: -1.9 },

  // Chicken wing, meat and skin; nutrient-derived from raw NDB 5100 and cooked NDBs 5101 (fried, batter), 5102 (fried, flour), 5103 (roasted), and 5104 (stewed), respectively.
  { fillClass: 'chicken_wing_dark_fried_batter', sourceNdbNo: '5100', cookingYieldPercent: 88.173125, moistureChangePercent: -28.445199, fatChangePercent: 6.380559 },
  { fillClass: 'chicken_wing_dark_fried_flour', sourceNdbNo: '5100', cookingYieldPercent: 67.100728, moistureChangePercent: -36.565626, fatChangePercent: 2.019521 },
  { fillClass: 'chicken_wing_dark_roasted', sourceNdbNo: '5100', cookingYieldPercent: 73.644388, moistureChangePercent: -25.445233, fatChangePercent: -0.426192 },
  { fillClass: 'chicken_wing_dark_stewed', sourceNdbNo: '5100', cookingYieldPercent: 76.909570, moistureChangePercent: -21.367629, fatChangePercent: 0.086190 },

  // Chicken wing, meat only; nutrient-derived from raw NDB 5105 and cooked NDBs 5106 (fried, flour), 5107 (roasted), and 5108 (stewed), respectively.
  { fillClass: 'chicken_wing_dark_fried', sourceNdbNo: '5105', cookingYieldPercent: 72.868988, moistureChangePercent: -31.352484, fatChangePercent: 3.127512 },
  { fillClass: 'chicken_wing_dark_roasted_meat_only', sourceNdbNo: '5105', cookingYieldPercent: 72.127380, moistureChangePercent: -29.668431, fatChangePercent: 2.323956 },
  { fillClass: 'chicken_wing_dark_stewed_meat_only', sourceNdbNo: '5105', cookingYieldPercent: 80.831494, moistureChangePercent: -20.784816, fatChangePercent: 2.263701 },

  // Chicken gizzard and liver; USDA Cooking Yield Data values from the 2003 variety meats study. Moisture and fat changes are published table values.
  { fillClass: 'chicken_gizzard_stewed', sourceNdbNo: '5023', cookingYieldPercent: 55.0, moistureChangePercent: -41.9, fatChangePercent: -0.6 },
  { fillClass: 'chicken_liver_pan_grilled', sourceNdbNo: '5027', cookingYieldPercent: 62.0, moistureChangePercent: -35.8, fatChangePercent: -0.8 },
  { fillClass: 'turkey_gizzard_stewed', sourceNdbNo: '5174', cookingYieldPercent: 85.0, moistureChangePercent: -14.3, fatChangePercent: -1.3 },
  { fillClass: 'turkey_heart_stewed', sourceNdbNo: '5176', cookingYieldPercent: 76.0, moistureChangePercent: -21.7, fatChangePercent: -1.3 },
  { fillClass: 'turkey_liver_stewed', sourceNdbNo: '5178', cookingYieldPercent: 83.0, moistureChangePercent: -15.2, fatChangePercent: 0.6 },
  { fillClass: 'veal_liver_braised', sourceNdbNo: '17203', cookingYieldPercent: 69.0, moistureChangePercent: -29.6, fatChangePercent: -0.5 },
  { fillClass: 'veal_liver_pan_grilled', sourceNdbNo: '17204', cookingYieldPercent: 68.0, moistureChangePercent: -30.4, fatChangePercent: -0.5 },
  { fillClass: 'pork_chitterlings_stewed', sourceNdbNo: '10099', cookingYieldPercent: 39.0, moistureChangePercent: -49.9, fatChangePercent: -8.8 },
  { fillClass: 'pork_feet_stewed', sourceNdbNo: '10173', cookingYieldPercent: 36.0, moistureChangePercent: -42.6, fatChangePercent: -6.9 },
  { fillClass: 'pork_stomach_stewed', sourceNdbNo: '10863', cookingYieldPercent: 69.0, moistureChangePercent: -24.8, fatChangePercent: -5.1 },
  { fillClass: 'beef_brain_stewed', sourceNdbNo: '13320', cookingYieldPercent: 85.0, moistureChangePercent: -12.8, fatChangePercent: -1.4 },
  { fillClass: 'beef_heart_stewed', sourceNdbNo: '13322', cookingYieldPercent: 57.0, moistureChangePercent: -40.0, fatChangePercent: -1.3 },
  { fillClass: 'beef_kidneys_stewed', sourceNdbNo: '13324', cookingYieldPercent: 53.0, moistureChangePercent: -42.7, fatChangePercent: -0.6 },
  { fillClass: 'beef_liver_braised', sourceNdbNo: '13326', cookingYieldPercent: 68.0, moistureChangePercent: -30.6, fatChangePercent: -0.04 },
  { fillClass: 'beef_liver_pan_grilled', sourceNdbNo: '13327', cookingYieldPercent: 73.0, moistureChangePercent: -25.7, fatChangePercent: -0.2 },
  { fillClass: 'beef_tripe_stewed', sourceNdbNo: '23640', cookingYieldPercent: 70.0, moistureChangePercent: -27.3, fatChangePercent: -0.9 },
  // Turkey whole, meat and skin; protein-conservation derivation from raw NDB 5165 and cooked NDB 5166 in DataCentralCombo.
  { fillClass: 'turkey_whole_meat_and_skin_roasted', sourceNdbNo: '5165', cookingYieldPercent: 75.796847635727, moistureChangePercent: -33.765087882496, fatChangePercent: -0.684626945386 },
  // Turkey whole, meat only; protein-conservation derivation from raw NDB 5167 and cooked NDB 5168 in DataCentralCombo.
  { fillClass: 'turkey_whole_meat_only_roasted', sourceNdbNo: '5167', cookingYieldPercent: 77.907777013076, moistureChangePercent: -31.054149837174, fatChangePercent: 55.008219549333 },
  // Turkey from whole, light meat and skin; protein-conservation derivation from raw NDB 5181 and cooked NDB 5182 in DataCentralCombo.
  { fillClass: 'turkey_light_meat_and_skin_roasted', sourceNdbNo: '5181', cookingYieldPercent: 74.314720812183, moistureChangePercent: -31.878172588832, fatChangePercent: -44.288964344030 },
  // Turkey from whole, light meat only; protein-conservation derivation from raw NDB 5185 and cooked NDB 5186 in DataCentralCombo.
  { fillClass: 'turkey_light_meat_only_roasted', sourceNdbNo: '5185', cookingYieldPercent: 78.526385662131, moistureChangePercent: -28.823994408527, fatChangePercent: 10.361406876508 },
  // Turkey dark meat and skin; protein-conservation derivation from raw NDB 5183 and cooked NDB 5184 in DataCentralCombo.
  { fillClass: 'turkey_dark_meat_and_skin_roasted', sourceNdbNo: '5183', cookingYieldPercent: 72.643931059773, moistureChangePercent: -37.001057817924, fatChangePercent: -19.419496762014 },
  // Turkey from whole, dark meat only; protein-conservation derivation from raw NDB 5187 and cooked NDB 5188 in DataCentralCombo.
  { fillClass: 'turkey_dark_meat_only_roasted', sourceNdbNo: '5187', cookingYieldPercent: 76.795380728979, moistureChangePercent: -34.096004671079, fatChangePercent: 85.537639841213 },
  // Ground turkey, 93% lean and 7% fat; protein-conservation derivation from raw NDB 5665 and cooked NDB 5666 (pan-broiled crumbles).
  { fillClass: 'turkey_ground_crumbles_pan_broiled', sourceNdbNo: '5665', cookingYieldPercent: 69.114391143911, moistureChangePercent: -41.905086337109, fatChangePercent: -3.869671790243 },
  // Ground turkey, 93% lean and 7% fat; protein-conservation derivation from raw NDB 5665 and cooked NDB 5667 (patties, broiled).
  { fillClass: 'turkey_ground_patty_broiled', sourceNdbNo: '5665', cookingYieldPercent: 72.428460943542, moistureChangePercent: -37.753207598845, fatChangePercent: -0.562844338063 },
  // Ground turkey, 85% lean and 15% fat; protein-conservation derivation from raw NDB 5668 and cooked NDB 5669 (pan-broiled crumbles).
  { fillClass: 'turkey_ground_85_15_crumbles_pan_broiled', sourceNdbNo: '5668', cookingYieldPercent: 67.303863002788, moistureChangePercent: -45.319230316347, fatChangePercent: -6.343508022437 },
  // Ground turkey, 85% lean and 15% fat; protein-conservation derivation from raw NDB 5668 and cooked NDB 5670 (patties, broiled).
  { fillClass: 'turkey_ground_85_15_patty_broiled', sourceNdbNo: '5668', cookingYieldPercent: 65.301391035549, moistureChangePercent: -45.457326816451, fatChangePercent: -15.639351293789 },
  // Turkey breast, meat and skin; protein-conservation derivation from raw NDB 5191 and cooked NDB 5192 in DataCentralCombo.
  { fillClass: 'turkey_breast_meat_and_skin_roasted', sourceNdbNo: '5191', cookingYieldPercent: 76.245210727969, moistureChangePercent: -31.188833372988, fatChangePercent: -19.518944231588 },
  // Turkey leg, meat and skin; protein-conservation derivation from raw NDB 5193 and cooked NDB 5194 in DataCentralCombo.
  { fillClass: 'turkey_leg_meat_and_skin_roasted', sourceNdbNo: '5193', cookingYieldPercent: 70.111230714029, moistureChangePercent: -40.980792304423, fatChangePercent: 2.454209168418 },
  // Turkey wing, meat and skin; protein-conservation derivation from raw NDB 5195 and cooked NDB 5196 in DataCentralCombo.
  { fillClass: 'turkey_wing_meat_and_skin_roasted', sourceNdbNo: '5195', cookingYieldPercent: 73.849525200877, moistureChangePercent: -33.925278174159, fatChangePercent: -25.491104038401 },

  // Lamb domestic, separable lean and fat; protein-conservation derivations from DataCentralCombo raw/cooked pairs.
  { fillClass: 'lamb_foreshank_meat_and_fat_braised', sourceNdbNo: '17007', cookingYieldPercent: 66.654917166020, moistureChangePercent: -43.500980524848, fatChangePercent: -32.946548202195 },
  { fillClass: 'lamb_leg_shank_half_meat_and_fat_roasted', sourceNdbNo: '17015', cookingYieldPercent: 70.352139341159, moistureChangePercent: -36.466268089405, fatChangePercent: -35.071598606566 },
  { fillClass: 'lamb_leg_sirloin_half_meat_and_fat_roasted', sourceNdbNo: '17019', cookingYieldPercent: 68.777913114089, moistureChangePercent: -38.259561577685, fatChangePercent: -35.701516776653 },
  { fillClass: 'lamb_loin_meat_and_fat_broiled', sourceNdbNo: '17023', cookingYieldPercent: 64.839094159714, moistureChangePercent: -40.870873814033, fatChangePercent: -43.804495185648 },
  { fillClass: 'lamb_loin_meat_and_fat_roasted', sourceNdbNo: '17023', cookingYieldPercent: 72.372505543237, moistureChangePercent: -32.810671246331, fatChangePercent: -35.889320098950 },
  { fillClass: 'lamb_shoulder_meat_and_fat_braised', sourceNdbNo: '17035', cookingYieldPercent: 57.810320781032, moistureChangePercent: -57.435632850584, fatChangePercent: -33.834807684180 },
  { fillClass: 'lamb_shoulder_meat_and_fat_roasted', sourceNdbNo: '17035', cookingYieldPercent: 73.656152820968, moistureChangePercent: -32.498857180197, fatChangePercent: -31.425950031014 },
  { fillClass: 'lamb_stew_cubes_lean_only_braised', sourceNdbNo: '17059', cookingYieldPercent: 59.988127040665, moistureChangePercent: -54.256409228416, fatChangePercent: -0.019788265559 },
  { fillClass: 'lamb_new_zealand_leg_chop_bone_in_meat_and_fat_fast_fried', sourceNdbNo: '17072', cookingYieldPercent: 76.834295136026, moistureChangePercent: -27.309576961198, fatChangePercent: -32.478952759250 },
  { fillClass: 'lamb_new_zealand_leg_chop_bone_in_lean_only_fast_fried', sourceNdbNo: '17074', cookingYieldPercent: 80.197643481566, moistureChangePercent: -27.126391477948, fatChangePercent: 9.753240540505 },
  { fillClass: 'lamb_new_zealand_loin_chop_meat_and_fat_broiled', sourceNdbNo: '17076', cookingYieldPercent: 65.727699530516, moistureChangePercent: -41.724289605919, fatChangePercent: -40.069588973321 },
  { fillClass: 'lamb_new_zealand_loin_chop_lean_only_broiled', sourceNdbNo: '17078', cookingYieldPercent: 68.167860798362, moistureChangePercent: -41.895013890920, fatChangePercent: -18.357096950799 },
  { fillClass: 'lamb_new_zealand_partly_frenched_rack_meat_and_fat_fast_roasted', sourceNdbNo: '17080', cookingYieldPercent: 82.139619220308, moistureChangePercent: -21.942502665123, fatChangePercent: -18.880473243011 },
  { fillClass: 'lamb_new_zealand_partly_frenched_rack_lean_only_fast_roasted', sourceNdbNo: '17082', cookingYieldPercent: 84.527220630372, moistureChangePercent: -21.826761786034, fatChangePercent: 4.358229419380 },
  { fillClass: 'lamb_new_zealand_loin_chop_meat_and_fat_fast_fried', sourceNdbNo: '17076', cookingYieldPercent: 71.627906976744, moistureChangePercent: -36.895927268862, fatChangePercent: -25.855954252022 },
  { fillClass: 'lamb_australian_sirloin_chop_boneless_meat_and_fat_broiled', sourceNdbNo: '17302', cookingYieldPercent: 71.184466019417, moistureChangePercent: -36.172468772598, fatChangePercent: -31.538166547389 },
  { fillClass: 'lamb_australian_sirloin_chop_boneless_lean_only_broiled', sourceNdbNo: '17304', cookingYieldPercent: 73.941368078176, moistureChangePercent: -36.083058593693, fatChangePercent: 17.462865786104 },
  { fillClass: 'lamb_australian_frenched_rib_chop_bone_in_meat_and_fat_grilled', sourceNdbNo: '17314', cookingYieldPercent: 74.648876404494, moistureChangePercent: -40.085407153522, fatChangePercent: -6.302180001464 },
  { fillClass: 'lamb_australian_frenched_rib_chop_bone_in_lean_only_grilled', sourceNdbNo: '17316', cookingYieldPercent: 74.844527363184, moistureChangePercent: -40.181722100338, fatChangePercent: 56.383556279426 },
  { fillClass: 'lamb_new_zealand_fully_frenched_rack_lean_only_fast_roasted', sourceNdbNo: '17397', cookingYieldPercent: 84.501845018450, moistureChangePercent: -21.357987125288, fatChangePercent: -0.544176790082 },
  { fillClass: 'lamb_new_zealand_fully_frenched_rack_meat_and_fat_fast_roasted', sourceNdbNo: '17420', cookingYieldPercent: 84.380305602716, moistureChangePercent: -21.408477048297, fatChangePercent: -5.114515788110 },

  // Emu; USDA Cooking Yield Data raw/cooked pairs from the 2001 game-meat study.
  { fillClass: 'emu_ground_grilled', sourceNdbNo: '5621', cookingYieldPercent: 80.091452690820, moistureChangePercent: -27.646214757285, fatChangePercent: -7.586785356747 },
  { fillClass: 'emu_fan_fillet_broiled', sourceNdbNo: '5623', cookingYieldPercent: 71.953949472338, moistureChangePercent: -35.943435225846, fatChangePercent: 106.867604732971 },
  { fillClass: 'emu_full_rump_broiled', sourceNdbNo: '5626', cookingYieldPercent: 67.805167805168, moistureChangePercent: -43.056155998289, fatChangePercent: 10.803566901128 },
  { fillClass: 'emu_inside_drum_broiled', sourceNdbNo: '5628', cookingYieldPercent: 68.622606547251, moistureChangePercent: -40.945807211913, fatChangePercent: -7.428564322164 },
  { fillClass: 'cornish_game_hen_roasted_meat_and_skin', sourceNdbNo: '5307', cookingYieldPercent: 77.009429726089, moistureChangePercent: -33.720836956191, fatChangePercent: 0.024373417409 },
  { fillClass: 'cornish_game_hen_roasted_meat_only', sourceNdbNo: '5309', cookingYieldPercent: 86.008583690987, moistureChangePercent: -18.459689248655, fatChangePercent: -0.044078413177 },

  { fillClass: 'veal_top_round_braised', sourceNdbNo: '17094', cookingYieldPercent: 58.019911504425, moistureChangePercent: -56.958223404004, fatChangePercent: 19.242220721756 },
  { fillClass: 'veal_top_round_pan_fried_breaded', sourceNdbNo: '17094', cookingYieldPercent: 76.877977281055, moistureChangePercent: -47.264585370442, fatChangePercent: 129.136308909119 },
  { fillClass: 'veal_top_round_pan_fried_unbreaded', sourceNdbNo: '17094', cookingYieldPercent: 66.078740157480, moistureChangePercent: -48.462116299634, fatChangePercent: 79.142039063299 },
  { fillClass: 'veal_top_round_roasted', sourceNdbNo: '17094', cookingYieldPercent: 75.740072202166, moistureChangePercent: -33.069267746482, fatChangePercent: 14.347836279244 },
  { fillClass: 'veal_loin_braised', sourceNdbNo: '17104', cookingYieldPercent: 66.478966545214, moistureChangePercent: -50.198216594441, fatChangePercent: 13.614996449169 },
  { fillClass: 'veal_loin_roasted', sourceNdbNo: '17104', cookingYieldPercent: 80.927419354839, moistureChangePercent: -29.223470947302, fatChangePercent: -0.990485953167 },
  { fillClass: 'veal_loin_chop_grilled', sourceNdbNo: '17104', cookingYieldPercent: 71.576319543509, moistureChangePercent: -36.700723168679, fatChangePercent: -32.617327778305 },
  { fillClass: 'veal_hindshank_braised', sourceNdbNo: '17276', cookingYieldPercent: 60.716550412175, moistureChangePercent: -51.265732937498, fatChangePercent: 8.173164527438 },
  { fillClass: 'veal_rib_braised', sourceNdbNo: '17110', cookingYieldPercent: 58.156028368794, moistureChangePercent: -56.409543318232, fatChangePercent: -19.123747451610 },
  { fillClass: 'veal_rib_roasted', sourceNdbNo: '17110', cookingYieldPercent: 78.714524207012, moistureChangePercent: -33.720489877132, fatChangePercent: 21.959462589332 },
  { fillClass: 'veal_sirloin_braised', sourceNdbNo: '17134', cookingYieldPercent: 61.004478566859, moistureChangePercent: -53.735086470311, fatChangePercent: 2.637496590080 },
  { fillClass: 'veal_sirloin_roasted', sourceNdbNo: '17134', cookingYieldPercent: 75.855210819411, moistureChangePercent: -33.847077105855, fatChangePercent: 1.496408842874 },
  { fillClass: 'veal_breast_braised', sourceNdbNo: '17271', cookingYieldPercent: 64.775676677790, moistureChangePercent: -46.443045513191, fatChangePercent: -26.353349295828 },
  { fillClass: 'veal_ground_broiled', sourceNdbNo: '17142', cookingYieldPercent: 76.210008203445, moistureChangePercent: -23.098849037757, fatChangePercent: -55.884558804131 },
  { fillClass: 'veal_ground_pan_fried', sourceNdbNo: '17142', cookingYieldPercent: 71.931862175765, moistureChangePercent: -34.906883487560, fatChangePercent: -35.118121253407 },

  // Bison; USDA Cooking Yield Data values from the 2001 alternate red meat study.
  { fillClass: 'bison_chuck_shoulder_braised', sourceNdbNo: '17334', cookingYieldPercent: 62.522202486679, moistureChangePercent: -49.915988705256, fatChangePercent: 7.776368050751 },
  { fillClass: 'bison_ground_grilled', sourceNdbNo: '17331', cookingYieldPercent: 77.0, moistureChangePercent: -18.2, fatChangePercent: -4.2 },
  { fillClass: 'bison_top_round_grilled', sourceNdbNo: '17337', cookingYieldPercent: 77.269715270585, moistureChangePercent: -31.998470898261, fatChangePercent: 57.719254090034 },
  { fillClass: 'deer_ground_grilled', sourceNdbNo: '17344', cookingYieldPercent: 83.0, moistureChangePercent: -17.7, fatChangePercent: -0.1 },
  { fillClass: 'elk_ground_grilled', sourceNdbNo: '17339', cookingYieldPercent: 84.0, moistureChangePercent: -15.0, fatChangePercent: -1.5 },
  { fillClass: 'game_antelope_roasted', sourceNdbNo: '17144', cookingYieldPercent: 75.993209168081, moistureChangePercent: -32.398050369978, fatChangePercent: -0.048340669084 },
  { fillClass: 'game_bear_simmered', sourceNdbNo: '17146', cookingYieldPercent: 61.998766193708, moistureChangePercent: -53.370309512724, fatChangePercent: 0.019695930736 },
  { fillClass: 'game_beaver_roasted', sourceNdbNo: '17150', cookingYieldPercent: 69.010043041607, moistureChangePercent: -43.679558968498, fatChangePercent: 0.064562348553 },
  { fillClass: 'game_beefalo_roasted', sourceNdbNo: '17152', cookingYieldPercent: 75.994781474233, moistureChangePercent: -33.856989145177, fatChangePercent: 0.059795930821 },
  { fillClass: 'game_bison_lean_roasted', sourceNdbNo: '17156', cookingYieldPercent: 76.019691983122, moistureChangePercent: -32.166418095970, fatChangePercent: -0.017580913828 },
  { fillClass: 'game_boar_roasted', sourceNdbNo: '17158', cookingYieldPercent: 76.007067137809, moistureChangePercent: -33.077317911498, fatChangePercent: -0.026740657944 },
  { fillClass: 'game_buffalo_roasted', sourceNdbNo: '17160', cookingYieldPercent: 75.997018263138, moistureChangePercent: -31.463239357766, fatChangePercent: -0.149903375299 },
  { fillClass: 'game_caribou_roasted', sourceNdbNo: '17162', cookingYieldPercent: 76.016123614377, moistureChangePercent: -33.580313754967, fatChangePercent: -0.002598702790 },
  { fillClass: 'game_deer_roasted', sourceNdbNo: '17164', cookingYieldPercent: 76.001323402185, moistureChangePercent: -32.614293584072, fatChangePercent: 0.183563590654 },
  { fillClass: 'game_elk_roasted', sourceNdbNo: '17166', cookingYieldPercent: 76.018548523352, moistureChangePercent: -32.259889236368, fatChangePercent: -0.389486878417 },
  { fillClass: 'game_horse_roasted', sourceNdbNo: '17170', cookingYieldPercent: 76.012793176972, moistureChangePercent: -33.040087110940, fatChangePercent: -0.026652383921 },
  { fillClass: 'game_moose_roasted', sourceNdbNo: '17172', cookingYieldPercent: 75.982234028014, moistureChangePercent: -31.781932901304, fatChangePercent: -0.401665993628 },
  { fillClass: 'game_muskrat_roasted', sourceNdbNo: '17174', cookingYieldPercent: 68.993021269525, moistureChangePercent: -44.706098128865, fatChangePercent: -0.002707563474 },
  { fillClass: 'game_rabbit_domesticated_roasted', sourceNdbNo: '17177', cookingYieldPercent: 68.995181700620, moistureChangePercent: -42.573496008550, fatChangePercent: 0.074093273704 },
  { fillClass: 'game_rabbit_domesticated_stewed', sourceNdbNo: '17177', cookingYieldPercent: 65.997367583207, moistureChangePercent: -46.690948550678, fatChangePercent: 0.006820918034 },
  { fillClass: 'game_rabbit_wild_stewed', sourceNdbNo: '17180', cookingYieldPercent: 65.990308903698, moistureChangePercent: -45.647224781450, fatChangePercent: -0.161214078464 },
  { fillClass: 'game_squirrel_roasted', sourceNdbNo: '17183', cookingYieldPercent: 68.995774764056, moistureChangePercent: -41.994205959627, fatChangePercent: 0.806911355355 },
  // Ostrich; USDA Cooking Yield Data raw/cooked pairs from the 2001 game-meat study.
  { fillClass: 'ostrich_ground_grilled', sourceNdbNo: '5641', cookingYieldPercent: 77.323135755258, moistureChangePercent: -26.974407318237, fatChangePercent: -37.163842552911 },
  { fillClass: 'ostrich_inside_leg_cooked', sourceNdbNo: '5644', cookingYieldPercent: 77.180282661151, moistureChangePercent: -28.935622322660, fatChangePercent: -12.947820719399 },
  { fillClass: 'ostrich_inside_strip_cooked', sourceNdbNo: '5646', cookingYieldPercent: 80.660537963909, moistureChangePercent: -27.638274127038, fatChangePercent: 19.726094678136 },
  { fillClass: 'ostrich_outside_strip_cooked', sourceNdbNo: '5649', cookingYieldPercent: 81.821366024518, moistureChangePercent: -26.626267635830, fatChangePercent: 41.799018947469 },
  { fillClass: 'ostrich_oyster_cooked', sourceNdbNo: '5651', cookingYieldPercent: 74.800416522041, moistureChangePercent: -33.182119332665, fatChangePercent: -19.085108012942 },
  { fillClass: 'ostrich_tip_trimmed_cooked', sourceNdbNo: '5655', cookingYieldPercent: 76.693576693577, moistureChangePercent: -30.973765905453, fatChangePercent: -14.303264303264 },
  { fillClass: 'ostrich_top_loin_cooked', sourceNdbNo: '5657', cookingYieldPercent: 77.062588904694, moistureChangePercent: -30.505601644672, fatChangePercent: 1.095667478361 },

  // Chicken thigh, meat only; USDA yield table (1975), with moisture and fat changes derived from raw NDB 5096 and cooked NDB 5098.
  { fillClass: 'chicken_thigh_dark_pan_grilled', sourceNdbNo: '5096', cookingYieldPercent: 69.0, moistureChangePercent: -30.0, fatChangePercent: 1.5 },

  // Chicken thigh, meat and skin; protein-conservation yield and moisture/fat changes derived from raw NDB 5091 and cooked NDB 5094.
  { fillClass: 'chicken_thigh_dark_roasted', sourceNdbNo: '5091', cookingYieldPercent: 71.023216, moistureChangePercent: -22.464015, fatChangePercent: -6.162485 },

  // Chicken thigh, meat and skin; nutrient-derived from raw NDB 5091 and cooked NDB 5092 (fried, batter), NDB 5093 (fried, flour), and NDB 5095 (stewed), respectively.
  { fillClass: 'chicken_thigh_dark_fried', sourceNdbNo: '5096', cookingYieldPercent: 69.765791, moistureChangePercent: -34.841909, fatChangePercent: 3.065877 },
  { fillClass: 'chicken_thigh_dark_fried_batter', sourceNdbNo: '5091', cookingYieldPercent: 76.446090, moistureChangePercent: -27.100264, fatChangePercent: -3.973461 },
  { fillClass: 'chicken_thigh_dark_fried_flour', sourceNdbNo: '5091', cookingYieldPercent: 61.757009, moistureChangePercent: -33.034755, fatChangePercent: -7.358800 },
  { fillClass: 'chicken_thigh_dark_stewed', sourceNdbNo: '5091', cookingYieldPercent: 71.023216, moistureChangePercent: -21.647248, fatChangePercent: -6.141178 },
  { fillClass: 'chicken_thigh_dark_rotisserie', sourceNdbNo: '5096', cookingYieldPercent: 81.712386, moistureChangePercent: -24.013957, fatChangePercent: 4.941904 },
  { fillClass: 'chicken_thigh_dark_rotisserie_meat_and_skin', sourceNdbNo: '5091', cookingYieldPercent: 72.045355, moistureChangePercent: -22.997833, fatChangePercent: -5.298879 },

  // Chicken breast, meat and skin; nutrient-derived from raw NDB 5057 and cooked NDBs 5058 (fried, batter), 5059 (fried, flour), 5060 (roasted), 5061 (stewed), and 5348 (rotisserie), respectively.
  { fillClass: 'chicken_breast_light_rotisserie', sourceNdbNo: '5057', cookingYieldPercent: 75.873671, moistureChangePercent: -12.907132, fatChangePercent: -1.733457 },
  { fillClass: 'chicken_breast_light_fried_batter', sourceNdbNo: '5057', cookingYieldPercent: 83.937198, moistureChangePercent: -12.028295, fatChangePercent: 1.105230 },
  { fillClass: 'chicken_breast_light_fried_flour', sourceNdbNo: '5057', cookingYieldPercent: 65.493090, moistureChangePercent: -16.212817, fatChangePercent: -3.615128 },
  { fillClass: 'chicken_breast_light_roasted', sourceNdbNo: '5057', cookingYieldPercent: 70.134228, moistureChangePercent: -6.091414, fatChangePercent: -3.787725 },
  { fillClass: 'chicken_breast_light_stewed', sourceNdbNo: '5057', cookingYieldPercent: 76.373398, moistureChangePercent: -8.694558, fatChangePercent: -3.588933 },

  // Chicken breast, meat only; nutrient-derived from raw NDB 5062 and cooked NDBs 5063 (fried), 5064 (roasted), 5065 (stewed), and 5342 (rotisserie), respectively.
  { fillClass: 'chicken_breast_light_fried', sourceNdbNo: '5062', cookingYieldPercent: 67.284689, moistureChangePercent: -33.387889, fatChangePercent: 0.549109 },
  { fillClass: 'chicken_breast_light_roasted_meat_only', sourceNdbNo: '5062', cookingYieldPercent: 72.533849, moistureChangePercent: -26.564410, fatChangePercent: -0.030542 },
  { fillClass: 'chicken_breast_light_stewed_meat_only', sourceNdbNo: '5062', cookingYieldPercent: 77.639752, moistureChangePercent: -20.895342, fatChangePercent: -0.267516 },
  { fillClass: 'chicken_breast_light_rotisserie_meat_only', sourceNdbNo: '5062', cookingYieldPercent: 80.357143, moistureChangePercent: -19.072321, fatChangePercent: -0.378036 },

  // Chicken back, meat and skin; nutrient-derived from raw NDB 5048 and cooked NDBs 5049 (fried, batter), 5050 (fried, flour), 5051 (roasted), 5052 (stewed), and 5347 (rotisserie), respectively.
  { fillClass: 'chicken_back_fried_batter', sourceNdbNo: '5048', cookingYieldPercent: 63.950842, moistureChangePercent: -29.635480, fatChangePercent: -14.728371 },
  { fillClass: 'chicken_back_fried_flour', sourceNdbNo: '5048', cookingYieldPercent: 50.557755, moistureChangePercent: -35.874811, fatChangePercent: -18.254322 },
  { fillClass: 'chicken_back_roasted', sourceNdbNo: '5048', cookingYieldPercent: 54.142582, moistureChangePercent: -29.122890, fatChangePercent: -17.386301 },
  { fillClass: 'chicken_back_stewed', sourceNdbNo: '5048', cookingYieldPercent: 63.345356, moistureChangePercent: -19.503674, fatChangePercent: -17.249152 },
  { fillClass: 'chicken_back_rotisserie_meat_and_skin', sourceNdbNo: '5048', cookingYieldPercent: 60.482135, moistureChangePercent: -23.963883, fatChangePercent: -17.496371 },

  // Chicken back, meat only; nutrient-derived from raw NDB 5053 and cooked NDBs 5054 (fried), 5055 (roasted), 5056 (stewed), and 5341 (rotisserie), respectively.
  { fillClass: 'chicken_back_fried', sourceNdbNo: '5053', cookingYieldPercent: 65.221741, moistureChangePercent: -44.088353, fatChangePercent: 4.071971 },
  { fillClass: 'chicken_back_roasted_meat_only', sourceNdbNo: '5053', cookingYieldPercent: 69.386307, moistureChangePercent: -34.545545, fatChangePercent: 3.211238 },
  { fillClass: 'chicken_back_stewed_meat_only', sourceNdbNo: '5053', cookingYieldPercent: 77.281707, moistureChangePercent: -25.594678, fatChangePercent: 2.727823 },
  { fillClass: 'chicken_back_rotisserie_meat_only', sourceNdbNo: '5053', cookingYieldPercent: 77.190213, moistureChangePercent: -28.038713, fatChangePercent: 2.987751 },

  // Chicken neck, meat and skin; nutrient-derived from raw NDB 5084 and cooked NDBs 5085 (fried, batter), 5086 (fried, flour), and 5087 (simmered), respectively.
  { fillClass: 'chicken_neck_fried_batter', sourceNdbNo: '5084', cookingYieldPercent: 70.988900, moistureChangePercent: -26.682008, fatChangePercent: -9.543411 },
  { fillClass: 'chicken_neck_fried_flour', sourceNdbNo: '5084', cookingYieldPercent: 58.600583, moistureChangePercent: -32.160583, fatChangePercent: -12.404402 },
  { fillClass: 'chicken_neck_simmered', sourceNdbNo: '5084', cookingYieldPercent: 71.749108, moistureChangePercent: -15.699276, fatChangePercent: -13.253412 },

  // Chicken neck, meat only; nutrient-derived from raw NDB 5088 and cooked NDBs 5089 (fried) and 5090 (simmered), respectively.
  { fillClass: 'chicken_neck_fried', sourceNdbNo: '5088', cookingYieldPercent: 65.314477, moistureChangePercent: -32.823870, fatChangePercent: -1.020640 },
  { fillClass: 'chicken_neck_simmered_meat_only', sourceNdbNo: '5088', cookingYieldPercent: 71.457655, moistureChangePercent: -23.257643, fatChangePercent: -2.934764 },

  // Chicken drumstick, meat and skin; nutrient-derived from raw NDB 5066 and cooked NDBs 5067 (fried, batter), 5068 (fried, flour), 5069 (roasted), and 5070 (stewed), respectively.
  { fillClass: 'chicken_drumstick_dark_fried_batter', sourceNdbNo: '5066', cookingYieldPercent: 82.369021, moistureChangePercent: -28.993868, fatChangePercent: 3.773121 },
  { fillClass: 'chicken_drumstick_dark_fried_flour', sourceNdbNo: '5066', cookingYieldPercent: 67.062315, moistureChangePercent: -34.415549, fatChangePercent: 0.000950 },
  { fillClass: 'chicken_drumstick_dark_roasted', sourceNdbNo: '5066', cookingYieldPercent: 77.430407, moistureChangePercent: -21.053953, fatChangePercent: -1.340814 },
  { fillClass: 'chicken_drumstick_dark_stewed', sourceNdbNo: '5066', cookingYieldPercent: 71.406003, moistureChangePercent: -25.960411, fatChangePercent: -1.602401 },

  // Chicken drumstick, meat only; nutrient-derived from raw NDB 5071 and cooked NDBs 5072 (fried), 5073 (roasted), and 5074 (stewed), respectively.
  { fillClass: 'chicken_drumstick_dark_fried', sourceNdbNo: '5071', cookingYieldPercent: 67.819706, moistureChangePercent: -34.569015, fatChangePercent: 1.769832 },
  { fillClass: 'chicken_drumstick_dark_roasted_meat_only', sourceNdbNo: '5071', cookingYieldPercent: 80.074257, moistureChangePercent: -20.784072, fatChangePercent: 0.854233 },
  { fillClass: 'chicken_drumstick_dark_stewed_meat_only', sourceNdbNo: '5071', cookingYieldPercent: 70.581818, moistureChangePercent: -29.080807, fatChangePercent: 0.320222 },
  { fillClass: 'chicken_drumstick_dark_rotisserie', sourceNdbNo: '5071', cookingYieldPercent: 67.536534, moistureChangePercent: -34.198215, fatChangePercent: 0.889238 },
  { fillClass: 'chicken_drumstick_dark_rotisserie_meat_and_skin', sourceNdbNo: '5066', cookingYieldPercent: 67.311988, moistureChangePercent: -32.220894, fatChangePercent: -1.136024 },

  // Beef brisket raw/cooked pairs from USDA FoodData Central group 1300.
  { fillClass: 'beef_brisket_whole_separable_lean_only_0in_braised', sourceNdbNo: '13023', cookingYieldPercent: 69.647058823529, moistureChangePercent: -42.817872176613, fatChangePercent: -4.743235693192 },
  { fillClass: 'beef_brisket_whole_separable_lean_and_fat_1_8in_braised', sourceNdbNo: '13803', cookingYieldPercent: 71.257253384913, moistureChangePercent: -42.158896155468, fatChangePercent: -8.404894652132 },
  { fillClass: 'beef_brisket_flat_separable_lean_and_fat_1_8in_braised', sourceNdbNo: '13805', cookingYieldPercent: 62.248438584316, moistureChangePercent: -44.696156138396, fatChangePercent: -48.304046946659 },
  { fillClass: 'beef_brisket_flat_separable_lean_only_1_8in_braised', sourceNdbNo: '23596', cookingYieldPercent: 65.067873303167, moistureChangePercent: -46.532486430247, fatChangePercent: 1.668552036199 },
  { fillClass: 'beef_brisket_point_separable_lean_and_fat_1_8in_braised', sourceNdbNo: '13807', cookingYieldPercent: 72.336065573770, moistureChangePercent: -41.730620960422, fatChangePercent: -6.321692009564 },
  { fillClass: 'beef_corned_brisket_cooked', sourceNdbNo: '13346', cookingYieldPercent: 80.792515134838, moistureChangePercent: -27.425112982092, fatChangePercent: 2.915566259008 },
];

export const USDA_YIELD_PROFILE_CLASSES = [...new Set(
  USDA_YIELD_PROFILE_CATALOG.map((profile) => profile.fillClass),
)];

export function matchingUsdaYieldProfile(
  fillClass: string,
  ndbNo: string,
): UsdaYieldProfile | undefined {
  return USDA_YIELD_PROFILE_CATALOG.find(
    (profile) => profile.fillClass === fillClass && String(ndbNo) === profile.sourceNdbNo,
  );
}

export function profileRetainedWater(
  profile: UsdaYieldProfile,
  rawGrams: number,
  rawWaterGrams: number,
): number {
  if (profile.moistureChangePercent == null) return rawWaterGrams;
  return Math.max(0, rawWaterGrams + rawGrams * profile.moistureChangePercent / 100);
}

export function profileFatLoss(profile: UsdaYieldProfile, rawGrams: number): number {
  if (profile.fatChangePercent == null || profile.fatChangePercent >= 0) return 0;
  return rawGrams * Math.abs(profile.fatChangePercent) / 100;
}