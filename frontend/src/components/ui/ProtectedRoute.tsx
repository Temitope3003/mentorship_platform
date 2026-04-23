import { Navigate } from 'react-router-dom'
import { useAuthStore } from '../../store/authStore'

interface Props {
  children: React.ReactNode
  role: 'mentee' | 'mentor'
}

export function ProtectedRoute({ children, role }: Props) {
  const { token, user } = useAuthStore()

  if (!token || !user) {
    return <Navigate to={role === 'mentor' ? '/mentor/login' : '/login'} replace />
  }

  if (user.role !== role) {
    return <Navigate to="/" replace />
  }

  return <>{children}</>
}