import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle } from 'lucide-react';

const DeleteModal = ({ isOpen, onClose, onConfirm, targetName }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 200 }}>
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }} 
            animate={{ scale: 1, opacity: 1 }} 
            exit={{ scale: 0.9, opacity: 0 }} 
            style={{ backgroundColor: 'white', padding: '2.5rem', borderRadius: '32px', width: '100%', maxWidth: '400px', textAlign: 'center', boxShadow: '0 30px 60px rgba(0,0,0,0.3)' }}
          >
            <div style={{ width: '80px', height: '80px', backgroundColor: '#fee2e2', color: '#ef4444', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
              <AlertTriangle size={40} />
            </div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: '800', color: '#1e293b', marginBottom: '0.75rem' }}>Konfirmasi Hapus</h2>
            <p style={{ color: '#64748b', lineHeight: 1.6, marginBottom: '2rem' }}>
              Apakah Anda yakin ingin menghapus data <b>{targetName}</b>? Tindakan ini tidak dapat dibatalkan.
            </p>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <button onClick={onClose} style={{ flex: 1, padding: '1rem', backgroundColor: '#f1f5f9', color: '#64748b', borderRadius: '14px', fontWeight: '700', border: 'none', cursor: 'pointer' }}>Batal</button>
              <button onClick={onConfirm} style={{ flex: 1, padding: '1rem', backgroundColor: '#ef4444', color: 'white', borderRadius: '14px', fontWeight: '700', border: 'none', cursor: 'pointer', boxShadow: '0 10px 20px rgba(239,68,68,0.2)' }}>Ya, Hapus</button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default DeleteModal;
