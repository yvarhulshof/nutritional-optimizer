import { FoodSearchResult, NutrientProfile } from '../../types/food';
import { normalizeUsdaFood } from '../nutrition/normalize';

const BASE = 'https://api.nal.usda.gov/fdc/v1';
const API_KEY = process.env.USDA_API_KEY ?? 'DEMO_KEY';

export async function searchUsda(query: string): Promise<FoodSearchResult[]> {
  const url = new URL(`${BASE}/foods/search`);
  url.searchParams.set('query', query);
  url.searchParams.set('dataType', 'Foundation,SR Legacy');
  url.searchParams.set('pageSize', '8');
  url.searchParams.set('api_key', API_KEY);

  const res = await fetch(url.toString(), { next: { revalidate: 3600 } });
  if (!res.ok) throw new Error(`USDA search failed: ${res.status}`);
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
  const res = await fetch(url, { next: { revalidate: 3600 } });
  if (!res.ok) throw new Error(`USDA detail failed: ${res.status}`);
  const data = await res.json();
  return normalizeUsdaFood(data);
}
