import React, { useState, useEffect, useRef, useCallback } from 'react';
import { GameState, TypingResult } from '../types';
import { generateTypingContent } from '../services/geminiService';

interface TypingTestProps {
  onFinish: (result: TypingResult) => void;
  gameMode: 'ZEN' | 'TIME';
}

const TIME_LIMIT = 30; // seconds for time mode

const TypingTest: React.FC<TypingTestProps> = ({ onFinish, gameMode }) => {
  const [words, setWords] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [currWordIndex, setCurrWordIndex] = useState(0);
  const [currCharIndex, setCurrCharIndex] = useState(0); // within the current word
  const [gameState, setGameState] = useState<GameState>(GameState.LOADING);
  const [timeLeft, setTimeLeft] = useState(TIME_LIMIT);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [stats, setStats] = useState({ correct: 0, incorrect: 0, extra: 0 });
  
  const inputRef = useRef<HTMLInputElement>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize game
  useEffect(() => {
    const init = async () => {
      try {
        setGameState(GameState.LOADING);
        const generated = await generateTypingContent('words', 'easy');
        if (generated && generated.length > 0) {
          setWords(generated);
          setGameState(GameState.IDLE);
          if (inputRef.current) inputRef.current.focus();
        } else {
          console.error('No words generated');
          setGameState(GameState.IDLE);
        }
      } catch (error) {
        console.error('Error initializing game:', error);
        setGameState(GameState.IDLE);
      }
    };
    init();
    return () => clearInterval(timerRef.current as NodeJS.Timeout);
  }, [gameMode]);

  // Focus keeper
  useEffect(() => {
    const handleClick = () => {
      if (gameState !== GameState.FINISHED && inputRef.current) {
        inputRef.current.focus();
      }
    };
    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, [gameState]);

  // Timer logic
  useEffect(() => {
    if (gameState === GameState.PLAYING && gameMode === 'TIME') {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            finishGame();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timerRef.current as NodeJS.Timeout);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gameState, gameMode]);

  const finishGame = useCallback(() => {
    setGameState(GameState.FINISHED);
    clearInterval(timerRef.current as NodeJS.Timeout);
    
    const endTime = Date.now();
    const durationInMinutes = gameMode === 'TIME' 
      ? (TIME_LIMIT - timeLeft) / 60 
      : ((endTime - (startTime || endTime)) / 1000) / 60;

    // Standard WPM calculation: (all typed characters / 5) / time in minutes
    // accuracy = correct chars / total typed chars
    const totalTyped = stats.correct + stats.incorrect;
    const grossWpm = (totalTyped / 5) / (durationInMinutes || 0.01); // avoid infinity
    const netWpm = (stats.correct / 5) / (durationInMinutes || 0.01);
    const accuracy = totalTyped > 0 ? (stats.correct / totalTyped) * 100 : 0;

    onFinish({
      wpm: Math.max(0, Math.round(netWpm)),
      rawWpm: Math.max(0, Math.round(grossWpm)),
      accuracy: Math.round(accuracy),
      correctChars: stats.correct,
      incorrectChars: stats.incorrect,
      missedChars: 0,
      timeElapsed: Math.round(durationInMinutes * 60)
    });
  }, [gameMode, timeLeft, startTime, stats, onFinish]);


  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (gameState === GameState.FINISHED || gameState === GameState.LOADING) return;

    // Start game on first keypress
    if (gameState === GameState.IDLE) {
      setGameState(GameState.PLAYING);
      setStartTime(Date.now());
    }
  };

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (gameState === GameState.FINISHED || gameState === GameState.LOADING) return;
    
    const val = e.target.value;
    
    // Check for space (word completion)
    if (val.endsWith(' ')) {
      const trimmedVal = val.trim();
      const currentWord = words[currWordIndex];
      
      // Update stats for the completed word
      let wordCorrectChars = 0;
      let wordIncorrectChars = 0;

      for (let i = 0; i < currentWord.length; i++) {
        if (trimmedVal[i] === currentWord[i]) {
          wordCorrectChars++;
        } else {
          wordIncorrectChars++;
        }
      }
      // If user typed more than the word length
      if (trimmedVal.length > currentWord.length) {
          wordIncorrectChars += (trimmedVal.length - currentWord.length);
      }
      // If user typed less
      if (trimmedVal.length < currentWord.length) {
          wordIncorrectChars += (currentWord.length - trimmedVal.length);
      }

      setStats(prev => ({
        ...prev,
        correct: prev.correct + wordCorrectChars,
        incorrect: prev.incorrect + wordIncorrectChars
      }));

      // Move to next word
      setCurrWordIndex(prev => prev + 1);
      setInputValue('');
      setCurrCharIndex(0);

      // End game if out of words in Zen mode
      if (currWordIndex >= words.length - 1 && gameMode === 'ZEN') {
        finishGame();
      }
    } else {
      setInputValue(val);
      setCurrCharIndex(val.length);
    }
  };

  // Check character status for rendering
  const getCharClass = (wordIdx: number, charIdx: number, char: string) => {
    // Current active word
    if (wordIdx === currWordIndex) {
      if (charIdx === currCharIndex) return 'text-yellow-400 bg-yellow-400/20 rounded-sm'; // Cursor position (approx)
      if (charIdx < inputValue.length) {
        return inputValue[charIdx] === char ? 'text-zinc-100' : 'text-red-400';
      }
      return 'text-zinc-500';
    }
    // Past words
    if (wordIdx < currWordIndex) {
      // For simplicity in this view, we don't store individual char correctness history for past words to save state complexity
      // We just gray them out, or we could mark them green if we tracked history perfectly. 
      // Minimalist approach: just dim them.
      return 'text-zinc-600 opacity-50';
    }
    // Future words
    return 'text-zinc-600';
  };

  if (gameState === GameState.LOADING) {
    return <div className="flex justify-center items-center h-64 text-yellow-400 animate-pulse font-mono">Loading words...</div>;
  }

  return (
    <div className="w-full max-w-4xl mx-auto mt-10 p-4 relative">
      {/* Hidden Input */}
      <input
        ref={inputRef}
        type="text"
        className="opacity-0 absolute top-0 left-0 cursor-default"
        value={inputValue}
        onChange={handleInput}
        onKeyDown={handleKeyDown}
        autoFocus
        autoComplete="off"
      />

      {/* Info Bar */}
      <div className="flex justify-between items-center mb-8 font-mono text-xl text-yellow-400">
        <div>{gameMode === 'TIME' ? `Time: ${timeLeft}s` : `Word: ${currWordIndex + 1}/${words.length}`}</div>
        {gameState === GameState.IDLE && <div className="animate-pulse text-zinc-400 text-sm">Type to start...</div>}
      </div>

      {/* Text Display Area */}
      <div 
        className="font-mono text-2xl md:text-3xl leading-relaxed break-words outline-none min-h-[200px]"
        onClick={() => inputRef.current?.focus()}
      >
        {words.map((word, wIdx) => {
          // Only show a window of words to keep it clean (e.g. current line and next few lines)
          // Simple implementation: show all but fade out passed ones
          if (wIdx < currWordIndex - 10) return null; 

          return (
            <span key={wIdx} className="inline-block mr-4 mb-2 relative">
              {word.split('').map((char, cIdx) => (
                <span key={cIdx} className={`relative ${getCharClass(wIdx, cIdx, char)}`}>
                  {/* Cursor Indicator Logic */}
                  {wIdx === currWordIndex && cIdx === currCharIndex && (
                     <span className="absolute left-0 -bottom-1 w-full h-[2px] bg-yellow-400 animate-pulse"></span>
                  )}
                  {char}
                </span>
              ))}
              {/* Handle extra characters typed erroneously */}
              {wIdx === currWordIndex && inputValue.length > word.length && (
                 <span className="text-red-800 opacity-70">
                   {inputValue.slice(word.length)}
                 </span>
              )}
            </span>
          );
        })}
      </div>

      {/* Restart Hint */}
      <div className="mt-12 text-center">
         <button 
            onClick={() => window.location.reload()} 
            className="text-zinc-600 hover:text-zinc-300 transition-colors text-sm font-mono"
         >
           [Tab] + [Enter] to Restart
         </button>
      </div>
    </div>
  );
};

export default TypingTest;