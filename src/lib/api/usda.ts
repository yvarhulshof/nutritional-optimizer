import { FoodSearchResult, NutrientProfile } from '../../types/food';
import { normalizeUsdaFood } from '../nutrition/normalize';

const BASE = 'https://api.nal.usda.gov/fdc/v1';
const API_KEY = process.env.USDA_API_KEY ?? 'DEMO_KEY';

export async function searchUsda(query: string): Promise<FoodSearchResult[]> {
  const url = new URL(`${BASE}/foods/search`);
  url.searchParams.set('query', query);
  url.searchParams.set('dataType', 'Foundation,SR Legacy,Survey (FNDDS)');
  url.searchParams.set('pageSize', '8');
  url.searchParams.set('api_key', API_KEY);

  const res = await fetch(url.toString(), { cache: 'no-store' });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(`USDA ${res.status}: ${body?.error?.message ?? res.statusText}`);
  }
  const data = await res.json();

  return (data.foods ?? []).map(
    (f: Record<string, unknown>): FoodSearchResult => ({
      id: String(f.fdcId),
      source: 'USDA',
      name: String(f.description),
      brand: f.brandOwner ? String(f.brandOwner) : undefined,
      category: f.foodCategory ? String(f.foodCategory) : undefined,
    })
  );
}

export async function getUsdaDetail(fdcId: string): Promise<NutrientProfile> {
  const url = `${BASE}/food/${fdcId}?api_key=${API_KEY}`;
  const res = await fetch(url, { cache: 'no-store' });
  if (!res.ok) throw new Error(`USDA detail ${res.status}: ${res.statusText}`);
  const data = await res.json();
  return normalizeUsdaFood(data);
}
