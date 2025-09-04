import { Link, createFileRoute } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useState } from 'react'
import { SimpleArticleForm } from '@/components/SimpleArticleForm'

export const Route = createFileRoute('/projects/$projectId')({
  component: ProjectDetailPage,
})

// Mock data - this will be replaced with API calls later
const mockProjects: Record<string, any> = {
  '1': {
    id: '1',
    title: 'Fantasy World Builder',
    description: 'A comprehensive fantasy world with detailed lore, characters, and locations.',
    articles: [
      {
        id: '1',
        title: 'Riverdale',
        content: 'A prosperous trading town at the confluence of two major rivers...',
        type: 'Settlement',
        createdAt: '2024-01-15',
        updatedAt: '2024-01-15',
      },
      {
        id: '2',
        title: 'Sir Marcus Ironwood',
        content: 'A veteran knight of the Silver Order known for honor and tactical skill...',
        type: 'Character',
        createdAt: '2024-01-14',
        updatedAt: '2024-01-16',
      },
    ],
  },
  '2': {
    id: '2',
    title: 'Sci-Fi Universe',
    description: 'A space-faring civilization with advanced technology and complex politics.',
    articles: [
      {
        id: '3',
        title: 'The Galactic Federation',
        content: 'A political alliance spanning multiple star systems...',
        createdAt: '2024-01-10',
        updatedAt: '2024-01-12',
      },
    ],
  },
}

function ProjectDetailPage() {
  const { projectId } = Route.useParams()
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [project, setProject] = useState(mockProjects[projectId])

  if (!project) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Project Not Found</h1>
          <p className="text-muted-foreground mb-4">
            The project you're looking for doesn't exist.
          </p>
          <Button asChild>
            <Link to="/projects">Back to Projects</Link>
          </Button>
        </div>
      </div>
    )
  }

  const handleCreateArticle = (articleData: { title: string; content: string }) => {
    const newArticle = {
      id: Date.now().toString(),
      title: articleData.title,
      content: articleData.content,
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0],
    }
    
    const updatedProject = {
      ...project,
      articles: [newArticle, ...project.articles],
    }
    
    setProject(updatedProject)
    mockProjects[projectId] = updatedProject
    setShowCreateForm(false)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="mb-4">
          <Button variant="outline" asChild>
            <Link to="/projects">← Back to Projects</Link>
          </Button>
        </div>
        
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">{project.title}</h1>
            <p className="text-muted-foreground">{project.description}</p>
          </div>
          <Button onClick={() => setShowCreateForm(true)}>
            Create Article
          </Button>
        </div>
      </div>

      {showCreateForm && (
        <div className="mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Create New Article</CardTitle>
              <CardDescription>
                Add a new article to this project
              </CardDescription>
            </CardHeader>
            <CardContent>
              <SimpleArticleForm
                onSubmit={handleCreateArticle}
                onCancel={() => setShowCreateForm(false)}
              />
            </CardContent>
          </Card>
        </div>
      )}

      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Articles ({project.articles.length})</h2>
        
        {project.articles.map((article: any) => (
          <Card key={article.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <CardTitle>
                  <Link 
                    to="/articles/$articleId" 
                    params={{ articleId: article.id }}
                    className="hover:underline"
                  >
                    {article.title}
                  </Link>
                </CardTitle>
                {article.type && (
                  <Badge variant="secondary" className="ml-2">
                    {article.type}
                  </Badge>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-2 line-clamp-3">
                {article.content.substring(0, 150)}...
              </p>
              <div className="text-sm text-muted-foreground">
                <p>Created {article.createdAt}</p>
                {article.updatedAt !== article.createdAt && (
                  <p>Updated {article.updatedAt}</p>
                )}
              </div>
            </CardContent>
          </Card>
        ))}

        {project.articles.length === 0 && !showCreateForm && (
          <div className="text-center py-12">
            <h3 className="text-lg font-semibold mb-2">No articles yet</h3>
            <p className="text-muted-foreground mb-4">
              Create your first article for this project
            </p>
            <Button onClick={() => setShowCreateForm(true)}>
              Create Your First Article
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}