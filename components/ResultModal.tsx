import React from 'react';
import { TypingResult } from '../types';

interface ResultModalProps {
  result: TypingResult;
  onRestart: () => void;
}

const ResultModal: React.FC<ResultModalProps> = ({ result, onRestart }) => {
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-md flex justify-center items-center z-50 p-4">
      <div className="bg-zinc-900 border border-zinc-700 p-8 rounded-2xl shadow-2xl max-w-lg w-full transform transition-all scale-100">
        <h2 className="text-3xl font-bold text-zinc-100 mb-2 font-mono text-center">
          { (result as any).accuracyLabel ? (result as any).accuracyLabel : 'Result' }
        </h2>
        
        <div className="grid grid-cols-2 gap-4 my-8">
            <div className="flex flex-col items-center p-4 bg-zinc-800/50 rounded-xl">
                <span className="text-zinc-500 text-sm font-medium uppercase tracking-wider">WPM</span>
                <span className="text-5xl font-mono text-yellow-400 font-bold">{result.wpm}</span>
            </div>
            <div className="flex flex-col items-center p-4 bg-zinc-800/50 rounded-xl">
                <span className="text-zinc-500 text-sm font-medium uppercase tracking-wider">Acc</span>
                <span className="text-5xl font-mono text-yellow-400 font-bold">{result.accuracy}%</span>
            </div>
            <div className="flex flex-col items-center p-4 bg-zinc-800/50 rounded-xl">
                <span className="text-zinc-500 text-sm font-medium uppercase tracking-wider">Raw</span>
                <span className="text-2xl font-mono text-zinc-300">{result.rawWpm}</span>
            </div>
            <div className="flex flex-col items-center p-4 bg-zinc-800/50 rounded-xl">
                <span className="text-zinc-500 text-sm font-medium uppercase tracking-wider">Chars</span>
                <span className="text-2xl font-mono text-zinc-300">
                    {result.correctChars}/<span className="text-red-400">{result.incorrectChars}</span>
                </span>
            </div>
        </div>

        <button 
            onClick={onRestart}
            className="w-full bg-zinc-100 hover:bg-white text-zinc-900 font-bold py-3 rounded-xl transition-colors font-mono"
        >
            Restart Game
        </button>
      </div>
    </div>
  );
};

export default ResultModal;