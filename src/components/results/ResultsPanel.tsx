'use client';
import { OptimizationResult } from '../../types/solver';
import { NutrientConstraint } from '../../types/constraints';
import { SelectedFood } from '../../types/food';
import { SolverStatusBanner } from './SolverStatusBanner';
import { MealPlanTable } from './MealPlanTable';
import { NutritionSummary } from './NutritionSummary';
import { Spinner } from '../ui/Spinner';

type SolverStatus = 'idle' | 'solving' | 'optimal' | 'infeasible' | 'error';

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
  const canSolve = selectedFoods.length >= 1 && solverStatus !== 'solving';

  return (
    <div className="p-5">
      <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">
        Results
      </h2>

      {/* Solve button + status row */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-4">
        <button
          onClick={onSolve}
          disabled={!canSolve}
          className="sm:w-48 py-3 px-4 rounded-xl font-semibold text-sm transition-all
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

        <div className="flex-1">
          <SolverStatusBanner
            status={solverStatus}
            onRelaxConstraints={onRelaxConstraints}
            errorMessage={result?.errorMessage}
          />
        </div>
      </div>

      {/* Results: meal plan + nutrition side by side */}
      {result && result.status === 'optimal' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <h3 className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-2">
              Meal Plan
            </h3>
            <MealPlanTable
              quantities={result.quantities}
              totalCost={result.totalCostEur}
            />
          </div>

          <div>
            <h3 className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-2">
              Nutrition
            </h3>
            <NutritionSummary
              achieved={result.achievedNutrients}
              constraints={constraints}
            />
          </div>
        </div>
      )}
    </div>
  );
}
