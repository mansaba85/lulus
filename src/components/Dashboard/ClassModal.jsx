import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, X } from 'lucide-react';

const ClassModal = ({ isOpen, onClose, onSave, editingClass, newClassName, setNewClassName }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '24px', width: '100%', maxWidth: '400px', boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
              <h2 style={{ fontSize: '1.25rem', color: 'var(--primary-green)' }}>{editingClass ? 'Edit Kelas' : 'Tambah Kelas Baru'}</h2>
              <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}><X size={24} /></button>
            </div>
            <div style={{ marginBottom: '2rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.8rem', fontWeight: '700', color: '#64748b' }}>Nama Kelas</label>
              <input 
                type="text" 
                value={newClassName} 
                onChange={(e) => setNewClassName(e.target.value)}
                placeholder="Contoh: XII MIPA 1"
                style={{ width: '100%', padding: '0.85rem', borderRadius: '10px', border: '2px solid #f1f5f9' }} 
              />
            </div>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <button onClick={onClose} style={{ flex: 1, padding: '1rem', backgroundColor: '#f1f5f9', color: '#64748b', borderRadius: '12px', fontWeight: '600', border: 'none', cursor: 'pointer' }}>Batal</button>
              <button onClick={onSave} style={{ flex: 1, padding: '1rem', backgroundColor: 'var(--primary-green)', color: 'white', borderRadius: '12px', fontWeight: '600', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', border: 'none', cursor: 'pointer' }}><Check size={20} /> Simpan</button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default ClassModal;
