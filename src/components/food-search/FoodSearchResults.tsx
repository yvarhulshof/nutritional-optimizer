'use client';
import { FoodSearchResult } from '../../types/food';
import { FoodResultItem } from './FoodResultItem';

interface FoodSearchResultsProps {
  results: FoodSearchResult[];
  loadingId: string | null;
  onAdd: (result: FoodSearchResult) => void;
  query: string;
}

export function FoodSearchResults({ results, loadingId, onAdd, query }: FoodSearchResultsProps) {
  if (!query || query.length < 2) return null;

  return (
    <div className="border border-gray-200 rounded-lg bg-white shadow-lg overflow-hidden">
      {results.length === 0 ? (
        <p className="px-3 py-3 text-sm text-gray-400 text-center">No results found</p>
      ) : (
        <div className="divide-y divide-gray-50">
          {results.map((r) => (
            <FoodResultItem
              key={`${r.source}-${r.id}`}
              result={r}
              onAdd={onAdd}
              loading={loadingId === r.id}
            />
          ))}
        </div>
      )}
    </div>
  );
}
