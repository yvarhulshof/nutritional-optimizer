import { FoodSearchResult, NutrientProfile } from '../../types/food';
import { normalizeOffFood } from '../nutrition/normalize';

const BASE = 'https://world.openfoodfacts.org';

export async function searchOff(query: string): Promise<FoodSearchResult[]> {
  const url = new URL(`${BASE}/cgi/search.pl`);
  url.searchParams.set('search_terms', query);
  url.searchParams.set('json', '1');
  url.searchParams.set('page_size', '5');
  url.searchParams.set('fields', 'code,product_name,brands,categories');
  url.searchParams.set('lc', 'en');

  const res = await fetch(url.toString(), {
    headers: { 'User-Agent': 'NutriOpt/1.0 (nutritional optimizer - contact: admin@nutriopt.app)' },
    next: { revalidate: 3600 },
  });
  if (!res.ok) return [];
  const data = await res.json();

  return ((data.products as Record<string, unknown>[]) ?? [])
    .filter((p) => p.product_name)
    .map(
      (p): FoodSearchResult => ({
        id: String(p.code),
        source: 'OFF',
        name: String(p.product_name),
        brand: p.brands ? String(p.brands).split(',')[0].trim() : undefined,
        category: p.categories ? String(p.categories).split(',')[0].trim() : undefined,
      })
    );
}

export async function getOffDetail(barcode: string): Promise<NutrientProfile> {
  const url = `${BASE}/api/v2/product/${barcode}?fields=nutriments`;
  const res = await fetch(url, {
    headers: { 'User-Agent': 'NutriOpt/1.0 (nutritional optimizer)' },
    next: { revalidate: 3600 },
  });
  if (!res.ok) throw new Error(`OFF detail failed: ${res.status}`);
  const data = await res.json();
  const nutriments = data.product?.nutriments ?? {};
  return normalizeOffFood(nutriments);
}
