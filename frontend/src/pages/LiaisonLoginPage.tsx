import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

const API = import.meta.env.VITE_API_URL

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

export function LiaisonLoginPage() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLogin = async () => {
    setError('')
    if (!email || !password) { setError('Please enter your email and password'); return }
    setLoading(true)
    try {
      const res = await axios.post(`${API}/liaison/login`, { email, password })
      localStorage.setItem('liaison_token', JSON.stringify(res.data.token))
      localStorage.setItem('liaison_officer', JSON.stringify(res.data.officer))
      navigate('/liaison/dashboard')
    } catch (err: any) {
      setError(err.response?.data?.error || 'Login failed. Check your credentials.')
    }
    setLoading(false)
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#F9F7F1', fontFamily: "'Inter', sans-serif", padding: '40px 20px' }}>
      <style>{CSS}</style>

      <div style={{ width: '100%', maxWidth: 400 }}>

        {/* Brand */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            width: 52, height: 52, background: '#0F1F3D', borderRadius: 14, marginBottom: 18,
          }}>
            <i className="ti ti-shield" style={{ fontSize: 22, color: '#C9A84C' }} />
          </div>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 28, fontWeight: 900, color: '#0F1F3D', marginBottom: 6, lineHeight: 1.2 }}>
            Liaison Officer Login
          </h1>
          <p style={{ fontSize: 14, color: '#6B6B6B' }}>Build In Tech Mentorship Program</p>
        </div>

        {/* Card */}
        <div style={{ background: '#fff', border: '1px solid #E8E4D9', borderRadius: 16, padding: '32px 28px', boxShadow: '0 4px 24px rgba(15,31,61,0.07)' }}>

          <div style={{ marginBottom: 16 }}>
            <label style={{ display: 'block', fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.09em', color: '#8A8070', marginBottom: 8 }}>
              Email Address
            </label>
            <div style={{ position: 'relative' }}>
              <i className="ti ti-mail" style={{ position: 'absolute', left: 13, top: '50%', transform: 'translateY(-50%)', fontSize: 15, color: '#8A8070', pointerEvents: 'none' }} />
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="bit-input"
              />
            </div>
          </div>

          <div style={{ marginBottom: error ? 10 : 22 }}>
            <label style={{ display: 'block', fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.09em', color: '#8A8070', marginBottom: 8 }}>
              Password
            </label>
            <div style={{ position: 'relative' }}>
              <i className="ti ti-lock" style={{ position: 'absolute', left: 13, top: '50%', transform: 'translateY(-50%)', fontSize: 15, color: '#8A8070', pointerEvents: 'none' }} />
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Your password"
                onKeyDown={e => e.key === 'Enter' && handleLogin()}
                className="bit-input"
              />
            </div>
          </div>

          {error && (
            <div style={{
              marginBottom: 16, display: 'flex', alignItems: 'center', gap: 7,
              background: '#fff5f5', border: '1px solid #fecaca', borderRadius: 8,
              padding: '10px 14px', fontSize: 12, color: '#b91c1c',
            }}>
              <i className="ti ti-alert-circle" style={{ fontSize: 13, flexShrink: 0 }} />
              {error}
            </div>
          )}

          <button onClick={handleLogin} disabled={loading} className="bit-btn-gold">
            {loading ? (
              <><i className="ti ti-loader-2 bit-spin" style={{ fontSize: 15 }} /> Logging in...</>
            ) : (
              <><i className="ti ti-arrow-right" style={{ fontSize: 15 }} /> Login</>
            )}
          </button>

        </div>
      </div>
    </div>
  )
}
