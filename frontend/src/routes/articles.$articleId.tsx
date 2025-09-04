import { Link, createFileRoute } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useState } from 'react'
import { ArticleForm } from '@/components/ArticleForm'
import type { Article } from '@/types/article'
import { ArticleType } from '@/types/article'

export const Route = createFileRoute('/articles/$articleId')({
  component: ArticleEditPage,
})

// Mock data - this will be replaced with API calls later
const mockArticles: Record<string, Article> = {
  '1': {
    id: 1,
    title: 'The Kingdom of Eldoria',
    article_type: ArticleType.LOCATION,
    project_id: 1,
    content: {
      main_content: 'A prosperous kingdom in the northern continent, known for its fertile lands and skilled craftsmen. The kingdom is ruled by King Aldric the Wise, who has maintained peace for over two decades.',
      sidebar_content: 'Population: ~500,000\nCapital: Eldoria City\nFounded: 847 AC',
      footer_content: 'Last updated by the Royal Cartographers Guild',
      summary: 'A prosperous kingdom in the northern continent',
      tags: ['kingdom', 'location', 'fantasy'],
      metadata: {}
    },
    created_at: '2024-01-15',
    updated_at: '2024-01-15',
  },
  '2': {
    id: 2,
    title: 'Magic System Overview',
    article_type: ArticleType.LORE,
    project_id: 1,
    content: {
      main_content: 'The magic in this world is based on elemental forces. Mages must attune themselves to one of the four primary elements: Fire, Water, Earth, or Air. Advanced practitioners can learn to combine elements, but this requires years of study and practice.',
      sidebar_content: 'Elements:\n• Fire - Destruction & Energy\n• Water - Healing & Flow\n• Earth - Protection & Strength\n• Air - Movement & Communication',
      footer_content: 'Compiled by the Mage\'s College',
      summary: 'Overview of the elemental magic system',
      tags: ['magic', 'lore', 'elements'],
      metadata: {}
    },
    created_at: '2024-01-14',
    updated_at: '2024-01-16',
  },
  '3': {
    id: 3,
    title: 'The Galactic Federation',
    article_type: ArticleType.ORGANIZATION,
    project_id: 2,
    content: {
      main_content: 'A political alliance spanning multiple star systems, the Galactic Federation was formed in 2387 to maintain peace and facilitate trade between member worlds. The Federation operates under a democratic council system.',
      sidebar_content: 'Founded: 2387\nMember Worlds: 47\nHeadquarters: New Geneva Station',
      footer_content: 'Federation Archives, Department of Historical Records',
      summary: 'A political alliance spanning multiple star systems',
      tags: ['organization', 'politics', 'sci-fi'],
      metadata: {}
    },
    created_at: '2024-01-10',
    updated_at: '2024-01-12',
  },
}

function ArticleEditPage() {
  const { articleId } = Route.useParams()
  const [article, setArticle] = useState<Article | undefined>(mockArticles[articleId])
  const [isEditing, setIsEditing] = useState(false)

  if (!article) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Article Not Found</h1>
          <p className="text-muted-foreground mb-4">
            The article you're looking for doesn't exist.
          </p>
          <Button asChild>
            <Link to="/projects">Back to Projects</Link>
          </Button>
        </div>
      </div>
    )
  }

  const handleUpdateArticle = (updatedData: any) => {
    const updatedArticle = {
      ...article,
      ...updatedData,
      updated_at: new Date().toISOString().split('T')[0],
    }
    
    setArticle(updatedArticle)
    mockArticles[articleId] = updatedArticle
    setIsEditing(false)
  }

  const getProjectLink = () => {
    // This would normally come from the article data or API
    return `/projects/${article.project_id}`
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="mb-4">
          <Button variant="outline" asChild>
            <Link to={getProjectLink()}>← Back to Project</Link>
          </Button>
        </div>
        
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">{article.title}</h1>
            <div className="flex items-center gap-4 text-sm text-muted-foreground mt-2">
              <span>Type: {article.article_type.charAt(0).toUpperCase() + article.article_type.slice(1)}</span>
              <span>Created: {article.created_at}</span>
              {article.updated_at !== article.created_at && (
                <span>Updated: {article.updated_at}</span>
              )}
            </div>
          </div>
          <Button onClick={() => setIsEditing(!isEditing)}>
            {isEditing ? 'Cancel Edit' : 'Edit Article'}
          </Button>
        </div>
      </div>

      {isEditing ? (
        <Card>
          <CardHeader>
            <CardTitle>Edit Article</CardTitle>
            <CardDescription>
              Make changes to your article content
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ArticleForm
              article={article}
              onSubmit={handleUpdateArticle}
              onCancel={() => setIsEditing(false)}
            />
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 lg:grid-cols-4">
          <div className="lg:col-span-3">
            <Card>
              <CardHeader>
                <CardTitle>Content</CardTitle>
              </CardHeader>
              <CardContent className="prose prose-sm max-w-none">
                {article.content?.summary && (
                  <div className="mb-6 p-4 bg-muted rounded-lg">
                    <h3 className="text-sm font-semibold mb-2">Summary</h3>
                    <p className="text-sm">{article.content.summary}</p>
                  </div>
                )}
                
                <div className="whitespace-pre-wrap">
                  {article.content?.main_content || 'No content available.'}
                </div>

                {article.content?.footer_content && (
                  <div className="mt-6 pt-4 border-t">
                    <div className="text-sm text-muted-foreground whitespace-pre-wrap">
                      {article.content.footer_content}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="space-y-4">
            {article.content?.sidebar_content && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Details</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-sm whitespace-pre-wrap">
                    {article.content.sidebar_content}
                  </div>
                </CardContent>
              </Card>
            )}

            {article.content?.tags && article.content.tags.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Tags</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {article.content.tags.map(tag => (
                      <span
                        key={tag}
                        className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-primary/10 text-primary"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      )}
    </div>
  )
}