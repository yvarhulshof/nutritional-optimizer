'use client';
import { SelectedFood } from '../../types/food';
import { NutrientKey } from '../../types/food';

const COLS: { key: NutrientKey; label: string }[] = [
  { key: 'energyKcal',     label: 'kcal'  },
  { key: 'proteinG',       label: 'prot'  },
  { key: 'fatG',           label: 'fat'   },
  { key: 'carbohydratesG', label: 'carb'  },
  { key: 'fiberG',         label: 'fiber' },
  { key: 'sodiumMg',       label: 'Na'    },
  { key: 'calciumMg',      label: 'Ca'    },
  { key: 'ironMg',         label: 'Fe'    },
  { key: 'vitaminCMg',     label: 'vitC'  },
  { key: 'vitaminDMcg',    label: 'vitD'  },
  { key: 'vitaminB12Mcg',  label: 'B12'   },
  { key: 'omega3G',        label: 'ω-3'   },
];

interface Props { foods: SelectedFood[] }

export function NutrientHeatmap({ foods }: Props) {
  const maxes = Object.fromEntries(
    COLS.map(({ key }) => [
      key,
      Math.max(...foods.map((f) => f.nutrientProfile[key] ?? 0)),
    ])
  ) as Record<NutrientKey, number>;

  return (
    <div className="overflow-x-auto">
      <table className="text-[11px] border-collapse min-w-max">
        <thead>
          <tr>
            <th className="text-left pr-3 pb-1 font-medium text-gray-400 whitespace-nowrap" style={{ minWidth: 140 }}>
              Food
            </th>
            {COLS.map(({ key, label }) => (
              <th key={key} className="pb-1 font-medium text-gray-400 text-center" style={{ width: 36 }}>
                {label}
              </th>
            ))}
            <th className="pb-1 pl-2 font-medium text-gray-400 text-right whitespace-nowrap" style={{ minWidth: 60 }}>
              €/100g
            </th>
          </tr>
        </thead>
        <tbody>
          {foods.map((food) => (
            <tr key={food.searchResult.id} className="group">
              <td className="pr-3 py-px text-gray-600 group-hover:text-gray-900 whitespace-nowrap truncate" style={{ maxWidth: 160 }}>
                {food.searchResult.name.split(',')[0]}
              </td>
              {COLS.map(({ key }) => {
                const val = food.nutrientProfile[key] ?? 0;
                const ratio = maxes[key] > 0 ? val / maxes[key] : 0;
                const alpha = Math.max(0.04, ratio);
                return (
                  <td key={key} className="py-px px-0.5">
                    <div
                      className="rounded"
                      style={{
                        width: 28,
                        height: 18,
                        backgroundColor: `rgba(34, 197, 94, ${alpha})`,
                      }}
                      title={`${food.searchResult.name}: ${val}`}
                    />
                  </td>
                );
              })}
              <td className="py-px pl-2 text-right text-gray-500 tabular-nums">
                {food.costPer100g != null ? `€${food.costPer100g.toFixed(2)}` : '—'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
