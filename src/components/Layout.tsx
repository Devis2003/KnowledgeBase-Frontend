import { Link, Outlet, useNavigate } from 'react-router-dom'
import { BookMarked, LogOut, PenLine, Search, Shield, User } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'

export function Layout() {
  const { user, isAuthenticated, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    navigate('/')
  }

  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-50 border-b bg-card/80 backdrop-blur-sm">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link to="/" className="flex items-center gap-2 font-bold text-xl text-primary">
            <BookMarked className="h-6 w-6" />
            KnowledgeBase
          </Link>

          <nav className="hidden sm:flex items-center gap-1">
            <Button variant="ghost" asChild>
              <Link to="/">
                Articles
              </Link>
            </Button>
            <Button variant="ghost" asChild>
              <Link to="/search" className="gap-2">
                <Search className="h-4 w-4" />
                Search
              </Link>
            </Button>
            {isAuthenticated && (
              <Button variant="ghost" asChild>
                <Link to="/articles/new" className="gap-2">
                  <PenLine className="h-4 w-4" />
                  Write
                </Link>
              </Button>
            )}
            {user?.role === 'ADMIN' && (
              <Button variant="ghost" asChild>
                <Link to="/admin" className="gap-2">
                  <Shield className="h-4 w-4" />
                  Admin
                </Link>
              </Button>
            )}
          </nav>

          <div className="flex items-center gap-2">
            {isAuthenticated ? (
              <>
                <span className="hidden md:flex items-center gap-1.5 text-sm text-muted-foreground">
                  <User className="h-4 w-4" />
                  {user?.email}
                </span>
                <Button variant="outline" size="sm" onClick={handleLogout} className="gap-2">
                  <LogOut className="h-4 w-4" />
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Button variant="ghost" size="sm" asChild>
                  <Link to="/login">Login</Link>
                </Button>
                <Button size="sm" asChild>
                  <Link to="/signup">Sign up</Link>
                </Button>
              </>
            )}
          </div>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 py-8">
        <Outlet />
      </main>

      <footer className="border-t py-6">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          KnowledgeBase — Share and discover articles
        </div>
      </footer>
    </div>
  )
}

export function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-primary/5 via-background to-background p-4">
      <Link to="/" className="flex items-center gap-2 font-bold text-2xl text-primary mb-8">
        <BookMarked className="h-7 w-7" />
        KnowledgeBase
      </Link>
      {children}
    </div>
  )
}

export function PageHeader({ title, description }: { title: string; description?: string }) {
  return (
    <div className="mb-8">
      <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
      {description && <p className="mt-2 text-muted-foreground">{description}</p>}
      <Separator className="mt-4" />
    </div>
  )
}
