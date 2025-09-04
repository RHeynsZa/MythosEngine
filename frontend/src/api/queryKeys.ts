export const queryKeys = {
	projects: {
		all: ['projects'] as const,
		list: (params?: { skip?: number; limit?: number }) => ['projects', 'list', params ?? {}] as const,
		detail: (projectId: number) => ['projects', 'detail', projectId] as const,
	},
	articles: {
		all: ['articles'] as const,
		list: (params?: { project_id?: number; skip?: number; limit?: number }) => ['articles', 'list', params ?? {}] as const,
		detail: (articleId: number) => ['articles', 'detail', articleId] as const,
	},
}
