import { motion } from 'framer-motion';

interface PauseOverlayProps {
  onResume: () => void;
}

export function PauseOverlay({ onResume }: PauseOverlayProps) {
  return (
    <motion.button
      type="button"
      onClick={onResume}
      className="flex h-full w-full flex-col items-center justify-center gap-2 rounded-3xl border border-loop-neon/15 text-loop-neon outline-none focus-visible:ring-2 focus-visible:ring-loop-neon/60"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <span className="text-2xl font-light">Paused</span>
      <span className="text-sm font-light text-loop-neon/60">Tap to continue</span>
    </motion.button>
  );
}
