import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'sonner';
import { Navigate } from 'react-router-dom';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Countdown from './pages/Countdown';
import Result from './pages/Result';
import InfoPage from './pages/Info';
import Login from './pages/Login';
import './index.css';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem('isAdminAuthenticated') === 'true';
  const hasToken = !!localStorage.getItem('adminToken');
  
  if (!isAuthenticated || !hasToken) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

function App() {
  return (
    <Router>
      <Toaster position="top-right" richColors />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/countdown" element={<Countdown />} />
        <Route path="/informasi" element={<InfoPage />} />
        <Route path="/result" element={<Result />} />
        <Route path="/login" element={<Login />} />
        <Route 
          path="/admin/*" 
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } 
        />
      </Routes>
    </Router>
  );
}

export default App;
