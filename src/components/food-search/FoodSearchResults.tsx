'use client';
import { FoodSearchResult } from '../../types/food';
import { FoodResultItem } from './FoodResultItem';
import { Spinner } from '../ui/Spinner';

interface FoodSearchResultsProps {
  results: FoodSearchResult[];
  loadingId: string | null;
  onAdd: (result: FoodSearchResult) => void;
  query: string;
  loading: boolean;
  error?: string;
}

export function FoodSearchResults({ results, loadingId, onAdd, query, loading, error }: FoodSearchResultsProps) {
  if (!query || query.length < 2) return null;

  return (
    <div className="border border-gray-200 rounded-lg bg-white shadow-lg overflow-hidden">
      {loading ? (
        <div className="flex items-center justify-center gap-2 px-3 py-4 text-sm text-gray-400">
          <Spinner size={14} />
          <span>Searching…</span>
        </div>
      ) : error ? (
        <p className="px-3 py-3 text-sm text-red-400 text-center">{error}</p>
      ) : results.length === 0 ? (
        <p className="px-3 py-3 text-sm text-gray-400 text-center">No results found for &ldquo;{query}&rdquo;</p>
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
