'use client';
import { useState } from 'react';
import { OptimizationResult } from '../../types/solver';
import { NutrientConstraint } from '../../types/constraints';
import { SelectedFood } from '../../types/food';
import { SolverStatusBanner } from './SolverStatusBanner';
import { MealPlanTable } from './MealPlanTable';
import { NutritionSummary } from './NutritionSummary';
import { Spinner } from '../ui/Spinner';

type SolverStatus = 'idle' | 'solving' | 'optimal' | 'infeasible' | 'error';
type Tab = 'plan' | 'nutrition';

interface ResultsPanelProps {
  result: OptimizationResult | null;
  solverStatus: SolverStatus;
  constraints: NutrientConstraint[];
  selectedFoods: SelectedFood[];
  onSolve: () => void;
  onRelaxConstraints: () => void;
}

export function ResultsPanel({
  result,
  solverStatus,
  constraints,
  selectedFoods,
  onSolve,
  onRelaxConstraints,
}: ResultsPanelProps) {
  const [tab, setTab] = useState<Tab>('plan');

  const canSolve = selectedFoods.length >= 1 && solverStatus !== 'solving';

  return (
    <div className="flex flex-col h-full p-5">
      <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">
        3 · Results
      </h2>

      {/* Solve button */}
      <button
        onClick={onSolve}
        disabled={!canSolve}
        className="w-full py-3 px-4 rounded-xl font-semibold text-sm transition-all
          flex items-center justify-center gap-2
          bg-green-500 hover:bg-green-600 active:bg-green-700 text-white
          disabled:opacity-40 disabled:cursor-not-allowed shadow-sm hover:shadow"
      >
        {solverStatus === 'solving' ? (
          <><Spinner size={15} /> Optimizing…</>
        ) : (
          <>
            <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
              <path d="M8.5 1.5a.5.5 0 0 0-1 0v4h-4a.5.5 0 0 0 0 1h4v4a.5.5 0 0 0 1 0v-4h4a.5.5 0 0 0 0-1h-4v-4Z" fill="currentColor"/>
            </svg>
            Optimize Diet
          </>
        )}
      </button>

      {selectedFoods.length === 0 && (
        <p className="text-xs text-gray-400 text-center mt-2">
          Add at least one food to optimize
        </p>
      )}

      {/* Status banner */}
      <div className="mt-3">
        <SolverStatusBanner
          status={solverStatus}
          onRelaxConstraints={onRelaxConstraints}
          errorMessage={result?.errorMessage}
        />
      </div>

      {/* Results tabs */}
      {result && result.status === 'optimal' && (
        <div className="flex-1 flex flex-col mt-4 overflow-hidden">
          <div className="flex gap-1 mb-3">
            {(['plan', 'nutrition'] as Tab[]).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  tab === t
                    ? 'bg-gray-100 text-gray-800'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {t === 'plan' ? 'Meal Plan' : 'Nutrition'}
              </button>
            ))}
          </div>

          <div className="flex-1 overflow-y-auto">
            {tab === 'plan' && (
              <MealPlanTable
                quantities={result.quantities}
                totalCost={result.totalCostEur}
              />
            )}
            {tab === 'nutrition' && (
              <NutritionSummary
                achieved={result.achievedNutrients}
                constraints={constraints}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
}
