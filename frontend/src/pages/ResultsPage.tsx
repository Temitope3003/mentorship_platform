import { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { api } from '../utils/api'
import { DOMAINS } from '../utils/questionData'

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
    <div className="flex min-h-screen items-center justify-center bg-ivory">
      <div className="text-center">
        <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-2 border-warm border-t-accent" />
        <p className="text-sm text-muted">Loading your results...</p>
      </div>
    </div>
  )

  if (error || !mentee) return (
    <div className="flex min-h-screen items-center justify-center bg-ivory px-4">
      <div className="text-center">
        <p className="mb-4 text-red-500">{error}</p>
        <button onClick={() => navigate('/assess')} className="rounded-2xl bg-accent px-6 py-3 text-sm font-semibold text-white">
          Take Assessment
        </button>
      </div>
    </div>
  )

  const topDomain = DOMAINS.find((d) => d.name === mentee.topMatch) || DOMAINS[0]
  const secondDomain = DOMAINS.find((d) => d.name === mentee.secondMatch)
  const scores = mentee.allScores || {}
  const maxScore = Math.max(...Object.values(scores))
  const rankedScores = Object.entries(scores).sort(([, a], [, b]) => b - a)
  const isConflict = mentee.alignmentStatus === 'conflict' || mentee.alignmentStatus === 'partial'

  return (
    <div className="min-h-screen bg-ivory px-4 py-16">
      <div className="mx-auto max-w-xl">

        {/* header */}
        <div className="mb-10 text-center">
          <div className="mb-3 text-5xl">{topDomain.icon}</div>
          <h1 className="font-display mb-3 text-4xl font-black text-text">Your Career Match</h1>
          <p className="text-muted">Based on your 18 answers, here is where you naturally fit.</p>
        </div>

        {/* access code */}
        <div className="mb-5 rounded-2xl border border-teal/20 bg-teal/5 p-6 shadow-warm-sm">
          <p className="mb-1 text-xs font-bold uppercase tracking-widest text-teal">Your Access Code</p>
          <div className="flex items-center justify-between gap-4">
            <p className="font-mono text-2xl font-semibold tracking-widest text-text">{mentee.accessCode}</p>
            <button
              onClick={() => { navigator.clipboard.writeText(mentee.accessCode); toast && (window as any).toast?.success?.('Copied!') }}
              className="rounded-xl border border-teal/20 bg-white px-4 py-2 text-xs font-semibold text-teal shadow-warm-sm transition hover:shadow-warm-md"
            >
              Copy
            </button>
          </div>
          <p className="mt-2 text-xs text-teal/70">Use this code to log into your weekly learning dashboard.</p>
        </div>

        {/* alignment */}
        {mentee.alignmentStatus && (
          <div className={`mb-5 rounded-2xl border p-5 shadow-warm-sm ${isConflict ? 'border-amber-200 bg-amber-50' : 'border-green-200 bg-green-50'}`}>
            <p className={`mb-2 text-xs font-bold uppercase tracking-widest ${isConflict ? 'text-amber-600' : 'text-green-700'}`}>
              {isConflict ? '⚠ Goal and Aptitude Do Not Fully Match' : '✓ Goal and Aptitude Align'}
            </p>
            {mentee.mentorNote && (
              <p className="text-sm leading-relaxed text-text2">{mentee.mentorNote}</p>
            )}
          </div>
        )}

        {/* top match */}
        <div className="relative mb-4 overflow-hidden rounded-3xl border bg-white p-8 shadow-warm-md" style={{ borderColor: topDomain.color + '40' }}>
          <div className="absolute left-0 right-0 top-0 h-1 rounded-t-3xl" style={{ background: `linear-gradient(90deg, ${topDomain.color}, ${topDomain.color}80)` }} />
          <p className="mb-4 text-xs font-bold uppercase tracking-widest" style={{ color: topDomain.color }}>★ Top Match</p>
          <div className="mb-5 flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl text-3xl" style={{ background: topDomain.color + '18' }}>
              {topDomain.icon}
            </div>
            <div>
              <h2 className="font-display text-2xl font-bold text-text">{topDomain.name}</h2>
              <p className="text-sm text-muted">Your strongest natural fit</p>
            </div>
          </div>

          {/* match bar */}
          <div className="mb-6">
            <div className="mb-2 flex justify-between text-xs text-muted">
              <span>Match strength</span>
              <span className="font-mono font-semibold" style={{ color: topDomain.color }}>
                {maxScore > 0 ? Math.round(((scores[topDomain.name] || 0) / maxScore) * 100) : 0}%
              </span>
            </div>
            <div className="h-2 rounded-full bg-warm">
              <div
                className="h-full rounded-full transition-all duration-1000"
                style={{
                  width: showBars && maxScore > 0 ? `${((scores[topDomain.name] || 0) / maxScore) * 100}%` : '0%',
                  background: topDomain.color,
                }}
              />
            </div>
          </div>

          <Link to="/login" className="inline-flex items-center gap-2 rounded-2xl px-6 py-3 text-sm font-semibold text-white shadow-warm-md transition hover:-translate-y-0.5 hover:shadow-warm-lg" style={{ background: topDomain.color }}>
            Log in to My Dashboard →
          </Link>
        </div>

        {/* second match */}
        {secondDomain && (
          <div className="mb-5 rounded-2xl border border-border bg-white p-6 shadow-warm-sm">
            <p className="mb-3 text-xs font-bold uppercase tracking-widest text-muted">○ Secondary Match</p>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl text-xl" style={{ background: secondDomain.color + '18' }}>
                {secondDomain.icon}
              </div>
              <div className="font-display text-xl font-bold text-text">{secondDomain.name}</div>
            </div>
          </div>
        )}

        {/* all scores */}
        <div className="mb-5 rounded-2xl border border-border bg-white p-6 shadow-warm-sm">
          <p className="mb-5 text-xs font-bold uppercase tracking-widest text-muted">All domain scores</p>
          <div className="space-y-3">
            {rankedScores.map(([domain, score]) => {
              const d = DOMAINS.find((x) => x.name === domain)
              const pct = maxScore > 0 ? (score / maxScore) * 100 : 0
              return (
                <div key={domain} className="flex items-center gap-3">
                  <span className="w-5 text-center text-sm">{d?.icon}</span>
                  <span className="w-44 flex-shrink-0 text-xs text-text2">{domain}</span>
                  <div className="flex-1 rounded-full bg-warm h-1.5">
                    <div className="h-full rounded-full transition-all duration-700" style={{ width: showBars ? `${pct}%` : '0%', background: d?.color || '#d4622a' }} />
                  </div>
                  <span className="font-mono w-5 text-right text-xs text-muted">{score}</span>
                </div>
              )
            })}
          </div>
        </div>

        {/* note */}
        <div className="rounded-2xl border border-border bg-cream px-6 py-5 text-center">
          <p className="text-sm leading-relaxed text-muted">
            <strong className="text-text">Share this page with your mentor.</strong>{' '}
            They will build your personal 12-month roadmap and send your weekly tracker access code.
          </p>
        </div>

      </div>
    </div>
  )
}