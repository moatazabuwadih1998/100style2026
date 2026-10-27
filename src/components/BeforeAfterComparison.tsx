import React, { useState, useRef } from 'react';
import {
  SplitSquareVertical,
  Columns,
  Download,
  Maximize2,
  AlertCircle,
  Sparkles,
  ArrowRightLeft
} from 'lucide-react';
import { GenerationRecord } from '../types/styles';
import { triggerDownload } from '../services/exportService';

interface BeforeAfterComparisonProps {
  currentRecord?: GenerationRecord | null;
  onOpenStudio?: () => void;
}

export const BeforeAfterComparison: React.FC<BeforeAfterComparisonProps> = ({
  currentRecord,
  onOpenStudio
}) => {
  const [mode, setMode] = useState<'slider' | 'side_by_side'>('slider');
  const [sliderPosition, setSliderPosition] = useState<number>(50);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [zoomedImage, setZoomedImage] = useState<string | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);

  const DEFAULT_REFERENCE = '/assets/default-character-opt.jpg';
  const DEFAULT_AFTER_PREVIEW = '/previews/g04-s01.jpg';

  const beforeImage = currentRecord?.referenceImageBase64 || DEFAULT_REFERENCE;
  const afterImage = currentRecord?.resultImageBase64 || currentRecord?.resultImageUrl || DEFAULT_AFTER_PREVIEW;

  const handlePointerDown = () => setIsDragging(true);
  const handlePointerUp = () => setIsDragging(false);

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPosition(percentage);
  };

  const handleDownloadResult = () => {
    if (!afterImage) return;
    const filename = `anime-style-after-${currentRecord?.styleId || 'result'}.png`;
    if (afterImage.startsWith('data:image')) {
      const link = document.createElement('a');
      link.href = afterImage;
      link.download = filename;
      link.click();
    } else {
      fetch(afterImage)
        .then((res) => res.blob())
        .then((blob) => triggerDownload(blob, filename, 'image/png'));
    }
  };

  // If one or both images are missing
  if (!beforeImage || !afterImage) {
    return (
      <div className="p-8 sm:p-12 text-center rounded-3xl bg-slate-900 border border-slate-800 space-y-4 max-w-2xl mx-auto my-6">
        <div className="w-16 h-16 mx-auto rounded-full bg-slate-800 flex items-center justify-center text-slate-400">
          <AlertCircle className="w-8 h-8 text-amber-400" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-white">لا تتوفر صورة مرجعية أو نتيجة للمقارنة حالياً</h3>
          <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto mt-1 leading-relaxed">
            لتفعيل المقارنة الحقيقية قبل وبعد، يرجى الانتقال إلى استوديو التوليد، رفع صورة شخصية مرجعية، وتوليد نتيجة حقيقية بالذكاء الاصطناعي.
          </p>
        </div>
        {onOpenStudio && (
          <button
            onClick={onOpenStudio}
            className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/30 transition-all"
          >
            الانتقال إلى استوديو التوليد
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header controls */}
      <div className="p-4 sm:p-5 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-white flex items-center gap-2">
            <SplitSquareVertical className="w-5 h-5 text-indigo-400" />
            <span>مقارنة قبل وبعد (Before & After Visual Inspector)</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            مقارنة دقيقة بين صورتك المرجعية الأصلية والناتج الفني بأسلوب: {currentRecord?.styleNameAr}
          </p>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          {/* View mode toggle */}
          <div className="flex items-center rounded-xl bg-slate-950 p-1 border border-slate-800">
            <button
              onClick={() => setMode('slider')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                mode === 'slider'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <ArrowRightLeft className="w-3.5 h-3.5" />
              <span>شريط منزلق</span>
            </button>
            <button
              onClick={() => setMode('side_by_side')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                mode === 'side_by_side'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Columns className="w-3.5 h-3.5" />
              <span>جنباً إلى جنب</span>
            </button>
          </div>

          <button
            onClick={handleDownloadResult}
            className="p-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-colors shadow-sm"
            title="تنزيل الصورة الناتجة"
          >
            <Download className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Comparison Viewport */}
      {mode === 'slider' ? (
        /* Interactive Slider Mode */
        <div
          ref={containerRef}
          onPointerDown={handlePointerDown}
          onPointerUp={handlePointerUp}
          onPointerLeave={handlePointerUp}
          onPointerMove={handlePointerMove}
          className="relative w-full aspect-square sm:aspect-[4/3] max-h-[600px] rounded-3xl overflow-hidden bg-slate-950 border border-slate-800 select-none cursor-ew-resize shadow-2xl mx-auto"
        >
          {/* Base Layer: AFTER Image (Result) */}
          <img
            src={afterImage}
            alt="الصورة بعد التحويل الفني"
            className="absolute inset-0 w-full h-full object-contain"
          />

          {/* Top Layer: BEFORE Image (Clipped) */}
          <div
            className="absolute inset-0 overflow-hidden"
            style={{ width: `${sliderPosition}%` }}
          >
            <img
              src={beforeImage}
              alt="الصورة الأصلية قبل التحويل"
              className="absolute inset-0 w-full h-full object-contain max-w-none"
              style={{
                width: containerRef.current ? `${containerRef.current.clientWidth}px` : '100%',
                height: containerRef.current ? `${containerRef.current.clientHeight}px` : '100%'
              }}
            />
          </div>

          {/* Split Divider Line */}
          <div
            className="absolute top-0 bottom-0 w-1 bg-white shadow-[0_0_15px_rgba(255,255,255,0.8)] pointer-events-none"
            style={{ left: `${sliderPosition}%` }}
          >
            <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-indigo-600 text-white border-2 border-white shadow-xl flex items-center justify-center">
              <ArrowRightLeft className="w-4 h-4" />
            </div>
          </div>

          {/* Badges: Before and After */}
          <div className="absolute top-4 right-4 z-10 px-3 py-1 rounded-lg bg-black/75 backdrop-blur-md text-white text-xs font-bold border border-white/20">
            الأصلية (قبل)
          </div>
          <div className="absolute top-4 left-4 z-10 px-3 py-1 rounded-lg bg-indigo-600/90 backdrop-blur-md text-white text-xs font-bold border border-indigo-400/40">
            المولدة (بعد)
          </div>

          {/* Hint overlay at bottom */}
          <div className="absolute bottom-4 inset-x-4 flex items-center justify-center pointer-events-none">
            <span className="px-3 py-1 rounded-full bg-slate-950/80 backdrop-blur-md text-slate-300 text-[11px] border border-slate-800">
              اسحب الخط يميناً ويساراً لمقارنة الملامح
            </span>
          </div>
        </div>
      ) : (
        /* Side by Side Mode */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Before Panel */}
          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-300 px-2.5 py-1 rounded-md bg-slate-800">
                الصورة المرجعية الأصلية (قبل)
              </span>
              <button
                onClick={() => setZoomedImage(beforeImage)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white bg-slate-800"
                title="تكبير"
              >
                <Maximize2 className="w-3.5 h-3.5" />
              </button>
            </div>
            <div className="aspect-square rounded-xl overflow-hidden bg-slate-950 border border-slate-800 flex items-center justify-center">
              <img
                src={beforeImage}
                alt="الصورة الأصلية"
                className="w-full h-full object-contain"
              />
            </div>
          </div>

          {/* After Panel */}
          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-indigo-300 px-2.5 py-1 rounded-md bg-indigo-500/20 border border-indigo-500/30">
                النتيجة الفنية المولدة (بعد)
              </span>
              <button
                onClick={() => setZoomedImage(afterImage)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white bg-slate-800"
                title="تكبير"
              >
                <Maximize2 className="w-3.5 h-3.5" />
              </button>
            </div>
            <div className="aspect-square rounded-xl overflow-hidden bg-slate-950 border border-slate-800 flex items-center justify-center">
              <img
                src={afterImage}
                alt="النتيجة الفنية"
                className="w-full h-full object-contain"
              />
            </div>
          </div>
        </div>
      )}

      {/* Zoom Modal */}
      {zoomedImage && (
        <div
          className="fixed inset-0 z-60 bg-black/95 flex items-center justify-center p-4 cursor-zoom-out"
          onClick={() => setZoomedImage(null)}
        >
          <img
            src={zoomedImage}
            alt="تكبير المقارنة"
            className="max-w-[92vw] max-h-[92vh] object-contain rounded-2xl shadow-2xl"
          />
        </div>
      )}
    </div>
  );
};
