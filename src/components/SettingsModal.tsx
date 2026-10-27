import React, { useState } from 'react';
import {
  X,
  Settings,
  Key,
  Server,
  Activity,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
  ShieldCheck,
  RotateCw
} from 'lucide-react';
import { ApiServerStatus } from '../types/styles';
import { fetchServerHealth } from '../services/apiService';

interface SettingsModalProps {
  isOpen: boolean;
  serverStatus: ApiServerStatus;
  onClose: () => void;
  onRefreshStatus: () => void;
  onClearFavorites: () => void;
  onClearHistory: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  serverStatus,
  onClose,
  onRefreshStatus,
  onClearFavorites,
  onClearHistory
}) => {
  const [checking, setChecking] = useState(false);
  const [clearedNotice, setClearedNotice] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleManualCheck = async () => {
    setChecking(true);
    await fetchServerHealth();
    onRefreshStatus();
    setChecking(false);
  };

  const handleClearFavs = () => {
    if (window.confirm('هل أنت متأكد من رغبتك في مسح قائمة الأساليب المفضلة؟')) {
      onClearFavorites();
      setClearedNotice('تم مسح المفضلة بنجاح');
      setTimeout(() => setClearedNotice(null), 2000);
    }
  };

  const handleClearHist = () => {
    if (window.confirm('هل أنت متأكد من رغبتك في مسح سجل الصور المولدة؟')) {
      onClearHistory();
      setClearedNotice('تم مسح سجل الصور بنجاح');
      setTimeout(() => setClearedNotice(null), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
      <div
        className="relative w-full max-w-xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/60">
          <div className="flex items-center gap-2.5">
            <Settings className="w-5 h-5 text-indigo-400" />
            <h3 className="font-extrabold text-base text-white">إعدادات المنصة والخادم</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white bg-slate-800"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body Content */}
        <div className="p-6 space-y-6">
          {clearedNotice && (
            <div className="p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-bold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>{clearedNotice}</span>
            </div>
          )}

          {/* Server Connectivity & Status */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm font-bold text-white">
                <Server className="w-4 h-4 text-cyan-400" />
                <span>حالة الخادم الخلفي (Express API):</span>
              </div>
              <button
                onClick={handleManualCheck}
                disabled={checking}
                className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1 font-semibold"
              >
                <RotateCw className={`w-3.5 h-3.5 ${checking ? 'animate-spin' : ''}`} />
                <span>فحص الاتصال</span>
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-850">
                <span className="text-slate-400 block text-[11px] mb-0.5">اتصال الخادم:</span>
                <span
                  className={`font-bold flex items-center gap-1.5 ${
                    serverStatus.status === 'online' ? 'text-emerald-400' : 'text-rose-400'
                  }`}
                >
                  <span
                    className={`w-2 h-2 rounded-full ${
                      serverStatus.status === 'online' ? 'bg-emerald-400' : 'bg-rose-400'
                    }`}
                  />
                  {serverStatus.status === 'online' ? 'متصل وجاهز' : 'غير متصل'}
                </span>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-850">
                <span className="text-slate-400 block text-[11px] mb-0.5">مفتاح OpenAI API:</span>
                <span
                  className={`font-bold ${
                    serverStatus.hasOpenAiKey ? 'text-emerald-400' : 'text-amber-400'
                  }`}
                >
                  {serverStatus.hasOpenAiKey ? 'مهيأ في الخادم' : 'غير متوفر'}
                </span>
              </div>
            </div>

            {/* Daily Usage Counter */}
            <div className="p-3 rounded-xl bg-slate-900 border border-slate-850 text-xs flex items-center justify-between">
              <span className="text-slate-300">الطلبات المستخدمة اليوم:</span>
              <span className="font-mono text-cyan-400 font-bold">
                {serverStatus.dailyRequestsUsed} / {serverStatus.dailyRequestsLimit}
              </span>
            </div>
          </div>

          {/* How to configure OpenAI API Key */}
          <div className="p-4 rounded-2xl bg-indigo-950/20 border border-indigo-900/40 space-y-2.5">
            <div className="flex items-center gap-2 text-xs font-bold text-indigo-300">
              <Key className="w-4 h-4 text-indigo-400" />
              <span>طريقة تفعيل وتعيين مفتاح OpenAI API:</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              وفقاً لمعايير الأمان الإلزامية للمشروع، لا يتم وضع مفاتيح API داخل كود الواجهة العامة للمتصفح.
              لتفعيل التوليد الفعلي بالذكاء الاصطناعي:
            </p>
            <ol className="text-xs text-slate-300 space-y-1.5 list-decimal list-inside pr-1">
              <li>افتح ملف <code className="font-mono bg-black/40 px-1 py-0.5 rounded text-indigo-300">.env</code> في جذر المشروع.</li>
              <li>أضف السطر: <code className="font-mono bg-black/40 px-1.5 py-0.5 rounded text-emerald-400 select-all">OPENAI_API_KEY=&quot;sk-...&quot;</code></li>
              <li>احفظ الملف وسيتعرف عليه الخادم الخلفي فوراً وبأمان تام.</li>
            </ol>
          </div>

          {/* Local Data Management */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
            <h4 className="text-xs font-bold text-slate-300 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>إدارة البيانات والتخزين المحلي (LocalStorage):</span>
            </h4>
            <div className="flex flex-wrap gap-2.5">
              <button
                onClick={handleClearFavs}
                className="flex-1 py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-300 hover:text-rose-400 text-xs font-semibold border border-slate-700 flex items-center justify-center gap-1.5 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>مسح المفضلة</span>
              </button>

              <button
                onClick={handleClearHist}
                className="flex-1 py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-300 hover:text-rose-400 text-xs font-semibold border border-slate-700 flex items-center justify-center gap-1.5 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>مسح سجل النتائج</span>
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-800 bg-slate-950 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs"
          >
            إغلاق الإعدادات
          </button>
        </div>
      </div>
    </div>
  );
};
