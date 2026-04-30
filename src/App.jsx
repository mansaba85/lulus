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
import { api } from './utils/api';
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
  React.useEffect(() => {
    const syncBranding = async () => {
      try {
        const settings = await api.getSettings();
        if (settings) {
          // Update Favicon & LocalStorage
          if (settings.school_logo) {
            localStorage.setItem('schoolLogo', settings.school_logo);
            let link = document.querySelector("link[rel~='icon']");
            if (!link) {
              link = document.createElement('link');
              link.rel = 'icon';
              document.getElementsByTagName('head')[0].appendChild(link);
            }
            link.href = settings.school_logo;
          }
          
          // Update Page Title & LocalStorage
          if (settings.school_name) {
            localStorage.setItem('schoolName', settings.school_name);
            document.title = `Kelulusan - ${settings.school_name}`;
          }
        }
      } catch (error) {
        console.error('Gagal sinkronisasi branding:', error);
      }
    };
    syncBranding();
  }, []);

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
