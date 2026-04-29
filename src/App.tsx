/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { MusicPlayer } from './components/MusicPlayer';
import { SnakeGame } from './components/SnakeGame';
import { Track } from './types';
import { Star, Zap, Disc } from 'lucide-react';

const DUMMY_TRACKS: Track[] = [
  {
    id: '1',
    title: 'Neon Skyline',
    artist: 'Cyber Runner',
    coverUrl: 'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?q=80&w=400&h=400&auto=format&fit=crop',
    audioUrl: 'https://cdn.pixabay.com/audio/2022/10/14/audio_34979e2646.mp3', // Synthwave theme
  },
  {
    id: '2',
    title: 'Synth Pulse',
    artist: 'Digital Dreamer',
    coverUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=400&h=400&auto=format&fit=crop',
    audioUrl: 'https://cdn.pixabay.com/audio/2023/10/05/audio_db801b7a2d.mp3', // Retro theme
  },
  {
    id: '3',
    title: 'Electric Midnight',
    artist: 'Void Walker',
    coverUrl: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=400&h=400&auto=format&fit=crop',
    audioUrl: 'https://cdn.pixabay.com/audio/2024/02/07/audio_b20ad84a36.mp3', // Techno theme
  },
];

export default function App() {
  const [currentScore, setCurrentScore] = useState(0);

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 font-sans selection:bg-cyan-500/30 overflow-hidden relative">
      {/* Cinematic Overlays */}
      <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
        {/* Scanlines Effect */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%),linear-gradient(90deg,rgba(255,0,0,0.03),rgba(0,255,0,0.01),rgba(0,0,255,0.03))] bg-[length:100%_2px,3px_100%] pointer-events-none" />
        
        {/* Noise/Grain */}
        <div className="absolute inset-0 opacity-[0.03] mix-blend-overlay pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
      </div>

      {/* Background Animated Particles */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-cyan-900/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-pink-900/5 blur-[120px] rounded-full" />
        
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-cyan-500/5 blur-xl"
            style={{
              width: Math.random() * 300 + 100,
              height: Math.random() * 300 + 100,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              x: [0, Math.random() * 100 - 50, 0],
              y: [0, Math.random() * 100 - 50, 0],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: Math.random() * 10 + 10,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      {/* Navigation / Header */}
      <nav className="relative z-10 border-b border-white/5 bg-black/20 backdrop-blur-sm px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-cyan-400 to-cyan-600 rounded-lg shadow-lg shadow-cyan-500/20">
            <Disc className="text-black animate-spin-slow" size={20} />
          </div>
          <div>
            <h1 className="text-xl font-black tracking-tighter text-white uppercase italic">Neon Beats</h1>
            <p className="text-[10px] text-cyan-400 uppercase tracking-[0.2em] font-bold leading-none">Slither Edition</p>
          </div>
        </div>
        
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 px-4 py-1.5 bg-white/5 rounded-full border border-white/10">
            <Zap size={14} className="text-cyan-400 fill-cyan-400" />
            <span className="text-xs font-mono font-bold tracking-tight">{currentScore} PTS</span>
          </div>
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-cyan-500 to-pink-500 p-[1px]">
            <div className="w-full h-full rounded-full bg-[#020617] flex items-center justify-center">
              <Star size={14} className="text-white" />
            </div>
          </div>
        </div>
      </nav>

      <main className="relative z-10 container mx-auto px-6 py-12 lg:py-20 flex flex-col lg:flex-row items-center lg:items-start justify-center gap-12 lg:gap-24">
        {/* Left Side: Music Player */}
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="w-full max-w-sm"
        >
          <div className="mb-4">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-[0.3em] mb-1">Now Playing</p>
            <div className="h-0.5 w-12 bg-cyan-500" />
          </div>
          <MusicPlayer tracks={DUMMY_TRACKS} />
        </motion.div>

        {/* Center/Right: Snake Game */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          className="flex-1 flex flex-col items-center"
        >
           <div className="mb-4 text-center">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-[0.3em] mb-1">Slither Core</p>
            <div className="h-0.5 w-32 bg-pink-500 mx-auto" />
          </div>
          <SnakeGame onScoreChange={setCurrentScore} />
          
          <div className="mt-12 text-slate-500 text-[10px] uppercase tracking-widest flex items-center gap-4">
            <span className="flex items-center gap-1"><kbd className="px-1.5 py-0.5 bg-white/5 border border-white/10 rounded uppercase font-sans">Arrows</kbd> to move</span>
            <span className="w-1 h-1 bg-slate-700 rounded-full" />
            <span className="flex items-center gap-1"><kbd className="px-1.5 py-0.5 bg-white/5 border border-white/10 rounded uppercase font-sans">Space</kbd> to pause</span>
          </div>
        </motion.div>
      </main>

      {/* Footer / Decorative */}
      <footer className="fixed bottom-0 left-0 right-0 p-8 flex justify-between items-end pointer-events-none opacity-20">
        <div className="text-[120px] font-black text-white/5 leading-none select-none">01</div>
        <div className="space-y-4">
          <div className="w-48 h-px bg-gradient-to-r from-transparent to-white/20" />
          <div className="w-32 h-px bg-gradient-to-r from-transparent to-white/20 ml-auto" />
        </div>
      </footer>
    </div>
  );
}

