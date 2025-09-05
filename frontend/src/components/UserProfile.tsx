import { useState } from 'react'
import { Button } from './ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Badge } from './ui/badge'
import { UserForm } from './UserForm'
import { useUpdateUser, useDeleteUser } from '@/api'
import type { User, UserUpdate } from '@/types/user'

interface UserProfileProps {
	user: User
	showActions?: boolean
	onUserUpdated?: (user: User) => void
	onUserDeleted?: () => void
}

export function UserProfile({ user, showActions = false, onUserUpdated, onUserDeleted }: UserProfileProps) {
	const [isEditing, setIsEditing] = useState(false)
	const updateUser = useUpdateUser(user.id)
	const deleteUser = useDeleteUser()

	const handleUpdateUser = async (data: UserUpdate) => {
		try {
			const updatedUser = await updateUser.mutateAsync(data)
			setIsEditing(false)
			onUserUpdated?.(updatedUser)
		} catch (error) {
			console.error('Failed to update user:', error)
		}
	}

	const handleDeleteUser = async () => {
		if (window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
			try {
				await deleteUser.mutateAsync(user.id)
				onUserDeleted?.()
			} catch (error) {
				console.error('Failed to delete user:', error)
			}
		}
	}

	if (isEditing) {
		return (
			<UserForm
				user={user}
				mode="edit"
				onSubmit={handleUpdateUser}
				onCancel={() => setIsEditing(false)}
				isLoading={updateUser.isPending}
			/>
		)
	}

	return (
		<Card className="w-full max-w-2xl mx-auto">
			<CardHeader className="flex flex-row items-start gap-4">
				{user.avatar_url && (
					<img
						src={user.avatar_url}
						alt={`${user.username}'s avatar`}
						className="w-16 h-16 rounded-full object-cover"
					/>
				)}
				<div className="flex-1 space-y-2">
					<div className="flex items-center gap-2">
						<CardTitle className="text-2xl">{user.full_name || user.username}</CardTitle>
						<Badge variant={user.is_active ? 'default' : 'secondary'}>
							{user.is_active ? 'Active' : 'Inactive'}
						</Badge>
					</div>
					<CardDescription className="text-lg">@{user.username}</CardDescription>
					<CardDescription>{user.email}</CardDescription>
				</div>
			</CardHeader>
			
			<CardContent className="space-y-4">
				{user.bio && (
					<div>
						<h3 className="font-semibold mb-2">Bio</h3>
						<p className="text-gray-700 whitespace-pre-wrap">{user.bio}</p>
					</div>
				)}

				<div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
					<div>
						<span className="font-medium">Joined:</span>{' '}
						{new Date(user.created_at).toLocaleDateString()}
					</div>
					<div>
						<span className="font-medium">Last updated:</span>{' '}
						{new Date(user.updated_at).toLocaleDateString()}
					</div>
				</div>

				{showActions && (
					<div className="flex gap-2 pt-4">
						<Button
							onClick={() => setIsEditing(true)}
							disabled={updateUser.isPending}
						>
							Edit Profile
						</Button>
						<Button
							variant="destructive"
							onClick={handleDeleteUser}
							disabled={deleteUser.isPending}
						>
							{deleteUser.isPending ? 'Deleting...' : 'Delete User'}
						</Button>
					</div>
				)}
			</CardContent>
		</Card>
	)
}