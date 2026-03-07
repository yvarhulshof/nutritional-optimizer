'use client';
import { NutrientConstraint, ObjectiveType } from '../../types/constraints';
import { ObjectiveSelector } from './ObjectiveSelector';
import { NutrientConstraints } from './NutrientConstraints';

interface ConstraintsPanelProps {
  objective: ObjectiveType;
  onObjectiveChange: (v: ObjectiveType) => void;
  constraints: NutrientConstraint[];
  onConstraintsChange: (c: NutrientConstraint[]) => void;
  onReset: () => void;
}

export function ConstraintsPanel({
  objective,
  onObjectiveChange,
  constraints,
  onConstraintsChange,
  onReset,
}: ConstraintsPanelProps) {
  return (
    <div className="p-5">
      <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">
        Configure
      </h2>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Left: Optimization target */}
        <div className="lg:w-64 shrink-0">
          <ObjectiveSelector value={objective} onChange={onObjectiveChange} />
        </div>

        {/* Divider */}
        <div className="hidden lg:block w-px bg-gray-100 self-stretch" />

        {/* Right: Nutritional constraints */}
        <div className="flex-1 min-w-0">
          <h3 className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-2">
            Nutritional Constraints
          </h3>
          <NutrientConstraints
            constraints={constraints}
            onChange={onConstraintsChange}
            onReset={onReset}
          />
        </div>
      </div>
    </div>
  );
}
