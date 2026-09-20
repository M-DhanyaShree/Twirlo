import { motion } from 'framer-motion';
import type { ReactNode } from 'react';

interface IconButtonProps {
  label: string;
  onClick: () => void;
  disabled?: boolean;
  active?: boolean;
  children: ReactNode;
}

export function IconButton({ label, onClick, disabled = false, active = false, children }: IconButtonProps) {
  return (
    <motion.button
      type="button"
      aria-label={label}
      title={label}
      disabled={disabled}
      onClick={onClick}
      whileTap={disabled ? undefined : { scale: 0.9 }}
      whileHover={disabled ? undefined : { scale: 1.06 }}
      className={`flex h-12 w-12 items-center justify-center rounded-full border text-loop-neon outline-none backdrop-blur transition-colors focus-visible:ring-2 focus-visible:ring-loop-neon/60 disabled:opacity-30 ${
        active ? 'border-loop-neon/60 bg-loop-neon/20' : 'border-loop-neon/25 bg-loop-neon/5 hover:bg-loop-neon/15'
      }`}
    >
      {children}
    </motion.button>
  );
}
