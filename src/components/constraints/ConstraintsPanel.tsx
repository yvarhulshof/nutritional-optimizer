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
    <div className="flex flex-col h-full p-5">
      <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">
        2 · Configure
      </h2>

      <div className="mb-5">
        <ObjectiveSelector value={objective} onChange={onObjectiveChange} />
      </div>

      <div className="flex-1 overflow-hidden flex flex-col">
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
  );
}
