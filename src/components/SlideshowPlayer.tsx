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
  const [hasUserStarted, setHasUserStarted] = useState(false);
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
  const isLastSlideCompleted = isLastSlide && isCurrentSlideCompleted;
  const hasAudioStarted = hasUserStarted && (isPlaying || currentTime > 0 || isCurrentSlideCompleted);

  // Preload all slide images eagerly
  useEffect(() => {
    if (config.slides) {
      config.slides.forEach((slide) => {
        if (slide.imageUrl) {
          const img = new Image();
          img.src = slide.imageUrl;
        }
      });
    }
  }, [config.slides]);

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

    // Only auto-play if user has already started the presentation
    if (hasUserStarted) {
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
    } else {
      setIsPlaying(false);
    }
  }, [currentIndex, currentSlide, config.slides, hasUserStarted]);

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

  const handleStartAudio = () => {
    setHasUserStarted(true);
    const audio = audioRef.current;
    if (!audio) return;

    audio
      .play()
      .then(() => {
        setIsPlaying(true);
        setHasAudioError(false);
      })
      .catch((err) => {
        console.warn('Audio play error:', err);
        setHasAudioError(true);
      });
  };

  const togglePlay = () => {
    if (!hasUserStarted) {
      handleStartAudio();
      return;
    }
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
    if (currentIndex > 0 && !isLastSlideCompleted) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const handleReplaySlideshow = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    setIsPlaying(false);
    setCurrentTime(0);
    setCompletedSlideIds(new Set());
    setHasUserStarted(false);
    setCurrentIndex(0);
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
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleAudioEnded}
        onError={handleAudioError}
        preload="auto"
      />

      {/* Main White Slideshow Container */}
      <div className="bg-white border border-slate-200 rounded-3xl p-4 sm:p-6 shadow-xl relative overflow-hidden">
        {/* Media Container Viewport */}
        <div className="relative w-full aspect-video bg-slate-100 rounded-2xl overflow-hidden flex items-center justify-center border border-slate-200/80 shadow-inner group">
          {Boolean(config.flashTransition) && (
            <motion.div
              key={`flash-${currentIndex}-${currentSlide.id}`}
              initial={{ opacity: 1 }}
              animate={{ opacity: 0 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              className="absolute inset-0 bg-white z-30 pointer-events-none"
            />
          )}
          {config.slides.map((slide, idx) => {
            const isCurrent = idx === currentIndex;
            const isPast = idx < currentIndex;
            return (
              <img
                key={slide.id || idx}
                src={slide.imageUrl}
                alt={slide.title || `Slide ${idx + 1}`}
                className={`absolute inset-0 w-full h-full object-cover select-none ${
                  isCurrent
                    ? 'opacity-100 z-10'
                    : isPast
                    ? 'opacity-100 z-0'
                    : 'opacity-0 z-0 pointer-events-none'
                }`}
                loading="eager"
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80';
                }}
              />
            );
          })}

          {/* Left Arrow Button (Previous Slide) - Only appears when autoAdvance is false, audio completes, and NOT on finished last slide */}
          {!config.autoAdvance && isCurrentSlideCompleted && currentIndex > 0 && !isLastSlideCompleted && (
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

          {/* Replay / Review Icon in Top-Right Corner - Appears when last slide finishes its audio */}
          {isLastSlideCompleted && (
            <button
              onClick={handleReplaySlideshow}
              className="absolute top-4 right-4 z-30 w-10 h-10 rounded-full bg-white/95 hover:bg-white text-slate-800 shadow-xl border border-slate-200/80 flex items-center justify-center transition-all hover:scale-110 active:scale-95 cursor-pointer group"
              title="Reiniciar Apresentação"
              aria-label="Reiniciar Apresentação"
            >
              <RotateCcw className="w-5 h-5 text-slate-700 group-hover:rotate-[-45deg] transition-transform" />
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

          {/* Central Play Button Overlay with Dimmed Black Effect (Shown ONLY initially before clicking to start slideshow) */}
          {!hasUserStarted && (
            <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] flex items-center justify-center z-20 pointer-events-auto transition-opacity duration-300">
              <button
                onClick={handleStartAudio}
                className="w-16 h-16 rounded-full bg-white text-slate-900 flex items-center justify-center shadow-2xl hover:scale-110 active:scale-95 transition-transform cursor-pointer border border-slate-200/80"
                title="Começar Slideshow"
                aria-label="Começar Slideshow"
              >
                <Play className="w-7 h-7 fill-current ml-1" />
              </button>
            </div>
          )}
        </div>

        {/* Segmented Status Bar Below Slideshow */}
        {config.showProgressBar !== false && (
          <div className="mt-4 pt-1 px-1 flex items-center gap-2 w-full">
            {config.slides.map((slide, idx) => {
              const isPast = idx < currentIndex;
              const isCurrent = idx === currentIndex;
              const isInstant = config.instantProgressBarFill ?? true;

              let isSolidBlue = false;
              let fillWidth = '0%';

              if (isInstant) {
                if (isPast) {
                  isSolidBlue = true;
                  fillWidth = '100%';
                } else if (isCurrent) {
                  isSolidBlue = hasAudioStarted;
                  fillWidth = hasAudioStarted ? '100%' : '0%';
                }
              } else {
                if (isPast) {
                  fillWidth = '100%';
                } else if (isCurrent) {
                  fillWidth = isCurrentSlideCompleted ? '100%' : `${progressPercent}%`;
                }
              }

              return (
                <div
                  key={slide.id || idx}
                  className={`flex-1 h-2 rounded-full overflow-hidden relative border border-slate-200/80 cursor-pointer ${
                    isInstant && isSolidBlue ? 'bg-blue-600' : 'bg-slate-200'
                  }`}
                  title={`Slide ${idx + 1}`}
                  onClick={(e) => {
                    if (!isInstant && isCurrent && audioRef.current && duration) {
                      const rect = e.currentTarget.getBoundingClientRect();
                      const clickPos = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
                      const newTime = clickPos * duration;
                      audioRef.current.currentTime = newTime;
                      setCurrentTime(newTime);
                    }
                  }}
                >
                  {!isInstant && (
                    <div
                      className="h-full bg-blue-600 rounded-full transition-all duration-150 ease-out"
                      style={{ width: fillWidth }}
                    />
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
