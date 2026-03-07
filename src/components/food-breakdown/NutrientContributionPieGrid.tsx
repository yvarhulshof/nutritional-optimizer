'use client';

import { NutrientKey, SelectedFood } from '../../types/food';

const NUTRIENTS: { key: NutrientKey; label: string; unit: string }[] = [
  { key: 'energyKcal', label: 'Calories', unit: 'kcal' },
  { key: 'proteinG', label: 'Protein', unit: 'g' },
  { key: 'fatG', label: 'Fat', unit: 'g' },
  { key: 'saturatedFatG', label: 'Sat. Fat', unit: 'g' },
  { key: 'carbohydratesG', label: 'Carbs', unit: 'g' },
  { key: 'fiberG', label: 'Fiber', unit: 'g' },
  { key: 'sugarG', label: 'Sugar', unit: 'g' },
  { key: 'sodiumMg', label: 'Sodium', unit: 'mg' },
  { key: 'calciumMg', label: 'Calcium', unit: 'mg' },
  { key: 'ironMg', label: 'Iron', unit: 'mg' },
  { key: 'potassiumMg', label: 'Potassium', unit: 'mg' },
  { key: 'vitaminCMg', label: 'Vitamin C', unit: 'mg' },
  { key: 'vitaminDMcg', label: 'Vitamin D', unit: 'mcg' },
  { key: 'vitaminB12Mcg', label: 'Vitamin B12', unit: 'mcg' },
  { key: 'folateMcg', label: 'Folate', unit: 'mcg' },
  { key: 'magnesiumMg', label: 'Magnesium', unit: 'mg' },
  { key: 'zincMg', label: 'Zinc', unit: 'mg' },
  { key: 'omega3G', label: 'Omega-3', unit: 'g' },
];

const COLORS = [
  '#22c55e', '#10b981', '#06b6d4', '#3b82f6', '#6366f1',
  '#8b5cf6', '#a855f7', '#d946ef', '#ec4899', '#f43f5e',
  '#f97316', '#f59e0b', '#84cc16', '#14b8a6', '#0ea5e9',
];

const SIZE = 180;
const CENTER = SIZE / 2;
const RADIUS = 66;

function polarToCartesian(cx: number, cy: number, radius: number, angleRadians: number) {
  return {
    x: cx + radius * Math.cos(angleRadians),
    y: cy + radius * Math.sin(angleRadians),
  };
}

function arcPath(startAngle: number, endAngle: number) {
  const start = polarToCartesian(CENTER, CENTER, RADIUS, startAngle);
  const end = polarToCartesian(CENTER, CENTER, RADIUS, endAngle);
  const largeArc = endAngle - startAngle > Math.PI ? 1 : 0;

  return [
    `M ${CENTER} ${CENTER}`,
    `L ${start.x} ${start.y}`,
    `A ${RADIUS} ${RADIUS} 0 ${largeArc} 1 ${end.x} ${end.y}`,
    'Z',
  ].join(' ');
}

interface Props { foods: SelectedFood[] }

export function NutrientContributionPieGrid({ foods }: Props) {
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {NUTRIENTS.map(({ key, label, unit }) => {
        const totals = foods.map((food) => ({
          id: food.searchResult.id,
          name: food.searchResult.name.split(',')[0],
          value: food.nutrientProfile[key] ?? 0,
        }));

        const total = totals.reduce((sum, item) => sum + item.value, 0);

        if (total <= 0) {
          return (
            <div key={key} className="border border-gray-100 rounded-xl p-3 bg-gray-50">
              <p className="text-xs font-medium text-gray-700 mb-1">{label}</p>
              <p className="text-[11px] text-gray-400">No measurable contribution</p>
            </div>
          );
        }

        let currentAngle = -Math.PI / 2;

        return (
          <div key={key} className="border border-gray-100 rounded-xl p-3 bg-white">
            <div className="flex items-baseline justify-between mb-2">
              <p className="text-xs font-medium text-gray-700">{label}</p>
              <p className="text-[10px] text-gray-400">
                {total > 100 ? Math.round(total) : total.toFixed(1)} {unit}
              </p>
            </div>

            <svg viewBox={`0 0 ${SIZE} ${SIZE}`} className="w-full h-auto">
              {totals
                .filter((item) => item.value > 0)
                .map((item, index) => {
                  const ratio = item.value / total;
                  const endAngle = currentAngle + ratio * Math.PI * 2;
                  const midAngle = (currentAngle + endAngle) / 2;
                  const path = arcPath(currentAngle, endAngle);

                  const labelPoint = polarToCartesian(CENTER, CENTER, RADIUS * 0.62, midAngle);
                  const shortName = item.name.length > 13 ? `${item.name.slice(0, 12)}…` : item.name;
                  const pct = `${Math.round(ratio * 100)}%`;

                  currentAngle = endAngle;

                  return (
                    <g key={item.id}>
                      <path d={path} fill={COLORS[index % COLORS.length]} stroke="#fff" strokeWidth="1" />
                      <text
                        x={labelPoint.x}
                        y={labelPoint.y}
                        textAnchor="middle"
                        dominantBaseline="middle"
                        fill="white"
                        fontSize="8"
                        fontWeight="600"
                        paintOrder="stroke"
                        stroke="rgba(17,24,39,0.35)"
                        strokeWidth="1.5"
                      >
                        <tspan x={labelPoint.x} dy="-0.2em">{shortName}</tspan>
                        <tspan x={labelPoint.x} dy="1.15em">{pct}</tspan>
                      </text>
                    </g>
                  );
                })}
            </svg>
          </div>
        );
      })}
    </div>
  );
}
