import React, { useState, useEffect } from 'react';
import { User, Globe, Monitor } from 'lucide-react';
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
      <div style={{ 
        backgroundColor: '#fff', 
        width: '100px', 
        height: '110px', 
        borderRadius: '16px', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        boxShadow: '0 10px 25px rgba(0,0,0,0.08)',
        border: '1px solid #eee'
      }}>
        <span style={{ fontSize: '3rem', fontWeight: '800', color: 'var(--primary-green)' }}>
          {value.toString().padStart(2, '0')}
        </span>
      </div>
      <span style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
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
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div className="logo">
            <img src={schoolLogo} alt="Logo" style={{ width: '50px', height: '50px', objectFit: 'contain' }} />
          </div>
          <nav style={{ display: 'flex', gap: '2rem', alignItems: 'center', fontWeight: '500' }}>
            <a href="/" style={{ color: 'var(--text-main)' }}>Home</a>
            <a href="/informasi" style={{ color: 'var(--primary-green)' }}>Informasi</a>
            <a href="/admin" className="flex-center">
              <User size={20} />
            </a>
          </nav>
        </header>

        <motion.main 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          style={{ textAlign: 'center', margin: 'auto' }}
        >
          <h2 style={{ fontSize: '2rem', fontWeight: '800', color: 'var(--text-main)', marginBottom: '3rem', textTransform: 'uppercase', letterSpacing: '1px' }}>
            MENUJU<br />PENGUMUMAN<br />KELULUSAN
          </h2>
          
          <div style={{ display: 'flex', gap: '1.5rem', justifyContent: 'center' }}>
            <TimerCard value={timeLeft.days} label="Hari" />
            <TimerCard value={timeLeft.hours} label="Jam" />
            <TimerCard value={timeLeft.minutes} label="Menit" />
            <TimerCard value={timeLeft.seconds} label="Detik" />
          </div>
        </motion.main>

        <footer style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div className="socials" style={{ display: 'flex', gap: '1rem' }}>
            <a href="#" className="flex-center" style={{ width: '32px', height: '32px', borderRadius: '50%', border: '1px solid #ddd' }}>
              <Globe size={16} />
            </a>
            <a href="#" className="flex-center" style={{ width: '32px', height: '32px', borderRadius: '50%', border: '1px solid #ddd' }}>
              <Monitor size={16} />
            </a>
          </div>
          <p style={{ fontSize: '0.75rem', color: '#aaa', textAlign: 'right', textTransform: 'uppercase' }}>
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
      `}</style>
    </div>
  );
};

export default Countdown;
