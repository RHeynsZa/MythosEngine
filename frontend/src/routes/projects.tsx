import { Link, createFileRoute } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useState } from 'react'
import { ProjectForm } from '@/components/ProjectForm'

export const Route = createFileRoute('/projects')({
  component: ProjectsPage,
})

// Mock data for now - this will be replaced with API calls later
const mockProjects = [
  {
    id: '1',
    title: 'Fantasy World Builder',
    description: 'A comprehensive fantasy world with detailed lore, characters, and locations.',
    articleCount: 12,
    createdAt: '2024-01-15',
  },
  {
    id: '2',
    title: 'Sci-Fi Universe',
    description: 'A space-faring civilization with advanced technology and complex politics.',
    articleCount: 8,
    createdAt: '2024-01-10',
  },
]

function ProjectsPage() {
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [projects, setProjects] = useState(mockProjects)

  const handleCreateProject = (projectData: { title: string; description: string }) => {
    const newProject = {
      id: Date.now().toString(),
      title: projectData.title,
      description: projectData.description,
      articleCount: 0,
      createdAt: new Date().toISOString().split('T')[0],
    }
    setProjects([newProject, ...projects])
    setShowCreateForm(false)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Projects</h1>
          <p className="text-muted-foreground">Manage your creative projects and their articles</p>
        </div>
        <Button onClick={() => setShowCreateForm(true)}>
          Create Project
        </Button>
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

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {projects.map((project) => (
          <Card key={project.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle>
                <Link 
                  to="/projects/$projectId/home" 
                  params={{ projectId: project.id }}
                  className="hover:underline"
                >
                  {project.title}
                </Link>
              </CardTitle>
              <CardDescription>{project.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-muted-foreground mb-4">
                <p>{project.articleCount} articles</p>
                <p>Created {project.createdAt}</p>
              </div>
              <div className="flex gap-2">
                <Button size="sm" asChild>
                  <Link 
                    to="/projects/$projectId/home" 
                    params={{ projectId: project.id }}
                  >
                    Home
                  </Link>
                </Button>
                <Button size="sm" variant="outline" asChild>
                  <Link 
                    to="/projects/$projectId" 
                    params={{ projectId: project.id }}
                  >
                    Articles
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {projects.length === 0 && !showCreateForm && (
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