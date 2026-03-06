'use client';
import { useState } from 'react';
import { FoodSearchInput } from './FoodSearchInput';
import { FoodSearchResults } from './FoodSearchResults';
import { SelectedFoodList } from './SelectedFoodList';
import { FoodSearchResult, SelectedFood } from '../../types/food';
import { useFoodSearch } from '../../hooks/useFoodSearch';
import { useFoodDetail } from '../../hooks/useFoodDetail';

interface FoodSearchPanelProps {
  selectedFoods: SelectedFood[];
  onAdd: (food: SelectedFood) => void;
  onRemove: (index: number) => void;
}

export function FoodSearchPanel({ selectedFoods, onAdd, onRemove }: FoodSearchPanelProps) {
  const [query, setQuery] = useState('');
  const [source, setSource] = useState<'all' | 'USDA' | 'OFF'>('all');
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const { results, loading: searchLoading } = useFoodSearch(query, source);
  const { fetchDetail } = useFoodDetail();

  const handleAdd = async (result: FoodSearchResult) => {
    setLoadingId(result.id);
    try {
      const nutrientProfile = await fetchDetail(result.id, result.source);
      onAdd({ searchResult: result, nutrientProfile });
      setQuery('');
    } catch (err) {
      console.error('Failed to fetch nutrient detail:', err);
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="p-5 border-b border-gray-100">
        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
          1 · Foods
        </h2>
        <FoodSearchInput
          value={query}
          onChange={setQuery}
          source={source}
          onSourceChange={setSource}
          loading={searchLoading}
        />
        {query.length >= 2 && (
          <div className="mt-2">
            <FoodSearchResults
              results={results}
              loadingId={loadingId}
              onAdd={handleAdd}
              query={query}
            />
          </div>
        )}
      </div>

      <div className="flex-1 overflow-y-auto p-5">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xs font-medium text-gray-400 uppercase tracking-wide">
            Selected ({selectedFoods.length})
          </h3>
        </div>
        <SelectedFoodList foods={selectedFoods} onRemove={onRemove} />
      </div>
    </div>
  );
}
