import React from 'react';
import { Sparkles, Shuffle, Sliders, Layers, ArrowLeft, ShieldCheck, Cpu } from 'lucide-react';
import { ArtStyle } from '../types/styles';

interface HeroSectionProps {
  onExploreStyles: () => void;
  onOpenStudio: () => void;
  onRandomStyle: () => void;
  randomStyleSample?: ArtStyle;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onExploreStyles,
  onOpenStudio,
  onRandomStyle
}) => {
  return (
    <section className="relative overflow-hidden pt-8 pb-10 sm:py-12 border-b border-slate-850 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      {/* Background glow orbs */}
      <div className="absolute top-1/4 -right-20 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 -left-20 w-96 h-96 bg-cyan-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto space-y-4 sm:space-y-6">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/25 shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span>100 أسلوب فني موزعة على 10 مجموعات تخصصية</span>
          </div>

          {/* Main Title */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-white leading-tight sm:leading-tight">
            حوّل شخصيتك إلى{' '}
            <span className="bg-gradient-to-r from-indigo-400 via-cyan-300 to-amber-300 bg-clip-text text-transparent">
              100 أسلوب فني
            </span>{' '}
            في الأنمي وألعاب الفيديو
          </h1>

          {/* Subtitle */}
          <p className="text-sm sm:text-base md:text-lg text-slate-300 leading-relaxed max-w-2xl mx-auto">
            المنصة العربية المتكاملة للمصممين ومطوري الألعاب وعشاق الفن الرقمي.
            برومبتات دقيقة، معاينات بصرية واقعية، استوديو توليد حقيقي بالذكاء الاصطناعي مع الحفاظ على هوية الملامح.
          </p>

          {/* Quick CTA Actions */}
          <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={onExploreStyles}
              className="px-5 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm shadow-lg shadow-indigo-600/30 flex items-center gap-2 transition-all hover:scale-105 active:scale-95"
            >
              <Layers className="w-4 h-4" />
              <span>تصفح الـ 100 أسلوب</span>
              <ArrowLeft className="w-4 h-4" />
            </button>

            <button
              onClick={onOpenStudio}
              className="px-5 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-100 font-bold text-sm border border-slate-700 flex items-center gap-2 transition-all hover:scale-105 active:scale-95"
            >
              <Sliders className="w-4 h-4 text-cyan-400" />
              <span>استوديو التوليد المتقدم</span>
            </button>

            <button
              onClick={onRandomStyle}
              className="px-4 py-3 rounded-xl bg-slate-900/90 hover:bg-slate-850 text-indigo-300 hover:text-white font-semibold text-sm border border-indigo-900/50 flex items-center gap-2 transition-all"
              title="اختر أسلوباً عشوائياً من المكتبة"
            >
              <Shuffle className="w-4 h-4 text-amber-400" />
              <span>أسلوب عشوائي</span>
            </button>
          </div>

          {/* Default Preview Character Showcase */}
          <div className="pt-4 max-w-4xl mx-auto">
            <div className="p-4 sm:p-5 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-xl backdrop-blur-md">
              <div className="flex items-center justify-between mb-3 text-xs">
                <div className="flex items-center gap-2 text-indigo-300 font-bold">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>معاينة حية: تحويل الشخصية المرجعية الافتراضية إلى أنماط متعددة</span>
                </div>
                <button
                  onClick={onOpenStudio}
                  className="text-cyan-400 hover:text-cyan-300 font-semibold flex items-center gap-1 transition-colors"
                >
                  <span>جرب التوليد الآن</span>
                  <ArrowLeft className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Character and transformed styles strip */}
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                {/* 1. Original Default Character Image */}
                <div className="relative rounded-xl overflow-hidden border-2 border-emerald-500/60 shadow-lg bg-slate-950 flex flex-col group">
                  <div className="aspect-square relative overflow-hidden">
                    <img
                      src="/assets/default-character-opt.jpg"
                      alt="الصورة المرجعية الافتراضية"
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src = '/default-character.jpg';
                      }}
                    />
                    <div className="absolute top-1.5 right-1.5 px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-600 text-white shadow">
                      الأصل المرجعي
                    </div>
                  </div>
                  <div className="p-1.5 bg-slate-950 text-center text-[11px] font-bold text-white truncate">
                    الشخصية المرجعية
                  </div>
                </div>

                {/* 2. Sample Transformation: G01-S01 */}
                <div
                  onClick={onOpenStudio}
                  className="relative rounded-xl overflow-hidden border border-slate-800 hover:border-indigo-500/60 shadow bg-slate-950 flex flex-col group cursor-pointer transition-all"
                >
                  <div className="aspect-square relative overflow-hidden">
                    <img
                      src="/previews/g01-s01.jpg"
                      alt="سيل أنيميشن التسعينات"
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src = '/assets/default-character-opt.jpg';
                      }}
                    />
                    <div className="absolute top-1.5 right-1.5 px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-black/75 text-amber-300">
                      G01-S01
                    </div>
                  </div>
                  <div className="p-1.5 bg-slate-950 text-center text-[11px] font-bold text-slate-200 truncate">
                    سيل التسعينات
                  </div>
                </div>

                {/* 3. Sample Transformation: G04-S01 */}
                <div
                  onClick={onOpenStudio}
                  className="relative rounded-xl overflow-hidden border border-slate-800 hover:border-indigo-500/60 shadow bg-slate-950 flex flex-col group cursor-pointer transition-all"
                >
                  <div className="aspect-square relative overflow-hidden">
                    <img
                      src="/previews/g04-s01.jpg"
                      alt="سيل شيدينغ JRPG"
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src = '/assets/default-character-opt.jpg';
                      }}
                    />
                    <div className="absolute top-1.5 right-1.5 px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-black/75 text-cyan-300">
                      G04-S01
                    </div>
                  </div>
                  <div className="p-1.5 bg-slate-950 text-center text-[11px] font-bold text-slate-200 truncate">
                    سيل شيدينغ ألعاب
                  </div>
                </div>

                {/* 4. Sample Transformation: G05-S01 */}
                <div
                  onClick={onOpenStudio}
                  className="relative rounded-xl overflow-hidden border border-slate-800 hover:border-indigo-500/60 shadow bg-slate-950 flex flex-col group cursor-pointer transition-all"
                >
                  <div className="aspect-square relative overflow-hidden">
                    <img
                      src="/previews/g05-s01.jpg"
                      alt="بيكسل آرت 16-بت"
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src = '/assets/default-character-opt.jpg';
                      }}
                    />
                    <div className="absolute top-1.5 right-1.5 px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-black/75 text-emerald-300">
                      G05-S01
                    </div>
                  </div>
                  <div className="p-1.5 bg-slate-950 text-center text-[11px] font-bold text-slate-200 truncate">
                    بيكسل آرت 16-Bit
                  </div>
                </div>

                {/* 5. Sample Transformation: G10-S01 */}
                <div
                  onClick={onOpenStudio}
                  className="relative rounded-xl overflow-hidden border border-slate-800 hover:border-indigo-500/60 shadow bg-slate-950 flex flex-col group cursor-pointer transition-all hidden sm:flex"
                >
                  <div className="aspect-square relative overflow-hidden">
                    <img
                      src="/previews/g10-s01.jpg"
                      alt="آركين ستيمبانك"
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src = '/assets/default-character-opt.jpg';
                      }}
                    />
                    <div className="absolute top-1.5 right-1.5 px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-black/75 text-pink-300">
                      G10-S01
                    </div>
                  </div>
                  <div className="p-1.5 bg-slate-950 text-center text-[11px] font-bold text-slate-200 truncate">
                    آركين ستيمبانك
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Key Value Metrics */}
          <div className="pt-6 grid grid-cols-2 md:grid-cols-4 gap-3 text-right sm:text-center">
            <div className="p-3 rounded-xl bg-slate-900/50 border border-slate-800/80">
              <div className="text-xl sm:text-2xl font-black text-indigo-400 font-mono">100</div>
              <div className="text-xs text-slate-400 font-medium">أسلوب فني مكتمل</div>
            </div>
            <div className="p-3 rounded-xl bg-slate-900/50 border border-slate-800/80">
              <div className="text-xl sm:text-2xl font-black text-cyan-400 font-mono">10</div>
              <div className="text-xs text-slate-400 font-medium">مجموعات فنية فريدة</div>
            </div>
            <div className="p-3 rounded-xl bg-slate-900/50 border border-slate-800/80">
              <div className="text-xl sm:text-2xl font-black text-emerald-400 flex items-center justify-center gap-1">
                <ShieldCheck className="w-5 h-5" />
                <span className="font-mono text-base sm:text-lg">هوية</span>
              </div>
              <div className="text-xs text-slate-400 font-medium">حفظ ملامح الوجه</div>
            </div>
            <div className="p-3 rounded-xl bg-slate-900/50 border border-slate-800/80">
              <div className="text-xl sm:text-2xl font-black text-amber-400 flex items-center justify-center gap-1">
                <Cpu className="w-5 h-5" />
                <span className="font-mono text-base sm:text-lg">تصدير</span>
              </div>
              <div className="text-xs text-slate-400 font-medium">ComfyUI & Notion</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
