import React from 'react';
import { motion } from 'framer-motion';
import { 
  Calendar, 
  Clock, 
  Save, 
  Info, 
  Users, 
  User, 
  Camera, 
  AtSign, 
  Lock, 
  Eye,
  EyeOff 
} from 'lucide-react';
import { toast } from 'sonner';

const SettingsManager = ({ 
  schoolName, setSchoolName, 
  releaseDate, setReleaseDate, 
  releaseTime, setReleaseTime, 
  schoolLogo, setSchoolLogo,
  handleSaveSettings 
}) => {
  const fileInputRef = React.useRef(null);
  const [showPassword, setShowPassword] = React.useState(false);
  const [adminUsername, setAdminUsername] = React.useState('admin');
  const [adminPassword, setAdminPassword] = React.useState('admin123');
  const [adminName, setAdminName] = React.useState('Administrator Utama');

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSchoolLogo(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
    >
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '2rem' }}>
        {/* School Settings */}
        <section style={{ backgroundColor: 'white', borderRadius: '20px', overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
          <div style={{ padding: '1.5rem 2rem', borderBottom: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ color: 'var(--primary-green)' }}><Calendar size={24} /></div>
            <h2 style={{ fontSize: '1.25rem', color: 'var(--primary-green)' }}>Pengaturan Umum Sekolah</h2>
          </div>
          <div style={{ padding: '2.5rem' }}>
            {/* Logo Upload Section */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', marginBottom: '2.5rem', backgroundColor: '#f8fafc', padding: '1.5rem', borderRadius: '16px', border: '1px dashed #e2e8f0' }}>
              <div style={{ position: 'relative' }}>
                <div style={{ width: '80px', height: '80px', borderRadius: '50%', backgroundColor: 'white', border: '3px solid var(--primary-green)', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <img src={schoolLogo} alt="Logo Sekolah" style={{ width: '100%', height: '100%', objectFit: 'contain', padding: '5px' }} />
                </div>
                <button 
                  onClick={() => fileInputRef.current.click()}
                  style={{ position: 'absolute', bottom: '-5px', right: '-5px', width: '30px', height: '30px', borderRadius: '50%', backgroundColor: 'var(--primary-green)', color: 'white', border: '2px solid white', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                >
                  <Camera size={14} />
                </button>
              </div>
              <div>
                <h4 style={{ color: 'var(--text-main)', marginBottom: '0.25rem' }}>Logo Sekolah</h4>
                <p style={{ fontSize: '0.8rem', color: '#64748b', marginBottom: '0.75rem' }}>Format PNG, JPG. Maksimal 1MB.</p>
                <button 
                  onClick={() => fileInputRef.current.click()}
                  style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--primary-green)', backgroundColor: 'transparent', border: 'none', padding: 0, cursor: 'pointer' }}
                >
                  Ganti Logo
                </button>
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleLogoChange} 
                  style={{ display: 'none' }} 
                  accept="image/*"
                />
              </div>
            </div>

            <div style={{ marginBottom: '2rem' }}>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '800', color: '#64748b', marginBottom: '0.75rem', textTransform: 'uppercase' }}>Nama Sekolah</label>
              <input 
                type="text" 
                value={schoolName} 
                onChange={(e) => setSchoolName(e.target.value)}
                style={{ width: '100%', padding: '1rem', borderRadius: '12px', border: '2px solid #f1f5f9', fontSize: '1rem', fontWeight: '600' }} 
              />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '3rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '800', color: '#64748b', marginBottom: '0.75rem', textTransform: 'uppercase' }}>Tanggal Pengumuman</label>
                <div style={{ position: 'relative' }}>
                  <input 
                    type="date" 
                    value={releaseDate}
                    onChange={(e) => setReleaseDate(e.target.value)}
                    style={{ width: '100%', padding: '1rem 1rem 1rem 3rem', borderRadius: '12px', border: '2px solid #f1f5f9', fontSize: '1rem' }} 
                  />
                  <Calendar size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#cbd5e1' }} />
                </div>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '800', color: '#64748b', marginBottom: '0.75rem', textTransform: 'uppercase' }}>Jam Pengumuman</label>
                <div style={{ position: 'relative' }}>
                  <input 
                    type="time" 
                    value={releaseTime}
                    onChange={(e) => setReleaseTime(e.target.value)}
                    style={{ width: '100%', padding: '1rem 1rem 1rem 3rem', borderRadius: '12px', border: '2px solid #f1f5f9', fontSize: '1rem' }} 
                  />
                  <Clock size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#cbd5e1' }} />
                </div>
              </div>
            </div>
            <button 
              onClick={handleSaveSettings}
              style={{ width: '100%', backgroundColor: 'var(--primary-green)', color: 'white', padding: '1.25rem', borderRadius: '12px', fontWeight: '700', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', boxShadow: '0 10px 20px rgba(15,81,50,0.2)' }}
            >
              <Save size={20} /> Simpan Perubahan
            </button>
          </div>
          
          <div style={{ margin: '0 2rem 2rem', padding: '1.5rem', backgroundColor: 'var(--primary-green)', borderRadius: '16px', color: 'white', display: 'flex', gap: '1rem' }}>
            <Info size={24} style={{ flexShrink: 0 }} />
            <div>
              <h4 style={{ marginBottom: '0.5rem', fontWeight: '700' }}>Informasi Pengumuman</h4>
              <p style={{ fontSize: '0.85rem', opacity: 0.8, lineHeight: 1.5 }}>Waktu yang Anda atur akan menjadi pemicu otomatis kapan sistem membuka akses nilai dan surat keterangan kelulusan kepada seluruh siswa secara serentak.</p>
            </div>
          </div>
        </section>

        {/* Admin Settings */}
        <section style={{ backgroundColor: 'white', borderRadius: '20px', overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
          <div style={{ padding: '1.5rem 2rem', borderBottom: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ color: 'var(--primary-green)' }}><Users size={24} /></div>
            <h2 style={{ fontSize: '1.25rem', color: 'var(--primary-green)' }}>Pengaturan Profil Admin</h2>
          </div>
          <div style={{ padding: '2.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ position: 'relative', marginBottom: '2.5rem' }}>
              <div style={{ width: '100px', height: '100px', borderRadius: '24px', backgroundColor: '#1E293B', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '3px solid var(--primary-green)', padding: '4px' }}>
                <div style={{ width: '100%', height: '100%', borderRadius: '18px', overflow: 'hidden', backgroundColor: '#334155', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <User size={60} color="#94a3b8" />
                </div>
              </div>
              <button style={{ position: 'absolute', bottom: '-10px', right: '-10px', width: '36px', height: '36px', borderRadius: '50%', backgroundColor: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 10px rgba(0,0,0,0.1)', color: 'var(--primary-green)' }}>
                <Camera size={18} />
              </button>
            </div>

            <div style={{ width: '100%', marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '800', color: '#64748b', marginBottom: '0.75rem', textTransform: 'uppercase' }}>Nama Lengkap</label>
              <input 
                type="text" 
                value={adminName} 
                onChange={(e) => setAdminName(e.target.value)}
                style={{ width: '100%', padding: '1rem', borderRadius: '12px', border: '2px solid #f1f5f9', fontSize: '1rem', fontWeight: '600' }} 
              />
            </div>
            <div style={{ width: '100%', marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '800', color: '#64748b', marginBottom: '0.75rem', textTransform: 'uppercase' }}>Username</label>
              <div style={{ position: 'relative' }}>
                <input 
                  type="text" 
                  value={adminUsername} 
                  onChange={(e) => setAdminUsername(e.target.value)}
                  style={{ width: '100%', padding: '1rem 1rem 1rem 3rem', borderRadius: '12px', border: '2px solid #f1f5f9', fontSize: '1rem', fontWeight: '600' }} 
                />
                <AtSign size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#cbd5e1' }} />
              </div>
            </div>
            <div style={{ width: '100%', marginBottom: '3rem' }}>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '800', color: '#64748b', marginBottom: '0.75rem', textTransform: 'uppercase' }}>Kata Sandi</label>
              <div style={{ position: 'relative' }}>
                <input 
                  type={showPassword ? "text" : "password"} 
                  value={adminPassword} 
                  onChange={(e) => setAdminPassword(e.target.value)}
                  style={{ width: '100%', padding: '1rem 3rem', borderRadius: '12px', border: '2px solid #f1f5f9', fontSize: '1rem' }} 
                />
                <Lock size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#cbd5e1' }} />
                <button 
                  onClick={() => setShowPassword(!showPassword)}
                  style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#cbd5e1', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
            <button 
              onClick={async () => {
                try {
                  await api.updateAdmin({ username: adminUsername, password: adminPassword });
                  toast.success('Profil admin berhasil diperbarui!');
                } catch (err) {
                  toast.error('Gagal memperbarui profil');
                }
              }}
              style={{ width: '100%', backgroundColor: 'var(--primary-green)', color: 'white', padding: '1.25rem', borderRadius: '12px', fontWeight: '700', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', boxShadow: '0 10px 20px rgba(15,81,50,0.2)' }}
            >
              <Save size={20} /> Simpan Perubahan Profil
            </button>
          </div>
        </section>
      </div>
    </motion.div>
  );
};

export default SettingsManager;
