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

export enum ArticleVisibility {
  UNLISTED = "unlisted",  // Only visible to the writer
  PRIVATE = "private",    // Visible to everyone invited to view the project
  PUBLIC = "public"       // Open to anyone (even unauthorized users)
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
  visibility: ArticleVisibility;
  author_id: number;
  project_id: number;
  header_image_id?: number | null;
  header_image?: Image | null;
  spotify_url?: string | null;
  created_at: string;
  updated_at: string;
}

export interface ArticleCreate {
  title: string;
  content?: ArticleContent | null;
  article_type: ArticleType;
  visibility: ArticleVisibility;
  project_id: number;
  header_image_id?: number | null;
  spotify_url?: string | null;
}

export interface ArticleUpdate {
  title?: string;
  content?: ArticleContent | null;
  article_type?: ArticleType;
  visibility?: ArticleVisibility;
  header_image_id?: number | null;
  spotify_url?: string | null;
}

export interface ArticleSummary {
  id: number;
  title: string;
  article_type: ArticleType;
  visibility: ArticleVisibility;
  author_id: number;
  project_id: number;
  word_count: number;
  created_at: string;
  updated_at: string;
}

// Settlement-specific types
export enum SettlementType {
  CITY = "city",
  TOWN = "town", 
  VILLAGE = "village",
  HAMLET = "hamlet",
  METROPOLIS = "metropolis",
  CAPITAL = "capital",
  FORTRESS = "fortress",
  OUTPOST = "outpost",
  TRADING_POST = "trading_post",
  RUINS = "ruins"
}

export enum GovernmentType {
  MONARCHY = "monarchy",
  DEMOCRACY = "democracy",
  OLIGARCHY = "oligarchy",
  THEOCRACY = "theocracy",
  TRIBAL = "tribal",
  ANARCHY = "anarchy",
  COUNCIL = "council",
  DICTATORSHIP = "dictatorship"
}

export interface SettlementData {
  settlement_type: SettlementType;
  population?: number | null;
  government_type?: GovernmentType | null;
  ruler_name?: string | null;
  founded_date?: string | null;
  notable_features: string[];
  trade_goods: string[];
  defenses?: string | null;
  climate?: string | null;
  terrain?: string | null;
  wealth_level?: string | null;
  coordinates?: { lat: number; lng: number } | null;
  region?: string | null;
  nearby_settlements: string[];
  primary_industry?: string | null;
  secondary_industries: string[];
  predominant_race?: string | null;
  languages_spoken: string[];
  religions: string[];
  festivals: string[];
}

// Person-specific types
export enum Gender {
  MALE = "male",
  FEMALE = "female",
  NON_BINARY = "non_binary",
  OTHER = "other",
  UNKNOWN = "unknown"
}

export enum LifeStatus {
  ALIVE = "alive",
  DEAD = "dead",
  MISSING = "missing",
  UNKNOWN = "unknown",
  UNDEAD = "undead",
  IMMORTAL = "immortal"
}

export interface ImportantDate {
  date: string;
  event: string;
  description?: string | null;
  location?: string | null;
}

export interface Relationship {
  person_name: string;
  relationship_type: string;
  description?: string | null;
  status: string;
}

export interface PersonData {
  race?: string | null;
  gender?: Gender | null;
  age?: number | null;
  life_status: LifeStatus;
  height?: string | null;
  weight?: string | null;
  eye_color?: string | null;
  hair_color?: string | null;
  distinguishing_marks: string[];
  birthplace?: string | null;
  current_location?: string | null;
  occupation?: string | null;
  social_class?: string | null;
  birth_date?: string | null;
  death_date?: string | null;
  important_dates: ImportantDate[];
  relationships: Relationship[];
  skills: string[];
  abilities: string[];
  personality_traits: string[];
  goals: string[];
  fears: string[];
  secrets: string[];
  notable_possessions: string[];
  wealth?: string | null;
  organizations: string[];
  titles: string[];
}

// Extended article interfaces that include specialized data
export interface SettlementArticle extends Article {
  article_type: ArticleType.LOCATION;
  settlement_data?: SettlementData;
}

export interface PersonArticle extends Article {
  article_type: ArticleType.CHARACTER;
  person_data?: PersonData;
}