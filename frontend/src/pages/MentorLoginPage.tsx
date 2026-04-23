import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { api } from '../utils/api'
import { useAuthStore } from '../store/authStore'
import toast from 'react-hot-toast'

export function MentorLoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const { setAuth } = useAuthStore()
  const navigate = useNavigate()

  async function handleLogin() {
    if (!email.trim() || !password.trim()) {
      toast.error('Please enter your email and password')
      return
    }
    setLoading(true)
    try {
      const res = await api.post('/auth/mentor/login', { email, password })
      setAuth(res.data.token, { ...res.data.mentor, role: 'mentor' })
      navigate('/mentor')
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Invalid credentials')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-16">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-purple-500/20 bg-purple-500/10 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-purple-400">
            Mentor Access
          </div>
          <h1 className="font-display text-3xl font-bold">Mentor Dashboard</h1>
          <p className="mt-2 text-sm text-muted">View all mentees, submissions, and program health.</p>
        </div>

        <div className="rounded-2xl border border-white/[0.07] bg-card p-8">
          <div className="mb-4">
            <label className="mb-2 block text-xs font-bold uppercase tracking-widest text-muted">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="mentor@mlops.dev"
              className="w-full rounded-xl border border-white/[0.07] bg-white/[0.04] px-4 py-3 text-sm text-white placeholder-muted outline-none transition focus:border-purple-500 focus:bg-purple-500/5 focus:ring-2 focus:ring-purple-500/20"
            />
          </div>
          <div className="mb-5">
            <label className="mb-2 block text-xs font-bold uppercase tracking-widest text-muted">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full rounded-xl border border-white/[0.07] bg-white/[0.04] px-4 py-3 text-sm text-white placeholder-muted outline-none transition focus:border-purple-500 focus:bg-purple-500/5 focus:ring-2 focus:ring-purple-500/20"
              onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
            />
          </div>
          <button
            onClick={handleLogin}
            disabled={loading}
            className="w-full rounded-xl bg-purple-600 py-3.5 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-purple-500 hover:shadow-[0_8px_24px_rgba(124,58,237,0.35)] disabled:opacity-40"
          >
            {loading ? 'Checking...' : 'Enter Dashboard →'}
          </button>
          <div className="mt-5 text-center">
            <Link to="/login" className="text-xs text-muted transition hover:text-white">
              ← Mentee login
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}