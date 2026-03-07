'use client';
import { useState } from 'react';
import { SelectedFood } from '../../types/food';
import { NutrientKey } from '../../types/food';

const METRICS: { key: NutrientKey | 'cost'; label: string; unit: string }[] = [
  { key: 'proteinG',       label: 'Protein',     unit: 'g'       },
  { key: 'cost',           label: 'Cost',        unit: '€/100g'  },
  { key: 'energyKcal',     label: 'Calories',    unit: 'kcal'    },
  { key: 'fatG',           label: 'Fat',         unit: 'g'       },
  { key: 'carbohydratesG', label: 'Carbs',       unit: 'g'       },
  { key: 'fiberG',         label: 'Fiber',       unit: 'g'       },
  { key: 'calciumMg',      label: 'Calcium',     unit: 'mg'      },
  { key: 'ironMg',         label: 'Iron',        unit: 'mg'      },
  { key: 'vitaminCMg',     label: 'Vitamin C',   unit: 'mg'      },
  { key: 'vitaminDMcg',    label: 'Vitamin D',   unit: 'mcg'     },
  { key: 'omega3G',        label: 'Omega-3',     unit: 'g'       },
];

function getValue(food: SelectedFood, key: NutrientKey | 'cost'): number {
  if (key === 'cost') return food.costPer100g ?? 0;
  return food.nutrientProfile[key] ?? 0;
}

interface Props { foods: SelectedFood[] }

export function NutrientBarChart({ foods }: Props) {
  const [metricKey, setMetricKey] = useState<NutrientKey | 'cost'>('proteinG');
  const metric = METRICS.find((m) => m.key === metricKey)!;
  const isCost = metricKey === 'cost';

  const sorted = [...foods]
    .map((f) => ({ food: f, value: getValue(f, metricKey) }))
    .sort((a, b) => b.value - a.value);

  const max = sorted[0]?.value ?? 1;

  return (
    <div>
      <div className="flex items-center gap-2 mb-3">
        <span className="text-xs text-gray-400">Metric:</span>
        <select
          value={metricKey}
          onChange={(e) => setMetricKey(e.target.value as NutrientKey | 'cost')}
          className="text-xs border border-gray-200 rounded-md px-2 py-1 text-gray-700 focus:outline-none focus:ring-1 focus:ring-green-400"
        >
          {METRICS.map((m) => (
            <option key={m.key} value={m.key}>{m.label} ({m.unit})</option>
          ))}
        </select>
      </div>

      <div className="max-h-96 overflow-y-auto pr-1 space-y-1">
        {sorted.map(({ food, value }) => {
          const pct = max > 0 ? (value / max) * 100 : 0;
          const name = food.searchResult.name.split(',')[0];
          return (
            <div key={food.searchResult.id} className="flex items-center gap-2 group">
              <div className="w-36 shrink-0 text-xs text-gray-600 group-hover:text-gray-900 truncate text-right">
                {name}
              </div>
              <div className="flex-1 h-5 bg-gray-50 rounded overflow-hidden">
                <div
                  className={`h-full rounded transition-all ${isCost ? 'bg-amber-400' : 'bg-green-400'}`}
                  style={{ width: `${pct}%` }}
                />
              </div>
              <div className="w-20 shrink-0 text-xs text-gray-500 tabular-nums">
                {isCost ? `€${value.toFixed(2)}` : value > 100 ? Math.round(value) : value.toFixed(1)} {metric.unit}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
