/**
 * scripts/seedFoods.ts
 *
 * Fetches all USDA Foundation Foods, normalizes their nutrient profiles, and
 * writes the result to src/lib/nutrition/generatedFoods.ts for static import.
 *
 * Usage:
 *   USDA_API_KEY=your_key npx tsx scripts/seedFoods.ts
 *
 * Optional flags:
 *   --max 40       Stop after N foods (useful for testing with DEMO_KEY)
 *   --data-type SR Legacy   Use SR Legacy instead of Foundation (more foods, lower quality)
 */

import { writeFileSync } from 'fs';
import { join } from 'path';
import { normalizeUsdaFood } from '../src/lib/nutrition/normalize';
import { inferTagsFromUsdaCategory } from '../src/lib/nutrition/dietary';
import { CURATED_FOODS } from '../src/lib/nutrition/commonFoods';

const API_KEY = process.env.USDA_API_KEY ?? 'DEMO_KEY';
const BASE = 'https://api.nal.usda.gov/fdc/v1';

// --- CLI args ---
const args = process.argv.slice(2);
const maxArg = args.indexOf('--max');
const MAX_FOODS = maxArg !== -1 ? parseInt(args[maxArg + 1], 10) : Infinity;
const dataTypeArg = args.indexOf('--data-type');
const DATA_TYPE = dataTypeArg !== -1 ? args[dataTypeArg + 1] : 'Foundation';

// --- Default EUR costs by USDA food category ---
const CATEGORY_COSTS: Record<string, number> = {
  'Vegetables and Vegetable Products': 0.20,
  'Fruits and Fruit Juices':           0.30,
  'Legumes and Legume Products':       0.22,
  'Nut and Seed Products':             1.10,
  'Spices and Herbs':                  0.80,
  'Cereal Grains and Pasta':           0.15,
  'Breakfast Cereals':                 0.30,
  'Baked Products':                    0.25,
  'Finfish and Shellfish Products':    1.20,
  'Beef Products':                     1.00,
  'Poultry Products':                  0.85,
  'Pork Products':                     0.80,
  'Lamb, Veal, and Game Products':     1.40,
  'Sausages and Luncheon Meats':       0.90,
  'Dairy and Egg Products':            0.40,
  'Fats and Oils':                     0.65,
  'Soups, Sauces, and Gravies':        0.35,
  'Snacks':                            0.60,
  'Sweets':                            0.70,
  'Beverages':                         0.10,
  'Baby Foods':                        0.90,
  'Fast Foods':                        0.80,
  'Meals, Entrees, and Side Dishes':   0.60,
};
const DEFAULT_COST = 0.50;

function getCost(category: string | undefined): number {
  return category ? (CATEGORY_COSTS[category] ?? DEFAULT_COST) : DEFAULT_COST;
}

async function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/** Fetch one page of the USDA foods list. */
async function fetchPage(pageNumber: number): Promise<Array<{ fdcId: number; description: string; foodCategory?: string }>> {
  const url = new URL(`${BASE}/foods/list`);
  url.searchParams.set('dataType', DATA_TYPE);
  url.searchParams.set('pageSize', '200');
  url.searchParams.set('pageNumber', String(pageNumber));
  url.searchParams.set('api_key', API_KEY);

  const res = await fetch(url.toString());
  if (!res.ok) throw new Error(`List page ${pageNumber} failed: ${res.status} ${res.statusText}`);
  const data = await res.json();
  // USDA /foods/list returns a bare array, but guard against wrapped responses
  if (Array.isArray(data)) return data;
  if (data && Array.isArray(data.foods)) return data.foods;
  console.error('\nUnexpected /foods/list response:', JSON.stringify(data).slice(0, 300));
  return [];
}

