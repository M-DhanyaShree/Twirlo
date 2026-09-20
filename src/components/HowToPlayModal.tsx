import { motion } from 'framer-motion';
import { useState } from 'react';
import { CloseIcon } from './Icons';
import { TileGraphic } from './TileGraphic';

interface HowToPlayModalProps {
  onClose: () => void;
  onStart: () => void;
}

export function HowToPlayModal({ onClose, onStart }: HowToPlayModalProps) {
  const [demoTurns, setDemoTurns] = useState(0);

  return (
    <motion.div
      className="fixed inset-0 z-40 flex items-center justify-center bg-black/45 px-4 py-6 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.section
        role="dialog"
        aria-modal="true"
        aria-labelledby="how-to-play-title"
        className="relative max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-[2rem] border border-loop-neon/25 bg-loop-surface p-6 text-loop-solved shadow-2xl sm:p-8"
        initial={{ opacity: 0, y: 18, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 12, scale: 0.98 }}
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          aria-label="Close how to play"
          title="Close"
          onClick={onClose}
          className="absolute right-4 top-4 rounded-full p-2 text-loop-neon/70 outline-none transition-colors hover:bg-loop-neon/10 hover:text-loop-neon focus-visible:ring-2 focus-visible:ring-loop-neon/60"
        >
          <CloseIcon />
        </button>

        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.28em] text-loop-neon/60">Quick start</p>
        <h2 id="how-to-play-title" className="mb-6 text-3xl font-light text-loop-neon">
          How to play
        </h2>

        <ol className="space-y-3 text-sm font-light leading-relaxed text-loop-solved/80">
          <li><span className="mr-3 text-loop-neon">01</span>Tap a tile to rotate its line clockwise.</li>
          <li><span className="mr-3 text-loop-neon">02</span>Connect every line to its neighbours.</li>
          <li><span className="mr-3 text-loop-neon">03</span>Keep turning until the whole board becomes one complete loop.</li>
        </ol>

        <div className="my-7 rounded-2xl border border-loop-neon/15 bg-black/10 p-5 text-center">
          <p className="mb-4 text-xs uppercase tracking-[0.22em] text-loop-neon/55">Try it</p>
          <div className="mx-auto flex h-24 w-44 items-center justify-center gap-1 rounded-xl border border-loop-neon/10 bg-black/10">
            <div className="h-20 w-20"><TileGraphic type="corner" turns={demoTurns} color="rgb(var(--loop-neon))" /></div>
            <div className="h-20 w-20"><TileGraphic type="corner" turns={demoTurns + 1} color="rgb(var(--loop-neon))" /></div>
          </div>
          <p className="mt-4 text-xs text-loop-solved/60">Tap the demo to rotate the lines.</p>
          <button
            type="button"
            onClick={() => setDemoTurns((turns) => turns + 1)}
            className="absolute inset-x-0 mx-auto mt-[-6.5rem] h-24 w-44 rounded-xl outline-none focus-visible:ring-2 focus-visible:ring-loop-neon/70"
            aria-label="Rotate demo tiles"
          />
        </div>

        <button
          type="button"
          onClick={onStart}
          className="w-full rounded-full bg-loop-neon px-6 py-3 text-sm font-semibold uppercase tracking-[0.18em] text-loop-deep shadow-lg shadow-loop-neon/20 transition-transform hover:scale-[1.02] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-loop-neon focus-visible:ring-offset-2 focus-visible:ring-offset-loop-surface active:scale-[0.98]"
        >
          Start game
        </button>
      </motion.section>
    </motion.div>
  );
}
