import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Printer, Download, ArrowLeft, CheckCircle, XCircle, Award } from 'lucide-react';
import confetti from 'canvas-confetti';
import { api } from '../utils/api';
import logo from '../assets/logo.png';

const Result = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const student = location.state?.student;
  const [schoolLogo, setSchoolLogo] = React.useState(logo);
  const [schoolName, setSchoolName] = React.useState('MA NU 01 BANYUPUTIH');

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const settings = await api.getSettings();
        if (settings) {
          setSchoolName(settings.school_name);
          setSchoolLogo(settings.school_logo || logo);
        }
      } catch (err) {
        console.error('Failed to fetch settings');
      }
    };
    fetchSettings();
  }, []);

  useEffect(() => {
    if (!student) {
      navigate('/');
      return;
    }

    if (student.status === 'LULUS') {
      const duration = 3 * 1000;
      const animationEnd = Date.now() + duration;
      const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

      const randomInRange = (min, max) => Math.random() * (max - min) + min;

      const interval = setInterval(function() {
        const timeLeft = animationEnd - Date.now();

        if (timeLeft <= 0) {
          return clearInterval(interval);
        }

        const particleCount = 50 * (timeLeft / duration);
        confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
        confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
      }, 250);

      return () => clearInterval(interval);
    }
  }, [student, navigate]);

  if (!student) return null;

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f0fdf4', padding: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Inter', sans-serif" }}>
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        style={{ width: '100%', maxWidth: '800px', backgroundColor: 'white', borderRadius: '32px', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.15)', overflow: 'hidden' }}
      >
        {/* Header Decor */}
        <div style={{ height: '12px', background: student.status === 'LULUS' ? 'linear-gradient(90deg, #22c55e, #16a34a)' : 'linear-gradient(90deg, #ef4444, #dc2626)' }}></div>

        <div className="result-card-inner" style={{ padding: '3rem' }}>
          {/* School Header */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '3rem', borderBottom: '2px solid #f1f5f9', paddingBottom: '2rem' }}>
            <img src={schoolLogo} alt="Logo" style={{ width: '80px', height: '80px', objectFit: 'contain' }} />
            <div>
              <h2 style={{ fontSize: '1.5rem', fontWeight: '800', color: '#1e293b' }}>{schoolName}</h2>
              <p style={{ color: '#64748b', fontWeight: '500' }}>Sistem Informasi Kelulusan Digital</p>
            </div>
          </div>

          <div className="result-grid" style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '3rem' }}>
            {/* Student Info */}
            <div>
              <p style={{ fontSize: '0.75rem', fontWeight: '800', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '1.5rem' }}>Informasi Siswa</p>
              
              <div style={{ display: 'grid', gap: '1.25rem' }}>
                <div>
                  <label style={{ fontSize: '0.8rem', color: '#64748b' }}>Nama Lengkap</label>
                  <p style={{ fontSize: '1.25rem', fontWeight: '700', color: '#1e293b' }}>{student.name}</p>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div>
                    <label style={{ fontSize: '0.8rem', color: '#64748b' }}>NIS / NISN</label>
                    <p style={{ fontSize: '1.1rem', fontWeight: '700', color: '#1e293b' }}>{student.nis}</p>
                  </div>
                  <div>
                    <label style={{ fontSize: '0.8rem', color: '#64748b' }}>Kelas</label>
                    <p style={{ fontSize: '1.1rem', fontWeight: '700', color: '#1e293b' }}>{student.class_name || student.class}</p>
                  </div>
                </div>
              </div>

              <div style={{ marginTop: '3rem', display: 'flex', gap: '1rem' }}>
                {student.status === 'LULUS' && (
                  <button 
                    onClick={() => window.print()}
                    style={{ flex: 1, padding: '1rem', backgroundColor: 'var(--primary-green)', color: 'white', borderRadius: '14px', fontWeight: '700', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', boxShadow: '0 10px 20px rgba(15,81,50,0.15)' }}
                  >
                    <Printer size={20} /> Cetak SKL
                  </button>
                )}
                <button 
                  onClick={() => navigate('/')}
                  style={{ padding: '1rem', backgroundColor: '#f1f5f9', color: '#64748b', borderRadius: '14px', fontWeight: '700', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                >
                  <ArrowLeft size={20} />
                </button>
              </div>
            </div>

            {/* Status Card */}
            <div style={{ 
              backgroundColor: student.status === 'LULUS' ? '#f0fdf4' : '#fef2f2', 
              borderRadius: '24px', 
              padding: '2.5rem', 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center', 
              justifyContent: 'center',
              border: `2px solid ${student.status === 'LULUS' ? '#bbf7d0' : '#fecaca'}`,
              textAlign: 'center'
            }}>
              {student.status === 'LULUS' ? (
                <>
                  <div style={{ color: '#22c55e', marginBottom: '1.5rem' }}><Award size={80} /></div>
                  <h3 style={{ fontSize: '1.5rem', fontWeight: '800', color: '#166534', marginBottom: '0.5rem' }}>SELAMAT!</h3>
                  <p style={{ color: '#15803d', fontWeight: '600' }}>Anda Dinyatakan</p>
                  <div style={{ backgroundColor: '#22c55e', color: 'white', padding: '0.5rem 2rem', borderRadius: '50px', fontSize: '1.5rem', fontWeight: '900', marginTop: '1rem', boxShadow: '0 10px 20px rgba(34,197,94,0.3)' }}>LULUS</div>
                </>
              ) : (
                <>
                  <div style={{ color: '#ef4444', marginBottom: '1.5rem' }}><XCircle size={80} /></div>
                  <h3 style={{ fontSize: '1.5rem', fontWeight: '800', color: '#991b1b', marginBottom: '1rem' }}>MAAF</h3>
                  <p style={{ color: '#64748b', fontSize: '1.1rem', fontWeight: '600' }}>Silakan hubungi wali kelas</p>
                </>
              )}
            </div>
          </div>
        </div>

        <div style={{ padding: '1.5rem', backgroundColor: '#f8fafc', borderTop: '1px solid #f1f5f9', textAlign: 'center' }}>
          <p style={{ fontSize: '0.8rem', color: '#94a3b8' }}>ID Transaksi: {Math.random().toString(36).substring(2, 15).toUpperCase()} • {new Date().toLocaleString('id-ID')}</p>
        </div>
      </motion.div>

      <style>{`
        @media (max-width: 768px) {
          .result-grid {
            grid-template-columns: 1fr !important;
            gap: 2rem !important;
          }
          .result-card-inner {
            padding: 1.5rem !important;
          }
          .result-card-inner > div:first-child {
            flex-direction: column !important;
            align-items: flex-start !important;
            gap: 1rem !important;
            text-align: left !important;
          }
          .result-card-inner > div:first-child img {
            width: 60px !important;
            height: 60px !important;
          }
        }
        @media print {
          body * { visibility: hidden; }
          #print-section, #print-section * { visibility: visible; }
          #print-section { position: absolute; left: 0; top: 0; width: 100%; }
        }
      `}</style>
    </div>
  );
};

export default Result;
