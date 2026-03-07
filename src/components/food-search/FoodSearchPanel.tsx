'use client';
import { useState } from 'react';
import { FoodSearchInput } from './FoodSearchInput';
import { FoodSearchResults } from './FoodSearchResults';
import { SelectedFoodList } from './SelectedFoodList';
import { FoodSearchResult, SelectedFood, DietaryTag } from '../../types/food';
import { useFoodSearch } from '../../hooks/useFoodSearch';
import { useFoodDetail } from '../../hooks/useFoodDetail';

const DIETARY_OPTIONS: { tag: DietaryTag; label: string }[] = [
  { tag: 'vegetarian',  label: 'Vegetarian' },
  { tag: 'vegan',       label: 'Vegan' },
  { tag: 'lactose-free', label: 'Lactose-free' },
  { tag: 'gluten-free', label: 'Gluten-free' },
];

interface FoodSearchPanelProps {
  selectedFoods: SelectedFood[];
  onAdd: (food: SelectedFood) => void;
  onRemove: (index: number) => void;
}

export function FoodSearchPanel({ selectedFoods, onAdd, onRemove }: FoodSearchPanelProps) {
  const [query, setQuery] = useState('');
  const [source, setSource] = useState<'all' | 'USDA' | 'OFF'>('all');
  const [diet, setDiet] = useState<DietaryTag[]>([]);
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [addError, setAddError] = useState<string | null>(null);

  const toggleDiet = (tag: DietaryTag) =>
    setDiet((prev) => prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]);

  const { results, loading: searchLoading, error: searchError } = useFoodSearch(query, source, diet);
  const { fetchDetail } = useFoodDetail();

  const handleAdd = async (result: FoodSearchResult) => {
    setLoadingId(result.id);
    setAddError(null);
    try {
      const nutrientProfile = await fetchDetail(result.id, result.source);
      onAdd({ searchResult: result, nutrientProfile });
      setQuery('');
    } catch (err) {
      console.error('Failed to fetch nutrient detail:', err);
      setAddError('Failed to load nutrient data. Try a different food.');
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
        <div className="flex flex-wrap gap-1.5 mb-3">
          {DIETARY_OPTIONS.map(({ tag, label }) => {
            const active = diet.includes(tag);
            return (
              <button
                key={tag}
                onClick={() => toggleDiet(tag)}
                className={`px-2.5 py-1 rounded-full text-xs font-medium border transition-colors ${
                  active
                    ? 'bg-green-600 border-green-600 text-white'
                    : 'bg-white border-gray-200 text-gray-500 hover:border-green-400 hover:text-green-600'
                }`}
              >
                {label}
              </button>
            );
          })}
        </div>
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
              loading={searchLoading}
              error={searchError}
            />
          </div>
        )}
        {addError && (
          <p className="mt-2 text-xs text-red-500 px-1">{addError}</p>
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
