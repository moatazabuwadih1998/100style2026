import React, { useState } from 'react';
import {
  Download,
  FileCode,
  FileSpreadsheet,
  FileText,
  Archive,
  BookOpen,
  CheckCircle2,
  Sparkles,
  ExternalLink,
  Code
} from 'lucide-react';
import {
  generateStylesJson,
  generateComfyUiCsv,
  generatePromptsLibraryTxt,
  generateNotionCsv,
  generateNotionMarkdown,
  generateStandaloneHtml,
  downloadCompleteProjectZip,
  triggerDownload
} from '../services/exportService';

export const ExportCenter: React.FC = () => {
  const [downloadingZip, setDownloadingZip] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState<string | null>(null);

  const handleDownloadFile = (type: string) => {
    try {
      if (type === 'json') {
        triggerDownload(generateStylesJson(), '100-styles.json', 'application/json');
      } else if (type === 'comfyui') {
        triggerDownload(generateComfyUiCsv(), '100-styles-comfyui.csv', 'text/csv;charset=utf-8');
      } else if (type === 'prompts') {
        triggerDownload(generatePromptsLibraryTxt(), 'prompts-library.txt', 'text/plain;charset=utf-8');
      } else if (type === 'notion_csv') {
        triggerDownload(generateNotionCsv(), 'notion-styles-database.csv', 'text/csv;charset=utf-8');
      } else if (type === 'notion_md') {
        triggerDownload(generateNotionMarkdown(), 'notion-styles.md', 'text/markdown;charset=utf-8');
      } else if (type === 'html') {
        triggerDownload(generateStandaloneHtml(), '100-styles.html', 'text/html;charset=utf-8');
      }

      setDownloadSuccess(type);
      setTimeout(() => setDownloadSuccess(null), 2500);
    } catch (e) {
      console.error('Download error:', e);
    }
  };

  const handleFullZipDownload = async () => {
    try {
      setDownloadingZip(true);
      await downloadCompleteProjectZip();
      setDownloadSuccess('zip');
      setTimeout(() => setDownloadSuccess(null), 3000);
    } catch (err) {
      console.error('Error generating project ZIP:', err);
    } finally {
      setDownloadingZip(false);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-indigo-950/60 via-slate-900 to-cyan-950/40 border border-indigo-500/30 shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/25 mb-2">
            <Archive className="w-3.5 h-3.5" />
            <span>مركز التصدير والحزم الجاهزة</span>
          </div>
          <h2 className="text-2xl font-black text-white">
            تصدير بيانات الأساليب والبرومبتات وملفات المشروع
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
            وفّرنا لك جميع الملفات والبيانات بتنسيقات قياسية جاهزة للاستيراد في برامج التصميم ComfyUI و Notion و Excel أو صفحة HTML مستقلة تعمل دون إنترنت، وحزمة المشروع البرمجية الكاملة بصيغة ZIP.
          </p>
        </div>

        {/* Master Full Project ZIP Button */}
        <button
          onClick={handleFullZipDownload}
          disabled={downloadingZip}
          className="w-full md:w-auto px-6 py-4 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white font-black text-sm shadow-xl shadow-emerald-600/30 flex items-center justify-center gap-3 shrink-0 transition-all hover:scale-105 active:scale-95 disabled:opacity-50"
        >
          {downloadingZip ? (
            <>
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>جاري ضغط ملفات المشروع...</span>
            </>
          ) : (
            <>
              <Archive className="w-5 h-5" />
              <span>تحميل الحزمة الكاملة (ZIP)</span>
            </>
          )}
        </button>
      </div>

      {downloadSuccess && (
        <div className="p-3.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-bold flex items-center gap-2 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>تم تنزيل الملف بنجاح إلى جهازك!</span>
        </div>
      )}

      {/* Export Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {/* Standalone HTML Card */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4 flex flex-col justify-between shadow-lg hover:border-indigo-500/40 transition-colors">
          <div className="space-y-2">
            <div className="w-10 h-10 rounded-xl bg-indigo-600/20 text-indigo-400 flex items-center justify-center">
              <FileCode className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-white">100-styles.html</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              صفحة ويب متكاملة ومستقلة تضم كافة الأساليب المئة مع محرك بحث وتصفية بالمجموعات تعمل بدون اتصال بالإنترنت.
            </p>
          </div>
          <button
            onClick={() => handleDownloadFile('html')}
            className="w-full py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-750 text-indigo-300 hover:text-white font-bold text-xs flex items-center justify-center gap-2 border border-slate-700 transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>تنزيل (HTML)</span>
          </button>
        </div>

        {/* ComfyUI CSV */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4 flex flex-col justify-between shadow-lg hover:border-cyan-500/40 transition-colors">
          <div className="space-y-2">
            <div className="w-10 h-10 rounded-xl bg-cyan-600/20 text-cyan-400 flex items-center justify-center">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-white">100-styles-comfyui.csv</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              ملف CSV مخصص ومطابق لبنية لوادر الأساليب في ComfyUI و Automatic1111 (Style Loaders) متضمن البرومبت والسلبي.
            </p>
          </div>
          <button
            onClick={() => handleDownloadFile('comfyui')}
            className="w-full py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-750 text-cyan-300 hover:text-white font-bold text-xs flex items-center justify-center gap-2 border border-slate-700 transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>تنزيل لـ ComfyUI (CSV)</span>
          </button>
        </div>

        {/* Full JSON Data */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4 flex flex-col justify-between shadow-lg hover:border-amber-500/40 transition-colors">
          <div className="space-y-2">
            <div className="w-10 h-10 rounded-xl bg-amber-600/20 text-amber-400 flex items-center justify-center">
              <Code className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-white">100-styles.json</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              قاعدة بيانات JSON موحدة ونقية تشمل جميع خصائص الأساليب والمعرّفات والأوصاف ولوحات الألوان للمطورين.
            </p>
          </div>
          <button
            onClick={() => handleDownloadFile('json')}
            className="w-full py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-750 text-amber-300 hover:text-white font-bold text-xs flex items-center justify-center gap-2 border border-slate-700 transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>تنزيل (JSON)</span>
          </button>
        </div>

        {/* Prompts Library Text */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4 flex flex-col justify-between shadow-lg hover:border-emerald-500/40 transition-colors">
          <div className="space-y-2">
            <div className="w-10 h-10 rounded-xl bg-emerald-600/20 text-emerald-400 flex items-center justify-center">
              <FileText className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-white">prompts-library.txt</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              مكتبة نصية مفصلة ومفهرسة تضم جميع البرومبتات الإيجابية والسلبية والكلمات المفتاحية منظمة داخل ملف TXT سهل القراءة.
            </p>
          </div>
          <button
            onClick={() => handleDownloadFile('prompts')}
            className="w-full py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-750 text-emerald-300 hover:text-white font-bold text-xs flex items-center justify-center gap-2 border border-slate-700 transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>تنزيل المكتبة (TXT)</span>
          </button>
        </div>

        {/* Notion CSV Database */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4 flex flex-col justify-between shadow-lg hover:border-purple-500/40 transition-colors">
          <div className="space-y-2">
            <div className="w-10 h-10 rounded-xl bg-purple-600/20 text-purple-400 flex items-center justify-center">
              <BookOpen className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-white">notion-styles.csv</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              ملف CSV منسق ومُهيأ للاستيراد المباشر في Notion لإنشاء قاعدة بيانات تفاعلية مع حقول الأسماء والمجموعات والبرومبتات.
            </p>
          </div>
          <button
            onClick={() => handleDownloadFile('notion_csv')}
            className="w-full py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-750 text-purple-300 hover:text-white font-bold text-xs flex items-center justify-center gap-2 border border-slate-700 transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>تنزيل لـ Notion (CSV)</span>
          </button>
        </div>

        {/* Notion Markdown Document */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4 flex flex-col justify-between shadow-lg hover:border-rose-500/40 transition-colors">
          <div className="space-y-2">
            <div className="w-10 h-10 rounded-xl bg-rose-600/20 text-rose-400 flex items-center justify-center">
              <FileText className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-white">notion-styles.md</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              مستند Markdown متوافق مع Notion و Obsidian يضم فهرساً مرتباً بالمجموعات والأساليب وكتل برومبتات جاهزة للنسخ.
            </p>
          </div>
          <button
            onClick={() => handleDownloadFile('notion_md')}
            className="w-full py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-750 text-rose-300 hover:text-white font-bold text-xs flex items-center justify-center gap-2 border border-slate-700 transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>تنزيل Markdown (.md)</span>
          </button>
        </div>
      </div>
    </div>
  );
};
