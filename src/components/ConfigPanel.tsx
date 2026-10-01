import React, { useState } from 'react';
import { SlideshowConfig, Slide, SlideSize } from '../types';
import {
  Plus,
  Trash2,
  MoveUp,
  MoveDown,
  Upload,
  Image as ImageIcon,
  Music,
  Settings2,
  Copy,
  Check,
  Download,
  Code,
  Layout,
  Volume2,
  Sparkles,
  Layers,
  Info
} from 'lucide-react';
import { downloadHtmlFile, generateEmbedCode } from '../utils/htmlExporter';

interface ConfigPanelProps {
  config: SlideshowConfig;
  onChangeConfig: (newConfig: SlideshowConfig) => void;
  appUrl: string;
}

// Royalty-free samples for quick creator selection
const SAMPLE_IMAGES = [
  { label: 'Praia / Mar', url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80' },
  { label: 'Montanhas', url: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80' },
  { label: 'Floresta', url: 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=1200&q=80' },
  { label: 'Pôr do Sol', url: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=80' },
  { label: 'Tecnologia / Minimalista', url: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80' }
];

const SAMPLE_AUDIOS = [
  { label: 'Som Suave 1 (Freesound)', url: 'https://cdn.freesound.org/previews/682/682136_11861866-lq.mp3' },
  { label: 'Som Místico 2 (Freesound)', url: 'https://cdn.freesound.org/previews/612/612095_11861866-lq.mp3' },
  { label: 'Som Relaxante 3 (Freesound)', url: 'https://cdn.freesound.org/previews/560/560824_11861866-lq.mp3' },
  { label: 'Som Piano 4 (Freesound)', url: 'https://cdn.freesound.org/previews/612/612092_11861866-lq.mp3' }
];

export const ConfigPanel: React.FC<ConfigPanelProps> = ({ config, onChangeConfig, appUrl }) => {
  const [selectedSlideId, setSelectedSlideId] = useState<string>(config.slides[0]?.id || '');
  const [copiedEmbed, setCopiedEmbed] = useState(false);

  const selectedSlide = config.slides.find((s) => s.id === selectedSlideId) || config.slides[0];

  const handleUpdateTitle = (title: string) => {
    onChangeConfig({ ...config, title });
  };

  const handleUpdateSize = (size: SlideSize) => {
    onChangeConfig({ ...config, size });
  };

  const handleUpdateAutoAdvance = (autoAdvance: boolean) => {
    onChangeConfig({ ...config, autoAdvance });
  };

  const handleUpdateShowCaptions = (showCaptions: boolean) => {
    onChangeConfig({ ...config, showCaptions });
  };

  const handleUpdateFlashTransition = (flashTransition: boolean) => {
    onChangeConfig({ ...config, flashTransition });
  };

  const handleUpdateShowProgressBar = (showProgressBar: boolean) => {
    onChangeConfig({ ...config, showProgressBar });
  };

  const handleUpdateInstantProgressBarFill = (instantProgressBarFill: boolean) => {
    onChangeConfig({ ...config, instantProgressBarFill });
  };

  const handleAddSlide = () => {
    const newSlide: Slide = {
      id: `slide-${Date.now()}`,
      title: `SLIDE ${config.slides.length + 1}`,
      imageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
      audioUrl: 'https://cdn.freesound.org/previews/682/682136_11861866-lq.mp3',
      caption: 'Adicione uma legenda informativa para este slide.'
    };
    const updated = [...config.slides, newSlide];
    onChangeConfig({ ...config, slides: updated });
    setSelectedSlideId(newSlide.id);
  };

  const handleDeleteSlide = (id: string) => {
    if (config.slides.length <= 1) {
      alert('A apresentação precisa ter pelo menos 1 slide.');
      return;
    }
    const updated = config.slides.filter((s) => s.id !== id);
    onChangeConfig({ ...config, slides: updated });
    if (selectedSlideId === id) {
      setSelectedSlideId(updated[0]?.id || '');
    }
  };

  const handleMoveSlide = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= config.slides.length) return;

    const updated = [...config.slides];
    const temp = updated[index];
    updated[index] = updated[targetIndex];
    updated[targetIndex] = temp;
    onChangeConfig({ ...config, slides: updated });
  };

  const handleUpdateSlideField = (id: string, field: keyof Slide, value: string) => {
    const updated = config.slides.map((s) => (s.id === id ? { ...s, [field]: value } : s));
    onChangeConfig({ ...config, slides: updated });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, field: 'imageUrl' | 'audioUrl') => {
    const file = e.target.files?.[0];
    if (!file || !selectedSlide) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      if (dataUrl) {
        handleUpdateSlideField(selectedSlide.id, field, dataUrl);
      }
    };
    reader.readAsDataURL(file);
  };

  const embedCode = generateEmbedCode(config, appUrl);

  const handleCopyEmbed = () => {
    navigator.clipboard.writeText(embedCode);
    setCopiedEmbed(true);
    setTimeout(() => setCopiedEmbed(false), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 text-slate-800">
      {/* Configuration Hero Bento Card */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-8 bg-white border border-slate-200 rounded-3xl shadow-xs">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="bg-slate-100 text-[10px] uppercase font-bold px-2.5 py-0.5 rounded-full text-slate-500 tracking-wider border border-slate-200">
              Painel de Edição
            </span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Settings2 className="w-5 h-5 text-slate-700" />
            Configuração da Apresentação
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Defina imagens, áudios, opções de avanço e exportação autônoma.
          </p>
        </div>

        {/* Global Action Buttons */}
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => downloadHtmlFile(config, `${config.title || 'slideshow'}.html`)}
            className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-full text-xs shadow-sm transition-all"
          >
            <Download className="w-4 h-4 text-white" />
            Baixar Arquivo HTML
          </button>
        </div>
      </div>

      {/* Main Grid Layout: General Settings + Slide Manager + Slide Detail */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column (4 cols): General Settings + Slide List */}
        <div className="lg:col-span-4 space-y-6">
          {/* General Settings Bento Card */}
          <div className="p-6 bg-white border border-slate-200 rounded-3xl shadow-xs space-y-5">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2 border-b border-slate-100 pb-3">
              <Layout className="w-4 h-4 text-blue-600" />
              Opções Gerais
            </h3>

            {/* Title */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Título da Apresentação</label>
              <input
                type="text"
                value={config.title}
                onChange={(e) => handleUpdateTitle(e.target.value)}
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:bg-white focus:border-blue-600 focus:ring-1 focus:ring-blue-600 font-medium transition-all"
                placeholder="Ex: Treinamento Corporativo 2026"
              />
            </div>

            {/* Slideshow Size Selection (3 Sizes) */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-2">
                Tamanho da Apresentação (3 Opções)
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'small', label: 'Pequeno', desc: '520px' },
                  { id: 'medium', label: 'Médio', desc: '800px' },
                  { id: 'large', label: 'Grande', desc: '1100px' }
                ].map((s) => (
                  <button
                    key={s.id}
                    onClick={() => handleUpdateSize(s.id as SlideSize)}
                    className={`p-2.5 rounded-2xl border text-center transition-all ${
                      config.size === s.id
                        ? 'bg-blue-600 text-white border-blue-600 font-bold shadow-xs'
                        : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <div className="text-xs font-bold capitalize">{s.label}</div>
                    <div className={`text-[10px] ${config.size === s.id ? 'text-blue-100' : 'text-slate-400'}`}>
                      {s.desc}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Checkbox Options */}
            <div className="space-y-3 pt-3 border-t border-slate-100">
              <label className="flex items-start gap-2.5 cursor-pointer text-xs text-slate-600 font-medium">
                <input
                  type="checkbox"
                  checked={config.autoAdvance}
                  onChange={(e) => handleUpdateAutoAdvance(e.target.checked)}
                  className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 mt-0.5"
                />
                <span>Avançar para o próximo slide automaticamente após o término do áudio</span>
              </label>

              <label className="flex items-start gap-2.5 cursor-pointer text-xs text-slate-600 font-medium">
                <input
                  type="checkbox"
                  checked={config.showCaptions}
                  onChange={(e) => handleUpdateShowCaptions(e.target.checked)}
                  className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 mt-0.5"
                />
                <span>Exibir legendas e títulos sobrepostos na imagem</span>
              </label>

              <label className="flex items-start gap-2.5 cursor-pointer text-xs text-slate-600 font-medium">
                <input
                  type="checkbox"
                  checked={config.flashTransition ?? false}
                  onChange={(e) => handleUpdateFlashTransition(e.target.checked)}
                  className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 mt-0.5"
                />
                <span>Efeito de piscar branco ao passar para o próximo slide</span>
              </label>

              <label className="flex items-start gap-2.5 cursor-pointer text-xs text-slate-600 font-medium">
                <input
                  type="checkbox"
                  checked={config.showProgressBar ?? true}
                  onChange={(e) => handleUpdateShowProgressBar(e.target.checked)}
                  className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 mt-0.5"
                />
                <span>Exibir barra de progresso abaixo do slideshow</span>
              </label>

              {(config.showProgressBar ?? true) && (
                <label className="flex items-start gap-2.5 cursor-pointer text-xs text-slate-500 font-medium ml-6 pl-2 border-l-2 border-blue-200">
                  <input
                    type="checkbox"
                    checked={config.instantProgressBarFill ?? false}
                    onChange={(e) => handleUpdateInstantProgressBarFill(e.target.checked)}
                    className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 mt-0.5"
                  />
                  <span>Acender a barra azul de uma vez ao entrar no slide (sem seguir o áudio)</span>
                </label>
              )}
            </div>
          </div>

          {/* Slide List Manager Bento Card */}
          <div className="p-6 bg-white border border-slate-200 rounded-3xl shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                <Layers className="w-4 h-4 text-blue-600" />
                Slides ({config.slides.length})
              </h3>
              <button
                onClick={handleAddSlide}
                className="flex items-center gap-1 px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-full text-xs font-semibold transition-all shadow-xs"
              >
                <Plus className="w-3.5 h-3.5" />
                Adicionar
              </button>
            </div>

            {/* Slide Item List */}
            <div className="space-y-2 max-h-[400px] overflow-y-auto pr-1">
              {config.slides.map((slide, index) => {
                const isSelected = slide.id === selectedSlideId;

                return (
                  <div
                    key={slide.id}
                    onClick={() => setSelectedSlideId(slide.id)}
                    className={`p-3 rounded-2xl border flex items-center justify-between gap-3 cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-blue-600 text-white border-blue-600 shadow-sm font-bold'
                        : 'bg-slate-50 border-slate-200 hover:border-slate-300 text-slate-800'
                    }`}
                  >
                    {/* Active Accent Bar & Thumbnail */}
                    <div className="flex items-center gap-3 overflow-hidden">
                      {isSelected && <div className="w-1 h-8 bg-white rounded-full flex-shrink-0" />}
                      <div className="relative w-12 h-9 rounded-xl bg-slate-200 overflow-hidden flex-shrink-0 border border-slate-300/60">
                        <img src={slide.imageUrl} alt="" className="w-full h-full object-cover" />
                        <span className={`absolute bottom-0 right-0 text-[9px] font-mono font-bold px-1 rounded-tl ${isSelected ? 'bg-blue-950 text-white' : 'bg-slate-900 text-white'}`}>
                          #{index + 1}
                        </span>
                      </div>
                      <div className="truncate">
                        <div className={`text-xs font-bold truncate ${isSelected ? 'text-white' : 'text-slate-900'}`}>
                          {slide.title || `SLIDE ${index + 1}`}
                        </div>
                        <div className={`text-[10px] truncate flex items-center gap-1 ${isSelected ? 'text-blue-100' : 'text-slate-500'}`}>
                          <Music className={`w-2.5 h-2.5 ${isSelected ? 'text-blue-200' : 'text-blue-500'}`} />
                          {slide.audioUrl ? 'Áudio vinculado' : 'Sem áudio'}
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-1 flex-shrink-0">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleMoveSlide(index, 'up');
                        }}
                        disabled={index === 0}
                        className={`p-1 hover:text-blue-200 disabled:opacity-20 ${isSelected ? 'text-blue-100' : 'text-slate-500 hover:text-blue-600'}`}
                        title="Mover para cima"
                      >
                        <MoveUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleMoveSlide(index, 'down');
                        }}
                        disabled={index === config.slides.length - 1}
                        className={`p-1 hover:text-blue-200 disabled:opacity-20 ${isSelected ? 'text-blue-100' : 'text-slate-500 hover:text-blue-600'}`}
                        title="Mover para baixo"
                      >
                        <MoveDown className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteSlide(slide.id);
                        }}
                        className={`p-1 ml-0.5 ${isSelected ? 'text-rose-200 hover:text-white' : 'text-rose-500 hover:text-rose-600'}`}
                        title="Excluir Slide"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column (8 cols): Selected Slide Editor + Embed Code */}
        <div className="lg:col-span-8 space-y-6">
          {selectedSlide ? (
            <div className="p-8 bg-white border border-slate-200 rounded-3xl shadow-xs space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <ImageIcon className="w-4 h-4 text-blue-600" />
                  Editando Slide: <span className="text-blue-600 underline font-bold">{selectedSlide.title || 'Sem Título'}</span>
                </h3>
                <span className="bg-blue-50 text-[10px] font-mono font-bold px-2.5 py-1 rounded-full text-blue-700 border border-blue-200">
                  ID: {selectedSlide.id}
                </span>
              </div>

              {/* Title & Caption */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Título do Slide
                  </label>
                  <input
                    type="text"
                    value={selectedSlide.title}
                    onChange={(e) => handleUpdateSlideField(selectedSlide.id, 'title', e.target.value)}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:bg-white focus:border-blue-600 focus:ring-1 focus:ring-blue-600 font-medium transition-all"
                    placeholder="Ex: Introdução ao Módulo"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Legenda / Descrição
                  </label>
                  <input
                    type="text"
                    value={selectedSlide.caption || ''}
                    onChange={(e) => handleUpdateSlideField(selectedSlide.id, 'caption', e.target.value)}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:bg-white focus:border-blue-600 focus:ring-1 focus:ring-blue-600 font-medium transition-all"
                    placeholder="Ex: Ouça a explicação antes de prosseguir."
                  />
                </div>
              </div>

              {/* Image URL & Upload */}
              <div className="space-y-2">
                <label className="block text-xs font-semibold text-slate-700 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <ImageIcon className="w-3.5 h-3.5 text-blue-600" />
                    URL da Imagem
                  </span>
                  <span className="text-[10px] text-slate-400 font-medium">Ou envie um arquivo do seu computador</span>
                </label>

                <div className="flex gap-2">
                  <input
                    type="text"
                    value={selectedSlide.imageUrl}
                    onChange={(e) => handleUpdateSlideField(selectedSlide.id, 'imageUrl', e.target.value)}
                    className="flex-1 px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono text-slate-800 focus:outline-none focus:bg-white focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                    placeholder="https://exemplo.com/imagem.jpg"
                  />
                  <label className="flex items-center gap-1.5 px-4 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-xl text-xs font-semibold cursor-pointer transition-colors border border-blue-200 flex-shrink-0">
                    <Upload className="w-3.5 h-3.5" />
                    Upload
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileUpload(e, 'imageUrl')}
                      className="hidden"
                    />
                  </label>
                </div>

                {/* Sample Presets for Images */}
                <div className="flex flex-wrap items-center gap-1.5 pt-1">
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mr-1">Fotos exemplo:</span>
                  {SAMPLE_IMAGES.map((sample) => (
                    <button
                      key={sample.label}
                      type="button"
                      onClick={() => handleUpdateSlideField(selectedSlide.id, 'imageUrl', sample.url)}
                      className="text-[10px] px-2.5 py-1 bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-blue-700 rounded-full font-medium transition-colors border border-slate-200/80 hover:border-blue-200"
                    >
                      {sample.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Audio URL & Upload */}
              <div className="space-y-2">
                <label className="block text-xs font-semibold text-slate-700 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Music className="w-3.5 h-3.5 text-blue-600" />
                    URL do Áudio Específico (MP3, WAV, AAC)
                  </span>
                  <span className="text-[10px] text-slate-400 font-medium">O usuário precisa ouvir tudo para avançar</span>
                </label>

                <div className="flex gap-2">
                  <input
                    type="text"
                    value={selectedSlide.audioUrl}
                    onChange={(e) => handleUpdateSlideField(selectedSlide.id, 'audioUrl', e.target.value)}
                    className="flex-1 px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono text-slate-800 focus:outline-none focus:bg-white focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                    placeholder="https://exemplo.com/audio.mp3"
                  />
                  <label className="flex items-center gap-1.5 px-4 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-xl text-xs font-semibold cursor-pointer transition-colors border border-blue-200 flex-shrink-0">
                    <Upload className="w-3.5 h-3.5" />
                    Upload
                    <input
                      type="file"
                      accept="audio/*"
                      onChange={(e) => handleFileUpload(e, 'audioUrl')}
                      className="hidden"
                    />
                  </label>
                </div>

                {/* Sample Presets for Audio */}
                <div className="flex flex-wrap items-center gap-1.5 pt-1">
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mr-1">Áudios exemplo:</span>
                  {SAMPLE_AUDIOS.map((sample) => (
                    <button
                      key={sample.label}
                      type="button"
                      onClick={() => handleUpdateSlideField(selectedSlide.id, 'audioUrl', sample.url)}
                      className="text-[10px] px-2.5 py-1 bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-blue-700 rounded-full font-medium transition-colors border border-slate-200/80 hover:border-blue-200"
                    >
                      {sample.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Preview Box */}
              <div className="pt-2">
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                  Pré-visualização do Slide
                </label>
                <div className="relative aspect-video rounded-2xl overflow-hidden bg-black border border-slate-200 max-w-md mx-auto shadow-md">
                  <img
                    src={selectedSlide.imageUrl}
                    alt=""
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80';
                    }}
                  />
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black via-black/70 to-transparent p-4">
                    <div className="text-xs font-bold text-white">{selectedSlide.title}</div>
                    <div className="text-[11px] text-slate-300">{selectedSlide.caption}</div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-8 text-center text-slate-400 bg-white border border-slate-200 rounded-3xl">
              Nenhum slide selecionado.
            </div>
          )}

          {/* Embed Preparation Box */}
          <div className="p-8 bg-white border border-slate-200 rounded-3xl shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Code className="w-4 h-4 text-slate-700" />
                  Código de Incorporação (Embed HTML)
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Copie o código de iframe para incorporar em WordPress, LMS, Notion ou páginas web.
                </p>
              </div>
            </div>

            <div className="relative">
              <textarea
                readOnly
                value={embedCode}
                rows={3}
                className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-2xl font-mono text-xs text-slate-800 focus:outline-none"
              />
              <button
                onClick={handleCopyEmbed}
                className="absolute top-3 right-3 flex items-center gap-1.5 px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-full text-xs font-semibold transition-all shadow-sm"
              >
                {copiedEmbed ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    Copiado!
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    Copiar Código
                  </>
                )}
              </button>
            </div>

            <div className="bg-slate-100 border border-slate-200 rounded-2xl p-4 flex items-start gap-3 text-xs text-slate-700">
              <Info className="w-4 h-4 text-slate-900 flex-shrink-0 mt-0.5" />
              <div>
                <strong>Instruções de Embed:</strong> O iframe carrega a aplicação na versão responsiva sem cabeçalhos de administração. O leitor só conseguirá avançar de slide após a execução completa do arquivo de áudio.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
