import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import type { User } from '@/types/user'

interface UserContextType {
	currentUser: User | null
	setCurrentUser: (user: User | null) => void
	isLoading: boolean
}

const UserContext = createContext<UserContextType | undefined>(undefined)

interface UserProviderProps {
	children: ReactNode
}

const CURRENT_USER_KEY = 'mythosengine_current_user'

export function UserProvider({ children }: UserProviderProps) {
	const [currentUser, setCurrentUserState] = useState<User | null>(null)
	const [isLoading, setIsLoading] = useState(true)

	// Load user from localStorage on mount
	useEffect(() => {
		try {
			const storedUser = localStorage.getItem(CURRENT_USER_KEY)
			if (storedUser) {
				const user = JSON.parse(storedUser)
				setCurrentUserState(user)
			}
		} catch (error) {
			console.error('Failed to load user from localStorage:', error)
			localStorage.removeItem(CURRENT_USER_KEY)
		} finally {
			setIsLoading(false)
		}
	}, [])

	const setCurrentUser = (user: User | null) => {
		setCurrentUserState(user)
		
		// Persist to localStorage
		try {
			if (user) {
				localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user))
			} else {
				localStorage.removeItem(CURRENT_USER_KEY)
			}
		} catch (error) {
			console.error('Failed to save user to localStorage:', error)
		}
	}

	return (
		<UserContext.Provider value={{ currentUser, setCurrentUser, isLoading }}>
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