# USDA Fill-Class Implementation Matrix

This file defines the proposed fill-class taxonomy for the food forms represented in
`usda_cookingyields_meatpoultry.pdf`. It is a reviewable implementation matrix,
not an activation of uncalibrated nutrition coefficients.

## Dimensions

A class may encode the following dimensions when they affect cooked yield:

- species: beef, pork, lamb, chicken, turkey, fish, or shrimp
- form: crumbles, patty, steak, chop, roast, fillet, ribs, sausage, or bacon
- fat band: low (<10%), medium (10%-27%), or high (>27%) when the source row uses it
- poultry meat: light or dark
- bone status: bone-in or boneless
- cooking operation: pan-grilled, fried, roasted, baked, braised, or simmered

Bone status is required for bone-bearing cuts. It is especially important for ribs:
the ingredient weight may include a large non-edible bone fraction, while a boneless
row is an edible-meat weight. Bone status must not be represented only by a UI label.

Terminology normalization: “top roast” maps to `top_round_roast` because the USDA
cut name identifies the round; “prime rib” is retained as its own user-facing roast
label and is not treated as the same class as a ribeye steak. Both rib roast and
prime rib still require explicit bone-in or boneless selection.

Processed sliced/deli ham, turkey, and chicken are separate from raw cuts. They are
already cooked inputs and should use a no-heat class when assembled into a sandwich
or salad; applying a roasted or pan-grilled class would cook the same meat twice.

## Proposed Classes

The keys below are stable, machine-readable identifiers. The labels are the text
shown by the searchable fill-class selector.

