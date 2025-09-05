import { createFileRoute } from '@tanstack/react-router'
import { UserProfileCard } from '@/components/UserProfileCard'

function ProfilePage() {
	return (
		<div className="container mx-auto p-6 space-y-6">
			<div className="text-center space-y-2">
				<h1 className="text-3xl font-bold">User Profile</h1>
				<p className="text-gray-600">
					Manage your profile information and settings.
				</p>
			</div>

			<div className="max-w-2xl mx-auto">
				<UserProfileCard />
			</div>
		</div>
	)
}

export const Route = createFileRoute('/users')({
	component: ProfilePage,
})