import { FoodSearchResult, NutrientProfile } from '../../types/food';
import { normalizeOffFood } from '../nutrition/normalize';

const BASE = 'https://world.openfoodfacts.org';
const UA = 'NutriOpt/1.0 (nutritional optimizer; github.com/nutriopt)';

export async function searchOff(query: string): Promise<FoodSearchResult[]> {
  const url = new URL(`${BASE}/cgi/search.pl`);
  url.searchParams.set('search_terms', query);
  url.searchParams.set('json', '1');
  url.searchParams.set('page_size', '6');
  url.searchParams.set('fields', 'code,product_name,brands,categories,completeness');
  url.searchParams.set('sort_by', 'completeness');

  const res = await fetch(url.toString(), {
    headers: { 'User-Agent': UA },
    cache: 'no-store',
  });
  if (!res.ok) return [];
  const data = await res.json();

  return ((data.products as Record<string, unknown>[]) ?? [])
    .filter((p) => p.product_name && String(p.product_name).trim().length > 0)
    .map(
      (p): FoodSearchResult => ({
        id: String(p.code),
        source: 'OFF',
        name: String(p.product_name).trim(),
        brand: p.brands ? String(p.brands).split(',')[0].trim() : undefined,
        category: p.categories ? String(p.categories).split(',')[0].trim() : undefined,
      })
    );
}

export async function getOffDetail(barcode: string): Promise<NutrientProfile> {
  const url = `${BASE}/api/v2/product/${barcode}?fields=nutriments`;
  const res = await fetch(url, {
    headers: { 'User-Agent': UA },
    cache: 'no-store',
  });
  if (!res.ok) throw new Error(`OFF detail ${res.status}: ${res.statusText}`);
  const data = await res.json();
  const nutriments = data.product?.nutriments ?? {};
  return normalizeOffFood(nutriments);
}
