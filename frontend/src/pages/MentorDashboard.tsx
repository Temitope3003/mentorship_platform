import { useAuthStore } from '../store/authStore'

export function MentorDashboard() {
  const { user } = useAuthStore()

  return (
    <div className="mx-auto max-w-4xl px-4 py-16">
      <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-purple-500/20 bg-purple-500/10 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-purple-400">
        Mentor Dashboard
      </div>
      <h1 className="font-display mt-4 text-4xl font-black">
        Welcome, {user?.name}
      </h1>
      <p className="mt-3 text-muted">Your full mentor dashboard is coming in Phase 8.</p>
    </div>
  )
}