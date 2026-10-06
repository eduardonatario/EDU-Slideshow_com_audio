import { SlideshowConfig } from '../types';

export const INITIAL_CONFIG: SlideshowConfig = {
  title: 'Audio Slideshow',
  size: 'medium',
  customWidth: 800,
  customHeight: 450,
  autoAdvance: false,
  showCaptions: false,
  flashTransition: false,
  showProgressBar: true,
  instantProgressBarFill: true,
  advanceOnClickImage: false,
  disableInitialDarkOverlay: false,
  theme: 'dark',
  slides: [
    {
      id: 'slide-1',
      title: 'SLIDE 1',
      imageUrl: 'https://www.image2url.com/r2/default/files/1786107541110-7147fb41-a0c9-418e-b1ce-8b35b8a7089a.png',
      audioUrl: 'https://www.image2url.com/r2/default/videos/1786109221182-a26d10ae-fed4-4489-a0f2-922bb88b1d09.mp4',
      caption: 'Slide 1 - Ouça a narração para liberar o próximo slide.'
    },
    {
      id: 'slide-2',
      title: 'SLIDE 2',
      imageUrl: 'https://www.image2url.com/r2/default/files/1786107637381-4a4d7507-e1b1-43d2-81ca-a658c03c44e7.png',
      audioUrl: 'https://www.image2url.com/r2/default/videos/1786109394770-93e5b433-ee9b-4eeb-a794-e10b3cd6eb25.mp4',
      caption: 'Slide 2 - Acompanhe a apresentação.'
    },
    {
      id: 'slide-3',
      title: 'SLIDE 3',
      imageUrl: 'https://www.image2url.com/r2/default/files/1786107722306-dd051aa1-a869-4dbe-b739-381b420e6c7f.png',
      audioUrl: 'https://www.image2url.com/r2/default/videos/1786109436532-63d7442c-4e76-41c8-ac1f-b67821d8d4e7.mp4',
      caption: 'Slide 3 - Conteúdo demonstrativo.'
    },
    {
      id: 'slide-4',
      title: 'SLIDE 4',
      imageUrl: 'https://www.image2url.com/r2/default/files/1786107816100-36c492a1-ca13-41a0-8a2b-86926cc1793b.png',
      audioUrl: 'https://www.image2url.com/r2/default/videos/1786109476505-e4d4dffc-0f09-4ffe-9b6d-708f14063801.mp4',
      caption: 'Slide 4 - Explicação detalhada.'
    },
    {
      id: 'slide-5',
      title: 'SLIDE 5',
      imageUrl: 'https://www.image2url.com/r2/default/files/1786107898812-2c2ea158-182e-44c2-aa05-68c9687c9bc9.png',
      audioUrl: 'https://www.image2url.com/r2/default/videos/1786109436532-63d7442c-4e76-41c8-ac1f-b67821d8d4e7.mp4',
      caption: 'Slide 5 - Conclusão do slideshow.'
    }
  ]
};
