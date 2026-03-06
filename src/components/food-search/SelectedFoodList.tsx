'use client';
import { SelectedFood } from '../../types/food';
import { Badge } from '../ui/Badge';
import { Tooltip } from '../ui/Tooltip';
import { countCompleteness } from '../../lib/nutrition/normalize';

interface SelectedFoodListProps {
  foods: SelectedFood[];
  onRemove: (index: number) => void;
}

function CompletenessBar({ pct }: { pct: number }) {
  const color = pct >= 70 ? 'bg-green-400' : pct >= 40 ? 'bg-amber-400' : 'bg-red-400';
  return (
    <div className="h-1 w-12 bg-gray-100 rounded-full overflow-hidden">
      <div className={`h-full ${color} rounded-full`} style={{ width: `${pct}%` }} />
    </div>
  );
}

export function SelectedFoodList({ foods, onRemove }: SelectedFoodListProps) {
  if (foods.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-center">
        <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center mb-3">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="text-gray-400">
            <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2Zm1 15h-2v-2h2v2Zm0-4h-2V7h2v6Z" fill="currentColor"/>
          </svg>
        </div>
        <p className="text-sm text-gray-400">Search and add foods to get started</p>
      </div>
    );
  }

  return (
    <div className="space-y-1.5">
      {foods.map((food, i) => {
        const completeness = countCompleteness(food.nutrientProfile);
        return (
          <div
            key={`${food.searchResult.source}-${food.searchResult.id}-${i}`}
            className="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-lg group"
          >
            <div className="flex-1 min-w-0">
              <p className="text-sm text-gray-800 truncate font-medium">{food.searchResult.name}</p>
              <div className="flex items-center gap-2 mt-0.5">
                <Badge variant={food.searchResult.source === 'USDA' ? 'usda' : 'off'} size="xs">
                  {food.searchResult.source}
                </Badge>
                <Tooltip
                  content={`Nutrient data completeness: ${completeness}% of tracked nutrients available`}
                >
                  <CompletenessBar pct={completeness} />
                </Tooltip>
              </div>
            </div>
            <button
              onClick={() => onRemove(i)}
              className="flex-shrink-0 text-gray-300 hover:text-red-400 transition-colors opacity-0
                group-hover:opacity-100"
              title="Remove food"
            >
              <svg width="14" height="14" viewBox="0 0 15 15" fill="none">
                <path d="M11.854 3.146a.5.5 0 0 0-.708 0L7.5 6.793 3.854 3.146a.5.5 0 0 0-.708.708L6.793 7.5l-3.647 3.646a.5.5 0 0 0 .708.708L7.5 8.207l3.646 3.647a.5.5 0 0 0 .708-.708L8.207 7.5l3.647-3.646a.5.5 0 0 0 0-.708Z" fill="currentColor"/>
              </svg>
            </button>
          </div>
        );
      })}
    </div>
  );
}
