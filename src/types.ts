export type TileType = 'empty' | 'end' | 'straight' | 'corner' | 'tee' | 'cross' | 'circle';

export interface Tile {
  type: TileType;
  turns: number;
}

export type Board = Tile[][];

export interface Position {
  row: number;
  col: number;
}

export interface Puzzle {
  board: Board;
  solution: number[];
}

export interface GameStats {
  statesExplored: number;
  branchesPruned: number;
  dfsNodes: number;
}
