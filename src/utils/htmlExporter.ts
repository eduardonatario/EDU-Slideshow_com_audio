import { SlideshowConfig } from '../types';

export function generateStandaloneHtml(config: SlideshowConfig): string {
  const jsonConfig = JSON.stringify(config, null, 2);

  const sizeCssMap = {
    small: 'max-width: 520px;',
    medium: 'max-width: 800px;',
    large: 'max-width: 1100px;'
  };

  const containerMaxWidth = sizeCssMap[config.size] || sizeCssMap.medium;

  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(config.title || 'Slideshow Interativo com Áudio')}</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      background-color: #f8f9fa;
      color: #1a1a1a;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      padding: 16px;
    }
    .slideshow-wrapper {
      width: 100%;
      ${containerMaxWidth}
      background: #ffffff;
      color: #1a1a1a;
      border: 1px solid #e2e8f0;
      border-radius: 24px;
      overflow: hidden;
      box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.08);
      padding: 16px;
    }
    .media-container {
      position: relative;
      width: 100%;
      aspect-ratio: 16 / 9;
      background-color: ${config.flashTransition !== false ? '#ffffff' : '#0f172a'};
      border-radius: 16px;
      overflow: hidden;
      border: 1px solid #e2e8f0;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .slide-img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: opacity 0.3s ease-in-out;
    }
    .nav-btn {
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      z-index: 20;
      width: 48px;
      height: 48px;
      border-radius: 9999px;
      background: rgba(255, 255, 255, 0.9);
      color: #0f172a;
      border: 1px solid #e2e8f0;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
      transition: all 0.2s ease;
    }
    .nav-btn:hover:not(:disabled) {
      background: #ffffff;
      transform: translateY(-50%) scale(1.05);
    }
    .nav-btn:disabled {
      opacity: 0.3;
      cursor: not-allowed;
      background: rgba(255, 255, 255, 0.6);
      border-color: #cbd5e1;
    }
    .nav-btn-left {
      left: 16px;
    }
    .nav-btn-right {
      right: 16px;
    }
    .caption-overlay {
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      background: linear-gradient(to top, rgba(0, 0, 0, 0.8) 0%, rgba(0, 0, 0, 0.3) 70%, transparent 100%);
      padding: 16px 20px;
      color: #ffffff;
      pointer-events: none;
      z-index: 10;
      display: flex;
      flex-direction: column;
      gap: 2px;
    }
    .caption-title {
      font-size: 15px;
      font-weight: 700;
      color: #ffffff;
      text-shadow: 0 1px 2px rgba(0,0,0,0.5);
    }
    .caption-text {
      font-size: 12px;
      color: #e2e8f0;
      line-height: 1.4;
      text-shadow: 0 1px 2px rgba(0,0,0,0.5);
    }
    .play-overlay {
      position: absolute;
      inset: 0;
      background: rgba(15, 23, 42, 0.6);
      backdrop-filter: blur(2px);
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      color: #ffffff;
      z-index: 10;
    }
    .play-trigger-btn {
      width: 56px;
      height: 56px;
      border-radius: 9999px;
      background: #ffffff;
      color: #000000;
      border: none;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.3);
      transition: transform 0.2s ease;
      margin-top: 8px;
    }
    .play-trigger-btn:hover {
      transform: scale(1.1);
    }
  </style>
