import React, { useState, useRef, useEffect } from 'react';
import { Volume2, VolumeX, Play, Pause, SkipForward, Music, Settings2, Sparkles, Check } from 'lucide-react';
import { SongTrack } from '../types/character';
import { DEFAULT_PLAYLIST } from '../data/sampleCharacters';

interface MusicPlayerProps {
  customTracks?: SongTrack[];
  onUpdateTracks?: (tracks: SongTrack[]) => void;
}

export const MusicPlayer: React.FC<MusicPlayerProps> = ({ customTracks }) => {
  const [playlist, setPlaylist] = useState<SongTrack[]>(() => {
    const saved = localStorage.getItem('ciel_custom_music');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return DEFAULT_PLAYLIST;
      }
    }
    return customTracks || DEFAULT_PLAYLIST;
  });

  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.4);
  const [isMuted, setIsMuted] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isConfigOpen, setIsConfigOpen] = useState(false);

  // Custom song modal input states
  const [newTitle, setNewTitle] = useState('');
  const [newArtist, setNewArtist] = useState('');
  const [newUrl, setNewUrl] = useState('');
  const [configNotice, setConfigNotice] = useState<string | null>(null);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  const currentTrack = playlist[currentTrackIndex] || playlist[0];

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  const togglePlay = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current
        .play()
        .then(() => setIsPlaying(true))
        .catch(() => {
          setIsPlaying(false);
        });
    }
  };

  const handleNextTrack = () => {
    const nextIdx = (currentTrackIndex + 1) % playlist.length;
    setCurrentTrackIndex(nextIdx);
    setIsPlaying(false);
    setTimeout(() => {
      if (audioRef.current) {
        audioRef.current.load();
        audioRef.current
          .play()
          .then(() => setIsPlaying(true))
          .catch(() => setIsPlaying(false));
      }
    }, 150);
  };

  const handleAddCustomSong = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUrl.trim()) return;

    const newTrack: SongTrack = {
      id: `custom-${Date.now()}`,
      title: newTitle.trim() || 'Giai điệu của bạn',
      artist: newArtist.trim() || 'Người dùng tùy chọn',
      url: newUrl.trim(),
    };

    const updated = [newTrack, ...playlist];
    setPlaylist(updated);
    localStorage.setItem('ciel_custom_music', JSON.stringify(updated));
    setCurrentTrackIndex(0);
    setNewTitle('');
    setNewArtist('');
    setNewUrl('');
    setConfigNotice('Đã thêm bài hát mới vào danh sách!');
    setTimeout(() => setConfigNotice(null), 3000);
  };

  const handleResetPlaylist = () => {
    setPlaylist(DEFAULT_PLAYLIST);
    localStorage.removeItem('ciel_custom_music');
    setCurrentTrackIndex(0);
    setConfigNotice('Đã khôi phục danh sách nhạc mặc định!');
    setTimeout(() => setConfigNotice(null), 3000);
  };

  return (
    <div className="relative">
      <audio
        ref={audioRef}
        src={currentTrack?.url}
        onEnded={handleNextTrack}
        onError={() => setIsPlaying(false)}
        preload="none"
      />

      {/* Compact Mini Bar Player in Navbar */}
      <div className="flex items-center gap-1.5 p-1 px-2.5 rounded-full bg-[#FFF5F8] border border-[#FBCFE8] shadow-sm text-xs text-[#6B5562] transition-all hover:border-[#F472B6]">
        {/* Play/Pause Button */}
        <button
          onClick={togglePlay}
          aria-label={isPlaying ? 'Tạm dừng nhạc' : 'Phát nhạc'}
          className="w-7 h-7 flex items-center justify-center rounded-full bg-[#FFE4E8] text-[#DB2777] hover:bg-[#FCE7F3] hover:scale-105 active:scale-95 transition-transform"
          title={isPlaying ? 'Tạm dừng' : 'Phát nhạc'}
        >
          {isPlaying ? (
            <Pause className="w-3.5 h-3.5 fill-current" />
          ) : (
            <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
          )}
        </button>

        {/* Track Title and State */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center gap-1.5 px-1 max-w-[140px] sm:max-w-[180px] text-left hover:text-[#BE185D] transition-colors"
          title="Nhấn để mở chi tiết trình phát"
        >
          <Music className={`w-3.5 h-3.5 text-[#F472B6] shrink-0 ${isPlaying ? 'animate-spin' : ''}`} style={{ animationDuration: '6s' }} />
          <div className="truncate">
            <span className="font-medium truncate block text-[11px] text-[#4A3B43]">
              {currentTrack?.title}
            </span>
          </div>
        </button>

        {/* Next Track Button */}
        <button
          onClick={handleNextTrack}
          aria-label="Bài kế tiếp"
          className="w-6 h-6 flex items-center justify-center rounded-full text-[#9D174D] hover:bg-[#FFE4E8] transition-colors"
          title="Bài kế tiếp"
        >
          <SkipForward className="w-3.5 h-3.5" />
        </button>

        {/* Mute Toggle Button */}
        <button
          onClick={() => setIsMuted(!isMuted)}
          aria-label={isMuted ? 'Bật âm thanh' : 'Tắt tiếng'}
          className="w-6 h-6 flex items-center justify-center rounded-full text-[#9D174D] hover:bg-[#FFE4E8] transition-colors"
          title={isMuted ? 'Bật âm thanh' : 'Tắt tiếng'}
        >
          {isMuted || volume === 0 ? (
            <VolumeX className="w-3.5 h-3.5 text-[#E11D48]" />
          ) : (
            <Volume2 className="w-3.5 h-3.5" />
          )}
        </button>

        {/* Settings button */}
        <button
          onClick={() => setIsConfigOpen(true)}
          aria-label="Cài đặt nhạc nền"
          className="w-6 h-6 flex items-center justify-center rounded-full text-[#9D174D] hover:bg-[#FFE4E8] transition-colors"
          title="Cấu hình nhạc nền"
        >
          <Settings2 className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Expanded Volume / Track list popover */}
      {isExpanded && (
        <div className="absolute right-0 top-11 w-64 p-3 rounded-2xl bg-white/95 backdrop-blur-md border border-[#FBCFE8] shadow-coquette z-50 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="flex items-center justify-between pb-2 mb-2 border-b border-[#FCE7F3]">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-[#831843]">
              <Sparkles className="w-3.5 h-3.5 text-[#F472B6]" />
              <span>Giai điệu nhật ký</span>
            </div>
            <span className="text-[10px] text-[#9D174D] bg-[#FFF1F5] px-2 py-0.5 rounded-full border border-[#FCE7F3]">
              {isPlaying ? 'Đang phát' : 'Đang tạm dừng'}
            </span>
          </div>

          <div className="mb-3">
            <p className="text-xs font-medium text-[#4A3B43] truncate">{currentTrack?.title}</p>
            <p className="text-[11px] text-[#9C8592] truncate">{currentTrack?.artist}</p>
          </div>

          {/* Volume Slider */}
          <div className="flex items-center gap-2 mb-3">
            <Volume2 className="w-3.5 h-3.5 text-[#9C8592] shrink-0" />
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={isMuted ? 0 : volume}
              onChange={(e) => {
                setVolume(parseFloat(e.target.value));
                if (isMuted) setIsMuted(false);
              }}
              className="w-full h-1.5 bg-[#FCE7F3] rounded-lg appearance-none cursor-pointer accent-[#F472B6]"
            />
            <span className="text-[10px] tabular-nums text-[#9C8592] w-7 text-right">
              {Math.round((isMuted ? 0 : volume) * 100)}%
            </span>
          </div>

          {/* Playlist selector */}
          <div className="space-y-1 max-h-32 overflow-y-auto pr-1">
            {playlist.map((track, idx) => (
              <button
                key={track.id}
                onClick={() => {
                  setCurrentTrackIndex(idx);
                  setIsPlaying(false);
                  setTimeout(() => {
                    if (audioRef.current) {
                      audioRef.current.load();
                      audioRef.current.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
                    }
                  }, 100);
                }}
                className={`w-full text-left px-2 py-1.5 rounded-lg text-xs flex items-center justify-between transition-colors ${
                  idx === currentTrackIndex
                    ? 'bg-[#FFE4E8] text-[#831843] font-medium'
                    : 'hover:bg-[#FFF5F8] text-[#6B5562]'
                }`}
              >
                <span className="truncate pr-2">{track.title}</span>
                {idx === currentTrackIndex && <Check className="w-3.5 h-3.5 text-[#DB2777] shrink-0" />}
              </button>
            ))}
          </div>

          <button
            onClick={() => setIsConfigOpen(true)}
            className="w-full mt-2.5 pt-2 border-t border-[#FCE7F3] text-center text-[11px] text-[#DB2777] hover:text-[#9D174D] font-medium transition-colors"
          >
            + Tùy chỉnh danh sách nhạc
          </button>
        </div>
      )}

      {/* Modal Cấu hình nhạc nền */}
      {isConfigOpen && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-xs z-[100] flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white rounded-3xl p-6 border border-[#FBCFE8] shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-[#FCE7F3] mb-4">
              <div className="flex items-center gap-2">
                <Music className="w-5 h-5 text-[#F472B6]" />
                <h3 className="text-lg font-bold text-[#831843]">Cấu hình nhạc nền nhật ký</h3>
              </div>
              <button
                onClick={() => setIsConfigOpen(false)}
                className="w-8 h-8 rounded-full flex items-center justify-center text-[#9C8592] hover:bg-[#FFF5F8] text-base"
              >
                ✕
              </button>
            </div>

            {configNotice && (
              <div className="mb-4 p-2.5 rounded-xl bg-[#F0FDF4] border border-[#BBF7D0] text-xs text-[#166534]">
                {configNotice}
              </div>
            )}

            <form onSubmit={handleAddCustomSong} className="space-y-3 mb-5">
              <p className="text-xs text-[#6B5562]">
                Bạn có thể thêm liên kết trực tiếp bài hát (định dạng .mp3 hoặc luồng âm thanh hợp lệ) để làm nhạc nền khi mở trang nhật ký:
              </p>

              <div>
                <label className="block text-xs font-medium text-[#4A3B43] mb-1">Tên bài hát</label>
                <input
                  type="text"
                  placeholder="Ví dụ: Dạ khúc tình xuân"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-[#FBCFE8] bg-[#FFFDFE] focus:outline-none focus:border-[#F472B6]"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#4A3B43] mb-1">Nghệ sĩ / Thể hiện</label>
                <input
                  type="text"
                  placeholder="Ví dụ: Piano Lofi"
                  value={newArtist}
                  onChange={(e) => setNewArtist(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-[#FBCFE8] bg-[#FFFDFE] focus:outline-none focus:border-[#F472B6]"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#4A3B43] mb-1">
                  Đường dẫn tệp âm thanh (URL .mp3) <span className="text-[#E11D48]">*</span>
                </label>
                <input
                  type="url"
                  required
                  placeholder="https://.../music.mp3"
                  value={newUrl}
                  onChange={(e) => setNewUrl(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-[#FBCFE8] bg-[#FFFDFE] focus:outline-none focus:border-[#F472B6]"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 px-4 rounded-xl bg-[#F472B6] hover:bg-[#EC4899] text-white text-xs font-medium transition-colors shadow-sm"
              >
                Lưu vào danh sách phát
              </button>
            </form>

            <div className="pt-3 border-t border-[#FCE7F3] flex justify-between items-center text-xs">
              <button
                type="button"
                onClick={handleResetPlaylist}
                className="text-[#9D174D] hover:underline"
              >
                Khôi phục nhạc mẫu
              </button>
              <button
                type="button"
                onClick={() => setIsConfigOpen(false)}
                className="px-4 py-1.5 rounded-lg border border-[#FBCFE8] text-[#6B5562] hover:bg-[#FFF5F8]"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
