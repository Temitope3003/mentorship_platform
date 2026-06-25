import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import { useQueryClient } from '@tanstack/react-query'
import {
  useMentorStats,
  useMentees,
  useAllSubmissions,
  useAccessCodes,
  useAddFeedback,
  useCreateMentee,
} from '../hooks/useMentor'
import toast from 'react-hot-toast'
import { api } from '../utils/api'
import { DOMAINS as DOMAIN_LIST } from '../utils/questionData'

const DOMAINS = DOMAIN_LIST.map(d => d.name)

const DOMAIN_COLORS: Record<string, string> = Object.fromEntries(
  DOMAIN_LIST.map(d => [d.name, d.color])
)

const STATUS_BADGES: Record<string, { bg: string; border: string; color: string; icon: string; label: string }> = {
  NOT_STARTED: { bg: '#F9F7F1', border: '#E8E4D9', color: '#8A8070', icon: 'ti ti-hourglass-empty', label: 'Not Started' },
  PAUSED:      { bg: '#FBF7EC', border: '#DFC97A', color: '#7A5C1E', icon: 'ti ti-player-pause',    label: 'Paused' },
  AT_RISK:     { bg: '#fff5f5', border: '#fecaca', color: '#b91c1c', icon: 'ti ti-alert-triangle',  label: 'At Risk' },
  ON_TRACK:    { bg: '#f0fdf4', border: '#bbf7d0', color: '#15803d', icon: 'ti ti-circle-check',    label: 'On Track' },
}

