import React from 'react';
import { Heart, BookOpen, MessageSquare, ArrowUpRight } from 'lucide-react';
import { Character } from '../types/character';
import { CATEGORY_LABELS } from '../data/sampleCharacters';

interface CharacterCardProps {
  character: Character;
  isFavorite: boolean;
  onToggleFavorite: (id: string, e: React.MouseEvent) => void;
  onSelect: (character: Character) => void;
}

export const CharacterCard: React.FC<CharacterCardProps> = ({
  character,
  isFavorite,
  onToggleFavorite,
  onSelect,
}) => {
  return (
    <div
      onClick={() => onSelect(character)}
      className="group relative flex flex-col bg-[#FFFDFE] rounded-3xl p-3.5 sm:p-4 border border-[#FCE7F3] shadow-coquette hover:shadow-coquette-hover transition-all duration-300 transform hover:-translate-y-1 cursor-pointer"
    >
      {/* Decorative Scrapbook Paper Clip / Bow pin motif */}
      <div className="absolute -top-2 left-6 z-10 pointer-events-none">
        <svg
          width="20"
          height="20"
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="filter drop-shadow-xs"
        >
          <path
            d="M50 50 C38 32 15 28 10 40 C6 50 20 62 46 54 Z"
            fill="#FBCFE8"
            stroke="#F472B6"
            strokeWidth="3"
          />
          <path
            d="M50 50 C62 32 85 28 90 40 C94 50 80 62 54 54 Z"
            fill="#FBCFE8"
            stroke="#F472B6"
            strokeWidth="3"
          />
          <path
            d="M47 52 C38 64 26 78 20 88 C32 84 42 76 49 56 Z"
            fill="#F9A8D4"
            stroke="#F472B6"
            strokeWidth="2.5"
          />
          <path
            d="M53 52 C62 64 74 78 80 88 C68 84 58 76 51 56 Z"
            fill="#F9A8D4"
            stroke="#F472B6"
            strokeWidth="2.5"
          />
          <circle cx="50" cy="51" r="6" fill="#F472B6" />
        </svg>
      </div>

      {/* Favorite Heart Button */}
      <button
        onClick={(e) => onToggleFavorite(character.id, e)}
        aria-label={isFavorite ? 'Bỏ yêu thích nhân vật' : 'Thêm vào yêu thích'}
        className={`absolute top-4 right-4 z-20 w-8 h-8 rounded-full flex items-center justify-center transition-all ${
          isFavorite
            ? 'bg-[#FFE4E8] text-[#EC4899] shadow-xs scale-105'
            : 'bg-white/80 backdrop-blur-xs text-[#9C8592] hover:text-[#EC4899] hover:bg-white'
        }`}
      >
        <Heart className={`w-4 h-4 transition-transform ${isFavorite ? 'fill-current scale-110' : ''}`} />
      </button>

      {/* Character Portrait Image */}
      <div className="relative aspect-[3/4] w-full rounded-2xl overflow-hidden bg-[#FFF0F5] mb-3.5 border border-[#FCE7F3]/70">
        <img
          src={character.avatar}
          alt={character.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-103"
          loading="lazy"
          referrerPolicy="no-referrer"
          onError={(e) => {
            // Elegant fallback container if image URL is invalid
            (e.target as HTMLElement).style.display = 'none';
          }}
        />
        {/* Subtle romantic gradient scrim */}
        <div className="absolute inset-0 bg-gradient-to-t from-pink-950/20 via-transparent to-transparent pointer-events-none" />

        {/* Status tag */}
        <div className="absolute bottom-2.5 left-2.5">
          <span className="text-[10.5px] font-medium text-[#831843] bg-white/90 backdrop-blur-xs px-2.5 py-0.5 rounded-full border border-[#FCE7F3] shadow-xs">
            {character.status}
          </span>
        </div>
      </div>

      {/* Content Metadata */}
      <div className="flex-1 flex flex-col">
        {/* Category Unboxed Text (Anti-pill discipline) */}
        <div className="flex items-center gap-1.5 text-xs text-[#831843] font-medium mb-1">
          <span>{CATEGORY_LABELS[character.category] || character.category}</span>
          {character.isSample && (
            <>
              <span aria-hidden="true" className="text-[#D1A8B8]">·</span>
              <span className="text-[11px] text-[#9C8592]">Dữ liệu mẫu</span>
            </>
          )}
        </div>

        {/* Character Name */}
        <h3 className="font-serif-title text-lg font-bold text-[#4A3B43] group-hover:text-[#831843] transition-colors line-clamp-1 mb-1.5">
          {character.name}
        </h3>

        {/* Short Bio */}
        <p className="text-xs text-[#6B5562] line-clamp-2 leading-relaxed mb-3 flex-1">
          {character.shortBio}
        </p>

        {/* Bottom Actions Row */}
        <div className="pt-2 border-t border-[#FCE7F3] flex items-center justify-between mt-auto">
          <span className="text-[11px] font-medium text-[#DB2777] flex items-center gap-1 group-hover:underline">
            <span>Lật trang</span>
            <ArrowUpRight className="w-3 h-3 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </span>

          {/* Quick link indicator badges if available */}
          <div className="flex items-center gap-1.5 text-[#9C8592]">
            {character.ellipsusUrl && (
              <span title="Có đường dẫn cốt truyện Ellipsus" className="text-[10px] text-[#831843] flex items-center gap-0.5">
                <BookOpen className="w-3 h-3 text-[#F472B6]" />
              </span>
            )}
            {character.ggaiUrl && (
              <span title="Có đường dẫn nhập vai GGAI" className="text-[10px] text-[#831843] flex items-center gap-0.5">
                <MessageSquare className="w-3 h-3 text-[#F472B6]" />
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
