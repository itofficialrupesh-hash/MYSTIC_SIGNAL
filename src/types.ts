export interface MemoryPhoto {
  id: string;
  url: string; // can be base64 or external url
  date: string;
  caption: string;
  memoryNote?: string;
}

export interface StoryChapter {
  id: string;
  title: string;
  date: string;
  content: string;
  iconName: string; // Lucide icon identifier
}

export interface FavoriteMemory {
  id: string;
  title: string;
  description: string;
  date: string;
  emoji: string;
}

export interface OpenWhenLetter {
  id: string;
  type: 'sad' | 'angry' | 'miss' | 'apology' | 'promises' | 'surprise' | 'special';
  title: string;
  emoji: string;
  shortTeaser: string;
  letterText: string;
}

export interface LoveConfig {
  coupleNameOne: string; // The sender, e.g., "Rupesh"
  coupleNameTwo: string; // The girlfriend, e.g., "My Favorite Person"
  specialDate: string; // Default password e.g., "11-22" or "2023-11-22" or "1122"
  specialDateHint: string; // Clue e.g. "Enter the date that changed everything for us"
  bgMusicUrl: string; // Default audio stream
  promises: string[];
  reasonsWhySpecial: string[];
  profileLogoUrl?: string; // Optional custom brand logo photo URL
}
