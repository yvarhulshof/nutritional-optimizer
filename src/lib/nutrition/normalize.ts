import { NutrientProfile, NutrientKey } from '../../types/food';
import { USDA_NUTRIENT_IDS, USDA_VITAMIN_D_IU_ID, IU_TO_MCG_FACTOR } from './usdaNutrientIds';

const EMPTY_PROFILE: NutrientProfile = {
  energyKcal: 0, proteinG: 0, fatG: 0, saturatedFatG: 0,
  carbohydratesG: 0, fiberG: 0, sugarG: 0, sodiumMg: 0,
  calciumMg: 0, ironMg: 0, potassiumMg: 0, vitaminCMg: 0,
  vitaminDMcg: 0, vitaminB12Mcg: 0, folateMcg: 0,
  magnesiumMg: 0, zincMg: 0, omega3G: 0,
};

// ── USDA FoodData Central ────────────────────────────────────────────────────

interface UsdaNutrient {
  nutrientId?: number;
  nutrient?: { id: number };
  amount?: number;
  value?: number;
}

export function normalizeUsdaFood(raw: Record<string, unknown>): NutrientProfile {
  const profile = { ...EMPTY_PROFILE };

  const nutrients: UsdaNutrient[] = (raw.foodNutrients as UsdaNutrient[]) ?? [];

  // Build a lookup: nutrientId → amount
  const lookup: Record<number, number> = {};
  for (const n of nutrients) {
    const id = n.nutrientId ?? n.nutrient?.id;
    const value = n.amount ?? n.value;
    if (id !== undefined && value !== undefined) {
      lookup[id] = value;
    }
  }

  // Map USDA IDs to profile keys
  for (const [key, ids] of Object.entries(USDA_NUTRIENT_IDS) as [NutrientKey, number[]][]) {
    for (const id of ids) {
      if (lookup[id] !== undefined) {
        // Sum EPA+DHA+ALA for omega3G
        if (key === 'omega3G') {
          profile[key] = (profile[key] ?? 0) + (lookup[id] ?? 0);
        } else {
          profile[key] = lookup[id];
          break; // Use first available ID, don't double-count
        }
      }
    }
  }

  // Handle Vitamin D in IU (convert to mcg if mcg value absent or zero)
  if (profile.vitaminDMcg === 0 && lookup[USDA_VITAMIN_D_IU_ID]) {
    profile.vitaminDMcg = lookup[USDA_VITAMIN_D_IU_ID] * IU_TO_MCG_FACTOR;
  }

  return profile;
}

// ── Open Food Facts ──────────────────────────────────────────────────────────

interface OffNutriments {
  [key: string]: number | undefined;
}

export function normalizeOffFood(nutriments: OffNutriments): NutrientProfile {
  const get = (key: string) => nutriments[key] ?? 0;

  // OFF stores vitamin D in mcg (sometimes µg suffix), vitamin B12 also in mcg
  // All values are per 100g
  return {
    energyKcal:     get('energy-kcal_100g') || get('energy_100g') / 4.184 || 0,
    proteinG:       get('proteins_100g'),
    fatG:           get('fat_100g'),
    saturatedFatG:  get('saturated-fat_100g'),
    carbohydratesG: get('carbohydrates_100g'),
    fiberG:         get('fiber_100g'),
    sugarG:         get('sugars_100g'),
    sodiumMg:       (get('sodium_100g')) * 1000, // OFF stores sodium in g
    calciumMg:      (get('calcium_100g')) * 1000,
    ironMg:         (get('iron_100g')) * 1000,
    potassiumMg:    (get('potassium_100g')) * 1000,
    vitaminCMg:     (get('vitamin-c_100g')) * 1000,
    vitaminDMcg:    (get('vitamin-d_100g')) * 1000000, // OFF stores in g → mcg = ×1e6
    vitaminB12Mcg:  (get('vitamin-b12_100g')) * 1000000,
    folateMcg:      (get('folates_100g') || get('folic-acid_100g')) * 1000000,
    magnesiumMg:    (get('magnesium_100g')) * 1000,
    zincMg:         (get('zinc_100g')) * 1000,
    omega3G:        get('omega-3-fat_100g'),
  };
}

export function countCompleteness(profile: NutrientProfile): number {
  const keys = Object.keys(profile) as NutrientKey[];
  const nonZero = keys.filter((k) => profile[k] > 0).length;
  return Math.round((nonZero / keys.length) * 100);
}
