import { useEffect, useState } from 'react'
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

const DOMAINS = [
  'AI & Machine Learning', 'Data Analysis', 'Data Science & Engineering',
  'Full Stack Engineering', 'Frontend Development', 'Backend Development',
  'Cloud & Infrastructure', 'Cybersecurity', 'Product, Design & UX',
  'Emerging Tech', 'Virtual Assistant', 'AI Automation & No-Code',
  'DevRel & Technical Writing', 'Mobile Development',
]

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

type Tab = 'mentees' | 'submissions' | 'codes' | 'add' | 'liaison'

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

  return (
    <div className="min-h-screen bg-ivory">
      <div className="mx-auto max-w-6xl px-4 py-12">

        {/* header */}
        <div className="mb-10 flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-purple-200 bg-purple-50 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-purple-600">
              Mentor Dashboard
            </div>
            <h1 className="font-display text-4xl font-black text-text">
              Program Overview
            </h1>
            <p className="mt-2 text-muted">Welcome back, {user?.name}</p>
          </div>
          <button
            onClick={() => setTab('add')}
            className="rounded-2xl border border-border bg-white px-5 py-2.5 text-sm font-semibold text-text shadow-warm-sm transition hover:shadow-warm-md"
          >
            + Add Mentee
          </button>
        </div>

        {/* stats */}
        <div className="mb-8 grid grid-cols-2 gap-4 md:grid-cols-4">
          {[
            { label: 'Total Mentees', value: stats?.totalMentees || 0, color: '#5b4fcf' },
            { label: 'Submissions This Week', value: stats?.submissionsThisWeek || 0, color: '#1a7a6e' },
            { label: 'Engagement Rate', value: `${stats?.engagementRate || 0}%`, color: '#d4622a' },
            { label: 'At Risk', value: stats?.atRisk || 0, color: '#ef4444' },
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

        {/* at risk banner */}
        {stats?.atRisk > 0 && (
          <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-6 py-4">
            <div className="flex items-center gap-3">
              <span className="text-xl">⚠️</span>
              <div>
                <p className="text-sm font-semibold text-red-700">
                  {stats.atRisk} mentee{stats.atRisk > 1 ? 's are' : ' is'} 2+ weeks behind
                </p>
                <p className="text-xs text-red-600">Consider sending them a personal check-in message.</p>
              </div>
            </div>
          </div>
        )}

        {/* tabs */}
        <div className="mb-6 flex gap-1 border-b border-border">
          {([
            { id: 'mentees', label: 'All Mentees' },
            { id: 'submissions', label: 'Submissions' },
            { id: 'codes', label: 'Access Codes' },
            { id: 'add', label: '+ Add Mentee' },
            { id: 'liaison', label: 'Liaison Officers' },
          ] as { id: Tab; label: string }[]).map(t => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`border-b-2 px-5 py-3 text-sm font-medium transition ${tab === t.id ? 'border-accent text-accent' : 'border-transparent text-muted hover:text-text'}`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* TAB: ALL MENTEES */}
        {tab === 'mentees' && (
          <div>
            <div className="mb-4 flex flex-wrap gap-3">
              <input
                type="text"
                placeholder="Search by name or email..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-64 rounded-xl border border-border bg-white px-4 py-2.5 text-sm text-text shadow-warm-sm outline-none focus:border-accent focus:ring-2 focus:ring-accent/15"
              />
              <select
                value={domainFilter}
                onChange={e => setDomainFilter(e.target.value)}
                className="rounded-xl border border-border bg-white px-4 py-2.5 text-sm text-text shadow-warm-sm outline-none focus:border-accent"
              >
                <option value="">All domains</option>
                {DOMAINS.map(d => <option key={d}>{d}</option>)}
              </select>
            </div>

            {menteesLoading ? (
              <div className="py-12 text-center text-muted">Loading mentees...</div>
            ) : (
              <div className="overflow-hidden rounded-2xl border border-border bg-white shadow-warm-sm">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      {['Mentee', 'Domain', 'Week', 'Submissions', 'Progress', 'Status', 'Assign', 'Remove'].map(h => (
                        <th key={h} className="px-4 py-3 text-left text-xs font-bold uppercase tracking-widest text-muted">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filteredMentees.map((m: any) => {
                      const color = DOMAIN_COLORS[m.domainTrack] || '#d4622a'
                      const pct = Math.round((m.submissionsCount / 48) * 100)
                      const isAtRisk = m.currentWeek - m.submissionsCount >= 2
                      return (
                        <tr key={m.id} className="border-b border-border/50 transition hover:bg-cream/30">
                          <td className="px-4 py-3.5">
                            <div className="text-sm font-semibold text-text">{m.name}</div>
                            <div className="font-mono text-xs text-muted">{m.accessCode}</div>
                          </td>
                          <td className="px-4 py-3.5">
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
                              className="rounded-lg border border-border bg-white px-2 py-1 text-xs font-semibold outline-none focus:border-accent"
                              style={{ color }}
                            >
                              {DOMAINS.map(d => (
                                <option key={d} value={d}>{d}</option>
                              ))}
                            </select>
                          </td>
                          <td className="px-4 py-3.5">
                            <span className="font-mono text-sm text-text2">W{m.currentWeek}/48</span>
                          </td>
                          <td className="px-4 py-3.5">
                            <span className="font-mono text-sm text-text2">{m.submissionsCount}</span>
                          </td>
                          <td className="px-4 py-3.5">
                            <div className="flex items-center gap-2">
                              <div className="h-1.5 w-20 overflow-hidden rounded-full bg-warm">
                                <div className="h-full rounded-full" style={{ width: `${pct}%`, background: color }} />
                              </div>
                              <span className="font-mono text-xs text-muted">{pct}%</span>
                            </div>
                          </td>
                          <td className="px-4 py-3.5">
                            {isAtRisk ? (
                              <span className="rounded-full border border-red-200 bg-red-50 px-2.5 py-1 text-xs font-semibold text-red-600">At Risk</span>
                            ) : (
                              <span className="rounded-full border border-green-200 bg-green-50 px-2.5 py-1 text-xs font-semibold text-green-700">Active</span>
                            )}
                          </td>
                          <td className="px-4 py-3.5">
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
                              className="rounded-lg border border-border bg-white px-2 py-1 text-xs outline-none focus:border-accent"
                            >
                              <option value="">Unassigned</option>
                              {officers.map((o: any) => (
                                <option key={o.id} value={o.id}>{o.name}</option>
                              ))}
                            </select>
                          </td>
                          <td className="px-4 py-3.5">
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
                              className="text-xs text-red-500 hover:text-red-700 font-medium"
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
                  <div className="py-12 text-center text-muted">No mentees found.</div>
                )}
              </div>
            )}
          </div>
        )}

        {/* TAB: SUBMISSIONS */}
        {tab === 'submissions' && (
          <div className="space-y-4">
            {subsLoading ? (
              <div className="py-12 text-center text-muted">Loading submissions...</div>
            ) : submissions?.length === 0 ? (
              <div className="py-12 text-center text-muted">No submissions yet.</div>
            ) : submissions?.map((s: any) => {
              const color = DOMAIN_COLORS[s.mentee?.domainTrack] || '#d4622a'
              return (
                <div key={s.id} className="rounded-2xl border border-border bg-white p-6 shadow-warm-sm">
                  <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="text-sm font-bold text-text">{s.mentee?.name}</span>
                      <span className="rounded-full border px-2.5 py-1 text-xs font-semibold" style={{ background: color + '15', borderColor: color + '30', color }}>
                        {s.mentee?.domainTrack}
                      </span>
                      <span className="text-sm font-semibold" style={{ color }}>Week {s.weekNumber}</span>
                    </div>
                    <span className="text-xs text-muted">
                      {new Date(s.submittedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <div className="mb-3 rounded-xl bg-ivory p-4">
                    <p className="mb-1 text-xs font-bold uppercase tracking-widest text-muted">What they learned</p>
                    <p className="text-sm leading-relaxed text-text2">{s.summary}</p>
                  </div>
                  <div className="mb-3 rounded-xl bg-ivory p-4">
                    <p className="mb-1 text-xs font-bold uppercase tracking-widest text-muted">What they built</p>
                    <p className="text-sm leading-relaxed text-text2">{s.workDone}</p>
                  </div>
                  {s.link && (
                    <div className="mb-3">
                      <a href={s.link} target="_blank" rel="noopener noreferrer" className="text-sm text-accent underline transition hover:text-accent/70">
                        {s.link}
                      </a>
                    </div>
                  )}
                  {s.mentorFeedback ? (
                    <div className="rounded-xl border border-green-200 bg-green-50 p-4">
                      <p className="mb-1 text-xs font-bold uppercase tracking-widest text-green-700">✓ Feedback sent</p>
                      <p className="text-sm text-text2">{s.mentorFeedback}</p>
                    </div>
                  ) : (
                    <button
                      onClick={() => { setFeedbackModal({ id: s.id, week: s.weekNumber, name: s.mentee?.name, summary: s.summary }); setFeedbackText('') }}
                      className="rounded-xl border border-border bg-ivory px-4 py-2 text-xs font-semibold text-text2 shadow-warm-sm transition hover:shadow-warm-md"
                    >
                      + Add Feedback
                    </button>
                  )}
                </div>
              )
            })}
          </div>
        )}

        {/* TAB: ACCESS CODES */}
        {tab === 'codes' && (
          <div>
            <p className="mb-4 text-sm text-muted">
              Share each code privately with the corresponding mentee. They enter it on the login screen.
            </p>
            <div className="space-y-3">
              {(codes || []).map((m: any) => {
                const color = DOMAIN_COLORS[m.domainTrack] || '#d4622a'
                return (
                  <div key={m.id} className="flex items-center justify-between rounded-2xl border border-border bg-white p-5 shadow-warm-sm">
                    <div>
                      <div className="font-mono text-lg font-semibold text-purple-600">{m.accessCode}</div>
                      <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-muted">
                        <span className="font-semibold text-text2">{m.name}</span>
                        <span>·</span>
                        <span style={{ color }}>{m.domainTrack}</span>
                        <span>·</span>
                        <span>{m.email}</span>
                      </div>
                    </div>
                    <button
                      onClick={() => { navigator.clipboard.writeText(m.accessCode); toast.success('Code copied') }}
                      className="rounded-xl border border-border bg-ivory px-4 py-2 text-xs font-semibold text-text2 shadow-warm-sm transition hover:shadow-warm-md"
                    >
                      Copy
                    </button>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* TAB: ADD MENTEE */}
        {tab === 'add' && (
          <div className="mx-auto max-w-md">
            <h2 className="font-display mb-2 text-2xl font-bold text-text">Add New Mentee</h2>
            <p className="mb-6 text-sm text-muted">
              An access code is generated automatically and the welcome email is sent immediately.
            </p>
            <div className="rounded-2xl border border-border bg-white p-8 shadow-warm-md">
              <div className="space-y-5">
                <div>
                  <label className="mb-2 block text-xs font-bold uppercase tracking-widest text-muted">Full Name</label>
                  <input
                    type="text"
                    value={addForm.name}
                    onChange={e => setAddForm(p => ({ ...p, name: e.target.value }))}
                    placeholder="e.g. Amara Johnson"
                    className="w-full rounded-xl border border-border bg-ivory px-4 py-3 text-sm text-text shadow-warm-sm outline-none focus:border-accent focus:ring-2 focus:ring-accent/15"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-xs font-bold uppercase tracking-widest text-muted">Email</label>
                  <input
                    type="email"
                    value={addForm.email}
                    onChange={e => setAddForm(p => ({ ...p, email: e.target.value }))}
                    placeholder="e.g. amara@email.com"
                    className="w-full rounded-xl border border-border bg-ivory px-4 py-3 text-sm text-text shadow-warm-sm outline-none focus:border-accent focus:ring-2 focus:ring-accent/15"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-xs font-bold uppercase tracking-widest text-muted">Domain Track</label>
                  <select
                    value={addForm.domain}
                    onChange={e => setAddForm(p => ({ ...p, domain: e.target.value }))}
                    className="w-full rounded-xl border border-border bg-ivory px-4 py-3 text-sm text-text shadow-warm-sm outline-none focus:border-accent"
                  >
                    <option value="">Select a domain</option>
                    {DOMAINS.map(d => <option key={d}>{d}</option>)}
                  </select>
                </div>
                <button
                  onClick={handleCreateMentee}
                  disabled={createMentee.isPending}
                  className="w-full rounded-2xl bg-accent py-3.5 text-sm font-semibold text-white shadow-warm-md transition hover:-translate-y-0.5 hover:shadow-warm-lg disabled:opacity-40"
                >
                  {createMentee.isPending ? 'Adding...' : 'Generate Code and Send Welcome Email →'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TAB: LIAISON OFFICERS */}
        {tab === 'liaison' && <LiaisonOfficersTab onOfficersChange={setOfficers} />}

      </div>

      {/* FEEDBACK MODAL */}
      {feedbackModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 backdrop-blur-sm"
          onClick={e => { if (e.target === e.currentTarget) { setFeedbackModal(null); setFeedbackText('') } }}
        >
          <div className="w-full max-w-lg rounded-3xl border border-border bg-white p-8 shadow-warm-lg">
            <h2 className="font-display mb-1 text-xl font-bold text-text">Add Feedback</h2>
            <p className="mb-4 text-sm text-muted">
              {feedbackModal.name} — Week {feedbackModal.week}
            </p>
            <div className="mb-4 rounded-xl bg-ivory p-4">
              <p className="mb-1 text-xs font-bold uppercase tracking-widest text-muted">Their summary</p>
              <p className="text-sm text-text2 line-clamp-3">{feedbackModal.summary}</p>
            </div>
            <div className="mb-5">
              <label className="mb-2 block text-xs font-bold uppercase tracking-widest text-muted">Your Feedback</label>
              <textarea
                value={feedbackText}
                onChange={e => setFeedbackText(e.target.value)}
                placeholder="Be specific and encouraging. What did they do well? What should they focus on next week?"
                rows={4}
                className="w-full resize-none rounded-xl border border-border bg-ivory px-4 py-3 text-sm text-text outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/15"
              />
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleAddFeedback}
                disabled={addFeedback.isPending}
                className="flex-1 rounded-2xl bg-accent py-3 text-sm font-semibold text-white shadow-warm-md transition hover:-translate-y-0.5 disabled:opacity-40"
              >
                {addFeedback.isPending ? 'Sending...' : 'Send Feedback →'}
              </button>
              <button
                onClick={() => { setFeedbackModal(null); setFeedbackText('') }}
                className="rounded-2xl border border-border bg-ivory px-5 py-3 text-sm font-semibold text-text2 shadow-warm-sm transition hover:shadow-warm-md"
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
      const res = await api.get('/mentor/liaison-officers')
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
    <div className="space-y-6">
      <div className="bg-white rounded-2xl border border-border p-6 shadow-warm-sm">
        <h3 className="font-semibold text-text mb-1">Add Liaison Officer</h3>
        <p className="text-sm text-muted mb-4">Liaison officers manage a group of mentees and receive weekly reports every Monday.</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="Full name"
            className="rounded-xl border border-border bg-ivory px-4 py-2.5 text-sm text-text outline-none focus:border-accent"
          />
          <input
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="Email address"
            className="rounded-xl border border-border bg-ivory px-4 py-2.5 text-sm text-text outline-none focus:border-accent"
          />
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="Password"
            className="rounded-xl border border-border bg-ivory px-4 py-2.5 text-sm text-text outline-none focus:border-accent"
          />
        </div>
        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
        <button
          onClick={create}
          disabled={loading}
          className="mt-4 bg-accent text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-accent/90 disabled:opacity-50 transition"
        >
          {loading ? 'Creating...' : 'Create Officer'}
        </button>
      </div>

      <div className="space-y-3">
        {officers.map(o => (
          <div key={o.id} className="bg-white rounded-2xl border border-border p-5 flex items-center justify-between shadow-warm-sm">
            <div>
              <p className="font-semibold text-text">{o.name}</p>
              <p className="text-sm text-muted">{o.email}</p>
              <p className="text-xs text-muted mt-1">Logs in at buildintech.xyz/liaison/login</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-3xl font-bold text-text">{o.menteeCount}</p>
                <p className="text-xs text-muted">mentees assigned</p>
              </div>
              <button
                onClick={async () => {
                  if (!confirm(`Remove ${o.name} as liaison officer?`)) return
                  try {
                    await api.patch(`/mentor/liaison-officers/${o.id}/deactivate`)
                    toast.success(`${o.name} removed`)
                    load()
                  } catch {
                    toast.error('Failed to remove officer')
                  }
                }}
                className="text-xs text-red-500 hover:text-red-700 font-medium"
              >
                Remove
              </button>
            </div>
          </div>
        ))}
        {officers.length === 0 && (
          <div className="py-12 text-center text-muted text-sm">
            No liaison officers yet. Add one above.
          </div>
        )}
      </div>
    </div>
  )
}