</head>
<body>

  <div class="slideshow-wrapper">
    <div class="media-container">
      <div id="flash-overlay" style="position: absolute; inset: 0; background-color: white; opacity: 0; pointer-events: none; z-index: 30;"></div>
      <img id="slide-image" class="slide-img" src="" alt="Slide Image" />

      <button id="btn-prev" class="nav-btn nav-btn-left" title="Slide Anterior" style="display: none;">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg>
      </button>

      <button id="btn-next" class="nav-btn nav-btn-right" title="Próximo Slide" style="display: none;">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg>
      </button>

      <div class="caption-overlay" id="caption-box" style="display: none;">
        <div class="caption-title" id="slide-title"></div>
        <div class="caption-text" id="slide-text"></div>
      </div>

      <div id="play-overlay" class="play-overlay" style="display: none;">
        <button id="btn-start-audio" class="play-trigger-btn">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><polygon points="6 3 20 12 6 21 6 3"/></svg>
        </button>
      </div>
    </div>
  </div>

  <audio id="audio-player" preload="auto"></audio>

  <script>
    const CONFIG = ${jsonConfig};

    let currentIndex = 0;
    const completedSlides = new Set();

    const audio = document.getElementById('audio-player');
    const imgEl = document.getElementById('slide-image');
    const prevBtn = document.getElementById('btn-prev');
    const nextBtn = document.getElementById('btn-next');
    const playOverlay = document.getElementById('play-overlay');
    const startAudioBtn = document.getElementById('btn-start-audio');

    const captionBox = document.getElementById('caption-box');
    const titleEl = document.getElementById('slide-title');
    const textEl = document.getElementById('slide-text');

    function loadSlide(index) {
      currentIndex = index;
      const slide = CONFIG.slides[currentIndex];
      if (!slide) return;

      if (CONFIG.flashTransition !== false) {
        const flashOverlay = document.getElementById('flash-overlay');
        if (flashOverlay) {
          flashOverlay.style.transition = 'none';
          flashOverlay.style.opacity = '1';
          setTimeout(function() {
            flashOverlay.style.transition = 'opacity 0.3s ease-out';
            flashOverlay.style.opacity = '0';
          }, 20);
        }
      }

      imgEl.src = slide.imageUrl || '';
      imgEl.style.opacity = '1';

      audio.src = slide.audioUrl || '';
      audio.load();

      if (CONFIG.showCaptions && (slide.title || slide.caption)) {
        captionBox.style.display = 'flex';
        titleEl.textContent = slide.title || '';
        textEl.textContent = slide.caption || '';
      } else {
        captionBox.style.display = 'none';
      }

      const isDone = completedSlides.has(slide.id);
      updateControlsUI(isDone);

      playOverlay.style.display = 'none';

      audio.play().then(() => {
        playOverlay.style.display = 'none';
      }).catch(() => {
        if (!isDone) {
          playOverlay.style.display = 'flex';
        }
      });
    }

    function updateControlsUI(isUnlocked) {
      if (!CONFIG.autoAdvance && isUnlocked) {
        prevBtn.style.display = currentIndex > 0 ? 'flex' : 'none';
        nextBtn.style.display = currentIndex < CONFIG.slides.length - 1 ? 'flex' : 'none';
      } else {
        prevBtn.style.display = 'none';
        nextBtn.style.display = 'none';
      }
    }

    startAudioBtn.addEventListener('click', () => {
      audio.play().then(() => {
        playOverlay.style.display = 'none';
      });
    });

    prevBtn.addEventListener('click', () => {
      if (currentIndex > 0) {
        loadSlide(currentIndex - 1);
      }
    });

    nextBtn.addEventListener('click', () => {
      if (completedSlides.has(CONFIG.slides[currentIndex].id) && currentIndex < CONFIG.slides.length - 1) {
        loadSlide(currentIndex + 1);
      }
    });

    audio.addEventListener('ended', () => {
      const currentSlide = CONFIG.slides[currentIndex];
      completedSlides.add(currentSlide.id);
      updateControlsUI(true);

      if (CONFIG.autoAdvance && currentIndex < CONFIG.slides.length - 1) {
        setTimeout(() => {
          loadSlide(currentIndex + 1);
        }, 600);
      }
    });

    audio.addEventListener('error', () => {
      // On error, auto unlock so user isn't stuck
      completedSlides.add(CONFIG.slides[currentIndex].id);
      updateControlsUI(true);
      playOverlay.style.display = 'none';
    });

    // Initialize
    loadSlide(0);
  </script>
</body>
</html>`;
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

export function downloadHtmlFile(config: SlideshowConfig, filename = 'slideshow.html') {
  const content = generateStandaloneHtml(config);
  const blob = new Blob([content], { type: 'text/html;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function generateEmbedCode(config: SlideshowConfig, appUrl: string): string {
  const sizeMap = {
    small: { w: '520', h: '420' },
    medium: { w: '800', h: '560' },
    large: { w: '1100', h: '720' }
  };
  const dims = sizeMap[config.size] || sizeMap.medium;
  const embedUrl = `${appUrl.replace(/\/$/, '')}?embed=true`;

  return `<iframe src="${embedUrl}" width="${dims.w}" height="${dims.h}" style="border: 0; border-radius: 12px; overflow: hidden;" allow="autoplay" title="${escapeHtml(config.title || 'Slideshow')}"></iframe>`;
}
