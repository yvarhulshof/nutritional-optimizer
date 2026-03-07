'use client';
import { SelectedFood } from '../../types/food';

interface Props { foods: SelectedFood[] }

function MacroBar({ protein, fat, carbs }: { protein: number; fat: number; carbs: number }) {
  const pKcal = protein * 4;
  const fKcal = fat * 9;
  const cKcal = carbs * 4;
  const total = pKcal + fKcal + cKcal;
  if (total === 0) return <div className="h-2 rounded-full bg-gray-100" />;
  const pPct = (pKcal / total) * 100;
  const fPct = (fKcal / total) * 100;
  const cPct = (cKcal / total) * 100;
  return (
    <div className="flex h-2 rounded-full overflow-hidden gap-px" title={`Protein ${pPct.toFixed(0)}% · Fat ${fPct.toFixed(0)}% · Carbs ${cPct.toFixed(0)}%`}>
      <div className="bg-blue-400" style={{ width: `${pPct}%` }} />
      <div className="bg-yellow-400" style={{ width: `${fPct}%` }} />
      <div className="bg-orange-400" style={{ width: `${cPct}%` }} />
    </div>
  );
}

function Chip({ label, value, unit }: { label: string; value: number; unit: string }) {
  return (
    <div className="flex items-center gap-0.5 bg-gray-50 rounded px-1.5 py-0.5">
      <span className="text-[10px] text-gray-400">{label}</span>
      <span className="text-[10px] font-medium text-gray-600">{value > 10 ? Math.round(value) : value.toFixed(1)}{unit}</span>
    </div>
  );
}

export function FoodCards({ foods }: Props) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
      {foods.map((food) => {
        const p = food.nutrientProfile;
        const name = food.searchResult.name.split(',')[0];
        return (
          <div key={food.searchResult.id}
            className="bg-gray-50 rounded-xl p-3 flex flex-col gap-2 border border-gray-100">
            {/* Name + cost */}
            <div>
              <p className="text-xs font-medium text-gray-800 leading-tight line-clamp-2">{name}</p>
              {food.costPer100g != null && (
                <span className="text-[10px] text-green-600 font-semibold">€{food.costPer100g.toFixed(2)}/100g</span>
              )}
            </div>

            {/* Macro bar */}
            <MacroBar protein={p.proteinG} fat={p.fatG} carbs={p.carbohydratesG} />
            <div className="flex justify-between text-[9px] text-gray-400 -mt-1">
              <span className="text-blue-400">P</span>
              <span className="text-yellow-500">F</span>
              <span className="text-orange-400">C</span>
            </div>

            {/* Calories */}
            <p className="text-[11px] text-gray-500 font-medium">{Math.round(p.energyKcal)} kcal</p>

            {/* Micro chips */}
            <div className="flex flex-wrap gap-1">
              <Chip label="Fe" value={p.ironMg} unit="mg" />
              <Chip label="Ca" value={p.calciumMg} unit="mg" />
              <Chip label="C" value={p.vitaminCMg} unit="mg" />
            </div>
          </div>
        );
      })}
    </div>
  );
}
