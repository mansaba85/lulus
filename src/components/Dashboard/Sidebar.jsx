import React from 'react';
import { 
  LayoutDashboard, 
  Database, 
  Users, 
  Info, 
  Settings,
  X,
  LogOut
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const SidebarLink = ({ icon, label, active, onClick }) => (
  <div 
    onClick={onClick} 
    style={{ 
      display: 'flex', 
      alignItems: 'center', 
      gap: '1rem', 
      padding: '0.75rem 2rem', 
      backgroundColor: active ? 'rgba(255,255,255,0.1)' : 'transparent', 
      borderLeft: active ? '4px solid white' : '4px solid transparent', 
      cursor: 'pointer', 
      transition: 'all 0.3s ease', 
      opacity: active ? 1 : 0.8 
    }}
  >
    {icon}
    <span style={{ fontWeight: active ? '700' : '500', fontSize: '0.95rem' }}>{label}</span>
  </div>
);

const Sidebar = ({ activeTab, setActiveTab, logo, isMobileMenuOpen, setIsMobileMenuOpen, adminName }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('isAdminAuthenticated');
    localStorage.removeItem('adminToken');
    navigate('/');
  };

  return (
    <>
      {/* Mobile Overlay */}
      <div 
        onClick={() => setIsMobileMenuOpen(false)}
        style={{ 
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, 
          backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 100, 
          backdropFilter: 'blur(4px)', 
          display: isMobileMenuOpen ? 'block' : 'none',
          transition: 'all 0.3s ease'
        }}
      />

      <aside 
        style={{ 
          width: '280px', 
          background: 'var(--sidebar-bg)', 
          color: 'white',
          padding: '2rem 0',
          display: 'flex',
          flexDirection: 'column',
          borderRadius: '0 30px 30px 0',
          position: 'fixed',
          height: '100vh',
          zIndex: 101,
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          transform: isMobileMenuOpen ? 'translateX(0)' : 'translateX(-100%)',
          left: 0
        }}
        className="sidebar-container"
      >
        <div style={{ padding: '0 2rem', marginBottom: '3rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ 
              width: '40px', height: '40px', 
              backgroundColor: 'rgba(255,255,255,0.1)', 
              borderRadius: '10px', 
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
              <img src={logo} alt="Logo" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
            </div>
            <h3 style={{ fontSize: '0.8rem', lineHeight: 1.1, fontWeight: '800' }}>PORTAL<br />KELULUSAN</h3>
          </div>
          <button 
            onClick={() => setIsMobileMenuOpen(false)}
            className="mobile-close-btn"
            style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', display: 'none' }}
          >
            <X size={24} />
          </button>
        </div>

        <nav style={{ flex: 1 }}>
          <SidebarLink 
            icon={<LayoutDashboard size={20} />} 
            label="Dashboard" 
            active={activeTab === 'dashboard'} 
            onClick={() => setActiveTab('dashboard')}
          />
          
          <div style={{ marginTop: '2rem' }}>
            <p style={{ padding: '0 2rem', fontSize: '0.7rem', opacity: 0.5, marginBottom: '0.75rem', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '1px' }}>Manajemen Data</p>
            <SidebarLink 
              icon={<Database size={18} />} 
              label="Data Kelas" 
              active={activeTab === 'kelas'} 
              onClick={() => setActiveTab('kelas')}
            />
            <SidebarLink 
              icon={<Users size={18} />} 
              label="Data Siswa" 
              active={activeTab === 'siswa'} 
              onClick={() => setActiveTab('siswa')}
            />
          </div>

          <div style={{ marginTop: '2rem' }}>
            <p style={{ padding: '0 2rem', fontSize: '0.7rem', opacity: 0.5, marginBottom: '0.75rem', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '1px' }}>Sistem</p>
            <SidebarLink 
              icon={<Info size={20} />} 
              label="Informasi" 
              active={activeTab === 'informasi'}
              onClick={() => setActiveTab('informasi')}
            />
            <SidebarLink 
              icon={<Settings size={20} />} 
              label="Pengaturan" 
              active={activeTab === 'settings'}
              onClick={() => setActiveTab('settings')}
            />
          </div>
        </nav>
        
        <div style={{ padding: '1rem 2rem 2rem' }}>
          <div style={{ backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: '16px', padding: '1.25rem', border: '1px solid rgba(255,255,255,0.1)', marginBottom: '1rem' }}>
            <p style={{ fontSize: '0.75rem', opacity: 0.6, marginBottom: '0.25rem' }}>Masuk sebagai</p>
            <p style={{ fontWeight: '700', fontSize: '0.9rem' }}>{adminName || 'Admin Utama'}</p>
          </div>
          <button 
            onClick={handleLogout}
            style={{ 
              width: '100%', 
              padding: '0.85rem', 
              backgroundColor: 'rgba(239,68,68,0.1)', 
              color: '#ef4444', 
              borderRadius: '12px', 
              display: 'flex', 
              alignItems: 'center', 
              gap: '0.75rem', 
              fontWeight: '700', 
              fontSize: '0.9rem',
              border: '1px solid rgba(239,68,68,0.2)',
              cursor: 'pointer'
            }}
          >
            <LogOut size={18} /> Keluar
          </button>
        </div>
      </aside>

      <style>{`
        @media (min-width: 1025px) {
          .sidebar-container {
            transform: translateX(0) !important;
          }
          .mobile-close-btn {
            display: none !important;
          }
        }
        @media (max-width: 1024px) {
          .mobile-close-btn {
            display: block !important;
          }
        }
      `}</style>
    </>
  );
};

export default Sidebar;
