'use client';
import { FoodSearchResult } from '../../types/food';
import { Badge } from '../ui/Badge';

interface FoodResultItemProps {
  result: FoodSearchResult;
  onAdd: (result: FoodSearchResult) => void;
  loading?: boolean;
}

export function FoodResultItem({ result, onAdd, loading }: FoodResultItemProps) {
  return (
    <div className="flex items-start gap-2 px-3 py-2 hover:bg-gray-50 group">
      <div className="flex-1 min-w-0">
        <p className="text-sm text-gray-800 truncate">{result.name}</p>
        <div className="flex items-center gap-1.5 mt-0.5">
          <Badge variant={result.source === 'USDA' ? 'usda' : 'off'} size="xs">
            {result.source}
          </Badge>
          {result.brand && (
            <span className="text-[10px] text-gray-400 truncate">{result.brand}</span>
          )}
        </div>
      </div>
      <button
        onClick={() => onAdd(result)}
        disabled={loading}
        className="flex-shrink-0 text-xs font-medium text-green-600 hover:text-green-700
          disabled:opacity-40 group-hover:opacity-100 opacity-60 transition-opacity px-2 py-1
          rounded-md hover:bg-green-50"
      >
        {loading ? '…' : '+ Add'}
      </button>
    </div>
  );
}
