import { Link } from 'react-router-dom'
import { DOMAINS } from '../utils/questionData'

const TESTIMONIALS = [
  {
    name: 'Amara Johnson',
    role: 'Now a Junior ML Engineer',
    avatar: 'AJ',
    color: '#d4622a',
    text: 'I had no idea where to start in tech. The assessment told me I was naturally suited for AI and Machine Learning. 12 months later I landed my first job.',
  },
  {
    name: 'Kofi Mensah',
    role: 'Now a Backend Developer',
    avatar: 'KM',
    color: '#1a7a6e',
    text: 'The weekly tracker kept me accountable every single week. Having a mentor review my submissions made all the difference.',
  },
  {
    name: 'Fatima Al-Rashid',
    role: 'Now a Data Analyst',
    avatar: 'FA',
    color: '#5b4fcf',
    text: 'I was a complete beginner. The roadmap was so detailed I always knew exactly what to do next. No confusion, no guessing.',
  },
]

const STATS = [
  { num: '35+', label: 'Active Mentees' },
  { num: '14', label: 'Career Domains' },
  { num: '48', label: 'Weeks of Curriculum' },
  { num: '28', label: 'Career Paths' },
]

const STEPS = [
  {
    num: '01',
    icon: '✍️',
    title: 'Tell us your goal',
    desc: 'Write what you want to build, learn, or become in tech. Your own words. No filters. We read it carefully.',
    color: '#d4622a',
  },
  {
    num: '02',
    icon: '🧠',
    title: 'Complete the Assessment',
    desc: '24 questions about how you think, what excites you, and how you work. Takes about 8 minutes.',
    color: '#1a7a6e',
  },
  {
    num: '03',
    icon: '🗺️',
    title: 'Get your roadmap',
    desc: 'AI compares your goal with your natural aptitude and builds a personalised 12-month learning plan.',
    color: '#5b4fcf',
  },
  {
    num: '04',
    icon: '📈',
    title: 'Track your progress',
    desc: 'Log in weekly, submit your work, and get direct feedback from your mentor every step of the way.',
    color: '#2d6a4f',
  },
]

