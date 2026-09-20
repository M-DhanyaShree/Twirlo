import { AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';
import { LoadingScreen } from './components/LoadingScreen';
import { PuzzleScreen } from './components/PuzzleScreen';
import { useGame } from './hooks/useGame';

const LOADING_DURATION_MS = 2000;

export default function App() {
  const game = useGame();
  const { start } = game;
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const id = window.setTimeout(() => {
      start();
      setReady(true);
    }, LOADING_DURATION_MS);
    return () => window.clearTimeout(id);
  }, [start]);

  return (
    <AnimatePresence mode="wait">
      {ready ? <PuzzleScreen key="puzzle" game={game} /> : <LoadingScreen key="loading" />}
    </AnimatePresence>
  );
}
