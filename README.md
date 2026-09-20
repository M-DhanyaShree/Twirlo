# Loop

An endless, relaxing loop puzzle built with React, Vite, TypeScript, Tailwind CSS and Framer Motion.

## Run

```bash
npm install
npm run dev      # development
npm run build    # type-check + production build
```

## Structure

```
src/
  game/        pure logic (no React)
    tiles.ts       bitmask tile model, rotation helpers
    levels.ts      difficulty progression (3x3 -> 8x8)
    generator.ts   procedural, always-solvable puzzle generation
    solver.ts      Backtracking + Branch and Bound (solvePuzzle)
    validator.ts   DFS validation, components and loop counting
    messages.ts    congratulation messages
  hooks/       useGame (state machine), useTimer
  components/  LoadingScreen, PuzzleScreen, Board, TileButton, TileGraphic (SVG),
               Controls, StatsPanel, AlgorithmsModal, PauseOverlay, icons
```

## Algorithms

- **Backtracking** - `solvePuzzle(board)` places tiles in row-major order, trying every distinct rotation and undoing on failure. Powers Hint and Auto Solve.
- **Branch and Bound** - prunes border violations, mismatches with placed neighbours, and dead-end neighbours (forward checking). Tracks `statesExplored` and `branchesPruned`.
- **DFS** - validates connections, finds connected components, counts loops (E - V + C) and reports `nodesVisited`.

## Generation

Grow a random connected graph, add extra links for loops, convert each cell's connection mask to a tile type, then randomly rotate every tile. Because it starts from a solved board, every puzzle is solvable.
