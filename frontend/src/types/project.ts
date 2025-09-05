export interface Project {
	id: number
	name: string
	description?: string | null
	user_id: number
	created_at: string
	updated_at: string
}

export interface ProjectCreate {
	name: string
	description?: string | null
	user_id: number
}

export interface ProjectUpdate {
	name?: string
	description?: string | null
}
