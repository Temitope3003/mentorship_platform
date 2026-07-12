import { useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../utils/api'
import toast from 'react-hot-toast'
import { PageMeta } from '../components/PageMeta'

const WHATSAPP_LINK = import.meta.env.VITE_WHATSAPP_LINK as string | undefined

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900;1,700;1,900&family=Inter:wght@400;500;600;700&display=swap');

  @keyframes bit-spin { to { transform: rotate(360deg); } }
  .cpage-spin { animation: bit-spin 0.75s linear infinite; }

  .cpage-input {
    width: 100%; border: 1.5px solid #E8E4D9; border-radius: 10px;
    padding: 12px 16px; font-size: 14px; font-family: 'Inter', sans-serif;
    color: #0F1F3D; background: #F9F7F1; outline: none; box-sizing: border-box;
    transition: border-color 0.15s, box-shadow 0.15s, background 0.15s;
  }
  .cpage-input:focus { border-color: #C9A84C; background: #fff; box-shadow: 0 0 0 4px rgba(201,168,76,0.12); }
  .cpage-input::placeholder { color: #B0A898; }

  .cpage-faq-item summary {
    cursor: pointer; list-style: none; display: flex;
    align-items: center; justify-content: space-between;
    padding: 20px 24px; font-size: 15px; font-weight: 600; color: #0F1F3D;
    user-select: none;
  }
  .cpage-faq-item summary::-webkit-details-marker { display: none; }
  .cpage-faq-item[open] summary .cpage-faq-icon { transform: rotate(45deg); }
  .cpage-faq-icon { transition: transform 0.2s; flex-shrink: 0; }

  .cpage-contact-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; }
  @media (max-width: 768px) {
    .cpage-contact-grid { grid-template-columns: 1fr !important; }
  }
`

const CONTACT_CARDS = [
  {
    icon: 'ti ti-mail',
    label: 'General Enquiries',
    email: 'hello@buildintech.xyz',
    desc: 'Questions about the program, how it works, pricing, or anything else. We reply within 24 hours.',
  },
  {
    icon: 'ti ti-user-check',
    label: 'Become a Mentor',
    email: 'mentors@buildintech.xyz',
    desc: 'Interested in joining our mentor team? Send us your background and why you want to give back.',
  },
  {
    icon: 'ti ti-shield',
    label: 'Liaison Enquiries',
    email: 'liaisons@buildintech.xyz',
    desc: 'For liaison officer roles, institutional partnerships, and community collaboration.',
  },
]

const FAQS = [
  {
    q: 'Is the program really free?',
    a: 'Yes. The full curriculum, weekly assignments, and mentor feedback are completely free. A premium tier is available for 1-on-1 calls, priority feedback, and a personal recommendation letter.',
  },
  {
    q: 'How long does the program take?',
    a: '48 weeks, structured across 4 phases. You set your own start date and can pause up to twice if life gets in the way.',
  },
  {
    q: 'Do I need any prior experience?',
    a: 'No. The program is designed specifically for complete beginners with no tech background. The assessment matches you to the right path based on how you naturally think and work.',
  },
  {
    q: 'How do I get started?',
    a: 'Take the free 25-question assessment at buildintech.xyz/assess. It matches you to the right career track based on your natural strengths and takes about 8 minutes.',
  },
  {
    q: 'What happens after I complete the assessment?',
    a: 'You receive your career match, a personalised 48-week roadmap preview, and an access code by email to log into your dashboard and start Week 1.',
  },
]

const SUBJECTS = [
  'General enquiry',
  'Mentor application question',
  'Technical issue',
  'Partnership',
  'Other',
]

export function ContactPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [subject, setSubject] = useState(SUBJECTS[0])
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim() || !email.trim() || !message.trim()) {
      toast.error('Please fill in all required fields')
      return
    }
    if (!email.includes('@')) {
      toast.error('Please enter a valid email address')
      return
    }
    setLoading(true)
    try {
      await api.post('/public/contact', { name: name.trim(), email: email.trim(), subject, message: message.trim() })
      setSent(true)
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Failed to send. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ fontFamily: "'Inter', sans-serif", color: '#0F1F3D', background: '#F9F7F1', minHeight: '100vh' }}>
      <PageMeta
        title="Contact Us — Build In Tech"
        description="Get in touch with the Build In Tech team. General enquiries, mentor applications, and liaison officer questions."
        path="/contact"
      />
      <style>{CSS}</style>

      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <section style={{ background: '#0F1F3D', padding: '72px 28px 64px', textAlign: 'center' }}>
        <div style={{ maxWidth: 640, margin: '0 auto' }}>
          <div style={{ marginBottom: 16 }}>
            <span style={{
              display: 'inline-flex', alignItems: 'center', gap: 7,
              background: 'rgba(201,168,76,0.12)', border: '1px solid rgba(201,168,76,0.25)',
              borderRadius: 999, padding: '6px 16px', fontSize: 11, fontWeight: 600,
              letterSpacing: '0.07em', textTransform: 'uppercase', color: '#F5D87A',
              fontFamily: "'Inter', sans-serif",
            }}>
              <i className="ti ti-mail" style={{ fontSize: 11 }} /> Get in Touch
            </span>
          </div>
          <h1 style={{
            fontFamily: "'Playfair Display', serif", fontSize: 52, fontWeight: 900,
            color: '#fff', marginBottom: 16, lineHeight: 1.1,
          }}>
            Contact <em style={{ color: '#C9A84C' }}>Us</em>
          </h1>
          <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.55)', lineHeight: 1.8, maxWidth: 480, margin: '0 auto' }}>
            Have a question before you start? Interested in becoming a mentor? We would love to hear from you.
          </p>
        </div>
      </section>

      {/* ── CONTACT CARDS ────────────────────────────────────────────────── */}
      <section style={{ padding: '64px 28px', background: '#fff', borderBottom: '1px solid #E8E4D9' }}>
        <div style={{ maxWidth: 1000, margin: '0 auto' }}>
          <div className="cpage-contact-grid">
            {CONTACT_CARDS.map(card => (
              <div key={card.email} style={{
                background: '#F9F7F1', border: '1px solid #E8E4D9', borderRadius: 16,
                padding: '32px 28px', display: 'flex', flexDirection: 'column', gap: 14,
              }}>
                <div style={{
                  width: 48, height: 48, background: '#FBF7EC', border: '1px solid #DFC97A',
                  borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <i className={card.icon} style={{ fontSize: 22, color: '#7A5C1E' }} />
                </div>
                <div>
                  <div style={{ fontSize: 15, fontWeight: 700, color: '#0F1F3D', marginBottom: 8 }}>{card.label}</div>
                  <div style={{ fontSize: 13, color: '#6B6B6B', lineHeight: 1.7, marginBottom: 14 }}>{card.desc}</div>
                  <a href={`mailto:${card.email}`} style={{
                    display: 'inline-flex', alignItems: 'center', gap: 6,
                    fontSize: 13, fontWeight: 700, color: '#C9A84C', textDecoration: 'none',
                  }}>
                    <i className="ti ti-mail" style={{ fontSize: 13 }} /> {card.email}
                  </a>
                </div>
              </div>
            ))}
          </div>

          {/* WhatsApp */}
          {WHATSAPP_LINK && (
            <div style={{ marginTop: 32, background: '#F9F7F1', border: '1px solid #E8E4D9', borderRadius: 14, padding: '24px 28px', display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
              <div style={{ width: 44, height: 44, background: '#25D366', borderRadius: 11, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <i className="ti ti-brand-whatsapp" style={{ fontSize: 22, color: '#fff' }} />
              </div>
              <div style={{ flex: 1, minWidth: 200 }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: '#0F1F3D', marginBottom: 3 }}>WhatsApp Community</div>
                <div style={{ fontSize: 13, color: '#6B6B6B' }}>Connect with other mentees, share progress, and get community support.</div>
              </div>
              <a
                href={WHATSAPP_LINK}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 7,
                  background: '#25D366', color: '#fff', borderRadius: 10,
                  padding: '11px 20px', fontSize: 13, fontWeight: 700,
                  textDecoration: 'none', fontFamily: "'Inter', sans-serif",
                  flexShrink: 0,
                }}
              >
                <i className="ti ti-brand-whatsapp" style={{ fontSize: 15 }} /> Join our WhatsApp community
              </a>
            </div>
          )}

          <div style={{ marginTop: 20, fontSize: 13, color: '#8A8070', display: 'flex', alignItems: 'center', gap: 7 }}>
            <i className="ti ti-map-pin" style={{ fontSize: 14, color: '#C9A84C' }} />
            Remote — serving Africa and beyond
          </div>
        </div>
      </section>

      {/* ── CONTACT FORM ─────────────────────────────────────────────────── */}
      <section style={{ padding: '64px 28px' }}>
        <div style={{ maxWidth: 640, margin: '0 auto' }}>
          <div style={{ marginBottom: 32 }}>
            <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.09em', color: '#C9A84C', marginBottom: 10 }}>
              <i className="ti ti-pencil" style={{ fontSize: 12, marginRight: 5 }} />Send a Message
            </div>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 34, fontWeight: 900, color: '#0F1F3D', lineHeight: 1.2 }}>
              Write to us directly
            </h2>
          </div>

          {sent ? (
            <div style={{ background: '#fff', border: '1px solid #86efac', borderRadius: 16, padding: '48px 40px', textAlign: 'center' }}>
              <div style={{ width: 56, height: 56, background: '#f0fdf4', border: '1px solid #86efac', borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
                <i className="ti ti-circle-check" style={{ fontSize: 28, color: '#15803d' }} />
              </div>
              <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 24, fontWeight: 900, color: '#0F1F3D', marginBottom: 12 }}>
                Message sent!
              </h3>
              <p style={{ fontSize: 14, color: '#6B6B6B', lineHeight: 1.7, marginBottom: 24 }}>
                Thanks for reaching out. We will get back to you at <strong>{email}</strong> within 24 hours.
              </p>
              <button
                onClick={() => { setSent(false); setName(''); setEmail(''); setMessage(''); setSubject(SUBJECTS[0]) }}
                style={{ fontSize: 13, color: '#C9A84C', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600, fontFamily: "'Inter', sans-serif" }}
              >
                Send another message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ background: '#fff', border: '1px solid #E8E4D9', borderRadius: 16, padding: '36px 32px', display: 'flex', flexDirection: 'column', gap: 22 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.09em', color: '#8A8070', marginBottom: 8 }}>
                    Name <span style={{ color: '#C9A84C' }}>*</span>
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="Your name"
                    className="cpage-input"
                    required
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.09em', color: '#8A8070', marginBottom: 8 }}>
                    Email <span style={{ color: '#C9A84C' }}>*</span>
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    className="cpage-input"
                    required
                  />
                </div>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.09em', color: '#8A8070', marginBottom: 8 }}>
                  Subject
                </label>
                <select
                  value={subject}
                  onChange={e => setSubject(e.target.value)}
                  className="cpage-input"
                  style={{ appearance: 'none', cursor: 'pointer' }}
                >
                  {SUBJECTS.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.09em', color: '#8A8070', marginBottom: 8 }}>
                  Message <span style={{ color: '#C9A84C' }}>*</span>
                </label>
                <textarea
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                  placeholder="Tell us what's on your mind..."
                  rows={6}
                  className="cpage-input"
                  style={{ resize: 'vertical', lineHeight: 1.7 }}
                  required
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                  background: loading ? '#D4C090' : '#C9A84C', color: '#0F1F3D',
                  border: 'none', borderRadius: 10, padding: '14px 24px',
                  fontSize: 14, fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer',
                  fontFamily: "'Inter', sans-serif", transition: 'opacity 0.15s',
                }}
              >
                {loading ? (
                  <><i className="ti ti-loader-2 cpage-spin" style={{ fontSize: 15 }} /> Sending...</>
                ) : (
                  <><i className="ti ti-send" style={{ fontSize: 15 }} /> Send Message</>
                )}
              </button>
              <p style={{ textAlign: 'center', fontSize: 12, color: '#8A8070', margin: 0 }}>
                We typically reply within 24 hours.
              </p>
            </form>
          )}
        </div>
      </section>

      {/* ── FAQ ──────────────────────────────────────────────────────────── */}
      <section style={{ padding: '0 28px 80px' }}>
        <div style={{ maxWidth: 720, margin: '0 auto' }}>
          <div style={{ marginBottom: 32, textAlign: 'center' }}>
            <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.09em', color: '#C9A84C', marginBottom: 10 }}>
              <i className="ti ti-help-circle" style={{ fontSize: 12, marginRight: 5 }} />FAQ
            </div>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 34, fontWeight: 900, color: '#0F1F3D', lineHeight: 1.2 }}>
              Common questions
            </h2>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {FAQS.map((faq, i) => (
              <details key={i} className="cpage-faq-item" style={{ background: '#fff', border: '1px solid #E8E4D9', borderRadius: 12, overflow: 'hidden' }}>
                <summary>
                  {faq.q}
                  <i className="ti ti-plus cpage-faq-icon" style={{ fontSize: 14, color: '#C9A84C' }} />
                </summary>
                <div style={{ padding: '0 24px 20px', fontSize: 14, color: '#4A3F2F', lineHeight: 1.75 }}>
                  {faq.a}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ── FOOTER CTA ───────────────────────────────────────────────────── */}
      <section style={{ background: '#0F1F3D', padding: '56px 28px', textAlign: 'center' }}>
        <div style={{ maxWidth: 500, margin: '0 auto' }}>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 32, fontWeight: 900, color: '#fff', marginBottom: 12, lineHeight: 1.2 }}>
            Ready to find your<br /><em style={{ color: '#C9A84C' }}>tech career path?</em>
          </h2>
          <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.5)', lineHeight: 1.75, marginBottom: 24 }}>
            The free 8-minute assessment matches you to the right domain and gives you a personalised 48-week roadmap.
          </p>
          <Link
            to="/assess"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              background: '#C9A84C', color: '#0F1F3D', borderRadius: 10,
              padding: '14px 28px', fontSize: 14, fontWeight: 700,
              textDecoration: 'none', fontFamily: "'Inter', sans-serif",
            }}
          >
            Take the Free Assessment <i className="ti ti-arrow-right" style={{ fontSize: 14 }} />
          </Link>
        </div>
      </section>
    </div>
  )
}
