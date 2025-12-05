import React, { useState } from 'react';
import { GameMode, TypingResult } from './types';
import TypingTest from './components/TypingTest';
import MiniGameRace from './components/MiniGameRace';
import MiniGameRain from './components/MiniGameRain';
import ResultModal from './components/ResultModal';

const App: React.FC = () => {
  const [mode, setMode] = useState<GameMode>(GameMode.ZEN);
  const [lastResult, setLastResult] = useState<TypingResult | null>(null);

  const handleGameFinish = (result: TypingResult) => {
    setLastResult(result);
  };

  const restartGame = () => {
    setLastResult(null);
    // Force re-render of component if needed by toggling a key, 
    // but React router or just state change is usually enough. 
    // Here we just clear result, component mounts fresh if we don't persist state inside it too hard.
  };

  const switchMode = (newMode: GameMode) => {
    setMode(newMode);
    setLastResult(null);
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-[#18181b] text-zinc-300 selection:bg-yellow-400/30">
      
      {/* Navigation / Header */}
      <header className="w-full max-w-5xl mx-auto p-6 flex flex-col md:flex-row justify-between items-center z-10">
        <div className="flex items-center gap-2 mb-4 md:mb-0">
            <div className="w-8 h-8 bg-yellow-400 rounded-lg flex items-center justify-center text-zinc-900 font-bold font-mono text-xl">
                T
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-zinc-100 font-mono">TypeZen</h1>
        </div>
        
        <nav className="bg-zinc-800/50 backdrop-blur-md p-1.5 rounded-xl border border-zinc-700/50">
            <ul className="flex space-x-1">
                {Object.values(GameMode).map((m) => (
                    <li key={m}>
                        <button
                            onClick={() => switchMode(m)}
                            className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                                mode === m 
                                ? 'bg-zinc-600 text-white shadow-sm' 
                                : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-700/50'
                            }`}
                        >
                            {m.charAt(0) + m.slice(1).toLowerCase()}
                        </button>
                    </li>
                ))}
            </ul>
        </nav>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 w-full flex flex-col items-center justify-center relative">
        <div className="w-full px-4">
            {!lastResult && (
                <>
                    {mode === GameMode.ZEN && <TypingTest gameMode="ZEN" onFinish={handleGameFinish} key="zen" />}
                    {mode === GameMode.TIME && <TypingTest gameMode="TIME" onFinish={handleGameFinish} key="time" />}
                    {mode === GameMode.RACE && <MiniGameRace onFinish={handleGameFinish} key="race" />}
                    {mode === GameMode.RAIN && <MiniGameRain onFinish={handleGameFinish} key="rain" />}
                </>
            )}
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full p-6 text-center text-zinc-600 text-xs font-mono">
        <p>⌘ + Shift + R to Restart • Tab for Menu</p>
      </footer>

      {/* Result Modal */}
      {lastResult && (
        <ResultModal result={lastResult} onRestart={restartGame} />
      )}

    </div>
  );
};

export default App;