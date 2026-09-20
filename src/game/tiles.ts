import type { Board, Tile, TileType } from '../types';

export const N = 1;
export const E = 2;
export const S = 4;
export const W = 8;

export interface Direction {
  bit: number;
  opposite: number;
  dr: number;
  dc: number;
}

export const DIRECTIONS: readonly Direction[] = [
  { bit: N, opposite: S, dr: -1, dc: 0 },
  { bit: E, opposite: W, dr: 0, dc: 1 },
  { bit: S, opposite: N, dr: 1, dc: 0 },
  { bit: W, opposite: E, dr: 0, dc: -1 },
];

export const BASE_MASK: Record<TileType, number> = {
  empty: 0,
  end: N,
  straight: N | S,
  corner: N | E,
  tee: E | S | W,
  cross: N | E | S | W,
  circle: 0,
};

export const ROTATION_STATES: Record<TileType, number> = {
  empty: 1,
  end: 4,
  straight: 2,
  corner: 4,
  tee: 4,
  cross: 1,
  circle: 1,
};

export function normalizeTurns(turns: number): number {
  return ((turns % 4) + 4) % 4;
}

export function rotateMask(mask: number, turns: number): number {
  let result = mask;
  for (let i = 0; i < normalizeTurns(turns); i += 1) {
    result = ((result << 1) | (result >> 3)) & 15;
  }
  return result;
}

export function tileMask(tile: Tile): number {
  return rotateMask(BASE_MASK[tile.type], tile.turns);
}

export function popcount(mask: number): number {
  let count = 0;
  for (let m = mask; m > 0; m >>= 1) {
    count += m & 1;
  }
  return count;
}

export function tileTypeForMask(mask: number): TileType {
  switch (popcount(mask)) {
    case 1:
      return 'end';
    case 2:
      return mask === (N | S) || mask === (E | W) ? 'straight' : 'corner';
    case 3:
      return 'tee';
    case 4:
      return 'cross';
    default:
      return 'empty';
  }
}

export function turnsForMask(type: TileType, mask: number): number {
  for (let turns = 0; turns < 4; turns += 1) {
    if (rotateMask(BASE_MASK[type], turns) === mask) {
      return turns;
    }
  }
  return 0;
}

export function rotateTileAt(board: Board, row: number, col: number, turns: number): Board {
  return board.map((line, r) =>
    line.map((tile, c) => (r === row && c === col ? { ...tile, turns: tile.turns + turns } : tile)),
  );
}
