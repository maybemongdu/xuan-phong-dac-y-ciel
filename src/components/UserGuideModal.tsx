import React from 'react';
import { X, BookOpen, Image, Music, Globe, Link, Sparkles } from 'lucide-react';

interface UserGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const UserGuideModal: React.FC<UserGuideModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/40 backdrop-blur-xs overflow-y-auto">
      <div
        className="relative w-full max-w-2xl bg-[#FFFDFE] rounded-[32px] border border-[#FCE7F3] shadow-2xl p-6 sm:p-8 my-auto max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#FCE7F3]">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-[#F472B6]" />
            <h2 className="text-xl sm:text-2xl font-bold font-serif-title text-[#831843]">
              Hướng dẫn sử dụng & quản trị nhật ký
            </h2>
          </div>
          <button
            onClick={onClose}
            aria-label="Đóng"
            className="p-2 rounded-full text-[#9C8592] hover:bg-[#FFE4E8] hover:text-[#831843] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-6 text-xs sm:text-sm text-[#4A3B43] leading-relaxed">
          {/* Section 1: Thêm và sửa nhân vật */}
          <div className="p-4 rounded-2xl bg-[#FFF8FA] border border-[#FCE7F3] space-y-2">
            <h3 className="font-semibold text-sm text-[#831843] flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-[#F472B6]" />
              <span>1. Cách thêm và sửa thông tin nhân vật</span>
            </h3>
            <ul className="list-disc list-inside space-y-1 text-[#6B5562] pl-1">
              <li>
                <strong>Thêm mới:</strong> Nhấn nút <em>"Thêm nhân vật"</em> ở góc trên thanh điều hướng để mở mẫu điền hồ sơ.
              </li>
              <li>
                <strong>Chỉnh sửa:</strong> Nhấn vào bất kỳ thẻ nhân vật nào để mở trang chi tiết, sau đó nhấn nút <em>"Chỉnh sửa"</em> ở góc trên bên phải.
              </li>
              <li>
                <strong>Dữ liệu tự động lưu:</strong> Mọi thay đổi đều được lưu an toàn trực tiếp vào trình duyệt của bạn (LocalStorage) và không bị mất khi tải lại trang.
              </li>
              <li>
                <strong>Sao lưu & Khôi phục:</strong> Bạn có thể dùng nút <em>"Xuất sao lưu JSON"</em> hoặc <em>"Khôi phục dữ liệu mẫu"</em> trong bảng quản lý bất cứ lúc nào.
              </li>
            </ul>
          </div>

          {/* Section 2: Cập nhật liên kết Ellipsus & GGAI */}
          <div className="p-4 rounded-2xl bg-[#FFF8FA] border border-[#FCE7F3] space-y-2">
            <h3 className="font-semibold text-sm text-[#831843] flex items-center gap-2">
              <Link className="w-4 h-4 text-[#F472B6]" />
              <span>2. Cập nhật liên kết đọc cốt truyện Ellipsus & nhập vai GGAI</span>
            </h3>
            <p className="text-[#6B5562]">
              Trong cửa sổ chỉnh sửa nhân vật:
            </p>
            <ul className="list-disc list-inside space-y-1 text-[#6B5562] pl-1">
              <li>
                <strong>Đường dẫn Ellipsus:</strong> Dán đường link tác phẩm/văn bản của nhân vật trên nền tảng Ellipsus vào ô tương ứng (ví dụ: <code className="text-[11px] bg-white px-1.5 py-0.5 rounded border border-[#FCE7F3]">https://ellipsus.com/...</code>).
              </li>
              <li>
                <strong>Đường dẫn GGAI:</strong> Dán đường link bot/kịch bản nhập vai trên GGAI (ví dụ: <code className="text-[11px] bg-white px-1.5 py-0.5 rounded border border-[#FCE7F3]">https://ggai.app/...</code>).
              </li>
              <li>
                Nếu chưa có liên kết, bạn chỉ cần để trống ô này. Hệ thống sẽ tự động thông báo thân thiện rằng chưa cập nhật, tránh tạo liên kết hỏng.
              </li>
            </ul>
          </div>

          {/* Section 3: Thay đổi ảnh nhân vật */}
          <div className="p-4 rounded-2xl bg-[#FFF8FA] border border-[#FCE7F3] space-y-2">
            <h3 className="font-semibold text-sm text-[#831843] flex items-center gap-2">
              <Image className="w-4 h-4 text-[#F472B6]" />
              <span>3. Cách thay đổi ảnh đại diện nhân vật</span>
            </h3>
            <ul className="list-disc list-inside space-y-1 text-[#6B5562] pl-1">
              <li>
                <strong>Chọn ảnh có sẵn:</strong> Trong bảng thêm/sửa, hệ thống đã chuẩn bị sẵn bộ sưu tập ảnh phong cách Coquette Pastel đồng bộ (Cổ đại, Dân quốc, Học đường, Hiện đại, Huyền ảo...). Bạn chỉ cần nhấn chọn ảnh mong muốn.
              </li>
              <li>
                <strong>Dùng ảnh cá nhân:</strong> Dán bất kỳ liên kết ảnh trực tiếp nào (URL kết thúc bằng .jpg, .png hoặc ảnh tải lên từ dịch vụ lưu trữ ảnh trực tuyến).
              </li>
            </ul>
          </div>

          {/* Section 4: Đổi nhạc nền */}
          <div className="p-4 rounded-2xl bg-[#FFF8FA] border border-[#FCE7F3] space-y-2">
            <h3 className="font-semibold text-sm text-[#831843] flex items-center gap-2">
              <Music className="w-4 h-4 text-[#F472B6]" />
              <span>4. Cách tùy chỉnh nhạc nền nhật ký</span>
            </h3>
            <ul className="list-disc list-inside space-y-1 text-[#6B5562] pl-1">
              <li>
                Ở thanh điều hướng trên cùng bên phải, nhấn vào biểu tượng bánh răng cài đặt trên trình phát nhạc.
              </li>
              <li>
                Nhập tên bài hát, nghệ sĩ và đường dẫn tệp âm thanh trực tiếp (định dạng .mp3).
              </li>
              <li>
                Nhạc không tự động phát khi vào trang để đảm bảo sự lịch sự, chỉ bắt đầu ngân vang khi bạn chủ động nhấn nút Play.
              </li>
            </ul>
          </div>

          {/* Section 5: Xuất bản website công khai */}
          <div className="p-4 rounded-2xl bg-[#FFF8FA] border border-[#FCE7F3] space-y-2">
            <h3 className="font-semibold text-sm text-[#831843] flex items-center gap-2">
              <Globe className="w-4 h-4 text-[#F472B6]" />
              <span>5. Xuất bản website để chia sẻ với mọi người</span>
            </h3>
            <p className="text-[#6B5562]">
              Website hiện đang chạy trực tiếp và có sẵn đường dẫn công khai (Shared URL) được cấp bởi Google AI Studio Build. Bạn có thể sao chép đường dẫn này và chia sẻ cho bạn bè truy cập ngay lập tức trên máy tính và điện thoại thông minh!
            </p>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-[#FCE7F3] flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-full bg-[#F472B6] hover:bg-[#EC4899] text-white text-xs font-medium shadow-xs transition-colors cursor-pointer"
          >
            Đã hiểu, quay lại nhật ký
          </button>
        </div>
      </div>
    </div>
  );
};
