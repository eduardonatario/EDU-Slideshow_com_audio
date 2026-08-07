import React, { useState, useEffect, useRef } from 'react';
import { SlideshowConfig, SlideSize } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import {
  Play,
  Pause,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  Lock,
  Unlock,
  Volume2,
  VolumeX,
  AlertTriangle,
  Sparkles,
  CheckCircle2,
  FastForward,
  Maximize2
} from 'lucide-react';

interface SlideshowPlayerProps {
  config: SlideshowConfig;
  onEditConfig?: () => void;
  isEmbedView?: boolean;
}

export const SlideshowPlayer: React.FC<SlideshowPlayerProps> = ({
  config,
  onEditConfig,
  isEmbedView = false
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [completedSlideIds, setCompletedSlideIds] = useState<Set<string>>(new Set());
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [hasAudioError, setHasAudioError] = useState(false);
  const [showSpeedMenu, setShowSpeedMenu] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const currentSlide = config.slides[currentIndex] || config.slides[0];

  const sizeClasses: Record<SlideSize, string> = {
    small: 'max-w-lg',
    medium: 'max-w-3xl',
    large: 'max-w-6xl'
  };

  const isCurrentSlideCompleted = currentSlide ? completedSlideIds.has(currentSlide.id) : false;
  const isLastSlide = currentIndex === config.slides.length - 1;

  // Load and play audio when slide changes
  useEffect(() => {
    if (!currentSlide) return;

    setHasAudioError(false);
    setCurrentTime(0);
    setDuration(0);

    const audio = audioRef.current;
    if (!audio) return;

    audio.src = currentSlide.audioUrl || '';
    audio.load();
    audio.playbackRate = playbackRate;

    const playPromise = audio.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          setIsPlaying(true);
        })
        .catch((err) => {
          // Autoplay blocked by browser or link invalid
          setIsPlaying(false);
          console.warn('Audio play restricted or link error:', err);
        });
    }
  }, [currentIndex, currentSlide, config.slides]);

  // Audio Event Handlers
  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
      setDuration(audioRef.current.duration || 0);
    }
  };

  const handleAudioEnded = () => {
    setIsPlaying(false);
    if (currentSlide) {
      setCompletedSlideIds((prev) => new Set(prev).add(currentSlide.id));
    }

    if (config.autoAdvance && !isLastSlide) {
      setTimeout(() => {
        handleNextSlide();
      }, 600);
    }
  };

  const handleAudioError = () => {
    setHasAudioError(true);
    setIsPlaying(false);
  };

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio
        .play()
        .then(() => {
          setIsPlaying(true);
          setHasAudioError(false);
        })
        .catch(() => {
          setHasAudioError(true);
        });
    }
  };

  const handleRestartAudio = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  const handleNextSlide = () => {
    if (isCurrentSlideCompleted && !isLastSlide) {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const handlePrevSlide = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const handleForceUnlock = () => {
    if (currentSlide) {
      setCompletedSlideIds((prev) => new Set(prev).add(currentSlide.id));
      setHasAudioError(false);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = parseFloat(e.target.value);
    setCurrentTime(newTime);
    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVol = parseFloat(e.target.value);
    setVolume(newVol);
    setIsMuted(newVol === 0);
    if (audioRef.current) {
      audioRef.current.volume = newVol;
      audioRef.current.muted = newVol === 0;
    }
  };

  const toggleMute = () => {
    if (audioRef.current) {
      const newMuteState = !isMuted;
      setIsMuted(newMuteState);
      audioRef.current.muted = newMuteState;
    }
  };

  const handleSpeedChange = (speed: number) => {
    setPlaybackRate(speed);
    setShowSpeedMenu(false);
    if (audioRef.current) {
      audioRef.current.playbackRate = speed;
    }
  };

  const formatTime = (secs: number) => {
    if (!secs || isNaN(secs)) return '0:00';
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' && isCurrentSlideCompleted && !isLastSlide) {
        handleNextSlide();
      } else if (e.key === 'ArrowLeft' && currentIndex > 0) {
        handlePrevSlide();
      } else if (e.key === ' ') {
        e.preventDefault();
        togglePlay();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, isCurrentSlideCompleted, isLastSlide, isPlaying]);

  if (!config.slides || config.slides.length === 0) {
    return (
      <div className="p-12 text-center text-slate-400 bg-slate-900 rounded-2xl border border-slate-800 my-8 max-w-xl mx-auto">
        <AlertTriangle className="w-10 h-10 mx-auto mb-3 text-amber-400" />
        <h3 className="text-lg font-semibold text-slate-200">Nenhum slide configurado</h3>
        <p className="text-sm mt-1 mb-4">Adicione pelo menos 1 slide com imagem e áudio para visualizar.</p>
        {onEditConfig && (
          <button
            onClick={onEditConfig}
            className="px-4 py-2 bg-blue-600 text-white font-medium rounded-lg text-xs"
          >
            Ir para Configuração
          </button>
        )}
      </div>
    );
  }

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className={`w-full mx-auto ${sizeClasses[config.size]} transition-all duration-300 py-4`}>
      <audio
        ref={audioRef}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleAudioEnded}
        onError={handleAudioError}
        preload="auto"
      />

      {/* Main White Slideshow Container */}
      <div className="bg-white border border-slate-200 rounded-3xl p-4 sm:p-6 shadow-xl relative overflow-hidden">
        {/* Media Container Viewport */}
        <div className={`relative w-full aspect-video ${config.flashTransition !== false ? 'bg-slate-100' : 'bg-slate-950'} rounded-2xl overflow-hidden flex items-center justify-center border border-slate-200/80 shadow-inner group`}>
          {config.flashTransition !== false && (
            <motion.div
              key={`flash-${currentIndex}-${currentSlide.id}`}
              initial={{ opacity: 1 }}
              animate={{ opacity: 0 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              className="absolute inset-0 bg-white z-30 pointer-events-none"
            />
          )}
          <AnimatePresence mode="wait">
            <motion.img
              key={currentSlide.id}
              src={currentSlide.imageUrl}
              alt={currentSlide.title || `Slide ${currentIndex + 1}`}
              className="w-full h-full object-cover"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              onError={(e) => {
                (e.target as HTMLImageElement).src =
                  'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80';
              }}
            />
          </AnimatePresence>

          {/* Left Arrow Button (Previous Slide) - Only appears when autoAdvance is false and after audio completes */}
          {!config.autoAdvance && isCurrentSlideCompleted && currentIndex > 0 && (
            <button
              onClick={handlePrevSlide}
              className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-white/90 hover:bg-white text-slate-900 shadow-xl border border-slate-200 flex items-center justify-center transition-all active:scale-95 hover:scale-105"
              title="Slide Anterior"
              aria-label="Slide Anterior"
            >
              <ChevronLeft className="w-6 h-6 stroke-[2.5]" />
            </button>
          )}

          {/* Right Arrow Button (Next Slide) - Only appears when autoAdvance is false and after audio completes */}
          {!config.autoAdvance && isCurrentSlideCompleted && !isLastSlide && (
            <button
              onClick={handleNextSlide}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-white hover:bg-slate-100 text-slate-900 shadow-xl border border-slate-200 flex items-center justify-center transition-all active:scale-95 hover:scale-105"
              title="Próximo Slide"
              aria-label="Próximo Slide"
            >
              <ChevronRight className="w-6 h-6 stroke-[2.5]" />
            </button>
          )}

          {/* Overlay Captions / Titles */}
          {config.showCaptions && (currentSlide.title || currentSlide.caption) && (
            <motion.div
              key={`caption-${currentSlide.id}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-4 sm:p-6 text-white pointer-events-none z-10"
            >
              {currentSlide.title && (
                <h2 className="text-sm sm:text-base font-bold tracking-tight text-white drop-shadow-sm mb-0.5">
                  {currentSlide.title}
                </h2>
              )}
              {currentSlide.caption && (
                <p className="text-xs text-slate-200 line-clamp-2 drop-shadow-sm font-medium">
                  {currentSlide.caption}
                </p>
              )}
            </motion.div>
          )}

          {/* Central Play Button Overlay (No text, only center play button) */}
          {(hasAudioError || (!isPlaying && !isCurrentSlideCompleted)) && (
            <div className="absolute inset-0 bg-black/30 backdrop-blur-[2px] flex items-center justify-center z-10 transition-all">
              <button
                onClick={togglePlay}
                className="w-16 h-16 rounded-full bg-white text-slate-900 flex items-center justify-center shadow-2xl hover:scale-110 active:scale-95 transition-all"
                title="Iniciar Áudio"
                aria-label="Iniciar Áudio"
              >
                <Play className="w-7 h-7 fill-current ml-1" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
