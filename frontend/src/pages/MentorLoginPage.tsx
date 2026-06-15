import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { api } from '../utils/api'
import { useAuthStore } from '../store/authStore'
import toast from 'react-hot-toast'

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900;1,700;1,900&family=Inter:wght@400;500;600;700&display=swap');

  @keyframes bit-spin { to { transform: rotate(360deg); } }
  .bit-spin { animation: bit-spin 0.75s linear infinite; }

  .bit-input {
    width: 100%; border: 1.5px solid #E8E4D9; border-radius: 10px;
    padding: 13px 14px 13px 40px; font-size: 14px;
    font-family: 'Inter', sans-serif; color: #0F1F3D;
    background: #F9F7F1; outline: none;
    transition: border-color 0.15s, box-shadow 0.15s, background 0.15s; box-sizing: border-box;
  }
  .bit-input:focus { border-color: #C9A84C; background: #fff; box-shadow: 0 0 0 4px rgba(201,168,76,0.12); }
  .bit-input::placeholder { color: #B0A898; }

  .bit-btn-navy {
    display: flex; align-items: center; justify-content: center; gap: 8px;
    width: 100%; background: #0F1F3D; color: #F5D87A; border: none; border-radius: 10px;
    padding: 15px 24px; font-size: 14px; font-weight: 700;
    cursor: pointer; font-family: 'Inter', sans-serif;
    transition: opacity 0.15s, transform 0.15s;
  }
  .bit-btn-navy:hover:not(:disabled) { opacity: 0.88; transform: translateY(-1px); }
  .bit-btn-navy:disabled { opacity: 0.4; cursor: not-allowed; transform: none; }
`

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

  return (
    <div style={{ minHeight: '100vh', display: 'flex', fontFamily: "'Inter', sans-serif", color: '#0F1F3D' }}>
      <style>{CSS}</style>

      {/* Left navy panel */}
      <div style={{
        width: 340, flexShrink: 0, background: '#0F1F3D',
        display: 'flex', flexDirection: 'column', justifyContent: 'center',
        padding: '60px 40px',
      }} className="bit-mentor-side">
        <div style={{
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
          width: 48, height: 48, background: '#C9A84C', borderRadius: 12, marginBottom: 28,
        }}>
          <span style={{ color: '#0F1F3D', fontSize: 20, fontWeight: 900, fontFamily: "'Playfair Display', serif" }}>B</span>
        </div>
        <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 28, fontWeight: 900, color: '#fff', lineHeight: 1.2, marginBottom: 14 }}>
          Build In Tech<br /><em style={{ color: '#F5D87A', fontStyle: 'italic' }}>Mentor Portal</em>
        </h2>
        <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.6)', lineHeight: 1.7, marginBottom: 36 }}>
          View all mentees, track submissions, add feedback, and manage program health.
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {[
            { icon: 'ti ti-users', label: 'Manage all mentees' },
            { icon: 'ti ti-clipboard-check', label: 'Review submissions' },
            { icon: 'ti ti-chart-bar', label: 'Track engagement' },
          ].map(item => (
            <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 13, color: 'rgba(255,255,255,0.7)' }}>
              <i className={item.icon} style={{ fontSize: 14, color: '#C9A84C', flexShrink: 0 }} />
              {item.label}
            </div>
          ))}
        </div>
      </div>

      {/* Right form panel */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#F9F7F1', padding: '40px 24px' }}>
        <div style={{ width: '100%', maxWidth: 380 }}>

          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 28, fontWeight: 900, color: '#0F1F3D', marginBottom: 6 }}>
            Sign in
          </h1>
          <p style={{ fontSize: 14, color: '#6B6B6B', marginBottom: 28 }}>Access your mentor dashboard.</p>

          <div style={{ background: '#fff', border: '1px solid #E8E4D9', borderRadius: 16, padding: '28px 24px', boxShadow: '0 4px 24px rgba(15,31,61,0.07)' }}>

            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.09em', color: '#8A8070', marginBottom: 8 }}>
                Email
              </label>
              <div style={{ position: 'relative' }}>
                <i className="ti ti-mail" style={{ position: 'absolute', left: 13, top: '50%', transform: 'translateY(-50%)', fontSize: 15, color: '#8A8070', pointerEvents: 'none' }} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="mentor@buildintech.xyz"
                  className="bit-input"
                />
              </div>
            </div>

            <div style={{ marginBottom: 22 }}>
              <label style={{ display: 'block', fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.09em', color: '#8A8070', marginBottom: 8 }}>
                Password
              </label>
              <div style={{ position: 'relative' }}>
                <i className="ti ti-lock" style={{ position: 'absolute', left: 13, top: '50%', transform: 'translateY(-50%)', fontSize: 15, color: '#8A8070', pointerEvents: 'none' }} />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="bit-input"
                  onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
                />
              </div>
            </div>

            <button onClick={handleLogin} disabled={loading} className="bit-btn-navy">
              {loading ? (
                <><i className="ti ti-loader-2 bit-spin" style={{ fontSize: 15 }} /> Checking...</>
              ) : (
                <><i className="ti ti-arrow-right" style={{ fontSize: 15 }} /> Enter Dashboard</>
              )}
            </button>

            <div style={{ marginTop: 16, textAlign: 'center' }}>
              <Link
                to="/login"
                style={{ fontSize: 12, color: '#8A8070', textDecoration: 'none' }}
                onMouseEnter={e => (e.currentTarget.style.color = '#0F1F3D')}
                onMouseLeave={e => (e.currentTarget.style.color = '#8A8070')}
              >
                &larr; Mentee login
              </Link>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 700px) {
          .bit-mentor-side { display: none !important; }
        }
      `}</style>
    </div>
  )
}
