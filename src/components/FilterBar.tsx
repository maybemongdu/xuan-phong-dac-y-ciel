import React from 'react';
import { Search, X, Sparkles } from 'lucide-react';
import { CharacterCategory } from '../types/character';
import { CATEGORY_LABELS } from '../data/sampleCharacters';

interface FilterBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  activeCategory: CharacterCategory;
  onSelectCategory: (category: CharacterCategory) => void;
  totalCount: number;
}

const CATEGORIES: { id: CharacterCategory; label: string }[] = [
  { id: 'tat-ca', label: CATEGORY_LABELS['tat-ca'] },
  { id: 'hien-dai', label: CATEGORY_LABELS['hien-dai'] },
  { id: 'co-dai', label: CATEGORY_LABELS['co-dai'] },
  { id: 'dan-quoc', label: CATEGORY_LABELS['dan-quoc'] },
  { id: 'hoc-duong', label: CATEGORY_LABELS['hoc-duong'] },
  { id: 'khac', label: CATEGORY_LABELS['khac'] },
  { id: 'yeu-thich', label: CATEGORY_LABELS['yeu-thich'] },
];

export const FilterBar: React.FC<FilterBarProps> = ({
  searchQuery,
  onSearchChange,
  activeCategory,
  onSelectCategory,
  totalCount,
}) => {
  return (
    <div className="space-y-4 mb-8">
      {/* Search Input Bar */}
      <div className="relative max-w-xl mx-auto">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[#F472B6]">
          <Search className="w-4 h-4" />
        </div>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Tìm kiếm nhân vật theo tên, tính cách hoặc giới thiệu..."
          className="w-full pl-11 pr-10 py-3 rounded-full bg-[#FFFDFE] border border-[#FCE7F3] shadow-xs text-xs sm:text-sm text-[#4A3B43] placeholder-[#B49EAB] focus:outline-none focus:border-[#F472B6] focus:ring-2 focus:ring-[#FCE7F3] transition-all"
        />
        {searchQuery && (
          <button
            onClick={() => onSearchChange('')}
            aria-label="Xóa nội dung tìm kiếm"
            className="absolute inset-y-0 right-0 pr-4 flex items-center text-[#9C8592] hover:text-[#831843] cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Category Tabs: Clean Segmented Control */}
      <div className="flex items-center justify-start sm:justify-center overflow-x-auto pb-1 gap-1.5 scrollbar-none px-2">
        {CATEGORIES.map((cat) => {
          const isActive = activeCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.id)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
                isActive
                  ? 'bg-[#F472B6] text-white shadow-xs'
                  : 'bg-[#FFF5F8] text-[#6B5562] border border-[#FCE7F3] hover:bg-[#FFE4E8] hover:text-[#831843]'
              }`}
            >
              {cat.label}
            </button>
          );
        })}
      </div>

      {/* Result Meta count info */}
      <div className="flex items-center justify-between text-xs text-[#9C8592] px-2 max-w-7xl mx-auto">
        <div className="flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-[#F472B6]" />
          <span>
            {searchQuery
              ? `Tìm thấy ${totalCount} nhân vật theo từ khóa "${searchQuery}"`
              : `Hiển thị ${totalCount} trang nhật ký nhân vật`}
          </span>
        </div>
      </div>
    </div>
  );
};
