import { useState, useEffect } from 'react'
import styles from './App.module.css'
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import LeftSection from './components/LeftSection.jsx'
import Login from './components/Login.jsx'
import Register from './components/Register.jsx'
import Dashboard from './components/Dashboard.jsx'
import { Toaster } from 'react-hot-toast'
import PublicPage from './components/PublicPage.jsx'
import API from './services/api.js'

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    const checkTokenValidity = async () => {
      const token = localStorage.getItem('token')
      if (token) {
        try {
          await API.get('/api/user/verify', {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
          setIsAuthenticated(true)
        } catch (error) {
          console.error('Failed to verify token', error)
          localStorage.removeItem('token')
          setIsAuthenticated(false)
        }
      } else {
        setIsAuthenticated(false)
      }
    }

    checkTokenValidity()
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('token')
    setIsAuthenticated(false)
  }

  return (
    <Router>
      <AppContent isAuthenticated={isAuthenticated} setIsAuthenticated={setIsAuthenticated} handleLogout={handleLogout} />
    </Router>
  )
}

function AppContent({ isAuthenticated, setIsAuthenticated, handleLogout }) {
  const location = useLocation()
  const isAuthPage = ['/login', '/register'].includes(location.pathname)

  return (
    <div className={`${styles.container} ${isAuthPage ? styles.authLayout : styles.dashboardLayout}`}>
      {isAuthPage && <LeftSection className="leftSection" />}
      <Routes>
        <Route
          path="/"
          element={
            isAuthenticated ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route path="/login" element={<Login setIsAuthenticated={setIsAuthenticated} />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/dashboard/*"
          element={isAuthenticated ? <Dashboard handleLogout={handleLogout} /> : <Navigate to="/login" replace />}
        />
        <Route path="/public/:shareId" element={<PublicPage />} />
      </Routes>
      <Toaster position="top-right" />
    </div>
  )
}

export default App