| Key | UI label | Dimensions | Status |
| --- | --- | --- | --- |
| `beef_ground_crumbles_low_fat` | Beef, ground, crumbles, low fat (<10%) | beef, crumbles, low fat | Activated: NDB 23565 |
| `beef_ground_crumbles_medium_fat` | Beef, ground, crumbles, medium fat (10%-27%) | beef, crumbles, medium fat | Activated: NDB 23575 |
| `beef_ground_crumbles_high_fat` | Beef, ground, crumbles, high fat (>27%) | beef, crumbles, high fat | Activated: NDB 13494 |
| `beef_ground_patty_low_fat` | Beef, ground, patty, low fat (<10%) | beef, patty, low fat | Activated: NDB 23564 |
| `beef_ground_patty_medium_fat` | Beef, ground, patty, medium fat (10%-27%) | beef, patty, medium fat | Activated: NDB 23574 |
| `beef_ground_patty_high_fat` | Beef, ground, patty, high fat (>27%) | beef, patty, high fat | Activated: NDB 13496 |
| `pork_ground_crumbles_low_fat` | Pork, ground, crumbles, low fat (<10%) | pork, crumbles, low fat | Activated: NDB 10976 |
| `pork_ground_crumbles_medium_fat` | Pork, ground, crumbles, medium fat (10%-27%) | pork, crumbles, medium fat | Activated: NDB 10975 |
| `pork_ground_crumbles_high_fat` | Pork, ground, crumbles, high fat (>27%) | pork, crumbles, high fat | Activated: NDB 10974 |
| `pork_ground_patty_low_fat` | Pork, ground, patty, low fat (<10%) | pork, patty, low fat | Activated: NDB 10979 |
| `pork_ground_patty_medium_fat` | Pork, ground, patty, medium fat (10%-27%) | pork, patty, medium fat | Activated: NDB 10978 |
| `pork_ground_patty_high_fat` | Pork, ground, patty, high fat (>27%) | pork, patty, high fat | Activated: NDB 10977 |
| `chicken_ground_crumbles` | Chicken, ground, crumbles | chicken, crumbles | USDA pair required |
| `chicken_ground_patty` | Chicken, ground, patty | chicken, patty | USDA pair required |
| `turkey_ground_crumbles` | Turkey, ground, crumbles | turkey, crumbles | USDA pair required |
| `turkey_ground_patty` | Turkey, ground, patty | turkey, patty | USDA pair required |
| `lamb_ground_crumbles` | Lamb, ground, crumbles | lamb, crumbles | USDA pair required |
| `lamb_ground_patty` | Lamb, ground, patty | lamb, patty | USDA pair required |
| `chicken_breast_light_pan_grilled` | Chicken, breast, light meat, pan-grilled | chicken, light meat, boneless breast | USDA pair required |
| `chicken_thigh_dark_pan_grilled` | Chicken, thigh, dark meat, pan-grilled | chicken, dark meat, thigh | Activated: raw NDB 5096 paired to cooked NDB 5098 (meat only); 69% USDA yield, -30.00% moisture, +1.50% fat |
| `chicken_thigh_dark_fried` | Chicken, thigh, dark meat, fried, meat only | chicken, dark meat, thigh | Activated: raw NDB 5096 paired to cooked NDB 5097 (fried, meat only); 69.765791% protein-conservation yield, -34.841909% moisture, +3.065877% fat |
| `chicken_thigh_dark_roasted` | Chicken, thigh, dark meat, roasted | chicken, dark meat, thigh | Activated: raw NDB 5091 paired to cooked NDB 5094 (meat and skin); 71.023216% protein-conservation yield, -22.464015% moisture, -6.162485% fat |
| `chicken_thigh_dark_fried_batter` | Chicken, thigh, dark meat, fried batter | chicken, dark meat, thigh | Activated: raw NDB 5091 paired to cooked NDB 5092 (meat and skin); 76.446090% protein-conservation yield, -27.100264% moisture, -3.973461% fat |
| `chicken_thigh_dark_fried_flour` | Chicken, thigh, dark meat, fried flour | chicken, dark meat, thigh | Activated: raw NDB 5091 paired to cooked NDB 5093 (meat and skin); 61.757009% protein-conservation yield, -33.034755% moisture, -7.358800% fat |
| `chicken_thigh_dark_stewed` | Chicken, thigh, dark meat, stewed | chicken, dark meat, thigh | Activated: raw NDB 5091 paired to cooked NDB 5095 (meat and skin); 71.023216% protein-conservation yield, -21.647248% moisture, -6.141178% fat |
| `chicken_thigh_dark_rotisserie` | Chicken, thigh, dark meat, rotisserie, meat only | chicken, dark meat, thigh | Activated: raw NDB 5096 paired to cooked NDB 5345 (meat only, original seasoning); 81.712386% protein-conservation yield, -24.013957% moisture, +4.941904% fat |
| `chicken_thigh_dark_rotisserie_meat_and_skin` | Chicken, thigh, dark meat, rotisserie, meat and skin | chicken, dark meat, thigh | Activated: raw NDB 5091 paired to cooked NDB 5351 (meat and skin, original seasoning); 72.045355% protein-conservation yield, -22.997833% moisture, -5.298879% fat |
| `chicken_breast_light_rotisserie` | Chicken, breast, light meat, rotisserie, meat and skin | chicken, light meat, breast | Activated: raw NDB 5057 paired to cooked NDB 5348 (meat and skin, original seasoning); 75.873671% protein-conservation yield, -12.907132% moisture, -1.733457% fat |
| `chicken_breast_light_fried_batter` | Chicken, breast, light meat, fried batter, meat and skin | chicken, light meat, breast | Activated: raw NDB 5057 paired to cooked NDB 5058 (meat and skin); 83.937198% protein-conservation yield, -12.028295% moisture, +1.105230% fat |
| `chicken_breast_light_fried_flour` | Chicken, breast, light meat, fried flour, meat and skin | chicken, light meat, breast | Activated: raw NDB 5057 paired to cooked NDB 5059 (meat and skin); 65.493090% protein-conservation yield, -16.212817% moisture, -3.615128% fat |
| `chicken_breast_light_roasted` | Chicken, breast, light meat, roasted, meat and skin | chicken, light meat, breast | Activated: raw NDB 5057 paired to cooked NDB 5060 (meat and skin); 70.134228% protein-conservation yield, -6.091414% moisture, -3.787725% fat |
| `chicken_breast_light_stewed` | Chicken, breast, light meat, stewed, meat and skin | chicken, light meat, breast | Activated: raw NDB 5057 paired to cooked NDB 5061 (meat and skin); 76.373398% protein-conservation yield, -8.694558% moisture, -3.588933% fat |
| `chicken_breast_light_fried` | Chicken, breast, light meat, fried, meat only | chicken, light meat, breast | Activated: raw NDB 5062 paired to cooked NDB 5063 (meat only); 67.284689% protein-conservation yield, -33.387889% moisture, +0.549109% fat |
| `chicken_breast_light_roasted_meat_only` | Chicken, breast, light meat, roasted, meat only | chicken, light meat, breast | Activated: raw NDB 5062 paired to cooked NDB 5064 (meat only); 72.533849% protein-conservation yield, -26.564410% moisture, -0.030542% fat |
| `chicken_breast_light_stewed_meat_only` | Chicken, breast, light meat, stewed, meat only | chicken, light meat, breast | Activated: raw NDB 5062 paired to cooked NDB 5065 (meat only); 77.639752% protein-conservation yield, -20.895342% moisture, -0.267516% fat |
| `chicken_breast_light_rotisserie_meat_only` | Chicken, breast, light meat, rotisserie, meat only | chicken, light meat, breast | Activated: raw NDB 5062 paired to cooked NDB 5342 (meat only, original seasoning); 80.357143% protein-conservation yield, -19.072321% moisture, -0.378036% fat |
| `chicken_back_fried_batter` | Chicken, back, meat and skin, fried batter | chicken, back, meat and skin | Activated: raw NDB 5048 paired to cooked NDB 5049 (fried, batter); 63.950842% protein-conservation yield, -29.635480% moisture, -14.728371% fat |
| `chicken_back_fried_flour` | Chicken, back, meat and skin, fried flour | chicken, back, meat and skin | Activated: raw NDB 5048 paired to cooked NDB 5050 (fried, flour); 50.557755% protein-conservation yield, -35.874811% moisture, -18.254322% fat |
| `chicken_back_roasted` | Chicken, back, meat and skin, roasted | chicken, back, meat and skin | Activated: raw NDB 5048 paired to cooked NDB 5051 (roasted); 54.142582% protein-conservation yield, -29.122890% moisture, -17.386301% fat |
| `chicken_back_stewed` | Chicken, back, meat and skin, stewed | chicken, back, meat and skin | Activated: raw NDB 5048 paired to cooked NDB 5052 (stewed); 63.345356% protein-conservation yield, -19.503674% moisture, -17.249152% fat |
| `chicken_back_rotisserie_meat_and_skin` | Chicken, back, meat and skin, rotisserie | chicken, back, meat and skin | Activated: raw NDB 5048 paired to cooked NDB 5347 (rotisserie, original seasoning); 60.482135% protein-conservation yield, -23.963883% moisture, -17.496371% fat |
| `chicken_back_fried` | Chicken, back, meat only, fried | chicken, back, meat only | Activated: raw NDB 5053 paired to cooked NDB 5054 (fried); 65.221741% protein-conservation yield, -44.088353% moisture, +4.071971% fat |
| `chicken_back_roasted_meat_only` | Chicken, back, meat only, roasted | chicken, back, meat only | Activated: raw NDB 5053 paired to cooked NDB 5055 (roasted); 69.386307% protein-conservation yield, -34.545545% moisture, +3.211238% fat |
| `chicken_back_stewed_meat_only` | Chicken, back, meat only, stewed | chicken, back, meat only | Activated: raw NDB 5053 paired to cooked NDB 5056 (stewed); 77.281707% protein-conservation yield, -25.594678% moisture, +2.727823% fat |
| `chicken_back_rotisserie_meat_only` | Chicken, back, meat only, rotisserie | chicken, back, meat only | Activated: raw NDB 5053 paired to cooked NDB 5341 (rotisserie, original seasoning); 77.190213% protein-conservation yield, -28.038713% moisture, +2.987751% fat |
| `chicken_neck_fried_batter` | Chicken, neck, meat and skin, fried batter | chicken, neck, meat and skin | Activated: raw NDB 5084 paired to cooked NDB 5085 (fried, batter); 70.988900% protein-conservation yield, -26.682008% moisture, -9.543411% fat |
| `chicken_neck_fried_flour` | Chicken, neck, meat and skin, fried flour | chicken, neck, meat and skin | Activated: raw NDB 5084 paired to cooked NDB 5086 (fried, flour); 58.600583% protein-conservation yield, -32.160583% moisture, -12.404402% fat |
| `chicken_neck_simmered` | Chicken, neck, meat and skin, simmered | chicken, neck, meat and skin | Activated: raw NDB 5084 paired to cooked NDB 5087 (simmered); 71.749108% protein-conservation yield, -15.699276% moisture, -13.253412% fat |
| `chicken_neck_fried` | Chicken, neck, meat only, fried | chicken, neck, meat only | Activated: raw NDB 5088 paired to cooked NDB 5089 (fried); 65.314477% protein-conservation yield, -32.823870% moisture, -1.020640% fat |
| `chicken_neck_simmered_meat_only` | Chicken, neck, meat only, simmered | chicken, neck, meat only | Activated: raw NDB 5088 paired to cooked NDB 5090 (simmered); 71.457655% protein-conservation yield, -23.257643% moisture, -2.934764% fat |
| `chicken_drumstick_dark_roasted` | Chicken, drumstick, dark meat, roasted | chicken, dark meat, drumstick | Activated: raw NDB 5066 paired to cooked NDB 5069 (meat and skin); 77.430407% protein-conservation yield, -21.053953% moisture, -1.340814% fat |
| `chicken_drumstick_dark_fried_batter` | Chicken, drumstick, dark meat, fried batter | chicken, dark meat, drumstick | Activated: raw NDB 5066 paired to cooked NDB 5067 (meat and skin); 82.369021% protein-conservation yield, -28.993868% moisture, +3.773121% fat |
| `chicken_drumstick_dark_fried_flour` | Chicken, drumstick, dark meat, fried flour | chicken, dark meat, drumstick | Activated: raw NDB 5066 paired to cooked NDB 5068 (meat and skin); 67.062315% protein-conservation yield, -34.415549% moisture, +0.000950% fat |
| `chicken_drumstick_dark_stewed` | Chicken, drumstick, dark meat, stewed | chicken, dark meat, drumstick | Activated: raw NDB 5066 paired to cooked NDB 5070 (meat and skin); 71.406003% protein-conservation yield, -25.960411% moisture, -1.602401% fat |
| `chicken_drumstick_dark_fried` | Chicken, drumstick, dark meat, fried | chicken, dark meat, drumstick | Activated: raw NDB 5071 paired to cooked NDB 5072 (meat only); 67.819706% protein-conservation yield, -34.569015% moisture, +1.769832% fat |
| `chicken_drumstick_dark_roasted_meat_only` | Chicken, drumstick, dark meat, roasted, meat only | chicken, dark meat, drumstick | Activated: raw NDB 5071 paired to cooked NDB 5073 (meat only); 80.074257% protein-conservation yield, -20.784072% moisture, +0.854233% fat |
| `chicken_drumstick_dark_stewed_meat_only` | Chicken, drumstick, dark meat, stewed, meat only | chicken, dark meat, drumstick | Activated: raw NDB 5071 paired to cooked NDB 5074 (meat only); 70.581818% protein-conservation yield, -29.080807% moisture, +0.320222% fat |
| `chicken_drumstick_dark_rotisserie` | Chicken, drumstick, dark meat, rotisserie, meat only | chicken, dark meat, drumstick | Activated: raw NDB 5071 paired to cooked NDB 5343 (meat only, original seasoning); 67.536534% protein-conservation yield, -34.198215% moisture, +0.889238% fat |
| `chicken_drumstick_dark_rotisserie_meat_and_skin` | Chicken, drumstick, dark meat, rotisserie, meat and skin | chicken, dark meat, drumstick | Activated: raw NDB 5066 paired to cooked NDB 5349 (meat and skin, original seasoning); 67.311988% protein-conservation yield, -32.220894% moisture, -1.136024% fat |
| `chicken_wing_dark_fried_batter` | Chicken, wing, dark meat, fried batter | chicken, dark meat, wing | Activated: raw NDB 5100 paired to cooked NDB 5101 (fried, batter, meat and skin); 88.173125% protein-conservation yield, -28.445199% moisture, +6.380559% fat |
| `chicken_wing_dark_fried_flour` | Chicken, wing, dark meat, fried flour | chicken, dark meat, wing | Activated: raw NDB 5100 paired to cooked NDB 5102 (fried, flour, meat and skin); 67.100728% protein-conservation yield, -36.565626% moisture, +2.019521% fat |
| `chicken_wing_dark_roasted` | Chicken, wing, dark meat, roasted | chicken, dark meat, wing | Activated: raw NDB 5100 paired to cooked NDB 5103 (roasted, meat and skin); 73.644388% protein-conservation yield, -25.445233% moisture, -0.426192% fat |
| `chicken_wing_dark_stewed` | Chicken, wing, dark meat, stewed | chicken, dark meat, wing | Activated: raw NDB 5100 paired to cooked NDB 5104 (stewed, meat and skin); 76.909570% protein-conservation yield, -21.367629% moisture, +0.086190% fat |
| `chicken_wing_dark_fried` | Chicken, wing, dark meat, fried, meat only | chicken, dark meat, wing | Activated: raw NDB 5105 paired to cooked NDB 5106 (fried, flour, meat only); 72.868988% protein-conservation yield, -31.352484% moisture, +3.127512% fat |
| `chicken_wing_dark_roasted_meat_only` | Chicken, wing, dark meat, roasted, meat only | chicken, dark meat, wing | Activated: raw NDB 5105 paired to cooked NDB 5107 (roasted, meat only); 72.127380% protein-conservation yield, -29.668431% moisture, +2.323956% fat |
| `chicken_wing_dark_stewed_meat_only` | Chicken, wing, dark meat, stewed, meat only | chicken, dark meat, wing | Activated: raw NDB 5105 paired to cooked NDB 5108 (stewed, meat only); 80.831494% protein-conservation yield, -20.784816% moisture, +2.263701% fat |
| `chicken_gizzard_stewed` | Chicken, gizzard, all classes, poached/simmered/stewed | chicken, gizzard | Activated: raw NDB 5023 paired to cooked NDB 5024 (simmered); USDA Cooking Yield Data method: poached, simmered or stewed; 55% yield, -41.9% moisture, -0.6% fat |
| `chicken_liver_pan_grilled` | Chicken, liver, all classes, pan-fried/sauteed/stir-fried | chicken, liver | Activated: raw NDB 5027 paired to cooked NDB 5661 (pan-fried); USDA Cooking Yield Data method: fried in pan, sauteed, or stir-fried; 62% yield, -35.8% moisture, -0.8% fat |
| `turkey_gizzard_stewed` | Turkey, gizzard, all classes, poached/simmered/stewed | turkey, gizzard | Activated: USDA Cooking Yield Data NDB 5174; USDA Cooking Yield Data method: poached, simmered, or stewed; 85% yield, -14.3% moisture, -1.3% fat |
| `turkey_heart_stewed` | Turkey, heart, all classes, poached/simmered/stewed | turkey, heart | Activated: USDA Cooking Yield Data NDB 5176; USDA Cooking Yield Data method: poached, simmered, or stewed; 76% yield, -21.7% moisture, -1.3% fat |
| `turkey_liver_stewed` | Turkey, liver, all classes, poached/simmered/stewed | turkey, liver | Activated: USDA Cooking Yield Data NDB 5178; USDA Cooking Yield Data method: poached, simmered, or stewed; 83% yield, -15.2% moisture, +0.6% fat |
| `veal_liver_braised` | Veal, variety meats and by-products, liver, braised | veal, liver | Activated: USDA Cooking Yield Data NDB 17203; USDA Cooking Yield Data method: braised; 69% yield, -29.6% moisture, -0.5% fat |
| `veal_liver_pan_grilled` | Veal, variety meats and by-products, liver, fried in pan/sauteed/stir-fried | veal, liver | Activated: USDA Cooking Yield Data NDB 17204; USDA Cooking Yield Data method: fried in pan, sauteed, or stir-fried; 68% yield, -30.4% moisture, -0.5% fat |
| `veal_top_round_braised` | Veal, leg (top round), separable lean and fat, braised | veal, topside, top round | Activated: raw NDB 17094 paired to cooked NDB 17095; 58.019912% protein-conservation yield, -56.958223% moisture, +19.242221% fat |
| `veal_top_round_pan_fried_breaded` | Veal, leg (top round), separable lean and fat, pan-fried, breaded | veal, topside, top round | Activated: raw NDB 17094 paired to cooked NDB 17096; 76.877977% protein-conservation yield, -47.264585% moisture, +129.136309% fat |
| `veal_top_round_pan_fried_unbreaded` | Veal, leg (top round), separable lean and fat, pan-fried, not breaded | veal, topside, top round | Activated: raw NDB 17094 paired to cooked NDB 17097; 66.078740% protein-conservation yield, -48.462116% moisture, +79.142039% fat |
| `veal_top_round_roasted` | Veal, leg (top round), separable lean and fat, roasted | veal, topside, top round | Activated: raw NDB 17094 paired to cooked NDB 17098; 75.740072% protein-conservation yield, -33.069268% moisture, +14.347836% fat |
| `veal_loin_braised` | Veal, loin, separable lean and fat, braised | veal, loin | Activated: raw NDB 17104 paired to cooked NDB 17105; 66.478967% protein-conservation yield, -50.198217% moisture, +13.614996% fat |
| `veal_loin_roasted` | Veal, loin, separable lean and fat, roasted | veal, loin | Activated: raw NDB 17104 paired to cooked NDB 17106; 80.927419% protein-conservation yield, -29.223471% moisture, -0.990486% fat |
| `veal_loin_chop_grilled` | Veal, loin chop, separable lean and fat, grilled | veal, loin chop | Activated: raw NDB 17104 paired to cooked NDB 17437; 71.576320% protein-conservation yield, -36.700723% moisture, -32.617328% fat |
| `veal_hindshank_braised` | Veal, shank (fore and hind), separable lean and fat, braised | veal, hindshank | Activated: raw NDB 17276 paired to cooked NDB 17277; 60.716550% protein-conservation yield, -51.265733% moisture, +8.173165% fat |
| `veal_rib_braised` | Veal, rib, separable lean and fat, braised | veal, ribs, rib chop | Activated: raw NDB 17110 paired to cooked NDB 17111; 58.156028% protein-conservation yield, -56.409543% moisture, -19.123747% fat |
| `veal_rib_roasted` | Veal, rib, separable lean and fat, roasted | veal, ribs, rib chop | Activated: raw NDB 17110 paired to cooked NDB 17112; 78.714524% protein-conservation yield, -33.720490% moisture, +21.959463% fat |
| `veal_sirloin_braised` | Veal, sirloin, separable lean and fat, braised | veal, strip loin, sirloin | Activated: raw NDB 17134 paired to cooked NDB 17135; 61.004479% protein-conservation yield, -53.735086% moisture, +2.637497% fat |
| `veal_sirloin_roasted` | Veal, sirloin, separable lean and fat, roasted | veal, strip loin, sirloin | Activated: raw NDB 17134 paired to cooked NDB 17136; 75.855211% protein-conservation yield, -33.847077% moisture, +1.496409% fat |
| `veal_breast_braised` | Veal, breast, whole, boneless, separable lean and fat, braised | veal, breast | Activated: raw NDB 17271 paired to cooked NDB 17272; 64.775677% protein-conservation yield, -46.443046% moisture, -26.353349% fat |
| `veal_ground_broiled` | Veal, ground, broiled | veal, ground | Activated: raw NDB 17142 paired to cooked NDB 17143; 76.210008% protein-conservation yield, -23.098849% moisture, -55.884559% fat |
| `veal_ground_pan_fried` | Veal, ground, pan-fried | veal, ground | Activated: raw NDB 17142 paired to cooked NDB 17424; 71.931862% protein-conservation yield, -34.906883% moisture, -35.118121% fat |
| `pork_chitterlings_stewed` | Pork, fresh, variety meats and by-products, chitterlings, poached/simmered/stewed | pork, chitterlings | Activated: USDA Cooking Yield Data NDB 10099; USDA Cooking Yield Data method: poached, simmered, or stewed; 39% yield, -49.9% moisture, -8.8% fat |
| `pork_feet_stewed` | Pork, fresh, variety meats and by-products, feet, poached/simmered/stewed | pork, feet | Activated: USDA Cooking Yield Data NDB 10173; USDA Cooking Yield Data method: poached, simmered, or stewed; 36% yield, -42.6% moisture, -6.9% fat |
| `pork_stomach_stewed` | Pork, fresh, variety meats and by-products, stomach, poached/simmered/stewed | pork, stomach | Activated: USDA Cooking Yield Data NDB 10863; USDA Cooking Yield Data method: poached, simmered, or stewed; 69% yield, -24.8% moisture, -5.1% fat |
| `beef_brain_stewed` | Beef, variety meats and by-products, brain, poached/simmered/stewed | beef, brain | Activated: USDA Cooking Yield Data NDB 13320; USDA Cooking Yield Data method: poached, simmered, or stewed; 85% yield, -12.8% moisture, -1.4% fat |
| `beef_heart_stewed` | Beef, variety meats and by-products, heart, poached/simmered/stewed | beef, heart | Activated: USDA Cooking Yield Data NDB 13322; USDA Cooking Yield Data method: poached, simmered, or stewed; 57% yield, -40.0% moisture, -1.3% fat |
| `beef_kidneys_stewed` | Beef, variety meats and by-products, kidneys, poached/simmered/stewed | beef, kidneys | Activated: USDA Cooking Yield Data NDB 13324; USDA Cooking Yield Data method: poached, simmered, or stewed; 53% yield, -42.7% moisture, -0.6% fat |
| `beef_liver_braised` | Beef, variety meats and by-products, liver, braised | beef, liver | Activated: USDA Cooking Yield Data NDB 13326; USDA Cooking Yield Data method: braised; 68% yield, -30.6% moisture, -0.04% fat |
| `beef_liver_pan_grilled` | Beef, variety meats and by-products, liver, fried in pan/sauteed/stir-fried | beef, liver | Activated: USDA Cooking Yield Data NDB 13327; USDA Cooking Yield Data method: fried in pan, sauteed, or stir-fried; 73% yield, -25.7% moisture, -0.2% fat |
| `beef_tripe_stewed` | Beef, variety meats and by-products, tripe, poached/simmered/stewed | beef, tripe | Activated: USDA Cooking Yield Data NDB 23640; USDA Cooking Yield Data method: poached, simmered, or stewed; 70% yield, -27.3% moisture, -0.9% fat |
| `turkey_whole_meat_and_skin_roasted` | Turkey, whole, meat and skin, roasted | turkey, whole, meat and skin | Activated: DataCentralCombo raw NDB 5165 paired to cooked NDB 5166; 75.796848% protein-conservation yield, -33.765088% moisture, -0.684627% fat |
| `turkey_whole_meat_only_roasted` | Turkey, whole, meat only, roasted | turkey, whole, meat only | Activated: DataCentralCombo raw NDB 5167 paired to cooked NDB 5168; 77.907777% protein-conservation yield, -31.054150% moisture, +55.008220% fat |
| `turkey_light_meat_and_skin_roasted` | Turkey from whole, light meat, meat and skin, roasted | turkey, light meat, meat and skin | Activated: DataCentralCombo raw NDB 5181 paired to cooked NDB 5182; 74.314721% protein-conservation yield, -31.878173% moisture, -44.288964% fat |
| `turkey_light_meat_only_roasted` | Turkey from whole, light meat, roasted | turkey, light meat | Activated: DataCentralCombo raw NDB 5185 paired to cooked NDB 5186; 78.526386% protein-conservation yield, -28.823994% moisture, +10.361407% fat |
| `turkey_dark_meat_and_skin_roasted` | Turkey, dark meat, meat and skin, roasted | turkey, dark meat, meat and skin | Activated: DataCentralCombo raw NDB 5183 paired to cooked NDB 5184; 72.643931% protein-conservation yield, -37.001058% moisture, -19.419497% fat |
| `turkey_dark_meat_only_roasted` | Turkey from whole, dark meat, roasted | turkey, dark meat | Activated: DataCentralCombo raw NDB 5187 paired to cooked NDB 5188; 76.795381% protein-conservation yield, -34.096005% moisture, +85.537640% fat |
| `turkey_ground_crumbles_pan_broiled` | Ground turkey, 93% lean, 7% fat, pan-broiled crumbles | ground turkey, 93% lean, 7% fat | Activated: DataCentralCombo raw NDB 5665 paired to cooked NDB 5666; 69.114391% protein-conservation yield, -41.905086% moisture, -3.869672% fat |
| `turkey_ground_patty_broiled` | Ground turkey, 93% lean, 7% fat, patties, broiled | ground turkey, 93% lean, 7% fat | Activated: DataCentralCombo raw NDB 5665 paired to cooked NDB 5667; 72.428461% protein-conservation yield, -37.753208% moisture, -0.562844% fat |
| `turkey_ground_85_15_crumbles_pan_broiled` | Ground turkey, 85% lean, 15% fat, pan-broiled crumbles | ground turkey, 85% lean, 15% fat | Activated: DataCentralCombo raw NDB 5668 paired to cooked NDB 5669; 67.303863% protein-conservation yield, -45.319230% moisture, -6.343508% fat |
| `turkey_ground_85_15_patty_broiled` | Ground turkey, 85% lean, 15% fat, patties, broiled | ground turkey, 85% lean, 15% fat | Activated: DataCentralCombo raw NDB 5668 paired to cooked NDB 5670; 65.301391% protein-conservation yield, -45.457327% moisture, -15.639351% fat |
| `turkey_breast_meat_and_skin_roasted` | Turkey, all classes, breast, meat and skin, roasted | turkey, breast, meat and skin | Activated: DataCentralCombo raw NDB 5191 paired to cooked NDB 5192; 76.245211% protein-conservation yield, -31.188833% moisture, -19.518944% fat |
| `turkey_leg_meat_and_skin_roasted` | Turkey, all classes, leg, meat and skin, roasted | turkey, leg, meat and skin | Activated: DataCentralCombo raw NDB 5193 paired to cooked NDB 5194; 70.111231% protein-conservation yield, -40.980792% moisture, +2.454209% fat |
| `turkey_wing_meat_and_skin_roasted` | Turkey, all classes, wing, meat and skin, roasted | turkey, wing, meat and skin | Activated: DataCentralCombo raw NDB 5195 paired to cooked NDB 5196; 73.849525% protein-conservation yield, -33.925278% moisture, -25.491104% fat |
| `turkey_breast_light_roasted` | Turkey, breast, light meat, roasted | turkey, light meat, breast | USDA pair required |
| `turkey_thigh_dark_roasted` | Turkey, thigh, dark meat, roasted | turkey, dark meat, thigh | USDA pair required |
| `turkey_drumstick_dark_roasted` | Turkey, drumstick, dark meat, roasted | turkey, dark meat, drumstick | USDA pair required |
| `pork_spareribs_bone_in_roasted` | Pork, spareribs, bone-in, roasted | pork, ribs, bone-in | Activated: NDB 10940 |
| `pork_spareribs_boneless_braised` | Pork, spareribs, boneless, braised | pork, ribs, boneless | USDA pair required |
| `pork_back_ribs_bone_in_roasted` | Pork, back ribs, bone-in, roasted | pork, ribs, bone-in | Activated: NDB 10193 |
| `pork_back_ribs_bone_in_lean_only_roasted` | Pork, back ribs, bone-in, lean only, roasted | pork, ribs, bone-in, lean only | Activated: NDB 10981 |
| `pork_country_style_ribs_bone_in_braised` | Pork, country-style ribs, bone-in, braised | pork, ribs, bone-in | USDA pair required |
| `pork_country_style_ribs_boneless_braised` | Pork, country-style ribs, boneless, braised | pork, ribs, boneless | Activated: NDB 10208 |
| `pork_leg_sirloin_tip_roast_boneless_braised` | Pork, leg sirloin tip roast, boneless, braised | pork, roast, boneless | Activated: NDB 10962 |
| `pork_sirloin_chop_bone_in_braised` | Pork, sirloin chop, bone-in, braised | pork, chop, bone-in | Activated: NDB 10053 |
| `pork_sirloin_chop_bone_in_lean_only_braised` | Pork, sirloin chop, bone-in, lean only, braised | pork, chop, bone-in, lean only | Activated: NDB 10057 |
| `pork_sirloin_chop_boneless_braised` | Pork, sirloin chop, boneless, braised | pork, chop, boneless | Activated: NDB 10211 |
| `pork_sirloin_chop_boneless_lean_only_braised` | Pork, sirloin chop, boneless, lean only, braised | pork, chop, boneless, lean only | Activated: NDB 10215 |
| `beef_short_ribs_bone_in_braised` | Beef, short ribs, bone-in, braised | beef, ribs, bone-in | USDA pair required |
| `beef_short_ribs_boneless_braised` | Beef, short ribs, boneless, braised | beef, ribs, boneless | Activated: NDB 23125 |
| `beef_flank_steak_boneless_pan_grilled` | Beef, flank steak, boneless, pan-grilled | beef, flank steak, boneless | Activated: NDB 13948 |
| `beef_inside_skirt_steak_boneless_grilled` | Beef, inside skirt steak, boneless, grilled | beef, inside skirt steak, boneless | Activated: NDB 23214 |
| `beef_skirt_steak_boneless_pan_grilled` | Beef, skirt steak, boneless, pan-grilled | beef, skirt steak, boneless | Activated: NDB 23221 |
| `beef_ribeye_steak_boneless_pan_grilled` | Beef, ribeye steak, boneless, pan-grilled | beef, ribeye steak, boneless | Activated: NDB 23227 |
| `beef_tenderloin_steak_boneless_pan_grilled` | Beef, tenderloin steak, boneless, pan-grilled | beef, tenderloin steak, boneless | Activated: NDB 13918 |
| `beef_top_round_steak_boneless_grilled` | Beef, top round steak, boneless, grilled | beef, top round steak, boneless | Activated: NDB 13893 |
| `beef_top_loin_steak_boneless_grilled` | Beef, top loin steak, boneless, grilled | beef, top loin steak, boneless | Activated: NDB 13910 |
| `beef_strip_steak_boneless_pan_grilled` | Beef, strip steak, boneless, pan-grilled | beef, strip steak, boneless | Activated: NDB 13910; USDA names this sample short loin, top loin, steak, separable lean and fat, trimmed to 1/8\" fat, all grades; broiled or grilled; 82% yield, -24.8% moisture, -4.0% fat |
| `beef_top_sirloin_steak_boneless_pan_grilled` | Beef, top sirloin steak, boneless, pan-grilled | beef, top sirloin steak, boneless | Activated: NDB 13930 |
| `beef_round_steak_boneless_pan_grilled` | Beef, round steak, boneless, pan-grilled | beef, round steak, boneless | Activated: NDB 13893; USDA names this sample round, top round steak, separable lean and fat, trimmed to 1/8\" fat, all grades; broiled or grilled; 72% yield, -28.4% moisture, -1.8% fat |
| `beef_flat_iron_steak_boneless_pan_grilled` | Beef, flat iron steak, boneless, pan-grilled | beef, flat iron steak, boneless | Activated: NDB 23060; flat iron synonym for USDA chuck, shoulder clod, top blade steak, separable lean and fat, trimmed to 0\" fat, all grades; broiled or grilled; 76% yield, -23.2% moisture, -0.8% fat |
| `beef_t_bone_steak_bone_in_pan_grilled` | Beef, T-bone steak, bone-in, pan-grilled (CALC) | beef, T-bone steak, bone-in | Activated: raw NDB 13907; 10:1 strip:tenderloin edible-meat ratio; 17.5% bone excluded; yield 81.82%, moisture -24.51%, fat -4.17% |
| `beef_porterhouse_steak_bone_in_pan_grilled` | Beef, porterhouse steak, bone-in, pan-grilled (CALC) | beef, porterhouse steak, bone-in | Activated: raw NDB 13905; 3:1 strip:tenderloin edible-meat ratio; 25% tenderloin; 17.5% bone excluded; yield 81.50%, moisture -23.93%, fat -4.48% |
| `beef_shoulder_steak_boneless_grilled` | Beef, shoulder steak, boneless, grilled | beef, shoulder steak, boneless | Activated: NDB 23554 |
| `beef_mock_tender_steak_boneless_braised` | Beef, mock tender steak, boneless, braised | beef, mock tender steak, boneless | Activated: NDB 23119 |
| `beef_shoulder_clod_tender_medallion_boneless_grilled` | Beef, shoulder clod tender medallion, boneless, grilled | beef, shoulder clod tender medallion, boneless | Activated: NDB 23054 |
| `beef_shoulder_clod_top_center_steak_boneless_grilled` | Beef, shoulder clod top and center steak, boneless, grilled | beef, shoulder clod top and center steak, boneless | Activated: NDB 23058 |
| `beef_top_blade_steak_boneless_grilled` | Beef, top blade steak, boneless, grilled | beef, top blade steak, boneless | Activated: NDB 23060 |
| `beef_denver_steak_boneless_grilled` | Beef, Denver steak, boneless, grilled | beef, Denver steak, boneless | Activated: NDB 23105 |
| `beef_underblade_pot_roast_boneless_braised` | Beef, underblade pot roast, boneless, braised | beef, underblade pot roast, boneless | Activated: NDB 23099 |
| `beef_underblade_steak_boneless_braised` | Beef, underblade steak, boneless, braised | beef, underblade steak, boneless | Activated: NDB 23116 |
| `beef_tri_tip_roast_boneless_roasted` | Beef, tri-tip roast, boneless, roasted | beef, tri-tip roast, boneless | Activated: NDB 13953 |
| `beef_tri_tip_roast_lean_only_roasted` | Beef, tri-tip roast, lean only, roasted | beef, tri-tip roast, lean only | Activated: NDB 13985 |
| `beef_chuck_eye_roast_boneless_roasted` | Beef, chuck-eye roast, boneless, roasted | beef, chuck-eye roast, boneless | Activated: NDB 23113 |
| `beef_round_tip_roast_boneless_roasted` | Beef, round-tip roast, boneless, roasted | beef, round-tip roast, boneless | Activated: NDB 13421 |
| `beef_bottom_round_roast_boneless_roasted` | Beef, bottom-round roast, boneless, roasted | beef, bottom-round roast, boneless | Activated: NDB 13870 |
| `beef_shoulder_pot_roast_boneless_braised` | Beef, shoulder pot roast, boneless, braised | beef, shoulder pot roast, boneless | Activated: NDB 23131 |
| `beef_rib_eye_roast_bone_in_roasted` | Beef, rib-eye roast, bone-in, roasted | beef, rib-eye roast, bone-in | Activated: NDB 23191 |
| `beef_rib_eye_roast_boneless_roasted` | Beef, rib-eye roast, boneless, roasted | beef, rib-eye roast, boneless | Activated: NDB 23198 |
| `beef_chuck_roast_boneless_roasted` | Beef, chuck roast, boneless, roasted | beef, chuck roast, boneless | USDA pair required |
| `beef_pot_roast_boneless_braised` | Beef, pot roast, boneless, braised | beef, pot roast, boneless | Activated: NDB 13373 |
| `beef_eye_of_round_roast_boneless_roasted` | Beef, eye of round roast, boneless, roasted | beef, eye of round roast, boneless | Activated: NDB 13878 |
| `beef_rib_roast_bone_in_roasted` | Beef, rib roast, bone-in, roasted | beef, rib roast, bone-in | USDA pair required |
| `beef_rib_roast_boneless_roasted` | Beef, rib roast, boneless, roasted | beef, rib roast, boneless | USDA pair required |
| `beef_top_round_roast_boneless_roasted` | Beef, top round roast, boneless, roasted | beef, top round roast, boneless | USDA pair required |
| `beef_rump_roast_boneless_roasted` | Beef, rump roast, boneless, roasted | beef, rump roast, boneless | USDA pair required |
| `beef_sirloin_tip_roast_boneless_roasted` | Beef, sirloin tip roast, boneless, roasted | beef, sirloin tip roast, boneless | USDA pair required |
| `beef_prime_rib_bone_in_roasted` | Beef, prime rib, bone-in, roasted | beef, prime rib, bone-in | USDA pair required |
| `beef_prime_rib_boneless_roasted` | Beef, prime rib, boneless, roasted | beef, prime rib, boneless | USDA pair required |
| `pork_chop_bone_in_pan_grilled` | Pork, chop, bone-in, pan-grilled | pork, chop, bone-in | Activated: NDB 10178 |
| `pork_chop_boneless_pan_grilled` | Pork, chop, boneless, pan-grilled | pork, chop, boneless | Activated: NDB 10212 |
| `pork_blade_chop_boneless_lean_only_pan_grilled` | Pork, blade chop, boneless, lean only, pan-grilled | pork, blade chop, boneless, lean only | Activated: NDB 10984 |
| `pork_leg_rump_half_lean_only_roasted` | Pork, leg (ham), rump half, lean only, roasted | pork, leg, rump half, lean only | Activated: NDB 10015 |
| `pork_leg_shank_half_lean_only_roasted` | Pork, leg (ham), shank half, lean only, roasted | pork, leg, shank half, lean only | Activated: NDB 10019 |
| `pork_blade_chop_bone_in_braised` | Pork, blade chop, bone-in, braised | pork, blade chop, bone-in | Activated: NDB 10029 |
| `pork_blade_chop_bone_in_pan_grilled` | Pork, blade chop, bone-in, pan-grilled | pork, blade chop, bone-in | Activated: NDB 10030 |
| `pork_center_loin_chop_bone_in_braised` | Pork, center loin chop, bone-in, braised | pork, center loin chop, bone-in | Activated: NDB 10037 |
| `pork_center_loin_chop_bone_in_lean_only_braised` | Pork, center loin chop, bone-in, lean only, braised | pork, center loin chop, bone-in, lean only | Activated: NDB 10041 |
| `pork_center_loin_chop_bone_in_lean_only_pan_grilled` | Pork, center loin chop, bone-in, lean only, pan-grilled | pork, center loin chop, bone-in, lean only | Activated: NDB 10042 |
| `pork_shoulder_boneless_roasted` | Pork, shoulder, boneless, roasted | pork, shoulder, boneless | USDA pair required |
| `pork_shoulder_bone_in_roasted` | Pork, shoulder, bone-in, roasted | pork, shoulder, bone-in | USDA pair required |
| `pork_tenderloin_boneless_roasted` | Pork, tenderloin, boneless, roasted | pork, tenderloin, boneless | USDA pair required |
| `pork_porterhouse_chop_bone_in_pan_grilled` | Pork, porterhouse chop, bone-in, pan-grilled | pork, porterhouse chop, bone-in | USDA pair required |
| `pork_cured_ham_boneless_roasted` | Pork, cured ham, boneless, roasted | pork, cured ham, boneless | Activated: NDB 10883 |
| `pork_blade_roast_bone_in_roasted` | Pork, blade roast, bone-in, roasted | pork, blade roast, bone-in | Activated: NDB 10031 |
| `pork_blade_roast_boneless_roasted` | Pork, blade roast, boneless, roasted | pork, blade roast, boneless | Activated: NDB 10990 |
| `pork_blade_roast_bone_in_lean_only_roasted` | Pork, blade roast, bone-in, lean only, roasted | pork, blade roast, bone-in, lean only | Activated: NDB 10035 |
| `pork_blade_roast_boneless_lean_only_roasted` | Pork, blade roast, boneless, lean only, roasted | pork, blade roast, boneless, lean only | Activated: NDB 10983 |
| `pork_center_loin_roast_bone_in_roasted` | Pork, center loin roast, bone-in, roasted | pork, center loin roast, bone-in | Activated: NDB 10039 |
| `pork_center_loin_roast_bone_in_lean_only_roasted` | Pork, center loin roast, bone-in, lean only, roasted | pork, center loin roast, bone-in, lean only | Activated: NDB 10043 |
| `pork_center_rib_roast_bone_in_roasted` | Pork, center rib roast, bone-in, roasted | pork, center rib roast, bone-in | Activated: NDB 10047 |
| `pork_center_rib_roast_bone_in_lean_only_roasted` | Pork, center rib roast, bone-in, lean only, roasted | pork, center rib roast, bone-in, lean only | Activated: NDB 10051 |
| `pork_tenderloin_lean_only_roasted` | Pork, tenderloin, lean only, roasted | pork, tenderloin, lean only | Activated: NDB 10061 |
| `pork_top_loin_roast_lean_only_roasted` | Pork, top loin roast, lean only, roasted | pork, top loin roast, lean only | Activated: NDB 10069 |
| `pork_ham_sliced_deli_no_heat` | Pork, ham, sliced/deli, no heat | pork, cured ham, sliced/deli | Existing cooked/cured input; no second cook |
| `turkey_sliced_deli_no_heat` | Turkey, sliced/deli, no heat | turkey, sliced/deli | Existing cooked input; no second cook |
| `chicken_sliced_deli_no_heat` | Chicken, sliced/deli, no heat | chicken, sliced/deli | USDA pair required |
| `lamb_foreshank_meat_and_fat_braised` | Lamb, domestic, foreshank, separable lean and fat, braised | lamb, foreshank, meat and fat | Activated: DataCentralCombo raw NDB 17007 paired to cooked NDB 17008; 66.654917% protein-conservation yield, -43.500981% moisture, -32.946548% fat |
| `lamb_leg_shank_half_meat_and_fat_roasted` | Lamb, domestic, leg shank half, separable lean and fat, roasted | lamb, leg shank half, meat and fat | Activated: DataCentralCombo raw NDB 17015 paired to cooked NDB 17016; 70.352139% protein-conservation yield, -36.466268% moisture, -35.071599% fat |
| `lamb_leg_sirloin_half_meat_and_fat_roasted` | Lamb, domestic, leg sirloin half, separable lean and fat, roasted | lamb, leg sirloin half, meat and fat | Activated: DataCentralCombo raw NDB 17019 paired to cooked NDB 17020; 68.777913% protein-conservation yield, -38.259562% moisture, -35.701517% fat |
| `lamb_loin_meat_and_fat_broiled` | Lamb, domestic, loin, separable lean and fat, broiled | lamb, loin, meat and fat | Activated: DataCentralCombo raw NDB 17023 paired to cooked NDB 17024; 64.839094% protein-conservation yield, -40.870874% moisture, -43.804495% fat |
| `lamb_loin_meat_and_fat_roasted` | Lamb, domestic, loin, separable lean and fat, roasted | lamb, loin, meat and fat | Activated: DataCentralCombo raw NDB 17023 paired to cooked NDB 17025; 72.372506% protein-conservation yield, -32.810671% moisture, -35.889320% fat |
| `lamb_shoulder_meat_and_fat_braised` | Lamb, domestic, whole shoulder, separable lean and fat, braised | lamb, shoulder, meat and fat | Activated: DataCentralCombo raw NDB 17035 paired to cooked NDB 17036; 57.810321% protein-conservation yield, -57.435633% moisture, -33.834808% fat |
| `lamb_shoulder_meat_and_fat_roasted` | Lamb, domestic, whole shoulder, separable lean and fat, roasted | lamb, shoulder, meat and fat | Activated: DataCentralCombo raw NDB 17035 paired to cooked NDB 17038; 73.656153% protein-conservation yield, -32.498857% moisture, -31.425950% fat |
| `lamb_stew_cubes_lean_only_braised` | Lamb, domestic, cubed for stew or kabob, separable lean only, braised | lamb, cubed, lean only | Activated: DataCentralCombo raw NDB 17059 paired to cooked NDB 17060; 59.988127% protein-conservation yield, -54.256409% moisture, -0.019788% fat |
| `lamb_new_zealand_leg_chop_bone_in_meat_and_fat_fast_fried` | Lamb, New Zealand, leg chop/steak, bone-in, separable lean and fat, fast fried | lamb, leg chop, bone-in, meat and fat | Activated: raw NDB 17072 paired to cooked NDB 17405; 76.834295% protein-conservation yield, -27.309577% moisture, -32.478953% fat |
| `lamb_new_zealand_leg_chop_bone_in_lean_only_fast_fried` | Lamb, New Zealand, leg chop/steak, bone-in, separable lean only, fast fried | lamb, leg chop, bone-in, lean only | Activated: raw NDB 17074 paired to cooked NDB 17400; 80.197643% protein-conservation yield, -27.126391% moisture, +9.753241% fat |
| `lamb_new_zealand_loin_chop_meat_and_fat_broiled` | Lamb, New Zealand, loin chop, separable lean and fat, broiled | lamb, loin chop, meat and fat | Activated: raw NDB 17076 paired to cooked NDB 17077; 65.727700% protein-conservation yield, -41.724290% moisture, -40.069589% fat |
| `lamb_new_zealand_loin_chop_lean_only_broiled` | Lamb, New Zealand, loin chop, separable lean only, broiled | lamb, loin chop, lean only | Activated: raw NDB 17078 paired to cooked NDB 17079; 68.167861% protein-conservation yield, -41.895014% moisture, -18.357097% fat |
| `lamb_new_zealand_loin_chop_meat_and_fat_fast_fried` | Lamb, New Zealand, loin chop, separable lean and fat, fast fried | lamb, loin chop, meat and fat | Activated: raw NDB 17076 paired to cooked NDB 17406; 71.627907% protein-conservation yield, -36.895927% moisture, -25.855954% fat |
| `lamb_new_zealand_partly_frenched_rack_meat_and_fat_fast_roasted` | Lamb, New Zealand, partly frenched rack, separable lean and fat, fast roasted | lamb, partly frenched rack, meat and fat | Activated: raw NDB 17080 paired to cooked NDB 17081; 82.139619% protein-conservation yield, -21.942503% moisture, -18.880473% fat |
| `lamb_new_zealand_partly_frenched_rack_lean_only_fast_roasted` | Lamb, New Zealand, partly frenched rack, separable lean only, fast roasted | lamb, partly frenched rack, lean only | Activated: raw NDB 17082 paired to cooked NDB 17083; 84.527221% protein-conservation yield, -21.826762% moisture, +4.358229% fat |
| `lamb_new_zealand_fully_frenched_rack_lean_only_fast_roasted` | Lamb, New Zealand, fully frenched rack, separable lean only, fast roasted | lamb, fully frenched rack, lean only | Activated: raw NDB 17397 paired to cooked NDB 17396; 84.501845% protein-conservation yield, -21.357987% moisture, -0.544177% fat |
| `lamb_new_zealand_fully_frenched_rack_meat_and_fat_fast_roasted` | Lamb, New Zealand, fully frenched rack, separable lean and fat, fast roasted | lamb, fully frenched rack, meat and fat | Activated: raw NDB 17420 paired to cooked NDB 17419; 84.380306% protein-conservation yield, -21.408477% moisture, -5.114516% fat |
| `lamb_australian_sirloin_chop_boneless_meat_and_fat_broiled` | Lamb, Australian, boneless leg sirloin chop, separable lean and fat, broiled | lamb, sirloin chop, boneless, meat and fat | Activated: raw NDB 17302 paired to cooked NDB 17303; 71.184466% protein-conservation yield, -36.172469% moisture, -31.538167% fat |
| `lamb_australian_sirloin_chop_boneless_lean_only_broiled` | Lamb, Australian, boneless leg sirloin chop, separable lean only, broiled | lamb, sirloin chop, boneless, lean only | Activated: raw NDB 17304 paired to cooked NDB 17305; 73.941368% protein-conservation yield, -36.083059% moisture, +17.462866% fat |
| `lamb_australian_frenched_rib_chop_bone_in_meat_and_fat_grilled` | Lamb, Australian, frenched bone-in rib chop/rack roast, separable lean and fat, grilled | lamb, frenched rib chop, bone-in, meat and fat | Activated: raw NDB 17314 paired to cooked NDB 17315; 74.648876% protein-conservation yield, -40.085407% moisture, -6.302180% fat |
| `lamb_australian_frenched_rib_chop_bone_in_lean_only_grilled` | Lamb, Australian, frenched bone-in rib chop/rack roast, separable lean only, grilled | lamb, frenched rib chop, bone-in, lean only | Activated: raw NDB 17316 paired to cooked NDB 17317; 74.844527% protein-conservation yield, -40.181723% moisture, +56.383556% fat |
| `fish_fillet_boneless_pan_grilled` | Fish, fillet, boneless, pan-grilled | fish, fillet, boneless | USDA pair required |
| `fish_fillet_boneless_breaded_fried` | Fish, fillet, boneless, breaded, fried | fish, fillet, boneless | USDA pair required |
| `shrimp_boneless_breaded_fried` | Shrimp, peeled, breaded, fried | shrimp, peeled | USDA pair required |
| `pork_sausage_high_fat_pan_fried` | Pork, sausage, high fat, pan-fried | pork, sausage, high fat | Activated: NDB 7064 |
| `bacon_pan_fried` | Pork, bacon, pan-fried | pork, bacon | Activated: NDB 10862 |
| `bison_chuck_shoulder_braised` | Bison, chuck shoulder clod, separable lean only, braised | game, shoulder | Activated: raw NDB 17334 paired to cooked NDB 17333; 62.522202% protein-conservation yield, -49.915989% moisture, +7.776368% fat |
| `bison_ground_grilled` | Bison, ground, broiled or grilled | game, ground | Activated: USDA Cooking Yield Data NDB 17331; 77% yield, -18.2% moisture, -4.2% fat |
| `bison_top_round_grilled` | Bison, top round steak, separable lean only, broiled or grilled | game, top round | Activated: raw NDB 17337 paired to cooked NDB 17336; 77.269715% protein-conservation yield, -31.998471% moisture, +57.719254% fat |
| `deer_ground_grilled` | Deer, ground, broiled or grilled | game, ground | Activated: USDA Cooking Yield Data NDB 17344; 83% yield, -17.7% moisture, -0.1% fat |
| `elk_ground_grilled` | Elk, ground, broiled or grilled | game, ground | Activated: USDA Cooking Yield Data NDB 17339; 84% yield, -15.0% moisture, -1.5% fat |
| `ostrich_ground_grilled` | Ostrich, ground, cooked, pan-broiled | ostrich, ground | Activated: raw NDB 5641 paired to cooked NDB 5642; 77.323136% protein-conservation yield, -26.974407% moisture, -37.163843% fat |
| `game_antelope_roasted` | Game meat, antelope, cooked, roasted | game, antelope | Activated: raw NDB 17144 paired to cooked NDB 17145; 75.993209% protein-conservation yield, -32.398050% moisture, -0.048341% fat |
| `game_bear_simmered` | Game meat, bear, cooked, simmered | game, bear | Activated: raw NDB 17146 paired to cooked NDB 17147; 61.998766% protein-conservation yield, -53.370310% moisture, +0.019696% fat |
| `game_beaver_roasted` | Game meat, beaver, cooked, roasted | game, beaver | Activated: raw NDB 17150 paired to cooked NDB 17151; 69.010043% protein-conservation yield, -43.679559% moisture, +0.064562% fat |
| `game_beefalo_roasted` | Game meat, beefalo, composite of cuts, cooked, roasted | game, beefalo | Activated: raw NDB 17152 paired to cooked NDB 17153; 75.994781% protein-conservation yield, -33.856989% moisture, +0.059796% fat |
| `game_bison_lean_roasted` | Game meat, bison, separable lean only, cooked, roasted | game, bison | Activated: raw NDB 17156 paired to cooked NDB 17157; 76.019692% protein-conservation yield, -32.166418% moisture, -0.017581% fat |
| `game_boar_roasted` | Game meat, boar, wild, cooked, roasted | game, boar | Activated: raw NDB 17158 paired to cooked NDB 17159; 76.007067% protein-conservation yield, -33.077318% moisture, -0.026741% fat |
| `game_buffalo_roasted` | Game meat, buffalo, water, cooked, roasted | game, buffalo | Activated: raw NDB 17160 paired to cooked NDB 17161; 75.997018% protein-conservation yield, -31.463239% moisture, -0.149903% fat |
| `game_caribou_roasted` | Game meat, caribou, cooked, roasted | game, caribou | Activated: raw NDB 17162 paired to cooked NDB 17163; 76.016124% protein-conservation yield, -33.580314% moisture, -0.002599% fat |
| `game_deer_roasted` | Game meat, deer, cooked, roasted | game, deer | Activated: raw NDB 17164 paired to cooked NDB 17165; 76.001323% protein-conservation yield, -32.614294% moisture, +0.183564% fat |
| `game_elk_roasted` | Game meat, elk, cooked, roasted | game, elk | Activated: raw NDB 17166 paired to cooked NDB 17167; 76.018549% protein-conservation yield, -32.259889% moisture, -0.389487% fat |
| `game_horse_roasted` | Game meat, horse, cooked, roasted | game, horse | Activated: raw NDB 17170 paired to cooked NDB 17171; 76.012793% protein-conservation yield, -33.040087% moisture, -0.026652% fat |
| `game_moose_roasted` | Game meat, moose, cooked, roasted | game, moose | Activated: raw NDB 17172 paired to cooked NDB 17173; 75.982234% protein-conservation yield, -31.781933% moisture, -0.401666% fat |
| `game_muskrat_roasted` | Game meat, muskrat, cooked, roasted | game, muskrat | Activated: raw NDB 17174 paired to cooked NDB 17175; 68.993021% protein-conservation yield, -44.706098% moisture, -0.002708% fat |
| `game_rabbit_domesticated_roasted` | Game meat, rabbit, domesticated, cooked, roasted | game, rabbit | Activated: raw NDB 17177 paired to cooked NDB 17178; 68.995182% protein-conservation yield, -42.573496% moisture, +0.074093% fat |
| `game_rabbit_domesticated_stewed` | Game meat, rabbit, domesticated, cooked, stewed | game, rabbit | Activated: raw NDB 17177 paired to cooked NDB 17179; 65.997368% protein-conservation yield, -46.690949% moisture, +0.006821% fat |
| `game_rabbit_wild_stewed` | Game meat, rabbit, wild, cooked, stewed | game, rabbit | Activated: raw NDB 17180 paired to cooked NDB 17181; 65.990309% protein-conservation yield, -45.647225% moisture, -0.161214% fat |
| `game_squirrel_roasted` | Game meat, squirrel, cooked, roasted | game, squirrel | Activated: raw NDB 17183 paired to cooked NDB 17184; 68.995775% protein-conservation yield, -41.994206% moisture, +0.806911% fat |
| `ostrich_inside_leg_cooked` | Ostrich, inside leg, cooked | ostrich, inside leg | Activated: raw NDB 5644 paired to cooked NDB 5645; 77.180283% protein-conservation yield, -28.935622% moisture, -12.947821% fat |
| `ostrich_inside_strip_cooked` | Ostrich, inside strip, cooked | ostrich, inside strip | Activated: raw NDB 5646 paired to cooked NDB 5647; 80.660538% protein-conservation yield, -27.638274% moisture, +19.726095% fat |
| `ostrich_outside_strip_cooked` | Ostrich, outside strip, cooked | ostrich, outside strip | Activated: raw NDB 5649 paired to cooked NDB 5650; 81.821366% protein-conservation yield, -26.626268% moisture, +41.799019% fat |
| `ostrich_oyster_cooked` | Ostrich, oyster, cooked | ostrich, oyster | Activated: raw NDB 5651 paired to cooked NDB 5652; 74.800417% protein-conservation yield, -33.182119% moisture, -19.085108% fat |
| `ostrich_tip_trimmed_cooked` | Ostrich, tip trimmed, cooked | ostrich, tip trimmed | Activated: raw NDB 5655 paired to cooked NDB 5656; 76.693577% protein-conservation yield, -30.973766% moisture, -14.303264% fat |
| `ostrich_top_loin_cooked` | Ostrich, top loin, cooked | ostrich, top loin | Activated: raw NDB 5657 paired to cooked NDB 5658; 77.062589% protein-conservation yield, -30.505602% moisture, +1.095667% fat |
| `deer_boneless_roasted` | Deer, boneless, roasted | game, boneless | USDA pair required |
| `deer_boneless_pan_grilled` | Deer, boneless, pan-grilled | game, boneless | USDA pair required |
| `elk_boneless_roasted` | Elk, boneless, roasted | game, boneless | USDA pair required |
| `elk_boneless_pan_grilled` | Elk, boneless, pan-grilled | game, boneless | USDA pair required |
| `rabbit_bone_in_braised` | Rabbit, bone-in, braised | game, bone-in | USDA pair required |
| `goat_bone_in_braised` | Goat, bone-in, braised | goat, bone-in | USDA pair required |
| `ostrich_boneless_pan_grilled` | Ostrich, boneless, pan-grilled | ratite, boneless | USDA pair required |
| `emu_ground_grilled` | Emu, ground, cooked, pan-broiled | emu, ground | Activated: raw NDB 5621 paired to cooked NDB 5622; 80.091453% protein-conservation yield, -27.646215% moisture, -7.586785% fat |
| `emu_fan_fillet_broiled` | Emu, fan fillet, cooked, broiled | emu, fan fillet | Activated: raw NDB 5623 paired to cooked NDB 5624; 71.953949% protein-conservation yield, -35.943435% moisture, +106.867605% fat |
| `emu_full_rump_broiled` | Emu, full rump, cooked, broiled | emu, full rump | Activated: raw NDB 5626 paired to cooked NDB 5627; 67.805168% protein-conservation yield, -43.056156% moisture, +10.803567% fat |
| `emu_inside_drum_broiled` | Emu, inside drums, cooked, broiled | emu, inside drum | Activated: raw NDB 5628 paired to cooked NDB 5629; 68.622607% protein-conservation yield, -40.945807% moisture, -7.428564% fat |
| `cornish_game_hen_roasted_meat_and_skin` | Chicken, Cornish game hens, meat and skin, cooked, roasted | chicken, Cornish game hen, meat and skin | Activated: raw NDB 5307 paired to cooked NDB 5308; 77.009430% protein-conservation yield, -33.720837% moisture, +0.024373% fat |
| `cornish_game_hen_roasted_meat_only` | Chicken, Cornish game hens, meat only, cooked, roasted | chicken, Cornish game hen, meat only | Activated: raw NDB 5309 paired to cooked NDB 5310; 86.008584% protein-conservation yield, -18.459689% moisture, -0.044078% fat |
| `game_other_boneless_roasted` | Other game meat, boneless, roasted | game, boneless | Use only when no species-specific USDA row exists |

