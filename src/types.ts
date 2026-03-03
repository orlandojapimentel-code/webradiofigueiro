export interface RadioStats {
  count: number;
}

export interface SongMetadata {
  title: string;
  artist: string;
  artwork?: string;
}

export interface NewsItem {
  title: string;
  link: string;
  pubDate: string;
  source: string;
}

export interface GalleryImage {
  url: string;
  category: 'lugares' | 'eventos' | 'estudio';
}