export function LandingPage() {
  return (
    <div className="overflow-hidden bg-ivory">

      {/* ── HERO ── */}
      <section className="relative px-6 pb-24 pt-20">
        {/* decorative blob */}
        <div className="pointer-events-none absolute right-0 top-0 h-[600px] w-[600px] -translate-y-1/4 translate-x-1/4 rounded-full bg-gradient-to-br from-accent/10 to-accent2/5 blur-3xl" />
        <div className="pointer-events-none absolute bottom-0 left-0 h-96 w-96 -translate-x-1/3 translate-y-1/3 rounded-full bg-teal/5 blur-3xl" />

        <div className="relative mx-auto max-w-5xl">
          <div className="max-w-3xl">
            {/* eyebrow */}
            <div className="animate-fade-up mb-6 inline-flex items-center gap-2 rounded-full border border-accent/20 bg-accent/8 px-4 py-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-accent" />
              <span className="text-xs font-semibold uppercase tracking-widest text-accent">
                Tech Mentorship Program
              </span>
            </div>

            {/* headline */}
            <h1 className="animate-fade-up-1 font-display mb-6 text-5xl font-black leading-[1.08] tracking-tight text-text md:text-6xl lg:text-7xl">
              Your tech career
              <br />
              starts with the{' '}
              <span className="relative italic text-accent">
                right path
                <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 300 12" fill="none">
                  <path d="M2 9C50 4 100 2 150 5C200 8 250 6 298 3" stroke="#d4622a" strokeWidth="3" strokeLinecap="round" opacity="0.4"/>
                </svg>
              </span>
            </h1>

            {/* subheadline */}
            <p className="animate-fade-up-2 mb-10 max-w-xl text-lg leading-relaxed text-text2">
              A free AI-powered platform that matches you to the right tech career, builds your personalised 12-month roadmap, and tracks your weekly progress with mentor support.
            </p>

            {/* CTA buttons */}
            <div className="animate-fade-up-3 flex flex-wrap items-center gap-4">
              <Link
                to="/assess"
                className="inline-flex items-center gap-2 rounded-2xl bg-accent px-8 py-4 text-base font-semibold text-white shadow-warm-md transition hover:-translate-y-1 hover:bg-accent/90 hover:shadow-warm-lg"
              >
                Start the Free Assessment
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </Link>
              <Link
                to="/login"
                className="inline-flex items-center gap-2 rounded-2xl border border-border bg-white px-8 py-4 text-base font-semibold text-text2 shadow-warm-sm transition hover:-translate-y-0.5 hover:border-accent/30 hover:text-text hover:shadow-warm-md"
              >
                I have an access code
              </Link>
            </div>

            {/* trust strip */}
            <div className="animate-fade-up-4 mt-10 flex flex-wrap items-center gap-6">
              <div className="flex -space-x-2">
                {['AJ','KM','FA','CO','NP'].map((init, i) => (
                  <div
                    key={i}
                    className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-ivory text-xs font-bold text-white"
                    style={{ background: ['#d4622a','#1a7a6e','#5b4fcf','#2d6a4f','#e8954a'][i] }}
                  >
                    {init}
                  </div>
                ))}
              </div>
              <p className="text-sm text-muted">
                <strong className="font-semibold text-text2">35+ mentees</strong> already building their tech careers
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── STATS STRIP ── */}
      <section className="border-y border-border bg-cream px-6 py-10">
        <div className="mx-auto grid max-w-4xl grid-cols-2 gap-6 md:grid-cols-4">
          {STATS.map((s) => (
            <div key={s.label} className="text-center">
              <div className="font-display text-4xl font-black text-accent">{s.num}</div>
              <div className="mt-1 text-sm font-medium text-muted">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="px-6 py-24">
        <div className="mx-auto max-w-5xl">
          <div className="mb-4 text-center">
            <span className="text-xs font-bold uppercase tracking-widest text-accent">How it works</span>
          </div>
          <h2 className="font-display mb-4 text-center text-4xl font-black text-text md:text-5xl">
            From zero to employed
            <br />
            <span className="italic text-accent">in four steps</span>
          </h2>
          <p className="mx-auto mb-16 max-w-xl text-center text-lg text-muted">
            No experience needed. No confusion about where to start. Just a clear, structured path from where you are to where you want to be.
          </p>

          <div className="grid gap-6 md:grid-cols-2">
            {STEPS.map((step) => (
              <div
                key={step.num}
                className="group relative overflow-hidden rounded-3xl border border-border bg-white p-8 shadow-warm-sm transition hover:-translate-y-1 hover:shadow-warm-md"
              >
                <div
                  className="absolute right-0 top-0 h-32 w-32 -translate-y-1/2 translate-x-1/2 rounded-full opacity-10 transition group-hover:opacity-20"
                  style={{ background: step.color }}
                />
                <div className="relative">
                  <div className="mb-4 flex items-center gap-3">
                    <span className="text-3xl">{step.icon}</span>
                    <span
                      className="font-mono text-xs font-semibold"
                      style={{ color: step.color }}
                    >
                      {step.num}
                    </span>
                  </div>
                  <h3 className="font-display mb-3 text-xl font-bold text-text">{step.title}</h3>
                  <p className="text-sm leading-relaxed text-muted">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-10 text-center">
            <Link
              to="/assess"
              className="inline-flex items-center gap-2 rounded-2xl bg-accent px-8 py-4 text-base font-semibold text-white shadow-warm-md transition hover:-translate-y-0.5 hover:shadow-warm-lg"
            >
              Start Now — It's Free
            </Link>
          </div>
        </div>
      </section>

      {/* ── 14 DOMAINS ── */}
      <section className="bg-cream px-6 py-24">
        <div className="mx-auto max-w-5xl">
          <div className="mb-4 text-center">
            <span className="text-xs font-bold uppercase tracking-widest text-accent">Career domains</span>
          </div>
          <h2 className="font-display mb-4 text-center text-4xl font-black text-text md:text-5xl">
            14 paths. One right fit <span className="italic text-accent">for you.</span>
          </h2>
          <p className="mx-auto mb-14 max-w-xl text-center text-lg text-muted">
            Our assessment matches you to the domain that fits your natural strengths and working style, not just what is popular.
          </p>

          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {DOMAINS.map((d) => (
              <Link
                to={`/domain/${encodeURIComponent(d.name)}`}
                key={d.name}
                className="group cursor-pointer rounded-2xl border border-border bg-white p-5 shadow-warm-sm transition hover:-translate-y-1 hover:shadow-warm-md"
              >
                <div
                  className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl text-xl transition group-hover:scale-110"
                  style={{ background: d.color + '18' }}
                >
                  {d.icon}
                </div>
                <div className="text-sm font-semibold leading-snug text-text">{d.name}</div>
                <div
                  className="mt-2 h-0.5 w-8 rounded-full transition group-hover:w-14"
                  style={{ background: d.color }}
                />
                <div className="mt-2 text-xs text-muted opacity-0 transition group-hover:opacity-100">
                  Learn more →
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section className="px-6 py-24">
        <div className="mx-auto max-w-5xl">
          <div className="mb-4 text-center">
            <span className="text-xs font-bold uppercase tracking-widest text-accent">Success stories</span>
          </div>
          <h2 className="font-display mb-14 text-center text-4xl font-black text-text md:text-5xl">
            Real results from <span className="italic text-accent">real people</span>
          </h2>

          <div className="grid gap-6 md:grid-cols-3">
            {TESTIMONIALS.map((t) => (
              <div
                key={t.name}
                className="flex flex-col rounded-3xl border border-border bg-white p-8 shadow-warm-sm"
              >
                {/* stars */}
                <div className="mb-4 flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} width="14" height="14" viewBox="0 0 14 14" fill="#d4622a">
                      <path d="M7 1l1.8 3.6L13 5.4l-3 2.9.7 4.1L7 10.4l-3.7 2 .7-4.1-3-2.9 4.2-.8L7 1z"/>
                    </svg>
                  ))}
                </div>
                <p className="mb-6 flex-1 text-sm leading-relaxed text-text2">"{t.text}"</p>
                <div className="flex items-center gap-3">
                  <div
                    className="flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold text-white"
                    style={{ background: t.color }}
                  >
                    {t.avatar}
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-text">{t.name}</div>
                    <div className="text-xs text-muted">{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── WHAT YOU GET ── */}
      <section className="bg-cream px-6 py-24">
        <div className="mx-auto max-w-5xl">
          <div className="overflow-hidden rounded-3xl border border-border bg-white shadow-warm-md">
            <div className="grid md:grid-cols-2">
              {/* left */}
              <div className="p-10 md:p-14">
                <div className="mb-4">
                  <span className="text-xs font-bold uppercase tracking-widest text-accent">What you get</span>
                </div>
                <h2 className="font-display mb-6 text-3xl font-black text-text md:text-4xl">
                  Everything you need to
                  <span className="italic text-accent"> make the switch</span>
                </h2>
                <div className="space-y-4">
                  {[
                    { icon: '🎯', title: 'Personalised career match', desc: 'AI-powered assessment across 18 dimensions' },
                    { icon: '🗺️', title: '12-month learning roadmap', desc: 'Week by week, phase by phase, built for you' },
                    { icon: '📬', title: 'Automatic access code', desc: 'Emailed to you instantly after assessment' },
                    { icon: '📊', title: 'Weekly progress tracker', desc: 'Log your work and get mentor feedback' },
                    { icon: '🤝', title: 'Direct mentor support', desc: '1-on-1 sessions with an experienced engineer' },
                    { icon: '📚', title: 'Free course recommendations', desc: 'Curated resources, mostly free, per your domain' },
                  ].map((item) => (
                    <div key={item.title} className="flex gap-4">
                      <span className="mt-0.5 flex-shrink-0 text-xl">{item.icon}</span>
                      <div>
                        <div className="text-sm font-semibold text-text">{item.title}</div>
                        <div className="text-sm text-muted">{item.desc}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* right — accent panel */}
              <div className="flex flex-col justify-center bg-accent p-10 md:p-14">
                <div className="mb-6">
                  <div className="font-display text-5xl font-black italic text-white/90">Free.</div>
                  <div className="font-display text-5xl font-black italic text-white/90">Always.</div>
                </div>
                <p className="mb-8 text-base leading-relaxed text-white/80">
                  This program is completely free for all mentees. No subscription. No hidden fees. Just a commitment to showing up every week.
                </p>
                <Link
                  to="/assess"
                  className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white px-8 py-4 text-base font-semibold text-accent shadow-warm-md transition hover:-translate-y-0.5 hover:shadow-warm-lg"
                >
                  Start the Assessment →
                </Link>
                <p className="mt-4 text-center text-xs text-white/60">Takes about 8 minutes</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ── */}
      <section className="px-6 py-24">
        <div className="mx-auto max-w-3xl text-center">
          <span className="mb-4 inline-block text-xs font-bold uppercase tracking-widest text-accent">
            Ready to start?
          </span>
          <h2 className="font-display mb-6 text-4xl font-black text-text md:text-5xl">
            Your tech career is
            <br />
            <span className="italic text-accent">one assessment away</span>
          </h2>
          <p className="mx-auto mb-10 max-w-md text-lg leading-relaxed text-muted">
            Find out which tech career fits your natural strengths. Get your personalised roadmap. Start building today.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              to="/assess"
              className="inline-flex items-center gap-2 rounded-2xl bg-accent px-10 py-4 text-base font-semibold text-white shadow-warm-md transition hover:-translate-y-1 hover:shadow-warm-lg"
            >
              Take the Free Assessment
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </Link>
            <Link
              to="/login"
              className="inline-flex items-center gap-2 rounded-2xl border border-border bg-white px-8 py-4 text-base font-semibold text-text2 shadow-warm-sm transition hover:shadow-warm-md"
            >
              Mentee Login
            </Link>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="border-t border-border bg-cream px-6 py-10">
        <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-4 md:flex-row">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-accent">
              <span className="font-display text-xs font-bold italic text-white">T</span>
            </div>
            <span className="font-display text-sm font-semibold text-text">Tech Mentorship</span>
          </div>
          <p className="text-xs text-muted">
            © 2026 Tech Mentorship Program. Empowering the next generation of tech professionals.
          </p>
          <div className="flex gap-4">
            <Link to="/assess" className="text-xs text-muted transition hover:text-text">Assessment</Link>
            <Link to="/login" className="text-xs text-muted transition hover:text-text">Login</Link>
            <Link to="/mentor/login" className="text-xs text-muted transition hover:text-text">Mentor</Link>
          </div>
        </div>
      </footer>

    </div>
  )
}