import { Link, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../../store/authStore'

export function Navbar() {
  const { user, logout } = useAuthStore()
  const navigate = useNavigate()

  function handleLogout() {
    logout()
    navigate('/')
  }

  return (
    <nav className="sticky top-0 z-50 border-b border-white/[0.07] bg-[#060611]/90 backdrop-blur-xl">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-6">
        <Link
          to="/"
          className="flex items-center gap-2 font-display text-sm font-bold tracking-tight"
        >
          <span className="h-2 w-2 rounded-full bg-accent shadow-[0_0_0_3px_rgba(255,107,43,0.2)]" />
          MLOps Mentorship
        </Link>

        <div className="flex items-center gap-2">
          {!user && (
            <>
              <Link
                to="/assess"
                className="rounded-lg px-3 py-1.5 text-sm text-muted transition hover:bg-white/5 hover:text-white"
              >
                Assessment
              </Link>
              <Link
                to="/login"
                className="rounded-lg px-3 py-1.5 text-sm text-muted transition hover:bg-white/5 hover:text-white"
              >
                Login
              </Link>
            </>
          )}

          {user && (
            <div className="flex items-center gap-3">
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-accent to-teal text-xs font-bold text-white">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <span className="text-sm text-white/70">{user.name.split(' ')[0]}</span>
              <button
                onClick={handleLogout}
                className="rounded-lg border border-white/[0.07] px-3 py-1.5 text-xs text-muted transition hover:bg-white/5 hover:text-white"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}