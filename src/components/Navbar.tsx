import React, { useState } from 'react';
import { Heart, Clock, Plus, HelpCircle, BookHeart, Menu, X } from 'lucide-react';
import { MusicPlayer } from './MusicPlayer';
import { CharacterCategory } from '../types/character';

interface NavbarProps {
  activeCategory: CharacterCategory;
  onSelectCategory: (cat: CharacterCategory) => void;
  favoritesCount: number;
  recentCount: number;
  onOpenAddModal: () => void;
  onOpenGuideModal: () => void;
  onReturnToCover: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeCategory,
  onSelectCategory,
  favoritesCount,
  recentCount,
  onOpenAddModal,
  onOpenGuideModal,
  onReturnToCover,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-[#FFFDFE]/90 backdrop-blur-md border-b border-[#FCE7F3] shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4 lg:gap-8">
          {/* Zone 1: Brand Wordmark */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={onReturnToCover}
              className="flex items-center gap-2 group text-left cursor-pointer"
              title="Nhấn để xem lại bìa nhật ký"
            >
              {/* Cute bow badge */}
              <div className="w-8 h-8 rounded-full bg-[#FFF0F5] border border-[#FBCFE8] flex items-center justify-center text-[#DB2777] group-hover:scale-105 transition-transform">
                <BookHeart className="w-4 h-4 text-[#F472B6]" />
              </div>
              <div className="flex flex-col">
                <span className="font-serif-title text-lg sm:text-xl font-bold tracking-tight text-[#831843] whitespace-nowrap">
                  Xuân Phong Đắc Ý
                </span>
                <span className="text-[10px] font-script text-[#DB2777] -mt-1 hidden sm:block">
                  Ciel · Nhật ký nhập vai
                </span>
              </div>
            </button>
          </div>

          {/* Zone 2: Navigation Links (Desktop) */}
          <nav className="hidden md:flex items-center gap-6 text-xs sm:text-sm font-medium text-[#6B5562]">
            <button
              onClick={() => onSelectCategory('tat-ca')}
              className={`whitespace-nowrap pb-0.5 border-b-2 transition-colors cursor-pointer ${
                activeCategory === 'tat-ca'
                  ? 'border-[#F472B6] text-[#831843] font-semibold'
                  : 'border-transparent hover:text-[#831843]'
              }`}
            >
              Tất cả nhân vật
            </button>

            <button
              onClick={() => onSelectCategory('yeu-thich')}
              className={`flex items-center gap-1.5 whitespace-nowrap pb-0.5 border-b-2 transition-colors cursor-pointer ${
                activeCategory === 'yeu-thich'
                  ? 'border-[#F472B6] text-[#831843] font-semibold'
                  : 'border-transparent hover:text-[#831843]'
              }`}
            >
              <Heart className={`w-3.5 h-3.5 ${favoritesCount > 0 ? 'text-[#EC4899] fill-current' : 'text-[#9C8592]'}`} />
              <span>Yêu thích</span>
              <span className="text-[10px] tabular-nums px-1.5 py-0.2 rounded-full bg-[#FFE4E8] text-[#9D174D]">
                {favoritesCount}
              </span>
            </button>

            <button
              onClick={() => {
                // Focus recent section or filter
                const recentSec = document.getElementById('recent-section');
                if (recentSec) {
                  recentSec.scrollIntoView({ behavior: 'smooth' });
                }
              }}
              className="flex items-center gap-1.5 whitespace-nowrap pb-0.5 border-b-2 border-transparent hover:text-[#831843] transition-colors cursor-pointer"
            >
              <Clock className="w-3.5 h-3.5 text-[#9C8592]" />
              <span>Xem gần đây</span>
              {recentCount > 0 && (
                <span className="text-[10px] tabular-nums px-1.5 py-0.2 rounded-full bg-[#FFF1F5] text-[#6B5562]">
                  {recentCount}
                </span>
              )}
            </button>

            <button
              onClick={onOpenGuideModal}
              className="flex items-center gap-1 whitespace-nowrap pb-0.5 border-b-2 border-transparent hover:text-[#831843] transition-colors cursor-pointer text-[#8C7583]"
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>Hướng dẫn</span>
            </button>
          </nav>

          {/* Zone 3: Primary Action & Music Player */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Integrated Music Player at Top Right */}
            <MusicPlayer />

            {/* Quick Add Character Button */}
            <button
              onClick={onOpenAddModal}
              className="hidden sm:flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-[#F472B6] hover:bg-[#EC4899] text-white text-xs font-medium shadow-xs hover:shadow-coquette transition-all cursor-pointer whitespace-nowrap shrink-0"
              title="Thêm trang nhân vật mới vào nhật ký"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Thêm nhân vật</span>
            </button>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-xl text-[#831843] hover:bg-[#FFF5F8] transition-colors cursor-pointer"
              aria-label="Mở menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-3 px-2 border-t border-[#FCE7F3] space-y-2 animate-in fade-in slide-in-from-top-2">
            <button
              onClick={() => {
                onSelectCategory('tat-ca');
                setMobileMenuOpen(false);
              }}
              className={`w-full text-left px-3 py-2 rounded-xl text-sm font-medium ${
                activeCategory === 'tat-ca' ? 'bg-[#FFE4E8] text-[#831843]' : 'text-[#6B5562]'
              }`}
            >
              Tất cả nhân vật
            </button>

            <button
              onClick={() => {
                onSelectCategory('yeu-thich');
                setMobileMenuOpen(false);
              }}
              className={`w-full text-left px-3 py-2 rounded-xl text-sm font-medium flex items-center justify-between ${
                activeCategory === 'yeu-thich' ? 'bg-[#FFE4E8] text-[#831843]' : 'text-[#6B5562]'
              }`}
            >
              <div className="flex items-center gap-2">
                <Heart className="w-4 h-4 text-[#EC4899]" />
                <span>Nhân vật yêu thích</span>
              </div>
              <span className="text-xs px-2 py-0.5 rounded-full bg-[#FCE7F3] text-[#9D174D]">
                {favoritesCount}
              </span>
            </button>

            <button
              onClick={() => {
                const recentSec = document.getElementById('recent-section');
                if (recentSec) {
                  recentSec.scrollIntoView({ behavior: 'smooth' });
                }
                setMobileMenuOpen(false);
              }}
              className="w-full text-left px-3 py-2 rounded-xl text-sm font-medium flex items-center justify-between text-[#6B5562]"
            >
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#9C8592]" />
                <span>Xem gần đây</span>
              </div>
              <span className="text-xs px-2 py-0.5 rounded-full bg-[#FFF1F5] text-[#6B5562]">
                {recentCount}
              </span>
            </button>

            <div className="pt-2 border-t border-[#FCE7F3] flex flex-col gap-2">
              <button
                onClick={() => {
                  onOpenAddModal();
                  setMobileMenuOpen(false);
                }}
                className="w-full py-2.5 px-4 rounded-xl bg-[#F472B6] text-white text-xs font-medium flex items-center justify-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Thêm nhân vật mới</span>
              </button>

              <button
                onClick={() => {
                  onOpenGuideModal();
                  setMobileMenuOpen(false);
                }}
                className="w-full py-2 px-3 rounded-xl border border-[#FBCFE8] text-xs font-medium text-[#6B5562] flex items-center justify-center gap-1.5"
              >
                <HelpCircle className="w-3.5 h-3.5 text-[#F472B6]" />
                <span>Xem hướng dẫn & quản lý</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
