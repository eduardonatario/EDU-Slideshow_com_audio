import React, { useState, useEffect } from 'react';
import { SlideshowConfig, SlideSize } from './types';
import { INITIAL_CONFIG } from './data/presetSlides';
import { Navbar } from './components/Navbar';
import { SlideshowPlayer } from './components/SlideshowPlayer';
import { ConfigPanel } from './components/ConfigPanel';
import { EmbedModal } from './components/EmbedModal';
import { downloadHtmlFile } from './utils/htmlExporter';

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
        if (parsed.title === 'Apresentação Interativa de Exemplo' || parsed.title === 'AudioSlide Pro' || parsed.title === 'Slide show com áudio') {
          parsed.title = 'Slideshow com áudio';
        }
        return parsed;
      }
    } catch (e) {
      console.warn('Failed to parse saved slideshow config:', e);
    }
    return INITIAL_CONFIG;
  });

  const [mode, setMode] = useState<'player' | 'editor'>('player');
  const [isEmbedModalOpen, setIsEmbedModalOpen] = useState(false);

  // Save to localStorage on change
  useEffect(() => {
    try {
      localStorage.setItem('slideshow_config_v3', JSON.stringify(config));
    } catch (e) {
      console.warn('Failed to save slideshow config:', e);
    }
  }, [config]);

  const handleUpdateSize = (size: SlideSize) => {
    setConfig((prev) => ({ ...prev, size }));
  };

  const handleDownloadHtml = () => {
    downloadHtmlFile(config, `${config.title || 'slideshow'}.html`);
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
        onOpenEmbedModal={() => setIsEmbedModalOpen(true)}
      />

      {/* Main Body View */}
      <main className="flex-1 py-8 px-4 sm:px-8 max-w-7xl mx-auto w-full">
        {mode === 'player' ? (
          <div className="space-y-6">
            <SlideshowPlayer
              config={config}
              onEditConfig={() => setMode('editor')}
            />

            {/* Quick Hints Footer Banner */}
            <div className="max-w-xl mx-auto p-4 bg-white border border-slate-200 rounded-2xl shadow-xs text-center text-xs text-slate-500 space-y-1">
              <p className="font-semibold text-slate-800">
                🔒 Trava Ativa: O botão "Próximo Slide" só é ativado após o término do áudio.
              </p>
              <p className="text-slate-500">
                Alterne para a <span className="text-black font-semibold">Configuração</span> no topo para gerenciar imagens, áudios e tamanhos.
              </p>
            </div>
          </div>
        ) : (
          <ConfigPanel
            config={config}
            onChangeConfig={setConfig}
            appUrl={appUrl}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="py-4 border-t border-slate-200/80 bg-white text-center text-xs text-slate-400 font-medium">
        Criador de slideshow com áudio
      </footer>

      {/* Embed & Download Popup Modal */}
      <EmbedModal
        isOpen={isEmbedModalOpen}
        onClose={() => setIsEmbedModalOpen(false)}
        config={config}
        appUrl={appUrl}
      />
    </div>
  );
}
