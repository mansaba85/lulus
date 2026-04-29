import React from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  Database, 
  Check, 
  Clock, 
  Plus, 
  Settings, 
  Info 
} from 'lucide-react';

const StatCard = ({ label, value, sub, color, icon, delay }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay }}
    whileHover={{ y: -5 }}
    style={{ 
      background: color, 
      borderRadius: '20px', 
      padding: '1.75rem', 
      color: 'white',
      position: 'relative',
      overflow: 'hidden',
      boxShadow: '0 10px 25px rgba(0,0,0,0.1)'
    }}
  >
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
      <div>
        <p style={{ fontSize: '0.85rem', opacity: 0.9, fontWeight: '600', marginBottom: '0.5rem' }}>{label}</p>
        <h2 style={{ fontSize: '2.2rem', fontWeight: '800' }}>{value}</h2>
      </div>
      <div style={{ 
        backgroundColor: 'rgba(255,255,255,0.2)', 
        padding: '0.75rem', 
        borderRadius: '12px',
        backdropFilter: 'blur(10px)'
      }}>
        {icon}
      </div>
    </div>
    <div style={{ marginTop: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.75rem', backgroundColor: 'rgba(255,255,255,0.1)', padding: '0.5rem 0.75rem', borderRadius: '8px', width: 'fit-content' }}>
      <Check size={14} />
      {sub}
    </div>
  </motion.div>
);

const QuickActionButton = ({ icon, label, color, textColor, onClick }) => (
  <button 
    onClick={onClick}
    style={{ 
      display: 'flex', 
      alignItems: 'center', 
      gap: '1rem', 
      padding: '1rem', 
      borderRadius: '12px', 
      backgroundColor: color, 
      color: textColor,
      fontWeight: '700',
      fontSize: '0.85rem',
      border: 'none',
      cursor: 'pointer',
      transition: 'transform 0.2s',
      width: '100%',
      textAlign: 'left'
    }}
    onMouseEnter={(e) => e.currentTarget.style.transform = 'translateX(5px)'}
    onMouseLeave={(e) => e.currentTarget.style.transform = 'translateX(0)'}
  >
    {icon} {label}
  </button>
);

const Overview = ({ classesCount, studentsCount, lulusCount, tidakLulusCount, recentStudents, logo, setActiveTab }) => {
  const stats = [
    { label: 'Total Siswa', value: studentsCount.toString(), sub: 'Terdata di sistem', color: 'linear-gradient(135deg, #449e9e 0%, #2d6a6a 100%)', icon: <Users size={32} /> },
    { label: 'Total Kelas', value: classesCount.toString(), sub: 'Terdistribusi aktif', color: 'linear-gradient(135deg, #c54b4b 0%, #8e3535 100%)', icon: <Database size={32} /> },
    { label: 'Siswa Lulus', value: lulusCount.toString(), sub: `${((lulusCount / studentsCount || 0) * 100).toFixed(1)}% Tingkat Kelulusan`, color: 'linear-gradient(135deg, #2b8ad4 0%, #1a5685 100%)', icon: <Check size={32} /> },
    { label: 'Tidak Lulus', value: tidakLulusCount.toString(), sub: 'Perlu bimbingan khusus', color: 'linear-gradient(135deg, #9e347e 0%, #6d2457 100%)', icon: <Clock size={32} /> },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
    >
      {/* Welcome Banner */}
      <div style={{ 
        background: 'linear-gradient(135deg, var(--primary-green) 0%, #063c25 100%)', 
        borderRadius: '24px', 
        padding: '2.5rem', 
        color: 'white',
        marginBottom: '2.5rem',
        position: 'relative',
        overflow: 'hidden',
        boxShadow: '0 20px 40px rgba(15,81,50,0.15)'
      }}>
        <div style={{ position: 'relative', zIndex: 1 }}>
          <h1 style={{ fontSize: '2rem', fontWeight: '800', marginBottom: '0.75rem' }}>Selamat Datang, Admin! 👋</h1>
          <p style={{ opacity: 0.8, maxWidth: '500px', lineHeight: 1.6 }}>
            Kelola data kelulusan siswa MA NU 01 Banyuputih dengan mudah. Pantau statistik dan update pengaturan sistem dari satu tempat.
          </p>
        </div>
        <div style={{ 
          position: 'absolute', right: '-20px', bottom: '-40px', 
          opacity: 0.1, transform: 'rotate(-10deg)' 
        }}>
          <img src={logo} alt="" style={{ width: '300px', height: '300px', objectFit: 'contain' }} />
        </div>
      </div>

      {/* Stats Grid */}
      <section style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', 
        gap: '1.5rem',
        marginBottom: '2.5rem'
      }}>
        {stats.map((stat, index) => (
          <StatCard key={index} {...stat} delay={index * 0.1} />
        ))}
      </section>

      {/* Bottom Content Grid */}
      <div className="overview-grid" style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
        {/* Recent Students */}
        <div style={{ backgroundColor: 'white', borderRadius: '24px', padding: '2rem', boxShadow: '0 4px 20px rgba(0,0,0,0.03)', border: '1px solid #f1f5f9', overflowX: 'auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: '800', color: 'var(--text-main)' }}>Aktivitas Siswa Terbaru</h3>
            <button style={{ color: 'var(--primary-green)', fontWeight: '700', fontSize: '0.85rem' }}>Lihat Semua</button>
          </div>
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '400px' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #f8fafc' }}>
                <th style={{ textAlign: 'left', padding: '1rem', color: '#94a3b8', fontSize: '0.75rem', fontWeight: '800', textTransform: 'uppercase' }}>Nama</th>
                <th style={{ textAlign: 'left', padding: '1rem', color: '#94a3b8', fontSize: '0.75rem', fontWeight: '800', textTransform: 'uppercase' }}>Token</th>
                <th style={{ textAlign: 'left', padding: '1rem', color: '#94a3b8', fontSize: '0.75rem', fontWeight: '800', textTransform: 'uppercase' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {recentStudents && recentStudents.length > 0 ? (
                recentStudents.map((item, idx) => (
                  <tr key={idx} style={{ borderBottom: '1px solid #f8fafc' }}>
                    <td style={{ padding: '1.25rem 1rem' }}>
                      <p style={{ fontWeight: '700', color: 'var(--text-main)', fontSize: '0.9rem' }}>{item.name}</p>
                      <p style={{ fontSize: '0.7rem', color: '#94a3b8' }}>{item.class_name}</p>
                    </td>
                    <td style={{ padding: '1.25rem 1rem' }}>
                      <code style={{ backgroundColor: '#f1f5f9', padding: '0.25rem 0.5rem', borderRadius: '4px', fontSize: '0.85rem' }}>{item.token}</code>
                    </td>
                    <td style={{ padding: '1.25rem 1rem' }}>
                      <span style={{ 
                        padding: '0.25rem 0.75rem', borderRadius: '50px', fontSize: '0.65rem', fontWeight: '800',
                        backgroundColor: item.status === 'LULUS' ? '#dcfce7' : '#fee2e2',
                        color: item.status === 'LULUS' ? '#166534' : '#991b1b'
                      }}>{item.status}</span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" style={{ textAlign: 'center', padding: '2rem', color: '#94a3b8' }}>Belum ada data siswa</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Quick Actions */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div style={{ backgroundColor: 'white', borderRadius: '24px', padding: '2rem', boxShadow: '0 4px 20px rgba(0,0,0,0.03)', border: '1px solid #f1f5f9' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: '800', color: 'var(--text-main)', marginBottom: '1.5rem' }}>Aksi Cepat</h3>
            <div style={{ display: 'grid', gap: '1rem' }}>
              <QuickActionButton icon={<Plus size={18} />} label="Tambah Siswa Baru" color="#f0fdf4" textColor="#166534" onClick={() => setActiveTab('siswa')} />
              <QuickActionButton icon={<Database size={18} />} label="Kelola Kelas" color="#eff6ff" textColor="#1e40af" onClick={() => setActiveTab('kelas')} />
              <QuickActionButton icon={<Settings size={18} />} label="Buka Pengaturan" color="#faf5ff" textColor="#6b21a8" onClick={() => setActiveTab('settings')} />
            </div>
          </div>
          
          <div style={{ backgroundColor: '#fff7ed', borderRadius: '24px', padding: '1.5rem', border: '1px solid #ffedd5' }}>
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '1rem' }}>
              <div style={{ backgroundColor: '#f97316', color: 'white', padding: '0.5rem', borderRadius: '10px' }}><Info size={18} /></div>
              <h4 style={{ fontWeight: '800', color: '#9a3412', fontSize: '0.9rem' }}>Tips Admin</h4>
            </div>
            <p style={{ fontSize: '0.8rem', color: '#9a3412', lineHeight: 1.5, opacity: 0.8 }}>
              Pastikan Anda sudah mencocokkan data token dengan data fisik sebelum mengaktifkan sistem pengumuman.
            </p>
          </div>
        </div>
      </div>
      <style>{`
        @media (max-width: 1024px) {
          .overview-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </motion.div>
  );
};

export default Overview;
