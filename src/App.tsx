import { AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';
import { HomeScreen } from './components/HomeScreen';
import { LoadingScreen } from './components/LoadingScreen';
import { PuzzleScreen } from './components/PuzzleScreen';
import { useGame } from './hooks/useGame';

const LOADING_DURATION_MS = 2000;

export default function App() {
  const game = useGame();
  const { start } = game;
  const [screen, setScreen] = useState<'home' | 'loading' | 'game'>('home');

  useEffect(() => {
    if (screen !== 'loading') return undefined;
    const id = window.setTimeout(() => {
      start();
      setScreen('game');
    }, LOADING_DURATION_MS);
    return () => window.clearTimeout(id);
  }, [screen, start]);

  return (
    <AnimatePresence mode="wait">
      {screen === 'home' && <HomeScreen key="home" onStart={() => setScreen('loading')} />}
      {screen === 'loading' && <LoadingScreen key="loading" />}
      {screen === 'game' && <PuzzleScreen key="puzzle" game={game} />}
    </AnimatePresence>
  );
}
