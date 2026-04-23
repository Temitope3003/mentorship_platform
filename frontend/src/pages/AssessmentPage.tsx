import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../utils/api'
import { QUESTIONS } from '../utils/questionData'
import toast from 'react-hot-toast'

type Answer = number | number[] | null

export function AssessmentPage() {
  const navigate = useNavigate()
  const [stage, setStage] = useState<'intake' | 'goal' | 'quiz'>('intake')
  const [sessionToken, setSessionToken] = useState('')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [goal, setGoal] = useState('')
  const [currentQ, setCurrentQ] = useState(0)
  const [answers, setAnswers] = useState<Answer[]>(new Array(QUESTIONS.length).fill(null))
  const [loading, setLoading] = useState(false)

  async function handleIntake() {
    if (!name.trim() || !email.trim()) {
      toast.error('Please enter your name and email')
      return
    }
    if (!email.includes('@')) {
      toast.error('Please enter a valid email address')
      return
    }
    setLoading(true)
    try {
      const res = await api.post('/assessment/start', { name, email })
      setSessionToken(res.data.sessionToken)
      setStage('goal')
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  async function handleGoal() {
    if (goal.trim().length < 20) {
      toast.error('Please write at least 20 characters about your goal')
      return
    }
    setLoading(true)
    try {
      await api.put(`/assessment/${sessionToken}/answers`, { statedGoal: goal })
      setStage('quiz')
    } catch {
      toast.error('Something went wrong saving your goal')
    } finally {
      setLoading(false)
    }
  }

  function selectOption(index: number) {
    const q = QUESTIONS[currentQ]
    const isMulti = !!q.multi
    const newAnswers = [...answers]

    if (isMulti) {
      const current = (newAnswers[currentQ] as number[]) || []
      if (current.includes(index)) {
        newAnswers[currentQ] = current.filter((i) => i !== index)
      } else {
        newAnswers[currentQ] = [...current, index]
      }
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
    if (currentQ < QUESTIONS.length - 1) {
      setCurrentQ(currentQ + 1)
    } else {
      await submitAssessment()
    }
  }

  async function submitAssessment() {
    setLoading(true)
    try {
      await api.post(`/assessment/${sessionToken}/complete`, { answers })
      navigate(`/results/${sessionToken}`)
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Something went wrong submitting your assessment')
    } finally {
      setLoading(false)
    }
  }

  const progress = stage === 'intake' ? 5 : stage === 'goal' ? 15 : 15 + ((currentQ / QUESTIONS.length) * 85)

  return (
    <div className="min-h-screen px-4 py-16">
      {/* progress bar */}
      <div className="mx-auto mb-10 max-w-lg">
        <div className="flex items-center justify-between text-xs text-muted mb-2">
          <span>
            {stage === 'intake' ? 'Your details' : stage === 'goal' ? 'Your goal' : `Question ${currentQ + 1} of ${QUESTIONS.length}`}
          </span>
          <span className="font-mono text-accent">{Math.round(progress)}%</span>
        </div>
        <div className="h-0.5 rounded-full bg-white/[0.06]">
          <div
            className="h-full rounded-full bg-gradient-to-r from-accent to-teal transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div className="mx-auto max-w-lg">

        {/* INTAKE STAGE */}
        {stage === 'intake' && (
          <div className="rounded-2xl border border-white/[0.07] bg-card p-8">
            <div className="mb-2 text-xs font-bold uppercase tracking-widest text-accent">Step 1 of 3</div>
            <h1 className="font-display mb-3 text-2xl font-bold">Let's start with you</h1>
            <p className="mb-8 text-sm leading-relaxed text-muted">
              Your mentor uses this to follow up after your assessment with your personalised roadmap and access code.
            </p>
            <div className="space-y-5">
              <div>
                <label className="mb-2 block text-xs font-semibold uppercase tracking-widest text-muted">
                  Full Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Amara Johnson"
                  className="w-full rounded-xl border border-white/[0.07] bg-white/[0.04] px-4 py-3 text-sm text-white placeholder-muted outline-none transition focus:border-accent focus:bg-accent/5 focus:ring-2 focus:ring-accent/20"
                  onKeyDown={(e) => e.key === 'Enter' && handleIntake()}
                />
              </div>
              <div>
                <label className="mb-2 block text-xs font-semibold uppercase tracking-widest text-muted">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. amara@email.com"
                  className="w-full rounded-xl border border-white/[0.07] bg-white/[0.04] px-4 py-3 text-sm text-white placeholder-muted outline-none transition focus:border-accent focus:bg-accent/5 focus:ring-2 focus:ring-accent/20"
                  onKeyDown={(e) => e.key === 'Enter' && handleIntake()}
                />
              </div>
              <button
                onClick={handleIntake}
                disabled={loading}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-accent py-3.5 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(255,107,43,0.3)] disabled:opacity-40 disabled:hover:translate-y-0"
              >
                {loading ? 'Please wait...' : 'Continue →'}
              </button>
            </div>
          </div>
        )}

        {/* GOAL STAGE */}
        {stage === 'goal' && (
          <div className="rounded-2xl border border-white/[0.07] bg-card p-8">
            <div className="mb-2 text-xs font-bold uppercase tracking-widest text-teal">Step 2 of 3</div>
            <h1 className="font-display mb-3 text-2xl font-bold">What do you want in tech?</h1>
            <p className="mb-8 text-sm leading-relaxed text-muted">
              Write freely. Describe the career you are dreaming about, the problems you want to solve, or the things you want to build. The AI reads this alongside your assessment.
            </p>
            <div className="space-y-5">
              <div>
                <label className="mb-2 block text-xs font-semibold uppercase tracking-widest text-muted">
                  Your goal in tech
                </label>
                <textarea
                  value={goal}
                  onChange={(e) => setGoal(e.target.value)}
                  placeholder="e.g. I want to build mobile apps that help small businesses manage their finances. I love design and want to create things people actually enjoy using..."
                  maxLength={800}
                  rows={6}
                  className="w-full rounded-xl border border-white/[0.07] bg-white/[0.04] px-4 py-3 text-sm text-white placeholder-muted outline-none transition focus:border-accent focus:bg-accent/5 focus:ring-2 focus:ring-accent/20 resize-none"
                />
                <div className="mt-1.5 flex justify-between text-xs">
                  <span className={goal.length >= 20 ? 'text-teal' : 'text-muted'}>
                    {goal.length >= 20 ? '✓ Good' : 'Min 20 characters'}
                  </span>
                  <span className="font-mono text-muted">{goal.length} / 800</span>
                </div>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setStage('intake')}
                  className="rounded-xl border border-white/[0.07] bg-white/[0.04] px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
                >
                  ← Back
                </button>
                <button
                  onClick={handleGoal}
                  disabled={loading}
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-accent py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(255,107,43,0.3)] disabled:opacity-40"
                >
                  {loading ? 'Saving...' : 'Start Assessment →'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* QUIZ STAGE */}
        {stage === 'quiz' && (
          <div>
            <div className="rounded-2xl border border-white/[0.07] bg-card p-8 mb-5">
              <div className="mb-3 inline-flex items-center rounded-full border border-accent/20 bg-accent/10 px-3 py-1 text-xs font-bold uppercase tracking-widest text-accent">
                Question {currentQ + 1}
                {QUESTIONS[currentQ].multi && ' — Select all that apply'}
              </div>
              <h2 className="font-display mb-7 text-xl font-bold leading-snug">
                {QUESTIONS[currentQ].text}
              </h2>
              <div className="space-y-3">
                {QUESTIONS[currentQ].options.map((opt, i) => (
                  <button
                    key={i}
                    onClick={() => selectOption(i)}
                    className={`flex w-full items-center gap-3 rounded-xl border px-4 py-3.5 text-left text-sm transition ${
                      isSelected(i)
                        ? 'border-accent bg-accent/10 text-white'
                        : 'border-white/[0.07] bg-white/[0.03] text-white/80 hover:border-accent/30 hover:bg-accent/5'
                    }`}
                  >
                    <span
                      className={`flex h-5 w-5 flex-shrink-0 items-center justify-center border-2 transition ${
                        QUESTIONS[currentQ].multi ? 'rounded' : 'rounded-full'
                      } ${
                        isSelected(i)
                          ? 'border-accent bg-accent'
                          : 'border-white/20'
                      }`}
                    >
                      {isSelected(i) && (
                        <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                          <path d="M2 5l2.5 2.5L8 3" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      )}
                    </span>
                    {opt.text}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex justify-between">
              <button
                onClick={() => setCurrentQ(Math.max(0, currentQ - 1))}
                className={`rounded-xl border border-white/[0.07] bg-white/[0.04] px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10 ${currentQ === 0 ? 'invisible' : ''}`}
              >
                ← Back
              </button>
              <button
                onClick={handleNext}
                disabled={!hasAnswer() || loading}
                className="flex items-center gap-2 rounded-xl bg-accent px-6 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(255,107,43,0.3)] disabled:opacity-40 disabled:hover:translate-y-0 disabled:cursor-not-allowed"
              >
                {loading ? 'Submitting...' : currentQ === QUESTIONS.length - 1 ? 'See My Results →' : 'Next →'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}