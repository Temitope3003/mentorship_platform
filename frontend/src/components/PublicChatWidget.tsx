import { useEffect, useRef, useState } from 'react'
import { api } from '../utils/api'

interface ChatMessage {
  id?: string
  role: 'user' | 'assistant'
  content: string
}

const SESSION_STORAGE_KEY = 'bit_public_chat_session_id'

function getOrCreateSessionId(): string {
  let sessionId = localStorage.getItem(SESSION_STORAGE_KEY)
  if (!sessionId) {
    sessionId = crypto.randomUUID()
    localStorage.setItem(SESSION_STORAGE_KEY, sessionId)
  }
  return sessionId
}

const CSS = `
  @keyframes bit-pchat-fade-in { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
  @keyframes bit-pchat-dot { 0%, 80%, 100% { opacity: 0.25; } 40% { opacity: 1; } }

  .bit-pchat-bubble-btn {
    position: fixed; bottom: 24px; right: 24px; z-index: 60;
    width: 56px; height: 56px; border-radius: 50%; border: none;
    background: #C9A84C; color: #0F1F3D; cursor: pointer;
    display: flex; align-items: center; justify-content: center;
    box-shadow: 0 8px 24px rgba(201,168,76,0.45);
    transition: transform 0.15s, opacity 0.15s;
  }
  .bit-pchat-bubble-btn:hover { transform: scale(1.06); }

  .bit-pchat-panel {
    position: fixed; bottom: 92px; right: 24px; z-index: 60;
    width: 360px; max-width: calc(100vw - 32px); height: 500px; max-height: calc(100vh - 140px);
    background: #fff; border-radius: 16px; border: 1px solid #E8E4D9;
    box-shadow: 0 20px 60px rgba(15,31,61,0.25);
    display: flex; flex-direction: column; overflow: hidden;
    font-family: 'Inter', sans-serif;
    animation: bit-pchat-fade-in 0.18s ease;
  }

  .bit-pchat-msg-row { display: flex; margin-bottom: 10px; }
  .bit-pchat-msg-row.user { justify-content: flex-end; }
  .bit-pchat-bubble {
    max-width: 80%; padding: 9px 13px; border-radius: 12px;
    font-size: 13px; line-height: 1.55; white-space: pre-wrap; word-break: break-word;
  }
  .bit-pchat-bubble.assistant { background: #F9F7F1; border: 1px solid #E8E4D9; color: #0F1F3D; border-bottom-left-radius: 3px; }
  .bit-pchat-bubble.user { background: #0F1F3D; color: #fff; border-bottom-right-radius: 3px; }

  .bit-pchat-input {
    flex: 1; border: 1px solid #E8E4D9; border-radius: 9px;
    padding: 9px 12px; font-size: 13px; font-family: 'Inter', sans-serif;
    color: #0F1F3D; background: #F9F7F1; outline: none; resize: none;
    transition: border-color 0.15s, box-shadow 0.15s, background 0.15s;
  }
  .bit-pchat-input:focus { border-color: #C9A84C; background: #fff; box-shadow: 0 0 0 3px rgba(201,168,76,0.14); }
  .bit-pchat-input:disabled { opacity: 0.6; cursor: not-allowed; }

  .bit-pchat-send-btn {
    width: 36px; height: 36px; border-radius: 9px; border: none;
    background: #C9A84C; color: #0F1F3D; cursor: pointer; flex-shrink: 0;
    display: flex; align-items: center; justify-content: center;
    transition: opacity 0.15s;
  }
  .bit-pchat-send-btn:disabled { opacity: 0.4; cursor: not-allowed; }

  .bit-pchat-dot { display: inline-block; width: 5px; height: 5px; border-radius: 50%; background: #8A8070; margin-right: 3px; animation: bit-pchat-dot 1.2s infinite; }
  .bit-pchat-dot:nth-child(2) { animation-delay: 0.15s; }
  .bit-pchat-dot:nth-child(3) { animation-delay: 0.3s; }
`

