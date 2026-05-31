import { BrowserRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext.jsx'
import { useAuth } from './context/useAuth.js'
import Navbar from './components/Navbar.jsx'
import Footer from './components/Footer.jsx'
import HomePage from './pages/HomePage.jsx'
import AnimalsPage from './pages/AnimalsPage.jsx'
import TicketsPage from './pages/TicketsPage.jsx'
import AuthPage from './pages/AuthPage.jsx'
import './App.css'

const routerBaseName = import.meta.env.BASE_URL === '/'
  ? undefined
  : import.meta.env.BASE_URL.replace(/\/$/, '')

function ProtectedRoute({ children }) {
  const { user, initializing } = useAuth()
  const location = useLocation()

  if (initializing) {
    return <main className="page-shell"><div className="state-card">Checking your session...</div></main>
  }

  if (!user) {
    return <Navigate to="/signin" replace state={{ from: location.pathname }} />
  }

  return children
}

function AppRoutes() {
  return (
    <div className="app-frame">
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/animals" element={<AnimalsPage />} />
        <Route
          path="/tickets"
          element={(
            <ProtectedRoute>
              <TicketsPage />
            </ProtectedRoute>
          )}
        />
        <Route path="/signin" element={<AuthPage mode="signin" />} />
        <Route path="/register" element={<AuthPage mode="register" />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <Footer />
    </div>
  )
}

function App() {
  return (
    <BrowserRouter basename={routerBaseName}>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
