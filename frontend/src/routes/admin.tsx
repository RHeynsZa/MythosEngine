import { useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { UserForm } from '@/components/UserForm'
import { useUsers, useCreateUser, useUpdateUser, useDeleteUser } from '@/api'
import { useCurrentUser } from '@/lib/user-context'
import type { User, UserCreate, UserUpdate } from '@/types/user'

function AdminPage() {
	const { currentUser, setCurrentUser } = useCurrentUser()
	const [showCreateForm, setShowCreateForm] = useState(false)
	const [editingUser, setEditingUser] = useState<User | null>(null)
	
	const { data: users, isLoading, error } = useUsers({ active_only: false })
	const createUser = useCreateUser()
	const updateUser = useUpdateUser(editingUser?.id || 0)
	const deleteUser = useDeleteUser()

	const handleCreateUser = async (data: UserCreate) => {
		try {
			await createUser.mutateAsync(data)
			setShowCreateForm(false)
		} catch (error) {
			console.error('Failed to create user:', error)
		}
	}

	const handleUpdateUser = async (data: UserUpdate) => {
		if (!editingUser) return
		
		try {
			const updatedUser = await updateUser.mutateAsync(data)
			setEditingUser(null)
			
			// If we updated the current user, refresh the context
			if (currentUser && editingUser.id === currentUser.id) {
				setCurrentUser(updatedUser)
			}
		} catch (error) {
			console.error('Failed to update user:', error)
		}
	}

	const handleDeleteUser = async (user: User) => {
		if (user.id === currentUser?.id) {
			alert('Cannot delete the current user')
			return
		}
		
		if (window.confirm(`Are you sure you want to delete user "${user.username}"? This action cannot be undone.`)) {
			try {
				await deleteUser.mutateAsync(user.id)
			} catch (error) {
				console.error('Failed to delete user:', error)
			}
		}
	}

	const handleSwitchToUser = (user: User) => {
		setCurrentUser(user)
	}

	return (
		<div className="container mx-auto p-6 space-y-6">
			<div className="text-center space-y-2">
				<h1 className="text-3xl font-bold">Admin - User Management</h1>
				<p className="text-gray-600">
					Administrative interface for managing all users in the system.
				</p>
			</div>

			{/* Create User Form */}
			{showCreateForm && (
				<Card>
					<CardHeader>
						<CardTitle>Create New User</CardTitle>
						<CardDescription>Add a new user to the system.</CardDescription>
					</CardHeader>
					<CardContent>
						<UserForm
							mode="create"
							onSubmit={handleCreateUser}
							onCancel={() => setShowCreateForm(false)}
							isLoading={createUser.isPending}
						/>
					</CardContent>
				</Card>
			)}

			{/* Edit User Form */}
			{editingUser && (
				<Card>
					<CardHeader>
						<CardTitle>Edit User</CardTitle>
						<CardDescription>Update user information.</CardDescription>
					</CardHeader>
					<CardContent>
						<UserForm
							user={editingUser}
							mode="edit"
							onSubmit={handleUpdateUser}
							onCancel={() => setEditingUser(null)}
							isLoading={updateUser.isPending}
						/>
					</CardContent>
				</Card>
			)}

			{/* Users List */}
			<Card>
				<CardHeader className="flex flex-row items-center justify-between">
					<div>
						<CardTitle>All Users</CardTitle>
						<CardDescription>Manage all users in the system.</CardDescription>
					</div>
					{!showCreateForm && !editingUser && (
						<Button onClick={() => setShowCreateForm(true)}>
							Create User
						</Button>
					)}
				</CardHeader>
				<CardContent>
					{isLoading && (
						<div className="text-center py-8">Loading users...</div>
					)}

					{error && (
						<div className="text-center py-8 text-red-600">Failed to load users</div>
					)}

					{users && users.length > 0 && (
						<div className="space-y-4">
							{users.map((user) => (
								<div
									key={user.id}
									className={`p-4 border rounded-lg ${
										currentUser?.id === user.id 
											? 'border-blue-500 bg-blue-50' 
											: 'border-gray-200'
									}`}
								>
									<div className="flex items-center gap-4">
										{user.avatar_url && (
											<img
												src={user.avatar_url}
												alt={`${user.username}'s avatar`}
												className="w-12 h-12 rounded-full object-cover"
											/>
										)}
										<div className="flex-1">
											<div className="flex items-center gap-2 mb-1">
												<h3 className="font-medium">
													{user.full_name || user.username}
												</h3>
												<Badge variant={user.is_active ? 'default' : 'secondary'} size="sm">
													{user.is_active ? 'Active' : 'Inactive'}
												</Badge>
												{currentUser?.id === user.id && (
													<Badge variant="outline" size="sm">Current</Badge>
												)}
											</div>
											<p className="text-sm text-gray-600">@{user.username} • {user.email}</p>
											{user.bio && (
												<p className="text-sm text-gray-500 mt-1 line-clamp-2">
													{user.bio}
												</p>
											)}
										</div>
										<div className="flex gap-2">
											{currentUser?.id !== user.id && (
												<Button
													size="sm"
													variant="outline"
													onClick={() => handleSwitchToUser(user)}
												>
													Switch To
												</Button>
											)}
											<Button
												size="sm"
												variant="outline"
												onClick={() => setEditingUser(user)}
											>
												Edit
											</Button>
											<Button
												size="sm"
												variant="destructive"
												onClick={() => handleDeleteUser(user)}
												disabled={currentUser?.id === user.id || deleteUser.isPending}
											>
												Delete
											</Button>
										</div>
									</div>
								</div>
							))}
						</div>
					)}

					{users && users.length === 0 && !isLoading && (
						<div className="text-center py-8 text-gray-500">
							<p>No users found.</p>
						</div>
					)}
				</CardContent>
			</Card>

			{/* Current User Status */}
			{currentUser && (
				<Card className="bg-blue-50 border-blue-200">
					<CardHeader>
						<CardTitle className="text-blue-800">Current Active User</CardTitle>
						<CardDescription className="text-blue-600">
							The system is currently operating as{' '}
							<strong>{currentUser.full_name || currentUser.username}</strong>.
							All new projects and content will be associated with this user.
						</CardDescription>
					</CardHeader>
				</Card>
			)}
		</div>
	)
}

export const Route = createFileRoute('/admin')({
	component: AdminPage,
})