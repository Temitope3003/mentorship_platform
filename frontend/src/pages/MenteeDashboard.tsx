import { useState } from 'react'
import { useAuthStore } from '../store/authStore'
import { useMenteeStats, useMenteeRoadmap, useCreateSubmission } from '../hooks/useMentee'
import toast from 'react-hot-toast'

const DOMAIN_COLORS: Record<string, string> = {
  'AI & Machine Learning': '#ff6b2b',
  'Data Analysis': '#2563eb',
  'Software Engineering': '#7c3aed',
  'Cloud & Infrastructure': '#0891b2',
  'CyberSecurity': '#ef4444',
  'Product & Design': '#ec4899',
  'Emerging Tech': '#f59e0b',
  'Virtual Assistant': '#059669',
}

interface SubmissionFormData {
  summary: string
  workDone: string
  link: string
}

export function MenteeDashboard() {
  const { user } = useAuthStore()
  const { data: stats, isLoading: statsLoading } = useMenteeStats()
  const { data: roadmap, isLoading: roadmapLoading } = useMenteeRoadmap()
  const createSubmission = useCreateSubmission()
  const [openWeek, setOpenWeek] = useState<number | null>(null)
  const [forms, setForms] = useState<Record<number, SubmissionFormData>>({})
  const [submitting, setSubmitting] = useState<number | null>(null)

  const domainColor = DOMAIN_COLORS[user?.domain || ''] || '#d4622a'
  const firstName = user?.name?.split(' ')[0] || 'there'

  function toggleWeek(week: number) {
    setOpenWeek(prev => prev === week ? null : week)
  }

  function updateForm(week: number, field: keyof SubmissionFormData, value: string) {
    setForms(prev => ({
      ...prev,
      [week]: { ...prev[week], summary: prev[week]?.summary || '', workDone: prev[week]?.workDone || '', link: prev[week]?.link || '', [field]: value }
    }))
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

  if (statsLoading || roadmapLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-ivory">
        <div className="text-center">
          <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-2 border-warm border-t-accent" />
          <p className="text-sm text-muted">Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  const weeks = roadmap?.weeks || []
  const currentWeek = stats?.currentWeek || 1

  return (
    <div className="min-h-screen bg-ivory">
      <div className="mx-auto max-w-4xl px-4 py-12">

        {/* header */}
        <div className="mb-10">
          <div
            className="mb-4 inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-xs font-bold uppercase tracking-widest"
            style={{ background: domainColor + '15', borderColor: domainColor + '30', color: domainColor }}
          >
            {user?.domain}
          </div>
          <h1 className="font-display text-4xl font-black text-text">
            Welcome back, {firstName}
          </h1>
          <p className="mt-2 text-muted">
            Week {currentWeek} of 48 · {stats?.currentPhase}
          </p>
        </div>

        {/* stats row */}
        <div className="mb-8 grid grid-cols-2 gap-4 md:grid-cols-4">
          {[
            { label: 'Current Week', value: stats?.currentWeek || 0, color: domainColor },
            { label: 'Submitted', value: stats?.weeksSubmitted || 0, color: '#1a7a6e' },
            { label: 'Remaining', value: stats?.weeksRemaining || 48, color: '#5b4fcf' },
            { label: 'Complete', value: `${stats?.completionPct || 0}%`, color: '#f59e0b' },
          ].map(stat => (
            <div key={stat.label} className="rounded-2xl border border-border bg-white p-5 shadow-warm-sm">
              <div className="font-mono text-3xl font-semibold" style={{ color: stat.color }}>
                {stat.value}
              </div>
              <div className="mt-1 text-xs font-semibold uppercase tracking-widest text-muted">
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* phase progress */}
        <div className="mb-8 rounded-2xl border border-border bg-white p-6 shadow-warm-sm">
          <div className="mb-3 flex items-center justify-between">
            <div>
              <span className="text-sm font-semibold text-text">{stats?.currentPhase}</span>
            </div>
            <span className="font-mono text-sm font-semibold" style={{ color: domainColor }}>
              {stats?.phaseProgress || 0}%
            </span>
          </div>
          <div className="h-2 rounded-full bg-warm">
            <div
              className="h-full rounded-full transition-all duration-700"
              style={{ width: `${stats?.phaseProgress || 0}%`, background: domainColor }}
            />
          </div>
        </div>

        {/* weeks list */}
        <div className="mb-4">
          <p className="text-xs font-bold uppercase tracking-widest text-muted">
            Weekly Assignments
          </p>
        </div>

        <div className="space-y-3">
          {weeks.map((week: any) => {
            const isOpen = openWeek === week.week
            const form = forms[week.week] || { summary: '', workDone: '', link: '' }
            const statusColor = week.isSubmitted ? '#1a7a6e' : week.isCurrent ? domainColor : week.isLocked ? '#9a8e7e' : '#d97706'
            const statusLabel = week.isSubmitted ? '✓ Submitted' : week.isCurrent ? 'This week' : week.isLocked ? 'Upcoming' : 'Missed'
            const statusBg = week.isSubmitted ? '#f0fdf9' : week.isCurrent ? domainColor + '12' : '#faf7f2'
            const statusBorder = week.isSubmitted ? '#99f6e4' : week.isCurrent ? domainColor + '40' : '#e2d9cc'

            return (
              <div
                key={week.week}
                className="overflow-hidden rounded-2xl border bg-white shadow-warm-sm"
                style={{ borderColor: week.isCurrent ? domainColor + '40' : '#e2d9cc' }}
              >
                {/* week header */}
                <button
                  onClick={() => !week.isLocked && toggleWeek(week.week)}
                  className={`flex w-full items-center justify-between px-5 py-4 text-left transition hover:bg-cream/50 ${week.isLocked ? 'cursor-default opacity-60' : 'cursor-pointer'}`}
                >
                  <div className="flex items-center gap-4 flex-1 min-w-0">
                    <span
                      className="font-mono flex-shrink-0 rounded-full px-3 py-1 text-xs font-semibold"
                      style={{ background: domainColor + '15', color: domainColor }}
                    >
                      W{week.week}
                    </span>
                    <div className="min-w-0">
                      <div className="truncate text-sm font-semibold text-text">{week.title}</div>
                      <div className="text-xs text-muted">{week.phase}</div>
                    </div>
                  </div>
                  <div className="flex flex-shrink-0 items-center gap-3 ml-4">
                    <span
                      className="rounded-full border px-3 py-1 text-xs font-semibold"
                      style={{ background: statusBg, borderColor: statusBorder, color: statusColor }}
                    >
                      {statusLabel}
                    </span>
                    {!week.isLocked && (
                      <svg
                        width="16" height="16" viewBox="0 0 16 16" fill="none"
                        className="transition-transform"
                        style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}
                      >
                        <path d="M4 6l4 4 4-4" stroke="#9a8e7e" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    )}
                  </div>
                </button>

                {/* expanded content */}
                {isOpen && (
                  <div className="border-t border-border px-5 pb-6 pt-5">
                    {/* assignment */}
                    <div className="mb-5 rounded-xl border border-border bg-ivory p-4">
                      <p className="mb-2 text-xs font-bold uppercase tracking-widest text-muted">Assignment</p>
                      <p className="mb-3 text-sm leading-relaxed text-text2">{week.task}</p>
                      <div className="space-y-1.5">
                        {week.resources?.map((r: string, i: number) => (
                          <div key={i} className="flex items-start gap-2 text-xs text-muted">
                            <span className="mt-0.5 text-accent">→</span>
                            <span>{r}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* submitted view */}
                    {week.isSubmitted && roadmap?.weeks && (
                      <div className="rounded-xl border border-green-200 bg-green-50 p-4">
                        <p className="mb-2 text-xs font-bold uppercase tracking-widest text-green-700">
                          ✓ You submitted this week
                        </p>
                        <p className="text-sm text-text2">Great work. Check your dashboard for mentor feedback.</p>
                      </div>
                    )}

                    {/* submission form */}
                    {!week.isSubmitted && !week.isLocked && (
                      <div className="rounded-xl border border-accent/20 bg-accent/5 p-5">
                        <p className="mb-4 text-xs font-bold uppercase tracking-widest text-accent">
                          Submit Week {week.week}
                        </p>
                        <div className="space-y-4">
                          <div>
                            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-widest text-muted">
                              What did you learn this week?
                            </label>
                            <textarea
                              value={form.summary}
                              onChange={e => updateForm(week.week, 'summary', e.target.value)}
                              placeholder="Summarise the key concepts, tools, or ideas you learned. What clicked for you this week?"
                              rows={3}
                              className="w-full resize-none rounded-xl border border-border bg-white px-4 py-3 text-sm text-text shadow-warm-sm outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/15"
                            />
                            <div className="mt-1 text-right">
                              <span className={`text-xs ${form.summary.length >= 20 ? 'text-teal' : 'text-muted'}`}>
                                {form.summary.length} chars {form.summary.length < 20 ? `(need ${20 - form.summary.length} more)` : '✓'}
                              </span>
                            </div>
                          </div>
                          <div>
                            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-widest text-muted">
                              What did you build or do?
                            </label>
                            <textarea
                              value={form.workDone}
                              onChange={e => updateForm(week.week, 'workDone', e.target.value)}
                              placeholder="Describe what you built, practised, or completed. What was hard? What decisions did you make?"
                              rows={3}
                              className="w-full resize-none rounded-xl border border-border bg-white px-4 py-3 text-sm text-text shadow-warm-sm outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/15"
                            />
                            <div className="mt-1 text-right">
                              <span className={`text-xs ${form.workDone.length >= 20 ? 'text-teal' : 'text-muted'}`}>
                                {form.workDone.length} chars {form.workDone.length < 20 ? `(need ${20 - form.workDone.length} more)` : '✓'}
                              </span>
                            </div>
                          </div>
                          <div>
                            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-widest text-muted">
                              Link to your work (optional)
                            </label>
                            <input
                              type="url"
                              value={form.link}
                              onChange={e => updateForm(week.week, 'link', e.target.value)}
                              placeholder="https://github.com/yourname/project"
                              className="w-full rounded-xl border border-border bg-white px-4 py-3 text-sm text-text shadow-warm-sm outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/15"
                            />
                          </div>
                          <button
                            onClick={() => handleSubmit(week.week)}
                            disabled={submitting === week.week}
                            className="rounded-2xl px-6 py-3 text-sm font-semibold text-white shadow-warm-md transition hover:-translate-y-0.5 hover:shadow-warm-lg disabled:opacity-40"
                            style={{ background: domainColor }}
                          >
                            {submitting === week.week ? 'Submitting...' : `Submit Week ${week.week} →`}
                          </button>
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