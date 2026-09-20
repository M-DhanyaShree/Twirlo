import { motion } from 'framer-motion';
import type { TileType } from '../types';

interface TileGraphicProps {
  type: TileType;
  turns: number;
  color: string;
}

function TileShape({ type, color }: { type: TileType; color: string }) {
  switch (type) {
    case 'end':
      return (
        <>
          <path d="M50 0V50" />
          <circle cx="50" cy="50" r="10" fill={color} stroke="none" />
        </>
      );
    case 'straight':
      return <path d="M50 0V100" />;
    case 'corner':
      return <path d="M50 0A50 50 0 0 0 100 50" />;
    case 'tee':
      return <path d="M0 50H100M50 50V100" />;
    case 'cross':
      return <path d="M0 50H100M50 0V100" />;
    case 'circle':
      return <circle cx="50" cy="50" r="27" />;
    default:
      return null;
  }
}

export function TileGraphic({ type, turns, color }: TileGraphicProps) {
  if (type === 'empty') return null;

  return (
    <motion.svg
      viewBox="0 0 100 100"
      className="h-full w-full"
      fill="none"
      stroke="currentColor"
      strokeWidth={9}
      strokeLinecap="round"
      strokeLinejoin="round"
      initial={false}
      animate={{ rotate: turns * 90 }}
      transition={{ type: 'spring', stiffness: 240, damping: 22, mass: 0.8 }}
      style={{ color, overflow: 'visible', transition: 'color 0.4s ease' }}
      aria-hidden="true"
    >
      <TileShape type={type} color="currentColor" />
    </motion.svg>
  );
}
