import { SlideshowConfig } from '../types';

export function generateStandaloneHtml(config: SlideshowConfig): string {
  const jsonConfig = JSON.stringify(config, null, 2);

  const getDims = () => {
    if (config.size === 'small') {
      return { maxWidth: '520px', aspectRatio: '520 / 293' };
    }
    if (config.size === 'large') {
      return { maxWidth: '1100px', aspectRatio: '1100 / 619' };
    }
    if (config.size === 'custom') {
      const w = Math.max(280, Number(config.customWidth) || 800);
      const h = Math.max(180, Number(config.customHeight) || 450);
      return { maxWidth: `${w}px`, aspectRatio: `${w} / ${h}` };
    }
    return { maxWidth: '800px', aspectRatio: '800 / 450' };
  };

  const dims = getDims();

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
      max-width: ${dims.maxWidth};
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
      aspect-ratio: ${dims.aspectRatio};
      max-height: 85vh;
      background-color: #f1f5f9;
      border-radius: 16px;
      overflow: hidden;
      border: 1px solid #e2e8f0;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .slide-img {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: none;
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
    .replay-btn {
      position: absolute;
      top: 16px;
      right: 16px;
      z-index: 30;
      width: 40px;
      height: 40px;
      border-radius: 9999px;
      background: rgba(255, 255, 255, 0.95);
      color: #1e293b;
      border: 1px solid #e2e8f0;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
      transition: all 0.2s ease;
    }
    .replay-btn:hover {
      background: #ffffff;
      transform: scale(1.1);
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
      ${config.disableInitialDarkOverlay ? 'background: transparent;' : 'background: rgba(0, 0, 0, 0.4); backdrop-filter: blur(2px);'}
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      color: #ffffff;
      z-index: 20;
    }
    .play-trigger-btn {
      width: 56px;
      height: 56px;
      border-radius: 9999px;
      background: #ffffff;
      color: #000000;
      border: 1px solid #cbd5e1;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.3);
      transition: transform 0.2s ease;
      margin-top: 8px;
      pointer-events: auto;
    }
    .play-trigger-btn:hover {
      transform: scale(1.1);
    }
    .progress-bar-container {
      margin-top: 16px;
      padding: 0 4px;
      display: flex;
      align-items: center;
      gap: 8px;
      width: 100%;
    }
    .progress-segment {
      flex: 1;
      height: 8px;
      background: #e2e8f0;
      border: 1px solid #cbd5e1;
      border-radius: 9999px;
      overflow: hidden;
      position: relative;
      cursor: pointer;
    }
    .progress-segment-fill {
      height: 100%;
      background: #2563eb;
      width: 0%;
      border-radius: 9999px;
      ${config.instantProgressBarFill !== false ? 'transition: none;' : 'transition: width 0.15s ease-out;'}
    }
  </style>
</head>
<body>

  <div class="slideshow-wrapper">
    <div class="media-container" id="media-container">
      <div id="flash-overlay" style="position: absolute; inset: 0; background-color: white; opacity: 0; pointer-events: none; z-index: 30;"></div>
      ${config.slides.map((slide, i) => `
        <img
          id="slide-image-${i}"
          class="slide-img"
          src="${slide.imageUrl || ''}"
          alt="${slide.title || 'Slide ' + (i + 1)}"
          style="opacity: ${i === 0 ? '1' : '0'}; z-index: ${i === 0 ? '1' : '0'}; pointer-events: none;"
          loading="eager"
        />
      `).join('')}

      <button id="btn-prev" class="nav-btn nav-btn-left" title="Slide Anterior" style="display: none;">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg>
      </button>

      <button id="btn-next" class="nav-btn nav-btn-right" title="Próximo Slide" style="display: none;">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg>
      </button>

      <button id="btn-replay" class="replay-btn" title="Reiniciar Apresentação" style="display: none;">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/>
          <path d="M3 3v5h5"/>
        </svg>
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

    ${config.showProgressBar !== false ? `
    <div class="progress-bar-container" id="progress-container">
      ${config.slides.map((_, i) => `
        <div class="progress-segment" id="segment-${i}" data-index="${i}" title="Slide ${i + 1}">
          <div class="progress-segment-fill" id="segment-fill-${i}"></div>
        </div>
      `).join('')}
    </div>` : ''}
  </div>

  <audio id="audio-player" preload="auto"></audio>

  <script>
    const CONFIG = ${jsonConfig};

    let currentIndex = 0;
    let audioStarted = false;
    const completedSlides = new Set();

    const audio = document.getElementById('audio-player');
    const prevBtn = document.getElementById('btn-prev');
    const nextBtn = document.getElementById('btn-next');
    const replayBtn = document.getElementById('btn-replay');
    const playOverlay = document.getElementById('play-overlay');
    const startAudioBtn = document.getElementById('btn-start-audio');

    const captionBox = document.getElementById('caption-box');
    const titleEl = document.getElementById('slide-title');
    const textEl = document.getElementById('slide-text');

    function updateProgressBar() {
      for (let i = 0; i < CONFIG.slides.length; i++) {
        const fillEl = document.getElementById('segment-fill-' + i);
        if (!fillEl) continue;
        if (i < currentIndex) {
          fillEl.style.width = '100%';
        } else if (i === currentIndex) {
          if (CONFIG.instantProgressBarFill !== false) {
            fillEl.style.width = (audioStarted || completedSlides.has(CONFIG.slides[i].id)) ? '100%' : '0%';
          } else {
            const isDone = completedSlides.has(CONFIG.slides[i].id);
            if (isDone) {
              fillEl.style.width = '100%';
            } else if (audio.duration) {
              const pct = (audio.currentTime / audio.duration) * 100;
              fillEl.style.width = pct + '%';
            } else {
              fillEl.style.width = '0%';
            }
          }
        } else {
          fillEl.style.width = '0%';
        }
      }
    }

    CONFIG.slides.forEach((_, i) => {
      const seg = document.getElementById('segment-' + i);
      if (seg) {
        seg.addEventListener('click', (e) => {
          if (i === currentIndex && audio.duration) {
            const rect = seg.getBoundingClientRect();
            const pos = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
            audio.currentTime = pos * audio.duration;
          }
        });
      }
    });

    audio.addEventListener('play', () => {
      audioStarted = true;
      updateProgressBar();
    });

    audio.addEventListener('timeupdate', () => {
      if (audio.currentTime > 0 && !audioStarted) {
        audioStarted = true;
        updateProgressBar();
      }
      if (CONFIG.instantProgressBarFill !== false) return;
      const activeFill = document.getElementById('segment-fill-' + currentIndex);
      if (activeFill && audio.duration) {
        const pct = (audio.currentTime / audio.duration) * 100;
        activeFill.style.width = pct + '%';
      }
    });

    function loadSlide(index) {
      currentIndex = index;
      const slide = CONFIG.slides[currentIndex];
      if (!slide) return;

      if (Boolean(CONFIG.flashTransition)) {
        const flashOverlay = document.getElementById('flash-overlay');
        if (flashOverlay) {
          flashOverlay.style.transition = 'none';
          flashOverlay.style.opacity = '1';
          setTimeout(function() {
            flashOverlay.style.transition = 'opacity 0.2s ease-out';
            flashOverlay.style.opacity = '0';
          }, 20);
        }
      }

      for (let i = 0; i < CONFIG.slides.length; i++) {
        const img = document.getElementById('slide-image-' + i);
        if (img) {
          if (i === currentIndex) {
            img.style.opacity = '1';
            img.style.zIndex = '10';
          } else if (i < currentIndex) {
            img.style.opacity = '1';
            img.style.zIndex = '1';
          } else {
            img.style.opacity = '0';
            img.style.zIndex = '0';
          }
        }
      }

      updateProgressBar();

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

      if (audioStarted) {
        playOverlay.style.display = 'none';
        const playPromise = audio.play();
        if (playPromise !== undefined) {
          playPromise.then(() => {
            updateProgressBar();
          }).catch((err) => {
            console.warn('Playback error:', err);
          });
        }
      } else {
        playOverlay.style.display = 'flex';
      }
    }

    function updateControlsUI(isUnlocked) {
      const isLastSlide = currentIndex === CONFIG.slides.length - 1;
      const isLastSlideCompleted = isLastSlide && completedSlides.has(CONFIG.slides[currentIndex].id);
      const isAudioBypassed = Boolean(CONFIG.advanceOnClickImage) && audioStarted;
      const canProceed = isUnlocked || isAudioBypassed;
      const showReplay = isLastSlide && (completedSlides.has(CONFIG.slides[currentIndex].id) || isAudioBypassed);

      if (!CONFIG.autoAdvance && canProceed && !isLastSlideCompleted) {
        prevBtn.style.display = currentIndex > 0 ? 'flex' : 'none';
        nextBtn.style.display = !isLastSlide ? 'flex' : 'none';
      } else {
        prevBtn.style.display = (!CONFIG.autoAdvance && isAudioBypassed && currentIndex > 0 && !isLastSlideCompleted) ? 'flex' : 'none';
        nextBtn.style.display = 'none';
      }

      if (replayBtn) {
        replayBtn.style.display = showReplay ? 'flex' : 'none';
      }
    }

    if (replayBtn) {
      replayBtn.addEventListener('click', () => {
        audio.pause();
        audio.currentTime = 0;
        completedSlides.clear();
        audioStarted = false;
        replayBtn.style.display = 'none';
        loadSlide(0);
      });
    }

    startAudioBtn.addEventListener('click', () => {
      audioStarted = true;
      audio.play().then(() => {
        playOverlay.style.display = 'none';
        updateProgressBar();
        updateControlsUI(false);
      }).catch((err) => {
        console.warn('Audio play error:', err);
      });
    });

    prevBtn.addEventListener('click', () => {
      if (currentIndex > 0) {
        loadSlide(currentIndex - 1);
      }
    });

    nextBtn.addEventListener('click', () => {
      const isAudioBypassed = Boolean(CONFIG.advanceOnClickImage) && audioStarted;
      const canProceed = completedSlides.has(CONFIG.slides[currentIndex].id) || isAudioBypassed;
      if (canProceed && currentIndex < CONFIG.slides.length - 1) {
        loadSlide(currentIndex + 1);
      }
    });

    audio.addEventListener('ended', () => {
      const currentSlide = CONFIG.slides[currentIndex];
      completedSlides.add(currentSlide.id);
      updateProgressBar();
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
      updateProgressBar();
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
  let w = 800;
  let h = 560;
  if (config.size === 'small') {
    w = 520;
    h = 420;
  } else if (config.size === 'large') {
    w = 1100;
    h = 720;
  } else if (config.size === 'custom') {
    w = Math.max(280, Number(config.customWidth) || 800);
    h = (Number(config.customHeight) || 450) + 110;
  }
  const embedUrl = `${appUrl.replace(/\/$/, '')}?embed=true`;

  return `<iframe src="${embedUrl}" width="${w}" height="${h}" style="border: 0; border-radius: 12px; overflow: hidden;" allow="autoplay" title="${escapeHtml(config.title || 'Slideshow')}"></iframe>`;
}
