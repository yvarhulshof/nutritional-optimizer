import { NextRequest, NextResponse } from 'next/server';
import { searchUsda } from '../../../../lib/api/usda';
import { searchOff } from '../../../../lib/api/off';
import { FoodSearchResult } from '../../../../types/food';

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

export async function GET(req: NextRequest) {
  const query = req.nextUrl.searchParams.get('query');
  const source = req.nextUrl.searchParams.get('source') ?? 'all';

  if (!query || query.length < 2) {
    return NextResponse.json([]);
  }

  const results: FoodSearchResult[] = [];

  try {
    if (source === 'all' || source === 'USDA') {
      const usda = await searchUsda(query);
      results.push(...usda);
    }
  } catch (err) {
    console.error('USDA search error:', err);
  }

  try {
    if (source === 'all' || source === 'OFF') {
      const off = await searchOff(query);
      // Prefer USDA results over OFF when deduplicating (USDA comes first)
      results.push(...off);
    }
  } catch (err) {
    console.error('OFF search error:', err);
  }

  return NextResponse.json(deduplicateByName(results).slice(0, 10));
}
