import { apiClient } from './client'
import type { User, UserCreate, UserUpdate, UserWithProjects } from '@/types/user'

export const UsersApi = {
	list: (params?: { skip?: number; limit?: number; active_only?: boolean }) =>
		apiClient.get<User[]>('/users', { query: params }),

	get: (userId: number) => apiClient.get<User>(`/users/${userId}`),

	getWithProjects: (userId: number) => 
		apiClient.get<UserWithProjects>(`/users/${userId}/with-projects`),

	getByUsername: (username: string) => 
		apiClient.get<User>(`/users/by-username/${username}`),

	create: (input: UserCreate) => apiClient.post<User>('/users', input),

	update: (userId: number, input: UserUpdate) =>
		apiClient.put<User>(`/users/${userId}`, input),

	delete: (userId: number) => apiClient.delete<User>(`/users/${userId}`),
}