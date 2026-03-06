import { NutrientKey } from './food';

export type ObjectiveType =
  | 'minimize_cost'
  | 'maximize_protein'
  | 'minimize_calories'
  | 'maximize_fiber';

export interface NutrientConstraint {
  nutrientKey: NutrientKey;
  label: string;
  unit: string;
  min: number | null;
  max: number | null;
  defaultMin: number | null;
  defaultMax: number | null;
  fdaDaily: number;
  efsaDaily?: number;
  enabled: boolean;
  group: 'Macros' | 'Minerals' | 'Vitamins' | 'Fatty Acids';
}
