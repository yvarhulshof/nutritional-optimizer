'use client';
import { useRef } from 'react';
import { Spinner } from '../ui/Spinner';

interface FoodSearchInputProps {
  value: string;
  onChange: (v: string) => void;
  source: 'all' | 'USDA' | 'OFF';
  onSourceChange: (s: 'all' | 'USDA' | 'OFF') => void;
  loading: boolean;
}

const SOURCES = [
  { value: 'all' as const, label: 'All' },
  { value: 'USDA' as const, label: 'USDA' },
  { value: 'OFF' as const, label: 'Open Food Facts' },
];

export function FoodSearchInput({
  value, onChange, source, onSourceChange, loading,
}: FoodSearchInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="space-y-2">
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
          <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
            <path d="M10 6.5a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Zm-.614 3.093a5 5 0 1 1 .707-.707l2.76 2.76a.5.5 0 0 1-.707.708l-2.76-2.76Z" fill="currentColor"/>
          </svg>
        </span>
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Search foods (e.g. chicken breast, oats)"
          className="w-full rounded-lg border border-gray-200 bg-white pl-9 pr-9 py-2.5 text-sm
            text-gray-800 placeholder:text-gray-400 focus:border-green-400 focus:outline-none
            focus:ring-2 focus:ring-green-100"
        />
        {loading && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
            <Spinner size={14} />
          </span>
        )}
        {!loading && value && (
          <button
            onClick={() => onChange('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <svg width="14" height="14" viewBox="0 0 15 15" fill="none">
              <path d="M11.854 3.146a.5.5 0 0 0-.708 0L7.5 6.793 3.854 3.146a.5.5 0 0 0-.708.708L6.793 7.5l-3.647 3.646a.5.5 0 0 0 .708.708L7.5 8.207l3.646 3.647a.5.5 0 0 0 .708-.708L8.207 7.5l3.647-3.646a.5.5 0 0 0 0-.708Z" fill="currentColor"/>
            </svg>
          </button>
        )}
      </div>

      <div className="flex gap-1">
        {SOURCES.map((s) => (
          <button
            key={s.value}
            onClick={() => onSourceChange(s.value)}
            className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
              source === s.value
                ? 'bg-green-500 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {s.label}
          </button>
        ))}
      </div>
    </div>
  );
}
