import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle, AlertCircle, FileText } from 'lucide-react';

const ImportPreviewModal = ({ isOpen, onClose, onConfirm, data }) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div style={{ 
        position: 'fixed', 
        inset: 0, 
        backgroundColor: 'rgba(0,0,0,0.5)', 
        backdropFilter: 'blur(4px)',
        zIndex: 100, 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        padding: '1rem'
      }}>
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          style={{ 
            backgroundColor: 'white', 
            borderRadius: '24px', 
            width: '100%', 
            maxWidth: '900px', 
            maxHeight: '85vh',
            display: 'flex',
            flexDirection: 'column',
            boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)',
            overflow: 'hidden'
          }}
        >
          {/* Header */}
          <div style={{ padding: '1.5rem 2rem', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#f8fafc' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ backgroundColor: '#dcfce7', color: '#15803d', padding: '0.6rem', borderRadius: '12px' }}>
                <FileText size={24} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#1e293b' }}>Pratinjau Import Data</h3>
                <p style={{ fontSize: '0.85rem', color: '#64748b' }}>Ditemukan <b>{data.length}</b> data siswa dari file Excel.</p>
              </div>
            </div>
            <button onClick={onClose} style={{ padding: '0.5rem', borderRadius: '50%', border: 'none', backgroundColor: '#fff', color: '#94a3b8', cursor: 'pointer' }}>
              <X size={20} />
            </button>
          </div>

          {/* Content */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '1.5rem 2rem' }}>
            <div style={{ backgroundColor: '#fff7ed', border: '1px solid #ffedd5', padding: '1rem', borderRadius: '12px', marginBottom: '1.5rem', display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
              <AlertCircle size={20} color="#c2410c" style={{ flexShrink: 0, marginTop: '2px' }} />
              <p style={{ fontSize: '0.85rem', color: '#9a3412', lineHeight: 1.5 }}>
                <b>Penting:</b> Pastikan kolom data sudah sesuai (NIS, Nama, Kelas, Token, Status). Data dengan NIS yang sudah ada akan diperbarui secara otomatis.
              </p>
            </div>

            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead style={{ position: 'sticky', top: 0, backgroundColor: 'white', zIndex: 1 }}>
                <tr style={{ borderBottom: '2px solid #f1f5f9' }}>
                  <th style={{ padding: '1rem 0.5rem', fontSize: '0.75rem', fontWeight: '800', color: '#94a3b8', textTransform: 'uppercase' }}>NIS</th>
                  <th style={{ padding: '1rem 0.5rem', fontSize: '0.75rem', fontWeight: '800', color: '#94a3b8', textTransform: 'uppercase' }}>NAMA LENGKAP</th>
                  <th style={{ padding: '1rem 0.5rem', fontSize: '0.75rem', fontWeight: '800', color: '#94a3b8', textTransform: 'uppercase' }}>KELAS</th>
                  <th style={{ padding: '1rem 0.5rem', fontSize: '0.75rem', fontWeight: '800', color: '#94a3b8', textTransform: 'uppercase' }}>TOKEN</th>
                  <th style={{ padding: '1rem 0.5rem', fontSize: '0.75rem', fontWeight: '800', color: '#94a3b8', textTransform: 'uppercase' }}>STATUS</th>
                </tr>
              </thead>
              <tbody>
                {data.slice(0, 50).map((item, idx) => (
                  <tr key={idx} style={{ borderBottom: '1px solid #f8fafc' }}>
                    <td style={{ padding: '0.85rem 0.5rem', fontSize: '0.9rem', color: '#1e293b', fontWeight: '600' }}>{item.nis}</td>
                    <td style={{ padding: '0.85rem 0.5rem', fontSize: '0.9rem', color: '#475569' }}>{item.name}</td>
                    <td style={{ padding: '0.85rem 0.5rem', fontSize: '0.9rem', color: '#64748b' }}>{item.class_name}</td>
                    <td style={{ padding: '0.85rem 0.5rem' }}>
                      <code style={{ fontSize: '0.8rem', backgroundColor: '#f1f5f9', padding: '0.2rem 0.4rem', borderRadius: '4px' }}>{item.token}</code>
                    </td>
                    <td style={{ padding: '0.85rem 0.5rem' }}>
                      <span style={{ 
                        fontSize: '0.7rem', fontWeight: '800', padding: '0.25rem 0.75rem', borderRadius: '50px',
                        backgroundColor: item.status === 'LULUS' ? '#dcfce7' : '#fee2e2',
                        color: item.status === 'LULUS' ? '#15803d' : '#b91c1c'
                      }}>{item.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            {data.length > 50 && (
              <div style={{ padding: '1rem', textAlign: 'center', color: '#94a3b8', fontSize: '0.85rem', fontStyle: 'italic' }}>
                ... dan {data.length - 50} data lainnya ...
              </div>
            )}
          </div>

          {/* Footer */}
          <div style={{ padding: '1.5rem 2rem', borderTop: '1px solid #f1f5f9', display: 'flex', justifyContent: 'flex-end', gap: '1rem', backgroundColor: '#f8fafc' }}>
            <button 
              onClick={onClose}
              style={{ padding: '0.75rem 1.5rem', borderRadius: '12px', border: '1px solid #e2e8f0', backgroundColor: 'white', color: '#64748b', fontWeight: '700', cursor: 'pointer' }}
            >
              Batal
            </button>
            <button 
              onClick={onConfirm}
              style={{ 
                padding: '0.75rem 2rem', borderRadius: '12px', border: 'none', backgroundColor: 'var(--primary-green)', 
                color: 'white', fontWeight: '800', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.75rem',
                boxShadow: '0 10px 20px rgba(15,81,50,0.2)'
              }}
            >
              <CheckCircle size={20} /> Proses Import Sekarang
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default ImportPreviewModal;
