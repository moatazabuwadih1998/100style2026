import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Copy,
  Check,
  RotateCcw,
  Sliders,
  ShieldCheck,
  User,
  Image as ImageIcon,
  Sun,
  Camera,
  Layers,
  ArrowLeft
} from 'lucide-react';
import { ArtStyle, PromptBuilderOptions } from '../types/styles';
import { getStyleSvgUrl } from '../data/stylesData';

interface PromptBuilderProps {
  styles: ArtStyle[];
  selectedStyle?: ArtStyle;
  onSelectStyle: (style: ArtStyle) => void;
  onSendToStudio: (prompt: string, negativePrompt: string, style: ArtStyle, preserveIdentity: boolean) => void;
}

export const PromptBuilder: React.FC<PromptBuilderProps> = ({
  styles,
  selectedStyle,
  onSelectStyle,
  onSendToStudio
}) => {
  const defaultStyle = selectedStyle || styles[0];

  const [options, setOptions] = useState<PromptBuilderOptions>({
    characterType: 'man',
    customCharacterDesc: '',
    selectedStyleId: defaultStyle.id,
    background: 'cinematic',
    customBackgroundDesc: '',
    lighting: 'cinematic',
    detailLevel: 'ultra',
    shotAngle: 'close_up',
    aspectRatio: '1:1',
    preserveIdentity: true,
    preserveClothing: true,
    preserveHair: true,
    customNotes: ''
  });

  const [currentStyle, setCurrentStyle] = useState<ArtStyle>(defaultStyle);
  const [generatedPrompt, setGeneratedPrompt] = useState<string>('');
  const [generatedNegativePrompt, setGeneratedNegativePrompt] = useState<string>('');
  const [copiedType, setCopiedType] = useState<string | null>(null);

  // Update style when prop changes
  useEffect(() => {
    if (selectedStyle) {
      setCurrentStyle(selectedStyle);
      setOptions((prev) => ({ ...prev, selectedStyleId: selectedStyle.id }));
    }
  }, [selectedStyle]);

  // Handle style dropdown change
  const handleStyleChange = (styleId: string) => {
    const found = styles.find((s) => s.id === styleId);
    if (found) {
      setCurrentStyle(found);
      setOptions((prev) => ({ ...prev, selectedStyleId: styleId }));
      onSelectStyle(found);
    }
  };

  // Recompute Prompt whenever options or currentStyle change
  useEffect(() => {
    // Character subject
    let subjectEn = 'handsome man';
    if (options.characterType === 'woman') subjectEn = 'beautiful woman';
    else if (options.characterType === 'fantasy') subjectEn = 'mythical fantasy character';
    else if (options.characterType === 'game_hero') subjectEn = 'legendary video game protagonist';
    else if (options.characterType === 'custom' && options.customCharacterDesc) {
      subjectEn = options.customCharacterDesc;
    }

    // Shot angle
    let shotEn = 'portrait close-up shot';
    if (options.shotAngle === 'half_body') shotEn = 'medium half-body shot';
    else if (options.shotAngle === 'full_body') shotEn = 'epic full-body dynamic stance';
    else if (options.shotAngle === 'dutch_angle') shotEn = 'dramatic tilted Dutch-angle action composition';

    // Lighting
    let lightEn = 'cinematic dramatic volumetric rim lighting';
    if (options.lighting === 'soft') lightEn = 'soft diffused gentle ambient lighting';
    else if (options.lighting === 'dramatic') lightEn = 'high-contrast dramatic chiaroscuro lighting';
    else if (options.lighting === 'neon') lightEn = 'vibrant cyberpunk neon ambient glow and sharp specular highlights';
    else if (options.lighting === 'studio') lightEn = 'professional 3-point studio lighting setup';
    else if (options.lighting === 'natural') lightEn = 'natural warm golden-hour sunlight';

    // Background
    let bgEn = 'cinematic moody atmospheric background with subtle depth of field';
    if (options.background === 'studio') bgEn = 'minimalist clean studio backdrop with subtle color gradient';
    else if (options.background === 'cyberpunk_city') bgEn = 'dystopian futuristic cyberpunk metropolis with glowing neon signs';
    else if (options.background === 'nature') bgEn = 'lush enchanted natural scenery with wind-blown foliage and soft skies';
    else if (options.background === 'fantasy_realm') bgEn = 'ancient mythical castle ruins and floating ethereal spires';
    else if (options.background === 'custom' && options.customBackgroundDesc) {
      bgEn = options.customBackgroundDesc;
    }

    // Detail level
    let detailEn = 'masterpiece, 8k resolution, ultra-detailed textures, award-winning illustration';
    if (options.detailLevel === 'simple') detailEn = 'clean minimalist composition, balanced simplicity';
    else if (options.detailLevel === 'medium') detailEn = 'high quality, balanced artistic details and textures';
    else if (options.detailLevel === 'high') detailEn = 'highly detailed, intricate linework and nuanced shading';

    // Identity instructions
    let identityAnchors = '';
    if (options.preserveIdentity) {
      identityAnchors = 'Crucial identity preservation: Exact facial structure, eye shape and color, nose and lip contours, skin tone, facial hair and distinctive biometric features of the reference subject must be faithfully preserved, seamlessly rendered into this artistic style.';
      if (options.preserveClothing) {
        identityAnchors += ' Maintain original clothing silhouette, signature accessories, and styling cues.';
      }
      if (options.preserveHair) {
        identityAnchors += ' Preserve original hairstyle, hairline and natural hair color adapted to the style medium.';
      }
    }

    // Custom notes
    const customExtra = options.customNotes ? `, ${options.customNotes}` : '';

    const positive = `masterpiece, ${shotEn} of ${subjectEn}, created in authentic ${currentStyle.styleNameEn} (${currentStyle.keywords.slice(0, 3).join(', ')}), ${currentStyle.promptTemplate}, ${lightEn}, ${bgEn}, ${detailEn}${customExtra}. ${identityAnchors}`.trim();

    const negative = `${currentStyle.negativePrompt}, low quality, blurry, distorted face, bad anatomy, duplicate, extra limbs, deformed fingers, artifacts, watermark, signature`.trim();

    setGeneratedPrompt(positive);
    setGeneratedNegativePrompt(negative);
  }, [options, currentStyle]);

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopiedType(type);
    setTimeout(() => setCopiedType(null), 1800);
  };

  const handleReset = () => {
    setOptions({
      characterType: 'man',
      customCharacterDesc: '',
      selectedStyleId: currentStyle.id,
      background: 'cinematic',
      customBackgroundDesc: '',
      lighting: 'cinematic',
      detailLevel: 'ultra',
      shotAngle: 'close_up',
      aspectRatio: '1:1',
      preserveIdentity: true,
      preserveClothing: true,
      preserveHair: true,
      customNotes: ''
    });
  };

  return (
    <div className="space-y-6">
      {/* Header card */}
      <div className="p-4 sm:p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/25 mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>باني البرومبتات الذكي</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white">
            أنشئ برومبتًا احترافيًا متوافقًا مع الذكاء الاصطناعي
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
            خصص عناصر الصورة (الشخصية، الخلفية، الإضاءة، الأبعاد) مع الحفاظ الدقيق على هوية الملامح. يتحدث البرومبت فورياً بالإنجليزية ويمكن نسخه أو إرساله مباشرة للاستوديو.
          </p>
        </div>

        <button
          onClick={handleReset}
          className="self-start md:self-auto px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-300 hover:text-white text-xs font-semibold border border-slate-750 flex items-center gap-1.5 transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>إعادة ضبط الخيارات</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Form Controls */}
        <div className="lg:col-span-7 space-y-5">
          {/* Style Selector Card */}
          <div className="p-4 sm:p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-bold text-white flex items-center gap-2">
                <Layers className="w-4 h-4 text-indigo-400" />
                <span>الأسلوب الفني المعتمد (اختر من 100 أسلوب):</span>
              </label>
              <span className="text-xs font-mono text-cyan-400 font-bold">
                {currentStyle.id.toUpperCase()}
              </span>
            </div>

            <select
              value={currentStyle.id}
              onChange={(e) => handleStyleChange(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-750 text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
            >
              {styles.map((s) => (
                <option key={s.id} value={s.id}>
                  [{s.id.toUpperCase()}] {s.styleNameAr} — {s.styleNameEn} ({s.groupNameAr})
                </option>
              ))}
            </select>

            {/* Selected Style Mini Preview */}
            <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-950/80 border border-slate-850">
              <img
                src={getStyleSvgUrl(currentStyle)}
                alt={currentStyle.previewAlt}
                className="w-14 h-14 rounded-lg object-cover shrink-0 border border-slate-800"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src = '/assets/default-character-opt.jpg';
                }}
              />
              <div className="flex-1 min-w-0">
                <div className="font-bold text-sm text-white truncate">{currentStyle.styleNameAr}</div>
                <div className="text-xs font-mono text-cyan-400 truncate">{currentStyle.styleNameEn}</div>
                <div className="text-xs text-slate-400 line-clamp-1 mt-0.5">{currentStyle.description}</div>
              </div>
            </div>
          </div>

          {/* Character Options */}
          <div className="p-4 sm:p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
            <label className="text-sm font-bold text-white flex items-center gap-2">
              <User className="w-4 h-4 text-indigo-400" />
              <span>نوع وهوية الشخصية (Character Type):</span>
            </label>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
              {[
                { id: 'man', label: 'رجل' },
                { id: 'woman', label: 'امرأة' },
                { id: 'fantasy', label: 'شخصية خيالية' },
                { id: 'game_hero', label: 'شخصية لعبة' },
                { id: 'custom', label: 'وصف مخصص' }
              ].map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setOptions({ ...options, characterType: opt.id as any })}
                  className={`py-2 px-3 rounded-xl text-xs font-bold transition-all border ${
                    options.characterType === opt.id
                      ? 'bg-indigo-600 text-white border-indigo-500 shadow-md shadow-indigo-600/30'
                      : 'bg-slate-950 text-slate-300 border-slate-800 hover:bg-slate-850'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>

            {options.characterType === 'custom' && (
              <input
                type="text"
                value={options.customCharacterDesc}
                onChange={(e) => setOptions({ ...options, customCharacterDesc: e.target.value })}
                placeholder="صف الشخصية بالإنجليزية أو العربية (مثال: young cyber samurai with braided silver hair)..."
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-750 text-white text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            )}
          </div>

          {/* Identity Preservation Toggle - CRUCIAL REQUIREMENT */}
          <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-indigo-950/40 via-slate-900 to-cyan-950/30 border border-indigo-500/30 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
                <div>
                  <span className="text-sm font-bold text-white block">
                    الحفاظ على هوية الشخصية (Biometric & Identity Preservation)
                  </span>
                  <span className="text-xs text-slate-400">
                    تضمين تعليمات صارمة للنموذج للحفاظ على ملامح الوجه وشكل العينين والأنف والبشرة
                  </span>
                </div>
              </div>

              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={options.preserveIdentity}
                  onChange={(e) => setOptions({ ...options, preserveIdentity: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500" />
              </label>
            </div>

            {options.preserveIdentity && (
              <div className="pt-2 border-t border-indigo-900/40 grid grid-cols-2 gap-3 text-xs">
                <label className="flex items-center gap-2 cursor-pointer text-slate-300 hover:text-white">
                  <input
                    type="checkbox"
                    checked={options.preserveHair}
                    onChange={(e) => setOptions({ ...options, preserveHair: e.target.checked })}
                    className="rounded bg-slate-950 border-slate-700 text-indigo-600 focus:ring-indigo-500"
                  />
                  <span>الحفاظ على شكل ولون الشعر الأصلي</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer text-slate-300 hover:text-white">
                  <input
                    type="checkbox"
                    checked={options.preserveClothing}
                    onChange={(e) => setOptions({ ...options, preserveClothing: e.target.checked })}
                    className="rounded bg-slate-950 border-slate-700 text-indigo-600 focus:ring-indigo-500"
                  />
                  <span>الحفاظ على أسلوب الملابس والإكسسوارات</span>
                </label>
              </div>
            )}
          </div>

          {/* Shot Angle & Aspect Ratio */}
          <div className="p-4 sm:p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
            <div>
              <label className="text-sm font-bold text-white flex items-center gap-2 mb-2">
                <Camera className="w-4 h-4 text-indigo-400" />
                <span>زاوية التصوير (Shot Framing):</span>
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { id: 'close_up', label: 'بورتريه مقرب' },
                  { id: 'half_body', label: 'نصف الجسم' },
                  { id: 'full_body', label: 'الجسم كاملًا' },
                  { id: 'dutch_angle', label: 'زاوية مائلة درامية' }
                ].map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => setOptions({ ...options, shotAngle: s.id as any })}
                    className={`py-2 px-2.5 rounded-xl text-xs font-semibold transition-all border ${
                      options.shotAngle === s.id
                        ? 'bg-indigo-600 text-white border-indigo-500 shadow-md'
                        : 'bg-slate-950 text-slate-300 border-slate-800 hover:bg-slate-850'
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-sm font-bold text-white flex items-center gap-2 mb-2">
                <ImageIcon className="w-4 h-4 text-indigo-400" />
                <span>نسبة الأبعاد (Aspect Ratio):</span>
              </label>
              <div className="grid grid-cols-4 gap-2">
                {[
                  { id: '1:1', label: '1:1 مربع' },
                  { id: '4:5', label: '4:5 للمنشورات' },
                  { id: '3:4', label: '3:4 عمودي' },
                  { id: '9:16', label: '9:16 ستوري وشاشات' }
                ].map((r) => (
                  <button
                    key={r.id}
                    type="button"
                    onClick={() => setOptions({ ...options, aspectRatio: r.id as any })}
                    className={`py-2 px-2 rounded-xl text-xs font-mono font-bold transition-all border ${
                      options.aspectRatio === r.id
                        ? 'bg-cyan-600 text-white border-cyan-500 shadow-md'
                        : 'bg-slate-950 text-slate-300 border-slate-800 hover:bg-slate-850'
                    }`}
                  >
                    {r.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Lighting & Background */}
          <div className="p-4 sm:p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
            <div>
              <label className="text-sm font-bold text-white flex items-center gap-2 mb-2">
                <Sun className="w-4 h-4 text-amber-400" />
                <span>خيارات الإضاءة (Lighting Atmosphere):</span>
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {[
                  { id: 'cinematic', label: 'سينمائية درامية' },
                  { id: 'soft', label: 'ناعمة طبيعية' },
                  { id: 'dramatic', label: 'عالية التباين' },
                  { id: 'neon', label: 'نيون سايبربانك' },
                  { id: 'studio', label: 'استوديو احترافي' },
                  { id: 'natural', label: 'شمس الغروب' }
                ].map((l) => (
                  <button
                    key={l.id}
                    type="button"
                    onClick={() => setOptions({ ...options, lighting: l.id as any })}
                    className={`py-2 px-2.5 rounded-xl text-xs font-medium transition-all border ${
                      options.lighting === l.id
                        ? 'bg-amber-600 text-white border-amber-500'
                        : 'bg-slate-950 text-slate-300 border-slate-800 hover:bg-slate-850'
                    }`}
                  >
                    {l.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-sm font-bold text-white flex items-center gap-2 mb-2">
                <span>بيئة الخلفية (Background Environment):</span>
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {[
                  { id: 'cinematic', label: 'سينمائية درامية' },
                  { id: 'studio', label: 'استوديو بسيط' },
                  { id: 'cyberpunk_city', label: 'مدينة مستقبلية' },
                  { id: 'nature', label: 'طبيعة ساحرة' },
                  { id: 'fantasy_realm', label: 'عالم خيالي أسطوري' },
                  { id: 'custom', label: 'خلفية مخصصة' }
                ].map((b) => (
                  <button
                    key={b.id}
                    type="button"
                    onClick={() => setOptions({ ...options, background: b.id as any })}
                    className={`py-2 px-2.5 rounded-xl text-xs font-medium transition-all border ${
                      options.background === b.id
                        ? 'bg-indigo-600 text-white border-indigo-500'
                        : 'bg-slate-950 text-slate-300 border-slate-800 hover:bg-slate-850'
                    }`}
                  >
                    {b.label}
                  </button>
                ))}
              </div>

              {options.background === 'custom' && (
                <input
                  type="text"
                  value={options.customBackgroundDesc}
                  onChange={(e) => setOptions({ ...options, customBackgroundDesc: e.target.value })}
                  placeholder="اكتب وصف الخلفية المطلوبة بالإنجليزية أو العربية..."
                  className="mt-2 w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-750 text-white text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Live Output & Action */}
        <div className="lg:col-span-5 space-y-5">
          {/* Main Generated Prompt Card */}
          <div className="p-5 rounded-2xl bg-slate-900 border border-indigo-500/30 shadow-2xl space-y-4 sticky top-24">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-indigo-400" />
                <h3 className="font-bold text-white text-base">البرومبت الإنجليزي المولد</h3>
              </div>
              <button
                onClick={() => copyToClipboard(generatedPrompt, 'prompt')}
                className="px-3 py-1.5 rounded-lg bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 text-xs font-bold flex items-center gap-1.5 transition-colors"
              >
                {copiedType === 'prompt' ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400">تم النسخ</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>نسخ البرومبت</span>
                  </>
                )}
              </button>
            </div>

            {/* Editable Positive Prompt Textarea */}
            <div className="space-y-1">
              <label className="text-xs text-slate-400 font-medium">
                يمكنك التعديل اليدوي المباشر على النص قبل النسخ أو الإرسال:
              </label>
              <textarea
                value={generatedPrompt}
                onChange={(e) => setGeneratedPrompt(e.target.value)}
                rows={7}
                className="w-full p-3.5 rounded-xl bg-slate-950 border border-slate-750 text-cyan-300 font-mono text-xs leading-relaxed focus:outline-none focus:ring-2 focus:ring-indigo-500 direction-ltr text-left"
              />
            </div>

            {/* Negative Prompt */}
            <div className="space-y-1.5 pt-2 border-t border-slate-800">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-400">البرومبت السلبي (Negative Prompt):</span>
                <button
                  onClick={() => copyToClipboard(generatedNegativePrompt, 'neg')}
                  className="text-xs text-slate-400 hover:text-white flex items-center gap-1"
                >
                  {copiedType === 'neg' ? (
                    <span className="text-emerald-400">تم النسخ</span>
                  ) : (
                    <Copy className="w-3 h-3" />
                  )}
                </button>
              </div>
              <textarea
                value={generatedNegativePrompt}
                onChange={(e) => setGeneratedNegativePrompt(e.target.value)}
                rows={3}
                className="w-full p-2.5 rounded-xl bg-slate-950/70 border border-slate-800 text-rose-300/80 font-mono text-xs leading-relaxed focus:outline-none focus:ring-2 focus:ring-rose-500/50 direction-ltr text-left"
              />
            </div>

            {/* Send to Studio Action */}
            <div className="pt-2">
              <button
                type="button"
                onClick={() => onSendToStudio(generatedPrompt, generatedNegativePrompt, currentStyle, options.preserveIdentity)}
                className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white font-extrabold text-sm shadow-xl shadow-indigo-600/30 flex items-center justify-center gap-2 transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                <Sliders className="w-4 h-4" />
                <span>إرسال إلى استوديو التوليد المتقدم</span>
                <ArrowLeft className="w-4 h-4" />
              </button>
              <p className="text-[11px] text-center text-slate-400 mt-2">
                * ملاحظة: بناء البرومبت لا يستهلك رصيداً ولا يولد صورة، بل يجهز المعادلة الفنية للإرسال.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
