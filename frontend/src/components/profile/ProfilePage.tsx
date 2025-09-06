/**
 * Profile page component - shows the current user's profile
 */

import { useQuery } from '@tanstack/react-query'
import { usersApi } from '../../api/users'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import { Button } from '../ui/button'
import { Edit, FileText, FolderOpen, Calendar } from 'lucide-react'

// For now, we'll use a mock current user ID since we don't have auth yet
const CURRENT_USER_ID = 1

export default function ProfilePage() {
  const { data: profile, isLoading, error } = useQuery({
    queryKey: ['userProfile', CURRENT_USER_ID],
    queryFn: () => usersApi.getUserProfile(CURRENT_USER_ID),
  })

  if (isLoading) {
    return (
      <div className="container mx-auto py-8">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
        </div>
      </div>
    )
  }

  if (error || !profile) {
    return (
      <div className="container mx-auto py-8">
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-red-500">
              Failed to load profile. Please try again later.
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  return (
    <div className="container mx-auto py-8 space-y-6">
      {/* Profile Header */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-4">
              <Avatar className="h-20 w-20">
                <AvatarImage src={profile.avatar_url || undefined} alt={profile.display_name} />
                <AvatarFallback className="text-lg">
                  {getInitials(profile.display_name)}
                </AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-2xl">{profile.display_name}</CardTitle>
                <CardDescription className="text-lg">@{profile.username}</CardDescription>
                {profile.bio && (
                  <p className="mt-2 text-sm text-gray-600 max-w-md">{profile.bio}</p>
                )}
              </div>
            </div>
            <Button variant="outline" size="sm">
              <Edit className="h-4 w-4 mr-2" />
              Edit Profile
            </Button>
          </div>
        </CardHeader>
      </Card>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Articles Written</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{profile.article_count}</div>
            <p className="text-xs text-muted-foreground">Total articles authored</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Projects Owned</CardTitle>
            <FolderOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{profile.project_count}</div>
            <p className="text-xs text-muted-foreground">Projects you own</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Member Since</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {new Date(profile.created_at).toLocaleDateString('en-US', { 
                month: 'short', 
                year: 'numeric' 
              })}
            </div>
            <p className="text-xs text-muted-foreground">Account created</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>Your latest articles and projects</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-gray-500">
            <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Recent activity will be displayed here</p>
            <p className="text-sm">Create your first article or project to get started</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}