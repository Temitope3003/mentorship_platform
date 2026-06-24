import { useState } from 'react'
import { Link } from 'react-router-dom'
import { DOMAINS } from '../utils/questionData'
import { DOMAIN_DETAILS } from './DomainPage'

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900;1,700;1,900&family=Inter:wght@400;500;600;700&display=swap');

  .bit-cd-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 16px;
  }
  .bit-cd-card {
    background: #ffffff;
    border: 1px solid #E8E4D9;
    border-radius: 14px;
    padding: 22px;
    text-decoration: none;
    display: block;
    transition: transform 0.15s, box-shadow 0.15s;
  }
  .bit-cd-card:hover {
    transform: translateY(-3px);
    box-shadow: 0 10px 28px rgba(15,31,61,0.10);
  }
  .bit-cd-search {
    width: 100%;
    background: rgba(255,255,255,0.08);
    border: 1px solid rgba(255,255,255,0.18);
    border-radius: 10px;
    padding: 13px 18px 13px 42px;
    font-size: 14px;
    color: #ffffff;
    font-family: 'Inter', sans-serif;
    outline: none;
    box-sizing: border-box;
    transition: border-color 0.15s;
  }
  .bit-cd-search::placeholder { color: rgba(255,255,255,0.4); }
  .bit-cd-search:focus { border-color: #C9A84C; }

  @media (max-width: 1024px) and (min-width: 769px) {
    .bit-cd-grid { grid-template-columns: repeat(3, 1fr) !important; }
  }
  @media (max-width: 768px) {
    .bit-cd-grid { grid-template-columns: 1fr 1fr !important; gap: 12px !important; }
  }
  @media (max-width: 480px) {
    .bit-cd-grid { grid-template-columns: 1fr !important; }
  }
`

export function CareerDomainsPage() {
  const [query, setQuery] = useState('')

  const filtered = DOMAINS.filter((d) =>
    d.name.toLowerCase().includes(query.trim().toLowerCase())
  )

  return (
    <div style={{ fontFamily: "'Inter', sans-serif", background: '#F9F7F1', color: '#0F1F3D', minHeight: '100vh' }}>
      <style>{CSS}</style>

      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <section style={{ background: '#0F1F3D', padding: '64px 28px 56px', position: 'relative', overflow: 'hidden' }}>
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
          background: 'radial-gradient(ellipse at 70% 20%, rgba(201,168,76,0.12) 0%, transparent 60%)',
          pointerEvents: 'none',
        }} />
        <div style={{ position: 'relative', maxWidth: '760px', margin: '0 auto', textAlign: 'center' }}>
          <span style={{
            display: 'inline-flex', alignItems: 'center', gap: 7,
            background: 'rgba(201,168,76,0.10)', border: '1px solid rgba(201,168,76,0.25)',
            borderRadius: 999, padding: '6px 16px', fontSize: 11, fontWeight: 600,
            letterSpacing: '0.07em', textTransform: 'uppercase', color: '#F5D87A', marginBottom: 22,
          }}>
            15 career paths
          </span>
          <h1 style={{
            fontFamily: "'Playfair Display', serif", fontWeight: 900, color: '#ffffff',
            fontSize: 44, lineHeight: 1.15, marginBottom: 16,
          }}>
            Explore All <em style={{ color: '#C9A84C' }}>Career Domains</em>
          </h1>
          <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.62)', lineHeight: 1.8, marginBottom: 32, maxWidth: 560, marginLeft: 'auto', marginRight: 'auto' }}>
            Every domain below leads to a real tech career with mentorship, a 12-month roadmap, and real salary potential.
            Browse all 15 and find where you naturally fit, or take the free assessment to get matched instantly.
          </p>

          <div style={{ position: 'relative', maxWidth: 440, margin: '0 auto' }}>
            <i className="ti ti-search" style={{
              position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)',
              fontSize: 16, color: 'rgba(255,255,255,0.4)', pointerEvents: 'none',
            }} />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search domains, e.g. Frontend, Cloud, Cybersecurity..."
              className="bit-cd-search"
            />
          </div>
        </div>
      </section>

      {/* ── GRID ─────────────────────────────────────────────────────────── */}
      <section style={{ padding: '56px 28px 64px' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          {filtered.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '48px 0' }}>
              <i className="ti ti-mood-sad" style={{ fontSize: 32, color: '#C8C0B4', display: 'block', marginBottom: 12 }} />
              <p style={{ fontSize: 14, color: '#8A8070' }}>No domains match "{query}". Try a different search.</p>
            </div>
          ) : (
            <div className="bit-cd-grid">
              {filtered.map((d) => {
                const details = DOMAIN_DETAILS[d.name]
                return (
                  <Link key={d.name} to={`/domain/${encodeURIComponent(d.name)}`} className="bit-cd-card">
                    <div style={{
                      width: 44, height: 44, borderRadius: 11, background: d.color + '18',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 14,
                      fontSize: 21,
                    }}>
                      {d.icon}
                    </div>
                    <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 17, fontWeight: 700, color: '#0F1F3D', marginBottom: 6, lineHeight: 1.3 }}>
                      {d.name}
                    </h3>
                    {details && (
                      <p style={{ fontSize: 12.5, color: '#6B6B6B', lineHeight: 1.6, marginBottom: 14, minHeight: 38 }}>
                        {details.tagline}
                      </p>
                    )}
                    {details && (
                      <span style={{
                        display: 'inline-flex', alignItems: 'center', gap: 5,
                        background: d.color + '12', border: `1px solid ${d.color}30`,
                        borderRadius: 999, padding: '5px 11px', fontSize: 11, fontWeight: 700,
                        color: d.color,
                      }}>
                        <i className="ti ti-coin" style={{ fontSize: 11 }} />
                        {details.salaryNigeria.split('(')[0].trim()}
                      </span>
                    )}
                  </Link>
                )
              })}
            </div>
          )}
        </div>
      </section>

      {/* ── FINAL CTA ────────────────────────────────────────────────────── */}
      <section style={{ background: '#0F1F3D', padding: '64px 28px', textAlign: 'center' }}>
        <div style={{ maxWidth: '560px', margin: '0 auto' }}>
          <h2 style={{
            fontFamily: "'Playfair Display', serif", fontSize: 32, fontWeight: 900, color: '#ffffff',
            marginBottom: 14, lineHeight: 1.2,
          }}>
            Not sure which domain <em style={{ color: '#C9A84C' }}>fits you?</em>
          </h2>
          <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.55)', lineHeight: 1.8, marginBottom: 28 }}>
            Take the free 8-minute assessment and get matched to the domain that fits your natural strengths.
          </p>
          <Link
            to="/assess"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              background: '#C9A84C', color: '#0F1F3D', borderRadius: 9,
              padding: '14px 28px', fontSize: 14, fontWeight: 700, textDecoration: 'none',
              transition: 'opacity 0.15s, transform 0.15s',
            }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.opacity = '0.88'; (e.currentTarget as HTMLElement).style.transform = 'translateY(-1px)' }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.opacity = '1'; (e.currentTarget as HTMLElement).style.transform = 'none' }}
          >
            Take the Free Assessment <i className="ti ti-arrow-right" />
          </Link>
        </div>
      </section>
    </div>
  )
}
