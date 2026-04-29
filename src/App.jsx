import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'sonner';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Countdown from './pages/Countdown';
import Result from './pages/Result';
import InfoPage from './pages/Info';
import Login from './pages/Login';
import './index.css';

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
        <Route path="/admin/*" element={<Dashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
