import { NutrientProfile, SelectedFood } from './food';

export interface FoodQuantity {
  food: SelectedFood;
  grams: number;
  calories: number;
  costEur?: number;
}

export interface OptimizationResult {
  status: 'optimal' | 'infeasible' | 'unbounded' | 'error';
  objectiveValue: number;
  quantities: FoodQuantity[];
  achievedNutrients: NutrientProfile;
  totalCostEur?: number;
  errorMessage?: string;
}

export interface SolveRequest {
  foods: SelectedFood[];
  constraints: import('./constraints').NutrientConstraint[];
  objective: import('./constraints').ObjectiveType;
  maxGramsPerFood?: number;
}
