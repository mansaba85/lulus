import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Check, X, AlertTriangle, Menu } from 'lucide-react';
import { toast } from 'sonner';
import { useLocation, useNavigate } from 'react-router-dom';

// Import Components
import Sidebar from '../components/Dashboard/Sidebar';
import Overview from '../components/Dashboard/Overview';
import ClassManager from '../components/Dashboard/ClassManager';
import StudentManager from '../components/Dashboard/StudentManager';
import SettingsManager from '../components/Dashboard/SettingsManager';
import InfoManager from '../components/Dashboard/InfoManager';
import ClassModal from '../components/Dashboard/ClassModal';
import StudentModal from '../components/Dashboard/StudentModal';
import DeleteModal from '../components/Dashboard/DeleteModal';
import ImportPreviewModal from '../components/Dashboard/ImportPreviewModal';
import { api } from '../utils/api';
import * as XLSX from 'xlsx';

// Assets
import logo from '../assets/logo.png';

const Dashboard = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Auth Guard
  useEffect(() => {
    const isAuth = localStorage.getItem('isAdminAuthenticated');
    if (!isAuth) {
      navigate('/login');
    }
  }, [navigate]);
  
  // Determine active tab from URL
  const getTabFromPath = (path) => {
    if (path.includes('/admin/kelas')) return 'kelas';
    if (path.includes('/admin/siswa')) return 'siswa';
    if (path.includes('/admin/settings')) return 'settings';
    if (path.includes('/admin/informasi')) return 'informasi';
    return 'dashboard';
  };

  const [activeTab, setActiveTabState] = useState(getTabFromPath(location.pathname));

  // Sync state with URL changes
  useEffect(() => {
    setActiveTabState(getTabFromPath(location.pathname));
    setIsMobileMenuOpen(false); // Close menu on navigation
  }, [location.pathname]);

  const setActiveTab = (tab) => {
    const pathMap = {
      dashboard: '/admin',
      kelas: '/admin/kelas',
      siswa: '/admin/siswa',
      informasi: '/admin/informasi',
      settings: '/admin/settings'
    };
    navigate(pathMap[tab]);
  };

  // State Management
  const [classes, setClasses] = useState([]);
  const [students, setStudents] = useState([]);
  const [schoolName, setSchoolName] = useState('MA NU 01 Banyuputih');
  const [releaseDate, setReleaseDate] = useState('2026-05-15');
  const [releaseTime, setReleaseTime] = useState('10:00');
  const [schoolLogo, setSchoolLogo] = useState(logo);
  const [adminName, setAdminName] = useState('Admin Utama');

  // UI States
  const [newClassName, setNewClassName] = useState('');
  const [editingClass, setEditingClass] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [isStudentModalOpen, setIsStudentModalOpen] = useState(false);
  const [studentForm, setStudentForm] = useState({ nis: '', name: '', class: '', token: '', status: 'LULUS' });
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [importData, setImportData] = useState([]);
  const [isImportPreviewOpen, setIsImportPreviewOpen] = useState(false);

  // Data Fetching
  const fetchData = async () => {
    try {
      const [settingsData, classesData, studentsData] = await Promise.all([
        api.getSettings(),
        api.getClasses(),
        api.getStudents()
      ]);
      
      if (settingsData) {
        setSchoolName(settingsData.school_name || 'MA NU 01 Banyuputih');
        if (settingsData.release_date) {
          setReleaseDate(typeof settingsData.release_date === 'string' ? settingsData.release_date.split('T')[0] : '2026-05-15');
        }
        if (settingsData.release_time) {
          setReleaseTime(settingsData.release_time.substring(0, 5));
        }
        setSchoolLogo(settingsData.school_logo || logo);
      }
      
      setClasses(classesData);
      setStudents(studentsData);
    } catch (err) {
      toast.error('Gagal mengambil data dari server');
    }
  };

  const fetchAdmin = async () => {
    try {
      const data = await api.getAdmin();
      if (data && data.fullname) {
        setAdminName(data.fullname);
      }
    } catch (err) {
      console.error('Failed to fetch admin data');
    }
  };

  useEffect(() => {
    fetchData();
    fetchAdmin();
  }, []);

  const handleSaveSettings = async () => {
    try {
      // Format date to YYYY-MM-DD if it's a full ISO string
      const formattedDate = releaseDate.includes('T') ? releaseDate.split('T')[0] : releaseDate;
      
      await api.updateSettings({
        school_name: schoolName,
        release_date: formattedDate,
        release_time: releaseTime,
        school_logo: schoolLogo
      });
      toast.success('Pengaturan berhasil disimpan');
    } catch (err) {
      console.error('Failed to save settings:', err);
      toast.error('Gagal menyimpan pengaturan');
    }
  };

  // Class CRUD
  const confirmDeleteClass = (id) => {
    const cls = classes.find(c => c.id === id);
    setDeleteTarget({ id, type: 'kelas', name: cls?.name });
    setIsDeleteModalOpen(true);
  };

  const handleAddClass = async () => {
    if (!newClassName.trim()) return;
    try {
      if (editingClass) {
        await api.updateClass(editingClass.id, newClassName);
        toast.success('Kelas berhasil diperbarui');
      } else {
        await api.addClass(newClassName);
        toast.success('Kelas baru berhasil ditambahkan');
      }
      fetchData();
      closeModal();
    } catch (err) {
      toast.error('Gagal menyimpan data kelas');
    }
  };

  const openModal = (cls = null) => {
    setEditingClass(cls);
    setNewClassName(cls ? cls.name : '');
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingClass(null);
    setNewClassName('');
  };

  // Student CRUD

  const openStudentModal = (student = null) => {
    if (student) {
      setEditingStudent(student);
      setStudentForm({ ...student, class: student.class_name || student.class });
    } else {
      setEditingStudent(null);
      setStudentForm({ nis: '', name: '', class: classes[0]?.name || '', token: Math.random().toString(36).substring(2, 7).toUpperCase(), status: 'LULUS' });
    }
    setIsStudentModalOpen(true);
  };

  const closeStudentModal = () => {
    setIsStudentModalOpen(false);
    setEditingStudent(null);
  };

  const handleAddStudent = async () => {
    if (!studentForm.name || !studentForm.nis) {
      toast.error('Nama dan NIS wajib diisi!');
      return;
    }

    try {
      if (editingStudent) {
        await api.updateStudent(editingStudent.id, {
          nis: studentForm.nis,
          name: studentForm.name,
          class_name: studentForm.class,
          token: studentForm.token,
          status: studentForm.status
        });
        toast.success('Data siswa berhasil diperbarui');
      } else {
        await api.addStudent({
          nis: studentForm.nis,
          name: studentForm.name,
          class_name: studentForm.class,
          token: studentForm.token,
          status: studentForm.status
        });
        toast.success('Siswa baru berhasil ditambahkan');
      }
      fetchData();
      closeStudentModal();
    } catch (err) {
      toast.error('Gagal menyimpan data siswa (NIS mungkin sudah terdaftar)');
    }
  };

  const confirmDeleteStudent = (id) => {
    const student = students.find(s => s.id === id);
    setDeleteTarget({ id, type: 'siswa', name: student?.name });
    setIsDeleteModalOpen(true);
  };

  const handleImportStudents = (data) => {
    if (!data || data.length === 0) return;

    const formatted = data.map(s => ({
      nis: (s.NIS || s.nis || '').toString(),
      name: s.Nama || s.nama || '',
      class_name: s.Kelas || s.kelas || classes[0]?.name || '',
      token: (s.Token || s.token || Math.random().toString(36).substring(2, 7).toUpperCase()),
      status: (s.Status || s.status || 'LULUS').toUpperCase()
    }));

    setImportData(formatted);
    setIsImportPreviewOpen(true);
  };

  const executeImport = async () => {
    try {
      const loadingToast = toast.loading(`Mengimpor ${importData.length} data siswa...`);
      await api.bulkImportStudents(importData);
      toast.dismiss(loadingToast);
      toast.success(`${importData.length} data siswa berhasil diimpor!`);
      fetchData();
      setIsImportPreviewOpen(false);
      setImportData([]);
    } catch (err) {
      toast.error('Gagal mengimpor data. Pastikan format Excel benar.');
    }
  };

  const executeDelete = async () => {
    try {
      if (deleteTarget.type === 'kelas') {
        await api.deleteClass(deleteTarget.id);
        toast.success(`Kelas ${deleteTarget.name} berhasil dihapus`);
      } else {
        await api.deleteStudent(deleteTarget.id);
        toast.success(`Data siswa ${deleteTarget.name} berhasil dihapus`);
      }
      fetchData();
      setIsDeleteModalOpen(false);
      setDeleteTarget(null);
    } catch (err) {
      toast.error('Gagal menghapus data');
    }
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f8fafc' }}>
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        logo={schoolLogo} 
        isMobileMenuOpen={isMobileMenuOpen}
        setIsMobileMenuOpen={setIsMobileMenuOpen}
        adminName={adminName}
      />

      <main className="dashboard-main" style={{ 
        padding: '2.5rem 3.5rem', 
        marginLeft: '280px',
        width: 'calc(100% - 280px)',
        minHeight: '100vh'
      }}>
        {/* Mobile Header */}
        <div className="mobile-header" style={{ display: 'none', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
          <button 
            onClick={() => setIsMobileMenuOpen(true)}
            style={{ padding: '0.5rem', backgroundColor: 'white', borderRadius: '8px', border: '1px solid #e2e8f0', color: 'var(--primary-green)' }}
          >
            <Menu size={24} />
          </button>
          <h2 style={{ fontSize: '1.25rem', color: 'var(--primary-green)' }}>Admin Panel</h2>
        </div>

        <AnimatePresence mode="wait">
          {activeTab === 'dashboard' && (
              <Overview 
                key="dashboard"
                classesCount={classes.length} 
                studentsCount={students.length}
                lulusCount={students.filter(s => s.status === 'LULUS').length}
                tidakLulusCount={students.filter(s => s.status === 'TIDAK LULUS').length}
                recentStudents={students.slice(-5).reverse()}
                logo={schoolLogo} 
                setActiveTab={setActiveTab}
              />
          )}

          {activeTab === 'kelas' && (
            <ClassManager 
              key="kelas"
              classes={classes} 
              openModal={openModal} 
              handleDeleteClass={confirmDeleteClass} 
            />
          )}

          {activeTab === 'siswa' && (
            <StudentManager 
              key="siswa"
              classes={classes} 
              students={students}
              openStudentModal={openStudentModal}
              handleDeleteStudent={confirmDeleteStudent}
              handleImportStudents={handleImportStudents}
            />
          )}

          {activeTab === 'informasi' && (
            <InfoManager key="informasi" />
          )}

          {activeTab === 'settings' && (
            <SettingsManager 
              key="settings"
              schoolName={schoolName}
              setSchoolName={setSchoolName}
              releaseDate={releaseDate}
              setReleaseDate={setReleaseDate}
              releaseTime={releaseTime}
              setReleaseTime={setReleaseTime}
              schoolLogo={schoolLogo}
              setSchoolLogo={setSchoolLogo}
              handleSaveSettings={handleSaveSettings}
              onAdminUpdate={fetchAdmin}
            />
          )}
        </AnimatePresence>
      </main>

      {/* Modals Section */}
        <ClassModal 
          isOpen={isModalOpen}
          onClose={closeModal}
          onSave={handleAddClass}
          editingClass={editingClass}
          newClassName={newClassName}
          setNewClassName={setNewClassName}
        />

        <StudentModal 
          isOpen={isStudentModalOpen}
          onClose={closeStudentModal}
          onSave={handleAddStudent}
          editingStudent={editingStudent}
          studentForm={studentForm}
          setStudentForm={setStudentForm}
          classes={classes}
        />

        <DeleteModal 
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          onConfirm={executeDelete}
          targetName={deleteTarget?.name}
        />

        <ImportPreviewModal 
          isOpen={isImportPreviewOpen}
          onClose={() => setIsImportPreviewOpen(false)}
          onConfirm={executeImport}
          data={importData}
        />

        <style>{`
        .table-row:hover { background-color: #f8fafc !important; }
      `}</style>
    </div>
  );
};

export default Dashboard;
