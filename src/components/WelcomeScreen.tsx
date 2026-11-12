import React from 'react';
import { Sparkles, BookOpen, Heart } from 'lucide-react';

interface WelcomeScreenProps {
  onOpenDiary: () => void;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onOpenDiary }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gradient-to-b from-[#FFF5F8] via-[#FDF2F8] to-[#FFF0F5] overflow-y-auto">
      {/* Delicate floating background decorative elements */}
      <div className="absolute top-10 left-12 w-32 h-32 bg-[#FCE7F3]/40 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-12 right-12 w-48 h-48 bg-[#FBCFE8]/30 rounded-full blur-3xl pointer-events-none" />

      {/* Main Scrapbook Cover Card */}
      <div className="relative w-full max-w-xl mx-auto bg-[#FFFDFE] rounded-[32px] p-8 sm:p-12 border border-[#FCE7F3] shadow-coquette-hover text-center transition-all">
        {/* Top Lace Ribbon Ribbon Bow Motif */}
        <div className="flex justify-center -mt-14 mb-4">
          <div className="w-16 h-16 rounded-full bg-[#FFF5F8] border-2 border-[#FBCFE8] flex items-center justify-center shadow-sm">
            {/* SVG Silk Ribbon Bow */}
            <svg
              width="36"
              height="36"
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
              <circle cx="50" cy="51" r="7" fill="#F472B6" stroke="#DB2777" strokeWidth="1.5" />
            </svg>
          </div>
        </div>

        {/* Small delicate subheader */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFF1F5] text-[#9D174D] text-xs mb-3 font-medium border border-[#FCE7F3]">
          <Sparkles className="w-3.5 h-3.5 text-[#F472B6]" />
          <span>Nhật ký nhân vật nhập vai</span>
        </div>

        {/* Main Title */}
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-[#831843] mb-2 font-serif-title">
          Xuân Phong Đắc Ý
        </h1>
        <p className="font-script text-2xl text-[#DB2777] mb-4">~ Ciel ~</p>

        {/* Delicate Scrapbook Cover Illustration */}
        <div className="relative my-6 mx-auto max-w-sm rounded-2xl overflow-hidden border-4 border-[#FFF5F8] shadow-sm">
          <img
            src="/src/assets/images/diary_cover_illustration_1794470050088.jpg"
            alt="Bìa nhật ký Xuân Phong Đắc Ý"
            className="w-full h-48 sm:h-56 object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-pink-900/20 via-transparent to-transparent pointer-events-none" />
        </div>

        {/* Gentle welcome greeting */}
        <p className="text-sm sm:text-base text-[#6B5562] max-w-md mx-auto leading-relaxed mb-8">
          Chào mừng bạn đến với góc nhỏ lưu giữ những mảnh ký ức dịu dàng, nơi mỗi nhân vật đều mang theo một câu chuyện và tiếng lòng riêng biệt.
        </p>

        {/* Main Action Button to open the diary */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={onOpenDiary}
            className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-[#F472B6] hover:bg-[#EC4899] text-white font-medium text-sm sm:text-base shadow-coquette hover:shadow-coquette-hover transition-all transform hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2 group cursor-pointer"
          >
            <BookOpen className="w-4 h-4 transition-transform group-hover:scale-110" />
            <span>Mở nhật ký</span>
          </button>
        </div>

        {/* Footer gentle hint */}
        <div className="mt-8 pt-4 border-t border-[#FCE7F3]/70 flex items-center justify-center gap-2 text-xs text-[#9C8592]">
          <Heart className="w-3 h-3 text-[#F472B6] fill-current" />
          <span>Pink Coquette Pastel · Sổ tay lưu giữ ký ức</span>
        </div>
      </div>
    </div>
  );
};
