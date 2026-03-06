'use client';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'usda' | 'off' | 'success' | 'warning' | 'error' | 'neutral';
  size?: 'sm' | 'xs';
}

const variantStyles: Record<string, string> = {
  usda:    'bg-blue-50 text-blue-700 border border-blue-200',
  off:     'bg-orange-50 text-orange-700 border border-orange-200',
  success: 'bg-green-50 text-green-700 border border-green-200',
  warning: 'bg-amber-50 text-amber-700 border border-amber-200',
  error:   'bg-red-50 text-red-700 border border-red-200',
  neutral: 'bg-gray-50 text-gray-600 border border-gray-200',
};

export function Badge({ children, variant = 'neutral', size = 'sm' }: BadgeProps) {
  const sizeClass = size === 'xs' ? 'text-[10px] px-1.5 py-0' : 'text-xs px-2 py-0.5';
  return (
    <span className={`inline-flex items-center rounded-full font-medium ${sizeClass} ${variantStyles[variant]}`}>
      {children}
    </span>
  );
}
