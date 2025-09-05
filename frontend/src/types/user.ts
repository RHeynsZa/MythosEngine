export interface User {
	id: number
	username: string
	email: string
	full_name?: string | null
	bio?: string | null
	avatar_url?: string | null
	is_active: boolean
	created_at: string
	updated_at: string
}

export interface UserCreate {
	username: string
	email: string
	full_name?: string | null
	bio?: string | null
	avatar_url?: string | null
}

export interface UserUpdate {
	username?: string
	email?: string
	full_name?: string | null
	bio?: string | null
	avatar_url?: string | null
	is_active?: boolean
}

export interface UserWithProjects extends User {
	projects: Project[]
}

// Import Project type from project.ts
import type { Project } from './project'