import React from 'react';
import { motion } from 'framer-motion';
import { Info, AlertCircle, Ban, Heart, ShieldAlert, GraduationCap } from 'lucide-react';

const InfoCard = ({ icon, title, content, color, bgColor }) => (
  <div style={{ 
    backgroundColor: 'white', 
    borderRadius: '24px', 
    padding: '2rem', 
    boxShadow: '0 10px 30px rgba(0,0,0,0.03)', 
    border: '1px solid #f1f5f9',
    display: 'flex',
    flexDirection: 'column',
    gap: '1.25rem'
  }}>
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
  </div>
);

const InfoManager = () => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      <header style={{ marginBottom: '3rem' }}>
        <h1 style={{ fontSize: '2.25rem', fontWeight: '800', color: 'var(--primary-green)', marginBottom: '0.5rem' }}>Pusat Informasi Kelulusan</h1>
        <p style={{ color: '#64748b', fontSize: '1.1rem' }}>Panduan, imbauan, dan larangan resmi terkait pelaksanaan kelulusan siswa.</p>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '2rem' }}>
        {/* Pengumuman Resmi */}
        <InfoCard 
          icon={<Info size={28} />}
          title="Pengumuman Resmi"
          bgColor="#dcfce7"
          color="#166534"
          content={
            <ul style={{ paddingLeft: '1.25rem', display: 'grid', gap: '0.5rem' }}>
              <li>Pengumuman akan dilaksanakan secara daring/online melalui portal ini.</li>
              <li>Siswa diwajibkan menggunakan Token unik yang telah dibagikan oleh Wali Kelas.</li>
              <li>Hasil kelulusan dapat diakses sesuai jadwal yang telah ditentukan di pengaturan sistem.</li>
            </ul>
          }
        />

        {/* Imbauan Sekolah */}
        <InfoCard 
          icon={<Heart size={28} />}
          title="Imbauan Positif"
          bgColor="#eff6ff"
          color="#1e40af"
          content={
            <ul style={{ paddingLeft: '1.25rem', display: 'grid', gap: '0.5rem' }}>
              <li>Rayakan kelulusan dengan penuh rasa syukur dan doa bersama keluarga di rumah.</li>
              <li>Donasikan seragam sekolah yang masih layak pakai kepada adik kelas atau pihak yang membutuhkan.</li>
              <li>Fokus pada persiapan jenjang pendidikan selanjutnya (Kuliah/Kerja).</li>
            </ul>
          }
        />

        {/* Larangan Keras */}
        <InfoCard 
          icon={<Ban size={28} />}
          title="Larangan Keras"
          bgColor="#fef2f2"
          color="#991b1b"
          content={
            <ul style={{ paddingLeft: '1.25rem', display: 'grid', gap: '0.5rem' }}>
              <li>Dilarang keras melakukan konvoi kendaraan bermotor yang mengganggu ketertiban umum.</li>
              <li>Dilarang melakukan aksi coret-coret seragam maupun fasilitas umum.</li>
              <li>Dilarang melakukan perayaan yang bersifat anarkis atau berkumpul secara berlebihan.</li>
            </ul>
          }
        />

        {/* Keamanan Data */}
        <InfoCard 
          icon={<ShieldAlert size={28} />}
          title="Keamanan & Privasi"
          bgColor="#fff7ed"
          color="#9a3412"
          content={
            <ul style={{ paddingLeft: '1.25rem', display: 'grid', gap: '0.5rem' }}>
              <li>Jaga kerahasiaan Token Anda, jangan berikan kepada siapapun.</li>
              <li>Waspadai informasi palsu (hoax) yang mengatasnamakan sekolah.</li>
              <li>Gunakan portal resmi sekolah sebagai satu-satunya sumber informasi valid.</li>
            </ul>
          }
        />
      </div>

      <div style={{ 
        marginTop: '3rem', 
        padding: '2rem', 
        backgroundColor: 'var(--primary-green)', 
        borderRadius: '24px', 
        color: 'white',
        display: 'flex',
        alignItems: 'center',
        gap: '2rem',
        backgroundImage: 'linear-gradient(45deg, rgba(0,0,0,0.1) 25%, transparent 25%, transparent 50%, rgba(0,0,0,0.1) 50%, rgba(0,0,0,0.1) 75%, transparent 75%, transparent)',
        backgroundSize: '40px 40px'
      }}>
        <div style={{ backgroundColor: 'rgba(255,255,255,0.2)', padding: '1rem', borderRadius: '50%' }}>
          <GraduationCap size={40} />
        </div>
        <div>
          <h4 style={{ fontSize: '1.25rem', fontWeight: '800', marginBottom: '0.25rem' }}>Selamat Berjuang, Calon Alumni!</h4>
          <p style={{ opacity: 0.9 }}>Masa depan cerah menanti Anda. Tetaplah menjaga nama baik almamater dimanapun berada.</p>
        </div>
      </div>
    </motion.div>
  );
};

export default InfoManager;
