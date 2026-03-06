import { NextRequest, NextResponse } from 'next/server';
import { buildModel } from '../../../lib/solver/buildModel';
import { runSolver } from '../../../lib/solver/runSolver';
import { interpretResult } from '../../../lib/solver/interpret';
import { SolveRequest } from '../../../types/solver';

export async function POST(req: NextRequest) {
  try {
    const body: SolveRequest = await req.json();
    const { foods, constraints, objective, maxGramsPerFood = 800 } = body;

    if (!foods || foods.length === 0) {
      return NextResponse.json(
        { status: 'error', errorMessage: 'No foods provided' },
        { status: 400 }
      );
    }

    const model = buildModel(foods, constraints, objective, maxGramsPerFood);
    const raw = runSolver(model);
    const result = interpretResult(raw, foods);

    return NextResponse.json(result);
  } catch (err) {
    console.error('Solve error:', err);
    return NextResponse.json(
      { status: 'error', errorMessage: String(err) },
      { status: 500 }
    );
  }
}
