import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../utils/api'
import { QUESTIONS } from '../utils/questionData'
import toast from 'react-hot-toast'
import { PageMeta } from '../components/PageMeta'

type Answer = number | number[] | null

const STORAGE_LEAD_ID = 'assessment_lead_id'
const STORAGE_LEAD_EMAIL = 'assessment_lead_email'

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900;1,700;1,900&family=Inter:wght@400;500;600;700&display=swap');

  @keyframes bit-spin { to { transform: rotate(360deg); } }
  .bit-spin { animation: bit-spin 0.75s linear infinite; }

  .bit-input {
    width: 100%; border: 1.5px solid #E8E4D9; border-radius: 10px;
    padding: 13px 16px; font-size: 14px;
    font-family: 'Inter', sans-serif; color: #0F1F3D;
    background: #F9F7F1; outline: none;
    transition: border-color 0.15s, box-shadow 0.15s, background 0.15s; box-sizing: border-box;
  }
  .bit-input:focus { border-color: #C9A84C; background: #fff; box-shadow: 0 0 0 4px rgba(201,168,76,0.12); }
  .bit-input::placeholder { color: #B0A898; }

  .bit-textarea {
    width: 100%; border: 1.5px solid #E8E4D9; border-radius: 10px;
    padding: 13px 16px; font-size: 14px; resize: none;
    font-family: 'Inter', sans-serif; color: #0F1F3D;
    background: #F9F7F1; outline: none; line-height: 1.7;
    transition: border-color 0.15s, box-shadow 0.15s, background 0.15s; box-sizing: border-box;
  }
  .bit-textarea:focus { border-color: #C9A84C; background: #fff; box-shadow: 0 0 0 4px rgba(201,168,76,0.12); }
  .bit-textarea::placeholder { color: #B0A898; }

  .bit-btn-gold {
    display: flex; align-items: center; justify-content: center; gap: 8px;
    background: #C9A84C; color: #0F1F3D; border: none; border-radius: 10px;
    padding: 14px 24px; font-size: 14px; font-weight: 700;
    cursor: pointer; font-family: 'Inter', sans-serif;
    transition: opacity 0.15s, transform 0.15s;
  }
  .bit-btn-gold:hover:not(:disabled) { opacity: 0.88; transform: translateY(-1px); }
  .bit-btn-gold:disabled { opacity: 0.4; cursor: not-allowed; transform: none; }

  .bit-btn-ghost {
    display: inline-flex; align-items: center; gap: 6px;
    background: #fff; color: #0F1F3D; border: 1px solid #E8E4D9; border-radius: 10px;
    padding: 13px 20px; font-size: 14px; font-weight: 600;
    cursor: pointer; font-family: 'Inter', sans-serif;
    transition: border-color 0.15s, background 0.15s;
  }
  .bit-btn-ghost:hover { border-color: #C9A84C; background: #FBF7EC; }

  .bit-option {
    display: flex; align-items: center; gap: 12px;
    width: 100%; text-align: left; background: #fff;
    border: 1.5px solid #E8E4D9; border-radius: 10px;
    padding: 14px 16px; cursor: pointer; font-family: 'Inter', sans-serif;
    font-size: 14px; color: #0F1F3D; font-weight: 500;
    transition: border-color 0.15s, background 0.15s, box-shadow 0.15s;
  }
  .bit-option:hover { border-color: #C9A84C; background: #FBF7EC; }
  .bit-option.selected {
    border-color: #C9A84C; background: #FBF7EC;
    box-shadow: 0 0 0 3px rgba(201,168,76,0.14);
    color: #0F1F3D;
  }

  .bit-check {
    width: 20px; height: 20px; border-radius: 50%; border: 2px solid #E8E4D9;
    display: flex; align-items: center; justify-content: center; flex-shrink: 0;
    transition: border-color 0.15s, background 0.15s;
  }
  .bit-check.square { border-radius: 5px; }
  .bit-check.checked { border-color: #C9A84C; background: #C9A84C; }
`

export function AssessmentPage() {
  const navigate = useNavigate()
  const [stage, setStage] = useState<'lead' | 'intake' | 'goal' | 'quiz'>('lead')
  const [sessionToken, setSessionToken] = useState('')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [goal, setGoal] = useState('')
  const [currentQ, setCurrentQ] = useState(0)
  const [answers, setAnswers] = useState<Answer[]>(new Array(QUESTIONS.length).fill(null))
  const [loading, setLoading] = useState(false)
  // Lead capture state
  const [leadEmail, setLeadEmail] = useState('')
  const [leadFirstName, setLeadFirstName] = useState('')
  const [leadPhone, setLeadPhone] = useState('')

  useEffect(() => {
    const storedId = sessionStorage.getItem(STORAGE_LEAD_ID)
    const storedEmail = sessionStorage.getItem(STORAGE_LEAD_EMAIL)
    if (storedId && storedEmail) {
      setEmail(storedEmail)
      setStage('intake')
    }
  }, [])

  async function handleLead() {
    if (!leadEmail.trim() || !leadEmail.includes('@')) { toast.error('Please enter a valid email address'); return }
    setLoading(true)
    try {
      const res = await api.post('/public/assessment-lead', {
        email: leadEmail.trim(),
        firstName: leadFirstName.trim() || undefined,
        phoneNumber: leadPhone.trim() || undefined,
      })
      sessionStorage.setItem(STORAGE_LEAD_ID, res.data.leadId)
      sessionStorage.setItem(STORAGE_LEAD_EMAIL, leadEmail.trim().toLowerCase())
      setEmail(leadEmail.trim().toLowerCase())
      setStage('intake')
    } catch {
      // Non-fatal — still proceed even if lead capture fails
      setEmail(leadEmail.trim().toLowerCase())
      setStage('intake')
    } finally { setLoading(false) }
  }

  async function handleIntake() {
    if (!name.trim() || !email.trim()) { toast.error('Please enter your name and email'); return }
    if (!email.includes('@')) { toast.error('Please enter a valid email address'); return }
    setLoading(true)
    try {
      const res = await api.post('/assessment/start', { name, email })
      setSessionToken(res.data.sessionToken)
      setStage('goal')
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Something went wrong')
    } finally { setLoading(false) }
  }

  async function handleGoal() {
    if (goal.trim().length < 20) { toast.error('Please write at least 20 characters about your goal'); return }
    setLoading(true)
    try {
      await api.put(`/assessment/${sessionToken}/answers`, { statedGoal: goal })
      setStage('quiz')
      try { window.plausible?.('Assessment Started') } catch {}
    } catch { toast.error('Something went wrong saving your goal') }
    finally { setLoading(false) }
  }

  function selectOption(index: number) {
    const q = QUESTIONS[currentQ]
    const isMulti = !!q.multi
    const newAnswers = [...answers]
    if (isMulti) {
      const current = (newAnswers[currentQ] as number[]) || []
      newAnswers[currentQ] = current.includes(index) ? current.filter((i) => i !== index) : [...current, index]
    } else {
      newAnswers[currentQ] = index
    }
    setAnswers(newAnswers)
  }

  function isSelected(index: number) {
    const ans = answers[currentQ]
    if (Array.isArray(ans)) return ans.includes(index)
    return ans === index
  }

  function hasAnswer() {
    const ans = answers[currentQ]
    if (Array.isArray(ans)) return ans.length > 0
    return ans !== null
  }

  async function handleNext() {
    if (currentQ < QUESTIONS.length - 1) { setCurrentQ(currentQ + 1) }
    else { await submitAssessment() }
  }

  async function submitAssessment() {
    setLoading(true)
    try {
      await api.post(`/assessment/${sessionToken}/complete`, { answers })
      try { window.plausible?.('Assessment Completed') } catch {}
      navigate(`/results/${sessionToken}`)
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Something went wrong submitting your assessment')
    } finally { setLoading(false) }
  }

  const progress = stage === 'lead' ? 0 : stage === 'intake' ? 5 : stage === 'goal' ? 15 : 15 + ((currentQ / QUESTIONS.length) * 85)
  const isMultiQ = stage === 'quiz' && !!QUESTIONS[currentQ]?.multi

  return (
    <div style={{ minHeight: '100vh', background: '#F9F7F1', fontFamily: "'Inter', sans-serif", color: '#0F1F3D', padding: '48px 20px 72px' }}>
      <PageMeta
        title="Take the Free Tech Career Aptitude Assessment"
        description="Find your ideal tech career track in 10 minutes. Our AI-powered assessment matches your natural strengths to the right domain and gives you a personalised roadmap."
        path="/assess"
      />
      <style>{CSS}</style>

      {/* ── PROGRESS BAR ─────────────────────────────────────────────── */}
      <div style={{ maxWidth: 540, margin: '0 auto 32px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8, fontSize: 12 }}>
          <span style={{ color: '#8A8070', fontWeight: 500 }}>
            {stage === 'lead' ? 'Before we start' : stage === 'intake' ? 'Your details' : stage === 'goal' ? 'Your goal' : `Question ${currentQ + 1} of ${QUESTIONS.length}`}
          </span>
          <span style={{ color: '#C9A84C', fontWeight: 700, fontFamily: 'monospace' }}>{Math.round(progress)}%</span>
        </div>
        <div style={{ height: 5, borderRadius: 99, background: '#E8E4D9', overflow: 'hidden' }}>
          <div style={{
            height: '100%', borderRadius: 99, background: '#C9A84C',
            width: `${progress}%`, transition: 'width 0.5s ease',
          }} />
        </div>
      </div>

      <div style={{ maxWidth: 540, margin: '0 auto' }}>

        {/* ── LEAD CAPTURE ─────────────────────────────────────────────── */}
        {stage === 'lead' && (
          <div style={{ background: '#fff', border: '1px solid #E8E4D9', borderRadius: 16, padding: '36px 32px', boxShadow: '0 4px 24px rgba(15,31,61,0.06)' }}>
            <div style={{ marginBottom: 10 }}>
              <span style={{
                display: 'inline-flex', alignItems: 'center', gap: 6,
                background: '#FBF7EC', border: '1px solid #DFC97A', borderRadius: 999,
                padding: '4px 12px', fontSize: 11, fontWeight: 700, letterSpacing: '0.07em',
                textTransform: 'uppercase', color: '#7A5C1E',
              }}>
                <i className="ti ti-mail" style={{ fontSize: 11 }} /> Free Assessment
              </span>
            </div>
            <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 26, fontWeight: 900, color: '#0F1F3D', marginBottom: 10, lineHeight: 1.2 }}>
              Where should we send your results?
            </h1>
            <p style={{ fontSize: 14, color: '#6B6B6B', lineHeight: 1.75, marginBottom: 28 }}>
              Your personalised domain match and 48-week roadmap will be emailed to you. No account needed.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
              <div>
                <label style={{ display: 'block', fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.09em', color: '#8A8070', marginBottom: 8 }}>
                  Email Address <span style={{ color: '#C9A84C' }}>*</span>
                </label>
                <input
                  type="email"
                  value={leadEmail}
                  onChange={(e) => setLeadEmail(e.target.value)}
                  placeholder="e.g. amara@email.com"
                  className="bit-input"
                  onKeyDown={(e) => e.key === 'Enter' && handleLead()}
                  autoFocus
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.09em', color: '#8A8070', marginBottom: 8 }}>
                  First Name <span style={{ color: '#B0A898', fontWeight: 400, textTransform: 'none', fontSize: 10 }}>(optional)</span>
                </label>
                <input
                  type="text"
                  value={leadFirstName}
                  onChange={(e) => setLeadFirstName(e.target.value)}
                  placeholder="e.g. Amara"
                  className="bit-input"
                  onKeyDown={(e) => e.key === 'Enter' && handleLead()}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.09em', color: '#8A8070', marginBottom: 8 }}>
                  Phone Number <span style={{ color: '#B0A898', fontWeight: 400, textTransform: 'none', fontSize: 10 }}>(optional)</span>
                </label>
                <input
                  type="tel"
                  value={leadPhone}
                  onChange={(e) => setLeadPhone(e.target.value)}
                  placeholder="e.g. +234 800 000 0000"
                  className="bit-input"
                  onKeyDown={(e) => e.key === 'Enter' && handleLead()}
                />
                <p style={{ margin: '6px 0 0', fontSize: 12, color: '#8A8070' }}>
                  <i className="ti ti-brand-whatsapp" style={{ fontSize: 12, marginRight: 4, color: '#25D366' }} />
                  For WhatsApp updates only
                </p>
              </div>
              <button onClick={handleLead} disabled={loading} className="bit-btn-gold" style={{ width: '100%' }}>
                {loading ? (
                  <><i className="ti ti-loader-2 bit-spin" style={{ fontSize: 15 }} /> Please wait...</>
                ) : (
                  <><i className="ti ti-arrow-right" style={{ fontSize: 15 }} /> Start My Assessment</>
                )}
              </button>
              <p style={{ textAlign: 'center', fontSize: 12, color: '#8A8070' }}>
                Your details go directly to your mentor. Never sold or shared.
              </p>
            </div>
          </div>
        )}

        {/* ── INTAKE ───────────────────────────────────────────────────── */}
        {stage === 'intake' && (
          <div style={{ background: '#fff', border: '1px solid #E8E4D9', borderRadius: 16, padding: '36px 32px', boxShadow: '0 4px 24px rgba(15,31,61,0.06)' }}>
            <div style={{ marginBottom: 10 }}>
              <span style={{
                display: 'inline-flex', alignItems: 'center', gap: 6,
                background: '#FBF7EC', border: '1px solid #DFC97A', borderRadius: 999,
                padding: '4px 12px', fontSize: 11, fontWeight: 700, letterSpacing: '0.07em',
                textTransform: 'uppercase', color: '#7A5C1E',
              }}>
                <i className="ti ti-user" style={{ fontSize: 11 }} /> Step 1 of 3
              </span>
            </div>
            <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 26, fontWeight: 900, color: '#0F1F3D', marginBottom: 10, lineHeight: 1.2 }}>
              Let's start with you
            </h1>
            <p style={{ fontSize: 14, color: '#6B6B6B', lineHeight: 1.75, marginBottom: 28 }}>
              Your mentor uses this to follow up after your assessment with your personalised roadmap and access code.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
              <div>
                <label style={{ display: 'block', fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.09em', color: '#8A8070', marginBottom: 8 }}>
                  Full Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Amara Johnson"
                  className="bit-input"
                  onKeyDown={(e) => e.key === 'Enter' && handleIntake()}
                  autoFocus
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.09em', color: '#8A8070', marginBottom: 8 }}>
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => !sessionStorage.getItem(STORAGE_LEAD_ID) && setEmail(e.target.value)}
                  placeholder="e.g. amara@email.com"
                  className="bit-input"
                  onKeyDown={(e) => e.key === 'Enter' && handleIntake()}
                  readOnly={!!sessionStorage.getItem(STORAGE_LEAD_ID)}
                  style={sessionStorage.getItem(STORAGE_LEAD_ID) ? { background: '#F0EDE6', color: '#6B6B6B', cursor: 'default' } : {}}
                />
              </div>
              <button onClick={handleIntake} disabled={loading} className="bit-btn-gold" style={{ width: '100%' }}>
                {loading ? (
                  <><i className="ti ti-loader-2 bit-spin" style={{ fontSize: 15 }} /> Please wait...</>
                ) : (
                  <><i className="ti ti-arrow-right" style={{ fontSize: 15 }} /> Continue</>
                )}
              </button>
              <p style={{ textAlign: 'center', fontSize: 12, color: '#8A8070' }}>
                Your details go directly to your mentor. Never sold or shared.
              </p>
            </div>
          </div>
        )}

        {/* ── GOAL ─────────────────────────────────────────────────────── */}
        {stage === 'goal' && (
          <div style={{ background: '#fff', border: '1px solid #E8E4D9', borderRadius: 16, padding: '36px 32px', boxShadow: '0 4px 24px rgba(15,31,61,0.06)' }}>
            <div style={{ marginBottom: 10 }}>
              <span style={{
                display: 'inline-flex', alignItems: 'center', gap: 6,
                background: 'rgba(29,74,110,0.07)', border: '1px solid rgba(29,74,110,0.2)',
                borderRadius: 999, padding: '4px 12px', fontSize: 11, fontWeight: 700,
                letterSpacing: '0.07em', textTransform: 'uppercase', color: '#1D4A6E',
              }}>
                <i className="ti ti-target" style={{ fontSize: 11 }} /> Step 2 of 3
              </span>
            </div>
            <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 26, fontWeight: 900, color: '#0F1F3D', marginBottom: 10, lineHeight: 1.2 }}>
              What do you want in tech?
            </h1>
            <p style={{ fontSize: 14, color: '#6B6B6B', lineHeight: 1.75, marginBottom: 28 }}>
              Write freely. Describe the career you are dreaming about, the problems you want to solve, or the things you want to build.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
              <div>
                <label style={{ display: 'block', fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.09em', color: '#8A8070', marginBottom: 8 }}>
                  Your goal in tech
                </label>
                <textarea
                  value={goal}
                  onChange={(e) => setGoal(e.target.value)}
                  placeholder="e.g. I want to build mobile apps that help small businesses in my community manage their finances. I love design and want to create things people enjoy using..."
                  maxLength={800}
                  rows={6}
                  className="bit-textarea"
                />
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6, fontSize: 12 }}>
                  <span style={{ color: goal.length >= 20 ? '#15803d' : '#8A8070', fontWeight: goal.length >= 20 ? 600 : 400 }}>
                    {goal.length >= 20 ? (
                      <><i className="ti ti-circle-check" style={{ fontSize: 12, marginRight: 4 }} />Good length</>
                    ) : (
                      `Min 20 characters (${20 - goal.length} more)`
                    )}
                  </span>
                  <span style={{ color: '#8A8070', fontFamily: 'monospace' }}>{goal.length} / 800</span>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 10 }}>
                <button onClick={() => setStage('intake')} className="bit-btn-ghost">
                  <i className="ti ti-arrow-left" style={{ fontSize: 14 }} /> Back
                </button>
                <button onClick={handleGoal} disabled={loading} className="bit-btn-gold" style={{ flex: 1 }}>
                  {loading ? (
                    <><i className="ti ti-loader-2 bit-spin" style={{ fontSize: 15 }} /> Saving...</>
                  ) : (
                    <><i className="ti ti-arrow-right" style={{ fontSize: 15 }} /> Start Assessment</>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ── QUIZ ─────────────────────────────────────────────────────── */}
        {stage === 'quiz' && (
          <div>
            <div style={{ background: '#fff', border: '1px solid #E8E4D9', borderRadius: 16, padding: '32px 28px', boxShadow: '0 4px 24px rgba(15,31,61,0.06)', marginBottom: 14 }}>
              {/* Question badge */}
              <div style={{ marginBottom: 16 }}>
                <span style={{
                  display: 'inline-flex', alignItems: 'center', gap: 6,
                  background: '#FBF7EC', border: '1px solid #DFC97A',
                  borderRadius: 999, padding: '4px 12px', fontSize: 11, fontWeight: 700,
                  letterSpacing: '0.07em', textTransform: 'uppercase', color: '#7A5C1E',
                }}>
                  Question {currentQ + 1}
                  {isMultiQ && ' — Select all that apply'}
                </span>
              </div>

              <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 21, fontWeight: 900, color: '#0F1F3D', lineHeight: 1.4, marginBottom: 24 }}>
                {QUESTIONS[currentQ].text}
              </h2>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {QUESTIONS[currentQ].options.map((opt, i) => (
                  <button
                    key={i}
                    onClick={() => selectOption(i)}
                    className={`bit-option${isSelected(i) ? ' selected' : ''}`}
                  >
                    <span className={`bit-check${isMultiQ ? ' square' : ''}${isSelected(i) ? ' checked' : ''}`}>
                      {isSelected(i) && (
                        <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                          <path d="M2 5l2.5 2.5L8 3" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      )}
                    </span>
                    {opt.text}
                  </button>
                ))}
              </div>
            </div>

            {/* Navigation */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <button
                onClick={() => setCurrentQ(Math.max(0, currentQ - 1))}
                className="bit-btn-ghost"
                style={{ visibility: currentQ === 0 ? 'hidden' : 'visible' }}
              >
                <i className="ti ti-arrow-left" style={{ fontSize: 14 }} /> Back
              </button>
              <button
                onClick={handleNext}
                disabled={!hasAnswer() || loading}
                className="bit-btn-gold"
                style={{ minWidth: 160 }}
              >
                {loading ? (
                  <><i className="ti ti-loader-2 bit-spin" style={{ fontSize: 15 }} /> Submitting...</>
                ) : currentQ === QUESTIONS.length - 1 ? (
                  <><i className="ti ti-sparkles" style={{ fontSize: 15 }} /> See My Results</>
                ) : (
                  <>Next <i className="ti ti-arrow-right" style={{ fontSize: 15 }} /></>
                )}
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  )
}
