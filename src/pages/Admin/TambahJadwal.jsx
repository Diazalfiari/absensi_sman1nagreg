import React, { useState, useEffect, useCallback } from 'react';
import Sidebar from '../../components/common/Sidebar';
import Button from '../../components/common/Button';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import Notification from '../../components/common/Notification';
import Footer from '../../components/common/Footer';
import { kelasService } from '../../services/kelasService';
import { userService } from '../../services/userService';
import { jadwalService } from '../../services/jadwalService';

const DAY_NAMES_ID = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];

const TambahJadwal = () => {
  const [formData, setFormData] = useState({
    mapelId: '',
    kelasId: '',
    teacherId: '',
    jamMulai: '07:30',
    jamSelesai: '09:00',
    ruang: '',
  });

  const [selectedDates, setSelectedDates] = useState([]);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [errors, setErrors] = useState({});
  const [showConfirm, setShowConfirm] = useState(false);
  const [loadingSave, setLoadingSave] = useState(false);
  const [notification, setNotification] = useState({ isOpen: false, type: 'success', title: '', message: '' });

  // Auxiliary data from MySQL
  const [classesList, setClassesList] = useState([]);
  const [subjectsList, setSubjectsList] = useState([]);
  const [teachersList, setTeachersList] = useState([]);

  const loadData = useCallback(async () => {
    try {
      const [clsData, subData, tchData] = await Promise.all([
        kelasService.getAllClasses(),
        jadwalService.getAllSubjects(),
        userService.getUsers({ role: 'guru', limit: 200 }),
      ]);
      setClassesList(clsData || []);
      setSubjectsList(subData || []);
      setTeachersList(tchData.data || []);
    } catch (err) {
      console.error('Gagal memuat data pendukung jadwal:', err);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Generate calendar days
  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }
    return days;
  };

  const days = getDaysInMonth(currentMonth);
  const monthNames = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
  ];

  const isDateSelected = (date) => {
    if (!date) return false;
    return selectedDates.some(
      (selectedDate) => selectedDate.toDateString() === date.toDateString()
    );
  };

  const toggleDate = (date) => {
    if (!date) return;
    if (isDateSelected(date)) {
      setSelectedDates(selectedDates.filter(
        (selectedDate) => selectedDate.toDateString() !== date.toDateString()
      ));
    } else {
      setSelectedDates([...selectedDates, date]);
    }
  };

  const handlePrevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.mapelId) {
      newErrors.mapelId = 'Mata pelajaran wajib dipilih';
    }

    if (!formData.kelasId) {
      newErrors.kelasId = 'Kelas wajib dipilih';
    }

    if (!formData.teacherId) {
      newErrors.teacherId = 'Guru pengampu wajib dipilih';
    }

    if (!formData.jamMulai) {
      newErrors.jamMulai = 'Jam mulai harus diisi';
    }

    if (!formData.jamSelesai) {
      newErrors.jamSelesai = 'Jam selesai harus diisi';
    }

    if (formData.jamMulai && formData.jamSelesai && formData.jamMulai >= formData.jamSelesai) {
      newErrors.jamSelesai = 'Jam selesai harus lebih besar dari jam mulai';
    }

    if (selectedDates.length === 0) {
      newErrors.dates = 'Pilih minimal satu hari / tanggal pertemuan pada kalender';
    }

    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    setShowConfirm(true);
  };

  const handleConfirmSave = async () => {
    try {
      setLoadingSave(true);

      const formatDateLocal = (date) => {
        const y = date.getFullYear();
        const m = String(date.getMonth() + 1).padStart(2, '0');
        const d = String(date.getDate()).padStart(2, '0');
        return `${y}-${m}-${d}`;
      };

      // Kelompokkan tanggal-tanggal terpilih berdasarkan hari
      const dayGroups = {};
      for (const date of selectedDates) {
        const dayName = DAY_NAMES_ID[date.getDay()];
        if (!dayGroups[dayName]) {
          dayGroups[dayName] = [];
        }
        dayGroups[dayName].push(formatDateLocal(date));
      }

      const targetClassObj = classesList.find((c) => c.id.toString() === formData.kelasId.toString());
      const defaultRuang = formData.ruang || (targetClassObj ? `Kelas ${targetClassObj.nama_kelas}` : 'Kelas');

      for (const [hari, dates] of Object.entries(dayGroups)) {
        await jadwalService.createSchedule({
          mapelId: formData.mapelId,
          kelasId: formData.kelasId,
          teacherId: formData.teacherId,
          hari,
          jamMulai: formData.jamMulai,
          jamSelesai: formData.jamSelesai,
          ruang: defaultRuang,
          status: 'Offline',
          selectedDates: dates,
          tanggalSpesifik: dates,
        });
      }

      setShowConfirm(false);
      handleReset();

      setNotification({
        isOpen: true,
        type: 'success',
        title: 'Jadwal Berhasil Disimpan!',
        message: `Jadwal pelajaran telah berhasil disimpan untuk ${selectedDates.length} tanggal pertemuan.`,
      });
    } catch (err) {
      setNotification({
        isOpen: true,
        type: 'error',
        title: 'Gagal Menyimpan Jadwal',
        message: err.message || 'Terjadi kesalahan saat menyimpan jadwal.',
      });
    } finally {
      setLoadingSave(false);
    }
  };

  const handleReset = () => {
    setFormData({
      mapelId: '',
      kelasId: '',
      teacherId: '',
      jamMulai: '07:30',
      jamSelesai: '09:00',
      ruang: '',
    });
    setSelectedDates([]);
    setErrors({});
  };

  const formatSelectedDates = () => {
    if (selectedDates.length === 0) return 'Belum ada tanggal dipilih';
    const sorted = [...selectedDates].sort((a, b) => a - b);
    if (sorted.length <= 3) {
      return sorted.map((d) => d.toLocaleDateString('id-ID')).join(', ');
    }
    return `${sorted.length} tanggal dipilih: ${sorted[0].toLocaleDateString('id-ID')} - ${sorted[sorted.length - 1].toLocaleDateString('id-ID')}`;
  };

  return (
    <div className="bg-zinc-950 min-h-[100dvh] text-zinc-50 selection:bg-primary-500/30">
      <Sidebar role="admin" />

      <main className="px-4 sm:px-6 lg:px-10 pt-12 sm:pt-16 lg:pt-12 pb-12 lg:ml-72">
        <div className="max-w-7xl mx-auto space-y-6">
          <div>
            <h1 className="text-3xl md:text-4xl font-display tracking-tight">Tambah Jadwal Pelajaran</h1>
            <p className="text-zinc-400 mt-1">Buat jadwal baru dengan seleksi tanggal dan hari yang fleksibel</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Left Column - Form Fields */}
              <div className="space-y-6">
                <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 md:p-8">
                  <h2 className="text-xl font-medium mb-6 text-zinc-50">Informasi Jadwal</h2>
                  
                  <div className="space-y-4">
                    {/* Mata Pelajaran */}
                    <div>
                      <label className="block text-sm font-medium mb-2 text-zinc-300">
                        Mata Pelajaran <span className="text-red-400">*</span>
                      </label>
                      <select
                        name="mapelId"
                        value={formData.mapelId}
                        onChange={handleChange}
                        className={`w-full px-4 py-3 rounded-xl bg-zinc-950 border ${
                          errors.mapelId ? 'border-red-500' : 'border-zinc-800'
                        } focus:border-primary-500 focus:ring-1 focus:ring-primary-500 outline-none transition-all text-zinc-50 font-medium`}
                      >
                        <option value="">Pilih Mata Pelajaran</option>
                        {subjectsList.map((sub) => (
                          <option key={sub.id} value={sub.id}>
                            {sub.nama_mapel} ({sub.kode_mapel})
                          </option>
                        ))}
                      </select>
                      {errors.mapelId && (
                        <p className="text-red-400 text-sm mt-1">{errors.mapelId}</p>
                      )}
                    </div>

                    {/* Kelas */}
                    <div>
                      <label className="block text-sm font-medium mb-2 text-zinc-300">
                        Kelas <span className="text-red-400">*</span>
                      </label>
                      <select
                        name="kelasId"
                        value={formData.kelasId}
                        onChange={handleChange}
                        className={`w-full px-4 py-3 rounded-xl bg-zinc-950 border ${
                          errors.kelasId ? 'border-red-500' : 'border-zinc-800'
                        } focus:border-primary-500 focus:ring-1 focus:ring-primary-500 outline-none transition-all text-zinc-50 font-medium`}
                      >
                        <option value="">Pilih Kelas Rombel</option>
                        {classesList.map((cls) => (
                          <option key={cls.id} value={cls.id}>
                            Kelas {cls.nama_kelas} (Tingkat {cls.tingkat})
                          </option>
                        ))}
                      </select>
                      {errors.kelasId && (
                        <p className="text-red-400 text-sm mt-1">{errors.kelasId}</p>
                      )}
                    </div>

                    {/* Guru Pengampu */}
                    <div>
                      <label className="block text-sm font-medium mb-2 text-zinc-300">
                        Guru Pengampu <span className="text-red-400">*</span>
                      </label>
                      <select
                        name="teacherId"
                        value={formData.teacherId}
                        onChange={handleChange}
                        className={`w-full px-4 py-3 rounded-xl bg-zinc-950 border ${
                          errors.teacherId ? 'border-red-500' : 'border-zinc-800'
                        } focus:border-primary-500 focus:ring-1 focus:ring-primary-500 outline-none transition-all text-zinc-50 font-medium`}
                      >
                        <option value="">Pilih Guru Pengampu</option>
                        {teachersList.map((t) => (
                          <option key={t.teacher_id || t.id} value={t.teacher_id || t.id}>
                            {t.nama} {t.nip ? `(NIP: ${t.nip})` : ''}
                          </option>
                        ))}
                      </select>
                      {errors.teacherId && (
                        <p className="text-red-400 text-sm mt-1">{errors.teacherId}</p>
                      )}
                    </div>

                    {/* Jam Mulai & Jam Selesai */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2 text-zinc-300">
                          Jam Mulai <span className="text-red-400">*</span>
                        </label>
                        <input
                          type="time"
                          name="jamMulai"
                          value={formData.jamMulai}
                          onChange={handleChange}
                          className={`w-full px-4 py-3 rounded-xl bg-zinc-950 border ${
                            errors.jamMulai ? 'border-red-500' : 'border-zinc-800'
                          } focus:border-primary-500 focus:ring-1 focus:ring-primary-500 outline-none transition-all text-zinc-50`}
                        />
                        {errors.jamMulai && (
                          <p className="text-red-400 text-sm mt-1">{errors.jamMulai}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2 text-zinc-300">
                          Jam Selesai <span className="text-red-400">*</span>
                        </label>
                        <input
                          type="time"
                          name="jamSelesai"
                          value={formData.jamSelesai}
                          onChange={handleChange}
                          className={`w-full px-4 py-3 rounded-xl bg-zinc-950 border ${
                            errors.jamSelesai ? 'border-red-500' : 'border-zinc-800'
                          } focus:border-primary-500 focus:ring-1 focus:ring-primary-500 outline-none transition-all text-zinc-50`}
                        />
                        {errors.jamSelesai && (
                          <p className="text-red-400 text-sm mt-1">{errors.jamSelesai}</p>
                        )}
                      </div>
                    </div>

                    {/* Ruang Kelas / Lab */}
                    <div>
                      <label className="block text-sm font-medium mb-2 text-zinc-300">
                        Ruang Pembelajaran (Opsional)
                      </label>
                      <input
                        type="text"
                        name="ruang"
                        value={formData.ruang}
                        onChange={handleChange}
                        placeholder="Contoh: Lab Fisika / Ruang Kelas"
                        className="w-full px-4 py-3 rounded-xl bg-zinc-950 border border-zinc-800 focus:border-primary-500 focus:ring-1 focus:ring-primary-500 outline-none transition-all text-zinc-50 placeholder-zinc-500"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column - Calendar Selection */}
              <div className="space-y-6">
                <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 md:p-8">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h2 className="text-xl font-medium text-zinc-50">Pilih Tanggal &amp; Hari Pertemuan</h2>
                      <p className="text-xs text-zinc-400 mt-1">Klik pada kalender untuk menandai hari jadwal</p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={handlePrevMonth}
                        className="p-2 rounded-xl bg-zinc-950 hover:bg-zinc-800 text-zinc-300 hover:text-zinc-50 transition-colors border border-zinc-800"
                      >
                        ←
                      </button>
                      <button
                        type="button"
                        onClick={handleNextMonth}
                        className="p-2 rounded-xl bg-zinc-950 hover:bg-zinc-800 text-zinc-300 hover:text-zinc-50 transition-colors border border-zinc-800"
                      >
                        →
                      </button>
                    </div>
                  </div>

                  <div className="text-center font-semibold mb-4 text-base text-zinc-200">
                    {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
                  </div>

                  {/* Calendar Grid */}
                  <div className="grid grid-cols-7 gap-2 mb-4">
                    {['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'].map((day) => (
                      <div key={day} className="text-center text-xs font-semibold text-zinc-500 py-2">
                        {day}
                      </div>
                    ))}
                    {days.map((date, index) => {
                      if (!date) {
                        return <div key={`empty-${index}`} className="aspect-square" />;
                      }

                      const selected = isDateSelected(date);
                      const isPast = date < new Date().setHours(0, 0, 0, 0);

                      return (
                        <button
                          key={date.toISOString()}
                          type="button"
                          onClick={() => toggleDate(date)}
                          className={`aspect-square rounded-xl flex items-center justify-center text-sm font-semibold transition-all ${
                            selected
                              ? 'bg-[#e5ba4b] text-[#172654] font-bold shadow-md shadow-[#e5ba4b]/20 scale-105'
                              : isPast
                              ? 'text-zinc-600 hover:bg-zinc-800/40'
                              : 'text-zinc-300 hover:bg-zinc-800 hover:text-zinc-50'
                          }`}
                        >
                          {date.getDate()}
                        </button>
                      );
                    })}
                  </div>

                  {errors.dates && (
                    <p className="text-red-400 text-sm mb-4">{errors.dates}</p>
                  )}

                  {/* Selected Dates Summary */}
                  <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800">
                    <p className="text-xs font-medium text-zinc-500 uppercase tracking-wider mb-1">
                      Hari Terpilih
                    </p>
                    <p className="text-sm font-medium text-zinc-200">{formatSelectedDates()}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 pt-4 border-t border-zinc-800">
              <Button type="button" variant="outline" onClick={handleReset} disabled={loadingSave}>
                Reset Form
              </Button>
              <Button type="submit" variant="primary" disabled={loadingSave} className="!bg-[#e5ba4b] !text-[#172654] hover:!bg-[#f0cb69]">
                {loadingSave ? 'Menyimpan...' : 'Simpan Jadwal Pelajaran'}
              </Button>
            </div>
          </form>
        </div>
      </main>

      <Footer />

      <ConfirmDialog
        isOpen={showConfirm}
        onClose={() => setShowConfirm(false)}
        onConfirm={handleConfirmSave}
        title="Konfirmasi Tambah Jadwal"
        message={`Apakah Anda yakin ingin menyimpan jadwal pelajaran ini?`}
        confirmText="Ya, Simpan Jadwal"
        cancelText="Batal"
        type="info"
      />

      <Notification
        isOpen={notification.isOpen}
        type={notification.type}
        title={notification.title}
        message={notification.message}
        onClose={() => setNotification({ ...notification, isOpen: false })}
        duration={3000}
      />
    </div>
  );
};

export default TambahJadwal;
