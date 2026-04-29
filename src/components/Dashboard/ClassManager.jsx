import React from 'react';
import { motion } from 'framer-motion';
import { Plus, Edit, Trash2 } from 'lucide-react';

const ClassManager = ({ classes, openModal, handleDeleteClass }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
    >
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '2rem', color: 'var(--primary-green)', marginBottom: '0.5rem' }}>Data Kelas</h1>
          <p style={{ color: 'var(--text-muted)' }}>Manajemen data kelas MA NU 01 Banyuputih</p>
        </div>
        <button 
          onClick={() => openModal()}
          style={{ 
            backgroundColor: 'var(--primary-green)', 
            color: 'white', 
            padding: '0.75rem 1.5rem', 
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            fontWeight: '600'
          }}
        >
          <Plus size={20} /> Tambah Kelas
        </button>
      </header>

      <div style={{ 
        backgroundColor: 'white', 
        borderRadius: '20px', 
        padding: '1.5rem', 
        boxShadow: '0 10px 30px rgba(0,0,0,0.03)',
        border: '1px solid #f1f5f9',
        overflowX: 'auto'
      }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '500px' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #f8fafc' }}>
              <th style={{ padding: '1rem', color: 'var(--text-muted)', fontWeight: '600', width: '80px' }}>NO</th>
              <th style={{ padding: '1rem', color: 'var(--text-muted)', fontWeight: '600' }}>NAMA KELAS</th>
              <th style={{ padding: '1rem', color: 'var(--text-muted)', fontWeight: '600', textAlign: 'right' }}>AKSI</th>
            </tr>
          </thead>
          <tbody>
            {classes.map((cls, index) => (
              <tr key={cls.id} style={{ borderBottom: '1px solid #f8fafc', transition: 'all 0.3s' }} className="table-row">
                <td style={{ padding: '1.25rem 1rem', fontWeight: '600' }}>{index + 1}</td>
                <td style={{ padding: '1.25rem 1rem', fontWeight: '500' }}>{cls.name}</td>
                <td style={{ padding: '1.25rem 1rem', textAlign: 'right' }}>
                  <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                    <button 
                      onClick={() => openModal(cls)}
                      style={{ 
                        padding: '0.5rem', 
                        backgroundColor: '#f1f5f9', 
                        color: '#64748b', 
                        borderRadius: '8px' 
                      }}
                    >
                      <Edit size={16} />
                    </button>
                    <button 
                      onClick={() => handleDeleteClass(cls.id)}
                      style={{ 
                        padding: '0.5rem', 
                        backgroundColor: '#fee2e2', 
                        color: '#ef4444', 
                        borderRadius: '8px' 
                      }}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
};

export default ClassManager;
