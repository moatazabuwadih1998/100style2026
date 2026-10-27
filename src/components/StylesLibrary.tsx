import React, { useState, useMemo } from 'react';
import {
  Search,
  X,
  Shuffle,
  Heart,
  Grid,
  Filter,
  Layers,
  Sparkles
} from 'lucide-react';
import { ArtStyle, StyleGroup } from '../types/styles';
import { StyleCard } from './StyleCard';

interface StylesLibraryProps {
  styles: ArtStyle[];
  groups: StyleGroup[];
  favorites: string[];
  onlyFavorites?: boolean;
  selectedStyleId?: string;
  onToggleFavorite: (id: string) => void;
  onOpenDetails: (style: ArtStyle) => void;
  onSelectForStudio: (style: ArtStyle) => void;
  onSelectForPromptBuilder: (style: ArtStyle) => void;
  onRandomStyle: () => void;
}

export const StylesLibrary: React.FC<StylesLibraryProps> = ({
  styles,
  groups,
  favorites,
  onlyFavorites = false,
  selectedStyleId,
  onToggleFavorite,
  onOpenDetails,
  onSelectForStudio,
  onSelectForPromptBuilder,
  onRandomStyle
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGroupId, setSelectedGroupId] = useState<string>('all');
  const [filterFavoritesOnly, setFilterFavoritesOnly] = useState(onlyFavorites);

  // Synchronize when parent passes onlyFavorites
  React.useEffect(() => {
    setFilterFavoritesOnly(onlyFavorites);
  }, [onlyFavorites]);

  // Filtered Styles computation
  const filteredStyles = useMemo(() => {
    let result = styles;

    // Filter by group
    if (selectedGroupId !== 'all') {
      result = result.filter((s) => s.groupId === selectedGroupId);
    }

    // Filter by favorites
    if (filterFavoritesOnly) {
      result = result.filter((s) => favorites.includes(s.id));
    }

    // Search query
    const q = searchQuery.trim().toLowerCase();
    if (q) {
      result = result.filter((s) => {
        return (
          s.styleNameAr.toLowerCase().includes(q) ||
          s.styleNameEn.toLowerCase().includes(q) ||
          s.id.toLowerCase().includes(q) ||
          s.description.toLowerCase().includes(q) ||
          s.groupNameAr.toLowerCase().includes(q) ||
          s.keywords.some((k) => k.toLowerCase().includes(q)) ||
          s.tags.some((t) => t.toLowerCase().includes(q))
        );
      });
    }

    return result;
  }, [styles, selectedGroupId, filterFavoritesOnly, favorites, searchQuery]);

  return (
    <div className="space-y-6">
      {/* Controls and Search Bar Card */}
      <div className="p-4 sm:p-6 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-4">
        {/* Top Search Input & Action Row */}
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="w-5 h-5 absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ابحث بالاسم العربي، الإنجليزي، الكلمات المفتاحية، أو رمز الأسلوب (g01-s01)..."
              className="w-full pr-11 pl-10 py-3 rounded-xl bg-slate-950 border border-slate-750 text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white p-1"
                title="مسح البحث"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            {/* Favorites Toggle Button */}
            <button
              onClick={() => setFilterFavoritesOnly(!filterFavoritesOnly)}
              className={`flex-1 sm:flex-none px-4 py-3 rounded-xl text-xs font-bold border transition-all flex items-center justify-center gap-2 ${
                filterFavoritesOnly
                  ? 'bg-rose-500/20 text-rose-300 border-rose-500/40 shadow-sm shadow-rose-500/20'
                  : 'bg-slate-950 text-slate-300 border-slate-800 hover:bg-slate-850'
              }`}
            >
              <Heart className={`w-4 h-4 ${filterFavoritesOnly ? 'fill-current text-rose-400' : ''}`} />
              <span>المفضلة فقط ({favorites.length})</span>
            </button>

            {/* Random Style Button */}
            <button
              onClick={onRandomStyle}
              className="flex-1 sm:flex-none px-4 py-3 rounded-xl text-xs font-bold bg-indigo-600/15 hover:bg-indigo-600/25 text-indigo-300 border border-indigo-500/30 transition-all flex items-center justify-center gap-2"
              title="اختيار أسلوب عشوائي من الـ 100 أسلوب"
            >
              <Shuffle className="w-4 h-4 text-indigo-400" />
              <span>أسلوب عشوائي</span>
            </button>
          </div>
        </div>

        {/* Group Filter Pills */}
        <div className="pt-2">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-400 mb-2.5">
            <Filter className="w-3.5 h-3.5 text-indigo-400" />
            <span>تصفية حسب المجموعة الفنية (10 مجموعات):</span>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none no-scrollbar">
            <button
              onClick={() => setSelectedGroupId('all')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold shrink-0 transition-all border ${
                selectedGroupId === 'all'
                  ? 'bg-indigo-600 text-white border-indigo-500 shadow-md shadow-indigo-600/25'
                  : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white hover:bg-slate-850'
              }`}
            >
              الكل (100)
            </button>

            {groups.map((g) => {
              const isSelected = selectedGroupId === g.id;
              return (
                <button
                  key={g.id}
                  onClick={() => setSelectedGroupId(g.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold shrink-0 transition-all border flex items-center gap-1.5 ${
                    isSelected
                      ? 'bg-indigo-600 text-white border-indigo-500 shadow-md shadow-indigo-600/25'
                      : 'bg-slate-950 text-slate-300 border-slate-800 hover:text-white hover:bg-slate-850'
                  }`}
                >
                  <span className="font-mono text-[11px] text-cyan-400 font-bold">
                    {g.number}.
                  </span>
                  <span>{g.nameAr}</span>
                  <span className="text-[10px] px-1 rounded bg-slate-800 text-slate-400 font-mono">
                    10
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Results Header and Counter */}
      <div className="flex items-center justify-between px-2">
        <div className="flex items-center gap-2 text-sm text-slate-300 font-medium">
          <Grid className="w-4 h-4 text-indigo-400" />
          <span>
            النتائج المعروضة:{' '}
            <strong className="text-white font-mono text-base">{filteredStyles.length}</strong> من أصل 100 أسلوب
          </span>
          {filterFavoritesOnly && (
            <span className="text-xs text-rose-400 font-semibold">(المفضلة مفعلة)</span>
          )}
        </div>

        {selectedGroupId !== 'all' && (
          <button
            onClick={() => setSelectedGroupId('all')}
            className="text-xs text-indigo-400 hover:text-indigo-300 underline"
          >
            عرض جميع المجموعات
          </button>
        )}
      </div>

      {/* Grid of Styles */}
      {filteredStyles.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {filteredStyles.map((style) => (
            <StyleCard
              key={style.id}
              style={style}
              isFavorite={favorites.includes(style.id)}
              isSelected={selectedStyleId === style.id}
              onToggleFavorite={onToggleFavorite}
              onOpenDetails={onOpenDetails}
              onSelectForStudio={onSelectForStudio}
              onSelectForPromptBuilder={onSelectForPromptBuilder}
            />
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="p-12 text-center rounded-2xl bg-slate-900/50 border border-slate-800 space-y-4">
          <div className="w-16 h-16 mx-auto rounded-full bg-slate-800/80 flex items-center justify-center text-slate-500">
            <Search className="w-8 h-8" />
          </div>
          <div>
            <h4 className="text-lg font-bold text-white">لم يتم العثور على أساليب مطابقة</h4>
            <p className="text-sm text-slate-400 max-w-md mx-auto mt-1">
              جرب تغيير كلمة البحث أو إلغاء تصفية المفضلة أو اختيار &quot;الكل&quot; لعرض جميع الأساليب المئة.
            </p>
          </div>
          <div className="flex justify-center gap-3">
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedGroupId('all');
                setFilterFavoritesOnly(false);
              }}
              className="px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-500"
            >
              إعادة ضبط الفلاتر
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
