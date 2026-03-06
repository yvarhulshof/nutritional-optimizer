'use client';
import { NutrientConstraint } from '../../types/constraints';
import { NutrientRow } from './NutrientRow';
import { CONSTRAINT_GROUPS } from '../../lib/nutrition/defaults';

interface NutrientConstraintsProps {
  constraints: NutrientConstraint[];
  onChange: (constraints: NutrientConstraint[]) => void;
  onReset: () => void;
}

export function NutrientConstraints({ constraints, onChange, onReset }: NutrientConstraintsProps) {
  const handleChange = (index: number, updated: NutrientConstraint) => {
    const next = [...constraints];
    next[index] = updated;
    onChange(next);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-1 px-1">
        <div className="flex items-center gap-3 text-[10px] text-gray-400 uppercase tracking-wide font-medium">
          <span className="flex-1">Nutrient</span>
          <span>Min</span>
          <span className="mr-1">Max</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto space-y-3">
        {CONSTRAINT_GROUPS.map((group) => {
          const groupConstraints = constraints
            .map((c, i) => ({ c, i }))
            .filter(({ c }) => c.group === group);

          if (groupConstraints.length === 0) return null;

          return (
            <div key={group}>
              <h4 className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider px-1 mb-1">
                {group}
              </h4>
              <div className="space-y-0.5">
                {groupConstraints.map(({ c, i }) => (
                  <NutrientRow
                    key={c.nutrientKey}
                    constraint={c}
                    onChange={(updated) => handleChange(i, updated)}
                  />
                ))}
              </div>
            </div>
          );
        })}
      </div>

      <div className="pt-3 border-t border-gray-100 mt-3">
        <button
          onClick={onReset}
          className="text-xs text-gray-400 hover:text-green-600 transition-colors"
        >
          ↺ Reset to defaults
        </button>
      </div>
    </div>
  );
}
