import { Routes, Route } from 'react-router-dom'
import { Navbar } from './components/ui/Navbar'
import { ProtectedRoute } from './components/ui/ProtectedRoute'
import { LandingPage } from './pages/LandingPage'
import { AssessmentPage } from './pages/AssessmentPage'
import { ResultsPage } from './pages/ResultsPage'
import { MenteeLoginPage } from './pages/MenteeLoginPage'
import { MentorLoginPage } from './pages/MentorLoginPage'
import { MenteeDashboard } from './pages/MenteeDashboard'
import { MentorDashboard } from './pages/MentorDashboard'

export default function App() {
  return (
    <div className="min-h-screen bg-bg">
      <Navbar />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/assess" element={<AssessmentPage />} />
        <Route path="/results/:token" element={<ResultsPage />} />
        <Route path="/login" element={<MenteeLoginPage />} />
        <Route path="/mentor/login" element={<MentorLoginPage />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute role="mentee">
              <MenteeDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/mentor"
          element={
            <ProtectedRoute role="mentor">
              <MentorDashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
    </div>
  )
}