import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../../store/authStore'

export function Navbar() {
  const { user, logout } = useAuthStore()
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)

  function handleLogout() {
    logout()
    navigate('/')
  }

  return (
    <nav className="sticky top-0 z-50 border-b border-border bg-ivory/95 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">

        {/* brand */}
        <Link to="/" className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent">
            <span className="font-display text-sm font-bold italic text-white">M</span>
          </div>
          <span className="font-display text-lg font-semibold text-text">
            MLOps <span className="text-accent">Mentorship</span>
          </span>
        </Link>

        {/* desktop links */}
        <div className="hidden items-center gap-1 md:flex">
          {!user ? (
            <>
              <Link to="/assess" className="rounded-lg px-4 py-2 text-sm font-medium text-text2 transition hover:bg-cream hover:text-text">
                Take Assessment
              </Link>
              <Link to="/login" className="rounded-lg px-4 py-2 text-sm font-medium text-text2 transition hover:bg-cream hover:text-text">
                Mentee Login
              </Link>
              <Link
                to="/assess"
                className="ml-2 rounded-xl bg-accent px-5 py-2.5 text-sm font-semibold text-white shadow-warm-sm transition hover:-translate-y-0.5 hover:bg-accent/90 hover:shadow-warm-md"
              >
                Start Free →
              </Link>
            </>
          ) : (
            <div className="flex items-center gap-3">
              <Link
                to={user.role === 'mentor' ? '/mentor' : '/dashboard'}
                className="rounded-lg px-4 py-2 text-sm font-medium text-text2 transition hover:bg-cream"
              >
                Dashboard
              </Link>
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-accent text-sm font-bold text-white">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <span className="text-sm text-text2">{user.name.split(' ')[0]}</span>
              <button
                onClick={handleLogout}
                className="rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-muted transition hover:bg-cream hover:text-text"
              >
                Logout
              </button>
            </div>
          )}
        </div>

        {/* mobile menu button */}
        <button
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-border md:hidden"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <div className="space-y-1.5">
            <span className="block h-0.5 w-5 bg-text2" />
            <span className="block h-0.5 w-5 bg-text2" />
            <span className="block h-0.5 w-3 bg-text2" />
          </div>
        </button>
      </div>

      {/* mobile menu */}
      {menuOpen && (
        <div className="border-t border-border bg-ivory px-6 py-4 md:hidden">
          <div className="flex flex-col gap-2">
            <Link to="/assess" onClick={() => setMenuOpen(false)} className="rounded-lg px-4 py-2.5 text-sm font-medium text-text2 hover:bg-cream">
              Take Assessment
            </Link>
            <Link to="/login" onClick={() => setMenuOpen(false)} className="rounded-lg px-4 py-2.5 text-sm font-medium text-text2 hover:bg-cream">
              Mentee Login
            </Link>
            <Link
              to="/assess"
              onClick={() => setMenuOpen(false)}
              className="mt-2 rounded-xl bg-accent px-5 py-3 text-center text-sm font-semibold text-white"
            >
              Start Free →
            </Link>
          </div>
        </div>
      )}
    </nav>
  )
}