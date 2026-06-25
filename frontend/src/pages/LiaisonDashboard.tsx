import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

const API = import.meta.env.VITE_API_URL

const STATUS_BADGES: Record<string, { bg: string; border: string; color: string; icon: string; label: string }> = {
  NOT_STARTED: { bg: '#F9F7F1', border: '#E8E4D9', color: '#8A8070', icon: 'ti ti-hourglass-empty', label: 'Not Started' },
  PAUSED:      { bg: '#FBF7EC', border: '#DFC97A', color: '#7A5C1E', icon: 'ti ti-player-pause',    label: 'Paused' },
  AT_RISK:     { bg: '#fff5f5', border: '#fecaca', color: '#b91c1c', icon: 'ti ti-alert-triangle',  label: 'At Risk' },
  ON_TRACK:    { bg: '#f0fdf4', border: '#bbf7d0', color: '#15803d', icon: 'ti ti-circle-check',    label: 'On Track' },
}

function useLocalStorage<T>(key: string, initial: T) {
  const [value, setValue] = useState<T>(() => {
    try { return JSON.parse(localStorage.getItem(key) || '') } catch { return initial }
  })
  const set = (v: T) => { localStorage.setItem(key, JSON.stringify(v)); setValue(v) }
  return [value, set] as const
}

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900;1,700;1,900&family=Inter:wght@400;500;600;700&display=swap');

  @keyframes bit-spin { to { transform: rotate(360deg); } }
  .bit-spin { animation: bit-spin 0.75s linear infinite; }

  .bit-tab {
    padding: 8px 18px; font-size: 13px; font-weight: 600; font-family: 'Inter', sans-serif;
    border: 1px solid #E8E4D9; border-radius: 8px; background: #fff;
    cursor: pointer; color: #8A8070; transition: all 0.15s;
  }
  .bit-tab.active { background: #0F1F3D; color: #F5D87A; border-color: #0F1F3D; }
  .bit-tab:not(.active):hover { border-color: #C9A84C; color: #0F1F3D; }

  .bit-textarea {
    width: 100%; border: 1px solid #E8E4D9; border-radius: 8px;
    padding: 10px 12px; font-size: 12px; font-family: 'Inter', sans-serif;
    color: #0F1F3D; background: #F9F7F1; outline: none; resize: none; height: 76px;
    transition: border-color 0.15s, box-shadow 0.15s; box-sizing: border-box;
  }
  .bit-textarea:focus { border-color: #C9A84C; box-shadow: 0 0 0 3px rgba(201,168,76,0.12); background: #fff; }
  .bit-textarea::placeholder { color: #B0A898; }

  .bit-btn-gold {
    display: inline-flex; align-items: center; justify-content: center; gap: 6px;
    background: #C9A84C; color: #0F1F3D; border: none; border-radius: 7px;
    padding: 8px 16px; font-size: 12px; font-weight: 700;
    cursor: pointer; font-family: 'Inter', sans-serif; transition: opacity 0.15s;
    white-space: nowrap;
  }
  .bit-btn-gold:hover:not(:disabled) { opacity: 0.85; }
  .bit-btn-gold:disabled { opacity: 0.4; cursor: not-allowed; }

  @media (max-width: 640px) {
    .bit-stats-grid { grid-template-columns: 1fr 1fr !important; }
    .bit-week-grid { grid-template-columns: 1fr !important; }
  }
`

export function LiaisonDashboard() {
  const navigate = useNavigate()
  const [token] = useLocalStorage('liaison_token', '')
  const [officer] = useLocalStorage<any>('liaison_officer', null)
  const [data, setData] = useState<any>(null)
  const [mentees, setMentees] = useState<any[]>([])
  const [payments, setPayments] = useState<any[]>([])
  const [tab, setTab] = useState<'week' | 'mentees' | 'payments'>('week')
  const [loading, setLoading] = useState(false)
  const [checkinLoading, setCheckinLoading] = useState<string | null>(null)
  const [notes, setNotes] = useState<Record<string, string>>({})
  const [actingPaymentId, setActingPaymentId] = useState<string | null>(null)

  const headers = { Authorization: `Bearer ${token}` }

  const load = async () => {
    setLoading(true)
    try {
      const [d, m, p] = await Promise.all([
        axios.get(`${API}/liaison/dashboard`, { headers }),
        axios.get(`${API}/liaison/mentees`, { headers }),
        axios.get(`${API}/mentor/pending-payments`, { headers }),
      ])
      setData(d.data)
      setMentees(m.data)
      setPayments(p.data)
      const n: Record<string, string> = {}
      m.data.forEach((m: any) => { n[m.id] = m.notes || '' })
      setNotes(n)
    } catch {
      navigate('/liaison/login')
    }
    setLoading(false)
  }

  const confirmPayment = async (id: string, name: string) => {
    setActingPaymentId(id)
    try {
      await axios.patch(`${API}/mentor/mentees/${id}/confirm-payment`, {}, { headers })
      setPayments(prev => prev.filter(p => p.id !== id))
      alert(`${name} upgraded to Premium`)
    } catch {
      alert('Failed to confirm payment')
    }
    setActingPaymentId(null)
  }

  const rejectPayment = async (id: string, name: string) => {
    if (!confirm(`Reject ${name}'s payment claim?`)) return
    setActingPaymentId(id)
    try {
      await axios.patch(`${API}/mentor/mentees/${id}/reject-payment`, {}, { headers })
      setPayments(prev => prev.filter(p => p.id !== id))
      alert(`${name}'s payment claim rejected`)
    } catch {
      alert('Failed to reject payment')
    }
    setActingPaymentId(null)
  }

  useEffect(() => { if (token) load() }, [])

  const sendCheckin = async (id: string) => {
    setCheckinLoading(id)
    try {
      await axios.post(`${API}/liaison/mentees/${id}/checkin`, {}, { headers })
      alert('Check-in email sent successfully')
    } catch {
      alert('Failed to send check-in email')
    }
    setCheckinLoading(null)
  }

  const saveNotes = async (id: string) => {
    try {
      await axios.patch(`${API}/liaison/mentees/${id}/notes`, { notes: notes[id] }, { headers })
      alert('Notes saved')
    } catch {
      alert('Failed to save notes')
    }
  }

  const logout = () => {
    localStorage.removeItem('liaison_token')
    localStorage.removeItem('liaison_officer')
    navigate('/liaison/login')
  }

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#F9F7F1', fontFamily: "'Inter', sans-serif" }}>
        <style>{CSS}</style>
        <div style={{ textAlign: 'center' }}>
          <div className="bit-spin" style={{ width: 36, height: 36, border: '3px solid #E8E4D9', borderTopColor: '#C9A84C', borderRadius: '50%', margin: '0 auto 16px' }} />
          <p style={{ color: '#6B6B6B', fontSize: 14 }}>Loading dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', background: '#F9F7F1', fontFamily: "'Inter', sans-serif", color: '#0F1F3D' }}>
      <style>{CSS}</style>

      {/* ── NAV ─────────────────────────────────────────────────────────── */}
      <nav style={{
        background: '#0F1F3D', borderBottom: '1px solid rgba(255,255,255,0.08)',
        padding: '0 28px', display: 'flex', alignItems: 'center',
        justifyContent: 'space-between', height: 58,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{
            width: 36, height: 36, borderRadius: 10, background: '#C9A84C',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: "'Playfair Display', serif", fontWeight: 900, fontSize: 16, color: '#0F1F3D',
          }}>
            {officer?.name?.[0] || 'L'}
          </div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, color: '#fff' }}>{officer?.name}</div>
            <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '0.07em' }}>Liaison Officer</div>
          </div>
        </div>
        <button
          onClick={logout}
          style={{
            background: 'none', border: '1px solid rgba(255,255,255,0.18)', borderRadius: 7,
            padding: '6px 14px', fontSize: 12, color: 'rgba(255,255,255,0.65)', cursor: 'pointer',
            fontFamily: "'Inter', sans-serif", transition: 'border-color 0.15s, color 0.15s',
            display: 'flex', alignItems: 'center', gap: 5,
          }}
          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = '#C9A84C'; (e.currentTarget as HTMLElement).style.color = '#F5D87A' }}
          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.18)'; (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.65)' }}
        >
          <i className="ti ti-logout" style={{ fontSize: 13 }} /> Logout
        </button>
      </nav>

      <div style={{ maxWidth: 960, margin: '0 auto', padding: '36px 28px 72px' }}>

        {/* ── HEADER ─────────────────────────────────────────────────────── */}
        <div style={{ marginBottom: 28 }}>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 30, fontWeight: 900, color: '#0F1F3D', marginBottom: 4 }}>
            Liaison Dashboard
          </h1>
          <p style={{ fontSize: 14, color: '#6B6B6B' }}>Track your mentees and keep them on course.</p>
        </div>

        {/* ── STATS ──────────────────────────────────────────────────────── */}
        {data && (
          <div
            className="bit-stats-grid"
            style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 24 }}
          >
            {[
              { label: 'Total Mentees',  value: data.summary.total,            icon: 'ti ti-users',          color: '#C9A84C' },
              { label: 'Submitted',      value: data.summary.submittedCount,    icon: 'ti ti-circle-check',   color: '#15803d' },
              { label: 'Not Submitted',  value: data.summary.notSubmittedCount, icon: 'ti ti-clock',          color: '#b45309' },
              { label: 'At Risk',        value: data.summary.atRiskCount,       icon: 'ti ti-alert-triangle', color: '#b91c1c' },
            ].map(s => (
              <div key={s.label} style={{ background: '#fff', border: '1px solid #E8E4D9', borderRadius: 12, padding: '16px 18px' }}>
                <i className={s.icon} style={{ fontSize: 18, color: s.color, display: 'block', marginBottom: 9 }} />
                <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 28, fontWeight: 900, color: s.color, lineHeight: 1 }}>
                  {s.value}
                </div>
                <div style={{ fontSize: 10, color: '#8A8070', marginTop: 5, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── TABS ───────────────────────────────────────────────────────── */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
          <button onClick={() => setTab('week')} className={`bit-tab${tab === 'week' ? ' active' : ''}`}>
            <i className="ti ti-calendar-week" style={{ fontSize: 12, marginRight: 6 }} />
            This Week
          </button>
          <button onClick={() => setTab('mentees')} className={`bit-tab${tab === 'mentees' ? ' active' : ''}`}>
            <i className="ti ti-users" style={{ fontSize: 12, marginRight: 6 }} />
            All Mentees
          </button>
          <button onClick={() => setTab('payments')} className={`bit-tab${tab === 'payments' ? ' active' : ''}`}>
            <i className="ti ti-cash" style={{ fontSize: 12, marginRight: 6 }} />
            Pending Payments{payments.length > 0 ? ` (${payments.length})` : ''}
          </button>
        </div>

        {/* ── TAB: THIS WEEK ─────────────────────────────────────────────── */}
        {tab === 'week' && data && (
          <div
            className="bit-week-grid"
            style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14 }}
          >
            {/* Submitted */}
            <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 12, padding: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 14 }}>
                <i className="ti ti-circle-check" style={{ fontSize: 16, color: '#16a34a' }} />
                <span style={{ fontSize: 13, fontWeight: 700, color: '#15803d' }}>
                  Submitted ({data.submitted.length})
                </span>
              </div>
              {data.submitted.length === 0 ? (
                <p style={{ fontSize: 12, color: '#8A8070' }}>None yet this week.</p>
              ) : data.submitted.map((m: any) => (
                <div key={m.id} style={{ background: '#fff', border: '1px solid #d1fae5', borderRadius: 8, padding: '10px 12px', marginBottom: 8 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: '#0F1F3D', marginBottom: 2 }}>{m.name}</div>
                  <div style={{ fontSize: 11, color: '#6B6B6B' }}>{m.domainTrack}</div>
                  <div style={{ fontSize: 10, color: '#8A8070', fontFamily: 'monospace', marginTop: 2 }}>{m.accessCode}</div>
                </div>
              ))}
            </div>

            {/* Not submitted */}
            <div style={{ background: '#fffbeb', border: '1px solid #fde68a', borderRadius: 12, padding: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 14 }}>
                <i className="ti ti-clock" style={{ fontSize: 16, color: '#d97706' }} />
                <span style={{ fontSize: 13, fontWeight: 700, color: '#b45309' }}>
                  Not Submitted ({data.notSubmitted.length})
                </span>
              </div>
              {data.notSubmitted.length === 0 ? (
                <p style={{ fontSize: 12, color: '#8A8070' }}>Everyone submitted!</p>
              ) : data.notSubmitted.map((m: any) => (
                <div key={m.id} style={{ background: '#fff', border: '1px solid #fde68a', borderRadius: 8, padding: '10px 12px', marginBottom: 8 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: '#0F1F3D', marginBottom: 2 }}>{m.name}</div>
                  <div style={{ fontSize: 11, color: '#6B6B6B', marginBottom: 6 }}>Week {m.currentWeek}</div>
                  <button onClick={() => sendCheckin(m.id)} disabled={checkinLoading === m.id} className="bit-btn-gold" style={{ width: '100%', fontSize: 11, padding: '7px 12px' }}>
                    {checkinLoading === m.id ? <><i className="ti ti-loader-2 bit-spin" style={{ fontSize: 11 }} /> Sending...</> : <><i className="ti ti-send" style={{ fontSize: 11 }} /> Send Check-in</>}
                  </button>
                </div>
              ))}
            </div>

            {/* At risk */}
            <div style={{ background: '#fff5f5', border: '1px solid #fecaca', borderRadius: 12, padding: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 14 }}>
                <i className="ti ti-alert-triangle" style={{ fontSize: 16, color: '#ef4444' }} />
                <span style={{ fontSize: 13, fontWeight: 700, color: '#b91c1c' }}>
                  Needs Help ({data.atRisk.length})
                </span>
              </div>
              {data.atRisk.length === 0 ? (
                <p style={{ fontSize: 12, color: '#8A8070' }}>No one at risk.</p>
              ) : data.atRisk.map((m: any) => (
                <div key={m.id} style={{ background: '#fff', border: '1px solid #fecaca', borderRadius: 8, padding: '10px 12px', marginBottom: 8 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: '#0F1F3D', marginBottom: 2 }}>{m.name}</div>
                  <div style={{ fontSize: 11, color: '#6B6B6B', marginBottom: 2 }}>{m.domainTrack}</div>
                  <div style={{ fontSize: 11, color: '#ef4444', fontWeight: 600, marginBottom: 6 }}>{m.weeksBehind} weeks behind</div>
                  <button onClick={() => sendCheckin(m.id)} disabled={checkinLoading === m.id} className="bit-btn-gold" style={{ width: '100%', fontSize: 11, padding: '7px 12px', background: '#ef4444', color: '#fff' }}>
                    {checkinLoading === m.id ? <><i className="ti ti-loader-2 bit-spin" style={{ fontSize: 11 }} /> Sending...</> : <><i className="ti ti-send" style={{ fontSize: 11 }} /> Send Check-in</>}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── TAB: ALL MENTEES ───────────────────────────────────────────── */}
        {tab === 'mentees' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {mentees.map((m: any) => {
              const pct = m.hasStarted ? Math.round((m.currentWeek / 48) * 100) : 0
              const sc = STATUS_BADGES[m.status] || STATUS_BADGES.ON_TRACK
              return (
                <div key={m.id} style={{ background: '#fff', border: '1px solid #E8E4D9', borderRadius: 12, padding: '18px 20px' }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4, flexWrap: 'wrap' }}>
                        <span style={{ fontSize: 14, fontWeight: 700, color: '#0F1F3D' }}>{m.name}</span>
                        <span style={{ fontSize: 10, background: '#F9F7F1', border: '1px solid #E8E4D9', borderRadius: 999, padding: '2px 8px', color: '#8A8070', fontFamily: 'monospace' }}>
                          {m.accessCode}
                        </span>
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, background: sc.bg, border: `1px solid ${sc.border}`, borderRadius: 999, padding: '2px 9px', fontSize: 10, fontWeight: 600, color: sc.color }}>
                          <i className={sc.icon} style={{ fontSize: 9 }} /> {sc.label}
                        </span>
                        {m.plan === 'PREMIUM' && (
                          <span
                            title={m.planExpiresAt ? `Expires ${new Date(m.planExpiresAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}` : ''}
                            style={{ display: 'inline-flex', alignItems: 'center', gap: 4, background: '#0F1F3D', borderRadius: 999, padding: '2px 9px', fontSize: 10, fontWeight: 700, color: '#F5D87A' }}
                          >
                            <i className="ti ti-crown" style={{ fontSize: 9 }} /> Premium
                          </span>
                        )}
                        {m.plan !== 'PREMIUM' && m.pendingPaymentPlan && (
                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, background: '#FBF7EC', border: '1px solid #DFC97A', borderRadius: 999, padding: '2px 9px', fontSize: 10, fontWeight: 600, color: '#7A5C1E' }}>
                            <i className="ti ti-clock-hour-4" style={{ fontSize: 9 }} /> Pending
                          </span>
                        )}
                      </div>
                      <div style={{ fontSize: 12, color: '#6B6B6B', marginBottom: 4 }}>{m.domainTrack}</div>
                      <div style={{ fontSize: 11, color: '#8A8070', marginBottom: 10 }}>
                        {m.hasStarted ? `Week ${m.currentWeek} of 48` : 'Not started yet'} &middot; {m.submissionsCount} submissions
                      </div>
                      <div style={{ height: 5, borderRadius: 99, background: '#F0EBD8', overflow: 'hidden', maxWidth: 240 }}>
                        <div style={{ height: '100%', borderRadius: 99, background: '#C9A84C', width: `${pct}%` }} />
                      </div>
                    </div>
                    <button onClick={() => sendCheckin(m.id)} disabled={checkinLoading === m.id} className="bit-btn-gold" style={{ flexShrink: 0 }}>
                      {checkinLoading === m.id ? (
                        <><i className="ti ti-loader-2 bit-spin" style={{ fontSize: 12 }} /> Sending...</>
                      ) : (
                        <><i className="ti ti-send" style={{ fontSize: 12 }} /> Check In</>
                      )}
                    </button>
                  </div>

                  <div style={{ marginTop: 14 }}>
                    <textarea
                      value={notes[m.id] || ''}
                      onChange={e => setNotes(prev => ({ ...prev, [m.id]: e.target.value }))}
                      placeholder="Private notes about this mentee..."
                      className="bit-textarea"
                    />
                    <button
                      onClick={() => saveNotes(m.id)}
                      style={{
                        background: 'none', border: 'none', fontSize: 11, fontWeight: 700,
                        color: '#C9A84C', cursor: 'pointer', padding: '4px 0',
                        fontFamily: "'Inter', sans-serif", display: 'inline-flex', alignItems: 'center', gap: 4,
                      }}
                      onMouseEnter={e => (e.currentTarget.style.opacity = '0.7')}
                      onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
                    >
                      <i className="ti ti-device-floppy" style={{ fontSize: 11 }} /> Save notes
                    </button>
                  </div>
                </div>
              )
            })}
            {mentees.length === 0 && (
              <div style={{ padding: '48px 0', textAlign: 'center', color: '#8A8070', fontSize: 14 }}>
                <i className="ti ti-users" style={{ fontSize: 32, display: 'block', margin: '0 auto 12px', color: '#C8C0B4' }} />
                No mentees assigned yet.
              </div>
            )}
          </div>
        )}

        {/* ── TAB: PENDING PAYMENTS ───────────────────────────────────────── */}
        {tab === 'payments' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <p style={{ fontSize: 13, color: '#6B6B6B', marginBottom: 4 }}>
              Payment claims from your assigned mentees, awaiting confirmation.
            </p>
            {payments.map((p: any) => (
              <div key={p.id} style={{ background: '#fff', border: '1px solid #E8E4D9', borderRadius: 12, padding: '18px 20px' }}>
                <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12, marginBottom: 12 }}>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: '#0F1F3D', marginBottom: 3 }}>{p.name}</div>
                    <div style={{ fontSize: 12, color: '#6B6B6B' }}>{p.domainTrack} &middot; {p.email}</div>
                  </div>
                  <span style={{
                    display: 'inline-flex', alignItems: 'center', gap: 4,
                    background: '#FBF7EC', border: '1px solid #DFC97A',
                    borderRadius: 999, padding: '3px 10px', fontSize: 11, fontWeight: 700, color: '#7A5C1E', flexShrink: 0,
                  }}>
                    {p.pendingPaymentPlan === 'YEARLY' ? 'Yearly — ₦200,000' : 'Monthly — ₦20,000'}
                  </span>
                </div>

                <div style={{ background: '#F9F7F1', border: '1px solid #E8E4D9', borderRadius: 9, padding: '10px 14px', marginBottom: 14, fontSize: 12, color: '#0F1F3D' }}>
                  Reference: <span style={{ fontFamily: 'monospace' }}>{p.paymentReference}</span>
                  {p.pendingPaymentSubmittedAt && (
                    <span style={{ color: '#8A8070' }}> &middot; Submitted {new Date(p.pendingPaymentSubmittedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                  )}
                </div>

                <div style={{ display: 'flex', gap: 10 }}>
                  <button
                    onClick={() => confirmPayment(p.id, p.name)}
                    disabled={actingPaymentId === p.id}
                    className="bit-btn-gold"
                  >
                    <i className="ti ti-check" style={{ fontSize: 12 }} /> Confirm Payment
                  </button>
                  <button
                    onClick={() => rejectPayment(p.id, p.name)}
                    disabled={actingPaymentId === p.id}
                    className="bit-btn-gold"
                    style={{ background: '#fff', color: '#ef4444', border: '1px solid #fecaca' }}
                  >
                    <i className="ti ti-x" style={{ fontSize: 12 }} /> Reject
                  </button>
                </div>
              </div>
            ))}
            {payments.length === 0 && (
              <div style={{ padding: '48px 0', textAlign: 'center', color: '#8A8070', fontSize: 14 }}>
                <i className="ti ti-cash" style={{ fontSize: 32, display: 'block', margin: '0 auto 12px', color: '#C8C0B4' }} />
                No pending payments.
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  )
}
