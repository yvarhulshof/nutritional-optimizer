import { NextRequest, NextResponse } from 'next/server';
import { searchUsda } from '../../../../lib/api/usda';
import { searchOff } from '../../../../lib/api/off';
import { FoodSearchResult, DietaryTag } from '../../../../types/food';

function normalizeName(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9\s]/g, '').trim();
}

function deduplicateByName(results: FoodSearchResult[]): FoodSearchResult[] {
  const seen = new Set<string>();
  return results.filter((r) => {
    const key = normalizeName(r.name);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function applyDietaryFilter(results: FoodSearchResult[], diet: DietaryTag[]): FoodSearchResult[] {
  if (diet.length === 0) return results;
  return results.filter((r) =>
    diet.every((tag) => r.dietaryTags?.includes(tag))
  );
}

export async function GET(req: NextRequest) {
  const query = req.nextUrl.searchParams.get('query');
  const source = req.nextUrl.searchParams.get('source') ?? 'all';
  const dietParam = req.nextUrl.searchParams.get('diet') ?? '';
  const diet = dietParam ? (dietParam.split(',') as DietaryTag[]) : [];

  if (!query || query.length < 2) {
    return NextResponse.json([]);
  }

  const results: FoodSearchResult[] = [];
  let usdaError: string | null = null;
  let offError: string | null = null;

  if (source === 'all' || source === 'USDA') {
    try {
      const usda = await searchUsda(query);
      results.push(...usda);
    } catch (err) {
      usdaError = String(err);
      console.error('USDA search error:', usdaError);
    }
  }

  if (source === 'all' || source === 'OFF') {
    try {
      const off = await searchOff(query);
      results.push(...off);
    } catch (err) {
      offError = String(err);
      console.error('OFF search error:', offError);
    }
  }

  // If both failed, return 503 so the client can show an error
  if (results.length === 0 && usdaError && offError) {
    return NextResponse.json(
      { error: 'Both nutrition APIs unavailable. Try again shortly.' },
      { status: 503 }
    );
  }

  const filtered = applyDietaryFilter(deduplicateByName(results), diet);
  return NextResponse.json(filtered.slice(0, 10));
}
