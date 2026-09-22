export interface NewsPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  body: string;
  category: 'Announcement' | 'Event' | 'Achievement' | 'Community';
  coverEmoji: string;
  coverImage?: string;
  author: string;
  published: boolean;
  publishedAt: string; // ISO date
  updatedAt: string; // ISO date
}

export type NewsPostDraft = Omit<NewsPost, 'id' | 'updatedAt' | 'slug'>;
