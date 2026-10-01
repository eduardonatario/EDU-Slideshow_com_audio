import React, { useState } from 'react';
import { SlideSize } from '../types';
import { Monitor, Settings, Play, Download, Sparkles, Volume2, Copy, Check } from 'lucide-react';

interface NavbarProps {
  mode: 'player' | 'editor';
  setMode: (mode: 'player' | 'editor') => void;
  size: SlideSize;
  setSize: (size: SlideSize) => void;
  onDownloadHtml: () => void;
  onCopyHtml: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  mode,
  setMode,
  size,
  setSize,
  onDownloadHtml,
  onCopyHtml
}) => {
  const [copiedHtml, setCopiedHtml] = useState(false);

  const handleCopyHtml = () => {
    onCopyHtml();
    setCopiedHtml(true);
    setTimeout(() => setCopiedHtml(false), 2000);
  };
  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200 text-slate-900 px-4 sm:px-8 py-3.5 shadow-xs">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-md shadow-blue-600/20">
            <Volume2 className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-bold text-lg tracking-tight text-slate-900">
                Audio Slideshow
              </h1>
            </div>
            <p className="text-xs text-slate-500 font-medium">
              Criador de Audio Slideshow
            </p>
          </div>
        </div>

        {/* Center Mode Controls */}
        <div className="flex items-center bg-slate-100 border border-slate-200/80 rounded-full p-1 gap-1">
          <button
            onClick={() => setMode('player')}
            className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
              mode === 'player'
                ? 'bg-blue-600 text-white shadow-xs font-bold'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
            }`}
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            Modo Apresentação
          </button>
          <button
            onClick={() => setMode('editor')}
            className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
              mode === 'editor'
                ? 'bg-blue-600 text-white shadow-xs font-bold'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
            }`}
          >
            <Settings className="w-3.5 h-3.5" />
            Configuração
          </button>
        </div>

        {/* Right Actions & Size Selector */}
        <div className="flex items-center gap-2">
          {/* Size Selector Group */}
          <div className="hidden lg:flex items-center bg-slate-100 border border-slate-200 rounded-full p-1 text-xs text-slate-500">
            <span className="px-2.5 text-[10px] uppercase font-bold text-slate-400 tracking-wider">Tamanho:</span>
            {(['small', 'medium', 'large'] as SlideSize[]).map((s) => (
              <button
                key={s}
                onClick={() => setSize(s)}
                className={`px-3 py-1 rounded-full capitalize font-semibold text-xs transition-all ${
                  size === s
                    ? 'bg-blue-600 text-white shadow-xs font-bold'
                    : 'hover:text-slate-900'
                }`}
              >
                {s === 'small' ? 'Pequeno' : s === 'medium' ? 'Médio' : 'Grande'}
              </button>
            ))}
          </div>

          {/* Copy HTML & Download Actions */}
          <button
            onClick={handleCopyHtml}
            className="flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold bg-white text-slate-700 hover:bg-slate-50 border border-slate-200 shadow-2xs transition-colors cursor-pointer"
            title="Copiar código HTML do slideshow para a área de transferência"
          >
            {copiedHtml ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-emerald-700 font-bold">Copiado!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-slate-700" />
                <span>Copiar html</span>
              </>
            )}
          </button>

          <button
            onClick={onDownloadHtml}
            className="flex items-center gap-1.5 px-4.5 py-2 rounded-full text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white shadow-xs transition-colors"
            title="Baixar arquivo HTML autônomo"
          >
            <Download className="w-3.5 h-3.5 text-white" />
            <span className="hidden sm:inline">Baixar HTML</span>
          </button>
        </div>
      </div>
    </header>
  );
};
