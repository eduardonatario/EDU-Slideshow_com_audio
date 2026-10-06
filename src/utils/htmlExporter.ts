import { SlideshowConfig } from '../types';

export function generateStandaloneHtml(config: SlideshowConfig): string {
  const jsonConfig = JSON.stringify(config, null, 2);

  // Generate a unique CSS/DOM namespace for this instance (prevents collision if multiple are embedded on the same page)
  const instanceId = 'as_slide_' + Math.random().toString(36).substring(2, 9);

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
  <title>${escapeHtml(config.title || 'Audio Slideshow')}</title>
  <style>
    /* Standalone Page View Styling (Active ONLY if loaded as a standalone document, never affects parent page) */
    html, body.as-standalone-body {
      margin: 0;
      padding: 0;
      width: 100%;
      min-height: 100vh;
      background-color: #f8f9fa;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
    }

    /* ==========================================================================
       ISOLATED SLIDESHOW ROOT - Scope strictly to #${instanceId}
       'all: initial' prevents any CSS from the host website from bleeding into the slideshow.
       All rules are strictly scoped so no slideshow styles leak out to the host.
       ========================================================================== */
    #${instanceId} {
      all: initial;
      display: block;
      box-sizing: border-box;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      color: #1a1a1a;
      width: 100%;
      max-width: ${dims.maxWidth};
      margin: 16px auto;
      position: relative;
      text-align: left;
      line-height: normal;
      direction: ltr;
      background: transparent;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
    }

    /* Universal box-sizing & reset ONLY within this slideshow instance */
    #${instanceId} *,
    #${instanceId} *::before,
    #${instanceId} *::after {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
      font-family: inherit;
      line-height: inherit;
      -webkit-tap-highlight-color: transparent;
    }

    #${instanceId} button {
      cursor: pointer;
      background: transparent;
      border: none;
      outline: none;
      font: inherit;
      color: inherit;
      user-select: none;
      -webkit-user-select: none;
      touch-action: manipulation;
    }

    #${instanceId} img {
      display: block;
      max-width: none;
      border: none;
      outline: none;
    }

    /* Isolated Components */
    #${instanceId} .as-wrapper {
      width: 100%;
      background: #ffffff;
      color: #1a1a1a;
      border: 1px solid #e2e8f0;
      border-radius: 24px;
      overflow: hidden;
      box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.08);
      padding: 16px;
      position: relative;
    }

    #${instanceId} .as-media-container {
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
      cursor: ${config.advanceOnClickImage ? 'pointer' : 'default'};
    }

    #${instanceId} .as-slide-img {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: none;
      pointer-events: none;
    }

    #${instanceId} .as-nav-btn {
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
      box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
      transition: all 0.2s ease;
    }

    #${instanceId} .as-nav-btn:hover:not(:disabled) {
      background: #ffffff;
      transform: translateY(-50%) scale(1.05);
    }

    #${instanceId} .as-nav-btn:disabled {
      opacity: 0.3;
      cursor: not-allowed;
      background: rgba(255, 255, 255, 0.6);
      border-color: #cbd5e1;
    }

    #${instanceId} .as-nav-btn-left {
      left: 16px;
    }

    #${instanceId} .as-nav-btn-right {
      right: 16px;
    }

    #${instanceId} .as-replay-btn {
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
      box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
      transition: all 0.2s ease;
    }

    #${instanceId} .as-replay-btn:hover {
      background: #ffffff;
      transform: scale(1.1);
    }

    #${instanceId} .as-caption-overlay {
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

    #${instanceId} .as-caption-title {
      font-size: 15px;
      font-weight: 700;
      color: #ffffff;
      text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
    }

    #${instanceId} .as-caption-text {
      font-size: 12px;
      color: #e2e8f0;
      line-height: 1.4;
      text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
    }

    #${instanceId} .as-play-overlay {
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

    #${instanceId} .as-play-trigger-btn {
      width: 56px;
      height: 56px;
      border-radius: 9999px;
      background: #ffffff;
      color: #000000;
      border: 1px solid #cbd5e1;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.3);
      transition: transform 0.2s ease;
      margin-top: 8px;
      pointer-events: auto;
    }

    #${instanceId} .as-play-trigger-btn:hover {
      transform: scale(1.1);
    }

    #${instanceId} .as-progress-bar-container {
      margin-top: 16px;
      padding: 0 4px;
      display: flex;
      align-items: center;
      gap: 8px;
      width: 100%;
    }

    #${instanceId} .as-progress-segment {
      flex: 1;
      height: 8px;
      background: #e2e8f0;
      border: 1px solid #cbd5e1;
      border-radius: 9999px;
      overflow: hidden;
      position: relative;
      cursor: pointer;
    }

    #${instanceId} .as-progress-segment-fill {
      height: 100%;
      background: #2563eb;
      width: 0%;
      border-radius: 9999px;
      ${config.instantProgressBarFill !== false ? 'transition: none;' : 'transition: width 0.15s ease-out;'}
    }

    #${instanceId} .as-flash-overlay {
      position: absolute;
      inset: 0;
      background-color: white;
      opacity: 0;
      pointer-events: none;
      z-index: 30;
    }
  </style>
