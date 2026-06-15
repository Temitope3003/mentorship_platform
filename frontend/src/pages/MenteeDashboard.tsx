import { useState } from 'react'
import { useAuthStore } from '../store/authStore'
import { useMenteeStats, useMenteeRoadmap, useCreateSubmission } from '../hooks/useMentee'
import toast from 'react-hot-toast'
import { api } from '../utils/api'

const DOMAIN_COLORS: Record<string, string> = {
  'AI & Machine Learning': '#ff6b2b',
  'Data Analysis': '#2563eb',
  'Data Science & Engineering': '#7c3aed',
  'Full Stack Engineering': '#0891b2',
  'Frontend Development': '#f59e0b',
  'Backend Development': '#059669',
  'Cloud & Infrastructure': '#6366f1',
  'Cybersecurity': '#ef4444',
  'Product, Design & UX': '#ec4899',
  'Emerging Tech': '#14b8a6',
  'Virtual Assistant': '#84cc16',
  'AI Automation & No-Code': '#f97316',
  'DevRel & Technical Writing': '#8b5cf6',
  'Mobile Development': '#06b6d4',
}

const DOMAINS = [
  'AI & Machine Learning', 'Data Analysis', 'Data Science & Engineering',
  'Full Stack Engineering', 'Frontend Development', 'Backend Development',
  'Cloud & Infrastructure', 'Cybersecurity', 'Product, Design & UX',
  'Emerging Tech', 'Virtual Assistant', 'AI Automation & No-Code',
  'DevRel & Technical Writing', 'Mobile Development',
]

