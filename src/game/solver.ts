import type { Board } from '../types';
import { BASE_MASK, E, N, S, W, normalizeTurns, rotateMask, tileMask } from './tiles';

export interface SolveResult {
  solved: boolean;
  aborted: boolean;
  rotations: number[];
  statesExplored: number;
  branchesPruned: number;
}

interface RotationOption {
  turns: number;
  mask: number;
}

export interface RotationStep {
  row: number;
  col: number;
  turns: number;
}

const DEFAULT_MAX_STATES = 1_500_000;

export function solvePuzzle(board: Board, maxStates: number = DEFAULT_MAX_STATES): SolveResult {
  const rows = board.length;
  const cols = rows > 0 ? board[0].length : 0;
  const total = rows * cols;

  let statesExplored = 0;
  let branchesPruned = 0;
  let aborted = false;

  const options: RotationOption[][] = [];
  for (const line of board) {
    for (const tile of line) {
      const seen = new Set<number>();
      const list: RotationOption[] = [];
      for (let k = 0; k < 4; k += 1) {
        const turns = normalizeTurns(tile.turns + k);
        const mask = rotateMask(BASE_MASK[tile.type], turns);
        if (!seen.has(mask)) {
          seen.add(mask);
          list.push({ turns, mask });
        }
      }
      options.push(list);
    }
  }

  const placed: number[] = new Array<number>(total).fill(-1);
  const chosen: number[] = new Array<number>(total).fill(0);

  const compatible = (index: number, mask: number): boolean => {
    const r = Math.floor(index / cols);
    const c = index % cols;
    if (r === 0 && (mask & N) !== 0) return false;
    if (r === rows - 1 && (mask & S) !== 0) return false;
    if (c === 0 && (mask & W) !== 0) return false;
    if (c === cols - 1 && (mask & E) !== 0) return false;
    if (r > 0) {
      const up = placed[index - cols];
      if (up >= 0 && ((up & S) !== 0) !== ((mask & N) !== 0)) return false;
    }
    if (c > 0) {
      const left = placed[index - 1];
      if (left >= 0 && ((left & E) !== 0) !== ((mask & W) !== 0)) return false;
    }
    return true;
  };

  const hasLegalOption = (index: number): boolean =>
    options[index].some((option) => compatible(index, option.mask));

  const forwardCheck = (index: number): boolean => {
    const r = Math.floor(index / cols);
    const c = index % cols;
    if (c < cols - 1 && !hasLegalOption(index + 1)) return false;
    if (r < rows - 1 && !hasLegalOption(index + cols)) return false;
    return true;
  };

  const search = (index: number): boolean => {
    if (index === total) return true;
    for (const option of options[index]) {
      if (aborted) return false;
      statesExplored += 1;
      if (statesExplored > maxStates) {
        aborted = true;
        return false;
      }
      if (!compatible(index, option.mask)) {
        branchesPruned += 1;
        continue;
      }
      placed[index] = option.mask;
      if (forwardCheck(index)) {
        chosen[index] = option.turns;
        if (search(index + 1)) return true;
      } else {
        branchesPruned += 1;
      }
      placed[index] = -1;
    }
    return false;
  };

  const solved = total > 0 && search(0);

  return { solved, aborted, rotations: chosen, statesExplored, branchesPruned };
}

/** Lists the quarter turns each tile still needs to reach the target rotations. */
export function planRotations(board: Board, rotations: readonly number[]): RotationStep[] {
  const steps: RotationStep[] = [];
  const cols = board.length > 0 ? board[0].length : 0;
  board.forEach((line, row) => {
    line.forEach((tile, col) => {
      const targetMask = rotateMask(BASE_MASK[tile.type], rotations[row * cols + col]);
      const current = tileMask(tile);
      if (current === targetMask) return;
      for (let k = 1; k < 4; k += 1) {
        if (rotateMask(current, k) === targetMask) {
          steps.push({ row, col, turns: k });
          return;
        }
      }
    });
  });
  return steps;
}
