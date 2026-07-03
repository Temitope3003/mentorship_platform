import { Link } from 'react-router-dom'
import { DOMAINS } from '../utils/questionData'
import { PageMeta } from '../components/PageMeta'

// ─── Types ───────────────────────────────────────────────────────────────────

interface Testimonial {
  name: string
  role: string
  avatar: string
  avatarBg: string
  avatarColor: string
  text: string
}

interface Step {
  num: string
  iconClass: string
  title: string
  desc: string
}

interface Feature {
  iconClass: string
  title: string
  desc: string
}

interface Stat {
  num: string
  label: string
}

// ─── Data ────────────────────────────────────────────────────────────────────

const STATS: Stat[] = [
  { num: '35+', label: 'Active Mentees' },
  { num: '15',  label: 'Career Domains' },
  { num: '48',  label: 'Weeks of Curriculum' },
  { num: '28',  label: 'Career Paths' },
]

const STEPS: Step[] = [
  {
    num: 'Step 01',
    iconClass: 'ti ti-pencil',
    title: 'Tell us your goal',
    desc: 'Write what you want to build or become in tech. Your own words, no filters. We read it carefully.',
  },
  {
    num: 'Step 02',
    iconClass: 'ti ti-brain',
    title: 'Complete the assessment',
    desc: '25 questions about how you think and work. Takes about 8 minutes.',
  },
  {
    num: 'Step 03',
    iconClass: 'ti ti-map',
    title: 'Get your roadmap',
    desc: 'AI builds your personalised 12-month learning plan matched to your natural strengths.',
  },
  {
    num: 'Step 04',
    iconClass: 'ti ti-chart-bar',
    title: 'Track your progress',
    desc: 'Log in weekly, submit work, and get direct feedback from your mentor every step of the way.',
  },
]

const FEATURES: Feature[] = [
  { iconClass: 'ti ti-bolt',      title: 'Personalised career match',   desc: 'AI assessment across 18 dimensions' },
  { iconClass: 'ti ti-map',       title: '12-month learning roadmap',   desc: 'Week by week, built for you' },
  { iconClass: 'ti ti-mail',      title: 'Automatic access code',       desc: 'Emailed instantly after assessment' },
  { iconClass: 'ti ti-chart-bar', title: 'Weekly progress tracker',     desc: 'Log work, get mentor feedback' },
  { iconClass: 'ti ti-users',     title: 'Direct mentor support',       desc: '1-on-1 with an experienced engineer' },
  { iconClass: 'ti ti-book',      title: 'Free course recommendations', desc: 'Curated resources per your domain' },
]

const TESTIMONIALS: Testimonial[] = [
  {
    name: 'Amara Johnson',
    role: 'Now a Junior ML Engineer',
    avatar: 'AJ',
    avatarBg: '#C9A84C',
    avatarColor: '#0F1F3D',
    text: 'I had no idea where to start in tech. The assessment told me I was naturally suited for AI. 12 months later I landed my first job.',
  },
  {
    name: 'Kofi Mensah',
    role: 'Now a Backend Developer',
    avatar: 'KM',
    avatarBg: '#1D4A6E',
    avatarColor: '#ffffff',
    text: 'The weekly tracker kept me accountable. Having a mentor review my submissions every week made all the difference.',
  },
  {
    name: 'Fatima Al-Rashid',
    role: 'Now a Data Analyst',
    avatar: 'FA',
    avatarBg: '#2D5016',
    avatarColor: '#ffffff',
    text: 'Complete beginner. The roadmap was so detailed I always knew exactly what to do next. No confusion at all.',
  },
]

const TRUST_AVATARS = [
  { initials: 'AJ', bg: '#C9A84C', color: '#0F1F3D' },
  { initials: 'KM', bg: '#1D4A6E', color: '#ffffff' },
  { initials: 'FA', bg: '#2D5016', color: '#ffffff' },
  { initials: 'CO', bg: '#5C3D1A', color: '#ffffff' },
  { initials: 'NP', bg: '#4A1C6E', color: '#ffffff' },
]

// ─── Sub-components ──────────────────────────────────────────────────────────

