import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { generatePuzzle } from '../game/generator';
import { pickMessage } from '../game/messages';
import { planRotations, solvePuzzle } from '../game/solver';
import { ROTATION_STATES, rotateTileAt } from '../game/tiles';
import { validateBoard, type ValidationResult } from '../game/validator';
import type { Board, GameStats, Position } from '../types';
import { useTimer } from './useTimer';

type Status = 'idle' | 'playing' | 'solved';

const NEXT_LEVEL_DELAY_MS = 2000;
const AUTO_SOLVE_STEP_MS = 170;
const HINT_DURATION_MS = 3200;

const EMPTY_STATS: GameStats = { statesExplored: 0, branchesPruned: 0, dfsNodes: 0 };

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => {
    window.setTimeout(resolve, ms);
  });
}

export interface GameApi {
  level: number;
  puzzleId: number;
  board: Board;
  validation: ValidationResult | null;
  moves: number;
  seconds: number;
  stats: GameStats;
  solved: boolean;
  paused: boolean;
  autoSolving: boolean;
  hintCell: Position | null;
  message: readonly string[] | null;
  start: () => void;
  rotateTile: (row: number, col: number) => void;
  newPuzzle: () => void;
  requestHint: () => void;
  autoSolve: () => void;
  togglePause: () => void;
}

export function useGame(): GameApi {
  const [level, setLevel] = useState(1);
  const [puzzleId, setPuzzleId] = useState(0);
  const [board, setBoard] = useState<Board>([]);
  const [solution, setSolution] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [stats, setStats] = useState<GameStats>(EMPTY_STATS);
  const [status, setStatus] = useState<Status>('idle');
  const [paused, setPaused] = useState(false);
  const [autoSolving, setAutoSolving] = useState(false);
  const [hintCell, setHintCell] = useState<Position | null>(null);
  const [message, setMessage] = useState<readonly string[] | null>(null);

  const runToken = useRef(0);
  const hintTimer = useRef<number | undefined>(undefined);

  const validation = useMemo(() => (board.length > 0 ? validateBoard(board) : null), [board]);
  const seconds = useTimer(status === 'playing' && !paused, puzzleId);

  const clearHint = useCallback(() => {
    window.clearTimeout(hintTimer.current);
    setHintCell(null);
  }, []);

  const loadPuzzle = useCallback(
    (targetLevel: number) => {
      runToken.current += 1;
      clearHint();
      const puzzle = generatePuzzle(targetLevel);
      setBoard(puzzle.board);
      setSolution(puzzle.solution);
      setPuzzleId((id) => id + 1);
      setMoves(0);
      setStats(EMPTY_STATS);
      setStatus('playing');
      setPaused(false);
      setAutoSolving(false);
      setMessage(null);
    },
    [clearHint],
  );

  const start = useCallback(() => loadPuzzle(1), [loadPuzzle]);
  const newPuzzle = useCallback(() => loadPuzzle(level), [loadPuzzle, level]);

  useEffect(() => {
    if (!validation) return;
    setStats((s) => ({ ...s, dfsNodes: s.dfsNodes + validation.nodesVisited }));
  }, [validation]);

  useEffect(() => {
    if (validation?.solved && status === 'playing') {
      setStatus('solved');
      setMessage(pickMessage(level));
      clearHint();
    }
  }, [validation, status, level, clearHint]);

  useEffect(() => {
    if (status !== 'solved') return undefined;
    const id = window.setTimeout(() => {
      const next = level + 1;
      setLevel(next);
      loadPuzzle(next);
    }, NEXT_LEVEL_DELAY_MS);
    return () => window.clearTimeout(id);
  }, [status, level, loadPuzzle]);

  useEffect(() => () => window.clearTimeout(hintTimer.current), []);

  const rotateTile = useCallback(
    (row: number, col: number) => {
      if (status !== 'playing' || paused || autoSolving) return;
      const tile = board[row]?.[col];
      if (!tile || ROTATION_STATES[tile.type] < 2) return;
      setBoard((prev) => rotateTileAt(prev, row, col, 1));
      setMoves((m) => m + 1);
      clearHint();
    },
    [status, paused, autoSolving, board, clearHint],
  );

  const solveCurrent = useCallback((): number[] => {
    const result = solvePuzzle(board);
    setStats((s) => ({
      ...s,
      statesExplored: s.statesExplored + result.statesExplored,
      branchesPruned: s.branchesPruned + result.branchesPruned,
    }));
    return result.solved ? result.rotations : solution;
  }, [board, solution]);

  const requestHint = useCallback(() => {
    if (status !== 'playing' || paused || autoSolving || !validation) return;
    const cols = board[0]?.length ?? 0;
    const plan = planRotations(board, solveCurrent());
    if (plan.length === 0) return;
    const pick = plan.find((step) => validation.bad[step.row * cols + step.col]) ?? plan[0];
    window.clearTimeout(hintTimer.current);
    setHintCell({ row: pick.row, col: pick.col });
    hintTimer.current = window.setTimeout(() => setHintCell(null), HINT_DURATION_MS);
  }, [status, paused, autoSolving, validation, board, solveCurrent]);

  const autoSolve = useCallback(() => {
    if (status !== 'playing' || paused || autoSolving) return;
    runToken.current += 1;
    const token = runToken.current;
    clearHint();
    setAutoSolving(true);
    const plan = planRotations(board, solveCurrent());

    const run = async (): Promise<void> => {
      for (const step of plan) {
        await sleep(AUTO_SOLVE_STEP_MS);
        if (runToken.current !== token) return;
        setBoard((prev) => rotateTileAt(prev, step.row, step.col, step.turns));
      }
      if (runToken.current === token) {
        setAutoSolving(false);
      }
    };
    void run();
  }, [status, paused, autoSolving, board, clearHint, solveCurrent]);

  const togglePause = useCallback(() => {
    if (status !== 'playing' || autoSolving) return;
    setPaused((p) => !p);
  }, [status, autoSolving]);

  return {
    level,
    puzzleId,
    board,
    validation,
    moves,
    seconds,
    stats,
    solved: status === 'solved',
    paused,
    autoSolving,
    hintCell,
    message,
    start,
    rotateTile,
    newPuzzle,
    requestHint,
    autoSolve,
    togglePause,
  };
}
