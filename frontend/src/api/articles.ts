import { apiClient } from './client'
import type { Article, ArticleCreate, ArticleUpdate } from '@/types/article'

export const ArticlesApi = {
	list: (params?: { project_id?: number; skip?: number; limit?: number }) =>
		apiClient.get<Article[]>('/articles', { query: params }),

	get: (articleId: number) => apiClient.get<Article>(`/articles/${articleId}`),

	create: (input: ArticleCreate) => apiClient.post<Article>('/articles', input),

	update: (articleId: number, input: ArticleUpdate) =>
		apiClient.put<Article>(`/articles/${articleId}`, input),

	delete: (articleId: number) => apiClient.delete<{ message: string }>(`/articles/${articleId}`),
}
