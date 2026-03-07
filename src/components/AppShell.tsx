'use client';
import { useState, useCallback } from 'react';
import { FoodSearchPanel } from './food-search/FoodSearchPanel';
import { ConstraintsPanel } from './constraints/ConstraintsPanel';
import { ResultsPanel } from './results/ResultsPanel';
import { SelectedFood } from '../types/food';
import { NutrientConstraint, ObjectiveType } from '../types/constraints';
import { DEFAULT_CONSTRAINTS } from '../lib/nutrition/defaults';
import { COMMON_FOODS } from '../lib/nutrition/commonFoods';
import { useOptimizer } from '../hooks/useOptimizer';

const ALL_FOODS: SelectedFood[] = COMMON_FOODS.map((sf) => ({
  searchResult: sf.result,
  nutrientProfile: sf.profile,
}));

export function AppShell() {
  const [selectedFoods, setSelectedFoods] = useState<SelectedFood[]>(ALL_FOODS);
  const [objective, setObjective] = useState<ObjectiveType>('minimize_cost');
  const [constraints, setConstraints] = useState<NutrientConstraint[]>(
    DEFAULT_CONSTRAINTS.map((c) => ({ ...c }))
  );

  const { result, status, solve } = useOptimizer();

  const handleAddFood = useCallback((food: SelectedFood) => {
    setSelectedFoods((prev) => [...prev, food]);
  }, []);

  const handleRemoveFood = useCallback((index: number) => {
    setSelectedFoods((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const handleReset = useCallback(() => {
    setConstraints(DEFAULT_CONSTRAINTS.map((c) => ({ ...c })));
  }, []);

  const handleSolve = useCallback(() => {
    solve(selectedFoods, constraints, objective);
  }, [selectedFoods, constraints, objective, solve]);

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

      {/* Three-panel layout */}
      <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr_360px] gap-4 min-h-[700px]">
        {/* Panel 1: Food Search */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col">
          <FoodSearchPanel
            selectedFoods={selectedFoods}
            onAdd={handleAddFood}
            onRemove={handleRemoveFood}
          />
        </div>

        {/* Panel 2: Constraints */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col">
          <ConstraintsPanel
            objective={objective}
            onObjectiveChange={setObjective}
            constraints={constraints}
            onConstraintsChange={setConstraints}
            onReset={handleReset}
          />
        </div>

        {/* Panel 3: Results */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col">
          <ResultsPanel
            result={result}
            solverStatus={status}
            constraints={constraints}
            selectedFoods={selectedFoods}
            onSolve={handleSolve}
            onRelaxConstraints={handleRelaxConstraints}
          />
        </div>
      </div>

      {/* Footnote */}
      <p className="text-center text-xs text-gray-400 mt-6">
        Nutritional constraints default to FDA Daily Values (2000 kcal reference adult). Not medical advice.
      </p>
    </div>
  );
}
