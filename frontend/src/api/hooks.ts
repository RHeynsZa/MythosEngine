import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { ProjectsApi } from './projects'
import { ArticlesApi } from './articles'
import { UsersApi } from './users'
import { queryKeys } from './queryKeys'
import type { Project, ProjectCreate, ProjectUpdate } from '@/types/project'
import type { Article, ArticleCreate, ArticleUpdate } from '@/types/article'
import type { User, UserCreate, UserUpdate } from '@/types/user'

// Users
export function useUsers(params?: { skip?: number; limit?: number; active_only?: boolean }) {
	return useQuery({
		queryKey: queryKeys.users.list(params),
		queryFn: () => UsersApi.list(params),
	})
}

export function useUser(userId: number) {
	return useQuery({
		queryKey: queryKeys.users.detail(userId),
		queryFn: () => UsersApi.get(userId),
		enabled: Number.isFinite(userId),
	})
}

export function useUserWithProjects(userId: number) {
	return useQuery({
		queryKey: queryKeys.users.withProjects(userId),
		queryFn: () => UsersApi.getWithProjects(userId),
		enabled: Number.isFinite(userId),
	})
}

export function useUserByUsername(username: string) {
	return useQuery({
		queryKey: queryKeys.users.byUsername(username),
		queryFn: () => UsersApi.getByUsername(username),
		enabled: Boolean(username),
	})
}

export function useCreateUser() {
	const qc = useQueryClient()
	return useMutation({
		mutationFn: (input: UserCreate) => UsersApi.create(input),
		onSuccess: () => {
			qc.invalidateQueries({ queryKey: queryKeys.users.all })
		},
	})
}

export function useUpdateUser(userId: number) {
	const qc = useQueryClient()
	return useMutation({
		mutationFn: (input: UserUpdate) => UsersApi.update(userId, input),
		onSuccess: () => {
			qc.invalidateQueries({ queryKey: queryKeys.users.detail(userId) })
			qc.invalidateQueries({ queryKey: queryKeys.users.all })
		},
	})
}

export function useDeleteUser() {
	const qc = useQueryClient()
	return useMutation({
		mutationFn: (userId: number) => UsersApi.delete(userId),
		onSuccess: () => {
			qc.invalidateQueries({ queryKey: queryKeys.users.all })
		},
	})
}

// Projects
export function useProjects(params?: { skip?: number; limit?: number; user_id?: number }) {
	return useQuery({
		queryKey: queryKeys.projects.list(params),
		queryFn: () => ProjectsApi.list(params),
	})
}

export function useProject(projectId: number) {
	return useQuery({
		queryKey: queryKeys.projects.detail(projectId),
		queryFn: () => ProjectsApi.get(projectId),
		enabled: Number.isFinite(projectId),
	})
}

export function useCreateProject() {
	const qc = useQueryClient()
	return useMutation({
		mutationFn: (input: ProjectCreate) => ProjectsApi.create(input),
		onSuccess: () => {
			qc.invalidateQueries({ queryKey: queryKeys.projects.all })
		},
	})
}

export function useUpdateProject(projectId: number) {
	const qc = useQueryClient()
	return useMutation({
		mutationFn: (input: ProjectUpdate) => ProjectsApi.update(projectId, input),
		onSuccess: () => {
			qc.invalidateQueries({ queryKey: queryKeys.projects.detail(projectId) })
			qc.invalidateQueries({ queryKey: queryKeys.projects.all })
		},
	})
}

export function useDeleteProject() {
	const qc = useQueryClient()
	return useMutation({
		mutationFn: (projectId: number) => ProjectsApi.delete(projectId),
		onSuccess: () => {
			qc.invalidateQueries({ queryKey: queryKeys.projects.all })
		},
	})
}

// Articles
export function useArticles(params?: { project_id?: number; skip?: number; limit?: number }) {
	return useQuery({
		queryKey: queryKeys.articles.list(params),
		queryFn: () => ArticlesApi.list(params),
	})
}

export function useArticle(articleId: number) {
	return useQuery({
		queryKey: queryKeys.articles.detail(articleId),
		queryFn: () => ArticlesApi.get(articleId),
		enabled: Number.isFinite(articleId),
	})
}

export function useCreateArticle() {
	const qc = useQueryClient()
	return useMutation({
		mutationFn: (input: ArticleCreate) => ArticlesApi.create(input),
		onSuccess: (_data, variables) => {
			if ('project_id' in variables && typeof variables.project_id === 'number') {
				qc.invalidateQueries({ queryKey: queryKeys.articles.list({ project_id: variables.project_id }) })
			}
			qc.invalidateQueries({ queryKey: queryKeys.articles.all })
		},
	})
}

export function useUpdateArticle(articleId: number) {
	const qc = useQueryClient()
	return useMutation({
		mutationFn: (input: ArticleUpdate) => ArticlesApi.update(articleId, input),
		onSuccess: (_data, _variables) => {
			qc.invalidateQueries({ queryKey: queryKeys.articles.detail(articleId) })
			qc.invalidateQueries({ queryKey: queryKeys.articles.all })
		},
	})
}

export function useDeleteArticle() {
	const qc = useQueryClient()
	return useMutation({
		mutationFn: (articleId: number) => ArticlesApi.delete(articleId),
		onSuccess: () => {
			qc.invalidateQueries({ queryKey: queryKeys.articles.all })
		},
	})
}