export function PublicChatWidget() {
  const [open, setOpen] = useState(false)
  const [hasLoadedHistory, setHasLoadedHistory] = useState(false)
  const [loadingHistory, setLoadingHistory] = useState(false)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState('')
  const [sending, setSending] = useState(false)
  const [limitReached, setLimitReached] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (open && !hasLoadedHistory) {
      loadHistory()
    }
  }, [open])

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages, sending, open])

  async function loadHistory() {
    setLoadingHistory(true)
    try {
      const sessionId = getOrCreateSessionId()
      const res = await api.get(`/public/chat/history/${sessionId}`)
      setMessages(res.data || [])
    } catch {
      // Silent failure — widget just shows the empty state if history can't load
    } finally {
      setLoadingHistory(false)
      setHasLoadedHistory(true)
    }
  }

  async function handleSend() {
    const trimmed = input.trim()
    if (!trimmed || sending || limitReached) return

    setMessages((prev) => [...prev, { role: 'user', content: trimmed }])
    setInput('')
    setSending(true)

    try {
      const sessionId = getOrCreateSessionId()
      const res = await api.post('/public/chat', { message: trimmed, sessionId })
      setMessages((prev) => [...prev, { role: 'assistant', content: res.data.reply }])
    } catch (err: any) {
      if (err.response?.status === 429) {
        setLimitReached(true)
        setMessages((prev) => [...prev, { role: 'assistant', content: "You've reached the chat limit for now, try again in an hour, or take the free assessment to get started!" }])
      } else {
        setMessages((prev) => [...prev, { role: 'assistant', content: "Sorry, something went wrong. Please try again in a moment." }])
      }
    } finally {
      setSending(false)
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <>
      <style>{CSS}</style>

      <button
        onClick={() => setOpen((v) => !v)}
        className="bit-pchat-bubble-btn"
        aria-label={open ? 'Close chat' : 'Open chat with the Build In Tech Assistant'}
      >
        <i className={open ? 'ti ti-x' : 'ti ti-message-circle-2'} style={{ fontSize: 24 }} />
      </button>

      {open && (
        <div className="bit-pchat-panel">
          {/* Header */}
          <div style={{ background: '#0F1F3D', padding: '14px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
              <div style={{ width: 28, height: 28, borderRadius: 8, background: '#C9A84C', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <i className="ti ti-sparkles" style={{ fontSize: 14, color: '#0F1F3D' }} />
              </div>
              <span style={{ fontFamily: "'Playfair Display', serif", fontSize: 14, fontWeight: 700, color: '#fff' }}>
                Build In Tech Assistant
              </span>
            </div>
            <button
              onClick={() => setOpen(false)}
              style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.6)', cursor: 'pointer', padding: 4 }}
            >
              <i className="ti ti-x" style={{ fontSize: 16 }} />
            </button>
          </div>

          {/* Messages */}
          <div ref={scrollRef} style={{ flex: 1, overflowY: 'auto', padding: '16px 14px' }}>
            {loadingHistory ? (
              <div style={{ textAlign: 'center', padding: '24px 0' }}>
                <i className="ti ti-loader-2" style={{ fontSize: 20, color: '#C9A84C', animation: 'bit-pchat-dot 1s linear infinite' }} />
              </div>
            ) : messages.length === 0 ? (
              <div className="bit-pchat-msg-row assistant">
                <div className="bit-pchat-bubble assistant">
                  Hi! I'm the Build In Tech Assistant. Ask me about any of our 15 career tracks, how the program works, or anything else before you get started.
                </div>
              </div>
            ) : (
              messages.map((m, i) => (
                <div key={m.id || i} className={`bit-pchat-msg-row ${m.role}`}>
                  <div className={`bit-pchat-bubble ${m.role}`}>{m.content}</div>
                </div>
              ))
            )}

            {sending && (
              <div className="bit-pchat-msg-row assistant">
                <div className="bit-pchat-bubble assistant">
                  <span className="bit-pchat-dot" /><span className="bit-pchat-dot" /><span className="bit-pchat-dot" />
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div style={{ borderTop: '1px solid #E8E4D9', padding: '10px 14px', flexShrink: 0 }}>
            <div style={{ display: 'flex', gap: 8, alignItems: 'flex-end' }}>
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={limitReached ? 'Chat limit reached — try again in an hour' : 'Ask me anything...'}
                disabled={sending || limitReached}
                rows={1}
                className="bit-pchat-input"
              />
              <button
                onClick={handleSend}
                disabled={sending || limitReached || !input.trim()}
                className="bit-pchat-send-btn"
                aria-label="Send message"
              >
                <i className="ti ti-send" style={{ fontSize: 15 }} />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
