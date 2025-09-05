import { useState } from 'react'
import { Button } from './ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { UserForm } from './UserForm'
import { useCurrentUser } from '@/lib/user-context'
import { useUpdateUser } from '@/api'
import type { UserUpdate } from '@/types/user'

export function UserProfileCard() {
	const { currentUser, refreshUser } = useCurrentUser()
	const [isEditing, setIsEditing] = useState(false)
	const updateUser = useUpdateUser(currentUser?.id || 0)

	const handleUpdateUser = async (data: UserUpdate) => {
		if (!currentUser) return
		
		try {
			await updateUser.mutateAsync(data)
			await refreshUser()
			setIsEditing(false)
		} catch (error) {
			console.error('Failed to update user:', error)
		}
	}

	if (!currentUser) {
		return (
			<Card>
				<CardContent className="p-6">
					<div className="text-center text-gray-500">Loading user profile...</div>
				</CardContent>
			</Card>
		)
	}

	if (isEditing) {
		return (
			<UserForm
				user={currentUser}
				mode="edit"
				onSubmit={handleUpdateUser}
				onCancel={() => setIsEditing(false)}
				isLoading={updateUser.isPending}
			/>
		)
	}

	return (
		<Card>
			<CardHeader className="flex flex-row items-start gap-4">
				{currentUser.avatar_url && (
					<img
						src={currentUser.avatar_url}
						alt={`${currentUser.username}'s avatar`}
						className="w-16 h-16 rounded-full object-cover"
					/>
				)}
				<div className="flex-1 space-y-2">
					<CardTitle className="text-2xl">{currentUser.full_name || currentUser.username}</CardTitle>
					<CardDescription className="text-lg">@{currentUser.username}</CardDescription>
					<CardDescription>{currentUser.email}</CardDescription>
				</div>
			</CardHeader>
			
			<CardContent className="space-y-4">
				{currentUser.bio && (
					<div>
						<h3 className="font-semibold mb-2">Bio</h3>
						<p className="text-gray-700 whitespace-pre-wrap">{currentUser.bio}</p>
					</div>
				)}

				<div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
					<div>
						<span className="font-medium">Joined:</span>{' '}
						{new Date(currentUser.created_at).toLocaleDateString()}
					</div>
					<div>
						<span className="font-medium">Last updated:</span>{' '}
						{new Date(currentUser.updated_at).toLocaleDateString()}
					</div>
				</div>

				<div className="pt-4">
					<Button
						onClick={() => setIsEditing(true)}
						disabled={updateUser.isPending}
					>
						Edit Profile
					</Button>
				</div>
			</CardContent>
		</Card>
	)
}