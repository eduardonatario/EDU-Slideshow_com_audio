import { SlideshowConfig } from '../types';

export const INITIAL_CONFIG: SlideshowConfig = {
  title: 'Slideshow com áudio',
  size: 'medium',
  autoAdvance: false,
  showCaptions: false,
  flashTransition: true,
  theme: 'dark',
  slides: [
    {
      id: 'slide-1',
      title: 'SLIDE 1',
      imageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
      audioUrl: 'https://cdn.freesound.org/previews/682/682136_11861866-lq.mp3',
      caption: 'Ouça a narração inicial completa para liberar o botão de próximo slide.'
    },
    {
      id: 'slide-2',
      title: 'SLIDE 2',
      imageUrl: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80',
      audioUrl: 'https://cdn.freesound.org/previews/612/612095_11861866-lq.mp3',
      caption: 'Acompanhe a explicação técnica sobre a formação das cordilheiras.'
    },
    {
      id: 'slide-3',
      title: 'SLIDE 3',
      imageUrl: 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=1200&q=80',
      audioUrl: 'https://cdn.freesound.org/previews/560/560824_11861866-lq.mp3',
      caption: 'Análise detalhada sobre os ecossistemas tropicais e sua preservação.'
    },
    {
      id: 'slide-4',
      title: 'SLIDE 4',
      imageUrl: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=80',
      audioUrl: 'https://cdn.freesound.org/previews/612/612092_11861866-lq.mp3',
      caption: 'Considerações finais sobre o impacto ambiental e próximos passos.'
    }
  ]
};
