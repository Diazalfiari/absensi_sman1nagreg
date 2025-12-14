import React, { useState } from 'react';
import Sidebar from '../../components/common/Sidebar';
import Button from '../../components/common/Button';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import Notification from '../../components/common/Notification';
import Footer from '../../components/common/Footer';

const TambahJadwal = () => {
  const [formData, setFormData] = useState({
    mataPelajaran: '',
    kelas: '',
    jamMulai: '',
    jamSelesai: '',
    guru: '',
  });

  const [selectedDates, setSelectedDates] = useState([]);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [errors, setErrors] = useState({});
  const [showConfirm, setShowConfirm] = useState(false);
  const [notification, setNotification] = useState({ isOpen: false, type: 'success', title: '', message: '' });

  // Generate calendar days
  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    
    // Add empty cells for days before month starts
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    // Add actual days
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
    
    // Clear error for this field when user types
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.mataPelajaran.trim()) {
      newErrors.mataPelajaran = 'Nama mata pelajaran harus diisi';
    }

    if (!formData.kelas) {
      newErrors.kelas = 'Kelas harus dipilih';
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

    if (!formData.guru.trim()) {
      newErrors.guru = 'Nama guru harus diisi';
    }

    if (selectedDates.length === 0) {
      newErrors.dates = 'Pilih minimal satu tanggal';
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

    // Show confirmation dialog
    setShowConfirm(true);
  };

  const handleConfirmSave = () => {
    // Sort dates for better display
    const sortedDates = [...selectedDates].sort((a, b) => a - b);
    
    // Format data untuk submit
    const jadwalData = {
      ...formData,
      tanggal: sortedDates.map(date => date.toISOString().split('T')[0]),
    };

    console.log('Data Jadwal:', jadwalData);
    console.log('Tanggal yang dipilih:', sortedDates.map(d => d.toLocaleDateString('id-ID')));
    
    // Close dialog and reset form
    setShowConfirm(false);
    handleReset();
    
    setNotification({
      isOpen: true,
      type: 'success',
      title: 'Jadwal Berhasil Ditambahkan!',
      message: `${sortedDates.length} jadwal pelajaran telah berhasil disimpan.`
    });
  };

  const handleReset = () => {
    setFormData({
      mataPelajaran: '',
      kelas: '',
      jamMulai: '',
      jamSelesai: '',
      guru: '',
    });
    setSelectedDates([]);
    setErrors({});
  };

  const formatSelectedDates = () => {
    if (selectedDates.length === 0) return 'Belum ada tanggal dipilih';
    
    const sorted = [...selectedDates].sort((a, b) => a - b);
    if (sorted.length <= 3) {
      return sorted.map(d => d.toLocaleDateString('id-ID')).join(', ');
    }
    
    return `${sorted.length} tanggal dipilih: ${sorted[0].toLocaleDateString('id-ID')} - ${sorted[sorted.length - 1].toLocaleDateString('id-ID')}`;
  };

  return (
    <div className="bg-ink-900 min-h-screen text-white">
      <Sidebar role="admin" />

      <main className="px-4 sm:px-6 lg:px-10 pt-12 sm:pt-16 lg:pt-12 pb-12 lg:ml-72">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <p className="text-xs uppercase tracking-[0.5em] text-white/50">Admin Panel</p>
            <h1 className="text-3xl md:text-4xl font-display">Tambah Jadwal Pelajaran</h1>
            <p className="text-white/70">Buat jadwal baru dengan multiple date selection</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Left Column - Form Fields */}
              <div className="space-y-6">
                <div className="glass-panel p-6 md:p-8">
                  <h2 className="text-xl font-semibold mb-6">Informasi Jadwal</h2>
                  
                  <div className="space-y-4">
                    {/* Mata Pelajaran */}
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Mata Pelajaran <span className="text-red-400">*</span>
                      </label>
                      <input
                        type="text"
                        name="mataPelajaran"
                        value={formData.mataPelajaran}
                        onChange={handleChange}
                        placeholder="Contoh: Matematika"
                        className={`w-full px-4 py-3 rounded-xl bg-white/5 border ${
                          errors.mataPelajaran ? 'border-red-500' : 'border-white/10'
                        } focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition-all`}
                      />
                      {errors.mataPelajaran && (
                        <p className="text-red-400 text-sm mt-1">{errors.mataPelajaran}</p>
                      )}
                    </div>

                    {/* Kelas */}
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Kelas <span className="text-red-400">*</span>
                      </label>
                      <select
                        name="kelas"
                        value={formData.kelas}
                        onChange={handleChange}
                        className={`w-full px-4 py-3 rounded-xl bg-white/5 border ${
                          errors.kelas ? 'border-red-500' : 'border-white/10'
                        } focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition-all dark-select`}
                      >
                        <option value="">Pilih Kelas</option>
                        <option value="X-1">X-1</option>
                        <option value="X-2">X-2</option>
                        <option value="X-3">X-3</option>
                        <option value="X-4">X-4</option>
                        <option value="X-5">X-5</option>
                        <option value="X-6">X-6</option>
                        <option value="X-7">X-7</option>
                        <option value="X-8">X-8</option>
                        <option value="X-9">X-9</option>
                        <option value="X-10">X-10</option>
                        <option value="X-11">X-11</option>
                        <option value="X-12">X-12</option>
                        <option value="XI-1">XI-1</option>
                        <option value="XI-2">XI-2</option>
                        <option value="XI-3">XI-3</option>
                        <option value="XI-4">XI-4</option>
                        <option value="XI-5">XI-5</option>
                        <option value="XI-6">XI-6</option>
                        <option value="XI-7">XI-7</option>
                        <option value="XI-8">XI-8</option>
                        <option value="XI-9">XI-9</option>
                        <option value="XI-10">XI-10</option>
                        <option value="XI-11">XI-11</option>
                        <option value="XI-12">XI-12</option>
                        <option value="XII-1">XII-1</option>
                        <option value="XII-2">XII-2</option>
                        <option value="XII-3">XII-3</option>
                        <option value="XII-4">XII-4</option>
                        <option value="XII-5">XII-5</option>
                        <option value="XII-6">XII-6</option>
                        <option value="XII-7">XII-7</option>
                        <option value="XII-8">XII-8</option>
                        <option value="XII-9">XII-9</option>
                        <option value="XII-10">XII-10</option>
                        <option value="XII-11">XII-11</option>
                        <option value="XII-12">XII-12</option>
                      </select>
                      {errors.kelas && (
                        <p className="text-red-400 text-sm mt-1">{errors.kelas}</p>
                      )}
                    </div>

                    {/* Jam Mulai & Selesai */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">
                          Jam Mulai <span className="text-red-400">*</span>
                        </label>
                        <input
                          type="time"
                          name="jamMulai"
                          value={formData.jamMulai}
                          onChange={handleChange}
                          className={`w-full px-4 py-3 rounded-xl bg-white/5 border ${
                            errors.jamMulai ? 'border-red-500' : 'border-white/10'
                          } focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition-all dark-select`}
                        />
                        {errors.jamMulai && (
                          <p className="text-red-400 text-sm mt-1">{errors.jamMulai}</p>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">
                          Jam Selesai <span className="text-red-400">*</span>
                        </label>
                        <input
                          type="time"
                          name="jamSelesai"
                          value={formData.jamSelesai}
                          onChange={handleChange}
                          className={`w-full px-4 py-3 rounded-xl bg-white/5 border ${
                            errors.jamSelesai ? 'border-red-500' : 'border-white/10'
                          } focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition-all dark-select`}
                        />
                        {errors.jamSelesai && (
                          <p className="text-red-400 text-sm mt-1">{errors.jamSelesai}</p>
                        )}
                      </div>
                    </div>

                    {/* Guru */}
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Nama Guru <span className="text-red-400">*</span>
                      </label>
                      <input
                        type="text"
                        name="guru"
                        value={formData.guru}
                        onChange={handleChange}
                        placeholder="Contoh: Budi Santoso, S.Pd"
                        className={`w-full px-4 py-3 rounded-xl bg-white/5 border ${
                          errors.guru ? 'border-red-500' : 'border-white/10'
                        } focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition-all`}
                      />
                      {errors.guru && (
                        <p className="text-red-400 text-sm mt-1">{errors.guru}</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Selected Dates Summary */}
                <div className="glass-panel p-6 bg-primary-500/10 border-primary-500/30">
                  <h3 className="text-sm font-semibold mb-2 flex items-center gap-2">
                    📅 Tanggal Terpilih
                  </h3>
                  <p className="text-white/80 text-sm">
                    {formatSelectedDates()}
                  </p>
                  {errors.dates && (
                    <p className="text-red-400 text-sm mt-2">{errors.dates}</p>
                  )}
                </div>
              </div>

              {/* Right Column - Calendar */}
              <div className="glass-panel p-6 md:p-8">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold">Pilih Tanggal</h2>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handlePrevMonth}
                      className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors"
                    >
                      ‹
                    </button>
                    <span className="text-sm font-medium min-w-[140px] text-center">
                      {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
                    </span>
                    <button
                      type="button"
                      onClick={handleNextMonth}
                      className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors"
                    >
                      ›
                    </button>
                  </div>
                </div>

                {/* Calendar Grid */}
                <div className="mb-4">
                  <div className="grid grid-cols-7 gap-2 mb-2">
                    {['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'].map((day) => (
                      <div key={day} className="text-center text-xs font-medium text-white/50 py-2">
                        {day}
                      </div>
                    ))}
                  </div>
                  <div className="grid grid-cols-7 gap-2">
                    {days.map((day, index) => {
                      const isSelected = isDateSelected(day);
                      const isPast = day && day < new Date().setHours(0, 0, 0, 0);
                      
                      return (
                        <button
                          key={index}
                          type="button"
                          onClick={() => toggleDate(day)}
                          disabled={!day || isPast}
                          className={`
                            aspect-square rounded-lg text-sm font-medium transition-all
                            ${!day ? 'invisible' : ''}
                            ${isPast ? 'opacity-30 cursor-not-allowed' : 'cursor-pointer'}
                            ${
                              isSelected
                                ? 'bg-primary-500 text-white shadow-lg scale-105'
                                : day
                                ? 'bg-white/5 hover:bg-white/10 text-white/80'
                                : ''
                            }
                          `}
                        >
                          {day ? day.getDate() : ''}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="border-t border-white/10 pt-4 space-y-2 text-xs text-white/60">
                  <p>💡 Klik tanggal untuk memilih/membatalkan</p>
                  <p>💡 Anda bisa memilih beberapa tanggal sekaligus</p>
                  <p>💡 Tanggal yang sudah lewat tidak bisa dipilih</p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-end">
              <Button type="button" variant="secondary" onClick={handleReset}>
                Reset Form
              </Button>
              <Button type="submit">
                Simpan Jadwal
              </Button>
            </div>
          </form>

          {/* Info Card */}
          <div className="glass-panel p-6 mt-6 bg-accent-500/10 border-accent-500/30">
            <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
              ℹ️ Panduan Pengisian
            </h3>
            <ul className="text-sm text-white/70 space-y-1">
              <li>• <strong>Mata Pelajaran:</strong> Nama mata pelajaran (wajib diisi)</li>
              <li>• <strong>Kelas:</strong> Pilih kelas yang akan mengikuti pelajaran</li>
              <li>• <strong>Jam:</strong> Waktu mulai harus lebih awal dari waktu selesai</li>
              <li>• <strong>Guru:</strong> Nama lengkap guru pengampu</li>
              <li>• <strong>Tanggal:</strong> Pilih satu atau beberapa tanggal dari kalender</li>
            </ul>
          </div>
        </div>
      </main>

      <Footer />

      {/* Notification */}
      <Notification
        isOpen={notification.isOpen}
        type={notification.type}
        title={notification.title}
        message={notification.message}
        onClose={() => setNotification({ ...notification, isOpen: false })}
        duration={3000}
      />

      {/* Confirmation Dialog */}
      <ConfirmDialog
        isOpen={showConfirm}
        onClose={() => setShowConfirm(false)}
        onConfirm={handleConfirmSave}
        title="Konfirmasi Simpan Jadwal"
        message={`Apakah Anda yakin ingin menyimpan jadwal mata pelajaran "${formData.mataPelajaran}" untuk kelas ${formData.kelas}?`}
        confirmText="Ya, Simpan"
        cancelText="Batal"
        type="info"
      />
    </div>
  );
};

export default TambahJadwal;
