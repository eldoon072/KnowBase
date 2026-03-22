export const knowledgeTypes = ["article", "video", "image", "podcast", "text"] as const;

export type KnowledgeType = (typeof knowledgeTypes)[number];

export interface KnowledgeItemBase<T extends KnowledgeType> {
  id: string;
  type: T;
  title: string;
  summary: string;
  content?: string;
  quote?: string;
  sourceUrl?: string;
  thumbnailUrl?: string;
  tags: string[];
  domain?: string;
  category?: string;
  folder?: string;
  isFavorite?: boolean;
  lastViewedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ArticleItem extends KnowledgeItemBase<"article"> {
  author?: string;
  readingMinutes?: number;
}

export interface VideoItem extends KnowledgeItemBase<"video"> {
  platform?: "YouTube" | "Bilibili" | "Vimeo" | "Other";
  duration?: string;
}

export interface ImageItem extends KnowledgeItemBase<"image"> {
  width?: number;
  height?: number;
  altText?: string;
}

export interface PodcastItem extends KnowledgeItemBase<"podcast"> {
  showName?: string;
  episode?: string;
  duration?: string;
}

export interface TextItem extends KnowledgeItemBase<"text"> {
  content: string;
}

export type KnowledgeItem = ArticleItem | VideoItem | ImageItem | PodcastItem | TextItem;

export type KnowledgeGroup = Record<KnowledgeType, KnowledgeItem[]>;
