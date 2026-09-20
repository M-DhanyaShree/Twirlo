import { motion } from 'framer-motion';
import type { ValidationResult } from '../game/validator';
import type { Board as BoardData, Position } from '../types';
import { TileButton } from './TileButton';

interface BoardProps {
  board: BoardData;
  validation: ValidationResult | null;
  hintCell: Position | null;
  solved: boolean;
  onRotate: (row: number, col: number) => void;
}

const GLOW_IDLE = 'drop-shadow(0 0 6px rgb(var(--loop-neon) / 0.5))';
const GLOW_PEAK = 'drop-shadow(0 0 22px rgb(var(--loop-solved) / 0.95))';

export function Board({ board, validation, hintCell, solved, onRotate }: BoardProps) {
  const cols = board[0]?.length ?? 0;

  return (
    <motion.div
      className="grid h-full w-full"
      style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}
      initial={{ opacity: 0, scale: 0.9, filter: GLOW_IDLE }}
      animate={
        solved
          ? { opacity: 1, scale: [1, 1.04, 1], filter: [GLOW_IDLE, GLOW_PEAK, GLOW_IDLE] }
          : { opacity: 1, scale: 1, filter: GLOW_IDLE }
      }
      exit={{ opacity: 0, scale: 1.06 }}
      transition={solved ? { duration: 1.3, ease: 'easeInOut' } : { duration: 0.45, ease: 'easeOut' }}
    >
      {board.flatMap((line, row) =>
        line.map((tile, col) => (
          <TileButton
            key={`${row}-${col}`}
            tile={tile}
            row={row}
            col={col}
            invalid={validation?.bad[row * cols + col] ?? false}
            hinted={hintCell?.row === row && hintCell.col === col}
            solved={solved}
            onRotate={onRotate}
          />
        )),
      )}
    </motion.div>
  );
}
