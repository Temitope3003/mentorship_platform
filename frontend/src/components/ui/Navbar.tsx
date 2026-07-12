import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuthStore } from '../../store/authStore'
import { ChangePasswordModal } from './ChangePasswordModal'

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900;1,700;1,900&family=Inter:wght@400;500;600;700&display=swap');

  .bit-nav-link {
    display: inline-flex; align-items: center; gap: 5px;
    padding: 8px 14px; border-radius: 8px; font-size: 13px; font-weight: 500;
    color: rgba(255,255,255,0.65); font-family: 'Inter', sans-serif; text-decoration: none;
    transition: background 0.15s, color 0.15s;
  }
  .bit-nav-link:hover { background: rgba(255,255,255,0.07); color: #fff; }

  .bit-nav-cta {
    display: inline-flex; align-items: center; gap: 7px;
    background: #C9A84C; color: #0F1F3D; border-radius: 8px;
    padding: 9px 18px; font-size: 13px; font-weight: 700;
    font-family: 'Inter', sans-serif; text-decoration: none;
    transition: opacity 0.15s, transform 0.15s; border: none; cursor: pointer;
  }
  .bit-nav-cta:hover { opacity: 0.88; transform: translateY(-1px); }

  .bit-hamburger {
    display: flex; flex-direction: column; justify-content: center; align-items: center;
    width: 38px; height: 38px; border: 1px solid rgba(255,255,255,0.15); border-radius: 8px;
    background: none; cursor: pointer; gap: 4px; padding: 0;
  }
  .bit-hamburger span {
    display: block; height: 1.5px; background: rgba(255,255,255,0.75); border-radius: 2px;
    transition: width 0.2s;
  }

  .bit-mobile-menu {
    background: #0A1628; border-top: 1px solid rgba(255,255,255,0.08);
    padding: 16px 20px 20px;
  }
  .bit-mobile-link {
    display: flex; align-items: center; gap: 8px;
    padding: 11px 14px; border-radius: 8px; font-size: 14px; font-weight: 500;
    color: rgba(255,255,255,0.7); font-family: 'Inter', sans-serif; text-decoration: none;
    transition: background 0.15s, color 0.15s;
  }
  .bit-mobile-link:hover { background: rgba(255,255,255,0.06); color: #fff; }

  .bit-settings-trigger {
    display: flex; align-items: center; gap: 8px; background: none; border: none;
    cursor: pointer; padding: 4px 6px 4px 4px; border-radius: 8px;
    transition: background 0.15s;
  }
  .bit-settings-trigger:hover { background: rgba(255,255,255,0.06); }

  .bit-settings-menu {
    position: absolute; top: calc(100% + 8px); right: 0;
    background: #fff; border-radius: 10px; min-width: 190px;
    box-shadow: 0 12px 32px rgba(15,31,61,0.22); border: 1px solid #E8E4D9;
    overflow: hidden; z-index: 60;
  }
  .bit-settings-item {
    display: flex; align-items: center; gap: 8px; width: 100%;
    padding: 11px 16px; font-size: 13px; font-weight: 500; color: #0F1F3D;
    background: none; border: none; cursor: pointer; text-align: left;
    font-family: 'Inter', sans-serif; transition: background 0.15s;
  }
  .bit-settings-item:hover { background: #FBF7EC; }

  @media (min-width: 768px) {
    .bit-hamburger { display: none !important; }
  }
  @media (max-width: 767px) {
    .bit-desktop-links { display: none !important; }
  }
`

export function Navbar() {
  const { user, logout } = useAuthStore()
  const navigate = useNavigate()
  const location = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [passwordModalOpen, setPasswordModalOpen] = useState(false)

  // Pages with their own nav — don't render global navbar
  const hiddenRoutes = ['/', '/liaison/dashboard']
  if (hiddenRoutes.includes(location.pathname)) return null

  function handleLogout() {
    logout()
    navigate('/')
    setMenuOpen(false)
  }

  const isLoggedIn = !!user
  const isMentor = isLoggedIn && user.role === 'mentor'

  return (
    <>
      <style>{CSS}</style>
      <nav style={{
        position: 'sticky', top: 0, zIndex: 50,
        background: '#0F1F3D',
        borderBottom: '1px solid rgba(255,255,255,0.08)',
        boxShadow: '0 2px 16px rgba(15,31,61,0.18)',
      }}>
        <div style={{
          maxWidth: 1080, margin: '0 auto', padding: '0 24px',
          height: 60, display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>

          {/* ── LOGO ─────────────────────────────────────────────────── */}
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
            <div style={{
              width: 34, height: 34, background: '#C9A84C', borderRadius: 9,
              display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
            }}>
              <span style={{
                fontFamily: "'Playfair Display', serif", fontWeight: 900,
                fontSize: 17, color: '#0F1F3D',
              }}>B</span>
            </div>
            <span style={{
              fontFamily: "'Playfair Display', serif", fontWeight: 700,
              fontSize: 16, color: '#fff', letterSpacing: '-0.01em',
            }}>
              Build <span style={{ color: '#F5D87A' }}>In Tech</span>
            </span>
          </Link>

          {/* ── DESKTOP LINKS ────────────────────────────────────────── */}
          <div className="bit-desktop-links" style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            {!isLoggedIn ? (
              <>
                <Link to="/domains" className="bit-nav-link">
                  <i className="ti ti-compass" style={{ fontSize: 13 }} /> Domains
                </Link>
                <Link to="/assess" className="bit-nav-link">
                  <i className="ti ti-bolt" style={{ fontSize: 13 }} /> Take Assessment
                </Link>
                <Link to="/contact" className="bit-nav-link">
                  <i className="ti ti-mail" style={{ fontSize: 13 }} /> Contact
                </Link>
                <Link to="/login" className="bit-nav-link">
                  <i className="ti ti-user" style={{ fontSize: 13 }} /> Mentee Login
                </Link>
                <div style={{ width: 1, height: 20, background: 'rgba(255,255,255,0.12)', margin: '0 6px' }} />
                <Link to="/assess" className="bit-nav-cta">
                  Start Free <i className="ti ti-arrow-right" style={{ fontSize: 13 }} />
                </Link>
              </>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <Link
                  to={user.role === 'mentor' ? '/mentor' : '/dashboard'}
                  className="bit-nav-link"
                >
                  <i className="ti ti-layout-dashboard" style={{ fontSize: 13 }} /> Dashboard
                </Link>
                <div style={{ position: 'relative', marginLeft: 6 }}>
                  {isMentor ? (
                    <button
                      className="bit-settings-trigger"
                      onClick={() => setSettingsOpen(v => !v)}
                    >
                      <div style={{
                        width: 32, height: 32, borderRadius: 99, background: '#C9A84C',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontFamily: "'Inter', sans-serif", fontWeight: 700, fontSize: 13, color: '#0F1F3D',
                      }}>
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                      <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.75)', fontFamily: "'Inter', sans-serif" }}>
                        {user.name.split(' ')[0]}
                      </span>
                      <i className="ti ti-chevron-down" style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)' }} />
                    </button>
                  ) : (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div style={{
                        width: 32, height: 32, borderRadius: 99, background: '#C9A84C',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontFamily: "'Inter', sans-serif", fontWeight: 700, fontSize: 13, color: '#0F1F3D',
                      }}>
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                      <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.75)', fontFamily: "'Inter', sans-serif" }}>
                        {user.name.split(' ')[0]}
                      </span>
                    </div>
                  )}

                  {settingsOpen && isMentor && (
                    <div className="bit-settings-menu">
                      <button
                        className="bit-settings-item"
                        onClick={() => { setSettingsOpen(false); setPasswordModalOpen(true) }}
                      >
                        <i className="ti ti-key" style={{ fontSize: 14, color: '#8A8070' }} /> Change Password
                      </button>
                    </div>
                  )}
                </div>
                <button
                  onClick={handleLogout}
                  style={{
                    marginLeft: 4, background: 'none',
                    border: '1px solid rgba(255,255,255,0.15)', borderRadius: 7,
                    padding: '6px 13px', fontSize: 12, color: 'rgba(255,255,255,0.6)',
                    cursor: 'pointer', fontFamily: "'Inter', sans-serif", fontWeight: 500,
                    transition: 'border-color 0.15s, color 0.15s',
                    display: 'inline-flex', alignItems: 'center', gap: 5,
                  }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = '#C9A84C'; (e.currentTarget as HTMLElement).style.color = '#F5D87A' }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.15)'; (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.6)' }}
                >
                  <i className="ti ti-logout" style={{ fontSize: 12 }} /> Logout
                </button>
              </div>
            )}
          </div>

          {/* ── HAMBURGER ────────────────────────────────────────────── */}
          <button
            className="bit-hamburger"
            onClick={() => setMenuOpen(v => !v)}
            aria-label="Toggle menu"
          >
            <span style={{ width: menuOpen ? 18 : 20 }} />
            <span style={{ width: menuOpen ? 18 : 14 }} />
            <span style={{ width: menuOpen ? 18 : 18 }} />
          </button>
        </div>

        {/* ── MOBILE MENU ──────────────────────────────────────────────── */}
        {menuOpen && (
          <div className="bit-mobile-menu">
            {!isLoggedIn ? (
              <>
                <Link to="/domains" className="bit-mobile-link" onClick={() => setMenuOpen(false)}>
                  <i className="ti ti-compass" style={{ fontSize: 14, color: '#C9A84C' }} /> Domains
                </Link>
                <Link to="/assess" className="bit-mobile-link" onClick={() => setMenuOpen(false)}>
                  <i className="ti ti-bolt" style={{ fontSize: 14, color: '#C9A84C' }} /> Take Assessment
                </Link>
                <Link to="/contact" className="bit-mobile-link" onClick={() => setMenuOpen(false)}>
                  <i className="ti ti-mail" style={{ fontSize: 14, color: '#C9A84C' }} /> Contact
                </Link>
                <Link to="/login" className="bit-mobile-link" onClick={() => setMenuOpen(false)}>
                  <i className="ti ti-user" style={{ fontSize: 14, color: '#C9A84C' }} /> Mentee Login
                </Link>
                <div style={{ height: 1, background: 'rgba(255,255,255,0.06)', margin: '10px 0' }} />
                <Link
                  to="/assess"
                  onClick={() => setMenuOpen(false)}
                  style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                    background: '#C9A84C', color: '#0F1F3D', borderRadius: 9,
                    padding: '13px', fontSize: 14, fontWeight: 700,
                    fontFamily: "'Inter', sans-serif", textDecoration: 'none',
                  }}
                >
                  <i className="ti ti-arrow-right" style={{ fontSize: 14 }} /> Start Free
                </Link>
              </>
            ) : (
              <>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 14px', marginBottom: 4 }}>
                  <div style={{
                    width: 34, height: 34, borderRadius: 99, background: '#C9A84C', flexShrink: 0,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontWeight: 700, fontSize: 14, color: '#0F1F3D', fontFamily: "'Inter', sans-serif",
                  }}>
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 600, color: '#fff', fontFamily: "'Inter', sans-serif" }}>{user.name}</div>
                    <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.45)', fontFamily: "'Inter', sans-serif", textTransform: 'capitalize' }}>{user.role}</div>
                  </div>
                </div>
                <div style={{ height: 1, background: 'rgba(255,255,255,0.06)', margin: '6px 0 10px' }} />
                <Link
                  to={user.role === 'mentor' ? '/mentor' : '/dashboard'}
                  className="bit-mobile-link"
                  onClick={() => setMenuOpen(false)}
                >
                  <i className="ti ti-layout-dashboard" style={{ fontSize: 14, color: '#C9A84C' }} /> Dashboard
                </Link>
                {isMentor && (
                  <button
                    onClick={() => { setMenuOpen(false); setPasswordModalOpen(true) }}
                    className="bit-mobile-link"
                    style={{ width: '100%', border: 'none', background: 'none', cursor: 'pointer' }}
                  >
                    <i className="ti ti-key" style={{ fontSize: 14, color: '#C9A84C' }} /> Change Password
                  </button>
                )}
                <button
                  onClick={handleLogout}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 8, width: '100%',
                    padding: '11px 14px', borderRadius: 8, border: 'none', background: 'none',
                    fontSize: 14, fontWeight: 500, color: 'rgba(255,255,255,0.6)',
                    fontFamily: "'Inter', sans-serif", cursor: 'pointer', marginTop: 2,
                    transition: 'background 0.15s, color 0.15s', textAlign: 'left',
                  }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.05)'; (e.currentTarget as HTMLElement).style.color = '#fff' }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'none'; (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.6)' }}
                >
                  <i className="ti ti-logout" style={{ fontSize: 14, color: '#ef4444' }} /> Logout
                </button>
              </>
            )}
          </div>
        )}
      </nav>

      {passwordModalOpen && (
        <ChangePasswordModal onClose={() => setPasswordModalOpen(false)} />
      )}
    </>
  )
}
