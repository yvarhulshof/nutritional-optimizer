'use client';
import { FoodQuantity } from '../../types/solver';

interface MealPlanTableProps {
  quantities: FoodQuantity[];
  totalCost?: number;
}

function fmt(n: number, decimals = 0) {
  return n.toFixed(decimals);
}

export function MealPlanTable({ quantities, totalCost }: MealPlanTableProps) {
  if (quantities.length === 0) {
    return <p className="text-sm text-gray-400 text-center py-6">Run the optimizer to see your meal plan.</p>;
  }

  const totalKcal = quantities.reduce((s, q) => s + q.calories, 0);

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-xs">
        <thead>
          <tr className="border-b border-gray-100">
            <th className="text-left py-2 px-1 text-gray-400 font-medium">Food</th>
            <th className="text-right py-2 px-1 text-gray-400 font-medium">g/day</th>
            <th className="text-right py-2 px-1 text-gray-400 font-medium">kcal</th>
            {quantities.some((q) => q.costEur !== undefined) && (
              <th className="text-right py-2 px-1 text-gray-400 font-medium">cost</th>
            )}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {quantities.map((q, i) => (
            <tr key={i} className="hover:bg-gray-50">
              <td className="py-2 px-1 text-gray-700 max-w-[140px] truncate">
                {q.food.searchResult.name}
              </td>
              <td className="py-2 px-1 text-right text-gray-600 tabular-nums font-medium">
                {fmt(q.grams)}
              </td>
              <td className="py-2 px-1 text-right text-gray-600 tabular-nums">
                {fmt(q.calories)}
              </td>
              {quantities.some((qq) => qq.costEur !== undefined) && (
                <td className="py-2 px-1 text-right text-gray-500 tabular-nums">
                  {q.costEur !== undefined ? `€${fmt(q.costEur, 2)}` : '—'}
                </td>
              )}
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr className="border-t border-gray-200">
            <td className="py-2 px-1 text-gray-500 font-medium text-xs">Total</td>
            <td className="py-2 px-1 text-right text-gray-500 tabular-nums font-medium">
              {fmt(quantities.reduce((s, q) => s + q.grams, 0))} g
            </td>
            <td className="py-2 px-1 text-right text-gray-500 tabular-nums font-medium">
              {fmt(totalKcal)} kcal
            </td>
            {quantities.some((q) => q.costEur !== undefined) && (
              <td className="py-2 px-1 text-right text-green-600 tabular-nums font-semibold">
                {totalCost !== undefined ? `€${fmt(totalCost, 2)}` : '—'}
              </td>
            )}
          </tr>
        </tfoot>
      </table>
    </div>
  );
}
