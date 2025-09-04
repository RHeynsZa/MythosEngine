/**
 * TypeScript types for Article domain objects
 * These types match the backend API schemas
 */

export enum ArticleType {
  GENERAL = "general",
  CHARACTER = "character", 
  LOCATION = "location",
  ITEM = "item",
  LORE = "lore",
  EVENT = "event",
  ORGANIZATION = "organization"
}

export interface ArticleContent {
  main_content?: string | null;
  sidebar_content?: string | null;
  footer_content?: string | null;
  summary?: string | null;
  tags: string[];
  metadata: Record<string, any>;
}

export interface Image {
  id: number;
  filename: string;
  original_filename: string;
  alt_text?: string | null;
  file_path: string;
  file_size: number;
  mime_type: string;
  width?: number | null;
  height?: number | null;
  is_s3_stored: boolean;
  s3_bucket?: string | null;
  project_id: number;
  created_at: string;
  updated_at: string;
}

export interface Article {
  id: number;
  title: string;
  content?: ArticleContent | null;
  article_type: ArticleType;
  project_id: number;
  header_image_id?: number | null;
  header_image?: Image | null;
  created_at: string;
  updated_at: string;
}

export interface ArticleCreate {
  title: string;
  content?: ArticleContent | null;
  article_type: ArticleType;
  project_id: number;
  header_image_id?: number | null;
}

export interface ArticleUpdate {
  title?: string;
  content?: ArticleContent | null;
  article_type?: ArticleType;
  header_image_id?: number | null;
}

export interface ArticleSummary {
  id: number;
  title: string;
  article_type: ArticleType;
  project_id: number;
  word_count: number;
  created_at: string;
  updated_at: string;
}