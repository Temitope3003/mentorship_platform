import { Routes, Route, useLocation } from 'react-router-dom'
import { Navbar } from './components/ui/Navbar'
import { ProtectedRoute } from './components/ui/ProtectedRoute'
import { LandingPage } from './pages/LandingPage'
import { AssessmentPage } from './pages/AssessmentPage'
import { ResultsPage } from './pages/ResultsPage'
import { MenteeLoginPage } from './pages/MenteeLoginPage'
import { MentorLoginPage } from './pages/MentorLoginPage'
import { MentorRegisterPage } from './pages/MentorRegisterPage'
import { MenteeDashboard } from './pages/MenteeDashboard'
import { MentorDashboard } from './pages/MentorDashboard'
import { DomainPage } from './pages/DomainPage'
import { CareerDomainsPage } from './pages/CareerDomainsPage'
import { LiaisonLoginPage } from './pages/LiaisonLoginPage'
import { LiaisonDashboard } from './pages/LiaisonDashboard'

// Pages that have their own built-in navigation
const NO_NAVBAR_ROUTES = ['/', '/liaison/dashboard']

export default function App() {
  const location = useLocation()
  const showNavbar = !NO_NAVBAR_ROUTES.includes(location.pathname)

  return (
    <div style={{ minHeight: '100vh' }}>
      {showNavbar && <Navbar />}
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/assess" element={<AssessmentPage />} />
        <Route path="/results/:token" element={<ResultsPage />} />
        <Route path="/login" element={<MenteeLoginPage />} />
        <Route path="/mentor/login" element={<MentorLoginPage />} />
        <Route path="/mentor/register" element={<MentorRegisterPage />} />
        <Route path="/domains" element={<CareerDomainsPage />} />
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