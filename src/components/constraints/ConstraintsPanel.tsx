'use client';
import { NutrientConstraint, ObjectiveType } from '../../types/constraints';
import { DietaryTag, SelectedFood } from '../../types/food';
import { ObjectiveSelector } from './ObjectiveSelector';
import { NutrientConstraints } from './NutrientConstraints';

const DIETARY_OPTIONS: { tag: DietaryTag; label: string }[] = [
  { tag: 'vegetarian',   label: 'Vegetarian' },
  { tag: 'vegan',        label: 'Vegan' },
  { tag: 'lactose-free', label: 'Lactose-free' },
  { tag: 'gluten-free',  label: 'Gluten-free' },
];

interface ConstraintsPanelProps {
  objective: ObjectiveType;
  onObjectiveChange: (v: ObjectiveType) => void;
  constraints: NutrientConstraint[];
  onConstraintsChange: (c: NutrientConstraint[]) => void;
  onReset: () => void;
  diet: DietaryTag[];
  onDietChange: (diet: DietaryTag[]) => void;
  candidateFoods: SelectedFood[];
}

export function ConstraintsPanel({
  objective,
  onObjectiveChange,
  constraints,
  onConstraintsChange,
  onReset,
  diet,
  onDietChange,
  candidateFoods,
}: ConstraintsPanelProps) {
  const toggleDiet = (tag: DietaryTag) => {
    if (diet.includes(tag)) {
      onDietChange(diet.filter((t) => t !== tag));
    } else {
      // Adding vegan also enables vegetarian
      const next: DietaryTag[] = tag === 'vegan' && !diet.includes('vegetarian')
        ? [...diet, tag, 'vegetarian']
        : [...diet, tag];
      onDietChange(next);
    }
  };

  return (
    <div className="p-5">
      <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">
        Configure
      </h2>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Left: Optimization target + dietary filters */}
        <div className="lg:w-64 shrink-0">
          <ObjectiveSelector value={objective} onChange={onObjectiveChange} />
          <div className="mt-4">
            <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-2">
              Dietary Preferences
            </p>
            <div className="flex flex-wrap gap-1.5">
              {DIETARY_OPTIONS.map(({ tag, label }) => {
                const active = diet.includes(tag);
                return (
                  <button
                    key={tag}
                    onClick={() => toggleDiet(tag)}
                    className={`px-2.5 py-1 rounded-full text-xs font-medium border transition-colors ${
                      active
                        ? 'bg-green-600 border-green-600 text-white'
                        : 'bg-white border-gray-200 text-gray-500 hover:border-green-400 hover:text-green-600'
                    }`}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Candidate food list */}
          <div className="mt-4">
            <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-2">
              Candidate Foods
              <span className="ml-1.5 text-gray-300 font-normal normal-case">({candidateFoods.length})</span>
            </p>
            <ul className="max-h-48 overflow-y-auto space-y-0.5 pr-1">
              {candidateFoods.map((f) => (
                <li
                  key={f.searchResult.id}
                  className="text-xs text-gray-600 px-2 py-1 rounded hover:bg-gray-50 truncate"
                  title={f.searchResult.name}
                >
                  {f.searchResult.name}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="hidden lg:block w-px bg-gray-100 self-stretch" />

        {/* Right: Nutritional constraints */}
        <div className="flex-1 min-w-0">
          <h3 className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-2">
            Nutritional Constraints
          </h3>
          <NutrientConstraints
            constraints={constraints}
            onChange={onConstraintsChange}
            onReset={onReset}
          />
        </div>
      </div>
    </div>
  );
}
