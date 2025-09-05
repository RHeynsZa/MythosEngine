export const queryKeys = {
	users: {
		all: ['users'] as const,
		list: (params?: { skip?: number; limit?: number; active_only?: boolean }) => ['users', 'list', params ?? {}] as const,
		detail: (userId: number) => ['users', 'detail', userId] as const,
		withProjects: (userId: number) => ['users', 'with-projects', userId] as const,
		byUsername: (username: string) => ['users', 'by-username', username] as const,
	},
	projects: {
		all: ['projects'] as const,
		list: (params?: { skip?: number; limit?: number; user_id?: number }) => ['projects', 'list', params ?? {}] as const,
		detail: (projectId: number) => ['projects', 'detail', projectId] as const,
	},
	articles: {
		all: ['articles'] as const,
		list: (params?: { project_id?: number; skip?: number; limit?: number }) => ['articles', 'list', params ?? {}] as const,
		detail: (articleId: number) => ['articles', 'detail', articleId] as const,
	},
}
