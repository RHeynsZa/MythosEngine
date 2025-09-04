import { Link, createFileRoute } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

export const Route = createFileRoute('/projects/$projectId/home')({
  component: ProjectHomePage,
})

// Mock data - this will be replaced with API calls later
const mockProjects: Record<string, any> = {
  '1': {
    id: '1',
    title: 'Fantasy World Builder',
    description: 'A comprehensive fantasy world with detailed lore, characters, and locations.',
    headerImage: '/images/landing-hero.webp',
    homeContent: {
      main_content: `Welcome to the Fantasy World Builder project! This is your central hub for managing all aspects of your fantasy universe.

This project serves as a comprehensive repository for all the lore, characters, locations, and stories that make up your fantasy world. Whether you're building a world for a novel, a tabletop RPG campaign, or just for the joy of creation, this project will help you keep everything organized and interconnected.

## Getting Started

Your world is already taking shape with several key elements:

### Locations
Explore the various settlements, landmarks, and regions that make up your world. Each location is carefully documented with its history, culture, and significance to the broader narrative.

### Characters  
Meet the inhabitants of your world, from heroic protagonists to complex villains, each with their own backstories, motivations, and roles in your narrative.

### Lore & History
Dive deep into the rich history and mythology that forms the foundation of your world. Understanding the past helps shape the present and future of your stories.

## What's Next?

Continue building your world by adding new articles, expanding existing content, and creating connections between different elements. The beauty of worldbuilding lies in how all the pieces fit together to create something greater than the sum of its parts.`,
      sidebar_content: 'This project contains the foundational elements of your fantasy universe. Use the navigation to explore different aspects of your world.',
      summary: 'Central hub for your fantasy worldbuilding project'
    },
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
    stats: {
      totalArticles: 12,
      characters: 4,
      locations: 5,
      loreEntries: 3,
      lastUpdated: '2024-01-16'
    }
  },
  '2': {
    id: '2',
    title: 'Sci-Fi Universe',
    description: 'A space-faring civilization with advanced technology and complex politics.',
    headerImage: '/images/landing-hero.webp',
    homeContent: {
      main_content: `Welcome to your Sci-Fi Universe project! This is your command center for managing your futuristic world.

This project encompasses the vast reaches of space, advanced civilizations, cutting-edge technology, and the complex political landscape of your science fiction universe. Whether you're crafting stories about interstellar conflicts, technological singularities, or the human condition in the far future, this project provides the framework to organize your ideas.

## Universe Overview

Your sci-fi universe is built on several key pillars:

### Technology & Science
Document the advanced technologies that define your universe, from faster-than-light travel to artificial intelligence, genetic engineering, and beyond.

### Civilizations & Societies
Explore the various alien species, human colonies, and hybrid societies that populate your universe. Each brings its own culture, values, and conflicts.

### Politics & Conflicts
Navigate the complex web of alliances, wars, and political intrigue that shapes the balance of power across the galaxy.

## Expanding Your Universe

Continue developing your sci-fi world by exploring new technologies, introducing alien species, and creating compelling conflicts that drive your narratives forward.`,
      sidebar_content: 'Your sci-fi universe project focuses on advanced civilizations and their interactions across the galaxy.',
      summary: 'Command center for your science fiction universe project'
    },
    articles: [
      {
        id: '3',
        title: 'The Galactic Federation',
        content: 'A political alliance spanning multiple star systems...',
        type: 'Organization',
        createdAt: '2024-01-10',
        updatedAt: '2024-01-12',
      },
    ],
    stats: {
      totalArticles: 8,
      organizations: 3,
      locations: 3,
      technology: 2,
      lastUpdated: '2024-01-12'
    }
  },
}

