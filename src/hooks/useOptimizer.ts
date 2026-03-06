'use client';
import { useState } from 'react';
import { SelectedFood } from '../types/food';
import { NutrientConstraint, ObjectiveType } from '../types/constraints';
import { OptimizationResult, SolveRequest } from '../types/solver';

type Status = 'idle' | 'solving' | 'optimal' | 'infeasible' | 'error';

export function useOptimizer() {
  const [result, setResult] = useState<OptimizationResult | null>(null);
  const [status, setStatus] = useState<Status>('idle');

  const solve = async (
    foods: SelectedFood[],
    constraints: NutrientConstraint[],
    objective: ObjectiveType
  ) => {
    if (foods.length === 0) return;

    setStatus('solving');
    setResult(null);

    const body: SolveRequest = { foods, constraints, objective };

    try {
      const res = await fetch('/api/solve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const data: OptimizationResult = await res.json();
      setResult(data);
      setStatus(data.status === 'optimal' ? 'optimal' : data.status === 'infeasible' ? 'infeasible' : 'error');
    } catch (err) {
      console.error('Solve error:', err);
      setResult({ status: 'error', objectiveValue: 0, quantities: [], achievedNutrients: {
        energyKcal: 0, proteinG: 0, fatG: 0, saturatedFatG: 0, carbohydratesG: 0,
        fiberG: 0, sugarG: 0, sodiumMg: 0, calciumMg: 0, ironMg: 0, potassiumMg: 0,
        vitaminCMg: 0, vitaminDMcg: 0, vitaminB12Mcg: 0, folateMcg: 0,
        magnesiumMg: 0, zincMg: 0, omega3G: 0,
      }, errorMessage: String(err) });
      setStatus('error');
    }
  };

  return { result, status, solve };
}
