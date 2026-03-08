'use client';
import { FoodQuantity } from '../../types/solver';
import { NutrientHeatmap } from './NutrientHeatmap';
import { CostNutrientScatter } from './CostNutrientScatter';
import { FoodCards } from './FoodCards';
import { NutrientBarChart } from './NutrientBarChart';
import { NutrientContributionPieGrid } from './NutrientContributionPieGrid';

interface Props { quantities: FoodQuantity[] }

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-3">{title}</h3>
      {children}
    </div>
  );
}

export function FoodBreakdownPanel({ quantities }: Props) {
  const sorted = [...quantities].sort((a, b) => b.grams - a.grams);
  const foods = sorted.map((q) => q.food);

  return (
    <div className="p-5 space-y-10">
      <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
        Food Breakdown
      </h2>

      {quantities.length === 0 ? (
        <p className="text-sm text-gray-500">
          Run the optimizer to see a breakdown of foods included in the generated solution.
        </p>
      ) : (
        <>
          <Section title="Nutrient Heatmap — intensity = value relative to max across all foods (per 100g)">
            <NutrientHeatmap foods={foods} />
          </Section>

          <Section title="Nutrient Contribution Pies — each food's actual share of the day's total">
            <NutrientContributionPieGrid quantities={sorted} />
          </Section>

          <Section title="Cost vs. Nutrient — dot size = calories (per 100g)">
            <CostNutrientScatter foods={foods} />
          </Section>

          <Section title="Food Cards — macro composition per food (per 100g)">
            <FoodCards foods={foods} />
          </Section>
          <Section title="Ranked Bar Chart — sort by any metric (per 100g)">
            <NutrientBarChart foods={foods} />
          </Section>
        </>
      )}
    </div>
  );
}
