import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { api } from '../utils/api'
import { useAuthStore } from '../store/authStore'
import toast from 'react-hot-toast'

export function MenteeLoginPage() {
  const [code, setCode] = useState('')
  const [loading, setLoading] = useState(false)
  const { setAuth } = useAuthStore()
  const navigate = useNavigate()

  async function handleLogin() {
    if (!code.trim()) { toast.error('Please enter your access code'); return }
    setLoading(true)
    try {
      const res = await api.post('/auth/mentee/login', { code })
      setAuth(res.data.token, { ...res.data.mentee, role: 'mentee' })
      navigate('/dashboard')
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Access code not found')
    } finally { setLoading(false) }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-ivory px-4 py-16">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <div className="mb-3 text-4xl">👋</div>
          <h1 className="font-display mb-2 text-3xl font-bold text-text">Welcome back</h1>
          <p className="text-sm text-muted">Enter the access code your mentor sent you.</p>
        </div>
        <div className="rounded-3xl border border-border bg-white p-8 shadow-warm-md">
          <div className="mb-5">
            <label className="mb-2 block text-xs font-bold uppercase tracking-widest text-muted">Access Code</label>
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              placeholder="e.g. AMARA-4827"
              className="w-full rounded-xl border border-border bg-ivory px-4 py-3 text-center font-mono text-lg tracking-widest text-text shadow-warm-sm outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/15"
              onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
            />
          </div>
          <button
            onClick={handleLogin}
            disabled={loading}
            className="w-full rounded-2xl bg-accent py-3.5 text-sm font-semibold text-white shadow-warm-md transition hover:-translate-y-0.5 hover:shadow-warm-lg disabled:opacity-40"
          >
            {loading ? 'Checking...' : 'Access My Dashboard →'}
          </button>
          <div className="mt-4 text-center">
            <Link to="/mentor/login" className="text-xs text-muted transition hover:text-text">Mentor login →</Link>
          </div>
        </div>
        <p className="mt-4 text-center text-xs text-muted">
          No code yet?{' '}
          <Link to="/assess" className="font-semibold text-accent transition hover:text-accent/80">Complete the assessment →</Link>
        </p>
      </div>
    </div>
  )
}