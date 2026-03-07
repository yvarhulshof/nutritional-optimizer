'use client';
import { useState, useEffect, useRef } from 'react';
import { FoodSearchResult, DietaryTag } from '../types/food';

export function useFoodSearch(query: string, source: 'all' | 'USDA' | 'OFF', diet: DietaryTag[] = []) {
  const [results, setResults] = useState<FoodSearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | undefined>(undefined);
  const abortRef = useRef<AbortController | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (query.length < 2) {
      setResults([]);
      setLoading(false);
      setError(undefined);
      return;
    }

    if (timerRef.current) clearTimeout(timerRef.current);
    setLoading(true);
    setError(undefined);

    timerRef.current = setTimeout(async () => {
      if (abortRef.current) abortRef.current.abort();
      const controller = new AbortController();
      abortRef.current = controller;

      try {
        const params = new URLSearchParams({ query, source });
        if (diet.length > 0) params.set('diet', diet.join(','));
        const res = await fetch(`/api/nutrition/search?${params}`, {
          signal: controller.signal,
        });

        if (res.status === 503) {
          const body = await res.json().catch(() => ({}));
          setError(body.error ?? 'Nutrition APIs unavailable. Try again shortly.');
          setResults([]);
          return;
        }

        if (!res.ok) throw new Error(`Search failed (${res.status})`);
        const data: FoodSearchResult[] = await res.json();
        setResults(data);
        setError(undefined);
      } catch (err) {
        if ((err as Error).name === 'AbortError') return;
        setResults([]);
        setError('Search unavailable. Check your connection and try again.');
      } finally {
        setLoading(false);
      }
    }, 400);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query, source, diet.join(',')]);

  return { results, loading, error };
}
