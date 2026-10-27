/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { ART_STYLES, STYLE_GROUPS, getRandomStyle } from './data/stylesData';
import { ArtStyle, GenerationRecord, ApiServerStatus } from './types/styles';
import { fetchServerHealth } from './services/apiService';

// Components
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { StylesLibrary } from './components/StylesLibrary';
import { StyleDetailModal } from './components/StyleDetailModal';
import { PromptBuilder } from './components/PromptBuilder';
import { ImageStudio } from './components/ImageStudio';
import { BeforeAfterComparison } from './components/BeforeAfterComparison';
import { StyleVsStyleComparison } from './components/StyleVsStyleComparison';
import { HistoryGallery } from './components/HistoryGallery';
import { ExportCenter } from './components/ExportCenter';
import { SettingsModal } from './components/SettingsModal';

export default function App() {
  // Navigation active tab
  const [activeTab, setActiveTab] = useState<string>('library');

  // Favorites (Stored in localStorage)
  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('art_styles_favorites');
      return saved ? JSON.parse(saved) : ['g01-s02', 'g02-s02', 'g04-s01', 'g05-s04', 'g10-s01'];
    } catch {
      return ['g01-s02', 'g02-s02', 'g04-s01', 'g05-s04', 'g10-s01'];
    }
  });

  // History Records (Stored in localStorage)
  const [history, setHistory] = useState<GenerationRecord[]>(() => {
    try {
      const saved = localStorage.getItem('art_styles_history');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Selected Style for Details Modal
  const [modalStyle, setModalStyle] = useState<ArtStyle | null>(null);

  // Active Style for PromptBuilder & Studio
  const [activeStyle, setActiveStyle] = useState<ArtStyle>(ART_STYLES[0]);
  const [studioInitialPrompt, setStudioInitialPrompt] = useState<string>('');
  const [studioInitialNegative, setStudioInitialNegative] = useState<string>('');

  // Active record for Before/After Comparison
  const [comparisonRecord, setComparisonRecord] = useState<GenerationRecord | null>(null);

  // Style vs Style selection
  const [compareA, setCompareA] = useState<ArtStyle>(ART_STYLES[0]);
  const [compareB, setCompareB] = useState<ArtStyle>(ART_STYLES[1]);

  // Server Status
  const [serverStatus, setServerStatus] = useState<ApiServerStatus>({
    status: 'checking',
    hasOpenAiKey: false,
    dailyRequestsUsed: 0,
    dailyRequestsLimit: 100
  });

  // Settings Modal State
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);

  // Persist Favorites
  useEffect(() => {
    try {
      localStorage.setItem('art_styles_favorites', JSON.stringify(favorites));
    } catch (e) {
      console.warn('Failed to save favorites to localStorage', e);
    }
  }, [favorites]);

  // Persist History
  useEffect(() => {
    try {
      localStorage.setItem('art_styles_history', JSON.stringify(history));
    } catch (e) {
      console.warn('Failed to save history to localStorage', e);
    }
  }, [history]);

  // Check Server Health on Mount and Periodically
  const refreshHealth = async () => {
    const status = await fetchServerHealth();
    setServerStatus(status);
  };

  useEffect(() => {
    refreshHealth();
    const interval = setInterval(refreshHealth, 25000);
    return () => clearInterval(interval);
  }, []);

  // Handlers
  const handleToggleFavorite = (styleId: string) => {
    setFavorites((prev) =>
      prev.includes(styleId) ? prev.filter((id) => id !== styleId) : [...prev, styleId]
    );
  };

  const handleOpenDetails = (style: ArtStyle) => {
    setModalStyle(style);
  };

  const handleSelectForPromptBuilder = (style: ArtStyle) => {
    setActiveStyle(style);
    setModalStyle(null);
    setActiveTab('prompt_builder');
  };

  const handleSelectForStudio = (style: ArtStyle) => {
    setActiveStyle(style);
    setStudioInitialPrompt(style.promptTemplate);
    setStudioInitialNegative(style.negativePrompt);
    setModalStyle(null);
    setActiveTab('studio');
  };

  const handleSendFromBuilderToStudio = (
    prompt: string,
    negativePrompt: string,
    style: ArtStyle,
    _preserveIdentity: boolean
  ) => {
    setActiveStyle(style);
    setStudioInitialPrompt(prompt);
    setStudioInitialNegative(negativePrompt);
    setActiveTab('studio');
  };

  const handleCompareWithAnother = (style: ArtStyle) => {
    setCompareA(style);
    // Find an interesting second style
    const other = ART_STYLES.find((s) => s.id !== style.id && s.groupId !== style.groupId) || ART_STYLES[1];
    setCompareB(other);
    setModalStyle(null);
    setActiveTab('style_compare');
  };

  const handleOpenComparison = (record: GenerationRecord) => {
    setComparisonRecord(record);
    setActiveTab('before_after');
  };

  const handleRandomStyle = () => {
    const rand = getRandomStyle();
    setModalStyle(rand);
  };

  const handleSaveRecord = (newRecord: GenerationRecord) => {
    setHistory((prev) => [newRecord, ...prev.filter((r) => r.id !== newRecord.id)]);
    setComparisonRecord(newRecord);
  };

  const handleDeleteRecord = (id: string) => {
    setHistory((prev) => prev.filter((r) => r.id !== id));
    if (comparisonRecord?.id === id) {
      setComparisonRecord(null);
    }
  };

  const handleClearHistory = () => {
    setHistory([]);
    setComparisonRecord(null);
  };

  const handleClearFavorites = () => {
    setFavorites([]);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-['Cairo',sans-serif] selection:bg-indigo-500 selection:text-white">
      {/* Top Sticky Header */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        favoritesCount={favorites.length}
        serverStatus={serverStatus}
        onOpenSettings={() => setIsSettingsOpen(true)}
      />

      {/* Hero Banner (Shown primarily on Library & Favorites) */}
      {(activeTab === 'library' || activeTab === 'favorites') && (
        <HeroSection
          onExploreStyles={() => setActiveTab('library')}
          onOpenStudio={() => setActiveTab('studio')}
          onRandomStyle={handleRandomStyle}
        />
      )}

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* TAB 1: Library */}
        {activeTab === 'library' && (
          <StylesLibrary
            styles={ART_STYLES}
            groups={STYLE_GROUPS}
            favorites={favorites}
            onlyFavorites={false}
            selectedStyleId={activeStyle?.id}
            onToggleFavorite={handleToggleFavorite}
            onOpenDetails={handleOpenDetails}
            onSelectForStudio={handleSelectForStudio}
            onSelectForPromptBuilder={handleSelectForPromptBuilder}
            onRandomStyle={handleRandomStyle}
          />
        )}

        {/* TAB 2: Favorites Only */}
        {activeTab === 'favorites' && (
          <StylesLibrary
            styles={ART_STYLES}
            groups={STYLE_GROUPS}
            favorites={favorites}
            onlyFavorites={true}
            selectedStyleId={activeStyle?.id}
            onToggleFavorite={handleToggleFavorite}
            onOpenDetails={handleOpenDetails}
            onSelectForStudio={handleSelectForStudio}
            onSelectForPromptBuilder={handleSelectForPromptBuilder}
            onRandomStyle={handleRandomStyle}
          />
        )}

        {/* TAB 3: Prompt Builder */}
        {activeTab === 'prompt_builder' && (
          <PromptBuilder
            styles={ART_STYLES}
            selectedStyle={activeStyle}
            onSelectStyle={(s) => setActiveStyle(s)}
            onSendToStudio={handleSendFromBuilderToStudio}
          />
        )}

        {/* TAB 4: Image Studio */}
        {activeTab === 'studio' && (
          <ImageStudio
            styles={ART_STYLES}
            selectedStyle={activeStyle}
            initialPrompt={studioInitialPrompt}
            initialNegativePrompt={studioInitialNegative}
            serverStatus={serverStatus}
            onStyleChange={(s) => setActiveStyle(s)}
            onSaveRecord={handleSaveRecord}
            onOpenComparison={handleOpenComparison}
            onOpenSettings={() => setIsSettingsOpen(true)}
          />
        )}

        {/* TAB 5: Style vs Style Comparison */}
        {activeTab === 'style_compare' && (
          <StyleVsStyleComparison
            styles={ART_STYLES}
            initialStyleA={compareA}
            initialStyleB={compareB}
            onSelectForStudio={handleSelectForStudio}
            onSelectForPromptBuilder={handleSelectForPromptBuilder}
          />
        )}

        {/* TAB 6: Before & After Comparison */}
        {activeTab === 'before_after' && (
          <BeforeAfterComparison
            currentRecord={comparisonRecord || history.find((h) => h.referenceImageBase64 && (h.resultImageBase64 || h.resultImageUrl))}
            onOpenStudio={() => setActiveTab('studio')}
          />
        )}

        {/* TAB 7: Generation History */}
        {activeTab === 'history' && (
          <HistoryGallery
            history={history}
            onSelectRecord={(r) => {
              const matchedStyle = ART_STYLES.find((s) => s.id === r.styleId) || ART_STYLES[0];
              setActiveStyle(matchedStyle);
              setStudioInitialPrompt(r.prompt);
              setStudioInitialNegative(r.negativePrompt || matchedStyle.negativePrompt);
              setActiveTab('studio');
            }}
            onOpenComparison={handleOpenComparison}
            onDeleteRecord={handleDeleteRecord}
            onClearAll={handleClearHistory}
          />
        )}

        {/* TAB 8: Export Center */}
        {activeTab === 'export' && <ExportCenter />}
      </main>

      {/* Style Detail Modal */}
      {modalStyle && (
        <StyleDetailModal
          style={modalStyle}
          allStyles={ART_STYLES}
          isFavorite={favorites.includes(modalStyle.id)}
          onClose={() => setModalStyle(null)}
          onToggleFavorite={handleToggleFavorite}
          onSelectForPromptBuilder={handleSelectForPromptBuilder}
          onSelectForStudio={handleSelectForStudio}
          onCompareWithAnother={handleCompareWithAnother}
          onNavigateStyle={(s) => setModalStyle(s)}
        />
      )}

      {/* System Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        serverStatus={serverStatus}
        onClose={() => setIsSettingsOpen(false)}
        onRefreshStatus={refreshHealth}
        onClearFavorites={handleClearFavorites}
        onClearHistory={handleClearHistory}
      />

      {/* Responsive Footer */}
      <footer className="mt-auto border-t border-slate-900 bg-slate-950/80 py-8 px-4 sm:px-6 lg:px-8 text-center text-xs text-slate-500 space-y-2">
        <p className="font-semibold text-slate-400">
          مكتبة أساليب فنون الألعاب والأنمي — المنصة العربية الاحترافية لتحويل الشخصيات (100 أسلوب في 10 مجموعات)
        </p>
        <p className="font-mono text-[11px] text-slate-600">
          Built with React 19, TypeScript, Tailwind CSS, Express Backend & OpenAI Images API Integration.
        </p>
      </footer>
    </div>
  );
}
