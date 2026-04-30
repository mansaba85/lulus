import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Lock, User, Eye, EyeOff, ArrowRight, ShieldCheck } from 'lucide-react';
import { toast } from 'sonner';
import { api } from '../utils/api';
import logo from '../assets/logo.png';

const Login = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);

  const [schoolName, setSchoolName] = useState(localStorage.getItem('schoolName') || 'MA NU 01 BANYUPUTIH');
  const [schoolLogo, setSchoolLogo] = useState(localStorage.getItem('schoolLogo') || logo);

  React.useEffect(() => {
    const syncBranding = async () => {
      try {
        const settings = await api.getSettings();
        if (settings) {
          if (settings.school_name) setSchoolName(settings.school_name);
          if (settings.school_logo) setSchoolLogo(settings.school_logo);
        }
      } catch (e) { console.error(e); }
    };
    syncBranding();
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await api.login(formData);
      if (response.success) {
        localStorage.setItem('isAdminAuthenticated', 'true');
        localStorage.setItem('adminToken', response.token); // Simpan Tiket Masuk (Token)
        toast.success('Login Berhasil! Selamat datang Admin.');
        navigate('/admin');
      } else {
        toast.error(response.message || 'Username atau Password salah!');
        setIsLoading(false);
      }
    } catch (err) {
      toast.error('Terjadi kesalahan pada server');
      setIsLoading(false);
    }
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center', 
      backgroundColor: '#f8fafc',
      fontFamily: "'Plus Jakarta Sans', sans-serif",
      padding: '1.5rem'
    }}>
      {/* Background Decor */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '40vh', background: 'var(--sidebar-bg)', borderRadius: '0 0 50% 50% / 0 0 20% 20%', zIndex: 0 }}></div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ 
          width: '100%', 
          maxWidth: '450px', 
          backgroundColor: 'white', 
          borderRadius: '32px', 
          boxShadow: '0 25px 50px -12px rgba(0,0,0,0.15)', 
          padding: '3rem',
          position: 'relative',
          zIndex: 1
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <div style={{ 
            width: '80px', 
            height: '80px', 
            backgroundColor: '#f1f5f9', 
            borderRadius: '24px', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            margin: '0 auto 1.5rem',
            padding: '10px'
          }}>
            <img src={schoolLogo} alt="Logo" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
          </div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: '800', color: '#1e293b', marginBottom: '0.5rem' }}>Admin Portal</h2>
          <p style={{ color: '#64748b', fontSize: '0.9rem' }}>Silakan masuk untuk mengelola data kelulusan<br/><b>{schoolName}</b></p>
        </div>

        <form onSubmit={handleLogin} style={{ display: 'grid', gap: '1.5rem' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.8rem', fontWeight: '700', color: '#64748b' }}>Username</label>
            <div style={{ position: 'relative' }}>
              <User size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
              <input 
                type="text" 
                required
                value={formData.username}
                onChange={(e) => setFormData({...formData, username: e.target.value})}
                placeholder="Masukkan username..." 
                style={{ width: '100%', padding: '1rem 1rem 1rem 3rem', borderRadius: '14px', border: '2px solid #f1f5f9', outline: 'none', fontSize: '0.95rem' }} 
              />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.8rem', fontWeight: '700', color: '#64748b' }}>Password</label>
            <div style={{ position: 'relative' }}>
              <Lock size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
              <input 
                type={showPassword ? 'text' : 'password'} 
                required
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                placeholder="Masukkan password..." 
                style={{ width: '100%', padding: '1rem 3rem 1rem 3rem', borderRadius: '14px', border: '2px solid #f1f5f9', outline: 'none', fontSize: '0.95rem' }} 
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button 
            type="submit" 
            disabled={isLoading}
            style={{ 
              marginTop: '1rem',
              padding: '1.25rem', 
              backgroundColor: 'var(--primary-green)', 
              color: 'white', 
              borderRadius: '16px', 
              fontWeight: '800', 
              fontSize: '1rem',
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              gap: '0.75rem', 
              border: 'none', 
              cursor: isLoading ? 'not-allowed' : 'pointer',
              boxShadow: '0 15px 30px rgba(15,81,50,0.2)',
              transition: 'all 0.3s ease'
            }}
          >
            {isLoading ? 'Memproses...' : (
              <>Masuk Sekarang <ArrowRight size={20} /></>
            )}
          </button>
        </form>

        <div style={{ marginTop: '2.5rem', textAlign: 'center', borderTop: '1px solid #f1f5f9', paddingTop: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', color: '#94a3b8', fontSize: '0.8rem' }}>
            <ShieldCheck size={16} />
            Sistem Keamanan Terenkripsi
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
