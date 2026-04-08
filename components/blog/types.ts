export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt?: string;
  content: string;
  category: string;
  imageUrl?: string;
  backdropImages: string[];
  tags: string[];
  featured: boolean;
  readTime: number;
  status: 'Published' | 'Draft' | 'Scheduled';
  publishedDate?: string;
  createdDate: string;
  views: number;
  engagement: number;
  author?: { id: string; name: string; image?: string };
}