## Legacy Compatibility

These existing keys remain valid while recipes and stored community data migrate:

| Legacy key | Compatibility meaning |
| --- | --- |
| `fried_meat` | Generic fried ground meat, sausage, or bacon |
| `fried_ground_beef` | Beef ground crumbles proxy |
| `pan_grilled_chicken` | Broad poultry or fish fillet proxy |
| `pan_grilled_steak` | Generic thin steak proxy |
| `fried_chicken` | Battered fried protein proxy |
| `baked_pork` | Generic roasted pork shoulder/butt proxy |
| `braised_beef` | Generic braised beef brisket/rib proxy |

New recipes should use a specific class whenever the source ingredient and USDA
cooking row support it. Existing recipes should not be silently remapped until the
new class has a verified coefficient and the resulting build has been audited.

## Coefficient Activation Contract

For each proposed class, activation requires all of the following:

1. Identify the raw or unprepared USDA NDB input row.
2. Identify the matching cooked row with the same species, cut/form, fat band,
   bone status, and cooking operation.
3. Account for refuse and edible portion separately from cooking yield.
4. Derive the class coefficient using the existing `yield_calc.py` model.
5. Add the same key and coefficient to both `recipes_v3/lib/yield_calc.py` and
   `src/lib/nutrition/yieldCalc.ts`.
