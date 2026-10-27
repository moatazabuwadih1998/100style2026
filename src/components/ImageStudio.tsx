import React, { useState, useRef } from 'react';
import {
  Upload,
  Image as ImageIcon,
  Sparkles,
  Sliders,
  Download,
  RotateCcw,
  AlertTriangle,
  CheckCircle2,
  Maximize2,
  SplitSquareVertical,
  Layers,
  Key,
  ShieldCheck,
  Eye,
  Trash2
} from 'lucide-react';
import {
  ArtStyle,
  GenerationRecord,
  GenerationSettings,
  ApiServerStatus
} from '../types/styles';
import { sendGenerateImageRequest } from '../services/apiService';
import { triggerDownload } from '../services/exportService';
import { getStyleSvgUrl } from '../data/stylesData';

interface ImageStudioProps {
  styles: ArtStyle[];
  selectedStyle: ArtStyle;
  initialPrompt?: string;
  initialNegativePrompt?: string;
  serverStatus: ApiServerStatus;
  onStyleChange: (style: ArtStyle) => void;
  onSaveRecord: (record: GenerationRecord) => void;
  onOpenComparison: (record: GenerationRecord) => void;
  onOpenSettings: () => void;
}

export const ImageStudio: React.FC<ImageStudioProps> = ({
  styles,
  selectedStyle,
  initialPrompt,
  initialNegativePrompt,
  serverStatus,
  onStyleChange,
  onSaveRecord,
  onOpenComparison,
  onOpenSettings
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Reference Image
  const DEFAULT_REFERENCE_IMAGE = '/assets/default-character-opt.jpg';
  const [referenceImage, setReferenceImage] = useState<string | null>(DEFAULT_REFERENCE_IMAGE);
  const [referenceFileName, setReferenceFileName] = useState<string>('الشخصية المرجعية المعتمدة (صورة افتراضية)');

  // Prompt & Settings
  const [prompt, setPrompt] = useState<string>(initialPrompt || selectedStyle.promptTemplate);
  const [negativePrompt, setNegativePrompt] = useState<string>(
    initialNegativePrompt || selectedStyle.negativePrompt
  );
  const [preserveIdentity, setPreserveIdentity] = useState<boolean>(true);
  const [settings, setSettings] = useState<GenerationSettings>({
    aspectRatio: '1:1',
    quality: 'standard',
    model: 'dall-e-3',
    referenceFidelityPrompt: true,
    styleStrength: 85
  });

  // Generation execution state
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [generationStep, setGenerationStep] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [currentResult, setCurrentResult] = useState<GenerationRecord | null>(null);
  const [iterationVersion, setIterationVersion] = useState<number>(1);
  const [isZoomModalOpen, setIsZoomModalOpen] = useState<boolean>(false);

  // Update prompt when selectedStyle changes if prompt wasn't deeply modified
  React.useEffect(() => {
    if (initialPrompt) {
      setPrompt(initialPrompt);
    } else {
      setPrompt(selectedStyle.promptTemplate);
    }
    if (initialNegativePrompt) {
      setNegativePrompt(initialNegativePrompt);
    } else {
      setNegativePrompt(selectedStyle.negativePrompt);
    }
  }, [selectedStyle, initialPrompt, initialNegativePrompt]);

  // Handle Image Upload & Validation
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate type
    const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      setErrorMessage('صيغة الملف غير مدعومة. يرجى اختيار صورة بصيغة JPEG أو PNG أو WebP.');
      return;
    }

    // Validate size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      setErrorMessage('حجم الصورة كبير جداً. الحد الأقصى المسموح به هو 10 ميغابايت.');
      return;
    }

    setErrorMessage(null);
    setReferenceFileName(file.name);

    const reader = new FileReader();
    reader.onload = () => {
      setReferenceImage(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleClearReferenceImage = () => {
    setReferenceImage(null);
    setReferenceFileName('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // Perform Real Generation
  const handleStartGeneration = async () => {
    if (!prompt.trim()) {
      setErrorMessage('يرجى إدخال البرومبت قبل بدء التوليد.');
      return;
    }

    setIsGenerating(true);
    setErrorMessage(null);

    const recordId = `gen-${Date.now()}`;
    const newRecord: GenerationRecord = {
      id: recordId,
      timestamp: Date.now(),
      status: 'uploading',
      styleId: selectedStyle.id,
      styleNameAr: selectedStyle.styleNameAr,
      styleNameEn: selectedStyle.styleNameEn,
      prompt: prompt.trim(),
      negativePrompt: negativePrompt.trim(),
      aspectRatio: settings.aspectRatio,
      quality: settings.quality,
      referenceImageBase64: referenceImage || undefined,
      iterationCount: iterationVersion
    };

    try {
      setGenerationStep('التحقق من المدخلات وتهيئة أبعاد الصورة...');
      await new Promise((r) => setTimeout(r, 400));

      setGenerationStep('معالجة برومبت الأسلوب وتعليمات حفظ الهوية...');
      await new Promise((r) => setTimeout(r, 400));

      setGenerationStep('إرسال الطلب إلى خادم OpenAI للرسم والتوليد الفعلي...');

      const response = await sendGenerateImageRequest({
        prompt: prompt.trim(),
        negativePrompt: negativePrompt.trim(),
        styleId: selectedStyle.id,
        styleNameAr: selectedStyle.styleNameAr,
        styleNameEn: selectedStyle.styleNameEn,
        settings,
        referenceImageBase64: referenceImage || undefined,
        preserveIdentity
      });

      if (!response.success || (!response.resultImageBase64 && !response.resultImageUrl)) {
        throw new Error(response.error || 'فشلت عملية التوليد من المزود.');
      }

      setGenerationStep('اكتمل التوليد بنجاح! يتم تجهيز الصورة...');

      const completedRecord: GenerationRecord = {
        ...newRecord,
        status: 'completed',
        resultImageBase64: response.resultImageBase64,
        resultImageUrl: response.resultImageUrl
      };

      setCurrentResult(completedRecord);
      onSaveRecord(completedRecord);
      setIterationVersion((v) => v + 1);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'حدث خطأ أثناء الاتصال بالخادم';
      setErrorMessage(msg);

      const failedRecord: GenerationRecord = {
        ...newRecord,
        status: 'failed',
        errorMessage: msg
      };
      onSaveRecord(failedRecord);
    } finally {
      setIsGenerating(false);
      setGenerationStep('');
    }
  };

  // Download Generated Result with clear meaningful name
  const handleDownloadResult = () => {
    if (!currentResult?.resultImageBase64 && !currentResult?.resultImageUrl) return;

    const filename = `anime-style-${selectedStyle.id}-${selectedStyle.styleNameEn.toLowerCase().replace(/[^a-z0-9]/g, '-')}-v${currentResult.iterationCount}.png`;

    if (currentResult.resultImageBase64?.startsWith('data:image')) {
      // Direct base64 download
      const link = document.createElement('a');
      link.href = currentResult.resultImageBase64;
      link.download = filename;
      link.click();
    } else if (currentResult.resultImageUrl) {
      fetch(currentResult.resultImageUrl)
        .then((res) => res.blob())
        .then((blob) => {
          triggerDownload(blob, filename, 'image/png');
        })
        .catch(() => {
          window.open(currentResult.resultImageUrl, '_blank');
        });
    }
  };

  return (
    <div className="space-y-6">
      {/* Missing API Key Warning Banner if server key is absent */}
      {!serverStatus.hasOpenAiKey && (
        <div className="p-4 sm:p-5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <Key className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div className="text-xs sm:text-sm">
              <strong className="block text-amber-300 font-bold mb-0.5">
                تنبيه تكامل OpenAI API:
              </strong>
              <span>
                لم يتم رصد متغير البيئة <code className="font-mono bg-black/40 px-1.5 py-0.5 rounded text-amber-300">OPENAI_API_KEY</code> في الخادم.
                يمكنك إضافة المفتاح إلى ملف <code className="font-mono bg-black/40 px-1.5 py-0.5 rounded">.env</code> لتشغيل التوليد الحقيقي فوراً.
              </span>
            </div>
          </div>
          <button
            onClick={onOpenSettings}
            className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shrink-0 transition-colors shadow-md"
          >
            إعداد المفتاح
          </button>
        </div>
      )}

      {/* Main Studio Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Reference Image & Settings */}
        <div className="lg:col-span-5 space-y-5">
          {/* Reference Image Uploader */}
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-sm font-bold text-white flex items-center gap-2">
                <Upload className="w-4 h-4 text-indigo-400" />
                <span>الصورة المرجعية للشخصية (Reference Photo):</span>
              </label>
              <div className="flex items-center gap-2">
                {referenceImage !== DEFAULT_REFERENCE_IMAGE && (
                  <button
                    onClick={() => {
                      setReferenceImage(DEFAULT_REFERENCE_IMAGE);
                      setReferenceFileName('الشخصية المرجعية المعتمدة (صورة افتراضية)');
                    }}
                    className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
                    title="استعادة الشخصية المرجعية الافتراضية"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>الصورة الافتراضية</span>
                  </button>
                )}
                {referenceImage && (
                  <button
                    onClick={handleClearReferenceImage}
                    className="text-xs text-rose-400 hover:text-rose-300 flex items-center gap-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>إزالة</span>
                  </button>
                )}
              </div>
            </div>

            {referenceImage ? (
              <div className="relative aspect-square rounded-xl overflow-hidden bg-slate-950 border border-slate-800 group">
                <img
                  src={referenceImage}
                  alt="الصورة المرجعية للشخصية"
                  className="w-full h-full object-contain"
                />
                <div className="absolute bottom-2 inset-x-2 bg-slate-950/85 backdrop-blur-md px-3 py-1.5 rounded-lg border border-slate-800 flex items-center justify-between text-xs text-slate-300">
                  <span className="truncate max-w-[180px] font-mono text-[11px]">{referenceFileName || 'صورة شخصية'}</span>
                  <span className="text-emerald-400 font-semibold text-[11px]">جاهزة كمرجع</span>
                </div>
              </div>
            ) : (
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-slate-750 hover:border-indigo-500/70 rounded-2xl p-6 text-center cursor-pointer transition-colors bg-slate-950/40 hover:bg-slate-950/70 space-y-3"
              >
                <div className="w-12 h-12 mx-auto rounded-full bg-indigo-600/10 text-indigo-400 flex items-center justify-center">
                  <Upload className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm font-bold text-white">انقر لرفع صورة شخصية من الهاتف أو الكمبيوتر</p>
                  <p className="text-xs text-slate-400 mt-1">يدعم PNG, JPG, WebP بحجم يصل إلى 10 ميغابايت</p>
                </div>
                <div className="inline-flex items-center gap-1 text-xs text-indigo-400 font-semibold">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>سيتم تطبيق خوارزمية حفظ الملامح على هذه الصورة</span>
                </div>
              </div>
            )}

            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={handleImageUpload}
              className="hidden"
            />
          </div>

          {/* Style Selector in Studio */}
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-bold text-white flex items-center gap-2">
                <Layers className="w-4 h-4 text-cyan-400" />
                <span>الأسلوب الفني المحدد للتوليد:</span>
              </label>
              <span className="text-xs font-mono text-cyan-400 font-bold">
                {selectedStyle.id.toUpperCase()}
              </span>
            </div>

            <select
              value={selectedStyle.id}
              onChange={(e) => {
                const found = styles.find((s) => s.id === e.target.value);
                if (found) onStyleChange(found);
              }}
              className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-750 text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
            >
              {styles.map((s) => (
                <option key={s.id} value={s.id}>
                  [{s.id.toUpperCase()}] {s.styleNameAr} ({s.styleNameEn})
                </option>
              ))}
            </select>

            <div className="flex items-center gap-3 p-2.5 rounded-xl bg-slate-950/70 border border-slate-850">
              <img
                src={getStyleSvgUrl(selectedStyle)}
                alt={selectedStyle.previewAlt}
                className="w-12 h-12 rounded-lg object-cover shrink-0 border border-slate-800"
              />
              <div className="min-w-0 flex-1">
                <div className="text-xs font-bold text-white truncate">{selectedStyle.styleNameAr}</div>
                <div className="text-[11px] text-slate-400 line-clamp-1">{selectedStyle.description}</div>
              </div>
            </div>
          </div>

          {/* Aspect Ratio, Quality, Fidelity Settings */}
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <Sliders className="w-4 h-4 text-indigo-400" />
              <span>إعدادات نموذج التوليد والجودة:</span>
            </h4>

            {/* Aspect Ratio */}
            <div>
              <span className="text-xs text-slate-300 font-medium block mb-1.5">نسبة الأبعاد (Aspect Ratio):</span>
              <div className="grid grid-cols-4 gap-2">
                {[
                  { id: '1:1', label: '1:1', desc: 'مربع' },
                  { id: '4:5', label: '4:5', desc: 'منشورات' },
                  { id: '3:4', label: '3:4', desc: 'عمودي' },
                  { id: '9:16', label: '9:16', desc: 'ستوري' }
                ].map((r) => (
                  <button
                    key={r.id}
                    type="button"
                    onClick={() => setSettings({ ...settings, aspectRatio: r.id as any })}
                    className={`p-2 rounded-xl text-center border transition-all ${
                      settings.aspectRatio === r.id
                        ? 'bg-indigo-600 text-white border-indigo-500 shadow-md'
                        : 'bg-slate-950 text-slate-300 border-slate-800 hover:bg-slate-850'
                    }`}
                  >
                    <div className="font-mono text-xs font-bold">{r.label}</div>
                    <div className="text-[10px] text-slate-400 mt-0.5">{r.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Quality and Model */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <span className="text-xs text-slate-300 font-medium block mb-1.5">جودة التوليد:</span>
                <select
                  value={settings.quality}
                  onChange={(e) => setSettings({ ...settings, quality: e.target.value as any })}
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-750 text-white text-xs"
                >
                  <option value="standard">قياسية (Standard HD)</option>
                  <option value="hd">عالية الدقة (Ultra HD)</option>
                </select>
              </div>

              <div>
                <span className="text-xs text-slate-300 font-medium block mb-1.5">نموذج الصور:</span>
                <select
                  value={settings.model}
                  onChange={(e) => setSettings({ ...settings, model: e.target.value as any })}
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-750 text-white text-xs"
                >
                  <option value="dall-e-3">DALL-E 3 (الموصى به)</option>
                  <option value="dall-e-2">DALL-E 2 (سريع)</option>
                </select>
              </div>
            </div>

            {/* Identity Preservation Toggle in Studio */}
            <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span className="text-xs font-semibold text-slate-200">
                  الحفاظ على ملامح الوجه الأصلية
                </span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={preserveIdentity}
                  onChange={(e) => setPreserveIdentity(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-9 h-5 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-500" />
              </label>
            </div>
          </div>
        </div>

        {/* Right Column: Prompt Customizer, Actions & Result Studio */}
        <div className="lg:col-span-7 space-y-5">
          {/* Prompt Editor */}
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-bold text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-indigo-400" />
                <span>برومبت التوليد الفعلي باللغة الإنجليزية:</span>
              </label>
              <button
                type="button"
                onClick={() => setPrompt(selectedStyle.promptTemplate)}
                className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
                title="استعادة قالب الأسلوب الأصلي"
              >
                <RotateCcw className="w-3 h-3" />
                <span>استعادة الأصلي</span>
              </button>
            </div>

            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              rows={4}
              placeholder="اكتب أو عدل البرومبت الإنجليزي هنا..."
              className="w-full p-3.5 rounded-xl bg-slate-950 border border-slate-750 text-cyan-300 font-mono text-xs leading-relaxed focus:outline-none focus:ring-2 focus:ring-indigo-500 direction-ltr text-left"
            />

            {/* Error Message Display */}
            {errorMessage && (
              <div className="p-3.5 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs flex items-start gap-2.5">
                <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                <div className="leading-relaxed">{errorMessage}</div>
              </div>
            )}

            {/* Main Trigger Button */}
            <button
              type="button"
              disabled={isGenerating}
              onClick={handleStartGeneration}
              className={`w-full py-4 px-6 rounded-2xl font-black text-sm shadow-xl flex items-center justify-center gap-2.5 transition-all ${
                isGenerating
                  ? 'bg-slate-800 text-slate-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white shadow-indigo-600/30 hover:scale-[1.01] active:scale-[0.99]'
              }`}
            >
              {isGenerating ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>{generationStep || 'جاري التوليد...'}</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  <span>
                    بدء توليد الصورة الفعلية عبر OpenAI (النسخة {iterationVersion})
                  </span>
                </>
              )}
            </button>
          </div>

          {/* Result Display & Controls */}
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-white text-base flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-cyan-400" />
                <span>النتيجة المولدة الفعلية (Output):</span>
              </h3>
              {currentResult && (
                <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                  النسخة #{currentResult.iterationCount}
                </span>
              )}
            </div>

            {currentResult && (currentResult.resultImageBase64 || currentResult.resultImageUrl) ? (
              <div className="space-y-4">
                {/* Result Image Viewport */}
                <div className="relative rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 group shadow-2xl flex items-center justify-center min-h-[300px]">
                  <img
                    src={currentResult.resultImageBase64 || currentResult.resultImageUrl}
                    alt={`صورة مولدة بأسلوب ${selectedStyle.styleNameAr}`}
                    className="max-h-[500px] w-auto max-w-full object-contain"
                  />

                  {/* Top Action Overlay */}
                  <div className="absolute top-3 left-3 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => setIsZoomModalOpen(true)}
                      className="p-2 rounded-xl bg-slate-950/80 hover:bg-slate-900 text-white border border-slate-700 shadow-md backdrop-blur-md"
                      title="تكبير الصورة بحجم الشاشة"
                    >
                      <Maximize2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Result Control Bar */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  <button
                    onClick={handleDownloadResult}
                    className="py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20 transition-all hover:scale-105"
                  >
                    <Download className="w-4 h-4" />
                    <span>تنزيل الصورة (.PNG)</span>
                  </button>

                  {referenceImage && (
                    <button
                      onClick={() => onOpenComparison(currentResult)}
                      className="py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-750 text-indigo-300 hover:text-white font-bold text-xs flex items-center justify-center gap-2 border border-slate-700 transition-colors"
                    >
                      <SplitSquareVertical className="w-4 h-4 text-cyan-400" />
                      <span>مقارنة قبل وبعد</span>
                    </button>
                  )}

                  <button
                    onClick={handleStartGeneration}
                    className="py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-200 font-bold text-xs flex items-center justify-center gap-2 border border-slate-700 transition-colors"
                  >
                    <RotateCcw className="w-4 h-4 text-amber-400" />
                    <span>إعادة توليد نسخة أخرى</span>
                  </button>
                </div>

                {/* Metadata & Technical specs */}
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-850 text-xs text-slate-400 space-y-1 font-mono">
                  <div className="flex justify-between">
                    <span>الأسلوب الفني:</span>
                    <span className="text-slate-200">{selectedStyle.styleNameAr} ({selectedStyle.id})</span>
                  </div>
                  <div className="flex justify-between">
                    <span>نسبة الأبعاد:</span>
                    <span className="text-slate-200">{settings.aspectRatio}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>النموذج والجودة:</span>
                    <span className="text-slate-200">{settings.model} • {settings.quality}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>حالة الهوية:</span>
                    <span className="text-emerald-400">
                      {preserveIdentity ? 'مُفعّلة مع مؤشرات الملامح' : 'حرة'}
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              /* Empty state before generation */
              <div className="p-12 text-center rounded-2xl bg-slate-950/50 border border-slate-850 space-y-3">
                <div className="w-14 h-14 mx-auto rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-500">
                  <ImageIcon className="w-7 h-7" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">لا توجد صورة مولدة حالياً</h4>
                  <p className="text-xs text-slate-400 max-w-sm mx-auto mt-1">
                    ارفع صورتك المرجعية (اختياري) أو اختر أحد الأساليب المئة ثم انقر على زر التوليد لتشغيل الذكاء الاصطناعي الفعلي.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Zoom Modal for Result */}
      {isZoomModalOpen && currentResult && (
        <div
          className="fixed inset-0 z-60 bg-black/95 flex items-center justify-center p-4 cursor-zoom-out"
          onClick={() => setIsZoomModalOpen(false)}
        >
          <img
            src={currentResult.resultImageBase64 || currentResult.resultImageUrl}
            alt="الصورة المولدة بحجم كبير"
            className="max-w-[92vw] max-h-[92vh] object-contain rounded-2xl shadow-2xl"
          />
        </div>
      )}
    </div>
  );
};
