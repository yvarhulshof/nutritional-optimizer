import { NutrientKey } from '../../types/food';

// Maps USDA FoodData Central nutrient IDs → our NutrientKey
// Multiple IDs per key because some nutrients have different IDs across data types
// (Foundation Foods vs SR Legacy vs Branded Foods)
export const USDA_NUTRIENT_IDS: Record<NutrientKey, number[]> = {
  energyKcal:     [1008],
  proteinG:       [1003],
  fatG:           [1004],
  saturatedFatG:  [1258, 606],  // 1258 = Foundation/FDC, 606 = SR Legacy
  carbohydratesG: [1005],
  fiberG:         [1079],
  sugarG:         [2000, 1063], // 2000 = total sugars (newer), 1063 = sugars by difference
  sodiumMg:       [1093],
  calciumMg:      [1087],
  ironMg:         [1089],
  potassiumMg:    [1092],
  vitaminCMg:     [1162],
  vitaminDMcg:    [1114],       // Vitamin D (D2+D3) in mcg
  vitaminB12Mcg:  [1178],
  folateMcg:      [1190, 1177], // 1190 = Folate DFE, 1177 = Folate total
  magnesiumMg:    [1090],
  zincMg:         [1095],
  omega3G:        [1404, 1278, 1272], // 1404 = ALA, 1278 = EPA, 1272 = DHA
};

// USDA sometimes reports Vitamin D in IU (nutrient ID 1110). Divide by 40 to get mcg.
export const USDA_VITAMIN_D_IU_ID = 1110;
export const IU_TO_MCG_FACTOR = 1 / 40; // 1 mcg = 40 IU for Vitamin D
