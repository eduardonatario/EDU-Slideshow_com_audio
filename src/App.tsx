import React, { useState, useEffect } from 'react';
import { SlideshowConfig, SlideSize } from './types';
import { INITIAL_CONFIG } from './data/presetSlides';
import { Navbar } from './components/Navbar';
import { SlideshowPlayer } from './components/SlideshowPlayer';
import { ConfigPanel } from './components/ConfigPanel';
import { downloadHtmlFile, generateStandaloneHtml } from './utils/htmlExporter';

const DEFAULT_AUDIO_URLS = [
  'https://www.image2url.com/r2/default/videos/1786109221182-a26d10ae-fed4-4489-a0f2-922bb88b1d09.mp4',
  'https://www.image2url.com/r2/default/videos/1786109394770-93e5b433-ee9b-4eeb-a794-e10b3cd6eb25.mp4',
  'https://www.image2url.com/r2/default/videos/1786109436532-63d7442c-4e76-41c8-ac1f-b67821d8d4e7.mp4',
  'https://www.image2url.com/r2/default/videos/1786109476505-e4d4dffc-0f09-4ffe-9b6d-708f14063801.mp4',
  'https://www.image2url.com/r2/default/videos/1786109436532-63d7442c-4e76-41c8-ac1f-b67821d8d4e7.mp4'
];

export default function App() {
  // Check if URL has ?embed=true
  const isEmbedMode = new URLSearchParams(window.location.search).get('embed') === 'true';

  // Load config from localStorage if available
  const [config, setConfig] = useState<SlideshowConfig>(() => {
    try {
      const saved = localStorage.getItem('slideshow_config_v3');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.slides && Array.isArray(parsed.slides)) {
          parsed.slides = parsed.slides.map((slide: any, idx: number) => {
            if (DEFAULT_AUDIO_URLS[idx]) {
              slide.audioUrl = DEFAULT_AUDIO_URLS[idx];
            }
            const titleLower = (slide.title || '').toLowerCase().trim();
            if (
              !slide.title ||
              titleLower.startsWith('novo slide') ||
              titleLower.startsWith('abertura') ||
              titleLower.startsWith('capítulo') ||
              titleLower.startsWith('conclusão') ||
              titleLower.startsWith('slide ') ||
              titleLower === 'slide'
            ) {
              return { ...slide, title: `SLIDE ${idx + 1}` };
            }
            return slide;
          });
        }
        if (parsed.flashTransition === undefined || (parsed.flashTransition === true && parsed.slides?.[0]?.id === 'slide-1')) {
          parsed.flashTransition = false;
        }
        if (parsed.showProgressBar === undefined) {
          parsed.showProgressBar = true;
        }
        if (parsed.instantProgressBarFill === undefined || (parsed.instantProgressBarFill === false && parsed.slides?.[0]?.id === 'slide-1')) {
          parsed.instantProgressBarFill = true;
        }
        if (parsed.advanceOnClickImage === undefined) {
          parsed.advanceOnClickImage = false;
        }
        if (parsed.disableInitialDarkOverlay === undefined) {
          parsed.disableInitialDarkOverlay = false;
        }
        if (parsed.customWidth === undefined) {
          parsed.customWidth = parsed.size === 'small' ? 520 : parsed.size === 'large' ? 1100 : 800;
        }
        if (parsed.customHeight === undefined) {
          parsed.customHeight = parsed.size === 'small' ? 293 : parsed.size === 'large' ? 619 : 450;
        }
        if (
          parsed.title === 'Apresentação Interativa de Exemplo' ||
          parsed.title === 'AudioSlide Pro' ||
          parsed.title === 'Slide show com áudio' ||
          parsed.title === 'Slideshow com áudio'
        ) {
          parsed.title = 'Audio Slideshow';
        }
        return parsed;
      }
    } catch (e) {
      console.warn('Failed to parse saved slideshow config:', e);
    }
    return INITIAL_CONFIG;
  });

  const [mode, setMode] = useState<'player' | 'editor'>('player');

  // Save to localStorage on change
  useEffect(() => {
    try {
      localStorage.setItem('slideshow_config_v3', JSON.stringify(config));
    } catch (e) {
      console.warn('Failed to save slideshow config:', e);
    }
  }, [config]);

  const handleUpdateSize = (size: SlideSize) => {
    setConfig((prev) => {
      let customWidth = prev.customWidth || 800;
      let customHeight = prev.customHeight || 450;
      if (size === 'small') {
        customWidth = 520;
        customHeight = 293;
      } else if (size === 'medium') {
        customWidth = 800;
        customHeight = 450;
      } else if (size === 'large') {
        customWidth = 1100;
        customHeight = 619;
      }
      return { ...prev, size, customWidth, customHeight };
    });
  };

  const handleDownloadHtml = () => {
    downloadHtmlFile(config, `${config.title || 'slideshow'}.html`);
  };

  const handleCopyHtml = async () => {
    const html = generateStandaloneHtml(config);
    try {
      await navigator.clipboard.writeText(html);
    } catch {
      const textarea = document.createElement('textarea');
      textarea.value = html;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
    }
  };

  const appUrl = window.location.origin + window.location.pathname;

  // Standalone Embed view
  if (isEmbedMode) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-2">
        <SlideshowPlayer config={config} isEmbedView={true} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-[#1A1A1A] font-sans selection:bg-black selection:text-white flex flex-col">
      {/* Top Header / Navigation */}
      <Navbar
        mode={mode}
        setMode={setMode}
        size={config.size}
        setSize={handleUpdateSize}
        onDownloadHtml={handleDownloadHtml}
        onCopyHtml={handleCopyHtml}
      />

      {/* Main Body View */}
      <main className="flex-1 py-8 px-4 sm:px-8 max-w-7xl mx-auto w-full">
        {mode === 'player' ? (
          <div className="space-y-6">
            <SlideshowPlayer
              config={config}
              onEditConfig={() => setMode('editor')}
            />
          </div>
        ) : (
          <ConfigPanel
            config={config}
            onChangeConfig={setConfig}
            appUrl={appUrl}
          />
        )}
      </main>
    </div>
  );
}
