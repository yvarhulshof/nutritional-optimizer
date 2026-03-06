import { NextRequest, NextResponse } from 'next/server';
import { getUsdaDetail } from '../../../../lib/api/usda';
import { getOffDetail } from '../../../../lib/api/off';

export async function GET(req: NextRequest) {
  const id = req.nextUrl.searchParams.get('id');
  const source = req.nextUrl.searchParams.get('source');

  if (!id || !source) {
    return NextResponse.json({ error: 'Missing id or source' }, { status: 400 });
  }

  try {
    const profile = source === 'USDA'
      ? await getUsdaDetail(id)
      : await getOffDetail(id);

    return NextResponse.json(profile);
  } catch (err) {
    console.error('Detail fetch error:', err);
    return NextResponse.json({ error: 'Failed to fetch nutrient data' }, { status: 500 });
  }
}
