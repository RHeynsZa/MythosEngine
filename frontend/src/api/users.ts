/**
 * User API integration
 */

import type { User, UserCreate, UserUpdate, UserProfile, UserSummary } from '../types/user'

const API_BASE = '/api/v1/users'

export const usersApi = {
  // Get all users
  async getUsers(skip: number = 0, limit: number = 100): Promise<UserSummary[]> {
    const response = await fetch(`${API_BASE}?skip=${skip}&limit=${limit}`)
    if (!response.ok) {
      throw new Error('Failed to fetch users')
    }
    return response.json()
  },

  // Get user by ID
  async getUser(userId: number): Promise<User> {
    const response = await fetch(`${API_BASE}/${userId}`)
    if (!response.ok) {
      throw new Error('Failed to fetch user')
    }
    return response.json()
  },

  // Get user profile by ID
  async getUserProfile(userId: number): Promise<UserProfile> {
    const response = await fetch(`${API_BASE}/${userId}/profile`)
    if (!response.ok) {
      throw new Error('Failed to fetch user profile')
    }
    return response.json()
  },

  // Get user by username
  async getUserByUsername(username: string): Promise<User> {
    const response = await fetch(`${API_BASE}/username/${username}`)
    if (!response.ok) {
      throw new Error('Failed to fetch user')
    }
    return response.json()
  },

  // Get user profile by username
  async getUserProfileByUsername(username: string): Promise<UserProfile> {
    const response = await fetch(`${API_BASE}/username/${username}/profile`)
    if (!response.ok) {
      throw new Error('Failed to fetch user profile')
    }
    return response.json()
  },

  // Create user
  async createUser(userData: UserCreate): Promise<User> {
    const response = await fetch(API_BASE, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    })
    if (!response.ok) {
      throw new Error('Failed to create user')
    }
    return response.json()
  },

  // Update user
  async updateUser(userId: number, userData: UserUpdate): Promise<User> {
    const response = await fetch(`${API_BASE}/${userId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    })
    if (!response.ok) {
      throw new Error('Failed to update user')
    }
    return response.json()
  },

  // Delete user
  async deleteUser(userId: number): Promise<void> {
    const response = await fetch(`${API_BASE}/${userId}`, {
      method: 'DELETE',
    })
    if (!response.ok) {
      throw new Error('Failed to delete user')
    }
  },
}