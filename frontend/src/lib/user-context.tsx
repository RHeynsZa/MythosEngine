import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { UsersApi } from '@/api/users'
import type { User } from '@/types/user'

interface UserContextType {
	currentUser: User | null
	setCurrentUser: (user: User) => void
	isLoading: boolean
	refreshUser: () => Promise<void>
}

const UserContext = createContext<UserContextType | undefined>(undefined)

interface UserProviderProps {
	children: ReactNode
}

const CURRENT_USER_ID_KEY = 'mythosengine_current_user_id'
const DEFAULT_USER = {
	username: 'user',
	email: 'user@mythosengine.local',
	full_name: 'Default User',
	bio: 'The main user of this MythosEngine instance',
}

export function UserProvider({ children }: UserProviderProps) {
	const [currentUser, setCurrentUserState] = useState<User | null>(null)
	const [isLoading, setIsLoading] = useState(true)

	const loadOrCreateUser = async () => {
		try {
			// First, try to get users to see if any exist
			const users = await UsersApi.list({ limit: 1, active_only: true })
			
			if (users && users.length > 0) {
				// Use the first active user
				const user = users[0]
				setCurrentUserState(user)
				localStorage.setItem(CURRENT_USER_ID_KEY, user.id.toString())
			} else {
				// No users exist, create the default user
				const newUser = await UsersApi.create(DEFAULT_USER)
				setCurrentUserState(newUser)
				localStorage.setItem(CURRENT_USER_ID_KEY, newUser.id.toString())
			}
		} catch (error) {
			console.error('Failed to load or create user:', error)
		} finally {
			setIsLoading(false)
		}
	}

	const refreshUser = async () => {
		if (currentUser) {
			try {
				const updatedUser = await UsersApi.get(currentUser.id)
				setCurrentUserState(updatedUser)
			} catch (error) {
				console.error('Failed to refresh user:', error)
			}
		}
	}

	// Load user on mount
	useEffect(() => {
		loadOrCreateUser()
	}, [])

	const setCurrentUser = (user: User) => {
		setCurrentUserState(user)
		localStorage.setItem(CURRENT_USER_ID_KEY, user.id.toString())
	}

	return (
		<UserContext.Provider value={{ currentUser, setCurrentUser, isLoading, refreshUser }}>
			{children}
		</UserContext.Provider>
	)
}

export function useCurrentUser() {
	const context = useContext(UserContext)
	if (context === undefined) {
		throw new Error('useCurrentUser must be used within a UserProvider')
	}
	return context
}