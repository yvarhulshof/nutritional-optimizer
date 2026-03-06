import { SelectedFood, NutrientKey } from '../../types/food';
import { NutrientConstraint, ObjectiveType } from '../../types/constraints';

interface LPModel {
  optimize: string;
  opType: 'min' | 'max';
  constraints: Record<string, { min?: number; max?: number }>;
  variables: Record<string, Record<string, number>>;
}

const OBJECTIVE_CONFIG: Record<ObjectiveType, { key: NutrientKey | 'cost'; opType: 'min' | 'max' }> = {
  minimize_cost:     { key: 'cost', opType: 'min' },
  maximize_protein:  { key: 'proteinG', opType: 'max' },
  minimize_calories: { key: 'energyKcal', opType: 'min' },
  maximize_fiber:    { key: 'fiberG', opType: 'max' },
};

export function buildModel(
  foods: SelectedFood[],
  constraints: NutrientConstraint[],
  objective: ObjectiveType,
  maxGramsPerFood = 800
): LPModel {
  const { key: objKey, opType } = OBJECTIVE_CONFIG[objective];

  const model: LPModel = {
    optimize: 'objective',
    opType,
    constraints: {},
    variables: {},
  };

  // Add nutrient constraints
  const enabledConstraints = constraints.filter((c) => c.enabled);
  for (const c of enabledConstraints) {
    const entry: { min?: number; max?: number } = {};
    if (c.min !== null) entry.min = c.min;
    if (c.max !== null) entry.max = c.max;
    if (Object.keys(entry).length > 0) {
      model.constraints[c.nutrientKey] = entry;
    }
  }

  // Add per-food variables
  for (let i = 0; i < foods.length; i++) {
    const food = foods[i];
    const varName = `food_${i}`;
    const profile = food.nutrientProfile;

    // Per-food max cap constraint
    const capKey = `cap_${i}`;
    model.constraints[capKey] = { max: maxGramsPerFood };

    const variable: Record<string, number> = {
      [capKey]: 1,
    };

    // Objective coefficient (per gram)
    if (objKey === 'cost') {
      variable['objective'] = (food.costPer100g ?? 0) / 100;
    } else {
      variable['objective'] = (profile[objKey] as number) / 100;
    }

    // Nutrient coefficients for enabled constraints (values are per 100g → divide by 100)
    for (const c of enabledConstraints) {
      const nutrientValue = profile[c.nutrientKey] as number;
      variable[c.nutrientKey] = nutrientValue / 100;
    }

    model.variables[varName] = variable;
  }

  return model;
}
