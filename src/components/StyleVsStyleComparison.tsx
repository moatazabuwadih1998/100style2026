import React, { useState } from 'react';
import {
  ArrowLeftRight,
  Copy,
  Check,
  Sparkles,
  Sliders,
  Palette,
  Info,
  Maximize2
} from 'lucide-react';
import { ArtStyle } from '../types/styles';
import { getStyleSvgUrl } from '../data/stylesData';

interface StyleVsStyleComparisonProps {
  styles: ArtStyle[];
  initialStyleA?: ArtStyle;
  initialStyleB?: ArtStyle;
  onSelectForStudio: (style: ArtStyle) => void;
  onSelectForPromptBuilder: (style: ArtStyle) => void;
}

export const StyleVsStyleComparison: React.FC<StyleVsStyleComparisonProps> = ({
  styles,
  initialStyleA,
  initialStyleB,
  onSelectForStudio,
  onSelectForPromptBuilder
}) => {
  const [styleA, setStyleA] = useState<ArtStyle>(initialStyleA || styles[0]);
  const [styleB, setStyleB] = useState<ArtStyle>(initialStyleB || styles[1] || styles[0]);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const swapStyles = () => {
    const temp = styleA;
    setStyleA(styleB);
    setStyleB(temp);
  };

  const copyText = (txt: string, key: string) => {
    navigator.clipboard.writeText(txt);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 1500);
  };

  const renderStyleColumn = (style: ArtStyle, onSelect: (s: ArtStyle) => void, slotLabel: string) => {
    const previewUrl = getStyleSvgUrl(style);

    return (
      <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-4 flex flex-col justify-between shadow-xl">
        {/* Style Dropdown Selector */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-indigo-400 bg-indigo-500/10 px-2.5 py-0.5 rounded-full border border-indigo-500/20">
              {slotLabel}
            </span>
            <span className="font-mono text-xs font-bold text-cyan-400">
              {style.id.toUpperCase()}
            </span>
          </div>

          <select
            value={style.id}
            onChange={(e) => {
              const found = styles.find((s) => s.id === e.target.value);
              if (found) onSelect(found);
            }}
            className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-750 text-white text-xs font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            {styles.map((s) => (
              <option key={s.id} value={s.id}>
                [{s.id.toUpperCase()}] {s.styleNameAr} — {s.styleNameEn}
              </option>
            ))}
          </select>
        </div>

        {/* Visual Preview */}
        <div className="relative aspect-square rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 shadow-md">
          <img
            src={previewUrl}
            alt={style.previewAlt}
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).src = '/assets/default-character-opt.jpg';
            }}
          />
          <div className="absolute top-2 right-2 px-2 py-0.5 rounded bg-black/80 text-[11px] font-mono text-slate-300">
            {style.groupNameAr}
          </div>
        </div>

        {/* Info */}
        <div className="space-y-2">
          <div>
            <h3 className="font-black text-lg text-white">{style.styleNameAr}</h3>
            <p className="font-mono text-xs text-cyan-400">{style.styleNameEn}</p>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed font-medium line-clamp-3">
            {style.description}
          </p>

          {/* Palette */}
          <div className="flex items-center gap-1.5 pt-1">
            {style.paletteColors.map((c, i) => (
              <div
                key={i}
                className="flex-1 h-5 rounded border border-slate-700 shadow-inner"
                style={{ backgroundColor: c }}
                title={c}
              />
            ))}
          </div>
        </div>

        {/* Visual traits */}
        <div className="p-3 rounded-xl bg-slate-950 border border-slate-850 space-y-1.5 text-xs">
          <div>
            <strong className="text-indigo-400 font-semibold block text-[11px]">خطوط الرسم:</strong>
            <span className="text-slate-300">{style.visualTraits.lineArt}</span>
          </div>
          <div>
            <strong className="text-cyan-400 font-semibold block text-[11px]">التلوين والإضاءة:</strong>
            <span className="text-slate-300">{style.visualTraits.coloring} - {style.visualTraits.lighting}</span>
          </div>
        </div>

        {/* Prompt snippet & copy */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-300">قالب البرومبت:</span>
            <button
              onClick={() => copyText(style.promptTemplate, style.id)}
              className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
            >
              {copiedKey === style.id ? (
                <span className="text-emerald-400">تم النسخ</span>
              ) : (
                <>
                  <Copy className="w-3 h-3" />
                  <span>نسخ البرومبت</span>
                </>
              )}
            </button>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-850 font-mono text-[11px] text-cyan-300/80 line-clamp-3 select-all direction-ltr text-left">
            {style.promptTemplate}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-800">
          <button
            onClick={() => onSelectForPromptBuilder(style)}
            className="py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-750 text-indigo-300 hover:text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors border border-slate-750"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>بناء برومبت</span>
          </button>
          <button
            onClick={() => onSelectForStudio(style)}
            className="py-2 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-colors shadow-sm"
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>توليد بالاستوديو</span>
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header bar */}
      <div className="p-4 sm:p-5 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/25 mb-1.5">
            <ArrowLeftRight className="w-3.5 h-3.5" />
            <span>مقارنة الأساليب الفنية</span>
          </div>
          <h2 className="text-xl font-black text-white">
            قارن بين أي أسلوبين من الـ 100 أسلوب جنباً إلى جنب
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            افحص الفروق التشكيلية ولوحات الألوان والبرومبتات وخصائص التحبير بين أسلوبين مختلفين.
          </p>
        </div>

        <button
          onClick={swapStyles}
          className="px-4 py-2.5 rounded-xl bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 font-bold text-xs flex items-center gap-2 transition-all hover:scale-105 active:scale-95"
        >
          <ArrowLeftRight className="w-4 h-4" />
          <span>تبديل الأسلوبين</span>
        </button>
      </div>

      {/* 2-Columns Side by Side Comparison Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {renderStyleColumn(styleA, setStyleA, 'الأسلوب الأول (A)')}
        {renderStyleColumn(styleB, setStyleB, 'الأسلوب الثاني (B)')}
      </div>
    </div>
  );
};
