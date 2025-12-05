import React, { useState, useEffect, useRef, useCallback } from 'react';
import { GameState, TypingResult, WordRainItem } from '../types';
import { generateTypingContent } from '../services/geminiService';

interface MiniGameRainProps {
  onFinish: (result: TypingResult) => void;
}

const SPAWN_RATE = 2000; // ms
const GAME_HEIGHT = 500;
const FALL_SPEED_MULTIPLIER = 1.5;

const MiniGameRain: React.FC<MiniGameRainProps> = ({ onFinish }) => {
  const [words, setWords] = useState<WordRainItem[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [gameState, setGameState] = useState<GameState>(GameState.LOADING);
  const [wordBank, setWordBank] = useState<string[]>([]);
  
  const requestRef = useRef<number>(0);
  const lastTimeRef = useRef<number | undefined>(undefined);
  const lastSpawnRef = useRef<number>(0);
  const inputRef = useRef<HTMLInputElement>(null);

  // Initialize Word Bank
  useEffect(() => {
    const init = async () => {
      const fetched = await generateTypingContent('words', 'easy');
      setWordBank(fetched);
      setGameState(GameState.PLAYING);
      if (inputRef.current) inputRef.current.focus();
    };
    init();
  }, []);

  // Game Loop
  const animate = useCallback((time: number) => {
    if (gameState !== GameState.PLAYING) return;

    if (lastTimeRef.current !== undefined) {
      // const deltaTime = time - lastTimeRef.current;
      
      // Spawn new words
      if (time - lastSpawnRef.current > SPAWN_RATE) {
        if (wordBank.length > 0) {
          const nextWord = wordBank[Math.floor(Math.random() * wordBank.length)];
          const newItem: WordRainItem = {
            id: Math.random().toString(36).substr(2, 9),
            text: nextWord,
            x: Math.random() * 80 + 10, // 10% to 90% width
            y: -30,
            speed: (Math.random() * 0.5) + 0.5 * FALL_SPEED_MULTIPLIER
          };
          setWords(prev => [...prev, newItem]);
          lastSpawnRef.current = time;
        }
      }

      // Move words
      setWords(prevWords => {
        const nextWords = prevWords.map(w => ({
          ...w,
          y: w.y + w.speed
        }));

        // Check collisions (bottom of screen)
        const missed = nextWords.filter(w => w.y > GAME_HEIGHT);
        if (missed.length > 0) {
          setLives(l => {
            const newLives = l - missed.length;
            if (newLives <= 0) {
               setGameState(GameState.FINISHED);
            }
            return newLives;
          });
          return nextWords.filter(w => w.y <= GAME_HEIGHT);
        }

        return nextWords;
      });
    }

    lastTimeRef.current = time;
    requestRef.current = requestAnimationFrame(animate);
  }, [gameState, wordBank]);

  useEffect(() => {
    requestRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(requestRef.current!);
  }, [animate]);

  // Finish Logic
  useEffect(() => {
    if (gameState === GameState.FINISHED) {
      onFinish({
        wpm: score, // Use score as metric
        rawWpm: score,
        accuracy: 100, 
        correctChars: score * 5,
        incorrectChars: 0,
        missedChars: 0,
        timeElapsed: 0,
        accuracyLabel: `Score: ${score}`
      } as any);
    }
  }, [gameState, onFinish, score]);


  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.trim();
    setInputValue(val);

    // Check matches
    const matchedWordIndex = words.findIndex(w => w.text === val);
    
    if (matchedWordIndex !== -1) {
      // Hit!
      setScore(s => s + 1);
      setInputValue('');
      setWords(prev => prev.filter((_, idx) => idx !== matchedWordIndex));
      
      // Visual flair could go here
    }
  };

  if (gameState === GameState.LOADING) return <div className="text-yellow-400 text-center mt-20 font-mono">Loading Weather...</div>;

  return (
    <div className="w-full max-w-4xl mx-auto mt-4 p-4">
      <div className="flex justify-between items-center mb-4 font-mono text-xl">
        <div className="text-yellow-400">Score: {score}</div>
        <div className="text-red-400">Lives: {'♥'.repeat(Math.max(0, lives))}</div>
      </div>

      <div 
        className="relative bg-zinc-800/30 border-2 border-zinc-700 rounded-lg overflow-hidden backdrop-blur-sm cursor-text"
        style={{ height: GAME_HEIGHT }}
        onClick={() => inputRef.current?.focus()}
      >
        {words.map(word => (
            <div 
                key={word.id}
                className="absolute text-zinc-200 font-mono text-lg font-bold px-2 py-1 bg-zinc-900/80 rounded shadow-lg border border-zinc-600 transition-transform"
                style={{ 
                    top: word.y, 
                    left: `${word.x}%`,
                    transform: 'translateX(-50%)',
                    color: inputValue && word.text.startsWith(inputValue) ? '#e2b714' : undefined 
                }}
            >
                {word.text}
            </div>
        ))}
      </div>

      <div className="mt-4 flex justify-center">
        <input 
            ref={inputRef}
            type="text" 
            value={inputValue}
            onChange={handleInput}
            className="bg-zinc-800 text-yellow-400 font-mono text-xl px-4 py-2 rounded border border-zinc-600 focus:outline-none focus:border-yellow-400 w-64 text-center placeholder-zinc-600"
            placeholder="Type falling words..."
            autoFocus
        />
      </div>
    </div>
  );
};

export default MiniGameRain;