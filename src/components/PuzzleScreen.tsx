import { AnimatePresence, motion } from 'framer-motion';
import { useMemo, useState, type CSSProperties } from 'react';
import type { GameApi } from '../hooks/useGame';
import { Board } from './Board';
import { Controls } from './Controls';
import { IconButton } from './IconButton';
import { ChartIcon } from './Icons';
import { PauseOverlay } from './PauseOverlay';
import { StatsPanel } from './StatsPanel';

interface PuzzleScreenProps {
  game: GameApi;
}

const LEVEL_THEMES = [
  { neon: '57 255 136', deep: '10 42 28', pastel: '207 233 201', ink: '45 106 74', surface: '12 51 35', loose: '31 156 88', solved: '215 255 232' },
  { neon: '94 225 230', deep: '12 38 48', pastel: '204 244 242', ink: '35 111 120', surface: '16 58 70', loose: '42 157 166', solved: '225 255 255' },
  { neon: '255 181 71', deep: '52 29 12', pastel: '255 232 194', ink: '134 80 22', surface: '71 40 15', loose: '194 116 28', solved: '255 245 218' },
  { neon: '255 120 166', deep: '52 18 35', pastel: '255 215 229', ink: '133 54 87', surface: '72 25 48', loose: '197 70 120', solved: '255 232 241' },
  { neon: '183 148 255', deep: '29 20 52', pastel: '226 216 255', ink: '85 61 143', surface: '45 30 76', loose: '126 91 196', solved: '241 235 255' },
] as const;

type LevelTheme = (typeof LEVEL_THEMES)[number];

function getLevelTheme(level: number): LevelTheme {
  let seed = level * 9301 + 49297;
  seed = (seed * 233280) % 100000;
  return LEVEL_THEMES[Math.floor((seed / 100000) * LEVEL_THEMES.length)];
}

export function PuzzleScreen({ game }: PuzzleScreenProps) {
  const [statsOpen, setStatsOpen] = useState(false);
  const theme = useMemo(() => getLevelTheme(game.level), [game.level]);
  const themeVariables = {
    '--loop-neon': theme.neon,
    '--loop-deep': theme.deep,
    '--loop-pastel': theme.pastel,
    '--loop-ink': theme.ink,
    '--loop-surface': theme.surface,
    '--loop-loose': theme.loose,
    '--loop-solved': theme.solved,
  } as CSSProperties;
  const bgBase = `rgb(${theme.deep})`;
  const bgPulse = `rgb(${theme.surface})`;

  return (
    <motion.main
      className="relative flex h-full w-full flex-col items-center justify-center overflow-hidden"
      style={themeVariables}
      initial={{ opacity: 0, backgroundColor: bgBase }}
      animate={{
        opacity: 1,
        backgroundColor: game.solved ? [bgBase, bgPulse, bgBase] : bgBase,
      }}
      transition={{
        opacity: { duration: 0.8 },
        backgroundColor: game.solved
          ? { duration: 1.8, repeat: Infinity, ease: 'easeInOut' }
          : { duration: 0.6 },
      }}
    >
      <header className="pointer-events-none absolute inset-x-0 top-5 flex justify-center pt-[env(safe-area-inset-top)]">
        <AnimatePresence mode="wait">
          <motion.div
            key={game.level}
            className="text-center"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.35 }}
          >
            <p className="text-xs font-light tracking-widest text-loop-neon/50">Level</p>
            <p className="text-4xl font-extralight tabular-nums text-loop-neon">{game.level}</p>
          </motion.div>
        </AnimatePresence>
      </header>

      <div className="absolute right-5 top-5 z-20 flex gap-3 pt-[env(safe-area-inset-top)]">
        <IconButton label="Statistics" onClick={() => setStatsOpen((open) => !open)} active={statsOpen}>
          <ChartIcon />
        </IconButton>
      </div>

      <div className="flex w-full flex-col items-center gap-6 px-4">
        <div className="aspect-square w-[min(86vw,58vh,600px)]">
          <AnimatePresence mode="wait">
            {game.paused ? (
              <PauseOverlay key="paused" onResume={game.togglePause} />
            ) : (
              <Board
                key={game.puzzleId}
                board={game.board}
                validation={game.validation}
                hintCell={game.hintCell}
                solved={game.solved}
                onRotate={game.rotateTile}
              />
            )}
          </AnimatePresence>
        </div>

        <div className="flex h-16 items-start justify-center" aria-live="polite">
          <AnimatePresence>
            {game.message && (
              <motion.div
                key={game.puzzleId}
                className="text-center text-lg font-light text-loop-neon"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                {game.message.map((line) => (
                  <p key={line}>{line}</p>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <Controls
        paused={game.paused}
        solved={game.solved}
        autoSolving={game.autoSolving}
        onNewPuzzle={game.newPuzzle}
        onHint={game.requestHint}
        onAutoSolve={game.autoSolve}
        onTogglePause={game.togglePause}
      />

      <AnimatePresence>
        {statsOpen && (
          <StatsPanel level={game.level} moves={game.moves} seconds={game.seconds} stats={game.stats} />
        )}
      </AnimatePresence>
    </motion.main>
  );
}
