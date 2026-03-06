export type FoodSource = 'USDA' | 'OFF';

export interface FoodSearchResult {
  id: string;
  source: FoodSource;
  name: string;
  brand?: string;
  category?: string;
}

export interface NutrientProfile {
  // All values per 100g food, in canonical units
  energyKcal: number;
  proteinG: number;
  fatG: number;
  saturatedFatG: number;
  carbohydratesG: number;
  fiberG: number;
  sugarG: number;
  sodiumMg: number;
  calciumMg: number;
  ironMg: number;
  potassiumMg: number;
  vitaminCMg: number;
  vitaminDMcg: number;
  vitaminB12Mcg: number;
  folateMcg: number;
  magnesiumMg: number;
  zincMg: number;
  omega3G: number;
}

export interface SelectedFood {
  searchResult: FoodSearchResult;
  nutrientProfile: NutrientProfile;
  costPer100g?: number; // EUR, populated from AH match
}

export type NutrientKey = keyof NutrientProfile;
