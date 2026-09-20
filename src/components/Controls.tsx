import { IconButton } from './IconButton';
import { BulbIcon, PauseIcon, PlayIcon, RefreshIcon, SparkleIcon } from './Icons';

interface ControlsProps {
  paused: boolean;
  solved: boolean;
  autoSolving: boolean;
  onNewPuzzle: () => void;
  onHint: () => void;
  onAutoSolve: () => void;
  onTogglePause: () => void;
}

export function Controls({ paused, solved, autoSolving, onNewPuzzle, onHint, onAutoSolve, onTogglePause }: ControlsProps) {
  const locked = solved || paused || autoSolving;

  return (
    <nav
      className="fixed bottom-5 right-5 z-20 flex flex-col gap-3 pb-[env(safe-area-inset-bottom)]"
      aria-label="Game controls"
    >
      <IconButton label="New puzzle" onClick={onNewPuzzle} disabled={solved}>
        <RefreshIcon />
      </IconButton>
      <IconButton label="Hint" onClick={onHint} disabled={locked}>
        <BulbIcon />
      </IconButton>
      <IconButton label="Auto solve" onClick={onAutoSolve} disabled={locked}>
        <SparkleIcon />
      </IconButton>
      <IconButton label={paused ? 'Resume' : 'Pause'} onClick={onTogglePause} disabled={solved || autoSolving} active={paused}>
        {paused ? <PlayIcon /> : <PauseIcon />}
      </IconButton>
    </nav>
  );
}
