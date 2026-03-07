import { DietaryTag } from '../../types/food';

// Maps USDA food category strings to the dietary tags we can confidently infer.
const USDA_CATEGORY_TAGS: Record<string, DietaryTag[]> = {
  'Vegetables and Vegetable Products': ['vegetarian', 'vegan', 'lactose-free', 'gluten-free'],
  'Fruits and Fruit Juices':           ['vegetarian', 'vegan', 'lactose-free', 'gluten-free'],
  'Legumes and Legume Products':       ['vegetarian', 'vegan', 'lactose-free', 'gluten-free'],
  'Nut and Seed Products':             ['vegetarian', 'vegan', 'lactose-free', 'gluten-free'],
  'Spices and Herbs':                  ['vegetarian', 'vegan', 'lactose-free', 'gluten-free'],
  'Cereal Grains and Pasta':           ['vegetarian', 'vegan', 'lactose-free'],
  'Breakfast Cereals':                 ['vegetarian', 'vegan', 'lactose-free'],
  'Baked Products':                    ['vegetarian', 'lactose-free'],
  // Animal products — not vegetarian/vegan, but gluten/lactose-free
  'Finfish and Shellfish Products':    ['lactose-free', 'gluten-free'],
  'Beef Products':                     ['lactose-free', 'gluten-free'],
  'Poultry Products':                  ['lactose-free', 'gluten-free'],
  'Pork Products':                     ['lactose-free', 'gluten-free'],
  'Lamb, Veal, and Game Products':     ['lactose-free', 'gluten-free'],
  'Sausages and Luncheon Meats':       [],
  // Dairy & eggs: vegetarian and usually gluten-free, but not vegan and uncertain for lactose
  'Dairy and Egg Products':            ['vegetarian', 'gluten-free'],
  // Fats and Oils: too mixed (butter vs. olive oil) — no confident tags
  'Fats and Oils':                     [],
};

export function inferTagsFromUsdaCategory(category: string | undefined): DietaryTag[] {
  if (!category) return [];
  return USDA_CATEGORY_TAGS[category] ?? [];
}

// Maps Open Food Facts labels_tags values to our DietaryTag set.
const OFF_LABEL_MAP: Record<string, DietaryTag> = {
  'en:vegan':        'vegan',
  'en:vegetarian':   'vegetarian',
  'en:gluten-free':  'gluten-free',
  'en:lactose-free': 'lactose-free',
  'en:no-lactose':   'lactose-free',
};

export function inferTagsFromOffLabels(labelsTags: string[] | undefined): DietaryTag[] {
  if (!labelsTags || labelsTags.length === 0) return [];
  const tags = new Set<DietaryTag>();
  for (const label of labelsTags) {
    const tag = OFF_LABEL_MAP[label.toLowerCase()];
    if (tag) tags.add(tag);
  }
  // vegan implies vegetarian
  if (tags.has('vegan')) tags.add('vegetarian');
  return Array.from(tags);
}
