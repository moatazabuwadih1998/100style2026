import React, { useState } from 'react';
import {
  Palette,
  Sparkles,
  Heart,
  Sliders,
  SplitSquareVertical,
  History,
  Download,
  Settings,
  Menu,
  X,
  Layers,
  ArrowLeftRight
} from 'lucide-react';
import { ApiServerStatus } from '../types/styles';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  favoritesCount: number;
  serverStatus: ApiServerStatus;
  onOpenSettings: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  favoritesCount,
  serverStatus,
  onOpenSettings
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'library', label: 'مكتبة الأساليب', icon: Layers, badge: '100' },
    { id: 'favorites', label: 'المفضلة', icon: Heart, badge: favoritesCount > 0 ? String(favoritesCount) : undefined },
    { id: 'prompt_builder', label: 'باني البرومبتات', icon: Sparkles },
    { id: 'studio', label: 'استوديو التوليد والنتائج', icon: Sliders },
    { id: 'style_compare', label: 'مقارنة الأساليب', icon: ArrowLeftRight },
    { id: 'before_after', label: 'مقارنة قبل وبعد', icon: SplitSquareVertical },
    { id: 'history', label: 'سجل النتائج', icon: History },
    { id: 'export', label: 'مركز التصدير', icon: Download }
  ];

  const handleSelectTab = (tabId: string) => {
    setActiveTab(tabId);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-slate-950/85 backdrop-blur-md border-b border-slate-800/80 transition-smooth">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Brand */}
          <div
            onClick={() => handleSelectTab('library')}
            className="flex items-center gap-3 cursor-pointer select-none group"
          >
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl overflow-hidden bg-slate-900 border border-slate-750 shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform shrink-0 flex items-center justify-center p-0.5">
              <img
                src="/assets/logo.png"
                alt="100 Style 2026"
                className="w-full h-full object-cover rounded-lg"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src = '/assets/aistudio/100style2026_39be703c.png';
                }}
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-base sm:text-lg tracking-tight bg-gradient-to-r from-white via-slate-100 to-indigo-200 bg-clip-text text-transparent">
                  مكتبة فنون الألعاب والأنمي
                </span>
                <span className="hidden md:inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold bg-indigo-500/15 text-indigo-400 border border-indigo-500/30">
                  100style2026
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-mono hidden sm:block">
                100 Art Styles Studio • 10 Groups
              </p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden xl:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleSelectTab(item.id)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-bold transition-smooth ${
                    isActive
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/25'
                      : 'text-slate-300 hover:text-white hover:bg-slate-900/80'
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{item.label}</span>
                  {item.badge && (
                    <span
                      className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono ${
                        isActive
                          ? 'bg-white/20 text-white'
                          : 'bg-indigo-500/20 text-indigo-300'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Action Icons & Mobile Hamburger */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Server Status Pill */}
            <div
              className={`hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium border ${
                serverStatus.status === 'online'
                  ? serverStatus.hasOpenAiKey
                    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                    : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                  : 'bg-rose-500/10 text-rose-400 border-rose-500/30'
              }`}
              title={
                serverStatus.hasOpenAiKey
                  ? 'الخادم متصل وجاهز للتوليد الحقيقي'
                  : 'الخادم يعمل لكن مفتاح OpenAI غير مهيأ'
              }
            >
              <span
                className={`w-2 h-2 rounded-full animate-pulse ${
                  serverStatus.status === 'online'
                    ? serverStatus.hasOpenAiKey
                      ? 'bg-emerald-400'
                      : 'bg-amber-400'
                    : 'bg-rose-400'
                }`}
              />
              <span className="hidden md:inline">
                {serverStatus.status === 'online'
                  ? serverStatus.hasOpenAiKey
                    ? 'AI جاهز'
                    : 'المفتاح مطلوب'
                  : 'غير متصل'}
              </span>
            </div>

            {/* Settings Trigger */}
            <button
              onClick={onOpenSettings}
              className="p-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-900 border border-slate-800 transition-smooth"
              aria-label="إعدادات النظام"
            >
              <Settings className="w-4 h-4" />
            </button>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="xl:hidden p-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-900 border border-slate-800"
              aria-label="القائمة الرئيسية"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="xl:hidden bg-slate-950 border-b border-slate-800 px-4 pt-2 pb-4 space-y-1 animate-fadeIn">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleSelectTab(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-semibold transition-colors ${
                  isActive
                    ? 'bg-indigo-600 text-white'
                    : 'text-slate-300 hover:bg-slate-900'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className="px-2 py-0.5 rounded-full text-xs font-mono bg-white/20 text-white">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      )}
    </header>
  );
};
