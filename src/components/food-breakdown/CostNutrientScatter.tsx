'use client';
import { useState } from 'react';
import { SelectedFood } from '../../types/food';
import { NutrientKey } from '../../types/food';

const Y_OPTIONS: { key: NutrientKey; label: string; unit: string }[] = [
  { key: 'proteinG',       label: 'Protein',     unit: 'g'   },
  { key: 'energyKcal',     label: 'Calories',    unit: 'kcal'},
  { key: 'fiberG',         label: 'Fiber',       unit: 'g'   },
  { key: 'calciumMg',      label: 'Calcium',     unit: 'mg'  },
  { key: 'ironMg',         label: 'Iron',        unit: 'mg'  },
  { key: 'vitaminCMg',     label: 'Vitamin C',   unit: 'mg'  },
  { key: 'vitaminDMcg',    label: 'Vitamin D',   unit: 'mcg' },
  { key: 'omega3G',        label: 'Omega-3',     unit: 'g'   },
];

const W = 760, H = 340;
const PAD = { top: 16, right: 20, bottom: 48, left: 52 };
const PW = W - PAD.left - PAD.right;
const PH = H - PAD.top - PAD.bottom;

function niceTicks(max: number, n = 5): number[] {
  const step = Math.pow(10, Math.floor(Math.log10(max / n)));
  const nice = [1, 2, 2.5, 5, 10].map((f) => f * step).find((s) => max / s <= n + 1) ?? step;
  const ticks: number[] = [];
  for (let v = 0; v <= max * 1.05; v += nice) ticks.push(parseFloat(v.toFixed(4)));
  return ticks;
}

interface Props { foods: SelectedFood[] }

export function CostNutrientScatter({ foods }: Props) {
  const [yKey, setYKey] = useState<NutrientKey>('proteinG');
  const yOption = Y_OPTIONS.find((o) => o.key === yKey)!;

  const foodsWithCost = foods.filter((f) => f.costPer100g != null);
  const maxX = Math.max(...foodsWithCost.map((f) => f.costPer100g!)) * 1.1;
  const maxY = Math.max(...foodsWithCost.map((f) => f.nutrientProfile[yKey] ?? 0)) * 1.1;
  const maxKcal = Math.max(...foodsWithCost.map((f) => f.nutrientProfile.energyKcal));

  const xTicks = niceTicks(maxX, 6);
  const yTicks = niceTicks(maxY, 5);

  const toX = (v: number) => PAD.left + (v / maxX) * PW;
  const toY = (v: number) => PAD.top + PH - (v / maxY) * PH;

  return (
    <div>
      <div className="flex items-center gap-2 mb-3">
        <span className="text-xs text-gray-400">Y axis:</span>
        <select
          value={yKey}
          onChange={(e) => setYKey(e.target.value as NutrientKey)}
          className="text-xs border border-gray-200 rounded-md px-2 py-1 text-gray-700 focus:outline-none focus:ring-1 focus:ring-green-400"
        >
          {Y_OPTIONS.map((o) => (
            <option key={o.key} value={o.key}>{o.label}</option>
          ))}
        </select>
        <span className="text-xs text-gray-400 ml-4">dot size = calories</span>
      </div>

      <div className="overflow-x-auto">
        <svg viewBox={`0 0 ${W} ${H}`} width={W} height={H} className="max-w-full">
          {/* Grid lines */}
          {yTicks.map((t) => (
            <line key={t} x1={PAD.left} x2={PAD.left + PW} y1={toY(t)} y2={toY(t)}
              stroke="#f0f0ee" strokeWidth={1} />
          ))}
          {xTicks.map((t) => (
            <line key={t} x1={toX(t)} x2={toX(t)} y1={PAD.top} y2={PAD.top + PH}
              stroke="#f0f0ee" strokeWidth={1} />
          ))}

          {/* Axes */}
          <line x1={PAD.left} x2={PAD.left + PW} y1={PAD.top + PH} y2={PAD.top + PH}
            stroke="#e5e5e0" strokeWidth={1} />
          <line x1={PAD.left} x2={PAD.left} y1={PAD.top} y2={PAD.top + PH}
            stroke="#e5e5e0" strokeWidth={1} />

          {/* X ticks + labels */}
          {xTicks.map((t) => (
            <g key={t}>
              <line x1={toX(t)} x2={toX(t)} y1={PAD.top + PH} y2={PAD.top + PH + 4}
                stroke="#d1d5db" strokeWidth={1} />
              <text x={toX(t)} y={PAD.top + PH + 16} textAnchor="middle"
                fontSize={10} fill="#9ca3af">
                €{t.toFixed(2)}
              </text>
            </g>
          ))}

          {/* Y ticks + labels */}
          {yTicks.map((t) => (
            <g key={t}>
              <line x1={PAD.left - 4} x2={PAD.left} y1={toY(t)} y2={toY(t)}
                stroke="#d1d5db" strokeWidth={1} />
              <text x={PAD.left - 7} y={toY(t) + 3} textAnchor="end"
                fontSize={10} fill="#9ca3af">
                {t}
              </text>
            </g>
          ))}

          {/* Axis labels */}
          <text x={PAD.left + PW / 2} y={H - 4} textAnchor="middle" fontSize={11} fill="#6b7280">
            Cost (€/100g)
          </text>
          <text
            x={14} y={PAD.top + PH / 2}
            textAnchor="middle" fontSize={11} fill="#6b7280"
            transform={`rotate(-90, 14, ${PAD.top + PH / 2})`}
          >
            {yOption.label} ({yOption.unit})
          </text>

          {/* Dots */}
          {foodsWithCost.map((food) => {
            const x = toX(food.costPer100g!);
            const y = toY(food.nutrientProfile[yKey] ?? 0);
            const r = 4 + (food.nutrientProfile.energyKcal / maxKcal) * 10;
            return (
              <circle key={food.searchResult.id}
                cx={x} cy={y} r={r}
                fill="rgba(34,197,94,0.55)"
                stroke="rgba(22,163,74,0.8)"
                strokeWidth={1}
              >
                <title>{food.searchResult.name.split(',')[0]} — €{food.costPer100g?.toFixed(2)}/100g, {food.nutrientProfile[yKey]}{yOption.unit}</title>
              </circle>
            );
          })}
        </svg>
      </div>
    </div>
  );
}
