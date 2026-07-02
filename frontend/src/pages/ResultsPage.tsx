import { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { api } from '../utils/api'
import { DOMAINS } from '../utils/questionData'
import { PageMeta } from '../components/PageMeta'

interface MenteeResult {
  id: string
  name: string
  email: string
  accessCode: string
  domainTrack: string
  topMatch: string
  secondMatch: string
  alignmentStatus: string | null
  allScores: Record<string, number> | null
  mentorNote: string | null
}

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900;1,700;1,900&family=Inter:wght@400;500;600;700&display=swap');

  @keyframes bit-spin { to { transform: rotate(360deg); } }
  .bit-spin { animation: bit-spin 0.75s linear infinite; }

  .bit-score-bar {
    height: 5px; border-radius: 99px; background: #E8E4D9; overflow: hidden;
    flex: 1;
  }
  .bit-score-fill {
    height: 100%; border-radius: 99px;
    transition: width 0.7s cubic-bezier(0.4,0,0.2,1);
  }
  @media (max-width: 480px) {
    .bit-access-row { flex-direction: column !important; align-items: flex-start !important; gap: 12px !important; }
    .bit-score-domain { width: 100px !important; }
  }
`

export function ResultsPage() {
  const { token } = useParams<{ token: string }>()
  const navigate = useNavigate()
  const [mentee, setMentee] = useState<MenteeResult | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showBars, setShowBars] = useState(false)

  useEffect(() => {
    async function fetchResults() {
      try {
        const res = await api.get(`/assessment/${token}/results`)
        setMentee(res.data.mentee)
        setTimeout(() => setShowBars(true), 400)
      } catch {
        setError('Results not found. Please complete the assessment first.')
      } finally {
        setLoading(false)
      }
    }
    fetchResults()
  }, [token])

  if (loading) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#F9F7F1', fontFamily: "'Inter', sans-serif" }}>
      <style>{CSS}</style>
      <div style={{ textAlign: 'center' }}>
        <div className="bit-spin" style={{ width: 36, height: 36, border: '3px solid #E8E4D9', borderTopColor: '#C9A84C', borderRadius: '50%', margin: '0 auto 16px' }} />
        <p style={{ fontSize: 14, color: '#6B6B6B' }}>Loading your results...</p>
      </div>
    </div>
  )

  if (error || !mentee) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#F9F7F1', fontFamily: "'Inter', sans-serif", padding: '20px' }}>
      <style>{CSS}</style>
      <div style={{ textAlign: 'center' }}>
        <i className="ti ti-mood-sad" style={{ fontSize: 40, color: '#C8C0B4', display: 'block', marginBottom: 14 }} />
        <p style={{ marginBottom: 20, color: '#6B6B6B', fontSize: 14 }}>{error}</p>
        <button
          onClick={() => navigate('/assess')}
          style={{ display: 'inline-flex', alignItems: 'center', gap: 7, background: '#C9A84C', color: '#0F1F3D', border: 'none', borderRadius: 10, padding: '12px 24px', fontWeight: 700, fontSize: 14, cursor: 'pointer', fontFamily: "'Inter', sans-serif" }}
        >
          <i className="ti ti-arrow-right" style={{ fontSize: 14 }} /> Take Assessment
        </button>
      </div>
    </div>
  )

  const topDomain = DOMAINS.find((d) => d.name === mentee.topMatch) || DOMAINS[0]
  const scores = mentee.allScores || {}
  const maxScore = Math.max(...Object.values(scores), 1)
  const rankedScores = Object.entries(scores).sort(([, a], [, b]) => b - a)
  const isConflict = mentee.alignmentStatus === 'conflict' || mentee.alignmentStatus === 'partial'
  const topPct = Math.round(((scores[topDomain.name] || 0) / maxScore) * 100)

  return (
    <div style={{ minHeight: '100vh', background: '#F9F7F1', fontFamily: "'Inter', sans-serif", color: '#0F1F3D', padding: '56px 20px 72px' }}>
      <PageMeta
        title={`Your ${mentee.topMatch} Career Assessment Results`}
        description={`Your aptitude assessment matched you to ${mentee.topMatch}. See your full score breakdown, goal alignment, and get your free personalised roadmap.`}
      />
      <style>{CSS}</style>

      <div style={{ maxWidth: 580, margin: '0 auto' }}>

        {/* ── HEADER ─────────────────────────────────────────────────────── */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            width: 64, height: 64, fontSize: 34, background: topDomain.color + '18',
            borderRadius: 18, marginBottom: 20,
          }}>
            {topDomain.icon}
          </div>
          <h1 style={{
            fontFamily: "'Playfair Display', serif", fontSize: 36, fontWeight: 900,
            color: '#0F1F3D', marginBottom: 8, lineHeight: 1.2,
          }}>
            Your Career Match
          </h1>
          <p style={{ fontSize: 14, color: '#6B6B6B' }}>
            Based on your {DOMAINS.length + 4} answers, here is where you naturally fit.
          </p>
        </div>

        {/* ── ACCESS CODE ────────────────────────────────────────────────── */}
        <div style={{
          background: '#0F1F3D', borderRadius: 14, padding: '22px 24px',
          marginBottom: 14, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16,
        }}>
          <div>
            <div style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.09em', color: '#F5D87A', marginBottom: 8 }}>
              <i className="ti ti-key" style={{ fontSize: 11, marginRight: 5 }} />Your Access Code
            </div>
            <div style={{ fontFamily: 'monospace', fontSize: 24, fontWeight: 700, letterSpacing: '0.14em', color: '#fff' }}>
              {mentee.accessCode}
            </div>
            <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', marginTop: 5 }}>
              Use this code to log into your weekly learning dashboard.
            </p>
          </div>
          <button
            onClick={() => navigator.clipboard.writeText(mentee.accessCode)}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              background: 'rgba(201,168,76,0.15)', border: '1px solid rgba(201,168,76,0.3)',
              borderRadius: 8, padding: '9px 16px', fontSize: 12, fontWeight: 700,
              color: '#F5D87A', cursor: 'pointer', fontFamily: "'Inter', sans-serif",
              transition: 'background 0.15s', flexShrink: 0,
            }}
            onMouseEnter={e => (e.currentTarget.style.background = 'rgba(201,168,76,0.25)')}
            onMouseLeave={e => (e.currentTarget.style.background = 'rgba(201,168,76,0.15)')}
          >
            <i className="ti ti-copy" style={{ fontSize: 13 }} /> Copy
          </button>
        </div>

        {/* ── ALIGNMENT ──────────────────────────────────────────────────── */}
        {mentee.alignmentStatus && (
          <div style={{
            marginBottom: 14,
            background: isConflict ? '#fffbeb' : '#f0fdf4',
            border: `1px solid ${isConflict ? '#fde68a' : '#bbf7d0'}`,
            borderRadius: 12, padding: '16px 20px',
          }}>
            <div style={{
              display: 'flex', alignItems: 'center', gap: 8, marginBottom: mentee.mentorNote ? 8 : 0,
              fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em',
              color: isConflict ? '#b45309' : '#15803d',
            }}>
              <i className={`ti ${isConflict ? 'ti-alert-triangle' : 'ti-circle-check'}`} style={{ fontSize: 13 }} />
              {isConflict ? 'Goal and Aptitude Do Not Fully Match' : 'Goal and Aptitude Align'}
            </div>
            {mentee.mentorNote && (
              <p style={{ fontSize: 13, color: '#3A3A3A', lineHeight: 1.7 }}>{mentee.mentorNote}</p>
            )}
          </div>
        )}

        {/* ── TOP MATCH CARD ─────────────────────────────────────────────── */}
        <div style={{
          background: '#fff', border: `1px solid ${topDomain.color}40`,
          borderRadius: 14, padding: '26px 24px', marginBottom: 14,
          position: 'relative', overflow: 'hidden',
          boxShadow: `0 4px 24px ${topDomain.color}14`,
        }}>
          {/* Color top bar */}
          <div style={{
            position: 'absolute', top: 0, left: 0, right: 0, height: 3,
            background: `linear-gradient(90deg, ${topDomain.color}, ${topDomain.color}70)`,
          }} />

          <div style={{ marginBottom: 14 }}>
            <span style={{
              display: 'inline-flex', alignItems: 'center', gap: 5,
              background: topDomain.color + '14', border: `1px solid ${topDomain.color}30`,
              borderRadius: 999, padding: '4px 12px', fontSize: 11, fontWeight: 700,
              letterSpacing: '0.07em', textTransform: 'uppercase', color: topDomain.color,
            }}>
              <i className="ti ti-star-filled" style={{ fontSize: 10 }} /> Top Match
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 22 }}>
            <div style={{
              width: 56, height: 56, borderRadius: 14, fontSize: 28,
              background: topDomain.color + '18', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
            }}>
              {topDomain.icon}
            </div>
            <div>
              <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 24, fontWeight: 900, color: '#0F1F3D', marginBottom: 3 }}>
                {topDomain.name}
              </h2>
              <p style={{ fontSize: 13, color: '#6B6B6B' }}>Your strongest natural fit</p>
            </div>
          </div>

          {/* Match strength bar */}
          <div style={{ marginBottom: 22 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: '#8A8070', marginBottom: 8 }}>
              <span>Match strength</span>
              <span style={{ fontFamily: 'monospace', fontWeight: 700, color: topDomain.color }}>{topPct}%</span>
            </div>
            <div style={{ height: 6, borderRadius: 99, background: '#F0EBD8', overflow: 'hidden' }}>
              <div style={{
                height: '100%', borderRadius: 99,
                background: topDomain.color,
                width: showBars ? `${topPct}%` : '0%',
                transition: 'width 1s cubic-bezier(0.4,0,0.2,1)',
              }} />
            </div>
          </div>

          <Link
            to={`/roadmap-preview/${encodeURIComponent(topDomain.name)}?token=${token}`}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              background: topDomain.color, color: '#fff', borderRadius: 10,
              padding: '13px 22px', fontSize: 14, fontWeight: 700, textDecoration: 'none',
              transition: 'opacity 0.15s, transform 0.15s',
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.opacity = '0.88'; (e.currentTarget as HTMLElement).style.transform = 'translateY(-1px)' }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.opacity = '1'; (e.currentTarget as HTMLElement).style.transform = 'none' }}
          >
            <i className="ti ti-map" style={{ fontSize: 15 }} />
            See My Roadmap
          </Link>
        </div>

        {/* ── SECONDARY MATCHES ──────────────────────────────────────────── */}
        {rankedScores.length > 1 && (
          <div style={{ marginBottom: 14 }}>
            <div style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#8A8070', marginBottom: 10, paddingLeft: 2 }}>
              Other Strong Matches — Compare Before You Commit
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 10 }}>
              {rankedScores.slice(1, 4).map(([domainName]) => {
                const d = DOMAINS.find((x) => x.name === domainName)
                if (!d) return null
                return (
                  <Link
                    key={domainName}
                    to={`/roadmap-preview/${encodeURIComponent(domainName)}?token=${token}`}
                    style={{
                      display: 'block', background: '#fff', border: '1px solid #E8E4D9', borderRadius: 12,
                      padding: '14px 16px', textDecoration: 'none', transition: 'border-color 0.15s, transform 0.15s',
                    }}
                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = d.color; (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)' }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = '#E8E4D9'; (e.currentTarget as HTMLElement).style.transform = 'none' }}
                  >
                    <div style={{
                      width: 32, height: 32, borderRadius: 9, fontSize: 16,
                      background: d.color + '18', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 10,
                    }}>
                      {d.icon}
                    </div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: '#0F1F3D', marginBottom: 6, lineHeight: 1.3 }}>
                      {domainName}
                    </div>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 11, fontWeight: 600, color: d.color }}>
                      See roadmap <i className="ti ti-arrow-right" style={{ fontSize: 10 }} />
                    </div>
                  </Link>
                )
              })}
            </div>
          </div>
        )}

        {/* ── ALL SCORES ─────────────────────────────────────────────────── */}
        <div style={{ background: '#fff', border: '1px solid #E8E4D9', borderRadius: 14, padding: '22px 24px', marginBottom: 14 }}>
          <div style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#8A8070', marginBottom: 16 }}>
            All Domain Scores
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 11 }}>
            {rankedScores.map(([domain, score]) => {
              const d = DOMAINS.find((x) => x.name === domain)
              const pct = (score / maxScore) * 100
              return (
                <div key={domain} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ width: 20, textAlign: 'center', fontSize: 14, flexShrink: 0 }}>{d?.icon}</span>
                  <span style={{ width: 140, flexShrink: 0, fontSize: 11, color: '#3A3A3A', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', minWidth: 0 }}>{domain}</span>
                  <div className="bit-score-bar">
                    <div className="bit-score-fill" style={{ width: showBars ? `${pct}%` : '0%', background: d?.color || '#C9A84C' }} />
                  </div>
                  <span style={{ fontFamily: 'monospace', fontSize: 11, color: '#8A8070', width: 22, textAlign: 'right', flexShrink: 0 }}>{score}</span>
                </div>
              )
            })}
          </div>
        </div>

        {/* ── NOTE ───────────────────────────────────────────────────────── */}
        <div style={{
          background: '#FBF7EC', border: '1px solid #DFC97A', borderRadius: 12,
          padding: '18px 22px', textAlign: 'center',
        }}>
          <i className="ti ti-users" style={{ fontSize: 20, color: '#C9A84C', display: 'block', marginBottom: 8 }} />
          <p style={{ fontSize: 13, color: '#7A5C1E', lineHeight: 1.7 }}>
            <strong>Share this page with your mentor.</strong>{' '}
            They will build your personal 12-month roadmap and send your weekly tracker access code.
          </p>
        </div>

      </div>
    </div>
  )
}
