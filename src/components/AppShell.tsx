'use client';
import { useState, useCallback } from 'react';
import { ConstraintsPanel } from './constraints/ConstraintsPanel';
import { ResultsPanel } from './results/ResultsPanel';
import { SelectedFood, DietaryTag } from '../types/food';
import { FoodQuantity } from '../types/solver';
import { NutrientConstraint, ObjectiveType } from '../types/constraints';
import { DEFAULT_CONSTRAINTS } from '../lib/nutrition/defaults';
import { COMMON_FOODS } from '../lib/nutrition/commonFoods';
import { useOptimizer } from '../hooks/useOptimizer';
import { FoodBreakdownPanel } from './food-breakdown/FoodBreakdownPanel';

const ALL_FOODS: SelectedFood[] = COMMON_FOODS.map((sf) => ({
  searchResult: sf.result,
  nutrientProfile: sf.profile,
  costPer100g: sf.costPer100g,
}));

export function AppShell() {
  const [diet, setDiet] = useState<DietaryTag[]>([]);
  const [objective, setObjective] = useState<ObjectiveType>('minimize_cost');
  const [constraints, setConstraints] = useState<NutrientConstraint[]>(
    DEFAULT_CONSTRAINTS.map((c) => ({ ...c }))
  );

  const filteredFoods = diet.length === 0
    ? ALL_FOODS
    : ALL_FOODS.filter((f) =>
        diet.every((tag) => f.searchResult.dietaryTags?.includes(tag))
      );

  const { result, status, solve } = useOptimizer();

  const quantitiesInSolution: FoodQuantity[] =
    result?.status === 'optimal' ? result.quantities : [];

  const handleReset = useCallback(() => {
    setConstraints(DEFAULT_CONSTRAINTS.map((c) => ({ ...c })));
  }, []);

  const handleSolve = useCallback(() => {
    solve(filteredFoods, constraints, objective);
  }, [filteredFoods, constraints, objective, solve]);

  const handleRelaxConstraints = useCallback(() => {
    setConstraints((prev) =>
      prev.map((c) => ({
        ...c,
        min: c.min !== null ? c.min * 0.8 : null,
        max: c.max !== null ? c.max * 1.2 : null,
      }))
    );
  }, []);

  return (
    <div className="max-w-screen-xl mx-auto px-4 py-6">
      {/* Intro text */}
      <div className="mb-6 text-center max-w-2xl mx-auto">
        <h1 className="text-2xl font-semibold text-gray-900 mb-1.5">
          Personal Nutritional Optimizer
        </h1>
        <p className="text-sm text-gray-500">
          Inspired by the{' '}
          <a
            href="https://en.wikipedia.org/wiki/Stigler_diet"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-gray-700"
          >
            Stigler diet problem
          </a>
          {' '}— find the optimal foods to meet your nutritional goals using linear programming.
        </p>
      </div>

      {/* Stacked layout */}
      <div className="flex flex-col gap-4">
        {/* Configure panel — full width */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <ConstraintsPanel
            objective={objective}
            onObjectiveChange={setObjective}
            constraints={constraints}
            onConstraintsChange={setConstraints}
            onReset={handleReset}
            diet={diet}
            onDietChange={setDiet}
            candidateFoods={filteredFoods}
          />
        </div>

        {/* Results panel — full width */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <ResultsPanel
            result={result}
            solverStatus={status}
            constraints={constraints}
            selectedFoods={filteredFoods}
            onSolve={handleSolve}
            onRelaxConstraints={handleRelaxConstraints}
          />
        </div>

        {/* Food breakdown panel — full width */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <FoodBreakdownPanel quantities={quantitiesInSolution} />
        </div>
      </div>

      {/* Footnote */}
      <p className="text-center text-xs text-gray-400 mt-6">
        Nutritional constraints default to FDA Daily Values (2000 kcal reference adult). Not medical advice.
      </p>
    </div>
  );
}