/** Batch-fetch full food details for up to 20 fdcIds at once. */
async function fetchBatch(fdcIds: number[]): Promise<Record<string, unknown>[]> {
  const res = await fetch(`${BASE}/foods?api_key=${API_KEY}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ fdcIds, format: 'full' }),
  });
  if (!res.ok) throw new Error(`Batch fetch failed: ${res.status} ${res.statusText}`);
  const data = await res.json();
  if (Array.isArray(data)) return data;
  if (data && Array.isArray(data.foods)) return data.foods;
  console.error('\nUnexpected /foods batch response:', JSON.stringify(data).slice(0, 300));
  return [];
}

function serializeEntry(
  fdcId: number,
  name: string,
  category: string | undefined,
  profile: ReturnType<typeof normalizeUsdaFood>,
  cost: number,
  tags: ReturnType<typeof inferTagsFromUsdaCategory>
): string {
  const tagsStr = tags.length ? `['${tags.join("','")}']` : '[]';
  const p = profile;
  // Format numbers: trim trailing zeros but keep enough precision
  const n = (v: number) => (v === 0 ? '0' : parseFloat(v.toFixed(4)));
  return `  {
    result: { id: '${fdcId}', source: 'USDA' as const, name: ${JSON.stringify(name)}, category: ${JSON.stringify(typeof category === 'string' ? category : '')}, dietaryTags: ${tagsStr} },
    costPer100g: ${cost},
    profile: {
      energyKcal: ${n(p.energyKcal)}, proteinG: ${n(p.proteinG)}, fatG: ${n(p.fatG)}, saturatedFatG: ${n(p.saturatedFatG)},
      carbohydratesG: ${n(p.carbohydratesG)}, fiberG: ${n(p.fiberG)}, sugarG: ${n(p.sugarG)}, sodiumMg: ${n(p.sodiumMg)},
      calciumMg: ${n(p.calciumMg)}, ironMg: ${n(p.ironMg)}, potassiumMg: ${n(p.potassiumMg)}, vitaminCMg: ${n(p.vitaminCMg)},
      vitaminDMcg: ${n(p.vitaminDMcg)}, vitaminB12Mcg: ${n(p.vitaminB12Mcg)}, folateMcg: ${n(p.folateMcg)},
      magnesiumMg: ${n(p.magnesiumMg)}, zincMg: ${n(p.zincMg)}, omega3G: ${n(p.omega3G)},
    },
  }`;
}

async function main() {
  console.log(`Seeding from USDA ${DATA_TYPE} foods (max: ${MAX_FOODS === Infinity ? 'all' : MAX_FOODS})…`);

  // Build set of IDs already in the curated list — skip these
  const curatedIds = new Set(CURATED_FOODS.map((f) => f.result.id));

  // --- Step 1: Collect all fdcIds via pagination ---
  const allItems: Array<{ fdcId: number; description: string; foodCategory?: string }> = [];
  let page = 1;
  while (true) {
    process.stdout.write(`  Listing page ${page}…\r`);
    const items = await fetchPage(page);
    if (items.length === 0) break;
    allItems.push(...items);
    if (allItems.length >= MAX_FOODS) break;
    page++;
    await sleep(150);
  }
  console.log(`\nFound ${allItems.length} foods in USDA ${DATA_TYPE} list.`);

  // Filter out curated IDs
  const toFetch = allItems
    .filter((item) => !curatedIds.has(String(item.fdcId)))
    .slice(0, MAX_FOODS);
  console.log(`Fetching details for ${toFetch.length} new foods (${allItems.length - toFetch.length} skipped as duplicates)…`);

  // --- Step 2: Batch-fetch full details ---
  const BATCH_SIZE = 20;
  const entries: string[] = [];
  let fetched = 0;
  let skipped = 0;

  for (let i = 0; i < toFetch.length; i += BATCH_SIZE) {
    const batch = toFetch.slice(i, i + BATCH_SIZE);
    const ids = batch.map((b) => b.fdcId);

    try {
      const details = await fetchBatch(ids);

      for (const raw of details) {
        const fdcId = raw.fdcId as number;
        const name = raw.description as string ?? '';
        const rawCat = raw.foodCategory;
        let category: string | undefined;
        if (typeof rawCat === 'string') {
          category = rawCat;
        } else if (rawCat != null && typeof (rawCat as { description?: unknown }).description === 'string') {
          category = (rawCat as { description: string }).description;
        }
        const profile = normalizeUsdaFood(raw);

        // Skip foods with no energy data (likely incomplete/invalid)
        if (profile.energyKcal === 0) {
          skipped++;
          continue;
        }

        const tags = inferTagsFromUsdaCategory(category);
        const cost = getCost(category);
        entries.push(serializeEntry(fdcId, name, category, profile, cost, tags));
        fetched++;
      }
    } catch (err) {
      console.error(`\nBatch starting at index ${i} failed:`, err);
    }

    const pct = Math.round(((i + BATCH_SIZE) / toFetch.length) * 100);
    process.stdout.write(`  ${Math.min(i + BATCH_SIZE, toFetch.length)}/${toFetch.length} (${pct}%) — ${fetched} foods added, ${skipped} skipped\r`);
    await sleep(150);
  }

  console.log(`\nDone. ${fetched} foods added, ${skipped} skipped (zero energy).`);

  // --- Step 3: Write output file ---
  const outPath = join(__dirname, '../src/lib/nutrition/generatedFoods.ts');
  const now = new Date().toISOString().slice(0, 10);

  const output = `// Auto-generated by scripts/seedFoods.ts on ${now}
// Source: USDA FoodData Central — ${DATA_TYPE} Foods
// Foods: ${fetched} | Do not edit manually — re-run the script to refresh
import type { StaticFood } from './commonFoods';

export const GENERATED_FOODS: StaticFood[] = [
${entries.join(',\n')}
];
`;

  writeFileSync(outPath, output, 'utf8');
  console.log(`Written to ${outPath}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
