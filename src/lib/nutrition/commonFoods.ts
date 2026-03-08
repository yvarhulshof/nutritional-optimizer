import { FoodSearchResult, NutrientProfile, DietaryTag } from '../../types/food';

// Curated list of common foods with USDA FDC IDs (Foundation / SR Legacy foods).
// Nutritional data is per 100g, sourced from USDA FoodData Central.
// On "Add", the app fetches the full nutrient profile from the USDA API.

export interface StaticFood {
  result: FoodSearchResult;
  /** Pre-embedded nutrient profile (per 100g). Used as fallback if API call fails. */
  profile: NutrientProfile;
  /** Approximate retail cost per 100g in EUR. */
  costPer100g?: number;
}

function f(
  id: string,
  name: string,
  category: string,
  [kcal, pro, fat, satFat, carb, fib, sug, na, ca, fe, k, vitC, vitD, b12, fol, mg, zn, omega3]: number[],
  costPer100g?: number,
  dietaryTags?: DietaryTag[]
): StaticFood {
  return {
    result: { id, source: 'USDA', name, category, dietaryTags },
    costPer100g,
    profile: {
      energyKcal: kcal, proteinG: pro, fatG: fat, saturatedFatG: satFat,
      carbohydratesG: carb, fiberG: fib, sugarG: sug, sodiumMg: na,
      calciumMg: ca, ironMg: fe, potassiumMg: k, vitaminCMg: vitC,
      vitaminDMcg: vitD, vitaminB12Mcg: b12, folateMcg: fol,
      magnesiumMg: mg, zincMg: zn, omega3G: omega3,
    },
  };
}