function ProjectHomePage() {
  const { projectId } = Route.useParams()
  const project = mockProjects[projectId]

  if (!project) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Project Not Found</h1>
          <p className="text-muted-foreground mb-4">The project you're looking for doesn't exist.</p>
          <Button asChild>
            <Link to="/projects">Back to Projects</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <article className="relative">
      {/* Header Image Section */}
      <header className="relative h-[400px] overflow-hidden">
        <div className="absolute inset-0 bg-[url('/images/landing-hero.webp')] bg-cover bg-center" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
        <div className="relative flex h-full items-end">
          <div className="mx-auto w-full max-w-7xl px-6 pb-12">
            <div className="flex items-center gap-3 mb-4">
              <Link to="/projects" className="text-white/80 hover:text-white text-sm">
                ← Back to Projects
              </Link>
            </div>
            <div className="flex items-center gap-3 mb-4">
              <Badge variant="secondary" className="text-white/90 bg-white/20 hover:bg-white/30">
                Project Home
              </Badge>
            </div>
            <h1 className="text-4xl font-bold text-white sm:text-5xl md:text-6xl">
              {project.title}
            </h1>
            <p className="mt-4 max-w-2xl text-xl text-white/90">
              {project.description}
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button asChild>
                <Link to="/projects/$projectId" params={{ projectId }}>
                  View Articles
                </Link>
              </Button>
              <Button variant="secondary" asChild>
                <Link to="/projects/$projectId" params={{ projectId }}>
                  Create Article
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="mx-auto max-w-7xl px-6 py-12">
        <div className="grid gap-12 lg:grid-cols-3">
          {/* Main Article Content */}
          <main className="lg:col-span-2">
            <div className="prose prose-lg max-w-none">
              <div 
                className="space-y-6"
                dangerouslySetInnerHTML={{ 
                  __html: project.homeContent.main_content.replace(/\n\n/g, '</p><p>').replace(/\n/g, '<br />').replace(/^/, '<p>').replace(/$/, '</p>').replace(/## (.*?)<\/p>/g, '<h3 class="text-2xl font-semibold mb-4 mt-8">$1</h3>').replace(/### (.*?)<\/p>/g, '<h4 class="text-xl font-medium mb-3 mt-6">$1</h4>')
                }}
              />
            </div>
          </main>

          {/* Sidebar */}
          <aside className="space-y-6">
            <ProjectStats project={project} />
            <RecentArticles articles={project.articles} projectId={projectId} />
            <ProjectActions projectId={projectId} />
            <ProjectInfo project={project} />
          </aside>
        </div>
      </div>
    </article>
  )
}

function ProjectStats({ project }: { project: any }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Project Stats</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Total Articles</span>
          <Badge variant="secondary">{project.stats.totalArticles}</Badge>
        </div>
        {project.stats.characters && (
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Characters</span>
            <Badge variant="secondary">{project.stats.characters}</Badge>
          </div>
        )}
        {project.stats.locations && (
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Locations</span>
            <Badge variant="secondary">{project.stats.locations}</Badge>
          </div>
        )}
        {project.stats.loreEntries && (
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Lore Entries</span>
            <Badge variant="secondary">{project.stats.loreEntries}</Badge>
          </div>
        )}
        {project.stats.organizations && (
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Organizations</span>
            <Badge variant="secondary">{project.stats.organizations}</Badge>
          </div>
        )}
        {project.stats.technology && (
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Technology</span>
            <Badge variant="secondary">{project.stats.technology}</Badge>
          </div>
        )}
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Last Updated</span>
          <span className="text-sm">{project.stats.lastUpdated}</span>
        </div>
      </CardContent>
    </Card>
  )
}

function RecentArticles({ articles, projectId }: { articles: any[]; projectId: string }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Recent Articles</CardTitle>
        <CardDescription>Latest content in this project</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {articles.slice(0, 3).map((article) => (
          <div key={article.id} className="space-y-1">
            <Link 
              to="/articles/$articleId" 
              params={{ articleId: article.id }}
              className="text-sm font-medium hover:underline"
            >
              {article.title}
            </Link>
            <p className="text-xs text-muted-foreground">
              {article.type} • Updated {article.updatedAt}
            </p>
          </div>
        ))}
        {articles.length === 0 && (
          <p className="text-sm text-muted-foreground">No articles yet. Create your first one!</p>
        )}
      </CardContent>
    </Card>
  )
}

function ProjectActions({ projectId }: { projectId: string }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Quick Actions</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <Link 
          to="/projects/$projectId" 
          params={{ projectId }}
          className="block text-sm text-primary hover:underline"
        >
          → Browse All Articles
        </Link>
        <Link 
          to="/projects/$projectId" 
          params={{ projectId }}
          className="block text-sm text-primary hover:underline"
        >
          → Create New Article
        </Link>
        <div className="pt-2 border-t">
          <p className="text-xs text-muted-foreground mb-2">Project Tools</p>
          <a href="#" className="block text-sm text-primary hover:underline">
            → Export Project
          </a>
          <a href="#" className="block text-sm text-primary hover:underline">
            → Project Settings
          </a>
        </div>
      </CardContent>
    </Card>
  )
}

function ProjectInfo({ project }: { project: any }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">About This Project</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-3">
          {project.homeContent.sidebar_content}
        </p>
        <div className="text-xs text-muted-foreground">
          <p><strong>Summary:</strong> {project.homeContent.summary}</p>
        </div>
      </CardContent>
    </Card>
  )
}