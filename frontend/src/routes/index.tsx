import { Link, createFileRoute } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import logo from '../logo.svg'

export const Route = createFileRoute('/')({
  component: LandingPage,
})

function LandingPage() {
  return (
    <main className="relative isolate">
      <section className="relative min-h-[calc(100vh-64px)] flex items-center overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-[url('/images/landing-hero.webp')] bg-cover bg-center" />
        <div className="absolute inset-0 -z-10 bg-black/20" />
        <div className="mx-auto w-full max-w-7xl px-6 py-20 text-center text-white">
          <div className="mx-auto mb-8 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs text-white/80">
            <img src={logo} alt="Mythos Engine" className="h-4 w-4" />
            <span>Mythos Engine</span>
          </div>
          <h1 className="mx-auto max-w-3xl text-balance text-4xl font-semibold tracking-tight sm:text-5xl md:text-6xl">
            Build lore-driven projects with speed and clarity
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-pretty text-base text-white/80 sm:text-lg">
            Create and manage your projects with rich articles and content. Build comprehensive documentation and lore for your creative works.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Button asChild>
              <Link to="/projects">View Projects</Link>
            </Button>
            <Button variant="secondary" asChild>
              <Link to="/projects">Create Project</Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="border-t border-border bg-muted/30">
        <div className="mx-auto w-full max-w-7xl px-6 py-14">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <Feature title="Project Management" desc="Organize your creative works into structured projects with rich metadata." />
            <Feature title="Article Creation" desc="Write and edit articles with a simple interface, with plans for rich WYSIWYG editing." />
            <Feature title="Lore Building" desc="Build comprehensive worlds and documentation for your creative projects." />
          </div>
        </div>
      </section>
    </main>
  )
}

function Feature({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="rounded-lg border border-border bg-card p-6 text-left shadow-xs">
      <h3 className="text-lg font-medium">{title}</h3>
      <p className="mt-2 text-sm text-muted-foreground">{desc}</p>
    </div>
  )
}
