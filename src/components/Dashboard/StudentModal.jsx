import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, X } from 'lucide-react';

const StudentModal = ({ isOpen, onClose, onSave, editingStudent, studentForm, setStudentForm, classes }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            style={{ backgroundColor: 'white', padding: '2.5rem', borderRadius: '32px', width: '100%', maxWidth: '550px', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.2)' }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
              <div>
                <h2 style={{ fontSize: '1.5rem', fontWeight: '800', color: 'var(--primary-green)' }}>{editingStudent ? 'Edit Data Siswa' : 'Tambah Siswa Baru'}</h2>
                <p style={{ color: '#64748b', fontSize: '0.85rem' }}>Lengkapi informasi detail siswa di bawah ini</p>
              </div>
              <button onClick={onClose} style={{ background: '#f1f5f9', border: 'none', color: '#64748b', width: '40px', height: '40px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}><X size={20} /></button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.8rem', fontWeight: '700', color: '#64748b' }}>Nomor Induk Siswa (NIS)</label>
                <input type="text" value={studentForm.nis} onChange={(e) => setStudentForm({...studentForm, nis: e.target.value})} placeholder="Contoh: 005128..." style={{ width: '100%', padding: '0.85rem', borderRadius: '10px', border: '2px solid #f1f5f9' }} />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.8rem', fontWeight: '700', color: '#64748b' }}>Kelas</label>
                <select value={studentForm.class} onChange={(e) => setStudentForm({...studentForm, class: e.target.value})} style={{ width: '100%', padding: '0.85rem', borderRadius: '10px', border: '2px solid #f1f5f9', backgroundColor: 'white' }}>
                  {classes.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                </select>
              </div>
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.8rem', fontWeight: '700', color: '#64748b' }}>Nama Lengkap Siswa</label>
              <input type="text" value={studentForm.name} onChange={(e) => setStudentForm({...studentForm, name: e.target.value})} placeholder="Masukkan nama lengkap..." style={{ width: '100%', padding: '0.85rem', borderRadius: '10px', border: '2px solid #f1f5f9' }} />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '2.5rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.8rem', fontWeight: '700', color: '#64748b' }}>Token Kelulusan</label>
                <input type="text" value={studentForm.token} onChange={(e) => setStudentForm({...studentForm, token: e.target.value})} style={{ width: '100%', padding: '0.85rem', borderRadius: '10px', border: '2px solid #f1f5f9', fontWeight: '700', textTransform: 'uppercase' }} />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.8rem', fontWeight: '700', color: '#64748b' }}>Status Kelulusan</label>
                <select value={studentForm.status} onChange={(e) => setStudentForm({...studentForm, status: e.target.value})} style={{ width: '100%', padding: '0.85rem', borderRadius: '10px', border: '2px solid #f1f5f9', fontWeight: '700' }}>
                  <option value="LULUS">LULUS</option>
                  <option value="TIDAK LULUS">TIDAK LULUS</option>
                </select>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '1rem' }}>
              <button onClick={onClose} style={{ flex: 1, padding: '1rem', backgroundColor: '#f1f5f9', color: '#64748b', borderRadius: '12px', fontWeight: '600', border: 'none', cursor: 'pointer' }}>Batal</button>
              <button onClick={onSave} style={{ flex: 1, padding: '1rem', backgroundColor: 'var(--primary-green)', color: 'white', borderRadius: '12px', fontWeight: '600', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', border: 'none', cursor: 'pointer' }}><Check size={20} /> {editingStudent ? 'Simpan Perubahan' : 'Tambah Siswa'}</button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default StudentModal;
