import { Link, createFileRoute } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import logo from '../logo.svg'

export const Route = createFileRoute('/')({
  component: HomePage,
})

function HomePage() {
  return (
    <article className="relative">
      {/* Header Image Section */}
      <header className="relative h-[400px] overflow-hidden">
        <div className="absolute inset-0 bg-[url('/images/landing-hero.webp')] bg-cover bg-center" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
        <div className="relative flex h-full items-end">
          <div className="mx-auto w-full max-w-7xl px-6 pb-12">
            <div className="flex items-center gap-3 mb-4">
              <img src={logo} alt="Mythos Engine" className="h-8 w-8" />
              <Badge variant="secondary" className="text-white/90 bg-white/20 hover:bg-white/30">
                Welcome to Mythos Engine
              </Badge>
            </div>
            <h1 className="text-4xl font-bold text-white sm:text-5xl md:text-6xl">
              Your Creative Universe Awaits
            </h1>
            <p className="mt-4 max-w-2xl text-xl text-white/90">
              Build immersive worlds, craft compelling stories, and manage complex lore with the power of structured storytelling.
            </p>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="mx-auto max-w-7xl px-6 py-12">
        <div className="grid gap-12 lg:grid-cols-3">
          {/* Main Article Content */}
          <main className="lg:col-span-2">
            <div className="prose prose-lg max-w-none">
              <h2 className="text-3xl font-semibold mb-6">Welcome to Mythos Engine</h2>
              
              <p className="text-lg text-muted-foreground mb-8">
                Every great story begins with a single idea. Whether you're crafting an epic fantasy world, 
                developing a science fiction universe, or documenting the intricate details of your creative 
                project, Mythos Engine provides the tools you need to bring your vision to life.
              </p>

              <h3 className="text-2xl font-semibold mb-4">What Makes Mythos Engine Special?</h3>
              
              <div className="space-y-6 mb-8">
                <div>
                  <h4 className="text-xl font-medium mb-2">Structured Storytelling</h4>
                  <p>
                    Our platform understands that great lore requires organization. Create interconnected 
                    articles for locations, characters, events, and more. Each piece of content is designed 
                    to work together, creating a cohesive and comprehensive world.
                  </p>
                </div>

                <div>
                  <h4 className="text-xl font-medium mb-2">Flexible Article Types</h4>
                  <p>
                    From detailed settlement descriptions to character backstories, Mythos Engine adapts 
                    to your needs. Our dynamic forms ensure you capture all the important details while 
                    maintaining consistency across your project.
                  </p>
                </div>

                <div>
                  <h4 className="text-xl font-medium mb-2">Project-Centric Organization</h4>
                  <p>
                    Keep your creative works organized with our project management system. Whether you're 
                    working on a single novel or managing multiple campaigns, everything stays neatly 
                    categorized and easily accessible.
                  </p>
                </div>
              </div>

              <div className="bg-muted/50 rounded-lg p-6 mb-8">
                <h3 className="text-xl font-semibold mb-3">Ready to Start Building?</h3>
                <p className="mb-4">
                  Jump right in and create your first project, or explore existing content to see 
                  what's possible with Mythos Engine.
                </p>
                <div className="flex flex-wrap gap-3">
                  <Button asChild>
                    <Link to="/projects">View Projects</Link>
                  </Button>
                  <Button variant="outline" asChild>
                    <Link to="/projects">Create New Project</Link>
                  </Button>
                </div>
              </div>
            </div>
          </main>

          {/* Sidebar */}
          <aside className="space-y-6">
            <QuickStats />
            <RecentActivity />
            <FeaturedContent />
            <HelpfulLinks />
          </aside>
        </div>
      </div>
    </article>
  )
}

function QuickStats() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">At a Glance</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Total Projects</span>
          <Badge variant="secondary">3</Badge>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Articles Created</span>
          <Badge variant="secondary">12</Badge>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Last Updated</span>
          <span className="text-sm">Today</span>
        </div>
      </CardContent>
    </Card>
  )
}

function RecentActivity() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Recent Activity</CardTitle>
        <CardDescription>Latest updates to your projects</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="space-y-1">
          <p className="text-sm font-medium">Updated "Riverdale"</p>
          <p className="text-xs text-muted-foreground">Location article • 2 hours ago</p>
        </div>
        <div className="space-y-1">
          <p className="text-sm font-medium">Created new project</p>
          <p className="text-xs text-muted-foreground">Fantasy Campaign • Yesterday</p>
        </div>
        <div className="space-y-1">
          <p className="text-sm font-medium">Added character notes</p>
          <p className="text-xs text-muted-foreground">Sir Gareth • 3 days ago</p>
        </div>
      </CardContent>
    </Card>
  )
}

function FeaturedContent() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Featured</CardTitle>
        <CardDescription>Highlighted content from your projects</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div>
            <Link to="/articles/1" className="text-sm font-medium hover:underline">
              Riverdale Trading Post
            </Link>
            <p className="text-xs text-muted-foreground mt-1">
              A bustling trade hub at the confluence of two rivers...
            </p>
            <div className="flex gap-1 mt-2">
              <Badge variant="outline" className="text-xs">Location</Badge>
              <Badge variant="outline" className="text-xs">Trade</Badge>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function HelpfulLinks() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Quick Links</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <Link to="/projects" className="block text-sm text-primary hover:underline">
          → Browse All Projects
        </Link>
        <Link to="/test-upload" className="block text-sm text-primary hover:underline">
          → Upload Content
        </Link>
        <div className="pt-2 border-t">
          <p className="text-xs text-muted-foreground mb-2">Need help?</p>
          <a href="#" className="block text-sm text-primary hover:underline">
            → Documentation
          </a>
          <a href="#" className="block text-sm text-primary hover:underline">
            → Community Forum
          </a>
        </div>
      </CardContent>
    </Card>
  )
}
