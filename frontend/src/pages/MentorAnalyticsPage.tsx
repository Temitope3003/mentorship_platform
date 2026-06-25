import { Link } from 'react-router-dom'
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts'
import { useMentorAnalytics } from '../hooks/useMentor'

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900;1,700;1,900&family=Inter:wght@400;500;600;700&display=swap');

  @keyframes bit-spin { to { transform: rotate(360deg); } }
  .bit-spin { animation: bit-spin 0.75s linear infinite; }

  .bit-card {
    background: #fff; border: 1px solid #E8E4D9; border-radius: 12px; padding: 20px 22px;
  }

  @media (max-width: 900px) {
    .bit-analytics-grid { grid-template-columns: 1fr !important; }
  }
  @media (max-width: 640px) {
    .bit-stats-grid { grid-template-columns: 1fr 1fr !important; }
  }
`

const STATUS_COLORS: Record<string, string> = {
  NOT_STARTED: '#8A8070',
  ON_TRACK: '#15803d',
  AT_RISK: '#b91c1c',
  PAUSED: '#7A5C1E',
}

const STATUS_LABELS: Record<string, string> = {
  NOT_STARTED: 'Not Started',
  ON_TRACK: 'On Track',
  AT_RISK: 'At Risk',
  PAUSED: 'Paused',
}

export function MentorAnalyticsPage() {
  const { data, isLoading } = useMentorAnalytics()

  if (isLoading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#F9F7F1', fontFamily: "'Inter', sans-serif" }}>
        <style>{CSS}</style>
        <div style={{ textAlign: 'center' }}>
          <div className="bit-spin" style={{ width: 36, height: 36, border: '3px solid #E8E4D9', borderTopColor: '#C9A84C', borderRadius: '50%', margin: '0 auto 16px' }} />
          <p style={{ color: '#6B6B6B', fontSize: 14 }}>Loading analytics...</p>
        </div>
      </div>
    )
  }

  const summary = data?.summary || { totalMentees: 0, startedMentees: 0, avgWeeksCompleted: 0, overallCompletionRate: 0 }
  const submissionTrends = data?.submissionTrends || []
  const trackDistribution = data?.trackDistribution || []
  const statusBreakdown = data?.statusBreakdown || { NOT_STARTED: 0, ON_TRACK: 0, AT_RISK: 0, PAUSED: 0 }
  const atRiskList = data?.atRiskList || []
  const completionProjection = data?.completionProjection || { eligibleCount: 0, averageCompletionPct: 0, projectedCompletionDate: null, message: 'Not enough data yet' }

  const statusPieData = Object.entries(statusBreakdown)
    .map(([status, count]) => ({ status, label: STATUS_LABELS[status] || status, count: count as number }))
    .filter(d => d.count > 0)

  return (
    <div style={{ minHeight: '100vh', background: '#F9F7F1', fontFamily: "'Inter', sans-serif", color: '#0F1F3D' }}>
      <style>{CSS}</style>

      <div style={{ maxWidth: 1080, margin: '0 auto', padding: '40px 28px 72px' }}>

        {/* ── HEADER ─────────────────────────────────────────────────────── */}
        <div style={{ marginBottom: 28 }}>
          <Link
            to="/mentor"
            style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 13, color: '#8A8070', textDecoration: 'none', marginBottom: 18 }}
            onMouseEnter={e => (e.currentTarget.style.color = '#0F1F3D')}
            onMouseLeave={e => (e.currentTarget.style.color = '#8A8070')}
          >
            <i className="ti ti-arrow-left" style={{ fontSize: 13 }} /> Back to dashboard
          </Link>
          <div style={{ marginBottom: 12 }}>
            <span style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              background: '#0F1F3D', border: '1px solid rgba(201,168,76,0.25)',
              borderRadius: 999, padding: '5px 14px',
              fontSize: 11, fontWeight: 700, letterSpacing: '0.07em',
              textTransform: 'uppercase', color: '#F5D87A',
            }}>
              <i className="ti ti-chart-dots-3" style={{ fontSize: 12 }} />
              Cohort Analytics
            </span>
          </div>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 34, fontWeight: 900, color: '#0F1F3D', lineHeight: 1.15, marginBottom: 6 }}>
            Program Health at a Glance
          </h1>
          <p style={{ fontSize: 14, color: '#6B6B6B' }}>Submission trends, track distribution, and mentee status across the whole cohort.</p>
        </div>

        {/* ── SUMMARY STATS ──────────────────────────────────────────────── */}
        <div
          className="bit-stats-grid"
          style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 24 }}
        >
          {[
            { label: 'Total Mentees',          value: summary.totalMentees,          icon: 'ti ti-users',          color: '#C9A84C' },
            { label: 'Started Their Journey',   value: summary.startedMentees,        icon: 'ti ti-player-play',    color: '#1D4A6E' },
            { label: 'Avg Weeks Completed',     value: summary.avgWeeksCompleted,      icon: 'ti ti-calendar-stats', color: '#C9A84C' },
            { label: 'Overall Completion',      value: `${summary.overallCompletionRate}%`, icon: 'ti ti-chart-bar', color: '#1D4A6E' },
          ].map(stat => (
            <div key={stat.label} className="bit-card">
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

        {/* ── SUBMISSION TRENDS + TRACK DISTRIBUTION ────────────────────── */}
        <div className="bit-analytics-grid" style={{ display: 'grid', gridTemplateColumns: '1.3fr 1fr', gap: 16, marginBottom: 16 }}>

          {/* Submission trends */}
          <div className="bit-card">
            <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 16, fontWeight: 700, color: '#0F1F3D', marginBottom: 4 }}>
              Submission Trends
            </h3>
            <p style={{ fontSize: 12, color: '#8A8070', marginBottom: 16 }}>Weekly submissions across the last 12 weeks</p>
            <ResponsiveContainer width="100%" height={240}>
              <LineChart data={submissionTrends}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E8E4D9" />
                <XAxis dataKey="weekLabel" tick={{ fontSize: 11, fill: '#8A8070' }} />
                <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: '#8A8070' }} />
                <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #E8E4D9' }} />
                <Line type="monotone" dataKey="count" name="Submissions" stroke="#C9A84C" strokeWidth={2.5} dot={{ r: 3, fill: '#C9A84C' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Status breakdown */}
          <div className="bit-card">
            <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 16, fontWeight: 700, color: '#0F1F3D', marginBottom: 4 }}>
              Mentee Status
            </h3>
            <p style={{ fontSize: 12, color: '#8A8070', marginBottom: 16 }}>Current breakdown across the cohort</p>
            {statusPieData.length === 0 ? (
              <div style={{ padding: '40px 0', textAlign: 'center', color: '#8A8070', fontSize: 13 }}>
                <i className="ti ti-users" style={{ fontSize: 28, display: 'block', margin: '0 auto 10px', color: '#C8C0B4' }} />
                No mentees yet.
              </div>
            ) : (
              <>
                <ResponsiveContainer width="100%" height={180}>
                  <PieChart>
                    <Pie
                      data={statusPieData}
                      dataKey="count"
                      nameKey="label"
                      innerRadius={45}
                      outerRadius={75}
                      paddingAngle={2}
                    >
                      {statusPieData.map(d => (
                        <Cell key={d.status} fill={STATUS_COLORS[d.status] || '#C9A84C'} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #E8E4D9' }} />
                  </PieChart>
                </ResponsiveContainer>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginTop: 8, justifyContent: 'center' }}>
                  {statusPieData.map(d => (
                    <div key={d.status} style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11, color: '#6B6B6B' }}>
                      <span style={{ width: 8, height: 8, borderRadius: 99, background: STATUS_COLORS[d.status] || '#C9A84C', display: 'inline-block' }} />
                      {d.label} ({d.count})
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>

        {/* ── TRACK DISTRIBUTION ─────────────────────────────────────────── */}
        <div className="bit-card" style={{ marginBottom: 16 }}>
          <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 16, fontWeight: 700, color: '#0F1F3D', marginBottom: 4 }}>
            Track Distribution
          </h3>
          <p style={{ fontSize: 12, color: '#8A8070', marginBottom: 16 }}>Mentees enrolled per career track</p>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={trackDistribution} margin={{ bottom: 60 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E8E4D9" />
              <XAxis dataKey="track" tick={{ fontSize: 10, fill: '#8A8070' }} angle={-40} textAnchor="end" interval={0} />
              <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: '#8A8070' }} />
              <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #E8E4D9' }} />
              <Bar dataKey="count" name="Mentees" fill="#0F1F3D" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* ── AT-RISK + COMPLETION PROJECTION ───────────────────────────── */}
        <div className="bit-analytics-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>

          {/* At-risk list */}
          <div className="bit-card">
            <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 16, fontWeight: 700, color: '#0F1F3D', marginBottom: 4, display: 'flex', alignItems: 'center', gap: 7 }}>
              <i className="ti ti-alert-triangle" style={{ fontSize: 15, color: '#ef4444' }} />
              At-Risk Mentees ({atRiskList.length})
            </h3>
            <p style={{ fontSize: 12, color: '#8A8070', marginBottom: 16 }}>Active mentees who are 2+ weeks behind</p>
            {atRiskList.length === 0 ? (
              <div style={{ padding: '24px 0', textAlign: 'center', color: '#8A8070', fontSize: 13 }}>
                <i className="ti ti-circle-check" style={{ fontSize: 26, display: 'block', margin: '0 auto 10px', color: '#bbf7d0' }} />
                No one is at risk right now.
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {atRiskList.map((m: any) => (
                  <div key={m.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#fff5f5', border: '1px solid #fecaca', borderRadius: 9, padding: '10px 14px' }}>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 600, color: '#0F1F3D' }}>{m.name}</div>
                      <div style={{ fontSize: 11, color: '#8A8070' }}>{m.track}</div>
                    </div>
                    <span style={{ fontSize: 12, fontWeight: 700, color: '#b91c1c' }}>{m.weeksBehind} wk behind</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Completion projection */}
          <div className="bit-card">
            <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 16, fontWeight: 700, color: '#0F1F3D', marginBottom: 4, display: 'flex', alignItems: 'center', gap: 7 }}>
              <i className="ti ti-target-arrow" style={{ fontSize: 15, color: '#C9A84C' }} />
              Completion Projection
            </h3>
            <p style={{ fontSize: 12, color: '#8A8070', marginBottom: 16 }}>Based on active, non-paused mentees</p>

            {completionProjection.message ? (
              <div style={{ padding: '24px 0', textAlign: 'center', color: '#8A8070', fontSize: 13 }}>
                <i className="ti ti-chart-dots" style={{ fontSize: 26, display: 'block', margin: '0 auto 10px', color: '#C8C0B4' }} />
                {completionProjection.message}
              </div>
            ) : (
              <>
                <div style={{ marginBottom: 16 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: '#8A8070', marginBottom: 8 }}>
                    <span>Average completion</span>
                    <span style={{ fontFamily: 'monospace', fontWeight: 700, color: '#C9A84C' }}>{completionProjection.averageCompletionPct}%</span>
                  </div>
                  <div style={{ height: 6, borderRadius: 99, background: '#F0EBD8', overflow: 'hidden' }}>
                    <div style={{ height: '100%', borderRadius: 99, background: '#C9A84C', width: `${completionProjection.averageCompletionPct}%` }} />
                  </div>
                </div>
                <div style={{ background: '#F9F7F1', border: '1px solid #E8E4D9', borderRadius: 9, padding: '14px 16px' }}>
                  <div style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#8A8070', marginBottom: 5 }}>
                    Projected cohort completion
                  </div>
                  <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 18, fontWeight: 900, color: '#0F1F3D' }}>
                    {completionProjection.projectedCompletionDate
                      ? new Date(completionProjection.projectedCompletionDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
                      : 'Not enough submission history yet'}
                  </div>
                </div>
                <p style={{ fontSize: 11, color: '#8A8070', marginTop: 10 }}>
                  Based on {completionProjection.eligibleCount} eligible mentee{completionProjection.eligibleCount === 1 ? '' : 's'} (started, not paused).
                </p>
              </>
            )}
          </div>
        </div>

      </div>
    </div>
  )
}
