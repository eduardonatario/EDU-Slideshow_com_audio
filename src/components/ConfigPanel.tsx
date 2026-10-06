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
  Layout,
  Volume2,
  Sparkles,
  Layers,
  MoveHorizontal,
  MoveVertical,
  Code2,
  Check,
  Copy,
  ShieldCheck
} from 'lucide-react';
import { generateEmbedCode, generateStandaloneHtml } from '../utils/htmlExporter';

interface ConfigPanelProps {
  config: SlideshowConfig;
  onChangeConfig: (newConfig: SlideshowConfig) => void;
  appUrl?: string;
}

// Samples for quick creator selection
const SAMPLE_IMAGES = [
  { label: 'Imagem Slide 1', url: 'https://www.image2url.com/r2/default/files/1786107541110-7147fb41-a0c9-418e-b1ce-8b35b8a7089a.png' },
  { label: 'Imagem Slide 2', url: 'https://www.image2url.com/r2/default/files/1786107637381-4a4d7507-e1b1-43d2-81ca-a658c03c44e7.png' },
  { label: 'Imagem Slide 3', url: 'https://www.image2url.com/r2/default/files/1786107722306-dd051aa1-a869-4dbe-b739-381b420e6c7f.png' },
  { label: 'Imagem Slide 4', url: 'https://www.image2url.com/r2/default/files/1786107816100-36c492a1-ca13-41a0-8a2b-86926cc1793b.png' },
  { label: 'Imagem Slide 5', url: 'https://www.image2url.com/r2/default/files/1786107898812-2c2ea158-182e-44c2-aa05-68c9687c9bc9.png' }
];

const SAMPLE_AUDIOS = [
  { label: 'Áudio Slide 1', url: 'https://www.image2url.com/r2/default/videos/1786109221182-a26d10ae-fed4-4489-a0f2-922bb88b1d09.mp4' },
  { label: 'Áudio Slide 2', url: 'https://www.image2url.com/r2/default/videos/1786109394770-93e5b433-ee9b-4eeb-a794-e10b3cd6eb25.mp4' },
  { label: 'Áudio Slide 3', url: 'https://www.image2url.com/r2/default/videos/1786109436532-63d7442c-4e76-41c8-ac1f-b67821d8d4e7.mp4' },
  { label: 'Áudio Slide 4', url: 'https://www.image2url.com/r2/default/videos/1786109476505-e4d4dffc-0f09-4ffe-9b6d-708f14063801.mp4' },
  { label: 'Áudio Slide 5', url: 'https://www.image2url.com/r2/default/videos/1786109436532-63d7442c-4e76-41c8-ac1f-b67821d8d4e7.mp4' }
];

