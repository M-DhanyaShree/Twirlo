import { motion } from 'framer-motion';
import type { GameStats } from '../types';

interface StatsPanelProps {
  level: number;
  moves: number;
  seconds: number;
  stats: GameStats;
}

function formatTime(total: number): string {
  const minutes = Math.floor(total / 60);
  const seconds = total % 60;
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

export function StatsPanel({ level, moves, seconds, stats }: StatsPanelProps) {
  const rows: readonly [string, string][] = [
    ['Level', String(level)],
    ['Moves', String(moves)],
    ['Time', formatTime(seconds)],
    ['States explored', stats.statesExplored.toLocaleString()],
    ['Branches pruned', stats.branchesPruned.toLocaleString()],
    ['DFS nodes visited', stats.dfsNodes.toLocaleString()],
  ];

  return (
    <motion.aside
      className="fixed right-4 top-20 z-30 w-64 rounded-3xl border border-loop-neon/20 bg-loop-surface/90 p-5 shadow-2xl backdrop-blur-md"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ duration: 0.25 }}
      aria-label="Statistics"
    >
      <dl className="space-y-3 text-sm">
        {rows.map(([label, value]) => (
          <div key={label} className="flex items-baseline justify-between gap-4">
            <dt className="font-light text-loop-neon/60">{label}</dt>
            <dd className="font-medium tabular-nums text-loop-neon">{value}</dd>
          </div>
        ))}
      </dl>
    </motion.aside>
  );
}
