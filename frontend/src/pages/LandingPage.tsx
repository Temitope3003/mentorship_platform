import { Link } from 'react-router-dom'
import { DOMAINS } from '../utils/questionData'

export function LandingPage() {
  return (
    <div className="relative overflow-hidden">
      {/* ambient glow */}
      <div className="pointer-events-none fixed right-0 top-0 h-96 w-96 -translate-y-1/2 translate-x-1/2 rounded-full bg-accent/5 blur-3xl" />
      <div className="pointer-events-none fixed bottom-0 left-0 h-96 w-96 translate-y-1/2 -translate-x-1/2 rounded-full bg-teal/5 blur-3xl" />

      {/* HERO */}
      <section className="relative px-6 pb-20 pt-24">
        <div className="mx-auto max-w-4xl">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-accent/20 bg-accent/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-accent">
            <span className="h-1.5 w-1.5 rounded-full bg-accent" />
            MLOps Mentorship Program
          </div>

          <h1 className="font-display mb-6 text-5xl font-black leading-none tracking-tight md:text-7xl">
            Find your path.
            <br />
            <span className="text-accent">Build it</span> in 12 months.
          </h1>

          <p className="mb-10 max-w-lg text-lg leading-relaxed text-white/60">
            An AI-powered career assessment that matches you to the right tech domain,
            builds a personalised roadmap, and tracks your progress week by week.
          </p>

          <div className="flex flex-wrap gap-4">
            <Link
              to="/assess"
              className="inline-flex items-center gap-2 rounded-xl bg-accent px-8 py-4 text-base font-semibold text-white transition hover:-translate-y-0.5 hover:bg-accent/90 hover:shadow-[0_12px_32px_rgba(255,107,43,0.35)]"
            >
              Take the Assessment
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
            <Link
              to="/login"
              className="inline-flex items-center gap-2 rounded-xl border border-white/[0.07] bg-white/5 px-8 py-4 text-base font-semibold text-white transition hover:bg-white/10"
            >
              Mentee Login
            </Link>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="px-6 py-20">
        <div className="mx-auto max-w-4xl">
          <p className="mb-10 text-xs font-bold uppercase tracking-[0.16em] text-muted">
            How it works
          </p>
          <div className="grid gap-4 md:grid-cols-3">
            {[
              { num: '01', color: 'text-accent', title: 'Tell us your goal', desc: 'Write what you want to build or become in tech. Your own words, no filters.' },
              { num: '02', color: 'text-teal', title: 'Take the Assessment', desc: '18 questions about how you think, work, and what excites you. Takes 8 minutes.' },
              { num: '03', color: 'text-purple-400', title: 'Get your roadmap', desc: 'AI analyses your goal vs your aptitude and builds your personalised 12-month plan.' },
            ].map((step) => (
              <div key={step.num} className="rounded-2xl border border-white/[0.07] bg-card p-7">
                <div className={`font-mono mb-5 text-sm font-medium ${step.color}`}>
                  {step.num}
                </div>
                <h3 className="font-display mb-3 text-lg font-bold">{step.title}</h3>
                <p className="text-sm leading-relaxed text-muted">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* DOMAINS */}
      <section className="px-6 pb-24">
        <div className="mx-auto max-w-4xl">
          <p className="mb-8 text-xs font-bold uppercase tracking-[0.16em] text-muted">
            8 career domains
          </p>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            {DOMAINS.map((d) => (
              <div
                key={d.name}
                className="rounded-xl border border-white/[0.07] bg-card p-4 transition hover:-translate-y-0.5"
                style={{ borderTopColor: d.color, borderTopWidth: 2 }}
              >
                <div className="mb-2 text-2xl">{d.icon}</div>
                <div className="text-sm font-semibold">{d.name}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}