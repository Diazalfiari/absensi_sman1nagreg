import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Sidebar from '../../components/common/Sidebar';
import Footer from '../../components/common/Footer';
import Button from '../../components/common/Button';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import StudentList from '../../components/admin/class/StudentList';
import AddStudentModal from '../../components/admin/class/AddStudentModal';
import EditWaliKelasModal from '../../components/admin/class/EditWaliKelasModal';
import { dataKelas, dataSiswa, users } from '../../data/mockData';

const DetailKelas = () => {
  const { kelasId } = useParams();
  const navigate = useNavigate();
  
  const [kelasInfo, setKelasInfo] = useState(null);
  const [students, setStudents] = useState([]);
  const [isEditWaliKelasModalOpen, setIsEditWaliKelasModalOpen] = useState(false);
  const [allTeachers, setAllTeachers] = useState([]);
  
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [studentToRemove, setStudentToRemove] = useState(null);
  
  const [confirmMoveStudent, setConfirmMoveStudent] = useState(null);

  // Parse all available students from dataSiswa and users for the modal
  const [allStudents, setAllStudents] = useState([]);

  useEffect(() => {
    // Find class info
    const info = dataKelas.find(k => k.nama === kelasId);
    if (!info) {
      // Handle not found
      navigate('/admin/manajemen-kelas');
      return;
    }
    setKelasInfo(info);

    // Initialize class students from mockData
    const classStudents = dataSiswa[kelasId] || [];
    const formattedStudents = classStudents.map(s => ({...s, kelas: kelasId}));
    setStudents(formattedStudents);

    // Construct allStudents pool
    let pool = [];
    Object.keys(dataSiswa).forEach(key => {
      dataSiswa[key].forEach(s => {
        pool.push({...s, kelas: key});
      });
    });
    // Add users who are 'siswa' but might not be in dataSiswa
    users.filter(u => u.role === 'siswa').forEach(u => {
      if (!pool.find(p => p.nipd === u.nipd)) {
        pool.push({
          id: u.id + 1000, // mock unique id
          nipd: u.nipd,
          nama: u.nama,
          kelas: u.kelas
        });
      }
    });
    setAllStudents(pool);

    const teachers = users.filter(u => u.role === 'guru');
    setAllTeachers(teachers);

  }, [kelasId, navigate]);

  const handleBack = () => {
    navigate('/admin/manajemen-kelas');
  };

  const handleAddStudent = (student) => {
    if (student.kelas && student.kelas !== kelasId) {
      setConfirmMoveStudent(student);
      setIsAddModalOpen(false);
    } else {
      processAddStudent(student);
    }
  };

  const processAddStudent = (student) => {
    const newStudent = { ...student, kelas: kelasId };
    
    // Update local state
    setStudents(prev => [...prev, newStudent]);
    setAllStudents(prev => 
      prev.map(s => s.id === student.id ? newStudent : s)
    );
    
    setIsAddModalOpen(false);
    setConfirmMoveStudent(null);
  };

  const handleSaveWaliKelas = (newWaliKelas) => {
    setKelasInfo(prev => ({...prev, waliKelas: newWaliKelas}));
  };

  const handleRemoveStudentClick = (student) => {
    setStudentToRemove(student);
  };

  const handleConfirmRemove = () => {
    if (studentToRemove) {
      setStudents(prev => prev.filter(s => s.id !== studentToRemove.id));
      setAllStudents(prev => 
        prev.map(s => s.id === studentToRemove.id ? { ...s, kelas: null } : s)
      );
      setStudentToRemove(null);
    }
  };

  if (!kelasInfo) return null;

  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col">
      <Sidebar role="admin" />
      
      <main className="flex-1 lg:ml-72 p-6 lg:p-8 mt-16 lg:mt-0 transition-all duration-300">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Header & Back Button */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex items-center gap-4">
              <button 
                onClick={handleBack}
                className="p-2 hover:bg-zinc-800 rounded-lg text-zinc-400 hover:text-zinc-100 transition-colors border border-zinc-800"
              >
                ←
              </button>
              <div>
                <h2 className="text-2xl font-bold text-zinc-100">Detail Kelas {kelasInfo.nama}</h2>
                <p className="text-sm text-zinc-400 mt-1">
                  Kelola informasi dan daftar siswa kelas {kelasInfo.nama}
                </p>
              </div>
            </div>
            
            <Button 
              variant="primary" 
              onClick={() => setIsAddModalOpen(true)}
              className="flex items-center gap-2"
            >
              <span className="text-lg leading-none">+</span> Tambah Siswa
            </Button>
          </div>

          {/* Class Information Card */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 divide-y md:divide-y-0 md:divide-x divide-zinc-800">
              <div className="pt-4 md:pt-0">
                <p className="text-xs text-zinc-500 mb-1 uppercase tracking-wider font-semibold">Kelas</p>
                <p className="text-lg font-medium text-zinc-100">{kelasInfo.nama}</p>
              </div>
              <div className="pt-4 md:pt-0 md:px-6">
                <p className="text-xs text-zinc-500 mb-1 uppercase tracking-wider font-semibold">Wali Kelas</p>
                <div className="flex items-center gap-2">
                  <p className="text-lg font-medium text-zinc-100">{kelasInfo.waliKelas || '-'}</p>
                  <button 
                    onClick={() => setIsEditWaliKelasModalOpen(true)}
                    className="p-1 text-zinc-500 hover:text-primary-400 hover:bg-primary-500/10 rounded-md transition-colors"
                    title="Ubah Wali Kelas"
                  >
                    ✎
                  </button>
                </div>
              </div>
              <div className="pt-4 md:pt-0 md:px-6">
                <p className="text-xs text-zinc-500 mb-1 uppercase tracking-wider font-semibold">Jumlah Siswa</p>
                <p className="text-lg font-medium text-zinc-100">{students.length} Siswa</p>
              </div>
            </div>
          </div>

          {/* Students List */}
          <div>
            <h3 className="text-lg font-bold text-zinc-100 mb-4">Daftar Siswa</h3>
            <StudentList 
              students={students} 
              onRemove={handleRemoveStudentClick} 
            />
          </div>
        </div>
      </main>
      
      <Footer />

      {/* Modals */}
      {isAddModalOpen && (
        <AddStudentModal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          onAdd={handleAddStudent}
          allStudents={allStudents}
          currentClassId={kelasId}
        />
      )}

      {isEditWaliKelasModalOpen && (
        <EditWaliKelasModal
          isOpen={isEditWaliKelasModalOpen}
          onClose={() => setIsEditWaliKelasModalOpen(false)}
          onSave={handleSaveWaliKelas}
          allTeachers={allTeachers}
          currentWaliKelas={kelasInfo.waliKelas}
        />
      )}

      {/* Confirm Remove Dialog */}
      <ConfirmDialog
        isOpen={!!studentToRemove}
        onClose={() => setStudentToRemove(null)}
        onConfirm={handleConfirmRemove}
        title="Hapus Siswa dari Kelas"
        message={`Apakah Anda yakin ingin menghapus ${studentToRemove?.nama} dari kelas ${kelasId}? Data siswa tetap ada di sistem.`}
        confirmText="Ya, Hapus"
        cancelText="Batal"
        type="warning"
      />

      {/* Confirm Move Dialog */}
      <ConfirmDialog
        isOpen={!!confirmMoveStudent}
        onClose={() => {
            setConfirmMoveStudent(null);
            setIsAddModalOpen(true);
        }}
        onConfirm={() => processAddStudent(confirmMoveStudent)}
        title="Pindahkan Siswa"
        message={`Siswa ${confirmMoveStudent?.nama} sudah terdaftar di kelas ${confirmMoveStudent?.kelas}. Apakah Anda yakin ingin memindahkannya ke kelas ${kelasId}?`}
        confirmText={`Ya, Pindahkan ke ${kelasId}`}
        cancelText="Batal"
        type="warning"
      />
    </div>
  );
};

export default DetailKelas;
