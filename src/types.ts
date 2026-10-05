export type SlideSize = 'small' | 'medium' | 'large';

export interface Slide {
  id: string;
  title: string;
  imageUrl: string;
  audioUrl: string;
  caption?: string;
}

export interface SlideshowConfig {
  title: string;
  slides: Slide[];
  size: SlideSize;
  autoAdvance: boolean;
  showCaptions: boolean;
  flashTransition?: boolean;
  showProgressBar?: boolean;
  instantProgressBarFill?: boolean;
  advanceOnClickImage?: boolean;
  disableInitialDarkOverlay?: boolean;
  theme: 'dark' | 'light';
}

export interface PlayerState {
  currentIndex: number;
  isPlaying: boolean;
  duration: number;
  currentTime: number;
  isCompleted: boolean; // whether current slide audio has finished playing
  completedSlideIds: Set<string>; // set of slide IDs where audio was fully played
  volume: number;
  isMuted: boolean;
  playbackRate: number;
  hasAudioError: boolean;
}
