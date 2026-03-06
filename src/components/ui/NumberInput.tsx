'use client';

interface NumberInputProps {
  value: number | null;
  onChange: (value: number | null) => void;
  unit?: string;
  min?: number;
  max?: number;
  step?: number;
  placeholder?: string;
  className?: string;
}

export function NumberInput({
  value,
  onChange,
  unit,
  min,
  max,
  step = 1,
  placeholder = '—',
  className = '',
}: NumberInputProps) {
  return (
    <div className={`flex items-center gap-1 ${className}`}>
      <input
        type="number"
        value={value ?? ''}
        min={min}
        max={max}
        step={step}
        placeholder={placeholder}
        onChange={(e) => {
          const v = e.target.value;
          onChange(v === '' ? null : Number(v));
        }}
        className="w-20 rounded-md border border-gray-200 bg-white px-2 py-1 text-xs text-center
          text-gray-800 focus:border-green-400 focus:outline-none focus:ring-1 focus:ring-green-400
          [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
      />
      {unit && <span className="text-xs text-gray-400 w-8">{unit}</span>}
    </div>
  );
}
