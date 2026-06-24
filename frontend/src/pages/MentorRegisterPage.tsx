import { useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../utils/api'
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

  .bit-textarea {
    width: 100%; border: 1.5px solid #E8E4D9; border-radius: 10px;
    padding: 13px 14px; font-size: 14px;
    font-family: 'Inter', sans-serif; color: #0F1F3D;
    background: #F9F7F1; outline: none; resize: none;
    transition: border-color 0.15s, box-shadow 0.15s, background 0.15s; box-sizing: border-box;
  }
  .bit-textarea:focus { border-color: #C9A84C; background: #fff; box-shadow: 0 0 0 4px rgba(201,168,76,0.12); }
  .bit-textarea::placeholder { color: #B0A898; }

  .bit-btn-navy {
    display: flex; align-items: center; justify-content: center; gap: 8px;
    width: 100%; background: #0F1F3D; color: #F5D87A; border: none; border-radius: 10px;
    padding: 15px 24px; font-size: 14px; font-weight: 700;
    cursor: pointer; font-family: 'Inter', sans-serif;
    transition: opacity 0.15s, transform 0.15s;
  }
  .bit-btn-navy:hover:not(:disabled) { opacity: 0.88; transform: translateY(-1px); }
  .bit-btn-navy:disabled { opacity: 0.4; cursor: not-allowed; transform: none; }

  @media (max-width: 700px) {
    .bit-mentor-side { display: none !important; }
  }
`

export function MentorRegisterPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [applicationNote, setApplicationNote] = useState('')
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  async function handleSubmit() {
    if (!name.trim() || !email.trim() || !password.trim()) {
      toast.error('Please fill in your name, email, and password')
      return
    }
    if (password.length < 8) {
      toast.error('Password must be at least 8 characters')
      return
    }
    setLoading(true)
    try {
      await api.post('/mentor/register', {
        name: name.trim(),
        email: email.trim(),
        password,
        applicationNote: applicationNote.trim() || undefined,
      })
      setSubmitted(true)
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Failed to submit application')
    } finally {
      setLoading(false)
    }
  }

  if (submitted) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#F9F7F1', fontFamily: "'Inter', sans-serif", padding: '40px 24px' }}>
        <style>{CSS}</style>
        <div style={{ width: '100%', maxWidth: 460, textAlign: 'center' }}>
          <div style={{
            width: 64, height: 64, borderRadius: 18, background: 'rgba(201,168,76,0.14)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px',
          }}>
            <i className="ti ti-clock-check" style={{ fontSize: 28, color: '#C9A84C' }} />
          </div>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 28, fontWeight: 900, color: '#0F1F3D', marginBottom: 12, lineHeight: 1.2 }}>
            Your application is under review
          </h1>
          <p style={{ fontSize: 14, color: '#6B6B6B', lineHeight: 1.8, marginBottom: 28 }}>
            Thank you for applying to mentor with Build In Tech. Our team will review your application and email you at <strong style={{ color: '#0F1F3D' }}>{email}</strong> once a decision has been made.
          </p>
          <Link
            to="/"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              background: '#0F1F3D', color: '#F5D87A', borderRadius: 10,
              padding: '13px 24px', fontSize: 14, fontWeight: 700, textDecoration: 'none',
            }}
          >
            <i className="ti ti-arrow-left" style={{ fontSize: 14 }} /> Back to Home
          </Link>
        </div>
      </div>
    )
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
          Become a<br /><em style={{ color: '#F5D87A', fontStyle: 'italic' }}>Build In Tech Mentor</em>
        </h2>
        <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.6)', lineHeight: 1.7, marginBottom: 36 }}>
          Help complete beginners break into tech. Every application is reviewed personally by our team.
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {[
            { icon: 'ti ti-users', label: 'Guide mentees through their 12-month roadmap' },
            { icon: 'ti ti-clipboard-check', label: 'Review weekly submissions and give feedback' },
            { icon: 'ti ti-heart-handshake', label: 'Shape the next generation of tech talent' },
          ].map(item => (
            <div key={item.label} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, fontSize: 13, color: 'rgba(255,255,255,0.7)' }}>
              <i className={item.icon} style={{ fontSize: 14, color: '#C9A84C', flexShrink: 0, marginTop: 2 }} />
              {item.label}
            </div>
          ))}
        </div>
      </div>

      {/* Right form panel */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#F9F7F1', padding: '40px 24px' }}>
        <div style={{ width: '100%', maxWidth: 420 }}>

          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 28, fontWeight: 900, color: '#0F1F3D', marginBottom: 6 }}>
            Apply to mentor
          </h1>
          <p style={{ fontSize: 14, color: '#6B6B6B', marginBottom: 28 }}>Tell us a bit about yourself. We review every application.</p>

          <div style={{ background: '#fff', border: '1px solid #E8E4D9', borderRadius: 16, padding: '28px 24px', boxShadow: '0 4px 24px rgba(15,31,61,0.07)' }}>

            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.09em', color: '#8A8070', marginBottom: 8 }}>
                Full Name
              </label>
              <div style={{ position: 'relative' }}>
                <i className="ti ti-user" style={{ position: 'absolute', left: 13, top: '50%', transform: 'translateY(-50%)', fontSize: 15, color: '#8A8070', pointerEvents: 'none' }} />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Temitope Ajao"
                  className="bit-input"
                />
              </div>
            </div>

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
                  placeholder="you@email.com"
                  className="bit-input"
                />
              </div>
            </div>

            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.09em', color: '#8A8070', marginBottom: 8 }}>
                Password
              </label>
              <div style={{ position: 'relative' }}>
                <i className="ti ti-lock" style={{ position: 'absolute', left: 13, top: '50%', transform: 'translateY(-50%)', fontSize: 15, color: '#8A8070', pointerEvents: 'none' }} />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 8 characters"
                  className="bit-input"
                />
              </div>
            </div>

            <div style={{ marginBottom: 22 }}>
              <label style={{ display: 'block', fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.09em', color: '#8A8070', marginBottom: 8 }}>
                Why do you want to mentor?
              </label>
              <textarea
                value={applicationNote}
                onChange={(e) => setApplicationNote(e.target.value)}
                placeholder="Tell us about your experience and why you want to mentor beginners breaking into tech."
                rows={4}
                className="bit-textarea"
              />
            </div>

            <button onClick={handleSubmit} disabled={loading} className="bit-btn-navy">
              {loading ? (
                <><i className="ti ti-loader-2 bit-spin" style={{ fontSize: 15 }} /> Submitting...</>
              ) : (
                <><i className="ti ti-send" style={{ fontSize: 15 }} /> Submit Application</>
              )}
            </button>

            <div style={{ marginTop: 16, textAlign: 'center' }}>
              <Link
                to="/mentor/login"
                style={{ fontSize: 12, color: '#8A8070', textDecoration: 'none' }}
                onMouseEnter={e => (e.currentTarget.style.color = '#0F1F3D')}
                onMouseLeave={e => (e.currentTarget.style.color = '#8A8070')}
              >
                &larr; Already approved? Log in
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
