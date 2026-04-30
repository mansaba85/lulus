import React, { useState, useEffect } from 'react';
import { Search, User, Globe, Monitor, Smartphone } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import illustration from '../assets/illustration.png';
import { api } from '../utils/api';
import logo from '../assets/logo.png';

const Home = () => {
  const navigate = useNavigate();
  const [schoolName, setSchoolName] = useState('MA NU 01 BANYUPUTIH');
  const [schoolLogo, setSchoolLogo] = useState(logo);
  const [token, setToken] = useState('');

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const settings = await api.getSettings();
        if (settings) {
          setSchoolName(settings.school_name);
          setSchoolLogo(settings.school_logo || logo);
          
          // Robust Date Parsing
          const releaseDate = settings.release_date.split('T')[0]; // YYYY-MM-DD
          const releaseTime = settings.release_time; // HH:mm:ss
          
          const [year, month, day] = releaseDate.split('-').map(Number);
          const [hour, minute, second] = releaseTime.split(':').map(Number);
          
          const targetDate = new Date(year, month - 1, day, hour, minute, second || 0).getTime();
          const now = Date.now();
          
          console.log('⏰ Target:', new Date(targetDate).toLocaleString());
          console.log('⌚ Sekarang:', new Date(now).toLocaleString());
          
          if (now < targetDate) {
            console.log('⏳ Belum waktunya, pindah ke Countdown...');
            navigate('/countdown');
          }
        }
      } catch (err) {
        console.error('Failed to fetch settings');
      }
    };
    fetchSettings();
  }, [navigate]);

  const handleSearch = async () => {
    if (!token.trim()) {
      toast.error('Masukkan token Anda!');
      return;
    }

    try {
      const student = await api.searchStudent(token);
      if (student) {
        navigate('/result', { state: { student } });
      } else {
        toast.error('Token tidak ditemukan atau salah!');
      }
    } catch (err) {
      toast.error('Terjadi kesalahan saat mencari data');
    }
  };

  return (
    <div className="home-container" style={{ display: 'flex', minHeight: '100vh' }}>
      {/* Left Side: Content */}
      <div className="content-side" style={{ 
        flex: 1, 
        padding: '2rem 4rem', 
        display: 'flex', 
        flexDirection: 'column',
        justifyContent: 'space-between',
        backgroundColor: '#fff'
      }}>
        {/* Header */}
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div className="logo" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <img src={schoolLogo} alt="Logo" style={{ width: '50px', height: '50px', objectFit: 'contain' }} />
          </div>
          <nav style={{ display: 'flex', gap: '2rem', alignItems: 'center', fontWeight: '500' }}>
            <a href="/" style={{ color: 'var(--primary-green)' }}>Home</a>
            <a href="/informasi" style={{ color: 'var(--text-main)' }}>Informasi</a>
            <a href="/admin" className="flex-center" style={{ 
              color: 'var(--text-main)', 
              fontSize: '1.2rem'
            }}>
              <User size={20} />
            </a>
          </nav>
        </header>

        {/* Hero Section */}
        <motion.main 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          style={{ maxWidth: '500px' }}
        >
          <h2 style={{ fontSize: '1.5rem', fontWeight: '600', color: 'var(--text-main)', marginBottom: '0.5rem' }}>
            PENGUMUMAN KELULUSAN
          </h2>
          <h1 style={{ fontSize: '3rem', fontWeight: '800', color: 'var(--primary-green)', lineHeight: 1.1, marginBottom: '1rem' }}>
            {schoolName}
          </h1>
          <p style={{ fontSize: '1.25rem', fontWeight: '500', color: 'var(--text-muted)', fontStyle: 'italic', marginBottom: '3rem' }}>
            TAHUN PELAJARAN 2025/2026
          </p>

          <div className="search-box" style={{ 
            display: 'flex', 
            alignItems: 'center', 
            boxShadow: '0 10px 30px rgba(0,0,0,0.08)',
            borderRadius: '50px',
            overflow: 'hidden',
            border: '1px solid #eee',
            width: '100%',
            maxWidth: '450px'
          }}>
            <input 
              type="text" 
              value={token}
              onChange={(e) => setToken(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              placeholder="Masukkan Token Disini..." 
              style={{ 
                flex: 1, 
                padding: '1.25rem 2rem', 
                border: 'none', 
                fontSize: '1rem',
                color: 'var(--text-main)',
                textTransform: 'uppercase'
              }}
            />
            <button 
              onClick={handleSearch}
              style={{ 
                backgroundColor: 'var(--accent-maroon)', 
                color: 'white', 
                padding: '1.25rem 2.5rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                fontWeight: '700',
                fontSize: '1rem',
                letterSpacing: '1px',
                border: 'none',
                cursor: 'pointer'
              }}
            >
              CARI <Search size={20} />
            </button>
          </div>
        </motion.main>

        {/* Footer */}
        <footer style={{ 
          display: 'flex', 
          flexDirection: 'column',
          alignItems: 'center',
          gap: '1rem',
          marginTop: '3rem',
          paddingBottom: '2rem'
        }}>
          <div className="socials" style={{ display: 'flex', gap: '1.5rem', marginBottom: '0.5rem' }}>
            <a href="#" style={{ color: '#94a3b8' }}><Globe size={24} /></a>
            <a href="#" style={{ color: '#94a3b8' }}><Monitor size={24} /></a>
            <a href="#" style={{ color: '#94a3b8' }}><Smartphone size={24} /></a>
          </div>
          <p style={{ fontSize: '0.75rem', color: '#94a3b8', textAlign: 'center', textTransform: 'uppercase', letterSpacing: '1px' }}>
            © 2026 - {schoolName}<br />ALL RIGHT RESERVED
          </p>
        </footer>
      </div>

      {/* Right Side: Illustration */}
      <div className="illustration-side" style={{ 
        flex: 1, 
        backgroundColor: '#f0f9f4',
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <motion.img 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.2 }}
          src="/hero-bg.png" 
          alt="Graduation" 
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      </div>

      {/* Responsive adjustments (Media Queries in index.css would be better, but for now inline styles or simple JS) */}
      <style>{`
        @media (max-width: 1024px) {
          .home-container { flex-direction: column !important; }
          .illustration-side { display: none !important; }
          .content-side { min-height: 100vh !important; padding: 2rem !important; }
        }
        @media (max-width: 640px) {
          .content-side { padding: 1.5rem !important; gap: 2rem !important; }
          header { 
            margin-bottom: 2.5rem !important; 
            display: flex !important;
            flex-direction: row !important; 
            flex-wrap: nowrap !important;
            justify-content: space-between !important; 
            align-items: center !important; 
            gap: 0.5rem !important; 
          }
          nav { 
            gap: 0.85rem !important; 
            width: auto !important; 
            flex-shrink: 0 !important;
            justify-content: flex-end !important; 
            font-size: 0.85rem !important; 
          }
          nav a { white-space: nowrap !important; }
          h1 { fontSize: 2.1rem !important; }
          h2 { fontSize: 1rem !important; }
          p { fontSize: 0.95rem !important; margin-bottom: 1.5rem !important; }
          .search-box { border-radius: 16px !important; flex-direction: column !important; background: transparent !important; box-shadow: none !important; border: none !important; gap: 0.75rem !important; }
          .search-box input { width: 100% !important; border-radius: 12px !important; border: 1px solid #ddd !important; padding: 1rem !important; }
          .search-box button { width: 100% !important; border-radius: 12px !important; justify-content: center !important; padding: 1rem !important; }
          footer { 
            flex-direction: column !important; 
            gap: 1.5rem !important; 
            align-items: center !important; 
            text-align: center !important;
          }
          footer p { text-align: center !important; }
        }
      `}</style>
    </div>
  );
};

export default Home;
