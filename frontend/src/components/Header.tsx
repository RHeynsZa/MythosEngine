import { Link } from '@tanstack/react-router'

export default function Header() {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4">
        <div className="flex items-center gap-6">
          <Link to="/" className="text-sm font-semibold">
            Mythos Engine
          </Link>
          <nav className="hidden gap-2 md:flex">
            <NavLink to="/projects" label="Projects" />
            <NavLink to="/profile" label="Profile" />
          </nav>
        </div>
      </div>
    </header>
  )
}

function NavLink({ to, label }: { to: string; label: string }) {
  return (
    <Link
      to={to}
      className="rounded-md px-3 py-2 text-sm font-medium text-foreground/80 hover:bg-accent hover:text-accent-foreground"
    >
      {label}
    </Link>
  )
}
