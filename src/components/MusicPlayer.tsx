import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play, Pause, SkipForward, SkipBack, Volume2, Music2 } from 'lucide-react';
import { Track } from '../types';

interface MusicPlayerProps {
  tracks: Track[];
}

export const MusicPlayer: React.FC<MusicPlayerProps> = ({ tracks }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.5);
  
  const currentTrack = tracks[currentIndex];
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(e => console.log("Playback blocked:", e));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentIndex]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  const onTimeUpdate = () => {
    if (audioRef.current) {
      const p = (audioRef.current.currentTime / audioRef.current.duration) * 100;
      setProgress(p || 0);
    }
  };

  const onLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const handleTogglePlay = () => setIsPlaying(!isPlaying);
  
  const handleNext = () => {
    setCurrentIndex(prev => (prev + 1) % tracks.length);
    setProgress(0);
  };

  const handlePrev = () => {
    setCurrentIndex(prev => (prev - 1 + tracks.length) % tracks.length);
    setProgress(0);
  };

  const formatTime = (time: number) => {
    const mins = Math.floor(time / 60);
    const secs = Math.floor(time % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="bg-slate-900/40 backdrop-blur-2xl border border-white/5 rounded-3xl p-6 w-full max-w-sm shadow-[0_20px_50px_rgba(0,0,0,0.5)] relative overflow-hidden" id="music-player">
      <audio 
        ref={audioRef}
        src={currentTrack.audioUrl}
        onTimeUpdate={onTimeUpdate}
        onLoadedMetadata={onLoadedMetadata}
        onEnded={handleNext}
      />

      <div className="relative aspect-square mb-6 group perspective-1000">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentTrack.id}
            className="w-full h-full"
            initial={{ opacity: 0, scale: 0.8, rotateY: -20 }}
            animate={{ opacity: 1, scale: 1, rotateY: 0 }}
            exit={{ opacity: 0, scale: 1.1, rotateY: 20 }}
            transition={{ type: "spring", damping: 20, stiffness: 100 }}
          >
            <img
              src={currentTrack.coverUrl}
              alt={currentTrack.title}
              className="w-full h-full object-cover rounded-2xl shadow-2xl transition-transform duration-500 group-hover:scale-105"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 rounded-2xl ring-1 ring-white/10 inset-shadow-sm" />
          </motion.div>
        </AnimatePresence>
        
        {/* Cinematic Visualizer Overlay */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          {isPlaying && (
            <div className="flex gap-[2px] h-12">
              {[...Array(16)].map((_, i) => (
                <motion.div
                  key={i}
                  className="w-0.5 bg-cyan-400/60 rounded-full"
                  animate={{ 
                    height: [12, Math.random() * 40 + 10, 12],
                    opacity: [0.3, 0.8, 0.3]
                  }}
                  transition={{ repeat: Infinity, duration: 0.4 + (i * 0.05), ease: "easeInOut" }}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="mb-6">
        <h3 className="text-2xl font-black text-white tracking-tighter truncate leading-tight">{currentTrack.title}</h3>
        <div className="flex items-center gap-2">
          <span className="w-1 h-1 bg-cyan-500 rounded-full animate-pulse" />
          <p className="text-cyan-400/80 text-xs font-bold uppercase tracking-widest">{currentTrack.artist}</p>
        </div>
      </div>

      <div className="space-y-6">
        {/* Progress Section */}
        <div className="space-y-3">
          <div className="relative h-1.5 w-full bg-white/5 rounded-full overflow-hidden cursor-pointer group/bar" 
               onClick={(e) => {
                 const rect = e.currentTarget.getBoundingClientRect();
                 const x = e.clientX - rect.left;
                 const clickedProgress = x / rect.width;
                 if (audioRef.current) audioRef.current.currentTime = clickedProgress * duration;
               }}>
            <motion.div 
              className="absolute top-0 left-0 h-full bg-gradient-to-r from-cyan-600 to-cyan-400 group-hover/bar:from-cyan-400 group-hover/bar:to-white transition-colors" 
              initial={false}
              animate={{ width: `${progress}%` }}
              transition={{ type: 'tween', ease: 'linear' }}
            />
          </div>
          <div className="flex justify-between text-[10px] font-mono font-bold text-slate-500 tracking-tighter">
            <span className="text-cyan-400/60">{formatTime(audioRef.current?.currentTime || 0)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center justify-between px-2">
          <div className="flex items-center gap-3 group/vol">
            <Volume2 size={16} className="text-slate-500 group-hover/vol:text-white transition-colors" />
            <input 
              type="range" 
              min="0" 
              max="1" 
              step="0.01" 
              value={volume}
              onChange={(e) => setVolume(parseFloat(e.target.value))}
              className="w-16 h-1 bg-white/5 rounded-full appearance-none cursor-pointer accent-cyan-500"
            />
          </div>
          
          <div className="flex items-center gap-6">
            <button 
              onClick={handlePrev}
              className="text-white/40 hover:text-white transition-all transform hover:-translate-x-1 active:scale-90"
            >
              <SkipBack size={24} fill="currentColor" />
            </button>
            <button 
              onClick={handleTogglePlay}
              className="w-14 h-14 flex items-center justify-center bg-white text-black rounded-full hover:scale-110 active:scale-95 transition-all shadow-[0_0_30px_rgba(255,255,255,0.2)]"
            >
              {isPlaying ? <Pause size={28} fill="currentColor" /> : <Play size={28} className="ml-1" fill="currentColor" />}
            </button>
            <button 
              onClick={handleNext}
              className="text-white/40 hover:text-white transition-all transform hover:translate-x-1 active:scale-90"
            >
              <SkipForward size={24} fill="currentColor" />
            </button>
          </div>

          <button className="text-slate-500 hover:text-cyan-400 transition-colors">
            <Music2 size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};
