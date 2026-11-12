import React, { useEffect } from 'react';
import { X, Heart, BookOpen, MessageSquare, ExternalLink, Calendar, Tag, Quote, Edit3 } from 'lucide-react';
import { Character } from '../types/character';
import { CATEGORY_LABELS } from '../data/sampleCharacters';

interface CharacterDetailModalProps {
  character: Character | null;
  isOpen: boolean;
  onClose: () => void;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
  onEditCharacter: (character: Character) => void;
}

export const CharacterDetailModal: React.FC<CharacterDetailModalProps> = ({
  character,
  isOpen,
  onClose,
  isFavorite,
  onToggleFavorite,
  onEditCharacter,
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'auto';
    };
  }, [isOpen, onClose]);

  if (!isOpen || !character) return null;

  const hasEllipsus = !!character.ellipsusUrl?.trim();
  const hasGgai = !!character.ggaiUrl?.trim();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/40 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-200">
      {/* Scrapbook Diary Double Page Spread Modal */}
      <div
        className="relative w-full max-w-4xl bg-[#FFFDFE] rounded-[28px] sm:rounded-[36px] border border-[#FCE7F3] shadow-2xl overflow-hidden my-auto animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Decorative Diary Header Bar */}
        <div className="px-6 py-3.5 bg-[#FFF5F8] border-b border-[#FCE7F3] flex items-center justify-between">
          <div className="flex items-center gap-2">
            {/* SVG mini bow */}
            <svg
              width="22"
              height="22"
              viewBox="0 0 100 100"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M50 50 C38 32 15 28 10 40 C6 50 20 62 46 54 Z"
                fill="#FBCFE8"
                stroke="#F472B6"
                strokeWidth="2.5"
              />
              <path
                d="M50 50 C62 32 85 28 90 40 C94 50 80 62 54 54 Z"
                fill="#FBCFE8"
                stroke="#F472B6"
                strokeWidth="2.5"
              />
              <path
                d="M47 52 C38 64 26 78 20 88 C32 84 42 76 49 56 Z"
                fill="#F9A8D4"
                stroke="#F472B6"
                strokeWidth="2"
              />
              <path
                d="M53 52 C62 64 74 78 80 88 C68 84 58 76 51 56 Z"
                fill="#F9A8D4"
                stroke="#F472B6"
                strokeWidth="2"
              />
              <circle cx="50" cy="51" r="7" fill="#F472B6" />
            </svg>
            <span className="text-xs font-serif-title font-semibold text-[#831843]">
              Hồ sơ nhật ký nhân vật
            </span>
            <span className="text-xs text-[#B49EAB]">·</span>
            <span className="text-xs text-[#9C8592]">
              {CATEGORY_LABELS[character.category] || character.category}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* Edit button */}
            <button
              onClick={() => {
                onClose();
                onEditCharacter(character);
              }}
              className="px-3 py-1.5 rounded-full text-xs font-medium text-[#831843] bg-[#FFE4E8] hover:bg-[#FCE7F3] transition-colors flex items-center gap-1 cursor-pointer"
              title="Chỉnh sửa thông tin nhân vật này"
            >
              <Edit3 className="w-3.5 h-3.5 text-[#DB2777]" />
              <span className="hidden sm:inline">Chỉnh sửa</span>
            </button>

            {/* Favorite button */}
            <button
              onClick={() => onToggleFavorite(character.id)}
              aria-label={isFavorite ? 'Bỏ yêu thích' : 'Yêu thích'}
              className={`p-2 rounded-full transition-colors cursor-pointer ${
                isFavorite
                  ? 'bg-[#FFE4E8] text-[#EC4899]'
                  : 'bg-white text-[#9C8592] hover:text-[#EC4899]'
              }`}
              title={isFavorite ? 'Bỏ yêu thích' : 'Thêm vào yêu thích'}
            >
              <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
            </button>

            {/* Close Button */}
            <button
              onClick={onClose}
              aria-label="Đóng cửa sổ"
              className="p-2 rounded-full text-[#9C8592] hover:text-[#831843] hover:bg-[#FFE4E8] transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body: Two column layout on desktop */}
        <div className="p-6 sm:p-8 max-h-[80vh] overflow-y-auto">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 sm:gap-8 items-start">
            {/* Left Column: Portrait and Key Info */}
            <div className="md:col-span-5 flex flex-col items-center">
              <div className="relative w-full max-w-[280px] sm:max-w-none aspect-[3/4] rounded-2xl overflow-hidden border-4 border-[#FFF5F8] shadow-coquette mb-4 bg-[#FFF0F5]">
                <img
                  src={character.avatar}
                  alt={character.name}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent pointer-events-none" />
              </div>

              {/* Status and metadata tags */}
              <div className="w-full space-y-2 text-xs text-[#6B5562] bg-[#FFF8FA] p-3.5 rounded-2xl border border-[#FCE7F3]">
                <div className="flex items-center justify-between pb-1.5 border-b border-[#FCE7F3]">
                  <span className="text-[#9C8592]">Trạng thái:</span>
                  <span className="font-medium text-[#831843] bg-white px-2 py-0.5 rounded-full border border-[#FCE7F3]">
                    {character.status}
                  </span>
                </div>

                <div className="flex items-center justify-between pb-1.5 border-b border-[#FCE7F3]">
                  <span className="text-[#9C8592] flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-[#F472B6]" />
                    <span>Ngày ghi chép:</span>
                  </span>
                  <span className="tabular-nums font-medium text-[#4A3B43]">
                    {character.createdAt}
                  </span>
                </div>

                {character.tags && character.tags.length > 0 && (
                  <div className="pt-1">
                    <span className="text-[#9C8592] flex items-center gap-1 mb-1.5">
                      <Tag className="w-3.5 h-3.5 text-[#F472B6]" />
                      <span>Đặc điểm / Tính cách:</span>
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {character.tags.map((tag, i) => (
                        <span
                          key={i}
                          className="px-2 py-0.5 rounded-md bg-white text-[11px] text-[#6B5562] border border-[#FCE7F3]"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Right Column: Character story, details & primary CTAs */}
            <div className="md:col-span-7 flex flex-col space-y-5">
              <div>
                <div className="flex items-center gap-2 text-xs text-[#831843] font-medium mb-1">
                  <span>{CATEGORY_LABELS[character.category]}</span>
                  {character.isSample && (
                    <>
                      <span aria-hidden="true">·</span>
                      <span className="text-[#9C8592]">Dữ liệu mẫu tham khảo</span>
                    </>
                  )}
                </div>
                <h2 className="font-serif-title text-2xl sm:text-3xl font-bold text-[#831843] mb-2">
                  {character.name}
                </h2>
                <p className="text-sm font-medium text-[#9D174D] leading-relaxed italic bg-[#FFF5F8] p-3 rounded-xl border-l-2 border-[#F472B6]">
                  "{character.shortBio}"
                </p>
              </div>

              {/* Quote section if available */}
              {character.quote && (
                <div className="p-4 rounded-2xl bg-[#FFFDFE] border border-[#FCE7F3] shadow-xs relative">
                  <Quote className="w-6 h-6 text-[#FBCFE8] absolute -top-2.5 left-4 fill-current" />
                  <p className="font-script text-lg sm:text-xl text-[#831843] pt-1 pl-4 leading-relaxed">
                    « {character.quote} »
                  </p>
                </div>
              )}

              {/* Detailed Description */}
              <div className="space-y-2">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-[#9C8592]">
                  Cốt truyện & Thiết lập nhân vật
                </h3>
                <div className="text-xs sm:text-sm text-[#4A3B43] leading-relaxed whitespace-pre-line bg-[#FFFDFE] p-4 rounded-2xl border border-[#FCE7F3] scrapbook-paper">
                  {character.description}
                </div>
              </div>

              {/* Two Mandatory Key Action Buttons: Ellipsus & GGAI */}
              <div className="pt-3 border-t border-[#FCE7F3] space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Button 1: Đọc cốt truyện (Ellipsus) */}
                  {hasEllipsus ? (
                    <a
                      href={character.ellipsusUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-3 px-4 rounded-2xl bg-[#FFE4E8] hover:bg-[#FCE7F3] text-[#831843] text-xs sm:text-sm font-medium flex items-center justify-center gap-2 border border-[#FBCFE8] transition-all transform hover:-translate-y-0.5 active:translate-y-0 shadow-xs"
                    >
                      <BookOpen className="w-4 h-4 text-[#DB2777]" />
                      <span>Đọc cốt truyện</span>
                      <ExternalLink className="w-3.5 h-3.5 ml-auto text-[#DB2777]" />
                    </a>
                  ) : (
                    <div className="w-full py-3 px-4 rounded-2xl bg-gray-50 border border-gray-200 text-gray-400 text-xs sm:text-sm flex flex-col items-center justify-center cursor-not-allowed">
                      <div className="flex items-center gap-1.5 font-medium">
                        <BookOpen className="w-4 h-4" />
                        <span>Đọc cốt truyện</span>
                      </div>
                      <span className="text-[10px] text-gray-400 mt-0.5">
                        Chưa cập nhật liên kết Ellipsus
                      </span>
                    </div>
                  )}

                  {/* Button 2: Bắt đầu nhập vai (GGAI) */}
                  {hasGgai ? (
                    <a
                      href={character.ggaiUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-3 px-4 rounded-2xl bg-[#F472B6] hover:bg-[#EC4899] text-white text-xs sm:text-sm font-medium flex items-center justify-center gap-2 transition-all transform hover:-translate-y-0.5 active:translate-y-0 shadow-coquette hover:shadow-coquette-hover"
                    >
                      <MessageSquare className="w-4 h-4" />
                      <span>Bắt đầu nhập vai</span>
                      <ExternalLink className="w-3.5 h-3.5 ml-auto text-white/80" />
                    </a>
                  ) : (
                    <div className="w-full py-3 px-4 rounded-2xl bg-gray-50 border border-gray-200 text-gray-400 text-xs sm:text-sm flex flex-col items-center justify-center cursor-not-allowed">
                      <div className="flex items-center gap-1.5 font-medium">
                        <MessageSquare className="w-4 h-4" />
                        <span>Bắt đầu nhập vai</span>
                      </div>
                      <span className="text-[10px] text-gray-400 mt-0.5">
                        Chưa cập nhật liên kết GGAI
                      </span>
                    </div>
                  )}
                </div>

                {/* Subtitle hint */}
                <p className="text-[11px] text-[#9C8592] text-center">
                  Liên kết sẽ mở trong tab trình duyệt mới để bạn đọc văn bản hoặc bắt đầu tương tác.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
