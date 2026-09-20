import { motion } from 'framer-motion';

const INK = '#2d6a4a';

function LoopSymbols() {
  const common = {
    viewBox: '0 0 100 100',
    className: 'h-16 w-16 sm:h-20 sm:w-20',
    fill: 'none',
    stroke: INK,
    strokeWidth: 7,
    strokeLinecap: 'round' as const,
  };

  return (
    <div className="flex items-center gap-5 sm:gap-8" aria-hidden="true">
      <motion.svg
        {...common}
        animate={{ rotate: 360 }}
        transition={{ duration: 3.2, repeat: Infinity, ease: 'linear' }}
      >
        <path d="M14 50A36 36 0 0 1 50 14" />
      </motion.svg>

      <motion.svg {...common} animate={{ scale: [0.85, 1, 0.85] }} transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}>
        <motion.circle
          cx="50"
          cy="50"
          r="30"
          initial={{ pathLength: 0.2 }}
          animate={{ pathLength: [0.2, 1, 1, 0.2], rotate: [0, 0, 180, 360] }}
          transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut' }}
          style={{ transformOrigin: '50px 50px' }}
        />
      </motion.svg>

      <motion.svg
        {...common}
        animate={{ rotate: -360 }}
        transition={{ duration: 3.2, repeat: Infinity, ease: 'linear' }}
      >
        <path d="M50 14A36 36 0 0 1 86 50" />
      </motion.svg>
    </div>
  );
}

export function LoadingScreen() {
  return (
    <motion.div
      className="relative flex h-full w-full flex-col items-center justify-center bg-loop-pastel"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.7, ease: 'easeInOut' }}
    >
      <LoopSymbols />
      <motion.div
        className="absolute bottom-[14%] px-6 text-center text-loop-ink"
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.8 }}
      >
        <p className="mb-2 text-xs font-semibold tracking-[0.3em] opacity-70">HINT:</p>
        <p className="text-lg font-light leading-relaxed sm:text-xl">
          It can be one closed shape,
          <br />
          or more.
        </p>
      </motion.div>
    </motion.div>
  );
}
