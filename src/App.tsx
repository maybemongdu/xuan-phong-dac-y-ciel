import React, { useState, useEffect, useMemo } from 'react';
import { SAMPLE_CHARACTERS } from './data/sampleCharacters';
import { Character, CharacterCategory } from './types/character';
import { Navbar } from './components/Navbar';
import { WelcomeScreen } from './components/WelcomeScreen';
import { FilterBar } from './components/FilterBar';
import { CharacterCard } from './components/CharacterCard';
import { CharacterDetailModal } from './components/CharacterDetailModal';
import { CharacterManagerModal } from './components/CharacterManagerModal';
import { UserGuideModal } from './components/UserGuideModal';
import { BowClickEffect } from './components/BowClickEffect';
import { Sparkles, Heart, Clock, Plus, BookOpen, RotateCcw } from 'lucide-react';

export default function App() {
  // Show welcome screen initially
  const [showWelcome, setShowWelcome] = useState<boolean>(() => {
    return !sessionStorage.getItem('ciel_welcome_dismissed');
  });

  // Characters data from LocalStorage or default samples
  const [characters, setCharacters] = useState<Character[]>(() => {
    const saved = localStorage.getItem('ciel_characters_data');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch {
        return SAMPLE_CHARACTERS;
      }
    }
    return SAMPLE_CHARACTERS;
  });

  // Favorites character IDs
  const [favorites, setFavorites] = useState<string[]>(() => {
    const saved = localStorage.getItem('ciel_favorites');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return ['ciel-01']; // default favorite sample
      }
    }
    return ['ciel-01'];
  });

  // Recently viewed character IDs
  const [recentIds, setRecentIds] = useState<string[]>(() => {
    const saved = localStorage.getItem('ciel_recently_viewed');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return [];
      }
    }
    return [];
  });

  // Search and Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<CharacterCategory>('tat-ca');

  // Modals state
  const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isManagerOpen, setIsManagerOpen] = useState(false);
  const [characterToEdit, setCharacterToEdit] = useState<Character | null>(null);
  const [isGuideOpen, setIsGuideOpen] = useState(false);

  // Sync characters to LocalStorage
  useEffect(() => {
    localStorage.setItem('ciel_characters_data', JSON.stringify(characters));
  }, [characters]);

  // Sync favorites to LocalStorage
  useEffect(() => {
    localStorage.setItem('ciel_favorites', JSON.stringify(favorites));
  }, [favorites]);

  // Sync recently viewed to LocalStorage
  useEffect(() => {
    localStorage.setItem('ciel_recently_viewed', JSON.stringify(recentIds));
  }, [recentIds]);

  const handleOpenDiary = () => {
    setShowWelcome(false);
    sessionStorage.setItem('ciel_welcome_dismissed', 'true');
  };

  const handleReturnToCover = () => {
    setShowWelcome(true);
  };

  const handleToggleFavorite = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleSelectCharacter = (character: Character) => {
    setSelectedCharacter(character);
    setIsDetailOpen(true);

    // Record to recently viewed (limit to 8, deduplicated)
    setRecentIds((prev) => {
      const filtered = prev.filter((id) => id !== character.id);
      return [character.id, ...filtered].slice(0, 8);
    });
  };

  const handleSaveCharacter = (char: Character) => {
    setCharacters((prev) => {
      const exists = prev.some((c) => c.id === char.id);
      if (exists) {
        return prev.map((c) => (c.id === char.id ? char : c));
      }
      return [char, ...prev];
    });
  };

  const handleDeleteCharacter = (id: string) => {
    setCharacters((prev) => prev.filter((c) => c.id !== id));
    setFavorites((prev) => prev.filter((favId) => favId !== id));
    setRecentIds((prev) => prev.filter((recId) => recId !== id));
    if (selectedCharacter?.id === id) {
      setIsDetailOpen(false);
      setSelectedCharacter(null);
    }
  };

  const handleResetToDefault = () => {
    setCharacters(SAMPLE_CHARACTERS);
    localStorage.removeItem('ciel_characters_data');
  };

  const handleImportData = (data: Character[]) => {
    setCharacters(data);
  };

  // Filtered Characters Calculation
  const filteredCharacters = useMemo(() => {
    return characters.filter((char) => {
      // Category filter
      if (activeCategory === 'yeu-thich') {
        if (!favorites.includes(char.id)) return false;
      } else if (activeCategory !== 'tat-ca') {
        if (char.category !== activeCategory) return false;
      }

      // Search query filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const matchName = char.name.toLowerCase().includes(query);
        const matchBio = char.shortBio.toLowerCase().includes(query);
        const matchDesc = char.description.toLowerCase().includes(query);
        const matchTags = char.tags?.some((t) => t.toLowerCase().includes(query));
        if (!matchName && !matchBio && !matchDesc && !matchTags) {
          return false;
        }
      }

      return true;
    });
  }, [characters, activeCategory, searchQuery, favorites]);

  // Recently viewed characters
  const recentCharacters = useMemo(() => {
    return recentIds
      .map((id) => characters.find((c) => c.id === id))
      .filter((c): c is Character => !!c);
  }, [recentIds, characters]);

  // Newest characters
  const newestCharacters = useMemo(() => {
    return [...characters]
      .sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || ''))
      .slice(0, 4);
  }, [characters]);

  return (
    <div className="min-h-screen flex flex-col bg-[#FFF8FA] text-[#4A3B43] relative selection:bg-[#FCE7F3] selection:text-[#9D174D]">
      {/* Interactive Pink Bow Click Effect */}
      <BowClickEffect />

      {/* Screen 1: Welcome Screen (Cover) */}
      {showWelcome ? (
        <WelcomeScreen onOpenDiary={handleOpenDiary} />
      ) : (
        <>
          {/* Main Navigation Bar */}
          <Navbar
            activeCategory={activeCategory}
            onSelectCategory={(cat) => {
              setActiveCategory(cat);
              const grid = document.getElementById('main-characters-grid');
              if (grid) grid.scrollIntoView({ behavior: 'smooth' });
            }}
            favoritesCount={favorites.length}
            recentCount={recentIds.length}
            onOpenAddModal={() => {
              setCharacterToEdit(null);
              setIsManagerOpen(true);
            }}
            onOpenGuideModal={() => setIsGuideOpen(true)}
            onReturnToCover={handleReturnToCover}
          />

          {/* Main Scrapbook Content Area */}
          <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
            {/* Header Journal Banner */}
            <section className="relative overflow-hidden rounded-[32px] bg-gradient-to-r from-[#FFF0F5] via-[#FFFDFE] to-[#FFF5F8] border border-[#FCE7F3] p-6 sm:p-10 mb-8 shadow-xs">
              <div className="max-w-2xl relative z-10">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white text-[#9D174D] text-xs font-medium mb-3 border border-[#FCE7F3] shadow-xs">
                  <Sparkles className="w-3.5 h-3.5 text-[#F472B6]" />
                  <span>Sổ tay lưu trữ & nhập vai</span>
                </div>

                <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold font-serif-title text-[#831843] mb-2">
                  Xuân Phong Đắc Ý – Ciel
                </h1>

                <p className="text-xs sm:text-sm text-[#6B5562] leading-relaxed mb-5">
                  Từng trang nhật ký là một mảnh không gian dịu dàng lưu giữ những hình bóng nhân vật,
                  sẵn sàng đồng hành cùng bạn trên con đường khám phá cốt truyện và bắt đầu những cuộc đối thoại nhập vai đáng nhớ.
                </p>

                <div className="flex flex-wrap items-center gap-3">
                  <button
                    onClick={() => {
                      setCharacterToEdit(null);
                      setIsManagerOpen(true);
                    }}
                    className="px-4 py-2 rounded-full bg-[#F472B6] hover:bg-[#EC4899] text-white text-xs font-medium shadow-coquette hover:shadow-coquette-hover transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Thêm nhân vật mới</span>
                  </button>

                  <button
                    onClick={() => setIsGuideOpen(true)}
                    className="px-4 py-2 rounded-full bg-white border border-[#FBCFE8] hover:bg-[#FFF5F8] text-[#831843] text-xs font-medium transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    <BookOpen className="w-3.5 h-3.5 text-[#DB2777]" />
                    <span>Xem hướng dẫn sử dụng</span>
                  </button>
                </div>
              </div>

              {/* Decorative Ribbon Motif on Top Right */}
              <div className="hidden lg:block absolute -right-6 -bottom-6 w-56 h-56 pointer-events-none opacity-40">
                <svg
                  viewBox="0 0 100 100"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-full h-full text-[#FBCFE8]"
                >
                  <path
                    d="M50 50 C38 32 15 28 10 40 C6 50 20 62 46 54 Z"
                    fill="currentColor"
                    opacity="0.5"
                  />
                  <path
                    d="M50 50 C62 32 85 28 90 40 C94 50 80 62 54 54 Z"
                    fill="currentColor"
                    opacity="0.5"
                  />
                  <circle cx="50" cy="51" r="7" fill="#F472B6" />
                </svg>
              </div>
            </section>

            {/* Filter and Search Bar */}
            <FilterBar
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              activeCategory={activeCategory}
              onSelectCategory={setActiveCategory}
              totalCount={filteredCharacters.length}
            />

            {/* Main Character Grid Section */}
            <div id="main-characters-grid" className="scroll-mt-20 mb-12">
              {filteredCharacters.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 sm:gap-6">
                  {filteredCharacters.map((char) => (
                    <CharacterCard
                      key={char.id}
                      character={char}
                      isFavorite={favorites.includes(char.id)}
                      onToggleFavorite={handleToggleFavorite}
                      onSelect={handleSelectCharacter}
                    />
                  ))}
                </div>
              ) : (
                /* Empty State in Vietnamese */
                <div className="text-center py-16 px-4 bg-[#FFFDFE] rounded-3xl border border-[#FCE7F3] shadow-xs max-w-lg mx-auto">
                  <div className="w-16 h-16 rounded-full bg-[#FFF5F8] border border-[#FBCFE8] flex items-center justify-center mx-auto mb-3 text-[#DB2777]">
                    <Sparkles className="w-7 h-7 text-[#F472B6]" />
                  </div>
                  <h3 className="font-serif-title text-xl font-bold text-[#831843] mb-1">
                    Không tìm thấy kết quả
                  </h3>
                  <p className="text-xs sm:text-sm text-[#6B5562] max-w-sm mx-auto mb-4 leading-relaxed">
                    Không có trang nhật ký nào phù hợp với từ khóa hoặc bộ lọc đã chọn. Bạn hãy thử tìm kiếm với tên khác hoặc đặt lại bộ lọc nhé!
                  </p>
                  <div className="flex justify-center gap-2">
                    <button
                      onClick={() => {
                        setSearchQuery('');
                        setActiveCategory('tat-ca');
                      }}
                      className="px-4 py-2 rounded-full bg-[#FFE4E8] text-[#831843] text-xs font-medium hover:bg-[#FCE7F3] transition-colors cursor-pointer"
                    >
                      Xem tất cả nhân vật
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Supplementary Section 1: Recently Viewed (if exists) */}
            {recentCharacters.length > 0 && (
              <section id="recent-section" className="mb-12 pt-6 border-t border-[#FCE7F3]">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-[#F472B6]" />
                    <h2 className="font-serif-title text-xl sm:text-2xl font-bold text-[#831843]">
                      Xem gần đây
                    </h2>
                  </div>
                  <button
                    onClick={() => {
                      setRecentIds([]);
                      localStorage.removeItem('ciel_recently_viewed');
                    }}
                    className="text-xs text-[#9C8592] hover:text-[#E11D48] transition-colors cursor-pointer"
                  >
                    Xóa lịch sử xem
                  </button>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                  {recentCharacters.map((char) => (
                    <CharacterCard
                      key={`recent-${char.id}`}
                      character={char}
                      isFavorite={favorites.includes(char.id)}
                      onToggleFavorite={handleToggleFavorite}
                      onSelect={handleSelectCharacter}
                    />
                  ))}
                </div>
              </section>
            )}

            {/* Supplementary Section 2: Newest updates strip */}
            {newestCharacters.length > 0 && (
              <section className="mb-12 pt-6 border-t border-[#FCE7F3]">
                <div className="flex items-center gap-2 mb-4">
                  <Sparkles className="w-4 h-4 text-[#F472B6]" />
                  <h2 className="font-serif-title text-xl sm:text-2xl font-bold text-[#831843]">
                    Nhân vật mới cập nhật
                  </h2>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {newestCharacters.map((char) => (
                    <div
                      key={`newest-${char.id}`}
                      onClick={() => handleSelectCharacter(char)}
                      className="group p-3 rounded-2xl bg-[#FFFDFE] border border-[#FCE7F3] hover:border-[#FBCFE8] hover:shadow-xs transition-all cursor-pointer flex items-center gap-3"
                    >
                      <img
                        src={char.avatar}
                        alt={char.name}
                        className="w-12 h-16 rounded-xl object-cover shrink-0"
                      />
                      <div className="truncate flex-1">
                        <span className="text-[10px] text-[#9D174D] block font-medium">
                          {char.status}
                        </span>
                        <h4 className="font-serif-title text-sm font-bold text-[#4A3B43] truncate group-hover:text-[#831843]">
                          {char.name}
                        </h4>
                        <span className="text-[10px] text-[#9C8592] tabular-nums">
                          {char.createdAt}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </main>

          {/* Footer */}
          <footer className="mt-auto border-t border-[#FCE7F3] bg-[#FFFDFE] py-8 px-4 text-center">
            <div className="max-w-7xl mx-auto flex flex-col items-center gap-3">
              <div className="flex items-center gap-2 text-xs text-[#831843] font-serif-title text-base font-semibold">
                <span>Xuân Phong Đắc Ý – Ciel</span>
              </div>
              <p className="text-xs text-[#9C8592] max-w-md">
                Cuốn nhật ký cá nhân trực tuyến dành cho những tâm hồn yêu thích thế giới nhập vai và cốt truyện lãng mạn.
              </p>
              <div className="flex items-center gap-4 text-xs text-[#B49EAB] mt-2">
                <button
                  onClick={handleReturnToCover}
                  className="hover:text-[#831843] transition-colors cursor-pointer"
                >
                  Mở lại trang bìa
                </button>
                <span>·</span>
                <button
                  onClick={() => setIsGuideOpen(true)}
                  className="hover:text-[#831843] transition-colors cursor-pointer"
                >
                  Hướng dẫn sử dụng
                </button>
                <span>·</span>
                <button
                  onClick={() => {
                    setCharacterToEdit(null);
                    setIsManagerOpen(true);
                  }}
                  className="hover:text-[#831843] transition-colors cursor-pointer"
                >
                  Quản lý nhật ký
                </button>
              </div>
            </div>
          </footer>

          {/* Modals */}
          <CharacterDetailModal
            character={selectedCharacter}
            isOpen={isDetailOpen}
            onClose={() => {
              setIsDetailOpen(false);
              setSelectedCharacter(null);
            }}
            isFavorite={selectedCharacter ? favorites.includes(selectedCharacter.id) : false}
            onToggleFavorite={handleToggleFavorite}
            onEditCharacter={(char) => {
              setCharacterToEdit(char);
              setIsManagerOpen(true);
            }}
          />

          <CharacterManagerModal
            isOpen={isManagerOpen}
            onClose={() => {
              setIsManagerOpen(false);
              setCharacterToEdit(null);
            }}
            characterToEdit={characterToEdit}
            onSaveCharacter={handleSaveCharacter}
            onDeleteCharacter={handleDeleteCharacter}
            onResetToDefault={handleResetToDefault}
            onImportData={handleImportData}
            allCharacters={characters}
          />

          <UserGuideModal
            isOpen={isGuideOpen}
            onClose={() => setIsGuideOpen(false)}
          />
        </>
      )}
    </div>
  );
}
