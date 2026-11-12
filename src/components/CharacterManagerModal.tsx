import React, { useState, useEffect } from 'react';
import { X, Save, Trash2, RotateCcw, Download, Upload, Image as ImageIcon } from 'lucide-react';
import { Character } from '../types/character';

interface CharacterManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  characterToEdit: Character | null;
  onSaveCharacter: (character: Character) => void;
  onDeleteCharacter: (id: string) => void;
  onResetToDefault: () => void;
  onImportData: (data: Character[]) => void;
  allCharacters: Character[];
}

const PRESET_AVATARS = [
  { label: 'Cổ đại - Lăng Nguyệt', url: '/src/assets/images/char_ancient_ciel_1794470047405.jpg' },
  { label: 'Dân quốc - Thẩm Hành Chi', url: '/src/assets/images/char_republic_elegance_1794470047767.jpg' },
  { label: 'Học đường - Hạ Lan Chi', url: '/src/assets/images/char_school_youth_1794470049445.jpg' },
  { label: 'Hiện đại - Cố Thanh Hoài', url: '/src/assets/images/char_modern_gentle_1794470050228.jpg' },
  { label: 'Khác / Huyền ảo - Dạ Anh', url: '/src/assets/images/char_fantasy_ciel_1794470066504.jpg' },
  { label: 'Cổ đại - Tạ Quân Khanh', url: '/src/assets/images/char_ancient_scholar_1794470066930.jpg' },
];

