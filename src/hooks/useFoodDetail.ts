'use client';
import { FoodSource, NutrientProfile } from '../types/food';

// Simple in-session cache
const cache = new Map<string, NutrientProfile>();

export function useFoodDetail() {
  const fetchDetail = async (id: string, source: FoodSource): Promise<NutrientProfile> => {
    const cacheKey = `${source}:${id}`;
    if (cache.has(cacheKey)) return cache.get(cacheKey)!;

    const params = new URLSearchParams({ id, source });
    const res = await fetch(`/api/nutrition/detail?${params}`);
    if (!res.ok) throw new Error('Failed to fetch nutrient detail');
    const profile: NutrientProfile = await res.json();
    cache.set(cacheKey, profile);
    return profile;
  };

  return { fetchDetail };
}
