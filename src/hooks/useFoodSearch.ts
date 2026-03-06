'use client';
import { useState, useEffect, useRef } from 'react';
import { FoodSearchResult } from '../types/food';

export function useFoodSearch(query: string, source: 'all' | 'USDA' | 'OFF') {
  const [results, setResults] = useState<FoodSearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const abortRef = useRef<AbortController | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (query.length < 2) {
      setResults([]);
      setLoading(false);
      return;
    }

    // Clear previous timer
    if (timerRef.current) clearTimeout(timerRef.current);

    setLoading(true);

    timerRef.current = setTimeout(async () => {
      // Abort previous in-flight request
      if (abortRef.current) abortRef.current.abort();
      const controller = new AbortController();
      abortRef.current = controller;

      try {
        const params = new URLSearchParams({ query, source });
        const res = await fetch(`/api/nutrition/search?${params}`, {
          signal: controller.signal,
        });
        if (!res.ok) throw new Error('Search failed');
        const data: FoodSearchResult[] = await res.json();
        setResults(data);
      } catch (err) {
        if ((err as Error).name !== 'AbortError') {
          setResults([]);
        }
      } finally {
        setLoading(false);
      }
    }, 400);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [query, source]);

  return { results, loading };
}