6. Add the human label to `FILL_CLASS_LABELS` in `RecipeForm.svelte`.
7. Add or update `fill_class_hint` only when the NDB metadata supports an
   unambiguous inference.
8. Run the Python/TypeScript parity checks and `npm run check`.

Do not assign a bone-in coefficient to a boneless input or use the ingredient's
bone-inclusive purchase weight as if it were edible meat. The rib classes must remain
separate even when their cooking operation is otherwise identical.

## Current Activation State

The following profile is activated in the Python and TypeScript nutrition paths:

| Fill class | Source NDB | Cooking yield | Moisture change | Fat change |
| --- | ---: | ---: | ---: | ---: |
| `beef_ground_crumbles_low_fat` | 23565 | 69.0% | -29.6% | -1.4% |
| `beef_ground_crumbles_medium_fat` | 23575 | 67.0% | -27.8% | -5.3% |
| `beef_ground_crumbles_high_fat` | 13494 | 62.0% | -25.0% | -12.6% |
| `beef_ground_patty_low_fat` | 23564 | 77.0% | -21.3% | -1.4% |
| `beef_ground_patty_medium_fat` | 23574 | 73.0% | -20.8% | -6.2% |
| `beef_ground_patty_high_fat` | 13496 | 69.0% | -18.2% | -12.4% |
| `beef_flank_steak_boneless_pan_grilled` | 13948 | 81.0% | -22.6% | -1.0% |
| `beef_skirt_steak_boneless_pan_grilled` | 23221 | 68.0% | -29.5% | -4.2% |
| `beef_ribeye_steak_boneless_pan_grilled` | 23227 | 82.0% | -20.1% | -2.0% |
| `beef_tenderloin_steak_boneless_pan_grilled` | 13918 | 80.0% | -21.3% | -5.9% |
| `beef_t_bone_steak_bone_in_pan_grilled` (CALC) | 13907 | 81.82% | -24.51% | -4.17% |
| `beef_porterhouse_steak_bone_in_pan_grilled` (CALC) | 13905 | 81.50% | -23.93% | -4.48% |
| `beef_top_sirloin_steak_boneless_pan_grilled` | 13930 | 80.0% | -25.2% | -2.7% |
| `beef_eye_of_round_roast_boneless_roasted` | 13878 | 81.0% | -23.9% | -1.2% |
| `beef_pot_roast_boneless_braised` | 13373 | 71.0% | -36.1% | -8.3% |
| `beef_short_ribs_boneless_braised` | 23125 | 66.0% | -31.3% | -4.2% |
| `beef_tri_tip_roast_boneless_roasted` | 13953 | 84.0% | -22.4% | -0.1% |
| `beef_tri_tip_roast_lean_only_roasted` | 13985 | 84.0% | -25.3% | +0.4% (ignored) |
| `beef_chuck_eye_roast_boneless_roasted` | 23113 | 80.0% | -24.9% | -0.4% |
| `beef_round_tip_roast_boneless_roasted` | 13421 | 85.0% | -24.7% | -1.0% |
| `beef_bottom_round_roast_boneless_roasted` | 13870 | 84.0% | -20.6% | -2.8% |
| `beef_shoulder_pot_roast_boneless_braised` | 23131 | 66.0% | -37.3% | +0.3% (ignored) |
| `beef_rib_eye_roast_bone_in_roasted` | 23191 | 77.0% | -17.6% | -1.7% |
| `beef_rib_eye_roast_boneless_roasted` | 23198 | 76.0% | -21.8% | -2.6% |
| `pork_sausage_high_fat_pan_fried` | 7064 | 80.0% | -16.2% | -3.9% |
| `bacon_pan_fried` | 10862 | 31.0% | -35.9% | -33.8% |
| `pork_chop_bone_in_pan_grilled` | 10178 | 82.0% | -20.0% | +1.3% (ignored) |
| `pork_chop_boneless_pan_grilled` | 10212 | 79.0% | -23.2% | +0.1% (ignored) |
| `pork_cured_ham_boneless_roasted` | 10883 | 94.0% | -6.1% | -0.3% |
| `pork_blade_roast_bone_in_roasted` | 10031 | 77.0% | -22.2% | +0.6% (ignored) |
| `pork_blade_roast_boneless_roasted` | 10990 | 75.0% | -22.4% | -0.2% |
| `pork_center_loin_roast_bone_in_roasted` | 10039 | 77.0% | -23.3% | +0.9% (ignored) |
| `pork_center_rib_roast_bone_in_roasted` | 10047 | 75.0% | -24.7% | -0.1% |
| `pork_tenderloin_lean_only_roasted` | 10061 | 80.0% | -20.7% | +0.5% (ignored) |
| `pork_top_loin_roast_lean_only_roasted` | 10069 | 79.0% | -21.3% | +0.9% (ignored) |
| `pork_country_style_ribs_boneless_braised` | 10208 | 71.0% | -33.1% | +4.4% (ignored) |
| `pork_back_ribs_bone_in_roasted` | 10193 | 82.0% | -18.5% | +1.3% (ignored) |
| `pork_back_ribs_bone_in_lean_only_roasted` | 10981 | 82.0% | -21.0% | +4.7% (ignored) |
| `pork_spareribs_bone_in_roasted` | 10940 | 76.0% | -22.9% | +0.2% (ignored) |
| `pork_leg_sirloin_tip_roast_boneless_braised` | 10962 | 79.0% | -21.5% | +0.01% (ignored) |
| `pork_sirloin_chop_bone_in_braised` | 10053 | 73.0% | -27.0% | +0.1% (ignored) |
| `pork_sirloin_chop_bone_in_lean_only_braised` | 10057 | 74.0% | -28.0% | +0.7% (ignored) |
| `pork_sirloin_chop_boneless_braised` | 10211 | 76.0% | -22.7% | +0.1% (ignored) |
| `pork_sirloin_chop_boneless_lean_only_braised` | 10215 | 75.0% | -24.8% | +0.7% (ignored) |
| `pork_blade_roast_bone_in_lean_only_roasted` | 10035 | 77.0% | -24.7% | +3.3% (ignored) |
| `pork_blade_roast_boneless_lean_only_roasted` | 10983 | 75.0% | -24.2% | +1.6% (ignored) |
| `pork_center_loin_roast_bone_in_lean_only_roasted` | 10043 | 77.0% | -24.2% | +2.3% (ignored) |
| `pork_center_rib_roast_bone_in_lean_only_roasted` | 10051 | 74.0% | -27.1% | +2.3% (ignored) |
| `pork_blade_chop_boneless_lean_only_pan_grilled` | 10984 | 79.0% | -21.3% | +1.5% (ignored) |
| `pork_center_loin_chop_bone_in_lean_only_pan_grilled` | 10042 | 82.0% | -20.4% | +2.3% (ignored) |
| `pork_ground_crumbles_high_fat` | 10974 | 66.0% | -27.9% | -6.5% |
| `pork_ground_crumbles_low_fat` | 10976 | 68.0% | -31.7% | -0.2% |
| `pork_ground_crumbles_medium_fat` | 10975 | 67.0% | -30.3% | -1.8% |
| `pork_ground_patty_high_fat` | 10977 | 69.0% | -25.3% | -6.6% |
| `pork_ground_patty_low_fat` | 10979 | 68.0% | -32.7% | +0.2% (ignored) |
| `pork_ground_patty_medium_fat` | 10978 | 68.0% | -26.7% | -1.9% |
| `pork_leg_rump_half_lean_only_roasted` | 10015 | 73.0% | -26.9% | +0.4% (ignored) |
| `pork_leg_shank_half_lean_only_roasted` | 10019 | 73.0% | -27.5% | +1.3% (ignored) |
| `pork_blade_chop_bone_in_braised` | 10029 | 78.0% | -27.8% | +6.5% (ignored) |
| `pork_blade_chop_bone_in_pan_grilled` | 10030 | 83.0% | -16.3% | -0.3% |
| `pork_center_loin_chop_bone_in_braised` | 10037 | 74.0% | -21.5% | +2.2% (ignored) |
| `pork_center_loin_chop_bone_in_lean_only_braised` | 10041 | 73.0% | -28.0% | +1.9% (ignored) |
| `beef_brisket_whole_separable_lean_only_0in_braised` | 13023 | 69.647059% | -42.817872% | -4.743236% |
| `beef_brisket_whole_separable_lean_and_fat_1_8in_braised` | 13803 | 71.257253% | -42.158896% | -8.404895% |
| `beef_brisket_flat_separable_lean_and_fat_1_8in_braised` | 13805 | 62.248439% | -44.696156% | -48.304047% |
| `beef_brisket_flat_separable_lean_only_1_8in_braised` | 23596 | 65.067873% | -46.532486% | +1.668552% |
| `beef_brisket_point_separable_lean_and_fat_1_8in_braised` | 13807 | 72.336066% | -41.730621% | -6.321692% |
| `beef_corned_brisket_cooked` | 13346 | 80.792515% | -27.425113% | +2.915566% |

Profile qualification requires both the selected fill class and the exact source
NDB to match. The moisture delta is applied to the matching meat rows while other
section ingredients retain the existing section behavior. A negative fat delta is
converted to grams lost from the matching meat rows only; added oil, butter, or
lard remain independent retained ingredients. Missing or nonnegative USDA fat
changes contribute no fat loss, so a moisture-only profile is valid and positive
fat changes never create fat.

The profile is defined in `recipes_v3/lib/usda_yield_profiles.py` and mirrored in
`src/lib/nutrition/usdaYieldProfiles.ts`. The generic `braised_beef` class and
existing recipe assignments remain unchanged until their source NDBs are verified
against a matching USDA profile.
