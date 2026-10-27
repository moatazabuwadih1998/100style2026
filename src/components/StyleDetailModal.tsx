import React, { useState } from 'react';
import {
  X,
  Heart,
  ChevronRight,
  ChevronLeft,
  Copy,
  Check,
  Sparkles,
  Sliders,
  ArrowLeftRight,
  Maximize2,
  Info,
  Palette,
  Tags
} from 'lucide-react';
import { ArtStyle } from '../types/styles';
import { getStyleSvgUrl } from '../data/stylesData';

interface StyleDetailModalProps {
  style: ArtStyle;
  allStyles: ArtStyle[];
  isFavorite: boolean;
  onClose: () => void;
  onToggleFavorite: (id: string) => void;
  onSelectForPromptBuilder: (style: ArtStyle) => void;
  onSelectForStudio: (style: ArtStyle) => void;
  onCompareWithAnother: (style: ArtStyle) => void;
  onNavigateStyle: (style: ArtStyle) => void;
}

export const StyleDetailModal: React.FC<StyleDetailModalProps> = ({
  style,
  allStyles,
  isFavorite,
  onClose,
  onToggleFavorite,
  onSelectForPromptBuilder,
  onSelectForStudio,
  onCompareWithAnother,
  onNavigateStyle
}) => {
  const [copiedType, setCopiedType] = useState<string | null>(null);
  const [isZoomed, setIsZoomed] = useState(false);

  const previewUrl = getStyleSvgUrl(style);
  const currentIndex = allStyles.findIndex((s) => s.id === style.id);
  const prevStyle = currentIndex > 0 ? allStyles[currentIndex - 1] : allStyles[allStyles.length - 1];
  const nextStyle = currentIndex < allStyles.length - 1 ? allStyles[currentIndex + 1] : allStyles[0];

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopiedType(type);
    setTimeout(() => setCopiedType(null), 1800);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 md:p-6 animate-fadeIn">
      {/* Modal Container */}
      <div
        className="relative w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800 bg-slate-950/60">
          <div className="flex items-center gap-3">
            <span className="px-2.5 py-1 rounded-md text-xs font-mono font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              {style.id.toUpperCase()}
            </span>
            <span className="text-xs text-slate-400 font-medium">
              {style.groupNameAr} • الأسلوب {style.indexInGroup} من 10
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* Prev / Next navigation */}
            <div className="flex items-center rounded-lg border border-slate-800 bg-slate-900 p-0.5">
              <button
                onClick={() => onNavigateStyle(prevStyle)}
                className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded transition-colors"
                title={`الأسلوب السابق: ${prevStyle.styleNameAr}`}
              >
                <ChevronRight className="w-4 h-4" />
              </button>
              <span className="text-[11px] font-mono text-slate-400 px-2">
                {currentIndex + 1}/100
              </span>
              <button
                onClick={() => onNavigateStyle(nextStyle)}
                className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded transition-colors"
                title={`الأسلوب التالي: ${nextStyle.styleNameAr}`}
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
            </div>

            {/* Favorite Button */}
            <button
              onClick={() => onToggleFavorite(style.id)}
              className={`p-2 rounded-xl transition-all ${
                isFavorite
                  ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                  : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
              title={isFavorite ? 'إزالة من المفضلة' : 'إضافة إلى المفضلة'}
            >
              <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
            </button>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
              aria-label="إغلاق"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="overflow-y-auto p-5 sm:p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            {/* Preview Column */}
            <div className="md:col-span-5 flex flex-col space-y-3">
              <div
                className="relative aspect-square rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 group cursor-pointer shadow-lg"
                onClick={() => setIsZoomed(!isZoomed)}
              >
                <img
                  src={previewUrl}
                  alt={style.previewAlt}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src = '/assets/default-character-opt.jpg';
                  }}
                />
                <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <div className="p-3 rounded-full bg-slate-900/90 text-white border border-slate-700 shadow-xl">
                    <Maximize2 className="w-6 h-6" />
                  </div>
                </div>

                <div className="absolute bottom-2.5 inset-x-2.5 flex items-center justify-between text-[11px] text-slate-300 bg-slate-950/80 backdrop-blur-md px-3 py-1.5 rounded-lg border border-slate-800">
                  <span>حالة المعاينة: <strong className="text-emerald-400">متاحة ومولدة</strong></span>
                  <span className="font-mono text-cyan-400">600x600 HD</span>
                </div>
              </div>

              {/* Palette swatches */}
              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                <div className="flex items-center gap-2 mb-2 text-xs font-semibold text-slate-400">
                  <Palette className="w-3.5 h-3.5 text-indigo-400" />
                  <span>لوحة الألوان المرجعية للأسلوب:</span>
                </div>
                <div className="flex items-center gap-2">
                  {style.paletteColors.map((color, idx) => (
                    <div
                      key={idx}
                      className="flex-1 h-7 rounded-md border border-slate-700 shadow-inner flex items-center justify-center text-[9px] font-mono text-white/90 select-all"
                      style={{ backgroundColor: color }}
                      title={color}
                    >
                      {color}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Info and Prompts Column */}
            <div className="md:col-span-7 space-y-4">
              <div>
                <h2 className="text-2xl font-black text-white">{style.styleNameAr}</h2>
                <div className="flex items-center gap-2 mt-1">
                  <p className="font-mono text-sm text-cyan-400 font-semibold">{style.styleNameEn}</p>
                  <button
                    onClick={() => copyToClipboard(`${style.styleNameAr} (${style.styleNameEn})`, 'name')}
                    className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800 text-xs flex items-center gap-1"
                    title="نسخ الاسم"
                  >
                    {copiedType === 'name' ? (
                      <span className="text-emerald-400 text-[11px] font-sans">تم النسخ</span>
                    ) : (
                      <Copy className="w-3 h-3" />
                    )}
                  </button>
                </div>
              </div>

              {/* Description */}
              <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2">
                <p className="text-sm text-slate-300 leading-relaxed font-medium">
                  {style.description}
                </p>
                <p className="text-xs text-slate-400 leading-relaxed">
                  {style.detailedDescriptionAr}
                </p>
              </div>

              {/* Visual Traits Breakdown */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2.5 rounded-lg bg-slate-950/40 border border-slate-800/80">
                  <span className="text-indigo-400 font-bold block mb-0.5">خطوط الرسم (Linework):</span>
                  <span className="text-slate-300">{style.visualTraits.lineArt}</span>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-950/40 border border-slate-800/80">
                  <span className="text-cyan-400 font-bold block mb-0.5">التلوين والظلال:</span>
                  <span className="text-slate-300">{style.visualTraits.coloring}</span>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-950/40 border border-slate-800/80">
                  <span className="text-amber-400 font-bold block mb-0.5">الإضاءة:</span>
                  <span className="text-slate-300">{style.visualTraits.lighting}</span>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-950/40 border border-slate-800/80">
                  <span className="text-rose-400 font-bold block mb-0.5">الجو العام:</span>
                  <span className="text-slate-300">{style.visualTraits.atmosphere}</span>
                </div>
              </div>

              {/* Archetype Tips */}
              <div className="p-3 rounded-xl bg-indigo-950/20 border border-indigo-900/30 flex items-start gap-2.5">
                <Info className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                <div className="text-xs text-indigo-200">
                  <strong className="block text-indigo-300 mb-0.5 font-semibold">نصائح الحفاظ على مظهر الشخصية:</strong>
                  {style.characterArchetypeTips}
                </div>
              </div>

              {/* Keywords & Tags */}
              <div className="flex flex-wrap items-center gap-1.5 pt-1">
                <Tags className="w-3.5 h-3.5 text-slate-400" />
                {style.keywords.map((kw, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-0.5 rounded text-[11px] font-mono bg-slate-800 text-slate-300 border border-slate-700"
                  >
                    {kw}
                  </span>
                ))}
              </div>

              {/* Prompt Template Box */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-300">البرومبت الأساسي بالإنجليزية:</span>
                  <button
                    onClick={() => copyToClipboard(style.promptTemplate, 'prompt')}
                    className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1 font-semibold"
                  >
                    {copiedType === 'prompt' ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-emerald-400">تم النسخ بنجاح</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>نسخ البرومبت</span>
                      </>
                    )}
                  </button>
                </div>
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-cyan-300/90 leading-relaxed select-all direction-ltr text-left">
                  {style.promptTemplate}
                </div>
              </div>

              {/* Negative Prompt */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-400">البرومبت السلبي (Negative Prompt):</span>
                  <button
                    onClick={() => copyToClipboard(style.negativePrompt, 'neg')}
                    className="text-xs text-slate-400 hover:text-slate-200 flex items-center gap-1"
                  >
                    {copiedType === 'neg' ? (
                      <span className="text-emerald-400">تم النسخ</span>
                    ) : (
                      <Copy className="w-3 h-3" />
                    )}
                  </button>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-850 text-xs font-mono text-rose-300/80 leading-relaxed select-all direction-ltr text-left">
                  {style.negativePrompt}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-5 py-4 border-t border-slate-800 bg-slate-950 flex flex-wrap items-center justify-between gap-3">
          <button
            onClick={() => onCompareWithAnother(style)}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-200 font-semibold text-xs flex items-center gap-2 border border-slate-700 transition-colors"
          >
            <ArrowLeftRight className="w-3.5 h-3.5 text-amber-400" />
            <span>مقارنة مع أسلوب آخر</span>
          </button>

          <div className="flex items-center gap-2.5">
            <button
              onClick={() => onSelectForPromptBuilder(style)}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-indigo-300 hover:text-white font-bold text-xs flex items-center gap-2 border border-indigo-900/40 transition-colors"
            >
              <Sparkles className="w-4 h-4 text-indigo-400" />
              <span>إنشاء برومبت مخصص</span>
            </button>

            <button
              onClick={() => onSelectForStudio(style)}
              className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-indigo-600/30 transition-all hover:scale-105 active:scale-95"
            >
              <Sliders className="w-4 h-4" />
              <span>اختيار للتوليد في الاستوديو</span>
            </button>
          </div>
        </div>
      </div>

      {/* Zoom Modal if triggered */}
      {isZoomed && (
        <div
          className="fixed inset-0 z-60 bg-black/95 flex items-center justify-center p-4 cursor-zoom-out"
          onClick={() => setIsZoomed(false)}
        >
          <img
            src={previewUrl}
            alt={style.previewAlt}
            className="max-w-[90vw] max-h-[90vh] object-contain rounded-2xl shadow-2xl"
          />
        </div>
      )}
    </div>
  );
};
