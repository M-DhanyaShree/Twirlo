import { motion } from 'framer-motion';
import { ROTATION_STATES } from '../game/tiles';
import type { Tile } from '../types';
import { TileGraphic } from './TileGraphic';

interface TileButtonProps {
  tile: Tile;
  row: number;
  col: number;
  invalid: boolean;
  hinted: boolean;
  solved: boolean;
  onRotate: (row: number, col: number) => void;
}

const COLOR_CONNECTED = 'rgb(var(--loop-neon))';
const COLOR_LOOSE = 'rgb(var(--loop-loose))';
const COLOR_SOLVED = 'rgb(var(--loop-solved))';
const COLOR_HINT = '#ffffff';

export function TileButton({ tile, row, col, invalid, hinted, solved, onRotate }: TileButtonProps) {
  const rotatable = ROTATION_STATES[tile.type] > 1;
  const color = solved ? COLOR_SOLVED : hinted ? COLOR_HINT : invalid ? COLOR_LOOSE : COLOR_CONNECTED;

  return (
    <button
      type="button"
      onClick={() => onRotate(row, col)}
      disabled={!rotatable}
      aria-label={`${tile.type} tile, row ${row + 1}, column ${col + 1}`}
      className="relative block aspect-square w-full cursor-pointer rounded-2xl p-0 outline-none focus-visible:ring-2 focus-visible:ring-loop-neon/50 disabled:cursor-default"
    >
      <TileGraphic type={tile.type} turns={tile.turns} color={color} />
      {hinted && (
        <motion.span
          className="pointer-events-none absolute inset-[8%] rounded-full border-2 border-white/80"
          animate={{ scale: [0.88, 1.08, 0.88], opacity: [0.9, 0.25, 0.9] }}
          transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
        />
      )}
    </button>
  );
}
