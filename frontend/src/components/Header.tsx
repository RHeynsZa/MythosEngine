import { Link } from '@tanstack/react-router'
import { useCurrentUser } from '@/lib/user-context'
import { Badge } from './ui/badge'

export default function Header() {
  const { currentUser } = useCurrentUser()

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4">
        <div className="flex items-center gap-6">
          <Link to="/" className="text-sm font-semibold">
            Mythos Engine
          </Link>
          <nav className="hidden gap-2 md:flex">
            <NavLink to="/users" label="Profile" />
            <NavLink to="/projects" label="Projects" />
            <NavLink to="/admin" label="Admin" />
          </nav>
        </div>
        
        <div className="flex items-center gap-4">
          {currentUser ? (
            <div className="flex items-center gap-2">
              {currentUser.avatar_url && (
                <img
                  src={currentUser.avatar_url}
                  alt={`${currentUser.username}'s avatar`}
                  className="w-8 h-8 rounded-full object-cover"
                />
              )}
              <div className="text-sm">
                <div className="font-medium">{currentUser.full_name || currentUser.username}</div>
                <div className="text-xs text-gray-500">@{currentUser.username}</div>
              </div>
            </div>
          ) : (
            <Badge variant="outline">No user selected</Badge>
          )}
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
