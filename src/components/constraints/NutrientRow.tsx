'use client';
import { NutrientConstraint } from '../../types/constraints';
import { NumberInput } from '../ui/NumberInput';

interface NutrientRowProps {
  constraint: NutrientConstraint;
  onChange: (updated: NutrientConstraint) => void;
}

export function NutrientRow({ constraint, onChange }: NutrientRowProps) {
  return (
    <div className={`flex items-center gap-2 py-2 px-1 rounded-lg transition-colors ${
      constraint.enabled ? '' : 'opacity-40'
    }`}>
      {/* Enable toggle */}
      <button
        onClick={() => onChange({ ...constraint, enabled: !constraint.enabled })}
        className={`flex-shrink-0 w-8 h-4 rounded-full transition-colors relative ${
          constraint.enabled ? 'bg-green-400' : 'bg-gray-200'
        }`}
        title={constraint.enabled ? 'Disable constraint' : 'Enable constraint'}
      >
        <span className={`absolute top-0.5 w-3 h-3 bg-white rounded-full shadow-sm transition-transform ${
          constraint.enabled ? 'left-4.5 translate-x-0.5' : 'left-0.5'
        }`} />
      </button>

      {/* Label */}
      <div className="flex-1 min-w-0">
        <span className="text-xs text-gray-700 font-medium truncate">{constraint.label}</span>
      </div>

      {/* Min / Max inputs */}
      <div className="flex items-center gap-1 flex-shrink-0">
        <NumberInput
          value={constraint.min}
          onChange={(v) => onChange({ ...constraint, min: v })}
          placeholder="min"
          min={0}
          step={constraint.unit === 'mcg' ? 0.1 : 1}
        />
        <span className="text-[10px] text-gray-300">–</span>
        <NumberInput
          value={constraint.max}
          onChange={(v) => onChange({ ...constraint, max: v })}
          placeholder="max"
          min={0}
          step={constraint.unit === 'mcg' ? 0.1 : 1}
        />
        <span className="text-[10px] text-gray-400 w-6 text-right">{constraint.unit}</span>
      </div>
    </div>
  );
}
