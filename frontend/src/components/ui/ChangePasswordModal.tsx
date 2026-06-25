import { useState } from 'react'
import { api } from '../../utils/api'
import toast from 'react-hot-toast'

const CSS = `
  @keyframes bit-cp-spin { to { transform: rotate(360deg); } }
  .bit-cp-spin { animation: bit-cp-spin 0.75s linear infinite; }

  .bit-cp-input {
    width: 100%; border: 1px solid #E8E4D9; border-radius: 9px;
    padding: 11px 14px; font-size: 13px; font-family: 'Inter', sans-serif;
    color: #0F1F3D; background: #F9F7F1; outline: none;
    transition: border-color 0.15s, box-shadow 0.15s, background 0.15s; box-sizing: border-box;
  }
  .bit-cp-input:focus { border-color: #C9A84C; background: #fff; box-shadow: 0 0 0 3px rgba(201,168,76,0.14); }
  .bit-cp-input::placeholder { color: #B0A898; }
`

interface ChangePasswordModalProps {
  onClose: () => void
}

export function ChangePasswordModal({ onClose }: ChangePasswordModalProps) {
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const mismatch = newPassword.length > 0 && confirmPassword.length > 0 && newPassword !== confirmPassword
  const canSubmit = currentPassword.length > 0 && newPassword.length >= 8 && confirmPassword === newPassword && !loading

  async function handleSubmit() {
    setError('')
    if (!currentPassword || !newPassword || !confirmPassword) {
      setError('Please fill in all fields')
      return
    }
    if (newPassword.length < 8) {
      setError('New password must be at least 8 characters')
      return
    }
    if (newPassword !== confirmPassword) {
      setError('New password and confirmation do not match')
      return
    }
    setLoading(true)
    try {
      await api.post('/mentor/me/password', { currentPassword, newPassword })
      toast.success('Password updated successfully')
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
      onClose()
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to update password')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 100,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: 'rgba(15,31,61,0.55)', backdropFilter: 'blur(4px)', padding: 24,
      }}
      onClick={e => { if (e.target === e.currentTarget) onClose() }}
    >
      <style>{CSS}</style>
      <div style={{
        background: '#fff', borderRadius: 16, padding: '28px 28px',
        width: '100%', maxWidth: 420, boxShadow: '0 20px 60px rgba(15,31,61,0.18)',
        fontFamily: "'Inter', sans-serif",
      }}>
        <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, fontWeight: 900, color: '#0F1F3D', marginBottom: 4 }}>
          Change Password
        </h2>
        <p style={{ fontSize: 13, color: '#6B6B6B', marginBottom: 20 }}>
          Update your mentor account password.
        </p>

        <div style={{ marginBottom: 14 }}>
          <label style={{ display: 'block', fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#8A8070', marginBottom: 7 }}>
            Current Password
          </label>
          <input
            type="password"
            value={currentPassword}
            onChange={e => setCurrentPassword(e.target.value)}
            placeholder="••••••••"
            className="bit-cp-input"
          />
        </div>

        <div style={{ marginBottom: 14 }}>
          <label style={{ display: 'block', fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#8A8070', marginBottom: 7 }}>
            New Password
          </label>
          <input
            type="password"
            value={newPassword}
            onChange={e => setNewPassword(e.target.value)}
            placeholder="At least 8 characters"
            className="bit-cp-input"
          />
        </div>

        <div style={{ marginBottom: 16 }}>
          <label style={{ display: 'block', fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#8A8070', marginBottom: 7 }}>
            Confirm New Password
          </label>
          <input
            type="password"
            value={confirmPassword}
            onChange={e => setConfirmPassword(e.target.value)}
            placeholder="Re-enter new password"
            className="bit-cp-input"
            onKeyDown={e => e.key === 'Enter' && canSubmit && handleSubmit()}
          />
          {mismatch && (
            <p style={{ fontSize: 11, color: '#ef4444', marginTop: 6 }}>Passwords do not match</p>
          )}
        </div>

        {error && (
          <p style={{ fontSize: 12, color: '#ef4444', marginBottom: 14, display: 'flex', alignItems: 'center', gap: 5 }}>
            <i className="ti ti-alert-circle" style={{ fontSize: 12 }} /> {error}
          </p>
        )}

        <div style={{ display: 'flex', gap: 10 }}>
          <button
            onClick={handleSubmit}
            disabled={!canSubmit}
            style={{
              flex: 1, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 7,
              background: '#C9A84C', color: '#0F1F3D', border: 'none', borderRadius: 9,
              padding: '12px 22px', fontSize: 13, fontWeight: 700,
              cursor: canSubmit ? 'pointer' : 'not-allowed', opacity: canSubmit ? 1 : 0.4,
              fontFamily: "'Inter', sans-serif",
            }}
          >
            {loading ? (
              <><i className="ti ti-loader-2 bit-cp-spin" style={{ fontSize: 14 }} /> Updating...</>
            ) : (
              <><i className="ti ti-check" style={{ fontSize: 14 }} /> Update Password</>
            )}
          </button>
          <button
            onClick={onClose}
            style={{
              background: '#fff', color: '#0F1F3D', border: '1px solid #E8E4D9', borderRadius: 9,
              padding: '12px 20px', fontSize: 13, fontWeight: 600, cursor: 'pointer',
              fontFamily: "'Inter', sans-serif",
            }}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  )
}
