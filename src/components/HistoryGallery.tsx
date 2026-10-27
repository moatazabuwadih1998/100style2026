import React, { useState } from 'react';
import {
  History,
  Download,
  Trash2,
  SplitSquareVertical,
  Sliders,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Maximize2,
  Copy,
  Check
} from 'lucide-react';
import { GenerationRecord } from '../types/styles';
import { triggerDownload } from '../services/exportService';

interface HistoryGalleryProps {
  history: GenerationRecord[];
  onSelectRecord: (record: GenerationRecord) => void;
  onOpenComparison: (record: GenerationRecord) => void;
  onDeleteRecord: (id: string) => void;
  onClearAll: () => void;
}

export const HistoryGallery: React.FC<HistoryGalleryProps> = ({
  history,
  onSelectRecord,
  onOpenComparison,
  onDeleteRecord,
  onClearAll
}) => {
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [zoomedImage, setZoomedImage] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleDownload = (record: GenerationRecord) => {
    const img = record.resultImageBase64 || record.resultImageUrl;
    if (!img) return;

    const filename = `anime-style-${record.styleId}-v${record.iterationCount}.png`;
    if (img.startsWith('data:image')) {
      const link = document.createElement('a');
      link.href = img;
      link.download = filename;
      link.click();
    } else {
      fetch(img)
        .then((res) => res.blob())
        .then((blob) => triggerDownload(blob, filename, 'image/png'));
    }
  };

  const copyPrompt = (promptText: string, id: string) => {
    navigator.clipboard.writeText(promptText);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1500);
  };

  return (
    <div className="space-y-6">
      {/* Header bar */}
      <div className="p-4 sm:p-5 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/25 mb-1.5">
            <History className="w-3.5 h-3.5" />
            <span>سجل العمليات والنتائج</span>
          </div>
          <h2 className="text-xl font-black text-white">
            سجل الصور المولدة ({history.length} عملية)
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            يتم حفظ جميع العمليات المكتملة محلياً على جهازك لتسهيل المراجعة وإعادة التنزيل والمقارنة.
          </p>
        </div>

        {history.length > 0 && (
          <div className="flex items-center gap-2 w-full sm:w-auto">
            {showClearConfirm ? (
              <div className="flex items-center gap-2 bg-rose-950/80 p-1.5 rounded-xl border border-rose-800">
                <span className="text-xs text-rose-200 px-2 font-bold">تأكيد مسح الكل؟</span>
                <button
                  onClick={() => {
                    onClearAll();
                    setShowClearConfirm(false);
                  }}
                  className="px-2.5 py-1 rounded-lg bg-rose-600 text-white text-xs font-bold hover:bg-rose-500"
                >
                  نعم، احذف
                </button>
                <button
                  onClick={() => setShowClearConfirm(false)}
                  className="px-2.5 py-1 rounded-lg bg-slate-800 text-slate-300 text-xs hover:bg-slate-700"
                >
                  إلغاء
                </button>
              </div>
            ) : (
              <button
                onClick={() => setShowClearConfirm(true)}
                className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-rose-900/30 text-slate-300 hover:text-rose-400 border border-slate-700 hover:border-rose-700 text-xs font-bold flex items-center gap-1.5 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                <span>مسح السجل كاملاً</span>
              </button>
            )}
          </div>
        )}
      </div>

      {/* Grid of History Records */}
      {history.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {history.map((record) => {
            const hasImage = Boolean(record.resultImageBase64 || record.resultImageUrl);
            const dateStr = new Date(record.timestamp).toLocaleString('ar-SA', {
              hour: '2-digit',
              minute: '2-digit',
              year: 'numeric',
              month: 'short',
              day: 'numeric'
            });

            return (
              <div
                key={record.id}
                className="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden flex flex-col justify-between shadow-xl transition-all hover:border-slate-700"
              >
                {/* Image View or Failed Banner */}
                {hasImage ? (
                  <div
                    className="relative aspect-square w-full bg-slate-950 cursor-pointer group"
                    onClick={() => setZoomedImage(record.resultImageBase64 || record.resultImageUrl || null)}
                  >
                    <img
                      src={record.resultImageBase64 || record.resultImageUrl}
                      alt={record.styleNameAr}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <div className="p-2.5 rounded-full bg-slate-900/90 text-white border border-slate-700 shadow-lg">
                        <Maximize2 className="w-5 h-5" />
                      </div>
                    </div>

                    <div className="absolute top-2.5 right-2.5 px-2.5 py-0.5 rounded-md bg-black/75 backdrop-blur-md text-[11px] font-mono font-bold text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>مكتمل</span>
                    </div>

                    <div className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-md bg-black/75 backdrop-blur-md text-[11px] font-mono text-cyan-300 border border-slate-700">
                      v{record.iterationCount}
                    </div>
                  </div>
                ) : (
                  <div className="aspect-[4/3] w-full bg-slate-950 flex flex-col items-center justify-center p-6 text-center space-y-2 border-b border-slate-800">
                    <AlertTriangle className="w-8 h-8 text-rose-400" />
                    <span className="text-xs font-bold text-rose-300">فشلت عملية التوليد</span>
                    <p className="text-[11px] text-slate-400 line-clamp-2 max-w-xs">
                      {record.errorMessage || 'حدث خطأ في الخادم أثناء المحاولة'}
                    </p>
                  </div>
                )}

                {/* Card Details Body */}
                <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between text-xs text-slate-400 font-mono mb-1">
                      <span>{record.styleId.toUpperCase()}</span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        <span>{dateStr}</span>
                      </span>
                    </div>

                    <h4 className="font-bold text-sm text-white">{record.styleNameAr}</h4>
                    <p className="font-mono text-xs text-cyan-400">{record.styleNameEn}</p>

                    {/* Prompt Preview */}
                    <div className="mt-2 p-2 rounded-lg bg-slate-950 text-[11px] font-mono text-slate-400 line-clamp-2 direction-ltr text-left border border-slate-850">
                      {record.prompt}
                    </div>
                  </div>

                  {/* Actions Bar */}
                  <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1">
                      {hasImage && (
                        <button
                          onClick={() => handleDownload(record)}
                          className="p-2 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 border border-emerald-500/30 transition-colors"
                          title="تنزيل النتيجة"
                        >
                          <Download className="w-4 h-4" />
                        </button>
                      )}

                      {record.referenceImageBase64 && hasImage && (
                        <button
                          onClick={() => onOpenComparison(record)}
                          className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-indigo-300 transition-colors"
                          title="مقارنة قبل وبعد"
                        >
                          <SplitSquareVertical className="w-4 h-4" />
                        </button>
                      )}

                      <button
                        onClick={() => copyPrompt(record.prompt, record.id)}
                        className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                        title="نسخ البرومبت"
                      >
                        {copiedId === record.id ? (
                          <Check className="w-4 h-4 text-emerald-400" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </button>

                      <button
                        onClick={() => onSelectRecord(record)}
                        className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-300 transition-colors"
                        title="إعادة الاستخدام في الاستوديو"
                      >
                        <Sliders className="w-4 h-4" />
                      </button>
                    </div>

                    <button
                      onClick={() => onDeleteRecord(record.id)}
                      className="p-2 rounded-lg hover:bg-rose-950/40 text-slate-500 hover:text-rose-400 transition-colors"
                      title="حذف هذا السجل"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Empty State */
        <div className="p-12 text-center rounded-3xl bg-slate-900 border border-slate-800 space-y-3 max-w-xl mx-auto">
          <div className="w-14 h-14 mx-auto rounded-full bg-slate-800 flex items-center justify-center text-slate-500">
            <History className="w-7 h-7" />
          </div>
          <div>
            <h4 className="text-base font-bold text-white">سجل العمليات فارغ</h4>
            <p className="text-xs text-slate-400 max-w-sm mx-auto mt-1">
              ستظهر هنا جميع صورك المولدة وإعداداتها مع خيارات إعادة التنزيل والمقارنة وحفظ التعديلات.
            </p>
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
            alt="تكبير نتيجة السجل"
            className="max-w-[92vw] max-h-[92vh] object-contain rounded-2xl shadow-2xl"
          />
        </div>
      )}
    </div>
  );
};
