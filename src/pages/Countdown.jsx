import React, { useState, useEffect } from 'react';
import { User, Globe, Monitor, Instagram, Facebook, Youtube } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { api } from '../utils/api';
import logo from '../assets/logo.png';

const Countdown = () => {
  const navigate = useNavigate();
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [isTimeUp, setIsTimeUp] = useState(false);
  const [schoolName, setSchoolName] = useState('MA NU 01 Banyuputih');
  const [schoolLogo, setSchoolLogo] = useState(logo);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const settings = await api.getSettings();
        if (settings) {
          setSchoolName(settings.school_name);
          setSchoolLogo(settings.school_logo || logo);
          
          const targetDateStr = settings.release_date.split('T')[0];
          const targetTimeStr = settings.release_time.substring(0, 5);
          const targetDate = new Date(`${targetDateStr}T${targetTimeStr}:00+07:00`).getTime();

          const timer = setInterval(() => {
            const now = Date.now();
            const distance = targetDate - now;

            if (distance <= 0) {
              clearInterval(timer);
              setIsTimeUp(true);
              navigate('/');
              return;
            }

            setTimeLeft({
              days: Math.floor(distance / (1000 * 60 * 60 * 24)),
              hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
              minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
              seconds: Math.floor((distance % (1000 * 60)) / 1000)
            });
          }, 1000);

          return () => clearInterval(timer);
        }
      } catch (err) {
        console.error('Failed to fetch settings');
      }
    };
    fetchSettings();
  }, [navigate]);

  const TimerCard = ({ value, label }) => (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      gap: '0.5rem' 
    }}>
      <div className="timer-box" style={{ 
        backgroundColor: '#fff', 
        width: '85px', 
        height: '95px', 
        borderRadius: '16px', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        boxShadow: '0 10px 25px rgba(0,0,0,0.08)',
        border: '1px solid #eee'
      }}>
        <span style={{ fontSize: '2.5rem', fontWeight: '800', color: 'var(--primary-green)' }}>
          {value.toString().padStart(2, '0')}
        </span>
      </div>
      <span style={{ fontSize: '0.7rem', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
        {label}
      </span>
    </div>
  );

  return (
    <div className="home-container" style={{ display: 'flex', minHeight: '100vh' }}>
      <div className="content-side" style={{ 
        flex: 1, 
        padding: '2rem 4rem', 
        display: 'flex', 
        flexDirection: 'column',
        justifyContent: 'space-between',
        backgroundColor: '#fff'
      }}>
        <header className="mobile-header-sync" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div className="logo" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <img src={schoolLogo} alt="Logo" style={{ width: '45px', height: '45px', objectFit: 'contain' }} />
          </div>
          <nav style={{ display: 'flex', gap: '1.5rem', alignItems: 'center', fontWeight: '500' }}>
            <a href="/" style={{ color: 'var(--text-main)' }}>Home</a>
            <a href="/informasi" style={{ color: 'var(--text-main)' }}>Informasi</a>
            <a href="/admin" className="flex-center" style={{ color: 'var(--text-main)', fontSize: '1.2rem' }}>
              <User size={20} />
            </a>
          </nav>
        </header>

        <motion.main 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          style={{ textAlign: 'center', margin: 'auto', width: '100%' }}
        >
          <h2 className="countdown-title" style={{ fontSize: '2.5rem', fontWeight: '800', color: 'var(--text-main)', marginBottom: '2.5rem', textTransform: 'uppercase', letterSpacing: '1px', lineHeight: 1.2 }}>
            MENUJU<br />PENGUMUMAN<br />KELULUSAN
          </h2>
          
          <div className="timer-container" style={{ display: 'flex', gap: '1rem', justifyContent: 'center', width: '100%' }}>
            <TimerCard value={timeLeft.days} label="Hari" />
            <TimerCard value={timeLeft.hours} label="Jam" />
            <TimerCard value={timeLeft.minutes} label="Menit" />
            <TimerCard value={timeLeft.seconds} label="Detik" />
          </div>
        </motion.main>

        <footer className="mobile-footer-sync" style={{ 
          display: 'flex', 
          flexDirection: 'column',
          alignItems: 'center',
          gap: '1rem',
          marginTop: '2rem',
          paddingBottom: '2rem'
        }}>
          <div className="socials" style={{ display: 'flex', gap: '1.25rem', marginBottom: '0.5rem' }}>
            <a href="#" style={{ color: '#94a3b8' }}><Instagram size={22} /></a>
            <a href="#" style={{ color: '#94a3b8' }}><Facebook size={22} /></a>
            <a href="#" style={{ color: '#94a3b8' }}><Youtube size={22} /></a>
          </div>
          <p style={{ fontSize: '0.7rem', color: '#94a3b8', textAlign: 'center', textTransform: 'uppercase', letterSpacing: '1px' }}>
            © 2026 - {schoolName}<br />ALL RIGHT RESERVED
          </p>
        </footer>
      </div>

      <div className="illustration-side" style={{ 
        flex: 1, 
        backgroundColor: '#f0f9f4',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <img src="/hero-bg.png" alt="Graduation" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      </div>
      
      <style>{`
        @media (max-width: 1024px) {
          .home-container { flex-direction: column !important; }
          .illustration-side { display: none !important; }
          .content-side { min-height: 100vh !important; padding: 2rem !important; }
        }
        @media (max-width: 640px) {
          .content-side { padding: 1.5rem !important; }
          .mobile-header-sync { 
            margin-bottom: 2.5rem !important; 
            flex-direction: row !important; 
            flex-wrap: nowrap !important;
            justify-content: space-between !important; 
            align-items: center !important; 
            gap: 0.5rem !important; 
          }
          nav { gap: 0.85rem !important; font-size: 0.85rem !important; }
          nav a { white-space: nowrap !important; }
          .countdown-title { fontSize: 1.5rem !important; margin-bottom: 2rem !important; }
          .timer-container { gap: 0.4rem !important; }
          .timer-box { width: 68px !important; height: 78px !important; }
          .timer-box span { fontSize: 1.8rem !important; }
          .mobile-footer-sync { margin-top: 2rem !important; }
        }
      `}</style>
    </div>
  );
};

export default Countdown;
