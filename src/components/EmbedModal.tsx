import React, { useState } from 'react';
import { SlideshowConfig } from '../types';
import { X, Code, Copy, Check, Download, Monitor, Globe, Sparkles } from 'lucide-react';
import { generateEmbedCode, downloadHtmlFile } from '../utils/htmlExporter';

interface EmbedModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: SlideshowConfig;
  appUrl: string;
}

export const EmbedModal: React.FC<EmbedModalProps> = ({
  isOpen,
  onClose,
  config,
  appUrl
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const embedCode = generateEmbedCode(config, appUrl);

  const handleCopy = () => {
    navigator.clipboard.writeText(embedCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white border border-slate-200 rounded-3xl max-w-2xl w-full p-8 space-y-6 shadow-2xl relative animate-in fade-in zoom-in-95 duration-200 text-slate-900">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-slate-900 p-2 rounded-full hover:bg-slate-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-blue-600 text-white flex items-center justify-center">
            <Code className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900">Exportação & Embed do Slideshow</h3>
            <p className="text-xs text-slate-500">
              Incorpore o slideshow no seu site ou baixe o arquivo HTML.
            </p>
          </div>
        </div>

        {/* Option 1: Standalone HTML Download */}
        <div className="p-5 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-900 uppercase tracking-wider">
              <Download className="w-4 h-4 text-blue-600" />
              1. Baixar Arquivo HTML Autônomo
            </div>
            <button
              onClick={() => {
                downloadHtmlFile(config, `${config.title || 'slideshow'}.html`);
              }}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all shadow-sm"
            >
              <Download className="w-3.5 h-3.5 text-white" />
              Baixar HTML
            </button>
          </div>
          <p className="text-xs text-slate-500">
            Arquivo HTML único com todos os slides, player, áudios integrados e trava ativada.
          </p>
        </div>

        {/* Option 2: Embed Code (Iframe) */}
        <div className="p-5 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-900 uppercase tracking-wider">
              <Globe className="w-4 h-4 text-blue-600" />
              2. Código de Incorporação Iframe
            </div>
            <button
              onClick={handleCopy}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all shadow-sm"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-300" />
                  Copiado!
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-white" />
                  Copiar Código
                </>
              )}
            </button>
          </div>

          <textarea
            readOnly
            value={embedCode}
            rows={3}
            className="w-full p-3 bg-white border border-slate-200 rounded-xl font-mono text-xs text-slate-800 focus:outline-none"
          />

          <div className="text-xs text-slate-500">
            Tamanho configurado: <span className="text-black font-bold uppercase">{config.size}</span>. O layout se adapta responsivamente ao container do site destino.
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end pt-2">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-full text-xs font-semibold transition-colors border border-slate-200"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};
