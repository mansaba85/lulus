import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Plus, 
  Search, 
  RefreshCcw, 
  FileSpreadsheet, 
  Upload, 
  Edit, 
  Trash2,
  ChevronLeft,
  ChevronRight,
  MoreHorizontal
} from 'lucide-react';
import * as XLSX from 'xlsx';

const StudentManager = ({ classes, students, openStudentModal, handleDeleteStudent, handleImportStudents }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selectedClass, setSelectedClass] = useState('Semua Kelas');

  const fileInputRef = React.useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      const bstr = evt.target.result;
      const wb = XLSX.read(bstr, { type: 'binary' });
      const wsname = wb.SheetNames[0];
      const ws = wb.Sheets[wsname];
      const data = XLSX.utils.sheet_to_json(ws);
      
      if (data.length > 0) {
        handleImportStudents(data);
      }
      e.target.value = ''; // Reset input
    };
    reader.readAsBinaryString(file);
  };
  
  // Filtering Logic
  const filteredStudents = students.filter(student => 
    selectedClass === 'Semua Kelas' || (student.class_name || student.class) === selectedClass
  );

  const totalEntries = filteredStudents.length;
  const totalPages = Math.ceil(totalEntries / rowsPerPage);
  
  // Slicing data based on pagination
  const currentData = filteredStudents.slice(
    (currentPage - 1) * rowsPerPage, 
    currentPage * rowsPerPage
  );

  const handleClassChange = (e) => {
    setSelectedClass(e.target.value);
    setCurrentPage(1); // Reset to page 1 on filter change
  };

  return (
    <motion.div 
      key="siswa"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
    >
      <style>{`
        @media (max-width: 1024px) {
          .manager-header { 
            flex-direction: column !important; 
            align-items: flex-start !important; 
            gap: 1.5rem !important; 
          }
          .manager-header h1 { font-size: 1.75rem !important; }
          .manager-actions { 
            width: 100% !important; 
            flex-wrap: wrap !important; 
            gap: 0.75rem !important; 
          }
          .manager-actions button { flex: 1 !important; min-width: 140px !important; justify-content: center !important; }
          
          .filter-bar { 
            flex-direction: column !important; 
            align-items: stretch !important; 
            gap: 1.25rem !important; 
          }
          .filter-bar > div { width: 100% !important; }
        }
        
        @media (max-width: 640px) {
          .manager-header h1 { font-size: 1.5rem !important; }
          .pagination-footer { 
            flex-direction: column !important; 
            gap: 1rem !important; 
            text-align: center !important; 
          }
        }
      `}</style>

      <header className="manager-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '2.5rem', color: 'var(--primary-green)', marginBottom: '0.5rem', fontWeight: '800' }}>Data Siswa</h1>
          <p style={{ color: 'var(--text-muted)', maxWidth: '600px', fontSize: '0.9rem' }}>
            Kelola data kredensial siswa, status kelulusan, dan informasi akademik resmi.
          </p>
        </div>
        <div className="manager-actions" style={{ display: 'flex', gap: '1rem' }}>
          <button 
            onClick={() => openStudentModal()}
            style={{ backgroundColor: 'var(--primary-green)', color: 'white', padding: '0.75rem 1.25rem', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: '800', fontSize: '0.85rem', border: 'none', cursor: 'pointer', boxShadow: '0 4px 12px rgba(15,81,50,0.2)' }}
          >
            <Plus size={18} /> Tambah
          </button>
          <button 
            onClick={() => {
              const ws = XLSX.utils.json_to_sheet([{ NIS: '12345', Nama: 'Ahmad Ridho', Kelas: 'XII MIPA 1', Token: 'ABC12', Status: 'LULUS' }]);
              const wb = XLSX.utils.book_new();
              XLSX.utils.book_append_sheet(wb, ws, "Template");
              const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
              const data = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
              const url = window.URL.createObjectURL(data);
              const link = document.createElement('a');
              link.href = url;
              link.setAttribute('download', 'Template_Siswa.xlsx');
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
            }}
            style={{ backgroundColor: '#7a5a22', color: 'white', padding: '0.75rem 1.25rem', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: '600', fontSize: '0.85rem', border: 'none', cursor: 'pointer' }}
          >
            <FileSpreadsheet size={18} /> Template
          </button>
          <button 
            onClick={() => fileInputRef.current.click()}
            style={{ backgroundColor: 'white', color: 'var(--primary-green)', padding: '0.75rem 1.25rem', borderRadius: '8px', border: '2px solid var(--primary-green)', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: '600', fontSize: '0.85rem', cursor: 'pointer' }}
          >
            <Upload size={18} /> Import
          </button>
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileChange} 
            style={{ display: 'none' }} 
            accept=".xlsx, .xls"
          />
        </div>
      </header>

      {/* Filter & Search Bar */}
      <div className="filter-bar" style={{ backgroundColor: 'white', borderRadius: '16px', padding: '1.5rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'flex-end', gap: '1.5rem', border: '1px solid #f1f5f9', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.02)' }}>
        <div style={{ width: '200px' }}>
          <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: '800', color: '#94a3b8', marginBottom: '0.5rem', textTransform: 'uppercase' }}>Filter Kelas</label>
          <select 
            value={selectedClass}
            onChange={handleClassChange}
            style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1.5px solid #f1f5f9', backgroundColor: '#fff', fontWeight: '600', color: 'var(--text-main)' }}
          >
            <option>Semua Kelas</option>
            {classes.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
          </select>
        </div>
        <div style={{ width: '120px' }}>
          <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: '800', color: '#94a3b8', marginBottom: '0.5rem', textTransform: 'uppercase' }}>Tampilkan</label>
          <select 
            value={rowsPerPage}
            onChange={(e) => setRowsPerPage(Number(e.target.value))}
            style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1.5px solid #f1f5f9', backgroundColor: '#fff', fontWeight: '600', color: 'var(--text-main)' }}
          >
            <option value={10}>10 Baris</option>
            <option value={25}>25 Baris</option>
            <option value={50}>50 Baris</option>
          </select>
        </div>
        <div style={{ flex: 1 }}>
          <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: '800', color: '#94a3b8', marginBottom: '0.5rem', textTransform: 'uppercase' }}>Cari Nama/NIS</label>
          <div style={{ position: 'relative' }}>
            <Search style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#cbd5e1' }} size={18} />
            <input type="text" placeholder="Cari nama atau NISN siswa..." style={{ width: '100%', padding: '0.75rem 1rem 0.75rem 3rem', borderRadius: '8px', border: '1.5px solid #f1f5f9', fontSize: '0.9rem' }} />
          </div>
        </div>
      </div>

      <div style={{ backgroundColor: 'white', borderRadius: '16px', border: '1px solid #f1f5f9', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.02)', overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '800px' }}>
            <thead style={{ backgroundColor: '#f8fafc' }}>
            <tr>
              <th style={{ padding: '1.25rem 1.5rem', color: '#94a3b8', fontWeight: '800', fontSize: '0.7rem', textTransform: 'uppercase' }}>#</th>
              <th style={{ padding: '1.25rem 1rem', color: '#94a3b8', fontWeight: '800', fontSize: '0.7rem', textTransform: 'uppercase' }}>NIS</th>
              <th style={{ padding: '1.25rem 1rem', color: '#94a3b8', fontWeight: '800', fontSize: '0.7rem', textTransform: 'uppercase' }}>NAMA</th>
              <th style={{ padding: '1.25rem 1rem', color: '#94a3b8', fontWeight: '800', fontSize: '0.7rem', textTransform: 'uppercase' }}>KELAS</th>
              <th style={{ padding: '1.25rem 1rem', color: '#94a3b8', fontWeight: '800', fontSize: '0.7rem', textTransform: 'uppercase' }}>TOKEN</th>
              <th style={{ padding: '1.25rem 1rem', color: '#94a3b8', fontWeight: '800', fontSize: '0.7rem', textTransform: 'uppercase' }}>STATUS</th>
              <th style={{ padding: '1.25rem 1.5rem', color: '#94a3b8', fontWeight: '800', fontSize: '0.7rem', textTransform: 'uppercase', textAlign: 'right' }}>AKSI</th>
            </tr>
          </thead>
          <tbody>
            {currentData.map((student, index) => (
              <tr key={student.id} style={{ borderBottom: '1px solid #f1f5f9', transition: 'all 0.2s' }} className="table-row">
                <td style={{ padding: '1.25rem 1.5rem', fontSize: '0.85rem', color: '#64748b' }}>{((currentPage - 1) * rowsPerPage) + index + 1}</td>
                <td style={{ padding: '1.25rem 1rem', fontSize: '0.85rem', fontWeight: '600', color: '#1e293b' }}>{student.nis}</td>
                <td style={{ padding: '1.25rem 1rem' }}>
                    <span style={{ fontWeight: '700', color: 'var(--primary-green)', fontSize: '0.9rem' }}>{student.name}</span>
                </td>
                <td style={{ padding: '1.25rem 1rem', fontSize: '0.85rem', color: '#64748b', fontWeight: '600' }}>{student.class_name || student.class}</td>
                <td style={{ padding: '1.25rem 1rem' }}>
                  <code style={{ backgroundColor: '#f1f5f9', padding: '0.3rem 0.5rem', borderRadius: '6px', fontSize: '0.8rem', fontWeight: '700', color: '#475569' }}>{student.token}</code>
                </td>
                <td style={{ padding: '1.25rem 1rem' }}>
                  <span style={{ 
                    padding: '0.3rem 0.75rem', borderRadius: '50px', fontSize: '0.6rem', fontWeight: '900', 
                    backgroundColor: student.status === 'LULUS' ? '#dcfce7' : '#fee2e2', 
                    color: student.status === 'LULUS' ? '#15803d' : '#b91c1c', 
                    textTransform: 'uppercase'
                  }}>{student.status}</span>
                </td>
                <td style={{ padding: '1.25rem 1.5rem', textAlign: 'right' }}>
                  <div style={{ display: 'flex', gap: '0.25rem', justifyContent: 'flex-end' }}>
                    <button onClick={() => openStudentModal(student)} style={{ padding: '0.5rem', color: '#94a3b8', background: 'none', border: 'none', cursor: 'pointer' }}><Edit size={16} /></button>
                    <button onClick={() => handleDeleteStudent(student.id)} style={{ padding: '0.5rem', color: '#94a3b8', background: 'none', border: 'none', cursor: 'pointer' }}><Trash2 size={16} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>

        {/* Pagination Footer */}
        <div className="pagination-footer" style={{ padding: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#fff', borderTop: '1px solid #f1f5f9' }}>
          <div style={{ fontSize: '0.8rem', color: '#64748b' }}>
            Total <b>{totalEntries}</b> entri
          </div>
          <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
            <button 
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              style={{ padding: '0.4rem', borderRadius: '8px', border: '1px solid #e2e8f0', backgroundColor: 'white', color: currentPage === 1 ? '#cbd5e1' : '#64748b', cursor: currentPage === 1 ? 'not-allowed' : 'pointer' }}
            >
              <ChevronLeft size={16} />
            </button>
            <button style={{ padding: '0.4rem 0.8rem', borderRadius: '8px', backgroundColor: 'var(--primary-green)', color: 'white', fontWeight: '700', fontSize: '0.8rem', border: 'none' }}>{currentPage}</button>
            <button 
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              style={{ padding: '0.4rem', borderRadius: '8px', border: '1px solid #e2e8f0', backgroundColor: 'white', color: currentPage === totalPages ? '#cbd5e1' : '#64748b', cursor: currentPage === totalPages ? 'not-allowed' : 'pointer' }}
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default StudentManager;
