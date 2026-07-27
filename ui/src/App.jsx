import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import LandingPage from './pages/LandingPage'
import Inbox from './pages/Inbox'
import Login from './pages/Login'
import Analysis from './pages/Analysis'
import Analytics from './pages/Analytics'
import SystemMetrics from './pages/SystemMetrics'
import Settings from './pages/Settings'
import SqlAnalyzer from './pages/SqlAnalyzer'
import BlueprintExplorer from './pages/BlueprintExplorer'
import SignupWizard from './pages/SignupWizard'

// Protected Route Component to restrict access to authenticated compliance officers
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('cp_token');
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

function App() {
  return (
    <Router>
      <div className="App" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignupWizard />} />
          
          {/* Protected Dashboard Routes */}
          <Route path="/inbox" element={
            <ProtectedRoute>
              <Inbox />
            </ProtectedRoute>
          } />
          <Route path="/analysis" element={
            <ProtectedRoute>
              <Analysis />
            </ProtectedRoute>
          } />
          <Route path="/analytics" element={
            <ProtectedRoute>
              <Analytics />
            </ProtectedRoute>
          } />
          <Route path="/metrics" element={
            <ProtectedRoute>
              <SystemMetrics />
            </ProtectedRoute>
          } />
          <Route path="/settings" element={
            <ProtectedRoute>
              <Settings />
            </ProtectedRoute>
          } />
          <Route path="/sql-analyzer" element={
            <ProtectedRoute>
              <SqlAnalyzer />
            </ProtectedRoute>
          } />
          <Route path="/blueprint" element={
            <ProtectedRoute>
              <BlueprintExplorer />
            </ProtectedRoute>
          } />
          
          {/* Catch-all fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
