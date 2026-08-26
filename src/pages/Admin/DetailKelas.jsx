import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Sidebar from '../../components/common/Sidebar';
import Footer from '../../components/common/Footer';
import Button from '../../components/common/Button';
import Notification from '../../components/common/Notification';
import StudentList from '../../components/admin/class/StudentList';
import AddStudentModal from '../../components/admin/class/AddStudentModal';
import EditWaliKelasModal from '../../components/admin/class/EditWaliKelasModal';
import PindahKelasModal from '../../components/admin/class/PindahKelasModal';
import KenaikanKelasModal from '../../components/admin/class/KenaikanKelasModal';
import KelulusanKelasModal from '../../components/admin/class/KelulusanKelasModal';
import { kelasService } from '../../services/kelasService';
import { userService } from '../../services/userService';

const DetailKelas = () => {
  const { kelasId } = useParams();
  const navigate = useNavigate();

  const [kelasInfo, setKelasInfo] = useState(null);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEditWaliKelasModalOpen, setIsEditWaliKelasModalOpen] = useState(false);
  const [allTeachers, setAllTeachers] = useState([]);
  const [allStudents, setAllStudents] = useState([]);
  const [allClasses, setAllClasses] = useState([]);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [studentToTransfer, setStudentToTransfer] = useState(null);
  const [isPromoteModalOpen, setIsPromoteModalOpen] = useState(false);
  const [isGraduateModalOpen, setIsGraduateModalOpen] = useState(false);

  // ── Notification Toast state ──
  const [notification, setNotification] = useState({
    isOpen: false,
    type: 'success',
    title: '',
    message: '',
  });

  const showNotification = (type, title, message) => {
    setNotification({
      isOpen: true,
      type,
      title,
      message,
    });
  };

  // ── Load Class Detail from MySQL ──
  const loadClassDetail = useCallback(async () => {
    try {
      setLoading(true);
      const detail = await kelasService.getClassDetail(kelasId);
      setKelasInfo(detail);
      setStudents(detail.students || []);
    } catch (err) {
      console.error('Gagal memuat detail kelas:', err);
      showNotification('error', 'Kelas Tidak Ditemukan', err.message || 'Gagal memuat detail kelas dari server.');
    } finally {
      setLoading(false);
    }
  }, [kelasId]);

  // ── Load Teachers, Students, & Classes for Modals ──
  const loadAuxData = useCallback(async () => {
    try {
      const [teachersRes, studentsRes, classesRes] = await Promise.all([
        userService.getUsers({ role: 'guru', limit: 200 }),
        userService.getUsers({ role: 'siswa', limit: 2000 }),
        kelasService.getAllClasses(),
      ]);

      setAllTeachers(teachersRes.data || []);
      setAllStudents(studentsRes.data || []);
      setAllClasses(classesRes || []);
    } catch (err) {
      console.error('Gagal memuat data pendukung kelas:', err);
    }
  }, []);

  useEffect(() => {
    loadClassDetail();
    loadAuxData();
  }, [loadClassDetail, loadAuxData]);

  const handleBack = () => {
    navigate('/admin/manajemen-kelas');
  };

  // ── Add / Mutate Students (Single / Multiple) to current class handler ──
  const handleAddStudents = async (selectedStudents) => {
    if (!selectedStudents || selectedStudents.length === 0) return;

    try {
      const studentIds = selectedStudents.map((s) => s.student_id || s.id);
      const targetClassId = kelasInfo?.id || kelasId;

      const res = await kelasService.mutateStudent(studentIds, targetClassId);

      const successMsg =
        selectedStudents.length === 1
          ? `Siswa '${selectedStudents[0].nama}' berhasil ditambahkan ke kelas ${kelasInfo?.nama_kelas || kelasId}.`
          : `Sebanyak ${res.count || selectedStudents.length} siswa berhasil ditambahkan / dimutasi ke kelas ${kelasInfo?.nama_kelas || kelasId}.`;

      showNotification('success', 'Mutasi Siswa Berhasil', successMsg);

      setIsAddModalOpen(false);
      await loadClassDetail();
      await loadAuxData();
    } catch (err) {
      showNotification('error', 'Gagal Menambahkan Siswa', err.message || 'Terjadi kesalahan saat memproses data siswa.');
    }
  };

  // ── Transfer Student to Another Class handler ──
  const handleTransferStudent = async (student, targetClass) => {
    try {
      const studentId = student.student_id || student.id;
      const targetClassId = targetClass.id || targetClass.nama_kelas;

      await kelasService.mutateStudent(studentId, targetClassId);
      showNotification(
        'success',
        'Siswa Berhasil Dipindahkan',
        `Siswa '${student.nama}' telah dipindahkan dari ${kelasInfo?.nama_kelas || kelasId} ke Kelas ${targetClass.nama_kelas}.`
      );

      setStudentToTransfer(null);
      await loadClassDetail();
      await loadAuxData();
    } catch (err) {
      showNotification('error', 'Gagal Memindahkan Siswa', err.message || 'Terjadi kesalahan saat memindahkan siswa.');
    }
  };

  // ── Kenaikan Kelas Handler (Kelas X & XI) ──
  const handlePromoteConfirm = async ({ targetClassId, studentIds }) => {
    try {
      const res = await kelasService.promoteClass(kelasInfo?.id || kelasId, { targetClassId, studentIds });
      showNotification(
        'success',
        'Kenaikan Kelas Berhasil',
        res.message || `Sebanyak ${studentIds.length} siswa berhasil dinaikkan ke kelas baru.`
      );
      await loadClassDetail();
      await loadAuxData();
    } catch (err) {
      showNotification('error', 'Gagal Memproses Kenaikan Kelas', err.message || 'Terjadi kesalahan saat menaikkan kelas.');
      throw err;
    }
  };

  // ── Kelulusan Siswa Handler (Kelas XII) ──
  const handleGraduateConfirm = async ({ studentIds }) => {
    try {
      const res = await kelasService.graduateClass(kelasInfo?.id || kelasId, { studentIds });
      showNotification(
        'success',
        'Kelulusan Berhasil Diproses',
        res.message || `Sebanyak ${studentIds.length} siswa dari kelas ${kelasInfo?.nama_kelas || kelasId} telah dinyatakan Lulus.`
      );
      await loadClassDetail();
      await loadAuxData();
    } catch (err) {
      showNotification('error', 'Gagal Memproses Kelulusan', err.message || 'Terjadi kesalahan saat meluluskan siswa.');
      throw err;
    }
  };

  // ── Save Wali Kelas handler ──
  const handleSaveWaliKelas = async (teacherObj) => {
    try {
      const teacherId = teacherObj.teacher_id || teacherObj.id;
      await kelasService.updateClass(kelasInfo.id, { waliKelasId: teacherId });
      showNotification(
        'success',
        'Wali Kelas Diperbarui',
        `Guru '${teacherObj.nama}' telah ditetapkan sebagai Wali Kelas ${kelasInfo.nama_kelas}.`
      );
      await loadClassDetail();
    } catch (err) {
      showNotification('error', 'Gagal Mengubah Wali Kelas', err.message || 'Terjadi kesalahan saat menyimpan wali kelas.');
    }
  };

  const isGrade12 = kelasInfo?.tingkat === 'XII' || (kelasInfo?.nama_kelas || '').startsWith('XII-');

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
                <h2 className="text-2xl font-bold text-zinc-100">
                  {loading ? 'Memuat Kelas...' : `Detail Kelas ${kelasInfo?.nama_kelas || kelasId}`}
                </h2>
                <p className="text-sm text-zinc-400 mt-1">
                  Kelola informasi rombel, mutasi siswa, kenaikan kelas, dan wali kelas
                </p>
              </div>
            </div>

            {/* Action Buttons: Naik Kelas (X/XI) / Lulus (XII) & Tambah Siswa */}
            <div className="flex flex-wrap items-center gap-2.5">
              {!loading && kelasInfo && !isGrade12 && (
                <button
                  type="button"
                  onClick={() => setIsPromoteModalOpen(true)}
                  disabled={students.length === 0}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm transition-all border border-[#30457f] bg-[#172654] text-[#aebcff] hover:bg-[#20346e] hover:border-[#4d69b3] disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                >
                  <span className="text-base leading-none">🎓</span> Naik Kelas
                </button>
              )}

              {!loading && kelasInfo && isGrade12 && (
                <button
                  type="button"
                  onClick={() => setIsGraduateModalOpen(true)}
                  disabled={students.length === 0}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm transition-all border border-emerald-500/40 bg-emerald-950/40 text-emerald-300 hover:bg-emerald-900/60 hover:border-emerald-500/60 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                >
                  <span className="text-base leading-none">🏆</span> Luluskan Siswa
                </button>
              )}

              <Button
                variant="primary"
                onClick={() => setIsAddModalOpen(true)}
                className="flex items-center gap-2"
                disabled={loading || !kelasInfo}
              >
                <span className="text-lg leading-none">+</span> Tambah Siswa
              </Button>
            </div>
          </div>

          {/* Class Information Card */}
          {loading ? (
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 animate-pulse">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="h-16 bg-zinc-800/60 rounded-lg" />
                <div className="h-16 bg-zinc-800/60 rounded-lg" />
                <div className="h-16 bg-zinc-800/60 rounded-lg" />
              </div>
            </div>
          ) : kelasInfo ? (
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 divide-y md:divide-y-0 md:divide-x divide-zinc-800">
                <div className="pt-4 md:pt-0">
                  <p className="text-xs text-zinc-500 mb-1 uppercase tracking-wider font-semibold">Nama Kelas &amp; Tingkat</p>
                  <p className="text-xl font-bold text-zinc-100">
                    Kelas {kelasInfo.nama_kelas}
                    <span className={`ml-2 text-xs font-normal px-2 py-0.5 rounded border ${
                      isGrade12
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                        : 'bg-primary-500/10 text-primary-400 border-primary-500/20'
                    }`}>
                      Tingkat {kelasInfo.tingkat} {isGrade12 ? '(Tingkat Akhir)' : ''}
                    </span>
                  </p>
                  <p className="text-xs text-zinc-500 mt-1">Tahun Ajaran: {kelasInfo.tahun_ajaran || '2025/2026'}</p>
                </div>
                <div className="pt-4 md:pt-0 md:px-6">
                  <p className="text-xs text-zinc-500 mb-1 uppercase tracking-wider font-semibold">Wali Kelas</p>
                  <div className="flex items-center gap-2">
                    <div>
                      <p className="text-lg font-medium text-zinc-100">{kelasInfo.nama_wali_kelas || 'Belum Ditetapkan'}</p>
                      {kelasInfo.nip_wali_kelas && (
                        <p className="text-xs text-zinc-500 font-mono">NIP: {kelasInfo.nip_wali_kelas}</p>
                      )}
                    </div>
                    <button
                      onClick={() => setIsEditWaliKelasModalOpen(true)}
                      className="p-1.5 text-zinc-400 hover:text-primary-400 hover:bg-primary-500/10 rounded-md transition-colors border border-zinc-700 ml-auto"
                      title="Ubah Wali Kelas"
                    >
                      ✎ Ubah
                    </button>
                  </div>
                </div>
                <div className="pt-4 md:pt-0 md:px-6">
                  <p className="text-xs text-zinc-500 mb-1 uppercase tracking-wider font-semibold">Total Siswa Terdaftar</p>
                  <p className="text-2xl font-bold text-zinc-100">{students.length} Siswa</p>
                  <p className="text-xs text-zinc-500 mt-1">
                    {isGrade12 ? 'Status: Calon Lulusan / Alumni' : 'Status: Siswa Aktif'}
                  </p>
                </div>
              </div>
            </div>
          ) : null}

          {/* Students List */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-lg font-bold text-zinc-100">Daftar Siswa Kelas {kelasInfo?.nama_kelas || kelasId}</h3>
              <span className="text-xs text-zinc-400">Total: {students.length} Siswa Aktif</span>
            </div>
            <StudentList
              students={students}
              onMutate={(student) => setStudentToTransfer(student)}
            />
          </div>
        </div>
      </main>

      <Footer />

      {/* Modals */}
      {/* 1. Modal Tambah Siswa ke Kelas Ini */}
      {isAddModalOpen && (
        <AddStudentModal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          onAdd={handleAddStudents}
          allStudents={allStudents}
          classList={allClasses}
          currentClassId={kelasInfo?.nama_kelas || kelasId}
        />
      )}

      {/* 2. Modal Pindah Kelas untuk Siswa Terpilih */}
      {studentToTransfer && (
        <PindahKelasModal
          isOpen={!!studentToTransfer}
          onClose={() => setStudentToTransfer(null)}
          onConfirm={handleTransferStudent}
          student={studentToTransfer}
          currentClassId={kelasInfo?.nama_kelas || kelasId}
          allClasses={allClasses}
        />
      )}

      {/* 3. Modal Kenaikan Kelas (Tingkat X & XI) */}
      {isPromoteModalOpen && (
        <KenaikanKelasModal
          isOpen={isPromoteModalOpen}
          onClose={() => setIsPromoteModalOpen(false)}
          onConfirm={handlePromoteConfirm}
          currentClass={kelasInfo}
          students={students}
          allClasses={allClasses}
        />
      )}

      {/* 4. Modal Kelulusan Siswa (Tingkat XII) */}
      {isGraduateModalOpen && (
        <KelulusanKelasModal
          isOpen={isGraduateModalOpen}
          onClose={() => setIsGraduateModalOpen(false)}
          onConfirm={handleGraduateConfirm}
          currentClass={kelasInfo}
          students={students}
        />
      )}

      {/* 5. Modal Ubah Wali Kelas */}
      {isEditWaliKelasModalOpen && (
        <EditWaliKelasModal
          isOpen={isEditWaliKelasModalOpen}
          onClose={() => setIsEditWaliKelasModalOpen(false)}
          onSave={handleSaveWaliKelas}
          allTeachers={allTeachers}
          currentWaliKelasId={kelasInfo?.wali_kelas_id}
          currentWaliKelasName={kelasInfo?.nama_wali_kelas}
        />
      )}

      {/* Toast Notification Component (z-[9999]) */}
      <Notification
        isOpen={notification.isOpen}
        type={notification.type}
        title={notification.title}
        message={notification.message}
        onClose={() => setNotification((prev) => ({ ...prev, isOpen: false }))}
      />
    </div>
  );
};

export default DetailKelas;