export const ConfigPanel: React.FC<ConfigPanelProps> = ({ config, onChangeConfig, appUrl }) => {
  const [selectedSlideId, setSelectedSlideId] = useState<string>(config.slides[0]?.id || '');
  const [copiedIframe, setCopiedIframe] = useState(false);
  const [copiedHtmlCode, setCopiedHtmlCode] = useState(false);

  const currentAppUrl = appUrl || (typeof window !== 'undefined' ? window.location.origin + window.location.pathname : '');
  const embedIframeCode = generateEmbedCode(config, currentAppUrl);
  const standaloneHtmlCode = generateStandaloneHtml(config);

  const handleCopyIframe = async () => {
    try {
      await navigator.clipboard.writeText(embedIframeCode);
      setCopiedIframe(true);
      setTimeout(() => setCopiedIframe(false), 2000);
    } catch {
      const textarea = document.createElement('textarea');
      textarea.value = embedIframeCode;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopiedIframe(true);
      setTimeout(() => setCopiedIframe(false), 2000);
    }
  };

  const handleCopyShadowHtml = async () => {
    try {
      await navigator.clipboard.writeText(standaloneHtmlCode);
      setCopiedHtmlCode(true);
      setTimeout(() => setCopiedHtmlCode(false), 2000);
    } catch {
      const textarea = document.createElement('textarea');
      textarea.value = standaloneHtmlCode;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopiedHtmlCode(true);
      setTimeout(() => setCopiedHtmlCode(false), 2000);
    }
  };

  const selectedSlide = config.slides.find((s) => s.id === selectedSlideId) || config.slides[0];

  const handleUpdateTitle = (title: string) => {
    onChangeConfig({ ...config, title });
  };

  const currentWidth = config.customWidth || (config.size === 'small' ? 520 : config.size === 'large' ? 1100 : 800);
  const currentHeight = config.customHeight || (config.size === 'small' ? 293 : config.size === 'large' ? 619 : 450);

  const handleUpdateSize = (size: SlideSize) => {
    let customWidth = config.customWidth || 800;
    let customHeight = config.customHeight || 450;
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
    onChangeConfig({ ...config, size, customWidth, customHeight });
  };

  const handleCustomDimensionChange = (width: number, height: number) => {
    const validWidth = Math.min(1920, Math.max(280, Number(width) || 800));
    const validHeight = Math.min(1600, Math.max(180, Number(height) || 450));
    onChangeConfig({
      ...config,
      size: 'custom',
      customWidth: validWidth,
      customHeight: validHeight
    });
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

  const handleUpdateAdvanceOnClickImage = (advanceOnClickImage: boolean) => {
    onChangeConfig({ ...config, advanceOnClickImage });
  };

  const handleUpdateDisableInitialDarkOverlay = (disableInitialDarkOverlay: boolean) => {
    onChangeConfig({ ...config, disableInitialDarkOverlay });
  };

  const handleAddSlide = () => {
    const newSlide: Slide = {
      id: `slide-${Date.now()}`,
      title: `SLIDE ${config.slides.length + 1}`,
      imageUrl: 'https://www.image2url.com/r2/default/files/1786107541110-7147fb41-a0c9-418e-b1ce-8b35b8a7089a.png',
      audioUrl: 'https://www.image2url.com/r2/default/videos/1786109221182-a26d10ae-fed4-4489-a0f2-922bb88b1d09.mp4',
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

  return (
    <div className="max-w-7xl mx-auto space-y-8 text-slate-800">
      {/* Main Grid Layout: General Settings + Slide Manager + Slide Detail (Coluna esquerda aumentada em 5%: de 33.3% para 38.3%) */}
      <div className="grid grid-cols-1 lg:grid-cols-[38.3%_minmax(0,1fr)] gap-8 items-start">
        {/* Left Column (aumentada em 5%): General Settings + Slide List */}
        <div className="space-y-6">
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

            {/* Slideshow Size Selection (Horizontal and Vertical Customization) */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-semibold text-slate-700">
                  Tamanho do Slide (Horizontal & Vertical)
                </label>
                <span className="text-[11px] font-mono font-medium text-slate-600 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded-lg">
                  {currentWidth}px × {currentHeight}px
                </span>
              </div>

              {/* 4 Size Preset Buttons */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { id: 'small', label: 'Pequeno', desc: '520 × 293 px' },
                  { id: 'medium', label: 'Médio', desc: '800 × 450 px' },
                  { id: 'large', label: 'Grande', desc: '1100 × 619 px' },
                  { id: 'custom', label: 'Personalizado', desc: 'Livre (L × A)' }
                ].map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => handleUpdateSize(s.id as SlideSize)}
                    className={`p-2 rounded-xl border text-center transition-all ${
                      config.size === s.id
                        ? 'bg-blue-600 text-white border-blue-600 font-bold shadow-xs'
                        : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <div className="text-xs font-bold">{s.label}</div>
                    <div className={`text-[10px] ${config.size === s.id ? 'text-blue-100' : 'text-slate-400'}`}>
                      {s.desc}
                    </div>
                  </button>
                ))}
              </div>

              {/* Sliders and direct inputs for Horizontal (Width) and Vertical (Height) */}
              <div className="p-3.5 bg-slate-50/90 border border-slate-200 rounded-2xl space-y-3">
                {/* Horizontal (Largura) */}
                <div>
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="font-semibold text-slate-700 flex items-center gap-1.5">
                      <MoveHorizontal className="w-3.5 h-3.5 text-blue-600" />
                      Horizontal (Largura)
                    </span>
                    <div className="flex items-center gap-1">
                      <input
                        type="number"
                        min="280"
                        max="1920"
                        step="10"
                        value={currentWidth}
                        onChange={(e) => handleCustomDimensionChange(Number(e.target.value), currentHeight)}
                        className="w-16 px-1.5 py-0.5 text-right font-mono font-semibold text-xs bg-white border border-slate-300 rounded focus:ring-1 focus:ring-blue-500 focus:outline-none"
                      />
                      <span className="text-[11px] text-slate-500 font-mono">px</span>
                    </div>
                  </div>
                  <input
                    type="range"
                    min="320"
                    max="1400"
                    step="10"
                    value={currentWidth}
                    onChange={(e) => handleCustomDimensionChange(Number(e.target.value), currentHeight)}
                    className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400 mt-0.5 font-mono">
                    <span>320px</span>
                    <span>800px</span>
                    <span>1400px</span>
                  </div>
                </div>

                {/* Vertical (Altura) */}
                <div>
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="font-semibold text-slate-700 flex items-center gap-1.5">
                      <MoveVertical className="w-3.5 h-3.5 text-blue-600" />
                      Vertical (Altura)
                    </span>
                    <div className="flex items-center gap-1">
                      <input
                        type="number"
                        min="180"
                        max="1600"
                        step="10"
                        value={currentHeight}
                        onChange={(e) => handleCustomDimensionChange(currentWidth, Number(e.target.value))}
                        className="w-16 px-1.5 py-0.5 text-right font-mono font-semibold text-xs bg-white border border-slate-300 rounded focus:ring-1 focus:ring-blue-500 focus:outline-none"
                      />
                      <span className="text-[11px] text-slate-500 font-mono">px</span>
                    </div>
                  </div>
                  <input
                    type="range"
                    min="200"
                    max="1000"
                    step="10"
                    value={currentHeight}
                    onChange={(e) => handleCustomDimensionChange(currentWidth, Number(e.target.value))}
                    className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400 mt-0.5 font-mono">
                    <span>200px</span>
                    <span>450px</span>
                    <span>1000px</span>
                  </div>
                </div>

                {/* Proporções Rápidas (Atalhos) */}
                <div className="pt-2 border-t border-slate-200/70">
                  <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block mb-1.5">
                    Proporções Rápidas:
                  </span>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
                    {[
                      { label: '16:9 (Vídeo)', w: 800, h: 450 },
                      { label: '4:3 (Padrão)', w: 800, h: 600 },
                      { label: '1:1 (Quadrado)', w: 600, h: 600 },
                      { label: '9:16 (Stories)', w: 450, h: 800 }
                    ].map((preset) => (
                      <button
                        key={preset.label}
                        type="button"
                        onClick={() => handleCustomDimensionChange(preset.w, preset.h)}
                        className={`px-2 py-1 text-[10px] font-semibold rounded-lg border transition-all text-center ${
                          currentWidth === preset.w && currentHeight === preset.h
                            ? 'bg-blue-100 text-blue-700 border-blue-300 font-bold'
                            : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-100'
                        }`}
                      >
                        {preset.label}
                      </button>
                    ))}
                  </div>
                </div>
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
                    checked={config.instantProgressBarFill ?? true}
                    onChange={(e) => handleUpdateInstantProgressBarFill(e.target.checked)}
                    className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 mt-0.5"
                  />
                  <span>Acender a barra azul de uma vez ao entrar no slide (sem seguir o áudio)</span>
                </label>
              )}

              <label className="flex items-start gap-2.5 cursor-pointer text-xs text-slate-600 font-medium pt-1 border-t border-slate-100">
                <input
                  type="checkbox"
                  checked={config.advanceOnClickImage ?? false}
                  onChange={(e) => handleUpdateAdvanceOnClickImage(e.target.checked)}
                  className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 mt-0.5"
                />
                <div>
                  <span className="font-semibold text-slate-700">Não exigir término do áudio</span>
                  <p className="text-[11px] text-slate-400 font-normal mt-0.5">
                    O botão de próximo já aparece assim que o slideshow é iniciado, sem precisar esperar o término do áudio.
                  </p>
                </div>
              </label>

              <label className="flex items-start gap-2.5 cursor-pointer text-xs text-slate-600 font-medium">
                <input
                  type="checkbox"
                  checked={config.disableInitialDarkOverlay ?? false}
                  onChange={(e) => handleUpdateDisableInitialDarkOverlay(e.target.checked)}
                  className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 mt-0.5"
                />
                <div>
                  <span className="font-semibold text-slate-700">Não exibir tela escurecida no primeiro frame do slideshow</span>
                  <p className="text-[11px] text-slate-400 font-normal mt-0.5">
                    Mantém a imagem inicial 100% visível, nítida e clara antes do primeiro clique de início (sem camada escura ou desfoque).
                  </p>
                </div>
              </label>
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

        {/* Right Column: Selected Slide Editor + Embed Code */}
        <div className="space-y-6 min-w-0">
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

              {/* Preview Box with Configured Proportions */}
              <div className="pt-2">
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider">
                    Pré-visualização do Slide
                  </label>
                  <span className="text-[10px] font-mono text-slate-500 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded-md font-semibold">
                    {currentWidth} × {currentHeight} px
                  </span>
                </div>
                <div
                  className="relative rounded-2xl overflow-hidden bg-black border border-slate-200 max-w-md mx-auto shadow-md transition-all duration-300"
                  style={{
                    aspectRatio: `${currentWidth} / ${currentHeight}`,
                    maxHeight: '380px',
                    width: currentWidth >= currentHeight ? '100%' : 'auto',
                    height: currentHeight > currentWidth ? '380px' : 'auto'
                  }}
                >
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
                    <div className="text-xs font-bold text-white drop-shadow-xs">{selectedSlide.title}</div>
                    {selectedSlide.caption && (
                      <div className="text-[11px] text-slate-300 line-clamp-2 drop-shadow-xs">{selectedSlide.caption}</div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-8 text-center text-slate-400 bg-white border border-slate-200 rounded-3xl">
              Nenhum slide selecionado.
            </div>
          )}

          {/* Card de Incorporação e Embed (Isolamento Total) */}
          <div className="p-6 bg-white border border-slate-200 rounded-3xl shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
                <Code2 className="w-4 h-4 text-blue-600" />
                Incorporação e Embed (Isolamento Total)
              </h3>
              <div className="flex items-center gap-1.5 px-2.5 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full text-[11px] font-semibold w-fit">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                Blindagem Bidirecional Ativa
              </div>
            </div>

            <p className="text-xs text-slate-500 leading-relaxed">
              O código deste slideshow foi totalmente blindado para <strong>não interferir no CSS ou scripts do site hospedeiro</strong> e <strong>não ser afetado por estilos externos</strong> (usando <em>Shadow DOM Declarativo</em> e encapsulamento estrito).
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
              {/* Opção 1: Iframe Embed */}
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl flex flex-col justify-between gap-3">
                <div>
                  <div className="text-xs font-bold text-slate-800 mb-1">Opção 1: Código Iframe (Embed)</div>
                  <div className="text-[11px] text-slate-500 leading-normal">
                    Recomendado para CMS, Notion, WordPress ou páginas com regras estritas. Cria uma sandbox 100% isolada pelo navegador.
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleCopyIframe}
                  className="w-full flex items-center justify-center gap-2 px-3.5 py-2 bg-white hover:bg-slate-100 border border-slate-300 text-slate-700 rounded-xl text-xs font-semibold shadow-2xs transition-colors cursor-pointer"
                >
                  {copiedIframe ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="text-emerald-700 font-bold">Iframe Copiado!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-slate-600" />
                      <span>Copiar Código Iframe</span>
                    </>
                  )}
                </button>
              </div>

              {/* Opção 2: HTML com Shadow DOM */}
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl flex flex-col justify-between gap-3">
                <div>
                  <div className="text-xs font-bold text-slate-800 mb-1">Opção 2: HTML com Shadow DOM</div>
                  <div className="text-[11px] text-slate-500 leading-normal">
                    Código HTML direto com Shadow DOM nativo. O CSS externo não penetra e os estilos do slideshow não vazam.
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleCopyShadowHtml}
                  className="w-full flex items-center justify-center gap-2 px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors cursor-pointer"
                >
                  {copiedHtmlCode ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-white" />
                      <span className="font-bold">HTML Copiado!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-white" />
                      <span>Copiar HTML (Shadow DOM)</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