type Tab = 'mentees' | 'submissions' | 'codes' | 'add' | 'liaison' | 'applications'

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900;1,700;1,900&family=Inter:wght@400;500;600;700&display=swap');

  @keyframes bit-spin { to { transform: rotate(360deg); } }
  .bit-spin { animation: bit-spin 0.75s linear infinite; }

  .bit-input {
    width: 100%; border: 1px solid #E8E4D9; border-radius: 9px;
    padding: 11px 14px; font-size: 13px; font-family: 'Inter', sans-serif;
    color: #0F1F3D; background: #fff; outline: none;
    transition: border-color 0.15s, box-shadow 0.15s; box-sizing: border-box;
  }
  .bit-input:focus { border-color: #C9A84C; box-shadow: 0 0 0 3px rgba(201,168,76,0.14); }
  .bit-input::placeholder { color: #B0A898; }
  .bit-select {
    border: 1px solid #E8E4D9; border-radius: 9px;
    padding: 11px 14px; font-size: 13px; font-family: 'Inter', sans-serif;
    color: #0F1F3D; background: #fff; outline: none; cursor: pointer;
    transition: border-color 0.15s, box-shadow 0.15s;
  }
  .bit-select:focus { border-color: #C9A84C; box-shadow: 0 0 0 3px rgba(201,168,76,0.14); }

  .bit-btn-gold {
    display: inline-flex; align-items: center; gap: 7px;
    background: #C9A84C; color: #0F1F3D; border: none; border-radius: 9px;
    padding: 12px 22px; font-size: 13px; font-weight: 700;
    cursor: pointer; font-family: 'Inter', sans-serif;
    transition: opacity 0.15s, transform 0.15s;
  }
  .bit-btn-gold:hover:not(:disabled) { opacity: 0.88; transform: translateY(-1px); }
  .bit-btn-gold:disabled { opacity: 0.4; cursor: not-allowed; }

  .bit-btn-ghost {
    display: inline-flex; align-items: center; gap: 6px;
    background: #fff; color: #0F1F3D; border: 1px solid #E8E4D9; border-radius: 9px;
    padding: 11px 20px; font-size: 13px; font-weight: 600;
    cursor: pointer; font-family: 'Inter', sans-serif;
    transition: border-color 0.15s, background 0.15s;
  }
  .bit-btn-ghost:hover { border-color: #C9A84C; background: #FBF7EC; }

  .bit-btn-danger {
    background: none; border: none; color: #ef4444; font-size: 12px; font-weight: 600;
    cursor: pointer; font-family: 'Inter', sans-serif; padding: 4px 8px; border-radius: 6px;
    transition: background 0.12s;
  }
  .bit-btn-danger:hover { background: #fef2f2; }

  .bit-tab {
    padding: 11px 18px; font-size: 13px; font-weight: 600; font-family: 'Inter', sans-serif;
    border: none; background: none; cursor: pointer; border-bottom: 2px solid transparent;
    color: #8A8070; transition: color 0.15s, border-color 0.15s;
  }
  .bit-tab:hover { color: #0F1F3D; }
  .bit-tab.active { color: #C9A84C; border-bottom-color: #C9A84C; }

  .bit-table th {
    padding: 12px 16px; text-align: left; font-size: 10px; font-weight: 700;
    text-transform: uppercase; letter-spacing: 0.08em; color: #8A8070;
    border-bottom: 1px solid #E8E4D9; white-space: nowrap;
  }
  .bit-table td {
    padding: 13px 16px; font-size: 13px; color: #0F1F3D; border-bottom: 1px solid #F0EBD8;
  }
  .bit-table tr:last-child td { border-bottom: none; }
  .bit-table tr:hover td { background: #FBF7EC; }

  .bit-domain-select {
    border: 1px solid #E8E4D9; border-radius: 6px;
    padding: 5px 8px; font-size: 11px; font-weight: 600; font-family: 'Inter', sans-serif;
    background: #fff; outline: none; cursor: pointer; max-width: 160px;
    transition: border-color 0.15s;
  }
  .bit-domain-select:focus { border-color: #C9A84C; }

  @media (max-width: 768px) {
    .bit-stats-grid { grid-template-columns: 1fr 1fr !important; }
    .bit-table-wrap { overflow-x: auto; }
    .bit-header-row { flex-direction: column !important; align-items: flex-start !important; }
  }
`

export function MentorDashboard() {
  const { user } = useAuthStore()
  const [tab, setTab] = useState<Tab>('mentees')
  const [search, setSearch] = useState('')
  const [domainFilter, setDomainFilter] = useState('')
  const [feedbackModal, setFeedbackModal] = useState<{ id: string; week: number; name: string; summary: string } | null>(null)
  const [feedbackText, setFeedbackText] = useState('')
  const [addForm, setAddForm] = useState({ name: '', email: '', domain: '' })
  const [officers, setOfficers] = useState<any[]>([])

  const { data: stats } = useMentorStats()
  const { data: mentees, isLoading: menteesLoading } = useMentees()
  const { data: submissions, isLoading: subsLoading } = useAllSubmissions()
  const { data: codes } = useAccessCodes()
  const addFeedback = useAddFeedback()
  const createMentee = useCreateMentee()
  const queryClient = useQueryClient()

  useEffect(() => {
    api.get('/mentor/liaison-officers').then(res => setOfficers(res.data)).catch(() => {})
  }, [])

  const filteredMentees = (mentees || []).filter((m: any) => {
    const matchSearch = !search || m.name.toLowerCase().includes(search.toLowerCase()) || m.email.toLowerCase().includes(search.toLowerCase())
    const matchDomain = !domainFilter || m.domainTrack === domainFilter
    return matchSearch && matchDomain
  })

  async function handleAddFeedback() {
    if (!feedbackText.trim() || feedbackText.trim().length < 10) {
      toast.error('Feedback must be at least 10 characters')
      return
    }
    try {
      await addFeedback.mutateAsync({ id: feedbackModal!.id, feedback: feedbackText.trim() })
      toast.success(`Feedback sent to ${feedbackModal!.name}`)
      setFeedbackModal(null)
      setFeedbackText('')
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Failed to send feedback')
    }
  }

  async function handleCreateMentee() {
    if (!addForm.name.trim() || !addForm.email.trim() || !addForm.domain) {
      toast.error('Please fill in all fields')
      return
    }
    try {
      const result = await createMentee.mutateAsync(addForm)
      toast.success(`${result.name} added. Welcome email sent. Code: ${result.accessCode}`)
      setAddForm({ name: '', email: '', domain: '' })
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Failed to add mentee')
    }
  }

  const tabs: { id: Tab; label: string; icon: string }[] = [
    { id: 'mentees',     label: 'All Mentees',      icon: 'ti ti-users' },
    { id: 'submissions', label: 'Submissions',       icon: 'ti ti-clipboard-list' },
    { id: 'codes',       label: 'Access Codes',      icon: 'ti ti-key' },
    { id: 'add',         label: 'Add Mentee',        icon: 'ti ti-user-plus' },
    { id: 'liaison',     label: 'Liaison Officers',  icon: 'ti ti-shield' },
    ...(user?.isSuperAdmin ? [{ id: 'applications' as Tab, label: 'Applications', icon: 'ti ti-user-check' }] : []),
  ]

  return (
    <div style={{ minHeight: '100vh', background: '#F9F7F1', fontFamily: "'Inter', sans-serif", color: '#0F1F3D' }}>
      <style>{CSS}</style>

      <div style={{ maxWidth: 1080, margin: '0 auto', padding: '40px 28px 72px' }}>

        {/* ── HEADER ─────────────────────────────────────────────────────── */}
        <div className="bit-header-row" style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16, marginBottom: 32, flexWrap: 'wrap' }}>
          <div>
            <div style={{ marginBottom: 12 }}>
              <span style={{
                display: 'inline-flex', alignItems: 'center', gap: 6,
                background: 'rgba(201,168,76,0.10)', border: '1px solid rgba(201,168,76,0.25)',
                borderRadius: 999, padding: '5px 14px',
                fontSize: 11, fontWeight: 700, letterSpacing: '0.07em',
                textTransform: 'uppercase', color: '#F5D87A',
                backgroundColor: '#0F1F3D',
              }}>
                <i className="ti ti-chart-dots" style={{ fontSize: 12 }} />
                Mentor Dashboard
              </span>
            </div>
            <h1 style={{
              fontFamily: "'Playfair Display', serif", fontSize: 34,
              fontWeight: 900, color: '#0F1F3D', lineHeight: 1.15, marginBottom: 6,
            }}>
              Program Overview
            </h1>
            <p style={{ fontSize: 14, color: '#6B6B6B' }}>Welcome back, {user?.name}</p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <Link to="/mentor/analytics" className="bit-btn-ghost">
              <i className="ti ti-chart-dots-3" style={{ fontSize: 14 }} />
              Analytics
            </Link>
            <button onClick={() => setTab('add')} className="bit-btn-gold">
              <i className="ti ti-user-plus" style={{ fontSize: 14 }} />
              Add Mentee
            </button>
          </div>
        </div>

        {/* ── STATS ──────────────────────────────────────────────────────── */}
        <div
          className="bit-stats-grid"
          style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 16 }}
        >
          {[
            { label: 'Total Mentees',          value: stats?.totalMentees || 0,         icon: 'ti ti-users',          color: '#C9A84C' },
            { label: 'Submissions This Week',   value: stats?.submissionsThisWeek || 0,  icon: 'ti ti-clipboard-check', color: '#1D4A6E' },
            { label: 'Engagement Rate',         value: `${stats?.engagementRate || 0}%`, icon: 'ti ti-chart-bar',       color: '#C9A84C' },
            { label: 'At Risk',                 value: stats?.atRisk || 0,               icon: 'ti ti-alert-triangle',  color: '#ef4444' },
          ].map(stat => (
            <div key={stat.label} style={{ background: '#fff', border: '1px solid #E8E4D9', borderRadius: 12, padding: '18px 20px' }}>
              <i className={stat.icon} style={{ fontSize: 18, color: stat.color, display: 'block', marginBottom: 10 }} />
              <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 28, fontWeight: 900, color: stat.color, lineHeight: 1 }}>
                {stat.value}
              </div>
              <div style={{ fontSize: 11, color: '#8A8070', marginTop: 5, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* ── AT RISK BANNER ─────────────────────────────────────────────── */}
        {stats?.atRisk > 0 && (
          <div style={{
            marginBottom: 20, background: '#fff5f5', border: '1px solid #fecaca',
            borderRadius: 12, padding: '14px 20px',
            display: 'flex', alignItems: 'center', gap: 12,
          }}>
            <i className="ti ti-alert-triangle" style={{ fontSize: 18, color: '#ef4444', flexShrink: 0 }} />
            <div>
              <p style={{ fontSize: 13, fontWeight: 700, color: '#b91c1c', marginBottom: 2 }}>
                {stats.atRisk} mentee{stats.atRisk > 1 ? 's are' : ' is'} 2+ weeks behind
              </p>
              <p style={{ fontSize: 12, color: '#dc2626' }}>Consider sending them a personal check-in message.</p>
            </div>
          </div>
        )}

        {/* ── TABS ───────────────────────────────────────────────────────── */}
        <div style={{ display: 'flex', borderBottom: '1px solid #E8E4D9', marginBottom: 24, gap: 2, overflowX: 'auto' }}>
          {tabs.map(t => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`bit-tab${tab === t.id ? ' active' : ''}`}
            >
              <i className={t.icon} style={{ fontSize: 13, marginRight: 6 }} />
              {t.label}
            </button>
          ))}
        </div>

        {/* ── TAB: ALL MENTEES ───────────────────────────────────────────── */}
        {tab === 'mentees' && (
          <div>
            {/* Search / filter */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginBottom: 16 }}>
              <div style={{ position: 'relative' }}>
                <i className="ti ti-search" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', fontSize: 14, color: '#8A8070' }} />
                <input
                  type="text"
                  placeholder="Search by name or email..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="bit-input"
                  style={{ paddingLeft: 36, width: 240 }}
                />
              </div>
              <select
                value={domainFilter}
                onChange={e => setDomainFilter(e.target.value)}
                className="bit-select"
                style={{ width: 'auto' }}
              >
                <option value="">All domains</option>
                {DOMAINS.map(d => <option key={d}>{d}</option>)}
              </select>
            </div>

            {menteesLoading ? (
              <div style={{ padding: '48px 0', textAlign: 'center', color: '#8A8070', fontSize: 14 }}>
                <i className="ti ti-loader-2 bit-spin" style={{ fontSize: 24, color: '#C9A84C', display: 'block', margin: '0 auto 10px' }} />
                Loading mentees...
              </div>
            ) : (
              <div className="bit-table-wrap" style={{ background: '#fff', border: '1px solid #E8E4D9', borderRadius: 12, overflow: 'hidden' }}>
                <table className="bit-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr>
                      {['Mentee', 'Domain', 'Week', 'Submissions', 'Progress', 'Status', 'Assign', 'Remove'].map(h => (
                        <th key={h}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filteredMentees.map((m: any) => {
                      const color = DOMAIN_COLORS[m.domainTrack] || '#C9A84C'
                      const pct = Math.round((m.submissionsCount / 48) * 100)
                      const sc = STATUS_BADGES[m.status] || STATUS_BADGES.ON_TRACK
                      return (
                        <tr key={m.id}>
                          <td>
                            <div style={{ fontWeight: 600, fontSize: 13, color: '#0F1F3D' }}>{m.name}</div>
                            <div style={{ fontSize: 11, color: '#8A8070', fontFamily: 'monospace', marginTop: 2 }}>{m.accessCode}</div>
                          </td>
                          <td>
                            <select
                              value={m.domainTrack}
                              onChange={async (e) => {
                                try {
                                  await api.patch(`/mentor/mentees/${m.id}`, { domain: e.target.value })
                                  toast.success(`Track updated to ${e.target.value}`)
                                  queryClient.invalidateQueries({ queryKey: ['mentor'] })
                                } catch {
                                  toast.error('Failed to update track')
                                }
                              }}
                              className="bit-domain-select"
                              style={{ color }}
                            >
                              {DOMAINS.map(d => <option key={d} value={d}>{d}</option>)}
                            </select>
                          </td>
                          <td style={{ color: '#6B6B6B', fontFamily: 'monospace', fontSize: 12 }}>
                            {m.hasStarted ? `W${m.currentWeek}/48` : '—'}
                          </td>
                          <td style={{ color: '#6B6B6B', fontFamily: 'monospace', fontSize: 12 }}>
                            {m.submissionsCount}
                          </td>
                          <td>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                              <div style={{ height: 5, width: 80, borderRadius: 99, background: '#F0EBD8', overflow: 'hidden', flexShrink: 0 }}>
                                <div style={{ height: '100%', borderRadius: 99, background: color, width: `${pct}%` }} />
                              </div>
                              <span style={{ fontSize: 11, color: '#8A8070', fontFamily: 'monospace' }}>{pct}%</span>
                            </div>
                          </td>
                          <td>
                            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, background: sc.bg, border: `1px solid ${sc.border}`, borderRadius: 999, padding: '3px 10px', fontSize: 11, fontWeight: 600, color: sc.color }}>
                              <i className={sc.icon} style={{ fontSize: 10 }} /> {sc.label}
                            </span>
                          </td>
                          <td>
                            <select
                              defaultValue={m.liaisonOfficerId || ''}
                              onChange={async (e) => {
                                try {
                                  await api.patch(`/mentor/mentees/${m.id}/assign`, { officerId: e.target.value || null })
                                  toast.success('Mentee assigned')
                                  queryClient.invalidateQueries({ queryKey: ['mentor'] })
                                } catch {
                                  toast.error('Failed to assign mentee')
                                }
                              }}
                              className="bit-domain-select"
                              style={{ color: '#0F1F3D' }}
                            >
                              <option value="">Unassigned</option>
                              {officers.map((o: any) => (
                                <option key={o.id} value={o.id}>{o.name}</option>
                              ))}
                            </select>
                          </td>
                          <td>
                            <button
                              onClick={async () => {
                                if (!confirm(`Remove ${m.name} from the program?`)) return
                                try {
                                  await api.patch(`/mentor/mentees/${m.id}/deactivate`)
                                  toast.success(`${m.name} removed`)
                                  queryClient.invalidateQueries({ queryKey: ['mentor'] })
                                } catch {
                                  toast.error('Failed to remove mentee')
                                }
                              }}
                              className="bit-btn-danger"
                            >
                              Remove
                            </button>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
                {filteredMentees.length === 0 && (
                  <div style={{ padding: '48px 0', textAlign: 'center', color: '#8A8070', fontSize: 14 }}>
                    <i className="ti ti-users-minus" style={{ fontSize: 32, display: 'block', margin: '0 auto 12px', color: '#C8C0B4' }} />
                    No mentees found.
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* ── TAB: SUBMISSIONS ───────────────────────────────────────────── */}
        {tab === 'submissions' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {subsLoading ? (
              <div style={{ padding: '48px 0', textAlign: 'center', color: '#8A8070' }}>
                <i className="ti ti-loader-2 bit-spin" style={{ fontSize: 24, color: '#C9A84C', display: 'block', margin: '0 auto 10px' }} />
                Loading submissions...
              </div>
            ) : submissions?.length === 0 ? (
              <div style={{ padding: '48px 0', textAlign: 'center', color: '#8A8070', fontSize: 14 }}>
                <i className="ti ti-clipboard" style={{ fontSize: 32, display: 'block', margin: '0 auto 12px', color: '#C8C0B4' }} />
                No submissions yet.
              </div>
            ) : submissions?.map((s: any) => {
              const color = DOMAIN_COLORS[s.mentee?.domainTrack] || '#C9A84C'
              return (
                <div key={s.id} style={{ background: '#fff', border: '1px solid #E8E4D9', borderRadius: 12, padding: '20px 22px' }}>
                  {/* Submission header */}
                  <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 10, marginBottom: 14 }}>
                    <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 10 }}>
                      <span style={{ fontSize: 14, fontWeight: 700, color: '#0F1F3D' }}>{s.mentee?.name}</span>
                      <span style={{
                        display: 'inline-flex', alignItems: 'center', gap: 4,
                        background: color + '14', border: `1px solid ${color}30`,
                        borderRadius: 999, padding: '3px 10px', fontSize: 11, fontWeight: 600, color,
                      }}>
                        {s.mentee?.domainTrack}
                      </span>
                      <span style={{
                        display: 'inline-flex', alignItems: 'center', gap: 4,
                        background: '#FBF7EC', border: '1px solid #DFC97A',
                        borderRadius: 999, padding: '3px 10px', fontSize: 11, fontWeight: 700, color: '#7A5C1E',
                      }}>
                        Week {s.weekNumber}
                      </span>
                    </div>
                    <span style={{ fontSize: 11, color: '#8A8070' }}>
                      {new Date(s.submittedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>

                  {/* Learned */}
                  <div style={{ background: '#F9F7F1', border: '1px solid #E8E4D9', borderRadius: 9, padding: '12px 16px', marginBottom: 10 }}>
                    <div style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#8A8070', marginBottom: 5 }}>
                      What they learned
                    </div>
                    <p style={{ fontSize: 13, lineHeight: 1.7, color: '#3A3A3A' }}>{s.summary}</p>
                  </div>

                  {/* Built */}
                  <div style={{ background: '#F9F7F1', border: '1px solid #E8E4D9', borderRadius: 9, padding: '12px 16px', marginBottom: 10 }}>
                    <div style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#8A8070', marginBottom: 5 }}>
                      What they built
                    </div>
                    <p style={{ fontSize: 13, lineHeight: 1.7, color: '#3A3A3A' }}>{s.workDone}</p>
                  </div>

                  {s.link && (
                    <div style={{ marginBottom: 10 }}>
                      <a
                        href={s.link} target="_blank" rel="noopener noreferrer"
                        style={{ fontSize: 13, color: '#C9A84C', textDecoration: 'underline', display: 'inline-flex', alignItems: 'center', gap: 5 }}
                      >
                        <i className="ti ti-external-link" style={{ fontSize: 12 }} /> {s.link}
                      </a>
                    </div>
                  )}

                  {s.mentorFeedback ? (
                    <div style={{ background: 'rgba(29,74,110,0.06)', border: '1px solid rgba(29,74,110,0.15)', borderRadius: 9, padding: '12px 16px' }}>
                      <div style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#1D4A6E', marginBottom: 5, display: 'flex', alignItems: 'center', gap: 5 }}>
                        <i className="ti ti-circle-check" style={{ fontSize: 11 }} /> Feedback sent
                      </div>
                      <p style={{ fontSize: 13, color: '#3A3A3A', lineHeight: 1.7 }}>{s.mentorFeedback}</p>
                    </div>
                  ) : (
                    <button
                      onClick={() => { setFeedbackModal({ id: s.id, week: s.weekNumber, name: s.mentee?.name, summary: s.summary }); setFeedbackText('') }}
                      className="bit-btn-ghost"
                      style={{ fontSize: 12 }}
                    >
                      <i className="ti ti-message-plus" style={{ fontSize: 13 }} />
                      Add Feedback
                    </button>
                  )}
                </div>
              )
            })}
          </div>
        )}

        {/* ── TAB: ACCESS CODES ──────────────────────────────────────────── */}
        {tab === 'codes' && (
          <div>
            <p style={{ fontSize: 13, color: '#6B6B6B', marginBottom: 16 }}>
              Share each code privately with the corresponding mentee. They enter it on the login screen.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {(codes || []).map((m: any) => {
                const color = DOMAIN_COLORS[m.domainTrack] || '#C9A84C'
                return (
                  <div key={m.id} style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    background: '#fff', border: '1px solid #E8E4D9', borderRadius: 12, padding: '16px 20px', gap: 16
                  }}>
                    <div>
                      <div style={{ fontFamily: 'monospace', fontSize: 18, fontWeight: 700, color: '#0F1F3D', letterSpacing: '0.12em', marginBottom: 6 }}>
                        {m.accessCode}
                      </div>
                      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 8, fontSize: 12 }}>
                        <span style={{ fontWeight: 600, color: '#0F1F3D' }}>{m.name}</span>
                        <span style={{ color: '#C8C0B4' }}>·</span>
                        <span style={{ color }}>{m.domainTrack}</span>
                        <span style={{ color: '#C8C0B4' }}>·</span>
                        <span style={{ color: '#8A8070' }}>{m.email}</span>
                      </div>
                    </div>
                    <button
                      onClick={() => { navigator.clipboard.writeText(m.accessCode); toast.success('Code copied') }}
                      className="bit-btn-ghost"
                      style={{ flexShrink: 0, fontSize: 12 }}
                    >
                      <i className="ti ti-copy" style={{ fontSize: 13 }} />
                      Copy
                    </button>
                  </div>
                )
              })}
              {(!codes || codes.length === 0) && (
                <div style={{ padding: '48px 0', textAlign: 'center', color: '#8A8070', fontSize: 14 }}>
                  <i className="ti ti-key" style={{ fontSize: 32, display: 'block', margin: '0 auto 12px', color: '#C8C0B4' }} />
                  No access codes yet.
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── TAB: ADD MENTEE ────────────────────────────────────────────── */}
        {tab === 'add' && (
          <div style={{ maxWidth: 480, margin: '0 auto' }}>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 26, fontWeight: 900, color: '#0F1F3D', marginBottom: 6 }}>
              Add New Mentee
            </h2>
            <p style={{ fontSize: 13, color: '#6B6B6B', marginBottom: 24 }}>
              An access code is generated automatically and the welcome email is sent immediately.
            </p>
            <div style={{ background: '#fff', border: '1px solid #E8E4D9', borderRadius: 14, padding: '28px 28px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>

                <div>
                  <label style={{ display: 'block', fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#8A8070', marginBottom: 7 }}>
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={addForm.name}
                    onChange={e => setAddForm(p => ({ ...p, name: e.target.value }))}
                    placeholder="e.g. Amara Johnson"
                    className="bit-input"
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#8A8070', marginBottom: 7 }}>
                    Email
                  </label>
                  <input
                    type="email"
                    value={addForm.email}
                    onChange={e => setAddForm(p => ({ ...p, email: e.target.value }))}
                    placeholder="e.g. amara@email.com"
                    className="bit-input"
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#8A8070', marginBottom: 7 }}>
                    Domain Track
                  </label>
                  <select
                    value={addForm.domain}
                    onChange={e => setAddForm(p => ({ ...p, domain: e.target.value }))}
                    className="bit-select"
                    style={{ width: '100%' }}
                  >
                    <option value="">Select a domain</option>
                    {DOMAINS.map(d => <option key={d}>{d}</option>)}
                  </select>
                </div>

                <button
                  onClick={handleCreateMentee}
                  disabled={createMentee.isPending}
                  className="bit-btn-gold"
                  style={{ justifyContent: 'center', width: '100%', paddingTop: 14, paddingBottom: 14, fontSize: 14 }}
                >
                  {createMentee.isPending ? (
                    <><i className="ti ti-loader-2 bit-spin" style={{ fontSize: 15 }} /> Adding...</>
                  ) : (
                    <><i className="ti ti-send" style={{ fontSize: 15 }} /> Generate Code &amp; Send Welcome Email</>
                  )}
                </button>

              </div>
            </div>
          </div>
        )}

        {/* ── TAB: LIAISON OFFICERS ──────────────────────────────────────── */}
        {tab === 'liaison' && <LiaisonOfficersTab onOfficersChange={setOfficers} />}

        {/* ── TAB: APPLICATIONS (super-admin only) ───────────────────────── */}
        {tab === 'applications' && user?.isSuperAdmin && <ApplicationsTab />}

      </div>

      {/* ── FEEDBACK MODAL ─────────────────────────────────────────────── */}
      {feedbackModal && (
        <div
          style={{
            position: 'fixed', inset: 0, zIndex: 50,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: 'rgba(15,31,61,0.55)', backdropFilter: 'blur(4px)', padding: 24,
          }}
          onClick={e => { if (e.target === e.currentTarget) { setFeedbackModal(null); setFeedbackText('') } }}
        >
          <div style={{
            background: '#fff', borderRadius: 16, padding: '28px 28px',
            width: '100%', maxWidth: 520, boxShadow: '0 20px 60px rgba(15,31,61,0.18)',
            fontFamily: "'Inter', sans-serif",
          }}>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, fontWeight: 900, color: '#0F1F3D', marginBottom: 4 }}>
              Add Feedback
            </h2>
            <p style={{ fontSize: 13, color: '#6B6B6B', marginBottom: 16 }}>
              {feedbackModal.name} — Week {feedbackModal.week}
            </p>

            <div style={{ background: '#F9F7F1', border: '1px solid #E8E4D9', borderRadius: 9, padding: '12px 16px', marginBottom: 16 }}>
              <div style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#8A8070', marginBottom: 5 }}>Their summary</div>
              <p style={{ fontSize: 13, color: '#3A3A3A', lineHeight: 1.7 }}>{feedbackModal.summary}</p>
            </div>

            <div style={{ marginBottom: 20 }}>
              <label style={{ display: 'block', fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#8A8070', marginBottom: 7 }}>
                Your Feedback
              </label>
              <textarea
                value={feedbackText}
                onChange={e => setFeedbackText(e.target.value)}
                placeholder="Be specific and encouraging. What did they do well? What should they focus on next week?"
                rows={4}
                className="bit-input"
                style={{ resize: 'none' }}
              />
            </div>

            <div style={{ display: 'flex', gap: 10 }}>
              <button
                onClick={handleAddFeedback}
                disabled={addFeedback.isPending}
                className="bit-btn-gold"
                style={{ flex: 1, justifyContent: 'center', fontSize: 14 }}
              >
                {addFeedback.isPending ? (
                  <><i className="ti ti-loader-2 bit-spin" style={{ fontSize: 14 }} /> Sending...</>
                ) : (
                  <><i className="ti ti-send" style={{ fontSize: 14 }} /> Send Feedback</>
                )}
              </button>
              <button
                onClick={() => { setFeedbackModal(null); setFeedbackText('') }}
                className="bit-btn-ghost"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function LiaisonOfficersTab({ onOfficersChange }: { onOfficersChange: (officers: any[]) => void }) {
  const [officers, setOfficers] = useState<any[]>([])
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const load = async () => {
    try {
      const res = await api.get('/mentor/liaison-officers?t=${Date.now()}')
      setOfficers(res.data)
      onOfficersChange(res.data)
    } catch {}
  }

  useEffect(() => { load() }, [])

  const create = async () => {
    setError('')
    if (!name || !email || !password) { setError('All fields are required'); return }
    setLoading(true)
    try {
      await api.post('/mentor/liaison-officers', { name, email, password })
      setName(''); setEmail(''); setPassword('')
      load()
      toast.success('Liaison officer created successfully')
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to create officer')
    }
    setLoading(false)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Create form */}
      <div style={{ background: '#fff', border: '1px solid #E8E4D9', borderRadius: 14, padding: '22px 24px' }}>
        <h3 style={{ fontSize: 15, fontWeight: 700, color: '#0F1F3D', marginBottom: 4 }}>Add Liaison Officer</h3>
        <p style={{ fontSize: 13, color: '#6B6B6B', marginBottom: 16 }}>
          Liaison officers manage a group of mentees and receive weekly reports every Monday.
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 10, marginBottom: 12 }}>
          <input
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="Full name"
            className="bit-input"
          />
          <input
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="Email address"
            className="bit-input"
          />
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="Password"
            className="bit-input"
          />
        </div>
        {error && (
          <p style={{ fontSize: 12, color: '#ef4444', marginBottom: 10, display: 'flex', alignItems: 'center', gap: 5 }}>
            <i className="ti ti-alert-circle" style={{ fontSize: 12 }} /> {error}
          </p>
        )}
        <button onClick={create} disabled={loading} className="bit-btn-gold">
          {loading ? (
            <><i className="ti ti-loader-2 bit-spin" style={{ fontSize: 13 }} /> Creating...</>
          ) : (
            <><i className="ti ti-shield-plus" style={{ fontSize: 13 }} /> Create Officer</>
          )}
        </button>
      </div>

      {/* Officers list */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {officers.map(o => (
          <div key={o.id} style={{
            background: '#fff', border: '1px solid #E8E4D9', borderRadius: 12, padding: '18px 22px',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap',
          }}>
            <div>
              <div style={{ fontSize: 14, fontWeight: 700, color: '#0F1F3D', marginBottom: 3 }}>{o.name}</div>
              <div style={{ fontSize: 12, color: '#6B6B6B', marginBottom: 2 }}>{o.email}</div>
              <div style={{ fontSize: 11, color: '#8A8070' }}>Logs in at buildintech.xyz/liaison/login</div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 20, flexShrink: 0 }}>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 28, fontWeight: 900, color: '#C9A84C', lineHeight: 1 }}>
                  {o.menteeCount}
                </div>
                <div style={{ fontSize: 11, color: '#8A8070', marginTop: 2 }}>mentees</div>
              </div>
              <button
                onClick={async () => {
                  if (!confirm(`Remove ${o.name} as liaison officer?`)) return
                  try {
                    await api.patch(`/mentor/liaison-officers/${o.id}/deactivate`)
                    toast.success(`${o.name} removed`)
                    const updated = officers.filter((x: any) => x.id !== o.id)
                    setOfficers(updated)
                    onOfficersChange(updated)
                  } catch {
                    toast.error('Failed to remove officer')
                  }
                }}
                className="bit-btn-danger"
              >
                Remove
              </button>
            </div>
          </div>
        ))}
        {officers.length === 0 && (
          <div style={{ padding: '48px 0', textAlign: 'center', color: '#8A8070', fontSize: 14 }}>
            <i className="ti ti-shield" style={{ fontSize: 32, display: 'block', margin: '0 auto 12px', color: '#C8C0B4' }} />
            No liaison officers yet. Add one above.
          </div>
        )}
      </div>
    </div>
  )
}

function ApplicationsTab() {
  const [applications, setApplications] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [actingId, setActingId] = useState<string | null>(null)

  const load = async () => {
    try {
      const res = await api.get('/mentor/applications')
      setApplications(res.data)
    } catch {
      toast.error('Failed to load applications')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  async function handleApprove(id: string, name: string) {
    setActingId(id)
    try {
      await api.patch(`/mentor/applications/${id}/approve`)
      toast.success(`${name} approved. Welcome email sent.`)
      setApplications(prev => prev.filter(a => a.id !== id))
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Failed to approve application')
    } finally {
      setActingId(null)
    }
  }

  async function handleReject(id: string, name: string) {
    if (!confirm(`Reject ${name}'s mentor application?`)) return
    setActingId(id)
    try {
      await api.patch(`/mentor/applications/${id}/reject`)
      toast.success(`${name} rejected.`)
      setApplications(prev => prev.filter(a => a.id !== id))
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Failed to reject application')
    } finally {
      setActingId(null)
    }
  }

  if (loading) {
    return (
      <div style={{ padding: '48px 0', textAlign: 'center', color: '#8A8070' }}>
        <i className="ti ti-loader-2 bit-spin" style={{ fontSize: 24, color: '#C9A84C', display: 'block', margin: '0 auto 10px' }} />
        Loading applications...
      </div>
    )
  }

  return (
    <div>
      <p style={{ fontSize: 13, color: '#6B6B6B', marginBottom: 16 }}>
        Pending mentor applications. Approving sends a welcome email with their login link; rejecting sends a polite notice.
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {applications.map(a => (
          <div key={a.id} style={{ background: '#fff', border: '1px solid #E8E4D9', borderRadius: 12, padding: '20px 22px' }}>
            <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12, marginBottom: 12 }}>
              <div>
                <div style={{ fontSize: 15, fontWeight: 700, color: '#0F1F3D', marginBottom: 3 }}>{a.name}</div>
                <div style={{ fontSize: 13, color: '#6B6B6B' }}>{a.email}</div>
              </div>
              <span style={{
                display: 'inline-flex', alignItems: 'center', gap: 4,
                background: '#FBF7EC', border: '1px solid #DFC97A',
                borderRadius: 999, padding: '4px 11px', fontSize: 11, fontWeight: 700, color: '#7A5C1E', flexShrink: 0,
              }}>
                <i className="ti ti-calendar" style={{ fontSize: 11 }} />
                Applied {new Date(a.appliedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
              </span>
            </div>

            {a.applicationNote && (
              <div style={{ background: '#F9F7F1', border: '1px solid #E8E4D9', borderRadius: 9, padding: '12px 16px', marginBottom: 16 }}>
                <div style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#8A8070', marginBottom: 5 }}>
                  Why they want to mentor
                </div>
                <p style={{ fontSize: 13, lineHeight: 1.7, color: '#3A3A3A' }}>{a.applicationNote}</p>
              </div>
            )}

            <div style={{ display: 'flex', gap: 10 }}>
              <button
                onClick={() => handleApprove(a.id, a.name)}
                disabled={actingId === a.id}
                className="bit-btn-gold"
                style={{ fontSize: 12 }}
              >
                <i className="ti ti-check" style={{ fontSize: 13 }} /> Approve
              </button>
              <button
                onClick={() => handleReject(a.id, a.name)}
                disabled={actingId === a.id}
                className="bit-btn-ghost"
                style={{ fontSize: 12, color: '#ef4444', borderColor: '#fecaca' }}
              >
                <i className="ti ti-x" style={{ fontSize: 13 }} /> Reject
              </button>
            </div>
          </div>
        ))}
        {applications.length === 0 && (
          <div style={{ padding: '48px 0', textAlign: 'center', color: '#8A8070', fontSize: 14 }}>
            <i className="ti ti-user-check" style={{ fontSize: 32, display: 'block', margin: '0 auto 12px', color: '#C8C0B4' }} />
            No pending applications.
          </div>
        )}
      </div>
    </div>
  )
}
