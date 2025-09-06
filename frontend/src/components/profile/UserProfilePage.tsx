/**
 * User profile page component - shows another user's public profile
 */

import { useQuery } from '@tanstack/react-query'
import { useParams } from '@tanstack/react-router'
import { usersApi } from '../../api/users'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import { Badge } from '../ui/badge'
import { FileText, FolderOpen, User } from 'lucide-react'

export default function UserProfilePage() {
  const { username } = useParams({ from: '/profile/$username' })
  
  const { data: profile, isLoading, error } = useQuery({
    queryKey: ['userProfile', username],
    queryFn: () => usersApi.getUserProfileByUsername(username),
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
            <div className="text-center">
              <User className="h-16 w-16 mx-auto mb-4 text-gray-400" />
              <h2 className="text-2xl font-bold mb-2">User Not Found</h2>
              <p className="text-gray-600">
                The user "@{username}" could not be found.
              </p>
            </div>
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
          <div className="flex items-start space-x-4">
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
              <div className="mt-3">
                <Badge variant="secondary">
                  Member since {new Date(profile.created_at).toLocaleDateString('en-US', { 
                    month: 'long', 
                    year: 'numeric' 
                  })}
                </Badge>
              </div>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Articles Written</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{profile.article_count}</div>
            <p className="text-xs text-muted-foreground">Published articles</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Projects</CardTitle>
            <FolderOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{profile.project_count}</div>
            <p className="text-xs text-muted-foreground">Public projects</p>
          </CardContent>
        </Card>
      </div>

      {/* Public Articles */}
      <Card>
        <CardHeader>
          <CardTitle>Public Articles</CardTitle>
          <CardDescription>Articles published by {profile.display_name}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-gray-500">
            <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No public articles yet</p>
            <p className="text-sm">Check back later for new content</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}