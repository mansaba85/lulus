import React from 'react';
import { motion } from 'framer-motion';
import { Info, Heart, Ban, ShieldAlert, ArrowLeft, GraduationCap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/logo.png';

const InfoCard = ({ icon, title, content, color, bgColor }) => (
  <motion.div 
    whileHover={{ y: -5 }}
    style={{ 
      backgroundColor: 'white', 
      borderRadius: '24px', 
      padding: '2rem', 
      boxShadow: '0 10px 30px rgba(0,0,0,0.03)', 
      border: '1px solid #f1f5f9',
      display: 'flex',
      flexDirection: 'column',
      gap: '1.25rem'
    }}
  >
    <div style={{ 
      width: '56px', 
      height: '56px', 
      backgroundColor: bgColor, 
      color: color, 
      borderRadius: '16px', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center' 
    }}>
      {icon}
    </div>
    <div>
      <h3 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#1e293b', marginBottom: '0.5rem' }}>{title}</h3>
      <div style={{ color: '#64748b', fontSize: '0.95rem', lineHeight: 1.6 }}>
        {content}
      </div>
    </div>
  </motion.div>
);

const InfoPage = () => {
  const navigate = useNavigate();
  const schoolName = localStorage.getItem('schoolName') || 'MA NU 01 BANYUPUTIH';
  const schoolLogo = localStorage.getItem('schoolLogo') || logo;

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f8fafc', padding: '2rem', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Header */}
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <img src={schoolLogo} alt="Logo" style={{ width: '50px', height: '50px', objectFit: 'contain' }} />
            <h1 style={{ fontSize: '1.5rem', fontWeight: '800', color: 'var(--primary-green)' }}>PORTAL KELULUSAN</h1>
          </div>
          <button 
            onClick={() => navigate(-1)}
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.5rem', backgroundColor: 'white', borderRadius: '12px', border: '1px solid #e2e8f0', color: '#64748b', fontWeight: '700', cursor: 'pointer' }}
          >
            <ArrowLeft size={20} /> Kembali
          </button>
        </header>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ textAlign: 'center', marginBottom: '4rem' }}
        >
          <h2 style={{ fontSize: '2.5rem', fontWeight: '800', color: '#1e293b', marginBottom: '1rem' }}>Informasi & Panduan Kelulusan</h2>
          <p style={{ fontSize: '1.1rem', color: '#64748b', maxWidth: '700px', margin: '0 auto' }}>Harap perhatikan seluruh informasi di bawah ini demi kelancaran dan kekhidmatan proses kelulusan {schoolName}.</p>
        </motion.div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
          <InfoCard 
            icon={<Info size={28} />}
            title="Cara Cek Hasil"
            bgColor="#dcfce7"
            color="#166534"
            content={
              <ul style={{ paddingLeft: '1.25rem', display: 'grid', gap: '0.5rem' }}>
                <li>Gunakan Token unik yang dibagikan oleh Wali Kelas.</li>
                <li>Masukkan Token di kotak pencarian halaman utama.</li>
                <li>Hasil kelulusan hanya muncul jika Token yang dimasukkan valid.</li>
              </ul>
            }
          />

          <InfoCard 
            icon={<Heart size={28} />}
            title="Imbauan Sekolah"
            bgColor="#eff6ff"
            color="#1e40af"
            content={
              <ul style={{ paddingLeft: '1.25rem', display: 'grid', gap: '0.5rem' }}>
                <li>Rayakan kelulusan dengan sujud syukur dan doa bersama keluarga.</li>
                <li>Seragam yang masih layak harap dikumpulkan untuk disumbangkan.</li>
                <li>Jaga nama baik sekolah di lingkungan masyarakat.</li>
              </ul>
            }
          />

          <InfoCard 
            icon={<Ban size={28} />}
            title="Larangan Keras"
            bgColor="#fef2f2"
            color="#991b1b"
            content={
              <ul style={{ paddingLeft: '1.25rem', display: 'grid', gap: '0.5rem' }}>
                <li>Dilarang melakukan aksi konvoi dan coret-coret seragam.</li>
                <li>Dilarang melakukan perayaan berlebihan di tempat umum.</li>
                <li>Segala bentuk anarkisme akan ditindak tegas oleh pihak berwajib.</li>
              </ul>
            }
          />

          <InfoCard 
            icon={<ShieldAlert size={28} />}
            title="Layanan Bantuan"
            bgColor="#fff7ed"
            color="#9a3412"
            content={
              <ul style={{ paddingLeft: '1.25rem', display: 'grid', gap: '0.5rem' }}>
                <li>Jika lupa Token, silakan hubungi Wali Kelas masing-masing.</li>
                <li>Kendala teknis portal dapat dilaporkan ke tim IT Sekolah.</li>
                <li>Pastikan koneksi internet stabil saat melakukan pengecekan.</li>
              </ul>
            }
          />
        </div>

        <footer style={{ marginTop: '5rem', padding: '3rem', backgroundColor: 'var(--primary-green)', borderRadius: '32px', color: 'white', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'relative', zIndex: 1 }}>
            <div style={{ width: '64px', height: '64px', backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
              <GraduationCap size={32} />
            </div>
            <h3 style={{ fontSize: '1.5rem', fontWeight: '800', marginBottom: '1rem' }}>Selamat Atas Kelulusan Anda!</h3>
            <p style={{ opacity: 0.9, maxWidth: '600px', margin: '0 auto' }}>Semoga ilmu yang didapat bermanfaat dan menjadi bekal kesuksesan di masa depan. Tetaplah menjadi pribadi yang berakhlak mulia.</p>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default InfoPage;
