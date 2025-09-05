import { Link, createFileRoute } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useState } from 'react'
import { ProjectForm } from '@/components/ProjectForm'
import { useCreateProject, useProjects } from '@/api'
import { useCurrentUser } from '@/lib/user-context'
import type { Project, ProjectCreate } from '@/types/project'

export const Route = createFileRoute('/projects/')({
  component: ProjectsPage,
})

function formatDate(iso: string) {
  try {
    return new Date(iso).toISOString().split('T')[0]
  } catch {
    return iso
  }
}

function ProjectsPage() {
  const { currentUser } = useCurrentUser()
  const [showCreateForm, setShowCreateForm] = useState(false)
  const { data: projects, isLoading, isError, error } = useProjects({ 
    user_id: currentUser?.id 
  })
  const createProject = useCreateProject()

  const handleCreateProject = async (projectData: ProjectCreate) => {
    await createProject.mutateAsync(projectData)
    setShowCreateForm(false)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Projects</h1>
          <p className="text-muted-foreground">
            {currentUser 
              ? `Manage projects for ${currentUser.full_name || currentUser.username}`
              : 'Select a user to view their projects'
            }
          </p>
        </div>
        {currentUser && (
          <Button onClick={() => setShowCreateForm(true)}>
            Create Project
          </Button>
        )}
      </div>

      {showCreateForm && (
        <div className="mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Create New Project</CardTitle>
              <CardDescription>
                Start a new project to organize your articles and content
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ProjectForm
                onSubmit={handleCreateProject}
                onCancel={() => setShowCreateForm(false)}
              />
            </CardContent>
          </Card>
        </div>
      )}

      {isLoading && (
        <div className="text-center py-12 text-muted-foreground">Loading projects...</div>
      )}

      {isError && (
        <div className="text-center py-12 text-destructive">{(error as any)?.message ?? 'Failed to load projects'}</div>
      )}

      {!isLoading && !isError && (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {(projects ?? []).map((project: Project) => (
            <Card key={project.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle>
                  <Link 
                    to="/projects/$projectId" 
                    params={{ projectId: String(project.id) }}
                    className="hover:underline"
                  >
                    {project.name}
                  </Link>
                </CardTitle>
                <CardDescription>{project.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-muted-foreground">
                  {/* Article count not provided by API yet */}
                  {/* <p>{project.articleCount} articles</p> */}
                  <p>Created {formatDate(project.created_at)}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {!currentUser && !isLoading && (
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold mb-2">No user selected</h2>
          <p className="text-muted-foreground mb-4">
            Please select a user from the Users page to view their projects
          </p>
          <Link to="/users">
            <Button>Go to Users</Button>
          </Link>
        </div>
      )}

      {currentUser && (!projects || projects.length === 0) && !showCreateForm && !isLoading && !isError && (
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold mb-2">No projects yet</h2>
          <p className="text-muted-foreground mb-4">
            Create your first project to start organizing your content
          </p>
          <Button onClick={() => setShowCreateForm(true)}>
            Create Your First Project
          </Button>
        </div>
      )}
    </div>
  )
}
