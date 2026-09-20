import type { Board, Puzzle, Tile } from '../types';
import { getLevelSpec } from './levels';
import { DIRECTIONS, E, ROTATION_STATES, S, tileTypeForMask, turnsForMask } from './tiles';
import { validateBoard } from './validator';

type Rng = () => number;

interface FrontierEdge {
  from: number;
  to: number;
  bit: number;
  opposite: number;
}

const SCRAMBLE_ATTEMPTS = 40;

export function generatePuzzle(level: number, rng: Rng = Math.random): Puzzle {
  const spec = getLevelSpec(level);
  const { rows, cols } = spec;
  const total = rows * cols;
  const masks: number[] = new Array<number>(total).fill(0);
  const inGraph: boolean[] = new Array<boolean>(total).fill(false);
  const target = Math.max(2, Math.round(total * spec.fill));

  const frontier: FrontierEdge[] = [];
  const pushEdges = (cell: number): void => {
    const r = Math.floor(cell / cols);
    const c = cell % cols;
    for (const dir of DIRECTIONS) {
      const nr = r + dir.dr;
      const nc = c + dir.dc;
      if (nr < 0 || nr >= rows || nc < 0 || nc >= cols) continue;
      const to = nr * cols + nc;
      if (!inGraph[to]) {
        frontier.push({ from: cell, to, bit: dir.bit, opposite: dir.opposite });
      }
    }
  };

  const start = Math.floor(rng() * total);
  inGraph[start] = true;
  let count = 1;
  pushEdges(start);

  while (count < target && frontier.length > 0) {
    const pick = rng() < 0.6 ? frontier.length - 1 : Math.floor(rng() * frontier.length);
    const edge = frontier[pick];
    frontier[pick] = frontier[frontier.length - 1];
    frontier.pop();
    if (inGraph[edge.to]) continue;
    inGraph[edge.to] = true;
    masks[edge.from] |= edge.bit;
    masks[edge.to] |= edge.opposite;
    count += 1;
    pushEdges(edge.to);
  }

  for (let r = 0; r < rows; r += 1) {
    for (let c = 0; c < cols; c += 1) {
      const i = r * cols + c;
      if (!inGraph[i]) continue;
      for (const dir of DIRECTIONS) {
        if (dir.bit !== E && dir.bit !== S) continue;
        const nr = r + dir.dr;
        const nc = c + dir.dc;
        if (nr >= rows || nc >= cols) continue;
        const j = nr * cols + nc;
        if (inGraph[j] && (masks[i] & dir.bit) === 0 && rng() < spec.loopChance) {
          masks[i] |= dir.bit;
          masks[j] |= dir.opposite;
        }
      }
    }
  }

  const solution: number[] = [];
  const types = masks.map((mask, i) => {
    const type = inGraph[i] ? tileTypeForMask(mask) : rng() < spec.circleChance ? 'circle' : 'empty';
    solution.push(inGraph[i] ? turnsForMask(type, mask) : 0);
    return type;
  });

  const build = (turnsFor: (index: number) => number): Board => {
    const board: Board = [];
    for (let r = 0; r < rows; r += 1) {
      const line: Tile[] = [];
      for (let c = 0; c < cols; c += 1) {
        const i = r * cols + c;
        line.push({ type: types[i], turns: turnsFor(i) });
      }
      board.push(line);
    }
    return board;
  };

  for (let attempt = 0; attempt < SCRAMBLE_ATTEMPTS; attempt += 1) {
    const board = build(() => Math.floor(rng() * 4));
    if (!validateBoard(board).solved) {
      return { board, solution };
    }
  }

  const board = build((i) => solution[i]);
  outer: for (const line of board) {
    for (const tile of line) {
      if (ROTATION_STATES[tile.type] > 1) {
        tile.turns += 1;
        break outer;
      }
    }
  }
  return { board, solution };
}
