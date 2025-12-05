import React, { useState, useEffect, useRef } from 'react';
import { GameState, TypingResult } from '../types';
import { generateTypingContent } from '../services/geminiService';

interface MiniGameRaceProps {
  onFinish: (result: TypingResult) => void;
}

const MiniGameRace: React.FC<MiniGameRaceProps> = ({ onFinish }) => {
  const [targetText, setTargetText] = useState('');
  const [inputValue, setInputValue] = useState('');
  const [gameState, setGameState] = useState<GameState>(GameState.LOADING);
  const [startTime, setStartTime] = useState<number>(0);
  const [botProgress, setBotProgress] = useState(0);
  
  const inputRef = useRef<HTMLInputElement>(null);
  const botInterval = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const init = async () => {
      try {
        // Generate a sentence for the race
        const sentences = await generateTypingContent('sentences', 'easy');
        // Flatten to string if it's an array, take first 15 words
        const text = Array.isArray(sentences) ? sentences.slice(0, 15).join(' ') : sentences; 
        if (text && text.length > 0) {
          setTargetText(text);
          setGameState(GameState.IDLE);
          if (inputRef.current) inputRef.current.focus();
        } else {
          console.error('No sentences generated');
          setGameState(GameState.IDLE);
        }
      } catch (error) {
        console.error('Error initializing race:', error);
        setGameState(GameState.IDLE);
      }
    };
    init();
    return () => clearInterval(botInterval.current as NodeJS.Timeout);
  }, []);

  const calculateProgress = (input: string, target: string) => {
    return Math.min(100, (input.length / target.length) * 100);
  };

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    
    if (gameState === GameState.IDLE) {
      setGameState(GameState.PLAYING);
      setStartTime(Date.now());
      startBot();
    }

    // Only allow correct typing for the race mechanic? 
    // Or allow errors but they slow you down? 
    // Let's enforce correctness for "movement" - strict mode
    const isCorrectSoFar = targetText.startsWith(val);
    
    if (isCorrectSoFar) {
      setInputValue(val);
      if (val.length === targetText.length) {
        finishRace(true);
      }
    } else {
        // Visual feedback handled by CSS on input
    }
  };

  const startBot = () => {
    // Bot moves at a fixed random speed ~40-60 WPM
    botInterval.current = setInterval(() => {
      setBotProgress(prev => {
        if (prev >= 100) {
          finishRace(false);
          return 100;
        }
        return prev + (Math.random() * 0.8); 
      });
    }, 100);
  };

  const finishRace = (userWon: boolean) => {
    setGameState(GameState.FINISHED);
    clearInterval(botInterval.current as NodeJS.Timeout);
    
    const endTime = Date.now();
    const durationMin = (endTime - startTime) / 60000;
    const wpm = (targetText.length / 5) / durationMin;

    onFinish({
      wpm: userWon ? Math.round(wpm) : 0, // 0 WPM if you lose
      rawWpm: Math.round(wpm),
      accuracy: 100, // Strict mode enforced 100%
      correctChars: targetText.length,
      incorrectChars: 0,
      missedChars: 0,
      timeElapsed: (endTime - startTime) / 1000,
      accuracyLabel: userWon ? 'You Won!' : 'Bot Won!'
    } as any);
  };

  const userProgress = calculateProgress(inputValue, targetText);

  if (gameState === GameState.LOADING) return <div className="text-yellow-400 text-center mt-20 font-mono">Starting Engines...</div>;

  return (
    <div className="w-full max-w-4xl mx-auto mt-10 p-4">
      <h2 className="text-center text-zinc-400 font-mono mb-8">Type strictly correct to move your car!</h2>
      
      {/* Race Track */}
      <div className="mb-12 space-y-8">
        
        {/* User Lane */}
        <div className="relative border-b border-zinc-700 pb-2">
          <div 
            className="absolute -top-8 transition-all duration-200 text-3xl"
            style={{ left: `calc(${userProgress}% - 30px)` }}
          >
            🏎️ <span className="text-xs text-yellow-400 font-mono">YOU</span>
          </div>
          <div className="h-2 w-full bg-zinc-800 rounded overflow-hidden">
            <div className="h-full bg-yellow-400 transition-all duration-200" style={{ width: `${userProgress}%` }}></div>
          </div>
        </div>

        {/* Bot Lane */}
        <div className="relative border-b border-zinc-700 pb-2">
          <div 
             className="absolute -top-8 transition-all duration-200 text-3xl opacity-70"
             style={{ left: `calc(${botProgress}% - 30px)` }}
          >
            🚓 <span className="text-xs text-zinc-500 font-mono">BOT</span>
          </div>
          <div className="h-2 w-full bg-zinc-800 rounded overflow-hidden">
            <div className="h-full bg-red-500 transition-all duration-200" style={{ width: `${botProgress}%` }}></div>
          </div>
        </div>

      </div>

      {/* Typing Area */}
      <div className="relative font-mono text-xl md:text-2xl bg-zinc-800/50 p-6 rounded-lg backdrop-blur-sm border border-zinc-700">
        <div className="text-zinc-500 select-none pointer-events-none">
          {targetText}
        </div>
        <div className="absolute top-6 left-6 text-zinc-100 select-none pointer-events-none">
          {inputValue}
          <span className="inline-block w-2 h-5 bg-yellow-400 ml-1 animate-pulse align-middle"></span>
        </div>
        <input
          ref={inputRef}
          type="text"
          className="absolute inset-0 opacity-0 cursor-text w-full h-full"
          value={inputValue}
          onChange={handleInput}
          autoFocus
        />
      </div>
    </div>
  );
};

export default MiniGameRace;