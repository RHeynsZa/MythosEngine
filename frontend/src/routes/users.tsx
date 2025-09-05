import { useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { UserSelector } from '@/components/UserSelector'
import { UserProfile } from '@/components/UserProfile'
import { UserForm } from '@/components/UserForm'
import { useCurrentUser } from '@/lib/user-context'
import { useCreateUser } from '@/api'
import type { User, UserCreate } from '@/types/user'

function UsersPage() {
	const { currentUser, setCurrentUser } = useCurrentUser()
	const [showCreateForm, setShowCreateForm] = useState(false)
	const [selectedUser, setSelectedUser] = useState<User | null>(currentUser)
	const createUser = useCreateUser()

	const handleUserSelect = (user: User) => {
		setSelectedUser(user)
		setCurrentUser(user)
	}

	const handleCreateUser = async (data: UserCreate) => {
		try {
			const newUser = await createUser.mutateAsync(data)
			setShowCreateForm(false)
			setSelectedUser(newUser)
			setCurrentUser(newUser)
		} catch (error) {
			console.error('Failed to create user:', error)
		}
	}

	const handleUserUpdated = (updatedUser: User) => {
		setSelectedUser(updatedUser)
		setCurrentUser(updatedUser)
	}

	const handleUserDeleted = () => {
		setSelectedUser(null)
		setCurrentUser(null)
	}

	return (
		<div className="container mx-auto p-6 space-y-6">
			<div className="text-center space-y-2">
				<h1 className="text-3xl font-bold">User Management</h1>
				<p className="text-gray-600">
					Manage user profiles and switch between different users for project management.
				</p>
			</div>

			<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
				{/* User Selection Panel */}
				<div className="space-y-4">
					<h2 className="text-xl font-semibold">Select User</h2>
					
					{showCreateForm ? (
						<UserForm
							mode="create"
							onSubmit={handleCreateUser}
							onCancel={() => setShowCreateForm(false)}
							isLoading={createUser.isPending}
						/>
					) : (
						<UserSelector
							currentUser={selectedUser}
							onUserSelect={handleUserSelect}
							onCreateUser={() => setShowCreateForm(true)}
						/>
					)}
				</div>

				{/* User Profile Panel */}
				<div className="space-y-4">
					<h2 className="text-xl font-semibold">User Profile</h2>
					
					{selectedUser ? (
						<UserProfile
							user={selectedUser}
							showActions={true}
							onUserUpdated={handleUserUpdated}
							onUserDeleted={handleUserDeleted}
						/>
					) : (
						<Card>
							<CardContent className="p-6">
								<div className="text-center text-gray-500">
									<p className="text-lg mb-2">No user selected</p>
									<p>Select a user from the left panel to view their profile.</p>
								</div>
							</CardContent>
						</Card>
					)}
				</div>
			</div>

			{/* Current User Status */}
			{currentUser && (
				<Card className="bg-blue-50 border-blue-200">
					<CardHeader>
						<CardTitle className="text-blue-800">Current User</CardTitle>
						<CardDescription className="text-blue-600">
							You are currently working as{' '}
							<strong>{currentUser.full_name || currentUser.username}</strong>.
							All new projects will be created under this user.
						</CardDescription>
					</CardHeader>
				</Card>
			)}
		</div>
	)
}

export const Route = createFileRoute('/users')({
	component: UsersPage,
})