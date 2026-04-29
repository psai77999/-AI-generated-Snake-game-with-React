import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play, RotateCcw, Pause } from 'lucide-react';
import { Point, Direction } from '../types';

const GRID_SIZE = 20;
const INITIAL_SNAKE: Point[] = [
  { x: 10, y: 10 },
  { x: 10, y: 11 },
  { x: 10, y: 12 },
];
const INITIAL_DIRECTION: Direction = 'UP';

interface SnakeGameProps {
  onScoreChange: (score: number) => void;
}

export const SnakeGame: React.FC<SnakeGameProps> = ({ onScoreChange }) => {
  const [snake, setSnake] = useState<Point[]>(INITIAL_SNAKE);
  const [direction, setDirection] = useState<Direction>(INITIAL_DIRECTION);
  const [food, setFood] = useState<Point>({ x: 5, y: 5 });
  const [isGameOver, setIsGameOver] = useState(false);
  const [isPaused, setIsPaused] = useState(true);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  
  const gameRef = useRef<HTMLDivElement>(null);
  const boardSize = 400; // 400x400 board

  const generateFood = useCallback((currentSnake: Point[]) => {
    let newFood: Point;
    while (true) {
      newFood = {
        x: Math.floor(Math.random() * (boardSize / GRID_SIZE)),
        y: Math.floor(Math.random() * (boardSize / GRID_SIZE)),
      };
      // Check if food is on snake body
      const onSnake = currentSnake.some(segment => segment.x === newFood.x && segment.y === newFood.y);
      if (!onSnake) break;
    }
    return newFood;
  }, []);

  const resetGame = () => {
    const freshSnake = INITIAL_SNAKE;
    setSnake(freshSnake);
    setDirection(INITIAL_DIRECTION);
    setFood(generateFood(freshSnake));
    setIsGameOver(false);
    setIsPaused(false);
    setScore(0);
  };

  const moveSnake = useCallback(() => {
    if (isGameOver || isPaused) return;

    setSnake(prevSnake => {
      const head = prevSnake[0];
      const newHead = { ...head };

      switch (direction) {
        case 'UP': newHead.y -= 1; break;
        case 'DOWN': newHead.y += 1; break;
        case 'LEFT': newHead.x -= 1; break;
        case 'RIGHT': newHead.x += 1; break;
      }

      // Border collision
      if (
        newHead.x < 0 || 
        newHead.x >= boardSize / GRID_SIZE || 
        newHead.y < 0 || 
        newHead.y >= boardSize / GRID_SIZE
      ) {
        setIsGameOver(true);
        return prevSnake;
      }

      // Self collision
      if (prevSnake.some(segment => segment.x === newHead.x && segment.y === newHead.y)) {
        setIsGameOver(true);
        return prevSnake;
      }

      const newSnake = [newHead, ...prevSnake];

      // Food collision
      if (newHead.x === food.x && newHead.y === food.y) {
        setScore(s => s + 10);
        setFood(generateFood(newSnake));
      } else {
        newSnake.pop();
      }

      return newSnake;
    });
  }, [direction, food, isGameOver, isPaused, generateFood]);

  useEffect(() => {
    onScoreChange(score);
    if (score > highScore) {
      setHighScore(score);
    }
  }, [score, onScoreChange, highScore]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp': if (direction !== 'DOWN') setDirection('UP'); break;
        case 'ArrowDown': if (direction !== 'UP') setDirection('DOWN'); break;
        case 'ArrowLeft': if (direction !== 'RIGHT') setDirection('LEFT'); break;
        case 'ArrowRight': if (direction !== 'LEFT') setDirection('RIGHT'); break;
        case ' ': // Space to pause/play
          if (isGameOver) resetGame();
          else setIsPaused(p => !p);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [direction, isGameOver]);

  useEffect(() => {
    const interval = setInterval(moveSnake, 150);
    return () => clearInterval(interval);
  }, [moveSnake]);

  return (
    <div className="flex flex-col items-center gap-6" id="snake-game-container">
      <div 
        ref={gameRef}
        className="relative border-4 border-cyan-500/50 bg-slate-950 rounded-xl overflow-hidden shadow-[0_0_20px_rgba(6,182,212,0.3)]"
        style={{ width: boardSize, height: boardSize }}
      >
        {/* Render Snake */}
        {snake.map((segment, i) => (
          <motion.div
            key={`${i}-${segment.x}-${segment.y}`}
            className={`absolute rounded-sm ${i === 0 ? 'bg-cyan-400 z-10' : 'bg-cyan-600/80'}`}
            style={{
              width: GRID_SIZE - 2,
              height: GRID_SIZE - 2,
              left: segment.x * GRID_SIZE + 1,
              top: segment.y * GRID_SIZE + 1,
              boxShadow: i === 0 ? '0 0 10px #22d3ee' : 'none'
            }}
            initial={false}
            animate={{ left: segment.x * GRID_SIZE + 1, top: segment.y * GRID_SIZE + 1 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          />
        ))}

        {/* Render Food */}
        <motion.div
          className="absolute bg-pink-500 rounded-full"
          style={{
            width: GRID_SIZE - 4,
            height: GRID_SIZE - 4,
            left: food.x * GRID_SIZE + 2,
            top: food.y * GRID_SIZE + 2,
            boxShadow: '0 0 15px #ec4899'
          }}
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ repeat: Infinity, duration: 1 }}
        />

        {/* Overlays */}
        <AnimatePresence>
          {isGameOver && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm flex flex-col items-center justify-center z-20"
            >
              <h2 className="text-4xl font-bold text-pink-500 mb-2 tracking-tighter">GAME OVER</h2>
              <p className="text-cyan-400 mb-6 font-mono">Final Score: {score}</p>
              <button 
                onClick={resetGame}
                className="flex items-center gap-2 px-6 py-3 bg-cyan-600 hover:bg-cyan-500 text-white rounded-full transition-all hover:scale-105 active:scale-95 shadow-lg shadow-cyan-900/40"
              >
                <RotateCcw size={20} />
                Try Again
              </button>
            </motion.div>
          )}

          {isPaused && !isGameOver && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/40 backdrop-blur-[2px] flex flex-col items-center justify-center z-20"
            >
              <button 
                onClick={() => setIsPaused(false)}
                className="w-16 h-16 flex items-center justify-center bg-cyan-500 rounded-full text-white shadow-xl shadow-cyan-500/20 hover:scale-110 transition-transform"
              >
                <Play size={32} fill="currentColor" />
              </button>
              <p className="mt-4 text-cyan-300 font-medium tracking-widest text-xs uppercase">Paused</p>
              <p className="mt-2 text-slate-400 text-[10px] animate-pulse">Press SPACE to resume</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="flex gap-12 text-center" id="game-stats">
        <div>
          <p className="text-slate-500 text-xs uppercase tracking-tighter font-bold">Score</p>
          <p className="text-3xl font-mono text-cyan-400">{score}</p>
        </div>
        <div>
          <p className="text-slate-500 text-xs uppercase tracking-tighter font-bold">High Score</p>
          <p className="text-3xl font-mono text-pink-500">{highScore}</p>
        </div>
      </div>
    </div>
  );
};
