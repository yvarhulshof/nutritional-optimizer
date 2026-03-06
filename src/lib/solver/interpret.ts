import { SelectedFood, NutrientProfile, NutrientKey } from '../../types/food';
import { FoodQuantity, OptimizationResult } from '../../types/solver';
import { RawSolverResult } from './runSolver';

const EMPTY_NUTRIENTS: NutrientProfile = {
  energyKcal: 0, proteinG: 0, fatG: 0, saturatedFatG: 0,
  carbohydratesG: 0, fiberG: 0, sugarG: 0, sodiumMg: 0,
  calciumMg: 0, ironMg: 0, potassiumMg: 0, vitaminCMg: 0,
  vitaminDMcg: 0, vitaminB12Mcg: 0, folateMcg: 0,
  magnesiumMg: 0, zincMg: 0, omega3G: 0,
};

export function interpretResult(
  raw: RawSolverResult,
  foods: SelectedFood[]
): OptimizationResult {
  if (!raw.feasible) {
    return {
      status: 'infeasible',
      objectiveValue: 0,
      quantities: [],
      achievedNutrients: { ...EMPTY_NUTRIENTS },
    };
  }

  const quantities: FoodQuantity[] = [];
  const achieved: NutrientProfile = { ...EMPTY_NUTRIENTS };
  let totalCost = 0;
  let hasCost = false;

  for (let i = 0; i < foods.length; i++) {
    const food = foods[i];
    const grams = raw[`food_${i}`] as number ?? 0;

    // Round very small values to zero
    if (grams < 0.5) continue;

    const scale = grams / 100;
    const calories = food.nutrientProfile.energyKcal * scale;
    const costEur = food.costPer100g !== undefined ? food.costPer100g * scale : undefined;

    if (costEur !== undefined) {
      totalCost += costEur;
      hasCost = true;
    }

    quantities.push({ food, grams, calories, costEur });

    // Accumulate achieved nutrients
    for (const key of Object.keys(achieved) as NutrientKey[]) {
      achieved[key] += (food.nutrientProfile[key] as number) * scale;
    }
  }

  return {
    status: 'optimal',
    objectiveValue: raw.result ?? 0,
    quantities,
    achievedNutrients: achieved,
    totalCostEur: hasCost ? totalCost : undefined,
  };
}
