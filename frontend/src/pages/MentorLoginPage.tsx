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
    if (!email.trim() || !password.trim()) { toast.error('Please enter your email and password'); return }
    setLoading(true)
    try {
      const res = await api.post('/auth/mentor/login', { email, password })
      setAuth(res.data.token, { ...res.data.mentor, role: 'mentor' })
      navigate('/mentor')
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Invalid credentials')
    } finally { setLoading(false) }
  }

  const inputClass = "w-full rounded-xl border border-border bg-ivory px-4 py-3 text-sm text-text shadow-warm-sm outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/15"

  return (
    <div className="flex min-h-screen items-center justify-center bg-ivory px-4 py-16">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <div className="mb-3 text-4xl">🔑</div>
          <h1 className="font-display mb-2 text-3xl font-bold text-text">Mentor Dashboard</h1>
          <p className="text-sm text-muted">View all mentees, submissions, and program health.</p>
        </div>
        <div className="rounded-3xl border border-border bg-white p-8 shadow-warm-md">
          <div className="mb-4">
            <label className="mb-2 block text-xs font-bold uppercase tracking-widest text-muted">Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="mentor@mlops.dev" className={inputClass} />
          </div>
          <div className="mb-5">
            <label className="mb-2 block text-xs font-bold uppercase tracking-widest text-muted">Password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" className={inputClass} onKeyDown={(e) => e.key === 'Enter' && handleLogin()} />
          </div>
          <button
            onClick={handleLogin}
            disabled={loading}
            className="w-full rounded-2xl bg-accent py-3.5 text-sm font-semibold text-white shadow-warm-md transition hover:-translate-y-0.5 hover:shadow-warm-lg disabled:opacity-40"
          >
            {loading ? 'Checking...' : 'Enter Dashboard →'}
          </button>
          <div className="mt-4 text-center">
            <Link to="/login" className="text-xs text-muted transition hover:text-text">← Mentee login</Link>
          </div>
        </div>
      </div>
    </div>
  )
}