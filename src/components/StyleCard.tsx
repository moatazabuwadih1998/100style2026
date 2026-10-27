import React from 'react';
import { Heart, Maximize2, Copy, Sparkles, Check } from 'lucide-react';
import { ArtStyle } from '../types/styles';
import { getStyleSvgUrl } from '../data/stylesData';

interface StyleCardProps {
  style: ArtStyle;
  isFavorite: boolean;
  isSelected?: boolean;
  onToggleFavorite: (id: string) => void;
  onOpenDetails: (style: ArtStyle) => void;
  onSelectForStudio: (style: ArtStyle) => void;
  onSelectForPromptBuilder: (style: ArtStyle) => void;
}

export const StyleCard: React.FC<StyleCardProps> = ({
  style,
  isFavorite,
  isSelected,
  onToggleFavorite,
  onOpenDetails,
  onSelectForStudio,
  onSelectForPromptBuilder
}) => {
  const [copied, setCopied] = React.useState(false);
  const previewUrl = getStyleSvgUrl(style);

  const handleCopyName = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(`${style.styleNameAr} (${style.styleNameEn})`);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div
      onClick={() => onOpenDetails(style)}
      className={`group relative rounded-2xl bg-slate-900/90 border transition-all duration-300 flex flex-col overflow-hidden cursor-pointer hover:-translate-y-1 hover:shadow-xl ${
        isSelected
          ? 'border-indigo-500 shadow-indigo-500/20 shadow-lg ring-2 ring-indigo-500/40'
          : 'border-slate-800 hover:border-slate-700 hover:shadow-slate-950/50'
      }`}
    >
      {/* Preview Image Container */}
      <div className="relative aspect-square w-full overflow-hidden bg-slate-950 select-none">
        <img
          src={previewUrl}
          alt={style.previewAlt}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).src = '/assets/default-character-opt.jpg';
          }}
        />

        {/* Top Badges */}
        <div className="absolute top-2.5 inset-x-2.5 flex items-center justify-between z-10 pointer-events-none">
          <span className="px-2 py-0.5 rounded-md text-[11px] font-mono font-bold bg-slate-950/80 text-cyan-400 border border-cyan-500/30 backdrop-blur-sm">
            {style.id.toUpperCase()}
          </span>

          {/* Favorite button */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onToggleFavorite(style.id);
            }}
            className={`p-1.5 rounded-full backdrop-blur-md transition-all pointer-events-auto ${
              isFavorite
                ? 'bg-rose-500 text-white shadow-md shadow-rose-500/30'
                : 'bg-slate-950/70 text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
            title={isFavorite ? 'إزالة من المفضلة' : 'إضافة إلى المفضلة'}
            aria-label="المفضلة"
          >
            <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
          </button>
        </div>

        {/* Quick Zoom Preview Overlay Button */}
        <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
          <div className="p-2.5 rounded-full bg-slate-900/90 text-white border border-slate-700 shadow-lg transform scale-90 group-hover:scale-100 transition-transform">
            <Maximize2 className="w-5 h-5" />
          </div>
        </div>

        {/* Group Pill at bottom of image */}
        <div className="absolute bottom-2 right-2 z-10 pointer-events-none">
          <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-slate-950/80 text-slate-300 border border-slate-800 backdrop-blur-sm">
            {style.groupNameAr} #{style.indexInGroup}
          </span>
        </div>
      </div>

      {/* Card Info Body */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
        <div>
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-bold text-base text-white group-hover:text-indigo-300 transition-colors line-clamp-1">
              {style.styleNameAr}
            </h3>
            <button
              onClick={handleCopyName}
              className="p-1 text-slate-400 hover:text-white rounded hover:bg-slate-800 transition-colors"
              title="نسخ اسم الأسلوب"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-slate-400" />}
            </button>
          </div>
          <p className="font-mono text-xs text-cyan-400/90 line-clamp-1 mt-0.5">
            {style.styleNameEn}
          </p>

          <p className="text-xs text-slate-400 leading-relaxed line-clamp-2 mt-2">
            {style.description}
          </p>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-1">
          {style.tags.slice(0, 3).map((tag, idx) => (
            <span
              key={idx}
              className="px-1.5 py-0.5 rounded text-[10px] bg-slate-800/80 text-slate-300 font-medium"
            >
              #{tag}
            </span>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="pt-2 border-t border-slate-800/80 grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onSelectForPromptBuilder(style);
            }}
            className="w-full py-1.5 px-2 rounded-lg bg-slate-800 hover:bg-slate-750 text-indigo-300 hover:text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors border border-slate-750"
            title="إنشاء برومبت بهذا الأسلوب"
          >
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span>بناء برومبت</span>
          </button>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onSelectForStudio(style);
            }}
            className="w-full py-1.5 px-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors shadow-sm"
            title="اختيار للتوليد في الاستوديو"
          >
            <span>توليد بالاستوديو</span>
          </button>
        </div>
      </div>
    </div>
  );
};