interface SubmissionFormData {
  summary: string
  workDone: string
  link: string
}

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900;1,700;1,900&family=Inter:wght@400;500;600;700&display=swap');

  @keyframes bit-spin { to { transform: rotate(360deg); } }
  .bit-spin { animation: bit-spin 0.75s linear infinite; }

  .bit-week-btn {
    width: 100%; display: flex; align-items: center; justify-content: space-between;
    padding: 16px 20px; text-align: left; background: none; border: none;
    cursor: pointer; font-family: 'Inter', sans-serif; transition: background 0.15s;
  }
  .bit-week-btn:hover { background: #F9F7F1; }
  .bit-week-btn.locked { cursor: default; opacity: 0.5; pointer-events: none; }

  .bit-input {
    width: 100%; border: 1px solid #E8E4D9; border-radius: 9px;
    padding: 11px 14px; font-size: 13px; font-family: 'Inter', sans-serif;
    color: #0F1F3D; background: #fff; outline: none;
    transition: border-color 0.15s, box-shadow 0.15s; resize: none; box-sizing: border-box;
  }
  .bit-input:focus { border-color: #C9A84C; box-shadow: 0 0 0 3px rgba(201,168,76,0.14); }
  .bit-input::placeholder { color: #B0A898; }

  .bit-btn-gold {
    display: inline-flex; align-items: center; gap: 7px;
    background: #C9A84C; color: #0F1F3D; border: none; border-radius: 9px;
    padding: 12px 24px; font-size: 13px; font-weight: 700;
    cursor: pointer; font-family: 'Inter', sans-serif;
    transition: opacity 0.15s, transform 0.15s;
  }
  .bit-btn-gold:hover:not(:disabled) { opacity: 0.88; transform: translateY(-1px); }
  .bit-btn-gold:disabled { opacity: 0.4; cursor: not-allowed; }

  .bit-chevron { transition: transform 0.2s ease; display: inline-block; }
  .bit-chevron.open { transform: rotate(180deg); }

  .bit-track-select {
    border: 1px solid #DFC97A; border-radius: 8px; padding: 8px 12px;
    font-size: 13px; font-family: 'Inter', sans-serif; color: #7A5C1E;
    background: #fff; outline: none; cursor: pointer;
  }
  .bit-track-select:focus { box-shadow: 0 0 0 2px rgba(201,168,76,0.2); }
  .bit-track-select:disabled { opacity: 0.5; }

  @media (max-width: 640px) {
    .bit-stats-grid { grid-template-columns: 1fr 1fr !important; }
    .bit-week-btn { padding: 14px 14px !important; }
    .bit-week-label { display: none; }
  }
`

export function MenteeDashboard() {
  const { user } = useAuthStore()
  const { data: stats, isLoading: statsLoading } = useMenteeStats()
  const { data: roadmap, isLoading: roadmapLoading } = useMenteeRoadmap()
  const createSubmission = useCreateSubmission()
  const [openWeek, setOpenWeek] = useState<number | null>(null)
  const [forms, setForms] = useState<Record<number, SubmissionFormData>>({})
  const [submitting, setSubmitting] = useState<number | null>(null)
  const [trackChanging, setTrackChanging] = useState(false)

  const domainColor = DOMAIN_COLORS[user?.domain || ''] || '#C9A84C'
  const firstName = user?.name?.split(' ')[0] || 'there'
  const hasSubmissions = (stats?.weeksSubmitted || 0) > 0

  function toggleWeek(week: number) {
    setOpenWeek(prev => prev === week ? null : week)
  }

  function updateForm(week: number, field: keyof SubmissionFormData, value: string) {
    setForms(prev => ({
      ...prev,
      [week]: {
        ...prev[week],
        summary: prev[week]?.summary || '',
        workDone: prev[week]?.workDone || '',
        link: prev[week]?.link || '',
        [field]: value,
      },
    }))
  }

  async function handleTrackChange(domain: string) {
    if (domain === user?.domain) return
    setTrackChanging(true)
    try {
      await api.patch('/mentee/me/track', { domain })
      const { token, setAuth } = useAuthStore.getState()
      setAuth(token!, { ...user!, domain })
      toast.success('Track updated. Reloading your curriculum...')
      setTimeout(() => window.location.reload(), 1500)
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Failed to update track')
    }
    setTrackChanging(false)
  }

  async function handleSubmit(weekNumber: number) {
    const form = forms[weekNumber]
    if (!form?.summary || form.summary.trim().length < 20) {
      toast.error('Please write at least 20 characters in your summary')
      return
    }
    if (!form?.workDone || form.workDone.trim().length < 20) {
      toast.error('Please write at least 20 characters about what you built')
      return
    }
    setSubmitting(weekNumber)
    try {
      await createSubmission.mutateAsync({
        weekNumber,
        summary: form.summary.trim(),
        workDone: form.workDone.trim(),
        link: form.link?.trim() || undefined,
      })
      toast.success(`Week ${weekNumber} submitted successfully`)
      setForms(prev => { const n = { ...prev }; delete n[weekNumber]; return n })
      setOpenWeek(null)
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Failed to submit')
    } finally {
      setSubmitting(null)
    }
  }

  // ── Loading ──────────────────────────────────────────────────────────────────
  if (statsLoading || roadmapLoading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#F9F7F1', fontFamily: "'Inter', sans-serif" }}>
        <style>{CSS}</style>
        <div style={{ textAlign: 'center' }}>
          <div className="bit-spin" style={{ width: 36, height: 36, border: '3px solid #E8E4D9', borderTopColor: '#C9A84C', borderRadius: '50%', margin: '0 auto 16px' }} />
          <p style={{ color: '#6B6B6B', fontSize: 14 }}>Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  const weeks = roadmap?.weeks || []
  const currentWeek = stats?.currentWeek || 1

  // ── Main render ──────────────────────────────────────────────────────────────
  return (
    <div style={{ minHeight: '100vh', background: '#F9F7F1', fontFamily: "'Inter', sans-serif", color: '#0F1F3D' }}>
      <style>{CSS}</style>

      <div style={{ maxWidth: 780, margin: '0 auto', padding: '40px 28px 72px' }}>

        {/* ── HEADER ─────────────────────────────────────────────────────── */}
        <div style={{ marginBottom: 32 }}>

          {/* Domain track pill */}
          <div style={{ marginBottom: 14 }}>
            <span style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              background: domainColor + '14', border: `1px solid ${domainColor}30`,
              borderRadius: 999, padding: '5px 14px',
              fontSize: 11, fontWeight: 700, letterSpacing: '0.07em',
              textTransform: 'uppercase', color: domainColor,
            }}>
              <i className="ti ti-route" style={{ fontSize: 12 }} />
              {user?.domain}
            </span>
          </div>

          <h1 style={{
            fontFamily: "'Playfair Display', serif", fontSize: 36,
            fontWeight: 900, color: '#0F1F3D', lineHeight: 1.15, marginBottom: 6,
          }}>
            Welcome back, {firstName}
          </h1>
          <p style={{ fontSize: 14, color: '#6B6B6B' }}>
            Week {currentWeek} of 48 &middot; {stats?.currentPhase}
          </p>

          {/* Track change — only before first submission */}
          {!hasSubmissions && (
            <div style={{
              marginTop: 16, display: 'inline-flex', alignItems: 'center', gap: 12,
              background: '#FBF7EC', border: '1px solid #DFC97A', borderRadius: 10,
              padding: '12px 16px', flexWrap: 'wrap',
            }}>
              <i className="ti ti-route" style={{ fontSize: 16, color: '#C9A84C' }} />
              <span style={{ fontSize: 13, color: '#7A5C1E', fontWeight: 500 }}>Change your track:</span>
              <select
                defaultValue={user?.domain || ''}
                onChange={e => handleTrackChange(e.target.value)}
                disabled={trackChanging}
                className="bit-track-select"
              >
                {DOMAINS.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
              {trackChanging && (
                <span style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, color: '#7A5C1E' }}>
                  <i className="ti ti-loader-2 bit-spin" style={{ fontSize: 13 }} /> Updating...
                </span>
              )}
            </div>
          )}

          {/* Track locked badge */}
          {hasSubmissions && (
            <div style={{
              marginTop: 12, display: 'inline-flex', alignItems: 'center', gap: 6,
              background: '#F0EBD8', border: '1px solid #E8E4D9', borderRadius: 999,
              padding: '5px 14px', fontSize: 12, color: '#8A8070',
            }}>
              <i className="ti ti-lock" style={{ fontSize: 12 }} />
              Track locked after first submission
            </div>
          )}
        </div>

        {/* ── STATS ROW ──────────────────────────────────────────────────── */}
        <div
          className="bit-stats-grid"
          style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 12, marginBottom: 16 }}
        >
          {[
            { label: 'Current Week', value: stats?.currentWeek ?? 0,           icon: 'ti ti-calendar',      color: '#C9A84C' },
            { label: 'Submitted',    value: stats?.weeksSubmitted ?? 0,         icon: 'ti ti-circle-check',  color: '#1D4A6E' },
            { label: 'Remaining',    value: stats?.weeksRemaining ?? 48,        icon: 'ti ti-clock',         color: '#6B6B6B' },
            { label: 'Complete',     value: `${stats?.completionPct ?? 0}%`,    icon: 'ti ti-chart-bar',     color: '#C9A84C' },
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

        {/* ── PHASE PROGRESS ─────────────────────────────────────────────── */}
        <div style={{ background: '#fff', border: '1px solid #E8E4D9', borderRadius: 12, padding: '18px 22px', marginBottom: 28 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <i className="ti ti-map" style={{ fontSize: 15, color: '#C9A84C' }} />
              <span style={{ fontFamily: "'Playfair Display', serif", fontSize: 15, fontWeight: 700, color: '#0F1F3D' }}>
                {stats?.currentPhase}
              </span>
            </div>
            <span style={{ fontSize: 13, fontWeight: 700, color: '#C9A84C' }}>
              {stats?.phaseProgress || 0}%
            </span>
          </div>
          <div style={{ height: 6, borderRadius: 99, background: '#F0EBD8', overflow: 'hidden' }}>
            <div style={{
              height: '100%', borderRadius: 99, background: '#C9A84C',
              width: `${stats?.phaseProgress || 0}%`, transition: 'width 0.7s ease',
            }} />
          </div>
        </div>

        {/* ── WEEKLY ASSIGNMENTS LABEL ────────────────────────────────────── */}
        <div style={{ marginBottom: 12 }}>
          <span style={{
            display: 'inline-flex', alignItems: 'center', gap: 7,
            background: '#FBF7EC', border: '1px solid #DFC97A', borderRadius: 999,
            padding: '5px 14px', fontSize: 11, fontWeight: 700,
            letterSpacing: '0.07em', textTransform: 'uppercase', color: '#7A5C1E',
          }}>
            <i className="ti ti-list-check" style={{ fontSize: 12 }} />
            Weekly Assignments
          </span>
        </div>

        {/* ── WEEK CARDS ─────────────────────────────────────────────────── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {weeks.map((week: any) => {
            const isOpen = openWeek === week.week
            const form = forms[week.week] || { summary: '', workDone: '', link: '' }

            // Status badge config
            let statusBg     = '#F9F7F1'
            let statusBorder = '#E8E4D9'
            let statusColor  = '#8A8070'
            let statusIcon   = 'ti ti-clock'
            let statusLabel  = 'Upcoming'

            if (week.isSubmitted) {
              statusBg = 'rgba(29,74,110,0.07)'; statusBorder = 'rgba(29,74,110,0.2)'
              statusColor = '#1D4A6E'; statusIcon = 'ti ti-circle-check'; statusLabel = 'Submitted'
            } else if (week.isCurrent) {
              statusBg = '#FBF7EC'; statusBorder = '#DFC97A'
              statusColor = '#7A5C1E'; statusIcon = 'ti ti-pencil'; statusLabel = 'This week'
            } else if (!week.isLocked) {
              statusBg = '#FEF9EC'; statusBorder = '#F5D87A'
              statusColor = '#92681A'; statusIcon = 'ti ti-alert-triangle'; statusLabel = 'Missed'
            }

            return (
              <div
                key={week.week}
                style={{
                  background: '#fff',
                  border: `1px solid ${week.isCurrent ? '#DFC97A' : '#E8E4D9'}`,
                  borderRadius: 12,
                  overflow: 'hidden',
                }}
              >
                {/* Row header */}
                <button
                  onClick={() => !week.isLocked && toggleWeek(week.week)}
                  className={`bit-week-btn${week.isLocked ? ' locked' : ''}`}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 14, flex: 1, minWidth: 0 }}>
                    {/* Week badge */}
                    <span style={{
                      background: '#0F1F3D', color: '#C9A84C',
                      borderRadius: 7, padding: '4px 10px',
                      fontSize: 11, fontWeight: 700, letterSpacing: '0.04em',
                      flexShrink: 0,
                    }}>
                      W{week.week}
                    </span>
                    <div style={{ minWidth: 0 }}>
                      <div style={{ fontSize: 13, fontWeight: 600, color: '#0F1F3D', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {week.title}
                      </div>
                      <div style={{ fontSize: 11, color: '#8A8070', marginTop: 2 }}>{week.phase}</div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0, marginLeft: 14 }}>
                    {/* Status badge */}
                    <span style={{
                      display: 'inline-flex', alignItems: 'center', gap: 5,
                      background: statusBg, border: `1px solid ${statusBorder}`,
                      color: statusColor, borderRadius: 999,
                      padding: '4px 11px', fontSize: 11, fontWeight: 600,
                    }}>
                      <i className={statusIcon} style={{ fontSize: 11 }} />
                      <span className="bit-week-label">{statusLabel}</span>
                    </span>

                    {!week.isLocked && (
                      <i
                        className={`ti ti-chevron-down bit-chevron${isOpen ? ' open' : ''}`}
                        style={{ fontSize: 16, color: '#8A8070' }}
                      />
                    )}
                    {week.isLocked && (
                      <i className="ti ti-lock" style={{ fontSize: 14, color: '#C8C0B4' }} />
                    )}
                  </div>
                </button>

                {/* Expanded panel */}
                {isOpen && (
                  <div style={{ borderTop: '1px solid #E8E4D9', padding: '20px 20px 24px' }}>

                    {/* Assignment block */}
                    <div style={{ background: '#F9F7F1', border: '1px solid #E8E4D9', borderRadius: 10, padding: '16px 18px', marginBottom: 14 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 10 }}>
                        <i className="ti ti-book" style={{ fontSize: 14, color: '#C9A84C' }} />
                        <span style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#8A8070' }}>
                          Assignment
                        </span>
                      </div>
                      <p style={{ fontSize: 13, color: '#0F1F3D', lineHeight: 1.75, marginBottom: week.resources?.length ? 12 : 0 }}>
                        {week.task}
                      </p>
                      {week.resources?.length > 0 && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                          {week.resources.map((r: string, i: number) => (
                            <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 7, fontSize: 12, color: '#6B6B6B' }}>
                              <i className="ti ti-arrow-right" style={{ fontSize: 12, color: '#C9A84C', marginTop: 1, flexShrink: 0 }} />
                              <span>{r}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Submitted confirmation */}
                    {week.isSubmitted && roadmap?.weeks && (
                      <div style={{
                        background: 'rgba(29,74,110,0.05)', border: '1px solid rgba(29,74,110,0.15)',
                        borderRadius: 10, padding: '14px 18px',
                        display: 'flex', alignItems: 'flex-start', gap: 10,
                      }}>
                        <i className="ti ti-circle-check" style={{ fontSize: 18, color: '#1D4A6E', flexShrink: 0, marginTop: 1 }} />
                        <div>
                          <div style={{ fontSize: 11, fontWeight: 700, color: '#1D4A6E', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 3 }}>
                            Submitted
                          </div>
                          <p style={{ fontSize: 13, color: '#6B6B6B' }}>Great work. Check with your mentor for feedback.</p>
                        </div>
                      </div>
                    )}

                    {/* Submission form */}
                    {!week.isSubmitted && !week.isLocked && (
                      <div style={{ background: '#FBF7EC', border: '1px solid #DFC97A', borderRadius: 10, padding: '18px 20px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 18 }}>
                          <i className="ti ti-send" style={{ fontSize: 14, color: '#C9A84C' }} />
                          <span style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#7A5C1E' }}>
                            Submit Week {week.week}
                          </span>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

                          {/* Summary */}
                          <div>
                            <label style={{ display: 'block', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em', color: '#8A8070', marginBottom: 7 }}>
                              What did you learn this week?
                            </label>
                            <textarea
                              value={form.summary}
                              onChange={e => updateForm(week.week, 'summary', e.target.value)}
                              placeholder="Summarise the key concepts, tools, or ideas you learned. What clicked for you this week?"
                              rows={3}
                              className="bit-input"
                            />
                            <div style={{ textAlign: 'right', marginTop: 4 }}>
                              <span style={{ fontSize: 11, color: form.summary.length >= 20 ? '#1D4A6E' : '#8A8070' }}>
                                {form.summary.length} chars {form.summary.length < 20 ? `(need ${20 - form.summary.length} more)` : '✓'}
                              </span>
                            </div>
                          </div>

                          {/* Work done */}
                          <div>
                            <label style={{ display: 'block', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em', color: '#8A8070', marginBottom: 7 }}>
                              What did you build or do?
                            </label>
                            <textarea
                              value={form.workDone}
                              onChange={e => updateForm(week.week, 'workDone', e.target.value)}
                              placeholder="Describe what you built, practised, or completed. What was hard? What decisions did you make?"
                              rows={3}
                              className="bit-input"
                            />
                            <div style={{ textAlign: 'right', marginTop: 4 }}>
                              <span style={{ fontSize: 11, color: form.workDone.length >= 20 ? '#1D4A6E' : '#8A8070' }}>
                                {form.workDone.length} chars {form.workDone.length < 20 ? `(need ${20 - form.workDone.length} more)` : '✓'}
                              </span>
                            </div>
                          </div>

                          {/* Link */}
                          <div>
                            <label style={{ display: 'block', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em', color: '#8A8070', marginBottom: 7 }}>
                              Link to your work{' '}
                              <span style={{ fontWeight: 400, textTransform: 'none', letterSpacing: 0 }}>(optional)</span>
                            </label>
                            <input
                              type="url"
                              value={form.link}
                              onChange={e => updateForm(week.week, 'link', e.target.value)}
                              placeholder="https://github.com/yourname/project"
                              className="bit-input"
                            />
                          </div>

                          {/* Submit button */}
                          <div>
                            <button
                              onClick={() => handleSubmit(week.week)}
                              disabled={submitting === week.week}
                              className="bit-btn-gold"
                            >
                              {submitting === week.week ? (
                                <>
                                  <i className="ti ti-loader-2 bit-spin" style={{ fontSize: 14 }} />
                                  Submitting...
                                </>
                              ) : (
                                <>
                                  <i className="ti ti-send" style={{ fontSize: 14 }} />
                                  Submit Week {week.week}
                                </>
                              )}
                            </button>
                          </div>

                        </div>
                      </div>
                    )}

                  </div>
                )}
              </div>
            )
          })}
        </div>

      </div>
    </div>
  )
}