export const CharacterManagerModal: React.FC<CharacterManagerModalProps> = ({
  isOpen,
  onClose,
  characterToEdit,
  onSaveCharacter,
  onDeleteCharacter,
  onResetToDefault,
  onImportData,
  allCharacters,
}) => {
  const [formData, setFormData] = useState<Partial<Character>>({
    id: '',
    name: '',
    avatar: PRESET_AVATARS[0].url,
    category: 'co-dai',
    shortBio: '',
    description: '',
    quote: '',
    ellipsusUrl: '',
    ggaiUrl: '',
    status: 'Đang mở cốt truyện',
    tags: [],
    createdAt: new Date().toISOString().split('T')[0],
  });

  const [tagInput, setTagInput] = useState('');
  const [notification, setNotification] = useState<string | null>(null);

  useEffect(() => {
    if (characterToEdit) {
      setFormData(characterToEdit);
      setTagInput((characterToEdit.tags || []).join(', '));
    } else {
      setFormData({
        id: `char-${Date.now()}`,
        name: '',
        avatar: PRESET_AVATARS[0].url,
        category: 'co-dai',
        shortBio: '',
        description: '',
        quote: '',
        ellipsusUrl: '',
        ggaiUrl: '',
        status: 'Đang mở cốt truyện',
        tags: [],
        createdAt: new Date().toISOString().split('T')[0],
      });
      setTagInput('');
    }
  }, [characterToEdit, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name?.trim()) {
      setNotification('Vui lòng nhập tên nhân vật!');
      return;
    }

    const processedTags = tagInput
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    const charToSave: Character = {
      id: formData.id || `char-${Date.now()}`,
      name: formData.name.trim(),
      avatar: formData.avatar?.trim() || PRESET_AVATARS[0].url,
      category: formData.category || 'co-dai',
      shortBio: formData.shortBio?.trim() || 'Nhân vật nhập vai.',
      description: formData.description?.trim() || 'Đang cập nhật nội dung cốt truyện.',
      quote: formData.quote?.trim() || '',
      ellipsusUrl: formData.ellipsusUrl?.trim() || '',
      ggaiUrl: formData.ggaiUrl?.trim() || '',
      status: formData.status?.trim() || 'Đang mở cốt truyện',
      tags: processedTags,
      createdAt: formData.createdAt || new Date().toISOString().split('T')[0],
      isSample: false,
    };

    onSaveCharacter(charToSave);
    onClose();
  };

  const handleExportJSON = () => {
    const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(
      JSON.stringify(allCharacters, null, 2)
    )}`;
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', jsonString);
    downloadAnchor.setAttribute('download', `xuan_phong_ciel_backup_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    setNotification('Đã tải xuống tệp sao lưu JSON thành công!');
    setTimeout(() => setNotification(null), 3000);
  };

  const handleImportJSON = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileReader = new FileReader();
    if (e.target.files && e.target.files[0]) {
      fileReader.readAsText(e.target.files[0], 'UTF-8');
      fileReader.onload = (event) => {
        try {
          const parsed = JSON.parse(event.target?.result as string);
          if (Array.isArray(parsed)) {
            onImportData(parsed);
            setNotification('Đã nhập dữ liệu nhân vật thành công!');
            setTimeout(() => setNotification(null), 3000);
          } else {
            setNotification('Định dạng tệp JSON không hợp lệ!');
          }
        } catch {
          setNotification('Lỗi khi đọc tệp JSON!');
        }
      };
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/40 backdrop-blur-xs overflow-y-auto">
      <div
        className="relative w-full max-w-3xl bg-[#FFFDFE] rounded-[32px] border border-[#FCE7F3] shadow-2xl p-6 sm:p-8 my-auto max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-[#FCE7F3]">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold font-serif-title text-[#831843]">
              {characterToEdit ? 'Chỉnh sửa nhân vật' : 'Thêm trang nhân vật mới'}
            </h2>
            <p className="text-xs text-[#9C8592] mt-0.5">
              Tổ chức hồ sơ, cập nhật hình ảnh và liên kết Ellipsus / GGAI
            </p>
          </div>
          <button
            onClick={onClose}
            aria-label="Đóng"
            className="p-2 rounded-full text-[#9C8592] hover:bg-[#FFE4E8] hover:text-[#831843] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {notification && (
          <div className="mb-4 p-3 rounded-xl bg-[#FFF1F5] border border-[#FBCFE8] text-xs text-[#9D174D]">
            {notification}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Mã nhân vật */}
            <div>
              <label className="block text-xs font-semibold text-[#4A3B43] mb-1">
                Mã nhân vật (ID) <span className="text-[#E11D48]">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.id}
                onChange={(e) => setFormData({ ...formData, id: e.target.value })}
                placeholder="VD: ciel-07"
                className="w-full px-3 py-2 text-xs rounded-xl border border-[#FCE7F3] bg-[#FFF8FA] focus:outline-none focus:border-[#F472B6]"
              />
            </div>

            {/* Tên nhân vật */}
            <div>
              <label className="block text-xs font-semibold text-[#4A3B43] mb-1">
                Tên nhân vật <span className="text-[#E11D48]">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="VD: Ciel · Bạch Lạc"
                className="w-full px-3 py-2 text-xs rounded-xl border border-[#FCE7F3] bg-[#FFF8FA] focus:outline-none focus:border-[#F472B6]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Thể loại */}
            <div>
              <label className="block text-xs font-semibold text-[#4A3B43] mb-1">
                Thể loại <span className="text-[#E11D48]">*</span>
              </label>
              <select
                value={formData.category}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    category: e.target.value as Character['category'],
                  })
                }
                className="w-full px-3 py-2 text-xs rounded-xl border border-[#FCE7F3] bg-[#FFF8FA] focus:outline-none focus:border-[#F472B6]"
              >
                <option value="co-dai">Cổ đại</option>
                <option value="dan-quoc">Dân quốc</option>
                <option value="hien-dai">Hiện đại</option>
                <option value="hoc-duong">Học đường</option>
                <option value="khac">Khác (Huyền ảo, Khoa học viễn tưởng...)</option>
              </select>
            </div>

            {/* Trạng thái cập nhật */}
            <div>
              <label className="block text-xs font-semibold text-[#4A3B43] mb-1">
                Trạng thái cập nhật
              </label>
              <input
                type="text"
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                placeholder="VD: Đang mở cốt truyện, Đang nhập vai, Bản thảo mới"
                className="w-full px-3 py-2 text-xs rounded-xl border border-[#FCE7F3] bg-[#FFF8FA] focus:outline-none focus:border-[#F472B6]"
              />
            </div>
          </div>

          {/* Ảnh đại diện: URL hoặc chọn mẫu có sẵn */}
          <div>
            <label className="block text-xs font-semibold text-[#4A3B43] mb-1">
              Ảnh đại diện (URL hoặc chọn mẫu có sẵn bên dưới)
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={formData.avatar}
                onChange={(e) => setFormData({ ...formData, avatar: e.target.value })}
                placeholder="https://... hoặc /src/assets/images/..."
                className="flex-1 px-3 py-2 text-xs rounded-xl border border-[#FCE7F3] bg-[#FFF8FA] focus:outline-none focus:border-[#F472B6]"
              />
            </div>

            {/* Preset Avatars picker */}
            <div className="mt-2 p-2.5 rounded-2xl bg-[#FFF5F8] border border-[#FCE7F3]">
              <span className="text-[11px] font-medium text-[#831843] flex items-center gap-1 mb-2">
                <ImageIcon className="w-3.5 h-3.5 text-[#F472B6]" />
                <span>Hoặc chọn nhanh từ kho ảnh mẫu Pastel:</span>
              </span>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                {PRESET_AVATARS.map((preset, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setFormData({ ...formData, avatar: preset.url })}
                    className={`group relative rounded-xl overflow-hidden border-2 transition-all aspect-[3/4] ${
                      formData.avatar === preset.url
                        ? 'border-[#F472B6] ring-2 ring-[#FBCFE8]'
                        : 'border-transparent hover:border-[#FBCFE8]'
                    }`}
                  >
                    <img
                      src={preset.url}
                      alt={preset.label}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-1 text-[9px] text-white text-center leading-tight">
                      {preset.label}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Giới thiệu ngắn */}
          <div>
            <label className="block text-xs font-semibold text-[#4A3B43] mb-1">
              Giới thiệu ngắn (1-2 câu tóm tắt) <span className="text-[#E11D48]">*</span>
            </label>
            <input
              type="text"
              required
              value={formData.shortBio}
              onChange={(e) => setFormData({ ...formData, shortBio: e.target.value })}
              placeholder="VD: Quý nữ phủ Thừa tướng, tính tình ôn nhu như ngọc..."
              className="w-full px-3 py-2 text-xs rounded-xl border border-[#FCE7F3] bg-[#FFF8FA] focus:outline-none focus:border-[#F472B6]"
            />
          </div>

          {/* Câu thoại tâm đắc */}
          <div>
            <label className="block text-xs font-semibold text-[#4A3B43] mb-1">
              Câu thoại tâm đắc (Quote)
            </label>
            <input
              type="text"
              value={formData.quote}
              onChange={(e) => setFormData({ ...formData, quote: e.target.value })}
              placeholder="VD: Gió xuân mười dặm chẳng bằng một chén trà ấm bên người tri kỷ."
              className="w-full px-3 py-2 text-xs rounded-xl border border-[#FCE7F3] bg-[#FFF8FA] focus:outline-none focus:border-[#F472B6]"
            />
          </div>

          {/* Mô tả chi tiết cốt truyện & thiết lập */}
          <div>
            <label className="block text-xs font-semibold text-[#4A3B43] mb-1">
              Mô tả chi tiết nhân vật & cốt truyện <span className="text-[#E11D48]">*</span>
            </label>
            <textarea
              required
              rows={4}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Nhập bối cảnh xuất thân, tính cách, sở thích, mối quan hệ và những tình tiết quan trọng..."
              className="w-full px-3 py-2 text-xs rounded-xl border border-[#FCE7F3] bg-[#FFF8FA] focus:outline-none focus:border-[#F472B6]"
            />
          </div>

          {/* Đường dẫn Ellipsus & GGAI */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#4A3B43] mb-1">
                Đường dẫn cốt truyện Ellipsus (URL)
              </label>
              <input
                type="url"
                value={formData.ellipsusUrl}
                onChange={(e) => setFormData({ ...formData, ellipsusUrl: e.target.value })}
                placeholder="https://ellipsus.com/..."
                className="w-full px-3 py-2 text-xs rounded-xl border border-[#FCE7F3] bg-[#FFF8FA] focus:outline-none focus:border-[#F472B6]"
              />
              <span className="text-[10px] text-[#9C8592] mt-0.5 block">
                Để trống nếu chưa có liên kết Ellipsus
              </span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#4A3B43] mb-1">
                Đường dẫn nhập vai GGAI (URL)
              </label>
              <input
                type="url"
                value={formData.ggaiUrl}
                onChange={(e) => setFormData({ ...formData, ggaiUrl: e.target.value })}
                placeholder="https://ggai.app/..."
                className="w-full px-3 py-2 text-xs rounded-xl border border-[#FCE7F3] bg-[#FFF8FA] focus:outline-none focus:border-[#F472B6]"
              />
              <span className="text-[10px] text-[#9C8592] mt-0.5 block">
                Để trống nếu chưa có liên kết GGAI
              </span>
            </div>
          </div>

          {/* Từ khóa tags */}
          <div>
            <label className="block text-xs font-semibold text-[#4A3B43] mb-1">
              Từ khóa đặc điểm (phân cách bằng dấu phẩy)
            </label>
            <input
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              placeholder="VD: Ôn nhu, Trà đạo, Thông tuệ, Thanh thuần"
              className="w-full px-3 py-2 text-xs rounded-xl border border-[#FCE7F3] bg-[#FFF8FA] focus:outline-none focus:border-[#F472B6]"
            />
          </div>

          {/* Action buttons */}
          <div className="pt-4 border-t border-[#FCE7F3] flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              {characterToEdit && (
                <button
                  type="button"
                  onClick={() => {
                    if (window.confirm(`Bạn có chắc chắn muốn xóa nhân vật "${characterToEdit.name}" khỏi nhật ký?`)) {
                      onDeleteCharacter(characterToEdit.id);
                      onClose();
                    }
                  }}
                  className="px-3 py-2 rounded-xl text-xs font-medium text-[#E11D48] hover:bg-[#FFE4E8] flex items-center gap-1.5 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Xóa nhân vật</span>
                </button>
              )}
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-xs font-medium text-[#6B5562] border border-[#FCE7F3] hover:bg-[#FFF5F8] transition-colors"
              >
                Hủy bỏ
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl text-xs font-medium text-white bg-[#F472B6] hover:bg-[#EC4899] flex items-center gap-1.5 shadow-coquette transition-all cursor-pointer"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Lưu thông tin</span>
              </button>
            </div>
          </div>
        </form>

        {/* Backup and Data tools */}
        <div className="mt-8 pt-6 border-t border-[#FCE7F3] flex flex-wrap items-center justify-between gap-3 text-xs text-[#9C8592]">
          <div className="flex items-center gap-2">
            <button
              onClick={handleExportJSON}
              className="px-3 py-1.5 rounded-lg border border-[#FBCFE8] text-[#831843] hover:bg-[#FFE4E8] flex items-center gap-1 transition-colors"
              title="Tải tệp JSON sao lưu tất cả nhân vật"
            >
              <Download className="w-3.5 h-3.5 text-[#F472B6]" />
              <span>Xuất sao lưu JSON</span>
            </button>

            <label className="px-3 py-1.5 rounded-lg border border-[#FBCFE8] text-[#831843] hover:bg-[#FFE4E8] flex items-center gap-1 transition-colors cursor-pointer">
              <Upload className="w-3.5 h-3.5 text-[#F472B6]" />
              <span>Nhập JSON</span>
              <input
                type="file"
                accept=".json"
                onChange={handleImportJSON}
                className="hidden"
              />
            </label>
          </div>

          <button
            onClick={() => {
              if (window.confirm('Khôi phục danh sách nhân vật về dữ liệu mẫu ban đầu? Những chỉnh sửa tùy biến của bạn sẽ được thiết lập lại.')) {
                onResetToDefault();
                onClose();
              }
            }}
            className="flex items-center gap-1 text-[#DB2777] hover:underline"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Khôi phục dữ liệu mẫu ban đầu</span>
          </button>
        </div>
      </div>
    </div>
  );
};
