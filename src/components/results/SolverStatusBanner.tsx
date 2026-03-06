'use client';
import { Spinner } from '../ui/Spinner';

type Status = 'idle' | 'solving' | 'optimal' | 'infeasible' | 'error';

interface SolverStatusBannerProps {
  status: Status;
  onRelaxConstraints?: () => void;
  errorMessage?: string;
}

export function SolverStatusBanner({ status, onRelaxConstraints, errorMessage }: SolverStatusBannerProps) {
  if (status === 'idle') return null;

  const configs = {
    solving: {
      bg: 'bg-blue-50 border-blue-200',
      text: 'text-blue-700',
      content: (
        <span className="flex items-center gap-2">
          <Spinner size={14} />
          Finding optimal diet…
        </span>
      ),
    },
    optimal: {
      bg: 'bg-green-50 border-green-200',
      text: 'text-green-700',
      content: '✓ Optimal solution found',
    },
    infeasible: {
      bg: 'bg-amber-50 border-amber-200',
      text: 'text-amber-700',
      content: (
        <div>
          <p className="font-medium">No feasible solution found</p>
          <p className="text-xs mt-0.5 opacity-80">
            Your constraints may be too strict. Try relaxing them or adding more foods.
          </p>
          {onRelaxConstraints && (
            <button
              onClick={onRelaxConstraints}
              className="mt-2 text-xs font-medium underline hover:no-underline"
            >
              Relax all constraints by 20%
            </button>
          )}
        </div>
      ),
    },
    error: {
      bg: 'bg-red-50 border-red-200',
      text: 'text-red-700',
      content: `Error: ${errorMessage ?? 'Unknown error'}`,
    },
  };

  const cfg = configs[status];

  return (
    <div className={`rounded-lg border px-3 py-2.5 text-sm ${cfg.bg} ${cfg.text}`}>
      {cfg.content}
    </div>
  );
}
