import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { api } from '../utils/api'
import { useAuthStore } from '../store/authStore'
import toast from 'react-hot-toast'

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900;1,700;1,900&family=Inter:wght@400;500;600;700&display=swap');

  @keyframes bit-spin { to { transform: rotate(360deg); } }
  .bit-spin { animation: bit-spin 0.75s linear infinite; }

  .bit-code-input {
    width: 100%; border: 1.5px solid #E8E4D9; border-radius: 10px;
    padding: 14px 16px; font-size: 18px; letter-spacing: 0.18em;
    font-family: monospace; font-weight: 700; color: #0F1F3D;
    background: #F9F7F1; outline: none; text-align: center;
    transition: border-color 0.15s, box-shadow 0.15s; box-sizing: border-box;
  }
  .bit-code-input:focus { border-color: #C9A84C; background: #fff; box-shadow: 0 0 0 4px rgba(201,168,76,0.12); }
  .bit-code-input::placeholder { color: #B0A898; font-size: 14px; letter-spacing: 0.06em; font-weight: 400; }

  .bit-btn-gold {
    display: flex; align-items: center; justify-content: center; gap: 8px;
    width: 100%; background: #C9A84C; color: #0F1F3D; border: none; border-radius: 10px;
    padding: 15px 24px; font-size: 14px; font-weight: 700;
    cursor: pointer; font-family: 'Inter', sans-serif;
    transition: opacity 0.15s, transform 0.15s;
  }
  .bit-btn-gold:hover:not(:disabled) { opacity: 0.88; transform: translateY(-1px); }
  .bit-btn-gold:disabled { opacity: 0.4; cursor: not-allowed; transform: none; }
`

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
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#F9F7F1', fontFamily: "'Inter', sans-serif", padding: '40px 20px' }}>
      <style>{CSS}</style>

      <div style={{ width: '100%', maxWidth: 400 }}>

        {/* Logo / brand */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            width: 52, height: 52, background: '#0F1F3D', borderRadius: 14,
            marginBottom: 18,
          }}>
            <span style={{ color: '#C9A84C', fontSize: 20, fontWeight: 900, fontFamily: "'Playfair Display', serif" }}>B</span>
          </div>
          <h1 style={{
            fontFamily: "'Playfair Display', serif", fontSize: 30, fontWeight: 900,
            color: '#0F1F3D', marginBottom: 8, lineHeight: 1.2,
          }}>
            Welcome back
          </h1>
          <p style={{ fontSize: 14, color: '#6B6B6B', lineHeight: 1.6 }}>
            Enter the access code your mentor sent you.
          </p>
        </div>

        {/* Card */}
        <div style={{ background: '#fff', border: '1px solid #E8E4D9', borderRadius: 16, padding: '32px 28px', boxShadow: '0 4px 24px rgba(15,31,61,0.07)' }}>

          <div style={{ marginBottom: 20 }}>
            <label style={{ display: 'block', fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.09em', color: '#8A8070', marginBottom: 9 }}>
              <i className="ti ti-key" style={{ fontSize: 11, marginRight: 5 }} />
              Access Code
            </label>
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              placeholder="e.g. AMARA-4827"
              className="bit-code-input"
              onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
              autoFocus
            />
          </div>

          <button onClick={handleLogin} disabled={loading} className="bit-btn-gold">
            {loading ? (
              <><i className="ti ti-loader-2 bit-spin" style={{ fontSize: 15 }} /> Checking...</>
            ) : (
              <><i className="ti ti-arrow-right" style={{ fontSize: 15 }} /> Access My Dashboard</>
            )}
          </button>

          <div style={{ marginTop: 18, textAlign: 'center' }}>
            <Link
              to="/mentor/login"
              style={{ fontSize: 12, color: '#8A8070', textDecoration: 'none', transition: 'color 0.15s' }}
              onMouseEnter={e => (e.currentTarget.style.color = '#0F1F3D')}
              onMouseLeave={e => (e.currentTarget.style.color = '#8A8070')}
            >
              Mentor login &rarr;
            </Link>
          </div>
        </div>

        {/* No code yet */}
        <p style={{ marginTop: 18, textAlign: 'center', fontSize: 12, color: '#8A8070' }}>
          No code yet?{' '}
          <Link
            to="/assess"
            style={{ color: '#C9A84C', fontWeight: 700, textDecoration: 'none' }}
            onMouseEnter={e => (e.currentTarget.style.opacity = '0.75')}
            onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
          >
            Complete the assessment &rarr;
          </Link>
        </p>

      </div>
    </div>
  )
}
