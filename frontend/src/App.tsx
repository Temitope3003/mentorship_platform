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
import { DomainPage } from './pages/DomainPage'
import { LiaisonLoginPage } from './pages/LiaisonLoginPage'
import { LiaisonDashboard } from './pages/LiaisonDashboard'

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
        <Route path="/domain/:domainId" element={<DomainPage />} />
        <Route path="/liaison/login" element={<LiaisonLoginPage />} />
        <Route path="/liaison/dashboard" element={<LiaisonDashboard />} />
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