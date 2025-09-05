import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { Textarea } from './ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import type { User, UserCreate, UserUpdate } from '@/types/user'

interface UserFormProps {
	user?: User
	onSubmit: (data: UserCreate | UserUpdate) => void
	onCancel?: () => void
	isLoading?: boolean
	mode: 'create' | 'edit'
}

type FormData = {
	username: string
	email: string
	full_name: string
	bio: string
	avatar_url: string
}

export function UserForm({ user, onSubmit, onCancel, isLoading, mode }: UserFormProps) {
	const {
		register,
		handleSubmit,
		formState: { errors, isValid },
		reset,
	} = useForm<FormData>({
		defaultValues: {
			username: user?.username || '',
			email: user?.email || '',
			full_name: user?.full_name || '',
			bio: user?.bio || '',
			avatar_url: user?.avatar_url || '',
		},
		mode: 'onChange',
	})

	const onFormSubmit = (data: FormData) => {
		const submitData = {
			username: data.username,
			email: data.email,
			full_name: data.full_name || null,
			bio: data.bio || null,
			avatar_url: data.avatar_url || null,
		}
		onSubmit(submitData)
	}

	return (
		<Card className="w-full max-w-2xl mx-auto">
			<CardHeader>
				<CardTitle>
					{mode === 'create' ? 'Create New User' : 'Edit User Profile'}
				</CardTitle>
				<CardDescription>
					{mode === 'create' 
						? 'Fill in the details to create a new user profile.'
						: 'Update your profile information below.'
					}
				</CardDescription>
			</CardHeader>
			<CardContent>
				<form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						<div className="space-y-2">
							<Label htmlFor="username">Username *</Label>
							<Input
								id="username"
								{...register('username', {
									required: 'Username is required',
									minLength: {
										value: 3,
										message: 'Username must be at least 3 characters',
									},
									maxLength: {
										value: 50,
										message: 'Username must be less than 50 characters',
									},
								})}
								placeholder="Enter username"
							/>
							{errors.username && (
								<p className="text-sm text-red-600">{errors.username.message}</p>
							)}
						</div>

						<div className="space-y-2">
							<Label htmlFor="email">Email *</Label>
							<Input
								id="email"
								type="email"
								{...register('email', {
									required: 'Email is required',
									pattern: {
										value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
										message: 'Invalid email address',
									},
								})}
								placeholder="Enter email address"
							/>
							{errors.email && (
								<p className="text-sm text-red-600">{errors.email.message}</p>
							)}
						</div>
					</div>

					<div className="space-y-2">
						<Label htmlFor="full_name">Full Name</Label>
						<Input
							id="full_name"
							{...register('full_name', {
								maxLength: {
									value: 100,
									message: 'Full name must be less than 100 characters',
								},
							})}
							placeholder="Enter your full name"
						/>
						{errors.full_name && (
							<p className="text-sm text-red-600">{errors.full_name.message}</p>
						)}
					</div>

					<div className="space-y-2">
						<Label htmlFor="avatar_url">Avatar URL</Label>
						<Input
							id="avatar_url"
							type="url"
							{...register('avatar_url')}
							placeholder="https://example.com/avatar.jpg"
						/>
						{errors.avatar_url && (
							<p className="text-sm text-red-600">{errors.avatar_url.message}</p>
						)}
					</div>

					<div className="space-y-2">
						<Label htmlFor="bio">Bio</Label>
						<Textarea
							id="bio"
							{...register('bio', {
								maxLength: {
									value: 1000,
									message: 'Bio must be less than 1000 characters',
								},
							})}
							placeholder="Tell us about yourself..."
							rows={4}
						/>
						{errors.bio && (
							<p className="text-sm text-red-600">{errors.bio.message}</p>
						)}
					</div>

					<div className="flex gap-4 pt-4">
						<Button
							type="submit"
							disabled={!isValid || isLoading}
							className="flex-1"
						>
							{isLoading ? 'Saving...' : mode === 'create' ? 'Create User' : 'Update Profile'}
						</Button>
						{onCancel && (
							<Button
								type="button"
								variant="outline"
								onClick={onCancel}
								disabled={isLoading}
							>
								Cancel
							</Button>
						)}
					</div>
				</form>
			</CardContent>
		</Card>
	)
}