</head>
<body class="as-standalone-body">

  <!-- Isolated Root Container -->
  <div id="${instanceId}" class="as-slideshow-root">
    <div class="as-wrapper">
      <div class="as-media-container">
        <div class="as-flash-overlay"></div>
        ${config.slides.map((slide, i) => `
          <img
            class="as-slide-img as-slide-img-${i}"
            src="${slide.imageUrl || ''}"
            alt="${escapeHtml(slide.title || 'Slide ' + (i + 1))}"
            style="opacity: ${i === 0 ? '1' : '0'}; z-index: ${i === 0 ? '1' : '0'};"
            loading="eager"
          />
        `).join('')}

        <button class="as-nav-btn as-nav-btn-left as-btn-prev" title="Slide Anterior" style="display: none;">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg>
        </button>

        <button class="as-nav-btn as-nav-btn-right as-btn-next" title="Próximo Slide" style="display: none;">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg>
        </button>

        <button class="as-replay-btn as-btn-replay" title="Reiniciar Apresentação" style="display: none;">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/>
            <path d="M3 3v5h5"/>
          </svg>
        </button>

        <div class="as-caption-overlay as-caption-box" style="display: none;">
          <div class="as-caption-title as-slide-title"></div>
          <div class="as-caption-text as-slide-text"></div>
        </div>

        <div class="as-play-overlay" style="display: none;">
          <button class="as-play-trigger-btn as-btn-start-audio" title="Iniciar">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><polygon points="6 3 20 12 6 21 6 3"/></svg>
          </button>
        </div>
      </div>

      ${config.showProgressBar !== false ? `
      <div class="as-progress-bar-container">
        ${config.slides.map((_, i) => `
          <div class="as-progress-segment as-progress-segment-${i}" data-index="${i}" title="Slide ${i + 1}">
            <div class="as-progress-segment-fill as-progress-fill-${i}"></div>
          </div>
        `).join('')}
      </div>` : ''}
    </div>

    <audio class="as-audio-player" preload="auto"></audio>
  </div>

  <!-- Encapsulated Controller Script (Strict Closure / IIFE - Zero Global Pollution) -->
  <script>
    (function() {
      'use strict';
      var root = document.getElementById(${JSON.stringify(instanceId)});
      if (!root) return;

      var CONFIG = ${jsonConfig};
      var currentIndex = 0;
      var audioStarted = false;
      var completedSlides = new Set();

      var audio = root.querySelector('.as-audio-player');
      var mediaContainer = root.querySelector('.as-media-container');
      var prevBtn = root.querySelector('.as-btn-prev');
      var nextBtn = root.querySelector('.as-btn-next');
      var replayBtn = root.querySelector('.as-btn-replay');
      var playOverlay = root.querySelector('.as-play-overlay');
      var startAudioBtn = root.querySelector('.as-btn-start-audio');
      var captionBox = root.querySelector('.as-caption-box');
      var titleEl = root.querySelector('.as-slide-title');
      var textEl = root.querySelector('.as-slide-text');
      var flashOverlay = root.querySelector('.as-flash-overlay');

      function updateProgressBar() {
        if (!CONFIG.slides) return;
        for (var i = 0; i < CONFIG.slides.length; i++) {
          var fillEl = root.querySelector('.as-progress-fill-' + i);
          if (!fillEl) continue;
          if (i < currentIndex) {
            fillEl.style.width = '100%';
          } else if (i === currentIndex) {
            if (CONFIG.instantProgressBarFill !== false) {
              fillEl.style.width = (audioStarted || completedSlides.has(CONFIG.slides[i].id)) ? '100%' : '0%';
            } else {
              var isDone = completedSlides.has(CONFIG.slides[i].id);
              if (isDone) {
                fillEl.style.width = '100%';
              } else if (audio && audio.duration) {
                var pct = (audio.currentTime / audio.duration) * 100;
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

      CONFIG.slides.forEach(function(_, i) {
        var seg = root.querySelector('.as-progress-segment-' + i);
        if (seg) {
          seg.addEventListener('click', function(e) {
            e.stopPropagation();
            if (i === currentIndex && audio && audio.duration) {
              var rect = seg.getBoundingClientRect();
              var pos = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
              audio.currentTime = pos * audio.duration;
            }
          });
        }
      });

      if (audio) {
        audio.addEventListener('play', function() {
          audioStarted = true;
          updateProgressBar();
        });

        audio.addEventListener('timeupdate', function() {
          if (audio.currentTime > 0 && !audioStarted) {
            audioStarted = true;
            updateProgressBar();
          }
          if (CONFIG.instantProgressBarFill !== false) return;
          var activeFill = root.querySelector('.as-progress-fill-' + currentIndex);
          if (activeFill && audio.duration) {
            var pct = (audio.currentTime / audio.duration) * 100;
            activeFill.style.width = pct + '%';
          }
        });

        audio.addEventListener('ended', function() {
          var currentSlide = CONFIG.slides[currentIndex];
          if (currentSlide) completedSlides.add(currentSlide.id);
          updateProgressBar();
          updateControlsUI(true);

          if (CONFIG.autoAdvance && currentIndex < CONFIG.slides.length - 1) {
            setTimeout(function() {
              loadSlide(currentIndex + 1);
            }, 600);
          }
        });

        audio.addEventListener('error', function() {
          var currentSlide = CONFIG.slides[currentIndex];
          if (currentSlide) completedSlides.add(currentSlide.id);
          updateProgressBar();
          updateControlsUI(true);
          if (playOverlay) playOverlay.style.display = 'none';
        });
      }

      function loadSlide(index) {
        currentIndex = index;
        var slide = CONFIG.slides[currentIndex];
        if (!slide) return;

        if (Boolean(CONFIG.flashTransition) && flashOverlay) {
          flashOverlay.style.transition = 'none';
          flashOverlay.style.opacity = '1';
          setTimeout(function() {
            flashOverlay.style.transition = 'opacity 0.2s ease-out';
            flashOverlay.style.opacity = '0';
          }, 20);
        }

        for (var i = 0; i < CONFIG.slides.length; i++) {
          var img = root.querySelector('.as-slide-img-' + i);
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

        if (audio) {
          audio.src = slide.audioUrl || '';
          audio.load();
        }

        if (CONFIG.showCaptions && (slide.title || slide.caption)) {
          if (captionBox) captionBox.style.display = 'flex';
          if (titleEl) titleEl.textContent = slide.title || '';
          if (textEl) textEl.textContent = slide.caption || '';
        } else {
          if (captionBox) captionBox.style.display = 'none';
        }

        var isDone = completedSlides.has(slide.id);
        updateControlsUI(isDone);

        if (audioStarted) {
          if (playOverlay) playOverlay.style.display = 'none';
          if (audio) {
            var playPromise = audio.play();
            if (playPromise !== undefined) {
              playPromise.then(function() {
                updateProgressBar();
              }).catch(function(err) {
                console.warn('Playback error:', err);
              });
            }
          }
        } else {
          if (playOverlay) playOverlay.style.display = 'flex';
        }
      }

      function updateControlsUI(isUnlocked) {
        var isLastSlide = currentIndex === CONFIG.slides.length - 1;
        var isLastSlideCompleted = isLastSlide && completedSlides.has(CONFIG.slides[currentIndex].id);
        var isAudioBypassed = Boolean(CONFIG.advanceOnClickImage) && audioStarted;
        var canProceed = isUnlocked || isAudioBypassed;
        var showReplay = isLastSlide && (completedSlides.has(CONFIG.slides[currentIndex].id) || isAudioBypassed);

        if (prevBtn) {
          if (!CONFIG.autoAdvance && canProceed && currentIndex > 0 && !isLastSlide) {
            prevBtn.style.display = 'flex';
          } else {
            prevBtn.style.display = 'none';
          }
        }

        if (nextBtn) {
          if (!CONFIG.autoAdvance && canProceed && !isLastSlideCompleted) {
            nextBtn.style.display = !isLastSlide ? 'flex' : 'none';
          } else {
            nextBtn.style.display = 'none';
          }
        }

        if (replayBtn) {
          replayBtn.style.display = showReplay ? 'flex' : 'none';
        }
      }

      if (mediaContainer) {
        mediaContainer.addEventListener('click', function(e) {
          if (e.target && e.target.closest('button')) return;
          if (!audioStarted) {
            startPresentation();
            return;
          }
          if (CONFIG.advanceOnClickImage && currentIndex < CONFIG.slides.length - 1) {
            loadSlide(currentIndex + 1);
          }
        });
      }

      function startPresentation() {
        audioStarted = true;
        if (playOverlay) playOverlay.style.display = 'none';
        if (audio) {
          audio.play().then(function() {
            updateProgressBar();
            updateControlsUI(false);
          }).catch(function(err) {
            console.warn('Audio play error:', err);
            updateControlsUI(true);
          });
        }
      }

      if (startAudioBtn) {
        startAudioBtn.addEventListener('click', function(e) {
          e.stopPropagation();
          startPresentation();
        });
      }

      if (prevBtn) {
        prevBtn.addEventListener('click', function(e) {
          e.stopPropagation();
          if (currentIndex > 0) {
            loadSlide(currentIndex - 1);
          }
        });
      }

      if (nextBtn) {
        nextBtn.addEventListener('click', function(e) {
          e.stopPropagation();
          var isAudioBypassed = Boolean(CONFIG.advanceOnClickImage) && audioStarted;
          var canProceed = completedSlides.has(CONFIG.slides[currentIndex].id) || isAudioBypassed;
          if (canProceed && currentIndex < CONFIG.slides.length - 1) {
            loadSlide(currentIndex + 1);
          }
        });
      }

      if (replayBtn) {
        replayBtn.addEventListener('click', function(e) {
          e.stopPropagation();
          if (audio) {
            audio.pause();
            audio.currentTime = 0;
          }
          completedSlides.clear();
          audioStarted = false;
          replayBtn.style.display = 'none';
          loadSlide(0);
        });
      }

      // Initialize slide 0
      loadSlide(0);
    })();
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

  return `<iframe src="${embedUrl}" width="${w}" height="${h}" style="border: 0; border-radius: 12px; overflow: hidden; width: 100%; max-width: ${w}px;" allow="autoplay; encrypted-media; fullscreen" loading="lazy" title="${escapeHtml(config.title || 'Slideshow')}"></iframe>`;
}

