import { apiClient } from './client'
import type { Project, ProjectCreate, ProjectUpdate } from '@/types/project'

export const ProjectsApi = {
	list: (params?: { skip?: number; limit?: number }) =>
		apiClient.get<Project[]>('/projects', { query: params }),

	get: (projectId: number) => apiClient.get<Project>(`/projects/${projectId}`),

	create: (input: ProjectCreate) => apiClient.post<Project>('/projects', input),

	update: (projectId: number, input: ProjectUpdate) =>
		apiClient.put<Project>(`/projects/${projectId}`, input),

	delete: (projectId: number) => apiClient.delete<{ message: string }>(`/projects/${projectId}`),
}
