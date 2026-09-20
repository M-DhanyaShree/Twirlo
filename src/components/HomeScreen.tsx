import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';
import { HowToPlayModal } from './HowToPlayModal';
import { TileGraphic } from './TileGraphic';

interface HomeScreenProps {
  onStart: () => void;
}

export function HomeScreen({ onStart }: HomeScreenProps) {
  const [howToPlayOpen, setHowToPlayOpen] = useState(false);

  return (
    <motion.main
      className="relative flex h-full w-full flex-col items-center justify-center overflow-hidden bg-loop-deep px-6 text-center text-loop-solved"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.7 }}
    >
      <div className="pointer-events-none absolute inset-0 opacity-20" aria-hidden="true">
        <div className="absolute left-[12%] top-[18%] h-36 w-36 rounded-full border border-loop-neon/40" />
        <div className="absolute bottom-[14%] right-[10%] h-56 w-56 rounded-full border border-loop-neon/20" />
      </div>

      <motion.div
        className="relative flex max-w-xl flex-col items-center"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.15 }}
      >
        <div className="mb-8 flex h-32 w-56 items-center justify-center" aria-hidden="true">
          <div className="h-28 w-28 rotate-[-18deg]"><TileGraphic type="corner" turns={0} color="rgb(var(--loop-neon))" /></div>
          <div className="-ml-10 h-28 w-28 rotate-[72deg]"><TileGraphic type="corner" turns={0} color="rgb(var(--loop-neon))" /></div>
        </div>

        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.4em] text-loop-neon/60">A tiny puzzle spiral</p>
        <h1 className="text-7xl font-light tracking-tight text-loop-neon sm:text-8xl">Twirlo</h1>
        <p className="mt-4 text-lg font-light italic text-loop-solved/75 sm:text-xl">Twirl the lines. Lose your mind. Repeat.</p>

        <div className="mt-12 flex w-full max-w-xs flex-col gap-3">
          <button
            type="button"
            onClick={onStart}
            className="rounded-full bg-loop-neon px-7 py-3.5 text-sm font-semibold uppercase tracking-[0.18em] text-loop-deep shadow-lg shadow-loop-neon/20 transition-transform hover:scale-[1.02] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-loop-neon focus-visible:ring-offset-2 focus-visible:ring-offset-loop-deep active:scale-[0.98]"
          >
            Start game
          </button>
          <button
            type="button"
            onClick={() => setHowToPlayOpen(true)}
            className="rounded-full border border-loop-neon/30 px-7 py-3.5 text-sm font-medium uppercase tracking-[0.16em] text-loop-neon transition-colors hover:bg-loop-neon/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-loop-neon/70"
          >
            How to play
          </button>
        </div>
      </motion.div>

      <p className="absolute bottom-6 text-xs tracking-[0.18em] text-loop-solved/35">ONE BOARD. ZERO PEACE.</p>

      <AnimatePresence>
        {howToPlayOpen && (
          <HowToPlayModal
            onClose={() => setHowToPlayOpen(false)}
            onStart={() => {
              setHowToPlayOpen(false);
              onStart();
            }}
          />
        )}
      </AnimatePresence>
    </motion.main>
  );
}
