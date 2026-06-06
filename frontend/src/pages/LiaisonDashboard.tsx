import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

const API = import.meta.env.VITE_API_URL

function useLocalStorage<T>(key: string, initial: T) {
  const [value, setValue] = useState<T>(() => {
    try { return JSON.parse(localStorage.getItem(key) || '') } catch { return initial }
  })
  const set = (v: T) => { localStorage.setItem(key, JSON.stringify(v)); setValue(v) }
  return [value, set] as const
}

export function LiaisonDashboard() {
  const navigate = useNavigate()
  const [token] = useLocalStorage('liaison_token', '')
  const [officer] = useLocalStorage<any>('liaison_officer', null)
  const [data, setData] = useState<any>(null)
  const [mentees, setMentees] = useState<any[]>([])
  const [tab, setTab] = useState<'week' | 'mentees'>('week')
  const [loading, setLoading] = useState(false)
  const [checkinLoading, setCheckinLoading] = useState<string | null>(null)
  const [notes, setNotes] = useState<Record<string, string>>({})

  const headers = { Authorization: `Bearer ${token}` }

  const load = async () => {
    setLoading(true)
    try {
      const [d, m] = await Promise.all([
        axios.get(`${API}/liaison/dashboard`, { headers }),
        axios.get(`${API}/liaison/mentees`, { headers }),
      ])
      setData(d.data)
      setMentees(m.data)
      const n: Record<string, string> = {}
      m.data.forEach((m: any) => { n[m.id] = m.notes || '' })
      setNotes(n)
    } catch {
      navigate('/liaison/login')
    }
    setLoading(false)
  }

  useState(() => { if (token) load() }, [])

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

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-gray-500">Loading dashboard...</p>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center text-white font-bold text-sm">
            {officer?.name?.[0] || 'L'}
          </div>
          <div>
            <p className="font-semibold text-gray-900 text-sm">{officer?.name}</p>
            <p className="text-xs text-gray-500">Liaison Officer</p>
          </div>
        </div>
        <button onClick={logout} className="text-sm text-gray-500 hover:text-gray-900">Logout</button>
      </nav>

      <div className="max-w-5xl mx-auto px-6 py-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Liaison Dashboard</h1>
        <p className="text-gray-500 mb-6">Track your mentees and keep them on course.</p>

        {data && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {[
              { label: 'Total Mentees', value: data.summary.total, color: 'text-gray-900' },
              { label: 'Submitted', value: data.summary.submittedCount, color: 'text-green-600' },
              { label: 'Not Submitted', value: data.summary.notSubmittedCount, color: 'text-yellow-600' },
              { label: 'At Risk', value: data.summary.atRiskCount, color: 'text-red-600' },
            ].map(s => (
              <div key={s.label} className="bg-white rounded-xl border border-gray-200 p-4">
                <p className="text-sm text-gray-500">{s.label}</p>
                <p className={`text-3xl font-bold mt-1 ${s.color}`}>{s.value}</p>
              </div>
            ))}
          </div>
        )}

        <div className="flex gap-2 mb-6">
          {(['week', 'mentees'] as const).map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                tab === t
                  ? 'bg-orange-500 text-white'
                  : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
              }`}
            >
              {t === 'week' ? 'This Week' : 'All Mentees'}
            </button>
          ))}
        </div>

        {tab === 'week' && data && (
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-green-50 border border-green-200 rounded-xl p-4">
              <h3 className="font-semibold text-green-800 mb-3">✅ Submitted ({data.submitted.length})</h3>
              {data.submitted.length === 0
                ? <p className="text-sm text-gray-500">None yet this week</p>
                : data.submitted.map((m: any) => (
                  <div key={m.id} className="bg-white rounded-lg p-3 mb-2 border border-green-100">
                    <p className="font-medium text-sm text-gray-900">{m.name}</p>
                    <p className="text-xs text-gray-500">{m.domainTrack}</p>
                    <p className="text-xs text-gray-400">{m.accessCode}</p>
                  </div>
                ))
              }
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
              <h3 className="font-semibold text-yellow-800 mb-3">⚠️ Not Submitted ({data.notSubmitted.length})</h3>
              {data.notSubmitted.length === 0
                ? <p className="text-sm text-gray-500">Everyone submitted!</p>
                : data.notSubmitted.map((m: any) => (
                  <div key={m.id} className="bg-white rounded-lg p-3 mb-2 border border-yellow-100">
                    <p className="font-medium text-sm text-gray-900">{m.name}</p>
                    <p className="text-xs text-gray-500">{m.domainTrack}</p>
                    <p className="text-xs text-gray-400">Week {m.currentWeek}</p>
                    <button
                      onClick={() => sendCheckin(m.id)}
                      disabled={checkinLoading === m.id}
                      className="mt-2 w-full bg-yellow-500 text-white text-xs py-1.5 rounded-lg hover:bg-yellow-600 disabled:opacity-50"
                    >
                      {checkinLoading === m.id ? 'Sending...' : 'Send Check-in'}
                    </button>
                  </div>
                ))
              }
            </div>

            <div className="bg-red-50 border border-red-200 rounded-xl p-4">
              <h3 className="font-semibold text-red-800 mb-3">🚨 Needs Help ({data.atRisk.length})</h3>
              {data.atRisk.length === 0
                ? <p className="text-sm text-gray-500">No one at risk.</p>
                : data.atRisk.map((m: any) => (
                  <div key={m.id} className="bg-white rounded-lg p-3 mb-2 border border-red-100">
                    <p className="font-medium text-sm text-gray-900">{m.name}</p>
                    <p className="text-xs text-gray-500">{m.domainTrack}</p>
                    <p className="text-xs text-red-500 font-medium">{m.weeksBehind} weeks behind</p>
                    <button
                      onClick={() => sendCheckin(m.id)}
                      disabled={checkinLoading === m.id}
                      className="mt-2 w-full bg-red-500 text-white text-xs py-1.5 rounded-lg hover:bg-red-600 disabled:opacity-50"
                    >
                      {checkinLoading === m.id ? 'Sending...' : 'Send Check-in'}
                    </button>
                  </div>
                ))
              }
            </div>
          </div>
        )}

        {tab === 'mentees' && (
          <div className="space-y-4">
            {mentees.map((m: any) => (
              <div key={m.id} className="bg-white rounded-xl border border-gray-200 p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-semibold text-gray-900">{m.name}</p>
                      <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">{m.accessCode}</span>
                    </div>
                    <p className="text-sm text-gray-500">{m.domainTrack}</p>
                    <p className="text-xs text-gray-400 mt-1">Week {m.currentWeek} of 48 · {m.submissionsCount} submissions</p>
                    <div className="mt-2 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-orange-500 rounded-full"
                        style={{ width: `${Math.round((m.currentWeek / 48) * 100)}%` }}
                      />
                    </div>
                  </div>
                  <button
                    onClick={() => sendCheckin(m.id)}
                    disabled={checkinLoading === m.id}
                    className="bg-orange-500 text-white text-xs px-3 py-2 rounded-lg hover:bg-orange-600 disabled:opacity-50 whitespace-nowrap"
                  >
                    {checkinLoading === m.id ? 'Sending...' : 'Check In'}
                  </button>
                </div>
                <div className="mt-3">
                  <textarea
                    value={notes[m.id] || ''}
                    onChange={e => setNotes(prev => ({ ...prev, [m.id]: e.target.value }))}
                    placeholder="Private notes about this mentee..."
                    className="w-full text-sm border border-gray-200 rounded-lg p-2 resize-none h-20 focus:outline-none focus:border-orange-400"
                  />
                  <button
                    onClick={() => saveNotes(m.id)}
                    className="mt-1 text-xs text-orange-600 hover:text-orange-800 font-medium"
                  >
                    Save notes
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}