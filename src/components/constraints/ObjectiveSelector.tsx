'use client';
import { ObjectiveType } from '../../types/constraints';

const OBJECTIVES: { value: ObjectiveType; label: string; description: string }[] = [
  { value: 'minimize_cost',    label: 'Min Cost',    description: 'Cheapest diet meeting constraints' },
  { value: 'maximize_protein', label: 'Max Protein', description: 'Most protein within constraints' },
  { value: 'minimize_calories', label: 'Min Calories', description: 'Fewest calories meeting constraints' },
  { value: 'maximize_fiber',   label: 'Max Fiber',   description: 'Most fiber within constraints' },
];

interface ObjectiveSelectorProps {
  value: ObjectiveType;
  onChange: (v: ObjectiveType) => void;
}

export function ObjectiveSelector({ value, onChange }: ObjectiveSelectorProps) {
  return (
    <div>
      <label className="text-xs font-medium text-gray-400 uppercase tracking-wide block mb-2">
        Optimization Target
      </label>
      <div className="grid grid-cols-2 gap-1.5">
        {OBJECTIVES.map((obj) => (
          <button
            key={obj.value}
            onClick={() => onChange(obj.value)}
            title={obj.description}
            className={`px-3 py-2 rounded-lg text-xs font-medium text-left transition-colors ${
              value === obj.value
                ? 'bg-green-500 text-white shadow-sm'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {obj.label}
          </button>
        ))}
      </div>
    </div>
  );
}
