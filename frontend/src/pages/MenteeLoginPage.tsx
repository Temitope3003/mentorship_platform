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
    if (!code.trim()) {
      toast.error('Please enter your access code')
      return
    }
    setLoading(true)
    try {
      const res = await api.post('/auth/mentee/login', { code })
      setAuth(res.data.token, { ...res.data.mentee, role: 'mentee' })
      navigate('/dashboard')
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Access code not found')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-16">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-teal/20 bg-teal/10 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-teal">
            Mentee Access
          </div>
          <h1 className="font-display text-3xl font-bold">Welcome back</h1>
          <p className="mt-2 text-sm text-muted">Enter the access code your mentor sent you.</p>
        </div>

        <div className="rounded-2xl border border-white/[0.07] bg-card p-8">
          <div className="mb-5">
            <label className="mb-2 block text-xs font-bold uppercase tracking-widest text-muted">
              Access Code
            </label>
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              placeholder="e.g. AMARA-4827"
              className="w-full rounded-xl border border-white/[0.07] bg-white/[0.04] px-4 py-3 text-center font-mono text-lg tracking-widest text-white placeholder-muted outline-none transition focus:border-teal focus:bg-teal/5 focus:ring-2 focus:ring-teal/20"
              onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
            />
          </div>
          <button
            onClick={handleLogin}
            disabled={loading}
            className="w-full rounded-xl bg-teal py-3.5 text-sm font-semibold text-[#040a09] transition hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(0,212,170,0.3)] disabled:opacity-40"
          >
            {loading ? 'Checking...' : 'Access Dashboard →'}
          </button>
          <div className="mt-5 text-center">
            <Link to="/mentor/login" className="text-xs text-muted transition hover:text-white">
              Mentor login →
            </Link>
          </div>
        </div>

        <p className="mt-4 text-center text-xs text-muted">
          No code yet?{' '}
          <Link to="/assess" className="text-accent transition hover:text-accent/80">
            Complete the assessment →
          </Link>
        </p>
      </div>
    </div>
  )
}