// [kcal, protein, fat, satFat, carbs, fiber, sugar, sodium, calcium, iron, potassium,
//  vitC, vitD(mcg), B12(mcg), folate(mcg), magnesium, zinc, omega3], costPer100g (EUR), dietaryTags
export const CURATED_FOODS: StaticFood[] = [
  // ── Meats & Poultry ──────────────────────────────────────────────────────────
  f('171477','Chicken, breast, boneless, skinless, raw','Poultry Products',
    [120,22.5,2.6,0.74,0,0,0,74,11,0.37,256,0,0,0.3,4,28,0.7,0.06], 0.85,
    ['lactose-free','gluten-free']),
  f('174036','Beef, ground, 85% lean, raw','Beef Products',
    [215,18.6,15.2,5.8,0,0,0,75,18,2.06,270,0,0.1,2.5,8,20,4.8,0.09], 1.00,
    ['lactose-free','gluten-free']),
  f('174608','Turkey, ground, 93% lean, raw','Poultry Products',
    [149,19.7,7.4,1.9,0,0,0,82,12,1.2,287,0,0.1,1.6,7,23,2.4,0.1], 0.90,
    ['lactose-free','gluten-free']),
  f('168586','Pork, loin, raw','Pork Products',
    [143,20.4,6.3,2.2,0,0,0,53,12,0.88,362,0,0.6,0.8,0,24,2.1,0.04], 0.80,
    ['lactose-free','gluten-free']),
  f('175177','Lamb, loin, raw','Lamb, Veal, and Game Products',
    [294,16.6,24.8,11.1,0,0,0,72,16,1.72,270,0,0.5,2.1,18,22,3.3,0.4], 1.60,
    ['lactose-free','gluten-free']),
  f('175190','Bacon, pork, raw','Pork Products',
    [458,14.6,45.0,14.9,0.4,0,0,741,8,0.9,247,0,0.5,1.2,1,15,2.0,0.4], 1.20,
    ['lactose-free','gluten-free']),
  // ── Fish & Seafood ───────────────────────────────────────────────────────────
  f('175167','Salmon, Atlantic, farmed, raw','Finfish and Shellfish Products',
    [208,20.4,13.4,3.05,0,0,0,59,12,0.34,363,3.9,11.1,3.2,25,27,0.36,2.26], 1.50,
    ['lactose-free','gluten-free']),
  f('15188','Tuna, light, canned in water, drained','Finfish and Shellfish Products',
    [86,19.0,0.96,0.25,0,0,0,337,11,1.4,237,0,0,2.54,4,29,0.9,0.22], 0.45,
    ['lactose-free','gluten-free']),
  f('15149','Shrimp, raw','Finfish and Shellfish Products',
    [85,20.1,0.51,0.15,0.2,0,0,119,64,0.52,264,0,0,1.9,3,37,1.07,0.27], 1.30,
    ['lactose-free','gluten-free']),
  f('15126','Cod, Atlantic, raw','Finfish and Shellfish Products',
    [82,17.8,0.67,0.13,0,0,0,54,16,0.38,413,1.4,1.0,0.9,7,32,0.44,0.13], 0.90,
    ['lactose-free','gluten-free']),
  f('15076','Sardines, canned in oil, drained','Finfish and Shellfish Products',
    [208,24.6,11.5,1.5,0,0,0,505,382,2.92,397,0,4.8,8.9,10,39,1.3,1.48], 0.40,
    ['lactose-free','gluten-free']),
  f('15011','Mackerel, Atlantic, raw','Finfish and Shellfish Products',
    [205,18.6,13.9,3.3,0,0,0,90,12,1.63,314,0.4,16.1,8.71,1,60,0.63,2.59], 0.55,
    ['lactose-free','gluten-free']),
  // ── Eggs & Dairy ─────────────────────────────────────────────────────────────
  f('748967','Egg, whole, raw','Dairy and Egg Products',
    [143,12.6,9.5,3.13,0.7,0,0.4,142,56,1.75,138,0,2.0,1.11,47,12,1.3,0.04], 0.25,
    ['vegetarian','lactose-free','gluten-free']),
  f('746782','Milk, whole, 3.25% milkfat','Dairy and Egg Products',
    [61,3.2,3.3,2.07,4.7,0,4.7,40,113,0.03,132,0,1.2,0.44,5,10,0.37,0.07], 0.10,
    ['vegetarian','gluten-free']),
  f('1097542','Greek yogurt, plain, whole milk','Dairy and Egg Products',
    [97,9.0,5.0,3.25,3.8,0,3.2,36,110,0.07,141,0,0.5,0.75,8,11,0.52,0.06], 0.28,
    ['vegetarian','gluten-free']),
  f('173414','Cheddar cheese','Dairy and Egg Products',
    [403,24.9,33.3,18.9,1.3,0,0.5,621,721,0.68,98,0,0.6,1.1,18,28,3.64,0.4], 0.95,
    ['vegetarian','gluten-free']),
  f('170893','Cottage cheese, 2% fat','Dairy and Egg Products',
    [90,11.1,2.5,1.6,3.4,0,2.7,364,83,0.07,84,0,0.3,0.6,8,8,0.43,0.01], 0.32,
    ['vegetarian','gluten-free']),
  f('170183','Butter, salted','Fats and Oils',
    [717,0.85,81.1,51.4,0.1,0,0.1,643,24,0.02,24,0,1.5,0.17,3,2,0.09,0.3], 1.05,
    ['vegetarian','gluten-free']),
  // ── Grains ───────────────────────────────────────────────────────────────────
  f('173904','Oats, rolled, dry','Breakfast Cereals',
    [379,13.2,6.9,1.22,67.7,10.1,0,6,54,4.72,429,0,0,0,32,177,3.97,0.11], 0.13,
    ['vegetarian','vegan','lactose-free']),
  f('169756','Rice, white, long-grain, cooked','Cereal Grains and Pasta',
    [130,2.7,0.28,0.08,28.6,0.4,0,1,10,1.2,35,0,0,0,58,12,0.49,0], 0.08,
    ['vegetarian','vegan','lactose-free','gluten-free']),
  f('169704','Rice, brown, medium-grain, cooked','Cereal Grains and Pasta',
    [112,2.3,0.83,0.17,23.5,1.8,0,5,10,0.53,79,0,0,0,9,44,0.62,0.01], 0.10,
    ['vegetarian','vegan','lactose-free','gluten-free']),
  f('168917','Quinoa, cooked','Cereal Grains and Pasta',
    [120,4.4,1.92,0.23,21.3,2.8,0.9,7,17,1.49,172,0,0,0,42,64,1.09,0.09], 0.18,
    ['vegetarian','vegan','lactose-free','gluten-free']),
  f('172686','Bread, whole-wheat','Baked Products',
    [247,13.0,3.6,0.75,41.3,6.9,5.5,450,103,3.6,248,0,0,0,43,82,2.56,0.3], 0.25,
    ['vegetarian','vegan','lactose-free']),
  f('172688','Bread, white','Baked Products',
    [267,8.9,3.6,0.79,50.6,2.4,4.7,491,144,3.6,115,0,0,0,65,23,1.0,0.2], 0.20,
    ['vegetarian','vegan','lactose-free']),
  f('172421','Lentils, cooked','Legumes and Legume Products',
    [116,9.0,0.38,0.05,20.1,7.9,1.8,2,19,3.3,369,1.5,0,0,181,36,1.27,0.07], 0.20,
    ['vegetarian','vegan','lactose-free','gluten-free']),
  f('175198','Kidney beans, cooked','Legumes and Legume Products',
    [127,8.7,0.5,0.07,22.8,6.4,0.3,2,43,2.94,403,1.4,0,0,130,45,1.06,0.3], 0.18,
    ['vegetarian','vegan','lactose-free','gluten-free']),
  f('173756','Chickpeas (garbanzo beans), cooked','Legumes and Legume Products',
    [164,8.9,2.6,0.27,27.4,7.6,4.8,7,49,2.89,291,1.3,0,0,172,48,1.53,0.07], 0.18,
    ['vegetarian','vegan','lactose-free','gluten-free']),
  f('175221','Black beans, cooked','Legumes and Legume Products',
    [132,8.9,0.54,0.14,23.7,8.7,0.3,1,27,2.1,355,0,0,0,256,70,1.0,0.18], 0.18,
    ['vegetarian','vegan','lactose-free','gluten-free']),
  f('174258','Edamame, cooked','Legumes and Legume Products',
    [122,10.9,5.2,0.6,9.9,5.2,2.2,6,63,2.27,436,6.1,0,0,303,64,1.37,0.6], 0.30,
    ['vegetarian','vegan','lactose-free','gluten-free']),
  f('168874','Whole wheat pasta, cooked','Cereal Grains and Pasta',
    [124,5.3,0.54,0.1,26.5,3.9,0.4,6,21,1.06,89,0,0,0,29,53,1.13,0.06], 0.15,
    ['vegetarian','vegan','lactose-free']),
  // ── Vegetables ───────────────────────────────────────────────────────────────
  f('747447','Broccoli, raw','Vegetables and Vegetable Products',
    [34,2.8,0.37,0.04,6.6,2.6,1.7,33,47,0.73,316,89.2,0,0,63,21,0.41,0.1], 0.22,
    ['vegetarian','vegan','lactose-free','gluten-free']),
  f('168462','Spinach, raw','Vegetables and Vegetable Products',
    [23,2.9,0.39,0.06,3.6,2.2,0.4,79,99,2.71,558,28.1,0,0,194,79,0.53,0.14], 0.35,
    ['vegetarian','vegan','lactose-free','gluten-free']),
  f('168483','Sweet potato, baked','Vegetables and Vegetable Products',
    [90,2.0,0.15,0.03,20.7,3.3,6.5,36,38,0.69,475,19.6,0,0,11,27,0.32,0.09], 0.22,
    ['vegetarian','vegan','lactose-free','gluten-free']),
  f('170393','Carrots, raw','Vegetables and Vegetable Products',
    [41,0.93,0.24,0.04,9.6,2.8,4.7,69,33,0.3,320,5.9,0,0,19,12,0.24,0.01], 0.10,
    ['vegetarian','vegan','lactose-free','gluten-free']),
  f('170457','Tomatoes, red, raw','Vegetables and Vegetable Products',
    [18,0.88,0.2,0.03,3.9,1.2,2.6,5,10,0.27,237,13.7,0,0,15,11,0.17,0.01], 0.20,
    ['vegetarian','vegan','lactose-free','gluten-free']),
  f('168421','Kale, raw','Vegetables and Vegetable Products',
    [35,2.9,0.5,0.07,8.8,3.6,0,53,254,1.6,348,93.4,0,0,141,34,0.44,0.18], 0.30,
    ['vegetarian','vegan','lactose-free','gluten-free']),
  f('170000','Onions, raw','Vegetables and Vegetable Products',
    [40,1.1,0.1,0.04,9.3,1.7,4.2,4,23,0.21,146,7.4,0,0,19,10,0.17,0.01], 0.10,
    ['vegetarian','vegan','lactose-free','gluten-free']),
  f('170108','Bell pepper, red, raw','Vegetables and Vegetable Products',
    [31,1.0,0.3,0.03,6.0,2.1,4.2,4,7,0.43,211,127.7,0,0,46,12,0.25,0.06], 0.40,
    ['vegetarian','vegan','lactose-free','gluten-free']),
  f('170032','Potatoes, boiled','Vegetables and Vegetable Products',
    [77,2.0,0.1,0.03,17.5,1.8,0.8,5,8,0.31,328,6.0,0,0,10,22,0.27,0.01], 0.10,
    ['vegetarian','vegan','lactose-free','gluten-free']),
  f('170148','Zucchini, raw','Vegetables and Vegetable Products',
    [17,1.2,0.32,0.08,3.1,1.0,2.5,8,16,0.37,261,17.9,0,0,24,18,0.32,0.07], 0.20,
    ['vegetarian','vegan','lactose-free','gluten-free']),
  f('168409','Cucumber, raw','Vegetables and Vegetable Products',
    [16,0.65,0.11,0.03,3.6,0.5,1.7,2,16,0.28,147,2.8,0,0,7,13,0.2,0.04], 0.15,
    ['vegetarian','vegan','lactose-free','gluten-free']),
  f('170554','Chia seeds','Nut and Seed Products',
    [486,16.5,30.7,3.33,42.1,34.4,0,16,631,7.72,407,1.6,0,0,49,335,4.58,17.8], 0.85,
    ['vegetarian','vegan','lactose-free','gluten-free']),
  f('169230','Garlic, raw','Vegetables and Vegetable Products',
    [149,6.36,0.5,0.09,33.1,2.1,1.0,17,181,1.7,401,31.2,0,0,3,25,1.16,0.1], 0.30,
    ['vegetarian','vegan','lactose-free','gluten-free']),
  f('171705','Avocado, raw','Fruits and Fruit Juices',
    [160,2.0,14.7,2.13,8.5,6.7,0.7,7,12,0.55,485,10.0,0,0,81,29,0.64,0.11], 0.55,
    ['vegetarian','vegan','lactose-free','gluten-free']),
  // ── Fruits ───────────────────────────────────────────────────────────────────
  f('171688','Apple, with skin','Fruits and Fruit Juices',
    [52,0.26,0.17,0.03,13.8,2.4,10.4,1,6,0.12,107,4.6,0,0,3,5,0.04,0.01], 0.20,
    ['vegetarian','vegan','lactose-free','gluten-free']),
  f('173944','Banana, raw','Fruits and Fruit Juices',
    [89,1.1,0.33,0.11,22.8,2.6,12.2,1,5,0.26,358,8.7,0,0,20,27,0.15,0.03], 0.15,
    ['vegetarian','vegan','lactose-free','gluten-free']),
  f('169097','Orange, raw','Fruits and Fruit Juices',
    [47,0.94,0.12,0.01,11.8,2.4,9.4,0,40,0.1,181,53.2,0,0,30,10,0.07,0.01], 0.20,
    ['vegetarian','vegan','lactose-free','gluten-free']),
  f('167762','Strawberries, raw','Fruits and Fruit Juices',
    [32,0.67,0.3,0.02,7.7,2.0,4.9,1,16,0.41,153,58.8,0,0,24,13,0.14,0.07], 0.50,
    ['vegetarian','vegan','lactose-free','gluten-free']),
  f('171711','Blueberries, raw','Fruits and Fruit Juices',
    [57,0.74,0.33,0.03,14.5,2.4,9.96,1,6,0.28,77,9.7,0,0,6,6,0.16,0.09], 0.70,
    ['vegetarian','vegan','lactose-free','gluten-free']),
  f('174673','Mango, raw','Fruits and Fruit Juices',
    [60,0.82,0.38,0.09,15.0,1.6,13.7,1,11,0.16,168,36.4,0,0,43,10,0.09,0.05], 0.40,
    ['vegetarian','vegan','lactose-free','gluten-free']),
  // ── Nuts & Seeds ─────────────────────────────────────────────────────────────
  f('170567','Almonds','Nut and Seed Products',
    [579,21.2,49.9,3.80,21.6,12.5,4.4,1,264,3.71,733,0,0,0,44,270,3.12,0], 1.30,
    ['vegetarian','vegan','lactose-free','gluten-free']),
  f('172430','Peanuts, dry roasted','Nut and Seed Products',
    [587,23.7,49.7,6.89,21.5,8.5,4.1,813,54,1.58,745,0,0,0,145,168,3.27,0], 0.45,
    ['vegetarian','vegan','lactose-free','gluten-free']),
  f('172470','Peanut butter, smooth','Nut and Seed Products',
    [598,22.2,51.4,10.5,21.6,5.0,9.2,459,43,1.74,558,0,0,0,87,168,2.8,0], 0.55,
    ['vegetarian','vegan','lactose-free','gluten-free']),
  f('170187','Walnuts','Nut and Seed Products',
    [654,15.2,65.2,6.13,13.7,6.7,2.6,2,98,2.91,441,1.3,0,0,98,158,3.09,9.08], 1.60,
    ['vegetarian','vegan','lactose-free','gluten-free']),
  f('170562','Sunflower seeds','Nut and Seed Products',
    [584,20.8,51.5,4.45,20.0,8.6,2.6,3,78,5.25,645,1.4,0,0,227,325,5.0,0.07], 0.40,
    ['vegetarian','vegan','lactose-free','gluten-free']),
  f('170178','Cashews, dry roasted','Nut and Seed Products',
    [574,15.3,46.4,9.16,32.7,3.3,5.9,12,45,6.0,565,0,0,0,69,260,5.6,0.15], 1.40,
    ['vegetarian','vegan','lactose-free','gluten-free']),
  f('170580','Flaxseeds','Nut and Seed Products',
    [534,18.3,42.2,3.66,28.9,27.3,1.6,30,255,5.73,813,0.6,0,0,87,392,4.34,22.8], 0.45,
    ['vegetarian','vegan','lactose-free','gluten-free']),
  f('170554','Sesame seeds','Nut and Seed Products',
    [573,17.7,49.7,7.0,23.4,11.8,0.3,11,975,14.6,468,0,0,0,97,351,7.75,0.37], 0.55,
    ['vegetarian','vegan','lactose-free','gluten-free']),
  // ── Oils & Fats ──────────────────────────────────────────────────────────────
  f('171413','Olive oil','Fats and Oils',
    [884,0,100,13.8,0,0,0,2,1,0.56,1,0,0,0,0,0,0,0.76], 0.65,
    ['vegetarian','vegan','lactose-free','gluten-free']),
  f('171010','Coconut oil','Fats and Oils',
    [862,0,100,86.5,0,0,0,0,1,0.05,1,0,0,0,0,0,0,0], 0.75,
    ['vegetarian','vegan','lactose-free','gluten-free']),
  // ── Legumes extras ───────────────────────────────────────────────────────────
  f('174272','Tofu, firm, raw','Legumes and Legume Products',
    [76,8.1,4.2,0.6,1.9,0.3,0.7,7,200,1.6,150,0.2,0,0,15,30,0.8,0.58], 0.45,
    ['vegetarian','vegan','lactose-free','gluten-free']),
  f('175187','Soybeans, cooked','Legumes and Legume Products',
    [173,16.6,9.0,1.3,9.9,6.0,3.0,1,88,5.14,515,1.7,0,0,54,86,1.15,1.33], 0.28,
    ['vegetarian','vegan','lactose-free','gluten-free']),
  // ── Processed / Other ────────────────────────────────────────────────────────
  f('174590','Dark chocolate, 70-85%','Sweets',
    [598,7.8,42.6,24.5,45.8,10.9,24.2,20,73,11.9,715,0,0,0,28,228,3.31,0.1], 0.85,
    ['vegetarian','gluten-free']),
  // ── Supplements ──────────────────────────────────────────────────────────────
  // Each supplement is modelled per 100 g of powder/tablet material.
  // Potency is tuned so the optimizer selects ≥ 1 g/day (above the 0.5 g noise
  // threshold in interpret.ts), while reflecting a realistic daily dose.
  f('supp-vitd3','Vitamin D3 supplement (1000 IU / tablet)','Supplements',
    //  kcal  pro  fat  sat  carb fib  sug  Na   Ca   Fe   K    vitC vitD  B12  fol  Mg  Zn omega3
    [     0,   0,   0,   0,   0,  0,   0,   0,   0,   0,   0,   0, 2500,   0,   0,  0,  0,  0], 5.00,
    ['vegetarian','vegan','lactose-free','gluten-free']),
  // 250 mcg/100 g → LP selects ~1 g/day to meet the 2.4 mcg min (≈ one low-dose
  // daily tablet of 2.5 mcg, common in fortified-food-equivalent form).
  f('supp-b12','Vitamin B12 supplement (2.5 mcg / tablet)','Supplements',
    //  kcal  pro  fat  sat  carb fib  sug  Na   Ca   Fe   K    vitC vitD  B12  fol  Mg  Zn omega3
    [     0,   0,   0,   0,   0,  0,   0,   0,   0,   0,   0,   0,    0, 250,   0,  0,  0,  0], 5.00,
    ['vegetarian','vegan','lactose-free','gluten-free']),
];

import { GENERATED_FOODS } from './generatedFoods';

export const COMMON_FOODS: StaticFood[] = [...CURATED_FOODS, ...GENERATED_FOODS];

const nameIndex = COMMON_FOODS.map((f) => ({
  food: f,
  terms: `${f.result.name} ${f.result.category ?? ''}`.toLowerCase(),
}));

export function searchCommonFoods(query: string): FoodSearchResult[] {
  if (!query || query.length < 2) return [];
  const q = query.toLowerCase().trim();
  const terms = q.split(/\s+/);

  const scored = nameIndex
    .map(({ food, terms: t }) => {
      // Score: each search term that appears in the food name
      const score = terms.reduce((acc, term) => acc + (t.includes(term) ? 1 : 0), 0);
      // Bonus: exact word match at start of name
      const nameStart = food.result.name.toLowerCase().startsWith(q) ? 2 : 0;
      return { food, score: score + nameStart };
    })
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score);

  return scored.slice(0, 8).map((s) => s.food.result);
}

export function getStaticFoodProfile(id: string): NutrientProfile | null {
  const found = COMMON_FOODS.find((f) => f.result.id === id);
  return found?.profile ?? null;
}
