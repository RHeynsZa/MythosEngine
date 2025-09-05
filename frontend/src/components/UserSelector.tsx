import { useState } from 'react'
import { Button } from './ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Badge } from './ui/badge'
import { useUsers } from '@/api'
import type { User } from '@/types/user'

interface UserSelectorProps {
	currentUser?: User | null
	onUserSelect: (user: User) => void
	onCreateUser?: () => void
}

export function UserSelector({ currentUser, onUserSelect, onCreateUser }: UserSelectorProps) {
	const [selectedUserId, setSelectedUserId] = useState<number | null>(currentUser?.id || null)
	const { data: users, isLoading, error } = useUsers({ active_only: true })

	const handleUserSelect = (user: User) => {
		setSelectedUserId(user.id)
		onUserSelect(user)
	}

	if (isLoading) {
		return (
			<Card>
				<CardContent className="p-6">
					<div className="text-center">Loading users...</div>
				</CardContent>
			</Card>
		)
	}

	if (error) {
		return (
			<Card>
				<CardContent className="p-6">
					<div className="text-center text-red-600">Failed to load users</div>
				</CardContent>
			</Card>
		)
	}

	return (
		<Card>
			<CardHeader>
				<CardTitle>Select User</CardTitle>
				<CardDescription>
					Choose a user to work with their projects, or create a new user.
				</CardDescription>
			</CardHeader>
			<CardContent className="space-y-4">
				{users && users.length > 0 ? (
					<div className="grid gap-2">
						{users.map((user) => (
							<div
								key={user.id}
								className={`p-3 border rounded-lg cursor-pointer transition-colors hover:bg-gray-50 ${
									selectedUserId === user.id
										? 'border-blue-500 bg-blue-50'
										: 'border-gray-200'
								}`}
								onClick={() => handleUserSelect(user)}
							>
								<div className="flex items-center gap-3">
									{user.avatar_url && (
										<img
											src={user.avatar_url}
											alt={`${user.username}'s avatar`}
											className="w-10 h-10 rounded-full object-cover"
										/>
									)}
									<div className="flex-1">
										<div className="flex items-center gap-2">
											<h3 className="font-medium">
												{user.full_name || user.username}
											</h3>
											<Badge variant={user.is_active ? 'default' : 'secondary'} size="sm">
												{user.is_active ? 'Active' : 'Inactive'}
											</Badge>
										</div>
										<p className="text-sm text-gray-600">@{user.username}</p>
										{user.bio && (
											<p className="text-sm text-gray-500 mt-1 line-clamp-2">
												{user.bio}
											</p>
										)}
									</div>
									{selectedUserId === user.id && (
										<div className="text-blue-500">
											<svg
												className="w-5 h-5"
												fill="currentColor"
												viewBox="0 0 20 20"
											>
												<path
													fillRule="evenodd"
													d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
													clipRule="evenodd"
												/>
											</svg>
										</div>
									)}
								</div>
							</div>
						))}
					</div>
				) : (
					<div className="text-center text-gray-500 py-8">
						<p>No users found.</p>
					</div>
				)}

				{onCreateUser && (
					<div className="pt-4 border-t">
						<Button onClick={onCreateUser} className="w-full" variant="outline">
							Create New User
						</Button>
					</div>
				)}
			</CardContent>
		</Card>
	)
}