export type CharacterCategory = 'tat-ca' | 'hien-dai' | 'co-dai' | 'dan-quoc' | 'hoc-duong' | 'khac' | 'yeu-thich';

export interface Character {
  id: string;
  name: string;
  avatar: string;
  category: 'hien-dai' | 'co-dai' | 'dan-quoc' | 'hoc-duong' | 'khac';
  shortBio: string;
  description: string;
  quote?: string;
  ellipsusUrl?: string;
  ggaiUrl?: string;
  status: string; // e.g., "Đang mở cốt truyện", "Đang nhập vai", "Bản thảo mới"
  tags?: string[];
  createdAt: string;
  isSample?: boolean;
}

export interface SongTrack {
  id: string;
  title: string;
  artist: string;
  url: string;
}
