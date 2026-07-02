import { useEffect, useState } from 'react'
import { useParams, useNavigate, useSearchParams, Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import { api } from '../utils/api'
import { PageMeta } from '../components/PageMeta'

interface VisibleWeek {
  week: number
  phase: string
  title: string
  task: string
}

interface LockedWeek {
  week: number
  phase: string
  title: string
}

interface RoadmapPreviewData {
  domain: string
  color: string
  icon: string
  tagline: string
  salaryNigeria: string
  salaryGlobal: string
  totalWeeks: number
  lockedWeeksCount: number
  visibleWeeks: VisibleWeek[]
  lockedWeeks: LockedWeek[]
}

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900;1,700;1,900&family=Inter:wght@400;500;600;700&display=swap');

  @keyframes bit-spin { to { transform: rotate(360deg); } }
  .bit-spin { animation: bit-spin 0.75s linear infinite; }

  .bit-locked-row {
    display: flex; align-items: center; gap: 12px;
    padding: 11px 14px; border-radius: 9px;
    transition: background 0.15s;
  }
  .bit-locked-row:hover { background: #F9F7F1; }
`

export function RoadmapPreviewPage() {
  const { domain } = useParams<{ domain: string }>()
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token')
  const navigate = useNavigate()

  const [data, setData] = useState<RoadmapPreviewData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [choosing, setChoosing] = useState(false)

  useEffect(() => {
    async function fetchPreview() {
      setLoading(true)
      try {
        const res = await api.get(`/assessment/roadmap-preview/${encodeURIComponent(domain || '')}`)
        setData(res.data)
        setError('')
        try { window.plausible?.('Roadmap Preview Viewed', { props: { track: res.data.domain } }) } catch {}
      } catch {
        setError('We could not find that career track.')
      } finally {
        setLoading(false)
      }
    }
    fetchPreview()
  }, [domain])

  async function handleChooseTrack() {
    if (!token || !data) {
      navigate('/assess')
      return
    }
    setChoosing(true)
    try {
      await api.patch(`/assessment/${token}/track`, { domain: data.domain })
      try { window.plausible?.('Track Selected', { props: { track: data.domain } }) } catch {}
      toast.success(`Track set to ${data.domain}. Log in with your access code to begin.`)
      navigate('/login')
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Failed to update track')
    } finally {
      setChoosing(false)
    }
  }

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#F9F7F1', fontFamily: "'Inter', sans-serif" }}>
        <style>{CSS}</style>
        <div style={{ textAlign: 'center' }}>
          <div className="bit-spin" style={{ width: 36, height: 36, border: '3px solid #E8E4D9', borderTopColor: '#C9A84C', borderRadius: '50%', margin: '0 auto 16px' }} />
          <p style={{ color: '#6B6B6B', fontSize: 14 }}>Loading roadmap preview...</p>
        </div>
      </div>
    )
  }

  if (error || !data) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#F9F7F1', fontFamily: "'Inter', sans-serif", padding: 20 }}>
        <style>{CSS}</style>
        <div style={{ textAlign: 'center' }}>
          <i className="ti ti-mood-sad" style={{ fontSize: 40, color: '#C8C0B4', display: 'block', marginBottom: 14 }} />
          <p style={{ marginBottom: 20, color: '#6B6B6B', fontSize: 14 }}>{error}</p>
          <Link
            to="/domains"
            style={{ display: 'inline-flex', alignItems: 'center', gap: 7, background: '#C9A84C', color: '#0F1F3D', borderRadius: 10, padding: '12px 24px', fontWeight: 700, fontSize: 14, textDecoration: 'none', fontFamily: "'Inter', sans-serif" }}
          >
            <i className="ti ti-compass" style={{ fontSize: 14 }} /> Browse Career Domains
          </Link>
        </div>
      </div>
    )
  }

  const { domain: domainName, color, icon, tagline, salaryNigeria, salaryGlobal, visibleWeeks, lockedWeeks, totalWeeks } = data

  // Group locked weeks by phase, preserving order
  const phaseGroups: { phase: string; weeks: LockedWeek[] }[] = []
  lockedWeeks.forEach((w) => {
    const group = phaseGroups.find((g) => g.phase === w.phase)
    if (group) group.weeks.push(w)
    else phaseGroups.push({ phase: w.phase, weeks: [w] })
  })

  return (
    <div style={{ minHeight: '100vh', background: '#F9F7F1', fontFamily: "'Inter', sans-serif", color: '#0F1F3D' }}>
      <PageMeta
        title={`${domainName} 48-Week Roadmap`}
        description={`${tagline}. Free structured 48-week ${domainName} learning path with expert mentors, weekly check-ins, and a certificate of completion.`}
        path={`/roadmap-preview/${encodeURIComponent(domainName)}`}
      />
      <style>{CSS}</style>

      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <div style={{ background: '#0F1F3D', padding: '52px 20px 44px', position: 'relative', overflow: 'hidden' }}>
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
          background: `radial-gradient(ellipse at 70% 20%, ${color}22 0%, transparent 60%)`,
          pointerEvents: 'none',
        }} />
        <div style={{ position: 'relative', maxWidth: 640, margin: '0 auto' }}>
          {token && (
            <Link
              to={`/results/${token}`}
              style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 13, color: 'rgba(255,255,255,0.5)', textDecoration: 'none', marginBottom: 22 }}
              onMouseEnter={e => (e.currentTarget.style.color = '#fff')}
              onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.5)')}
            >
              <i className="ti ti-arrow-left" style={{ fontSize: 13 }} /> Back to your results
            </Link>
          )}
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 18, flexWrap: 'wrap' }}>
            <div style={{
              width: 56, height: 56, borderRadius: 14, fontSize: 28,
              background: color + '22', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
            }}>
              {icon}
            </div>
            <div>
              <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 28, fontWeight: 900, color: '#fff', lineHeight: 1.2, marginBottom: 4 }}>
                {domainName}
              </h1>
              <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.65)' }}>{tagline}</p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <div style={{
              background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)',
              borderRadius: 10, padding: '10px 16px',
            }}>
              <div style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#F5D87A', marginBottom: 4 }}>
                <i className="ti ti-building" style={{ fontSize: 11, marginRight: 4 }} /> Nigeria
              </div>
              <div style={{ fontSize: 13, color: '#fff', fontWeight: 600 }}>{salaryNigeria}</div>
            </div>
            <div style={{
              background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)',
              borderRadius: 10, padding: '10px 16px',
            }}>
              <div style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#F5D87A', marginBottom: 4 }}>
                <i className="ti ti-world" style={{ fontSize: 11, marginRight: 4 }} /> Global Remote
              </div>
              <div style={{ fontSize: 13, color: '#fff', fontWeight: 600 }}>{salaryGlobal}</div>
            </div>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 640, margin: '0 auto', padding: '36px 20px 72px' }}>

        {/* ── VISIBLE WEEKS LABEL ─────────────────────────────────────────── */}
        <div style={{ marginBottom: 14 }}>
          <span style={{
            display: 'inline-flex', alignItems: 'center', gap: 7,
            background: '#FBF7EC', border: '1px solid #DFC97A', borderRadius: 999,
            padding: '5px 14px', fontSize: 11, fontWeight: 700,
            letterSpacing: '0.07em', textTransform: 'uppercase', color: '#7A5C1E',
          }}>
            <i className="ti ti-eye" style={{ fontSize: 12 }} />
            Weeks 1–4 Fully Unlocked
          </span>
        </div>

        {/* ── VISIBLE WEEK CARDS ──────────────────────────────────────────── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 32 }}>
          {visibleWeeks.map((week) => (
            <div key={week.week} style={{ background: '#fff', border: '1px solid #E8E4D9', borderRadius: 12, overflow: 'hidden' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '16px 20px', borderBottom: '1px solid #F0ECE0' }}>
                <span style={{
                  background: '#0F1F3D', color: '#C9A84C',
                  borderRadius: 7, padding: '4px 10px',
                  fontSize: 11, fontWeight: 700, letterSpacing: '0.04em',
                  flexShrink: 0,
                }}>
                  W{week.week}
                </span>
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: '#0F1F3D' }}>{week.title}</div>
                  <div style={{ fontSize: 11, color: '#8A8070', marginTop: 2 }}>{week.phase}</div>
                </div>
              </div>
              <div style={{ padding: '16px 20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 10 }}>
                  <i className="ti ti-book" style={{ fontSize: 14, color: color }} />
                  <span style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#8A8070' }}>
                    Assignment
                  </span>
                </div>
                <p style={{ fontSize: 13, color: '#0F1F3D', lineHeight: 1.75, margin: 0 }}>
                  {week.task}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* ── LOCKED WEEKS LABEL ──────────────────────────────────────────── */}
        <div style={{ marginBottom: 14 }}>
          <span style={{
            display: 'inline-flex', alignItems: 'center', gap: 7,
            background: '#F9F7F1', border: '1px solid #E8E4D9', borderRadius: 999,
            padding: '5px 14px', fontSize: 11, fontWeight: 700,
            letterSpacing: '0.07em', textTransform: 'uppercase', color: '#8A8070',
          }}>
            <i className="ti ti-lock" style={{ fontSize: 12 }} />
            Weeks 5–{totalWeeks} · Titles Visible, Tasks Locked
          </span>
        </div>

        {/* ── LOCKED WEEKS LIST (grouped by phase) ────────────────────────── */}
        <div style={{ background: '#fff', border: '1px solid #E8E4D9', borderRadius: 12, padding: '8px 10px', marginBottom: 28 }}>
          {phaseGroups.map((group, gi) => (
            <div key={group.phase} style={{ marginBottom: gi < phaseGroups.length - 1 ? 6 : 0 }}>
              <div style={{ padding: '10px 14px 6px', fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#C9A84C' }}>
                {group.phase}
              </div>
              {group.weeks.map((week) => (
                <div key={week.week} className="bit-locked-row">
                  <span style={{
                    background: '#F0EBD8', color: '#8A8070',
                    borderRadius: 7, padding: '3px 9px',
                    fontSize: 10, fontWeight: 700, letterSpacing: '0.04em',
                    flexShrink: 0,
                  }}>
                    W{week.week}
                  </span>
                  <span style={{ fontSize: 13, color: '#3A3A3A', flex: 1, minWidth: 0 }}>{week.title}</span>
                  <i className="ti ti-lock" style={{ fontSize: 13, color: '#C8C0B4', flexShrink: 0 }} />
                </div>
              ))}
            </div>
          ))}
        </div>

        {/* ── UNLOCK CTA BANNER ───────────────────────────────────────────── */}
        <div style={{
          background: '#0F1F3D', borderRadius: 16, padding: '32px 28px', textAlign: 'center',
        }}>
          <i className="ti ti-lock-open" style={{ fontSize: 26, color: '#C9A84C', display: 'block', marginBottom: 14 }} />
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, fontWeight: 900, color: '#fff', marginBottom: 10, lineHeight: 1.3 }}>
            Unlock the full task details and resources<br />for all {totalWeeks} weeks
          </h2>
          <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.55)', marginBottom: 22, maxWidth: 420, margin: '0 auto 22px' }}>
            {token
              ? 'Your account already exists — confirm this track and log in with your access code to see everything.'
              : 'Take the free assessment to get matched and receive your access code by email.'}
          </p>
          <button
            onClick={handleChooseTrack}
            disabled={choosing}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              background: '#C9A84C', color: '#0F1F3D', border: 'none', borderRadius: 10,
              padding: '14px 28px', fontSize: 14, fontWeight: 700,
              cursor: choosing ? 'not-allowed' : 'pointer', opacity: choosing ? 0.6 : 1,
              fontFamily: "'Inter', sans-serif",
            }}
          >
            {choosing ? (
              <><i className="ti ti-loader-2 bit-spin" style={{ fontSize: 15 }} /> Saving...</>
            ) : token ? (
              <><i className="ti ti-circle-check" style={{ fontSize: 15 }} /> Continue with {domainName}</>
            ) : (
              <><i className="ti ti-arrow-right" style={{ fontSize: 15 }} /> Take the Free Assessment</>
            )}
          </button>
        </div>

      </div>
    </div>
  )
}
