/**
 * TypeScript types for User domain objects
 * These types match the backend API schemas
 */

export interface User {
  id: number;
  username: string;
  email: string;
  display_name: string;
  bio?: string | null;
  avatar_url?: string | null;
  created_at: string;
  updated_at: string;
}

export interface UserCreate {
  username: string;
  email: string;
  display_name: string;
  bio?: string | null;
  avatar_url?: string | null;
}

export interface UserUpdate {
  display_name?: string;
  bio?: string | null;
  avatar_url?: string | null;
}

export interface UserProfile {
  id: number;
  username: string;
  display_name: string;
  bio?: string | null;
  avatar_url?: string | null;
  created_at: string;
  article_count: number;
  project_count: number;
}

export interface UserSummary {
  id: number;
  username: string;
  display_name: string;
  avatar_url?: string | null;
  article_count: number;
}