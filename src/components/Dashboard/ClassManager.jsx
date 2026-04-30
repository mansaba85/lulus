import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { api } from '../../utils/api';
import { toast } from 'sonner';

const ClassManager = ({ classes, openModal, handleDeleteClass, fetchData }) => {
  const [selectedIds, setSelectedIds] = useState([]);

  const toggleSelectAll = () => {
    if (selectedIds.length === classes.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(classes.map(c => c.id));
    }
  };

  const toggleSelectRow = (id) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const handleBulkDelete = async () => {
    if (window.confirm(`Hapus ${selectedIds.length} kelas terpilih? Semua siswa di kelas ini mungkin akan kehilangan referensi kelasnya.`)) {
      try {
        await api.bulkDeleteClasses(selectedIds);
        toast.success(`${selectedIds.length} kelas berhasil dihapus`);
        setSelectedIds([]);
        fetchData();
      } catch (err) {
        toast.error('Gagal menghapus kelas secara massal');
      }
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
    >
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '2rem', color: 'var(--primary-green)', marginBottom: '0.5rem', fontWeight: '800' }}>Data Kelas</h1>
          <p style={{ color: 'var(--text-muted)' }}>Manajemen daftar kelas resmi sekolah.</p>
        </div>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          {selectedIds.length > 0 && (
            <button 
              onClick={handleBulkDelete}
              style={{ backgroundColor: '#fee2e2', color: '#b91c1c', padding: '0.75rem 1.25rem', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: '700', fontSize: '0.9rem', border: '1px solid #fecaca', cursor: 'pointer' }}
            >
              <Trash2 size={18} /> Hapus ({selectedIds.length})
            </button>
          )}
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
              fontWeight: '700',
              border: 'none',
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(15,81,50,0.1)'
            }}
          >
            <Plus size={20} /> Tambah Kelas
          </button>
        </div>
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
              <th style={{ padding: '1rem', width: '50px' }}>
                <input 
                  type="checkbox" 
                  checked={selectedIds.length === classes.length && classes.length > 0}
                  onChange={toggleSelectAll}
                  style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                />
              </th>
              <th style={{ padding: '1rem', color: 'var(--text-muted)', fontWeight: '800', fontSize: '0.75rem', textTransform: 'uppercase' }}>NAMA KELAS</th>
              <th style={{ padding: '1rem', color: 'var(--text-muted)', fontWeight: '800', fontSize: '0.75rem', textTransform: 'uppercase', textAlign: 'right' }}>AKSI</th>
            </tr>
          </thead>
          <tbody>
            {classes.map((cls, index) => (
              <tr key={cls.id} style={{ borderBottom: '1px solid #f8fafc', transition: 'all 0.3s', backgroundColor: selectedIds.includes(cls.id) ? '#f0fdf4' : 'transparent' }} className="table-row">
                <td style={{ padding: '1.25rem 1rem' }}>
                  <input 
                    type="checkbox" 
                    checked={selectedIds.includes(cls.id)}
                    onChange={() => toggleSelectRow(cls.id)}
                    style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                  />
                </td>
                <td style={{ padding: '1.25rem 1rem', fontWeight: '700', color: 'var(--primary-green)' }}>{cls.name}</td>
                <td style={{ padding: '1.25rem 1rem', textAlign: 'right' }}>
                  <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                    <button onClick={() => openModal(cls)} style={{ padding: '0.5rem', color: '#94a3b8', background: 'none', border: 'none', cursor: 'pointer' }}><Edit size={18} /></button>
                    <button onClick={() => handleDeleteClass(cls.id)} style={{ padding: '0.5rem', color: '#94a3b8', background: 'none', border: 'none', cursor: 'pointer' }}><Trash2 size={18} /></button>
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
