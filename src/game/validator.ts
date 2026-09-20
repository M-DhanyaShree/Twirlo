import type { Board } from '../types';
import { DIRECTIONS, E, S, tileMask } from './tiles';

export interface ValidationResult {
  solved: boolean;
  mismatches: number;
  bad: boolean[];
  components: number;
  loops: number;
  nodesVisited: number;
}

export function validateBoard(board: Board): ValidationResult {
  const rows = board.length;
  const cols = rows > 0 ? board[0].length : 0;
  const total = rows * cols;
  const masks: number[] = [];
  let circles = 0;

  for (const line of board) {
    for (const tile of line) {
      masks.push(tileMask(tile));
      if (tile.type === 'circle') {
        circles += 1;
      }
    }
  }

  const bad: boolean[] = new Array<boolean>(total).fill(false);
  let mismatches = 0;

  const neighbour = (index: number, dr: number, dc: number): number => {
    const r = Math.floor(index / cols) + dr;
    const c = (index % cols) + dc;
    return r < 0 || r >= rows || c < 0 || c >= cols ? -1 : r * cols + c;
  };

  for (let i = 0; i < total; i += 1) {
    for (const dir of DIRECTIONS) {
      if ((masks[i] & dir.bit) === 0) continue;
      const j = neighbour(i, dir.dr, dir.dc);
      if (j < 0 || (masks[j] & dir.opposite) === 0) {
        mismatches += 1;
        bad[i] = true;
      }
    }
  }

  const visited: boolean[] = new Array<boolean>(total).fill(false);
  let nodesVisited = 0;
  let edges = 0;
  let linkedNodes = 0;
  let components = 0;

  const dfs = (index: number): void => {
    visited[index] = true;
    nodesVisited += 1;
    linkedNodes += 1;
    for (const dir of DIRECTIONS) {
      if ((masks[index] & dir.bit) === 0) continue;
      const j = neighbour(index, dir.dr, dir.dc);
      if (j < 0 || (masks[j] & dir.opposite) === 0) continue;
      if (dir.bit === E || dir.bit === S) {
        edges += 1;
      }
      if (!visited[j]) {
        dfs(j);
      }
    }
  };

  for (let i = 0; i < total; i += 1) {
    if (masks[i] !== 0 && !visited[i]) {
      components += 1;
      dfs(i);
    }
  }

  const loops = edges - linkedNodes + components + circles;

  return {
    solved: mismatches === 0 && linkedNodes + circles > 0,
    mismatches,
    bad,
    components: components + circles,
    loops,
    nodesVisited: nodesVisited + circles,
  };
}
