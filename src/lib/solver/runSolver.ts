// eslint-disable-next-line @typescript-eslint/no-require-imports
const solver = require('javascript-lp-solver');

interface LPModel {
  optimize: string;
  opType: 'min' | 'max';
  constraints: Record<string, { min?: number; max?: number }>;
  variables: Record<string, Record<string, number>>;
}

export interface RawSolverResult {
  feasible: boolean;
  bounded?: boolean;
  result?: number;
  [key: string]: unknown;
}

export function runSolver(model: LPModel): RawSolverResult {
  try {
    return solver.Solve(model) as RawSolverResult;
  } catch (err) {
    console.error('Solver error:', err);
    return { feasible: false };
  }
}
