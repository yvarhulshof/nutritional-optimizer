'use client';
import { NutrientProfile } from '../../types/food';
import { NutrientConstraint } from '../../types/constraints';

interface NutritionSummaryProps {
  achieved: NutrientProfile;
  constraints: NutrientConstraint[];
}

function ProgressBar({
  value,
  min,
  max,
  label,
  unit,
}: {
  value: number;
  min: number | null;
  max: number | null;
  label: string;
  unit: string;
}) {
  // Determine reference for bar width
  const reference = max ?? (min ? min * 2 : 100);
  const pct = Math.min((value / reference) * 100, 100);

  // Determine color
  const belowMin = min !== null && value < min;
  const aboveMax = max !== null && value > max;
  const barColor = belowMin ? 'bg-red-400' : aboveMax ? 'bg-amber-400' : 'bg-green-400';

  const minMarkerPct = min !== null ? Math.min((min / reference) * 100, 100) : null;
  const maxMarkerPct = max !== null ? Math.min((max / reference) * 100, 100) : null;

  const formatValue = (v: number) =>
    v < 10 ? v.toFixed(1) : Math.round(v).toLocaleString();

  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-xs">
        <span className="text-gray-600 font-medium">{label}</span>
        <span className={`tabular-nums font-semibold ${
          belowMin ? 'text-red-500' : aboveMax ? 'text-amber-500' : 'text-green-600'
        }`}>
          {formatValue(value)} {unit}
          {belowMin && ' ↓'}
          {aboveMax && ' ↑'}
        </span>
      </div>
      <div className="relative h-2 bg-gray-100 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ${barColor}`}
          style={{ width: `${pct}%` }}
        />
        {minMarkerPct !== null && (
          <div
            className="absolute top-0 bottom-0 w-0.5 bg-gray-400 opacity-60"
            style={{ left: `${minMarkerPct}%` }}
            title={`Min: ${min} ${unit}`}
          />
        )}
        {maxMarkerPct !== null && (
          <div
            className="absolute top-0 bottom-0 w-0.5 bg-gray-600 opacity-60"
            style={{ left: `${maxMarkerPct}%` }}
            title={`Max: ${max} ${unit}`}
          />
        )}
      </div>
    </div>
  );
}

export function NutritionSummary({ achieved, constraints }: NutritionSummaryProps) {
  const enabledConstraints = constraints.filter((c) => c.enabled);

  if (Object.values(achieved).every((v) => v === 0)) {
    return <p className="text-sm text-gray-400 text-center py-6">Run the optimizer to see nutrition breakdown.</p>;
  }

  return (
    <div className="space-y-3">
      {enabledConstraints.map((c) => (
        <ProgressBar
          key={c.nutrientKey}
          value={achieved[c.nutrientKey]}
          min={c.min}
          max={c.max}
          label={c.label}
          unit={c.unit}
        />
      ))}
      <p className="text-[10px] text-gray-400 pt-1">
        Vertical lines mark min (light) and max (dark) limits. Red = below min, amber = above max.
      </p>
    </div>
  );
}