function GoldPill({ children, dark = false }: { children: React.ReactNode; dark?: boolean }) {
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '7px',
        background: dark ? 'rgba(201,168,76,0.10)' : '#FBF7EC',
        border: `1px solid ${dark ? 'rgba(201,168,76,0.25)' : '#DFC97A'}`,
        borderRadius: '999px',
        padding: '6px 16px',
        fontSize: '11px',
        fontWeight: 600,
        letterSpacing: '0.07em',
        textTransform: 'uppercase',
        color: dark ? '#F5D87A' : '#7A5C1E',
        fontFamily: "'Inter', sans-serif",
      }}
    >
      {children}
    </span>
  )
}

function SectionDivider() {
  return (
    <div
      style={{
        width: '48px',
        height: '3px',
        background: '#C9A84C',
        borderRadius: '2px',
        margin: '0 auto 20px',
      }}
    />
  )
}

function StarRow() {
  return (
    <div style={{ display: 'flex', gap: '3px', marginBottom: '14px' }}>
      {[0, 1, 2, 3, 4].map((i) => (
        <i key={i} className="ti ti-star-filled" style={{ fontSize: '14px', color: '#C9A84C' }} />
      ))}
    </div>
  )
}

// ─── Main component ───────────────────────────────────────────────────────────

export function LandingPage() {
  return (
    <div style={{ fontFamily: "'Inter', sans-serif", background: '#ffffff', color: '#0F1F3D', overflowX: 'hidden' }}>
      <PageMeta
        title="Build In Tech — Free AI-Powered Tech Career Mentorship"
        description="Discover your ideal tech career path, get a personalised 48-week roadmap, and connect with expert mentors — completely free."
        path="/"
      />

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900;1,700;1,900&family=Inter:wght@400;500;600;700&display=swap');

        /* ── Nav links ─────────────────────────────────────────────── */
        .bit-nav-link {
          font-size: 13px; color: rgba(255,255,255,0.6);
          padding: 8px 14px; cursor: pointer;
          text-decoration: none; transition: color 0.15s;
        }
        .bit-nav-link:hover { color: #ffffff; }

        /* ── Buttons ───────────────────────────────────────────────── */
        .bit-btn-primary {
          display: inline-flex; align-items: center; gap: 8px;
          background: #C9A84C; color: #0F1F3D; border: none; border-radius: 9px;
          padding: 14px 28px; font-size: 14px; font-weight: 700; cursor: pointer;
          font-family: 'Inter', sans-serif; text-decoration: none;
          transition: opacity 0.15s, transform 0.15s;
        }
        .bit-btn-primary:hover { opacity: 0.9; transform: translateY(-1px); }

        .bit-btn-navy {
          display: inline-flex; align-items: center; gap: 8px;
          background: #0F1F3D; color: #F5D87A; border: none; border-radius: 9px;
          padding: 14px 28px; font-size: 14px; font-weight: 700; cursor: pointer;
          font-family: 'Inter', sans-serif; text-decoration: none;
          transition: opacity 0.15s, transform 0.15s;
        }
        .bit-btn-navy:hover { opacity: 0.9; transform: translateY(-1px); }

        .bit-btn-ghost-dark {
          display: inline-flex; align-items: center; gap: 8px;
          background: transparent; color: rgba(255,255,255,0.65);
          border: 1.5px solid rgba(255,255,255,0.22); border-radius: 9px;
          padding: 14px 24px; font-size: 14px; font-weight: 500; cursor: pointer;
          font-family: 'Inter', sans-serif; text-decoration: none;
          transition: border-color 0.15s, color 0.15s;
        }
        .bit-btn-ghost-dark:hover { border-color: rgba(255,255,255,0.45); color: #ffffff; }

        .bit-btn-ghost-light {
          display: inline-flex; align-items: center; gap: 8px;
          background: transparent; color: rgba(255,255,255,0.65);
          border: 1.5px solid rgba(255,255,255,0.2); border-radius: 9px;
          padding: 14px 22px; font-size: 14px; font-weight: 500; cursor: pointer;
          font-family: 'Inter', sans-serif; text-decoration: none;
          transition: border-color 0.15s, color 0.15s;
        }
        .bit-btn-ghost-light:hover { border-color: rgba(255,255,255,0.45); color: #ffffff; }

        /* ── Cards ─────────────────────────────────────────────────── */
        .bit-domain-card {
          background: #ffffff; border: 1px solid #E8E4D9; border-radius: 12px;
          padding: 16px; cursor: pointer; transition: transform 0.15s, box-shadow 0.15s;
          text-decoration: none; display: block;
        }
        .bit-domain-card:hover { transform: translateY(-2px); box-shadow: 0 6px 20px rgba(15,31,61,0.08); }
        .bit-domain-card:hover .bit-domain-bar { width: 36px; }

        .bit-domain-bar { height: 2px; width: 20px; border-radius: 2px; background: #C9A84C; margin-top: 8px; transition: width 0.2s; }
        .bit-step-card { background: #ffffff; border: 1px solid #E8E4D9; border-radius: 12px; padding: 26px; }
        .bit-testimonial-card { background: #ffffff; border: 1px solid #E8E4D9; border-radius: 12px; padding: 24px; display: flex; flex-direction: column; }

        /* ── Desktop grid defaults ─────────────────────────────────── */
        .bit-hero-layout   { display: grid; grid-template-columns: 1.1fr 0.9fr; gap: 64px; align-items: center; }
        .bit-stats-grid    { display: grid; grid-template-columns: repeat(4, 1fr); }
        .bit-steps-grid    { display: grid; grid-template-columns: repeat(4, 1fr); gap: 14px; text-align: left; }
        .bit-domains-grid  { display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; text-align: left; }
        .bit-testimonials-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; text-align: left; }
        .bit-features-split { display: grid; grid-template-columns: 1fr 1fr; overflow: hidden; }
        .bit-hero-stats-bento { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }

        /* ── Desktop typography ────────────────────────────────────── */
        .bit-hero-h1    { font-size: 68px; }
        .bit-section-h2 { font-size: 44px; }

        /* ── Desktop hero text alignment ───────────────────────────── */
        .bit-hero-text  { text-align: left; }
        .bit-hero-cta   { justify-content: flex-start; }
        .bit-hero-trust { justify-content: flex-start; }

        /* ── Hide stats band on desktop (shown in hero bento) ──────── */
        @media (min-width: 769px) { .bit-stats-band { display: none !important; } }

        /* ── Tablet (769px – 1024px) ───────────────────────────────── */
        @media (max-width: 1024px) and (min-width: 769px) {
          .bit-domains-grid      { grid-template-columns: repeat(3, 1fr) !important; }
          .bit-testimonials-grid { grid-template-columns: repeat(2, 1fr) !important; }
          .bit-steps-grid        { grid-template-columns: repeat(2, 1fr) !important; }
          .bit-hero-h1           { font-size: 52px !important; }
          .bit-hero-layout       { gap: 40px !important; }
        }

        /* ── Mobile (≤768px) ───────────────────────────────────────── */
        @media (max-width: 768px) {
          .bit-hero-h1           { font-size: 36px !important; }
          .bit-section-h2        { font-size: 32px !important; }
          .bit-hero-layout       { grid-template-columns: 1fr !important; gap: 0 !important; }
          .bit-hero-stats-bento  { display: none !important; }
          .bit-stats-grid        { grid-template-columns: 1fr 1fr !important; }
          .bit-steps-grid        { grid-template-columns: 1fr !important; }
          .bit-domains-grid      { grid-template-columns: 1fr 1fr !important; }
          .bit-testimonials-grid { grid-template-columns: 1fr !important; }
          .bit-features-split    { grid-template-columns: 1fr !important; }
          .bit-nav-links         { display: none !important; }
          .bit-cta-row           { flex-direction: column !important; align-items: stretch !important; }
          .bit-hero-text         { text-align: center !important; }
          .bit-hero-cta          { justify-content: center !important; }
          .bit-hero-trust        { justify-content: center !important; }
          .bit-stats-band        { display: block !important; }
        }
      `}</style>

      {/* ── NAV ─────────────────────────────────────────────────────────── */}
      <nav style={{
        background: '#0F1F3D',
        padding: '0 28px',
        height: '60px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'sticky',
        top: 0,
        zIndex: 50,
      }}>
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
          <div style={{
            width: '34px', height: '34px', background: '#C9A84C', borderRadius: '8px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <span style={{ fontFamily: "'Playfair Display', serif", fontSize: '16px', color: '#0F1F3D', fontStyle: 'italic', fontWeight: 900 }}>B</span>
          </div>
          <span style={{ fontFamily: "'Playfair Display', serif", fontSize: '16px', fontWeight: 700, color: '#ffffff' }}>
            Build<span style={{ color: '#C9A84C' }}>InTech</span>
          </span>
        </Link>

        <div className="bit-nav-links" style={{ display: 'flex', alignItems: 'center' }}>
          <Link to="/assess" className="bit-nav-link">Assessment</Link>
          <Link to="/domains" className="bit-nav-link">Domains</Link>
          <Link to="/login" className="bit-nav-link">Login</Link>
          <Link
            to="/assess"
            className="bit-btn-primary"
            style={{ padding: '9px 20px', fontSize: '13px', marginLeft: '12px' }}
          >
            Start Free <i className="ti ti-arrow-right" style={{ fontSize: '13px' }} />
          </Link>
        </div>
      </nav>

      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <section style={{
        background: '#0F1F3D',
        padding: '72px 28px 80px',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* ambient glow */}
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
          background: 'radial-gradient(ellipse at 70% 20%, rgba(201,168,76,0.12) 0%, transparent 60%)',
          pointerEvents: 'none',
        }} />

        <div style={{ position: 'relative', maxWidth: '1100px', margin: '0 auto' }}>
          <div className="bit-hero-layout">

            {/* ── Left column ──────────────────────────────────────────── */}
            <div className="bit-hero-text">
              <div style={{ marginBottom: '24px' }}>
                <GoldPill dark>
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#C9A84C', display: 'inline-block' }} />
                  Free · AI-Powered Mentorship
                </GoldPill>
              </div>

              <h1
                className="bit-hero-h1"
                style={{
                  fontFamily: "'Playfair Display', serif",
                  fontWeight: 900,
                  color: '#ffffff',
                  lineHeight: 1.1,
                  marginBottom: '20px',
                  letterSpacing: '-0.01em',
                }}
              >
                Expand Your Career<br />
                <em style={{ color: '#C9A84C' }}>Opportunities in Tech</em>
              </h1>

              <p style={{
                fontSize: '16px', color: 'rgba(255,255,255,0.65)', lineHeight: 1.8,
                maxWidth: '480px', marginBottom: '32px',
              }}>
                A free AI platform that matches you to the right tech career, builds your personalised
                12-month roadmap, and tracks your progress with real mentor support.
              </p>

              <div className="bit-hero-cta" style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '36px' }}>
                <Link to="/assess" className="bit-btn-primary">
                  Start Free Assessment <i className="ti ti-arrow-right" />
                </Link>
                <Link to="/login" className="bit-btn-ghost-dark">
                  I have an access code
                </Link>
              </div>

              {/* trust strip */}
              <div className="bit-hero-trust" style={{ display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap' }}>
                <div style={{ display: 'flex' }}>
                  {TRUST_AVATARS.map((a, i) => (
                    <div
                      key={a.initials}
                      style={{
                        width: '34px', height: '34px', borderRadius: '50%',
                        background: a.bg, border: '2px solid #0F1F3D',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '11px', fontWeight: 700, color: a.color,
                        marginLeft: i === 0 ? '0' : '-9px',
                        fontFamily: "'Inter', sans-serif",
                      }}
                    >
                      {a.initials}
                    </div>
                  ))}
                </div>
                <span style={{ fontSize: '13px', color: 'rgba(255,255,255,0.5)' }}>
                  <strong style={{ color: 'rgba(255,255,255,0.8)', fontWeight: 600 }}>35+ mentees</strong> already building their careers
                </span>
              </div>
            </div>

            {/* ── Right column: stats bento ─────────────────────────── */}
            <div className="bit-hero-stats-bento">
              {STATS.map((s) => (
                <div
                  key={s.label}
                  style={{
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.10)',
                    borderRadius: '16px',
                    padding: '32px 24px',
                  }}
                >
                  <div style={{
                    fontFamily: "'Playfair Display', serif",
                    fontSize: '52px', fontWeight: 900, color: '#F5D87A', lineHeight: 1,
                  }}>
                    {s.num}
                  </div>
                  <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.5)', marginTop: '10px', fontWeight: 500, lineHeight: 1.4 }}>
                    {s.label}
                  </div>
                </div>
              ))}
            </div>

          </div>
        </div>
      </section>

      {/* ── STATS BAND (mobile only — hidden on desktop) ─────────────────── */}
      <section className="bit-stats-band" style={{ background: '#F9F7F1', borderBottom: '1px solid #E8E4D9', padding: '28px' }}>
        <div
          className="bit-stats-grid"
          style={{ maxWidth: '1100px', margin: '0 auto' }}
        >
          {STATS.map((s, i) => (
            <div
              key={s.label}
              style={{
                textAlign: 'center',
                padding: '12px 8px',
                borderRight: i < STATS.length - 1 ? '1px solid #E8E4D9' : 'none',
              }}
            >
              <div style={{ fontFamily: "'Playfair Display', serif", fontSize: '36px', fontWeight: 900, color: '#0F1F3D', lineHeight: 1 }}>
                {s.num}
              </div>
              <div style={{ fontSize: '12px', color: '#8A8070', marginTop: '5px', fontWeight: 500 }}>
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── HOW IT WORKS ─────────────────────────────────────────────────── */}
      <section style={{ padding: '72px 28px', background: '#ffffff' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', textAlign: 'center' }}>
          <div style={{ marginBottom: '18px' }}>
            <GoldPill>How it works</GoldPill>
          </div>
          <SectionDivider />
          <h2
            className="bit-section-h2"
            style={{
              fontFamily: "'Playfair Display', serif",
              fontWeight: 900, color: '#0F1F3D',
              marginBottom: '12px', lineHeight: 1.15,
            }}
          >
            From zero to employed<br />
            <em style={{ color: '#C9A84C' }}>in four steps</em>
          </h2>
          <p style={{ fontSize: '14px', color: '#6B6B6B', lineHeight: 1.8, maxWidth: '440px', margin: '0 auto 48px' }}>
            No experience needed. No confusion about where to start. A clear, structured path to your first tech role.
          </p>

          <div className="bit-steps-grid">
            {STEPS.map((step) => (
              <div key={step.num} className="bit-step-card">
                <div style={{
                  width: '44px', height: '44px', borderRadius: '10px', background: '#0F1F3D',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px',
                }}>
                  <i className={step.iconClass} style={{ fontSize: '20px', color: '#C9A84C' }} />
                </div>
                <div style={{ fontSize: '11px', fontWeight: 700, color: '#C9A84C', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '8px' }}>
                  {step.num}
                </div>
                <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: '19px', fontWeight: 700, color: '#0F1F3D', marginBottom: '8px', lineHeight: 1.3 }}>
                  {step.title}
                </h3>
                <p style={{ fontSize: '13px', color: '#6B6B6B', lineHeight: 1.75 }}>
                  {step.desc}
                </p>
              </div>
            ))}
          </div>

          <div style={{ marginTop: '36px' }}>
            <Link to="/assess" className="bit-btn-navy">
              Start Now — It's Free <i className="ti ti-arrow-right" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── 15 DOMAINS ───────────────────────────────────────────────────── */}
      <section id="domains" style={{ padding: '72px 28px', background: '#F9F7F1', borderTop: '1px solid #E8E4D9' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', textAlign: 'center' }}>
          <div style={{ marginBottom: '18px' }}>
            <GoldPill>Career domains</GoldPill>
          </div>
          <SectionDivider />
          <h2
            className="bit-section-h2"
            style={{
              fontFamily: "'Playfair Display', serif",
              fontWeight: 900, color: '#0F1F3D',
              marginBottom: '10px', lineHeight: 1.15,
            }}
          >
            15 paths. One right fit{' '}
            <em style={{ color: '#C9A84C' }}>for you.</em>
          </h2>
          <p style={{ fontSize: '14px', color: '#6B6B6B', lineHeight: 1.8, maxWidth: '420px', margin: '0 auto 40px' }}>
            The assessment matches you to the domain that fits your strengths, not just what is popular.
          </p>

          <div className="bit-domains-grid">
            {DOMAINS.map((d) => (
              <Link
                key={d.name}
                to={`/domain/${encodeURIComponent(d.name)}`}
                className="bit-domain-card"
              >
                <div style={{
                  width: '38px', height: '38px', borderRadius: '9px',
                  background: d.color + '18',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '10px',
                }}>
                  <span style={{ fontSize: '18px' }}>{d.icon}</span>
                </div>
                <div style={{ fontSize: '12px', fontWeight: 600, color: '#0F1F3D', lineHeight: 1.4 }}>
                  {d.name}
                </div>
                <div className="bit-domain-bar" style={{ background: d.color }} />
              </Link>
            ))}
          </div>

          <Link
            to="/domains"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '7px',
              marginTop: '32px', fontSize: '14px', fontWeight: 700, color: '#0F1F3D',
              textDecoration: 'none', borderBottom: '2px solid #C9A84C', paddingBottom: '3px',
              transition: 'opacity 0.15s',
            }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.opacity = '0.7' }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.opacity = '1' }}
          >
            View All Domains <i className="ti ti-arrow-right" style={{ fontSize: '13px' }} />
          </Link>
        </div>
      </section>

      {/* ── TESTIMONIALS ─────────────────────────────────────────────────── */}
      <section style={{ padding: '72px 28px', background: '#ffffff' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', textAlign: 'center' }}>
          <div style={{ marginBottom: '18px' }}>
            <GoldPill>Success stories</GoldPill>
          </div>
          <SectionDivider />
          <h2
            className="bit-section-h2"
            style={{
              fontFamily: "'Playfair Display', serif",
              fontWeight: 900, color: '#0F1F3D',
              marginBottom: '40px', lineHeight: 1.15,
            }}
          >
            Real results from <em style={{ color: '#C9A84C' }}>real people</em>
          </h2>

          <div className="bit-testimonials-grid">
            {TESTIMONIALS.map((t) => (
              <div key={t.name} className="bit-testimonial-card">
                <StarRow />
                <p style={{ fontSize: '13px', color: '#444444', lineHeight: 1.75, flex: 1, marginBottom: '18px' }}>
                  "{t.text}"
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', borderTop: '1px solid #F0ECE0', paddingTop: '14px' }}>
                  <div style={{
                    width: '38px', height: '38px', borderRadius: '50%',
                    background: t.avatarBg, color: t.avatarColor,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '12px', fontWeight: 700, flexShrink: 0,
                    fontFamily: "'Inter', sans-serif",
                  }}>
                    {t.avatar}
                  </div>
                  <div>
                    <div style={{ fontSize: '13px', fontWeight: 600, color: '#0F1F3D' }}>{t.name}</div>
                    <div style={{ fontSize: '11px', color: '#A0AEC0', marginTop: '2px' }}>{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── WHAT YOU GET ─────────────────────────────────────────────────── */}
      <section style={{ padding: '72px 28px', background: '#F9F7F1', borderTop: '1px solid #E8E4D9' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <div
            className="bit-features-split"
            style={{
              background: '#ffffff',
              border: '1px solid #E8E4D9',
              borderRadius: '12px',
            }}
          >
            {/* Left: feature list */}
            <div style={{ padding: '48px' }}>
              <div style={{ marginBottom: '16px' }}>
                <GoldPill>What you get</GoldPill>
              </div>
              <h2 style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: '30px', fontWeight: 900,
                color: '#0F1F3D', lineHeight: 1.2, marginBottom: '28px',
              }}>
                Everything you need to{' '}
                <em style={{ color: '#C9A84C' }}>make the switch</em>
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                {FEATURES.map((f) => (
                  <div key={f.title} style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                    <div style={{
                      width: '32px', height: '32px', background: '#F5F0E0',
                      borderRadius: '8px', display: 'flex', alignItems: 'center',
                      justifyContent: 'center', flexShrink: 0, marginTop: '1px',
                    }}>
                      <i className={f.iconClass} style={{ fontSize: '15px', color: '#7A5C1E' }} />
                    </div>
                    <div>
                      <div style={{ fontSize: '13px', fontWeight: 600, color: '#0F1F3D' }}>{f.title}</div>
                      <div style={{ fontSize: '12px', color: '#8A8070', marginTop: '2px' }}>{f.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: free panel */}
            <div style={{
              background: '#0F1F3D', padding: '48px',
              display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
            }}>
              <div>
                <div style={{ fontFamily: "'Playfair Display', serif", fontSize: '64px', color: '#F5D87A', lineHeight: 1.05, fontStyle: 'italic' }}>Free.</div>
                <div style={{ fontFamily: "'Playfair Display', serif", fontSize: '64px', color: '#F5D87A', lineHeight: 1.05, fontStyle: 'italic' }}>Always.</div>
                <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.55)', lineHeight: 1.75, marginTop: '18px' }}>
                  No subscription. No hidden fees. Just a commitment to showing up every week.
                </p>
              </div>
              <div style={{ marginTop: '36px' }}>
                <Link
                  to="/assess"
                  style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '7px',
                    background: '#C9A84C', color: '#0F1F3D', border: 'none', borderRadius: '9px',
                    padding: '14px', width: '100%', fontSize: '13px', fontWeight: 700,
                    cursor: 'pointer', fontFamily: "'Inter', sans-serif", textDecoration: 'none',
                    boxSizing: 'border-box',
                  }}
                >
                  Start the Assessment <i className="ti ti-arrow-right" style={{ fontSize: '13px' }} />
                </Link>
                <p style={{ textAlign: 'center', fontSize: '11px', color: 'rgba(255,255,255,0.3)', marginTop: '10px' }}>
                  Takes about 8 minutes
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ────────────────────────────────────────────────────── */}
      <section style={{ background: '#0F1F3D', padding: '72px 28px', textAlign: 'center' }}>
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
          <div style={{ marginBottom: '20px' }}>
            <GoldPill dark>Ready to start?</GoldPill>
          </div>
          <h2 style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: '44px', fontWeight: 900, color: '#ffffff',
            marginBottom: '16px', lineHeight: 1.1,
          }}>
            Your tech career is<br />
            <em style={{ color: '#C9A84C' }}>one assessment away</em>
          </h2>
          <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.5)', lineHeight: 1.8, maxWidth: '420px', margin: '0 auto 30px' }}>
            Find out which tech career fits your strengths. Get your personalised roadmap. Start building today.
          </p>
          <div className="bit-cta-row" style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/assess" className="bit-btn-primary">
              Take the Free Assessment <i className="ti ti-arrow-right" />
            </Link>
            <Link to="/login" className="bit-btn-ghost-light">
              Mentee Login
            </Link>
          </div>
        </div>
      </section>

      {/* ── FOOTER ───────────────────────────────────────────────────────── */}
      <footer style={{ background: '#0A1628', padding: '28px 28px', borderTop: '1px solid rgba(255,255,255,0.07)' }}>
        <div style={{
          maxWidth: '1100px', margin: '0 auto',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px',
        }}>
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '9px', textDecoration: 'none' }}>
            <div style={{
              width: '28px', height: '28px', background: '#C9A84C',
              borderRadius: '7px', display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <span style={{ fontFamily: "'Playfair Display', serif", fontSize: '13px', color: '#0F1F3D', fontStyle: 'italic', fontWeight: 900 }}>B</span>
            </div>
            <span style={{ fontFamily: "'Playfair Display', serif", fontSize: '14px', fontWeight: 700, color: '#ffffff' }}>BuildInTech</span>
          </Link>
          <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.28)' }}>
            © 2026 BuildInTech · Empowering the next generation of tech professionals.
          </p>
          <div style={{ display: 'flex', gap: '18px' }}>
            <Link to="/assess"       style={{ fontSize: '12px', color: 'rgba(255,255,255,0.32)', textDecoration: 'none' }}>Assessment</Link>
            <Link to="/login"        style={{ fontSize: '12px', color: 'rgba(255,255,255,0.32)', textDecoration: 'none' }}>Login</Link>
            <Link to="/mentor/login" style={{ fontSize: '12px', color: 'rgba(255,255,255,0.32)', textDecoration: 'none' }}>Mentor</Link>
          </div>
        </div>
      </footer>

    </div>
  )
}
