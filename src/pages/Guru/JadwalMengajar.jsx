import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../components/common/Sidebar';
import Button from '../../components/common/Button';
import { getCurrentUser } from '../../utils/helpers';
import Footer from '../../components/common/Footer';

const JadwalMengajar = () => {
  const navigate = useNavigate();
  const currentUser = getCurrentUser();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);

  useEffect(() => {
    if (!currentUser || currentUser.role !== 'guru') {
      navigate('/login');
    }
  }, [currentUser, navigate]);

  // Mock data jadwal mengajar (tanggal-tanggal mengajar)
  // Format: { tanggal: 'YYYY-MM-DD', mataPelajaran: string, kelas: string, jamMulai: string, jamSelesai: string }
  const jadwalMengajar = [
    { tanggal: '2025-12-01', mataPelajaran: 'Matematika', kelas: 'X-1', jamMulai: '07:30', jamSelesai: '09:00' },
    { tanggal: '2025-12-02', mataPelajaran: 'Fisika', kelas: 'X-2', jamMulai: '09:15', jamSelesai: '10:45' },
    { tanggal: '2025-12-05', mataPelajaran: 'Matematika', kelas: 'X-1', jamMulai: '07:30', jamSelesai: '09:00' },
    { tanggal: '2025-12-08', mataPelajaran: 'Matematika', kelas: 'X-1', jamMulai: '07:30', jamSelesai: '09:00' },
    { tanggal: '2025-12-09', mataPelajaran: 'Fisika', kelas: 'X-2', jamMulai: '09:15', jamSelesai: '10:45' },
    { tanggal: '2025-12-12', mataPelajaran: 'Matematika', kelas: 'XI-3', jamMulai: '10:45', jamSelesai: '12:15' },
    { tanggal: '2025-12-15', mataPelajaran: 'Matematika', kelas: 'X-1', jamMulai: '07:30', jamSelesai: '09:00' },
    { tanggal: '2025-12-16', mataPelajaran: 'Fisika', kelas: 'X-2', jamMulai: '09:15', jamSelesai: '10:45' },
    { tanggal: '2025-12-19', mataPelajaran: 'Matematika', kelas: 'XI-3', jamMulai: '10:45', jamSelesai: '12:15' },
    { tanggal: '2025-12-22', mataPelajaran: 'Matematika', kelas: 'X-1', jamMulai: '07:30', jamSelesai: '09:00' },
    { tanggal: '2025-12-23', mataPelajaran: 'Fisika', kelas: 'X-2', jamMulai: '09:15', jamSelesai: '10:45' },
    { tanggal: '2025-12-26', mataPelajaran: 'Matematika', kelas: 'XI-3', jamMulai: '10:45', jamSelesai: '12:15' },
    { tanggal: '2025-12-29', mataPelajaran: 'Matematika', kelas: 'X-1', jamMulai: '07:30', jamSelesai: '09:00' },
    { tanggal: '2025-12-30', mataPelajaran: 'Fisika', kelas: 'X-2', jamMulai: '09:15', jamSelesai: '10:45' },
    // Agustus 2026
    { tanggal: '2026-08-03', mataPelajaran: 'Matematika', kelas: 'X-1', jamMulai: '08:50', jamSelesai: '10:30' },
    { tanggal: '2026-08-04', mataPelajaran: 'Matematika', kelas: 'XI-1', jamMulai: '07:30', jamSelesai: '09:00' },
    { tanggal: '2026-08-05', mataPelajaran: 'Matematika', kelas: 'XII-1', jamMulai: '09:15', jamSelesai: '10:45' },
    { tanggal: '2026-08-06', mataPelajaran: 'Matematika', kelas: 'XI-1', jamMulai: '10:45', jamSelesai: '12:15' },
    { tanggal: '2026-08-07', mataPelajaran: 'Matematika', kelas: 'X-1', jamMulai: '12:45', jamSelesai: '14:15' },
    { tanggal: '2026-08-10', mataPelajaran: 'Matematika', kelas: 'XII-1', jamMulai: '07:30', jamSelesai: '09:00' },
    { tanggal: '2026-08-11', mataPelajaran: 'Matematika', kelas: 'X-1', jamMulai: '09:15', jamSelesai: '10:45' },
    { tanggal: '2026-08-12', mataPelajaran: 'Matematika', kelas: 'XI-1', jamMulai: '08:50', jamSelesai: '10:30' },
    { tanggal: '2026-08-13', mataPelajaran: 'Matematika', kelas: 'XII-1', jamMulai: '10:45', jamSelesai: '12:15' },
    { tanggal: '2026-08-14', mataPelajaran: 'Matematika', kelas: 'X-1', jamMulai: '12:45', jamSelesai: '14:15' },
    { tanggal: '2026-08-17', mataPelajaran: 'Matematika', kelas: 'XII-1', jamMulai: '07:30', jamSelesai: '09:00' },
    { tanggal: '2026-08-18', mataPelajaran: 'Matematika', kelas: 'X-1', jamMulai: '09:15', jamSelesai: '10:45' },
    { tanggal: '2026-08-19', mataPelajaran: 'Matematika', kelas: 'X-1', jamMulai: '10:45', jamSelesai: '12:15' },
    { tanggal: '2026-08-20', mataPelajaran: 'Matematika', kelas: 'XI-1', jamMulai: '12:45', jamSelesai: '14:15' },
    { tanggal: '2026-08-21', mataPelajaran: 'Matematika', kelas: 'XII-1', jamMulai: '07:30', jamSelesai: '09:00' },
    { tanggal: '2026-08-24', mataPelajaran: 'Matematika', kelas: 'X-1', jamMulai: '08:50', jamSelesai: '10:30' },
    { tanggal: '2026-08-25', mataPelajaran: 'Matematika', kelas: 'XI-1', jamMulai: '07:30', jamSelesai: '09:00' },
    { tanggal: '2026-08-26', mataPelajaran: 'Matematika', kelas: 'XII-1', jamMulai: '09:15', jamSelesai: '10:45' },
    { tanggal: '2026-08-27', mataPelajaran: 'Matematika', kelas: 'XI-1', jamMulai: '10:45', jamSelesai: '12:15' },
    { tanggal: '2026-08-28', mataPelajaran: 'Matematika', kelas: 'X-1', jamMulai: '12:45', jamSelesai: '14:15' },
    { tanggal: '2026-08-31', mataPelajaran: 'Matematika', kelas: 'XII-1', jamMulai: '07:30', jamSelesai: '09:00' },
  ];

  const monthNames = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
  ];

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

  const hasSchedule = (date) => {
    if (!date) return false;
    const dateStr = date.toISOString().split('T')[0];
    return jadwalMengajar.some(jadwal => jadwal.tanggal === dateStr);
  };

  const getScheduleForDate = (date) => {
    if (!date) return [];
    const dateStr = date.toISOString().split('T')[0];
    return jadwalMengajar.filter(jadwal => jadwal.tanggal === dateStr);
  };

  const isToday = (date) => {
    if (!date) return false;
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const handlePrevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
    setSelectedDate(null);
  };

  const handleNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
    setSelectedDate(null);
  };

  const handleDateClick = (date) => {
    if (date && hasSchedule(date)) {
      setSelectedDate(date);
    }
  };

  const handleViewDetail = (schedule) => {
    navigate('/guru/detail-sesi', {
      state: {
        schedule: schedule,
        date: selectedDate
      }
    });
  };

  const days = getDaysInMonth(currentMonth);
  const selectedSchedules = selectedDate ? getScheduleForDate(selectedDate) : [];

  return (
    <div className="bg-zinc-950 min-h-[100dvh] text-zinc-50 selection:bg-primary-500/30">
      <Sidebar role="guru" />
      <main className="px-4 sm:px-6 lg:px-10 pt-12 sm:pt-16 lg:pt-12 pb-12 lg:ml-72">
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="flex flex-col gap-2">
            <div>
              <h1 className="text-3xl md:text-4xl font-display tracking-tight">Jadwal Mengajar</h1>
              <p className="text-zinc-400 mt-1">Lihat jadwal mengajar Anda dalam kalender bulanan</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Calendar Section */}
            <div className="lg:col-span-2">
              <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-semibold">
                    {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
                  </h2>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handlePrevMonth}
                      className="w-10 h-10 rounded-xl bg-zinc-900 hover:bg-zinc-800 flex items-center justify-center transition-colors border border-zinc-800"
                    >
                      <span className="text-xl">‹</span>
                    </button>
                    <button
                      onClick={handleNextMonth}
                      className="w-10 h-10 rounded-xl bg-zinc-900 hover:bg-zinc-800 flex items-center justify-center transition-colors border border-zinc-800"
                    >
                      <span className="text-xl">›</span>
                    </button>
                  </div>
                </div>

                {/* Calendar Grid */}
                <div>
                  {/* Day Headers */}
                  <div className="grid grid-cols-7 gap-2 mb-3">
                    {['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'].map((day) => (
                      <div key={day} className="text-center text-xs font-medium text-zinc-500 py-2">
                        {day}
                      </div>
                    ))}
                  </div>

                  {/* Calendar Days */}
                  <div className="grid grid-cols-7 gap-2">
                    {days.map((day, index) => {
                      const hasClass = hasSchedule(day);
                      const today = isToday(day);
                      const isSelected = selectedDate && day && selectedDate.toDateString() === day.toDateString();
                      
                      return (
                        <button
                          key={index}
                          onClick={() => handleDateClick(day)}
                          disabled={!day}
                          className={`
                            relative aspect-square rounded-xl text-base font-medium transition-colors
                            ${!day ? 'invisible' : ''}
                            ${!hasClass && day ? 'bg-zinc-950 text-zinc-600 cursor-default' : ''}
                            ${hasClass ? 'cursor-pointer hover:bg-zinc-800' : ''}
                            ${today && !isSelected ? 'ring-1 ring-emerald-500' : ''}
                            ${isSelected ? 'bg-emerald-600 text-zinc-50 shadow-sm' : ''}
                            ${hasClass && !isSelected ? 'bg-zinc-800 text-zinc-50' : ''}
                          `}
                        >
                          {day ? (
                            <>
                              <span className="relative z-10">{day.getDate()}</span>
                              {hasClass && !isSelected && (
                                <div className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-red-500"></div>
                              )}
                            </>
                          ) : ''}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Legend */}
                <div className="mt-6 pt-6 border-t border-zinc-800 flex flex-wrap gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded bg-zinc-950 border border-emerald-500"></div>
                    <span className="text-zinc-400">Hari Ini</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded bg-zinc-800 relative">
                      <div className="absolute top-0 right-0 w-1.5 h-1.5 rounded-full bg-red-500"></div>
                    </div>
                    <span className="text-zinc-400">Ada Jadwal Mengajar</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded bg-emerald-600"></div>
                    <span className="text-zinc-400">Tanggal Terpilih</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Schedule Details Section */}
            <div className="lg:col-span-1">
              <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 sticky top-24">
                <h3 className="text-lg font-medium mb-4 flex items-center gap-2 text-zinc-50">
                  Detail Jadwal
                </h3>
                
                {selectedDate ? (
                  <div className="space-y-4">
                    <div className="p-4 bg-primary-500/10 border border-primary-500/20 rounded-xl">
                      <p className="text-sm text-zinc-400 mb-1">Tanggal Terpilih</p>
                      <p className="text-base font-medium text-zinc-50">
                        {selectedDate.toLocaleDateString('id-ID', { 
                          weekday: 'long', 
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric' 
                        })}
                      </p>
                    </div>

                    {selectedSchedules.length > 0 ? (
                      <div className="space-y-3">
                        <p className="text-sm font-medium text-zinc-400">
                          {selectedSchedules.length} Jadwal Mengajar
                        </p>
                        {selectedSchedules.map((schedule, idx) => (
                          <div 
                            key={idx}
                            className="p-4 bg-zinc-950 border border-zinc-800 rounded-xl space-y-3"
                          >
                            <div className="flex items-start justify-between">
                              <h4 className="font-medium text-zinc-50">
                                {schedule.mataPelajaran}
                              </h4>
                              <span className="text-xs px-2 py-1 rounded-md bg-zinc-800 text-zinc-300 border border-zinc-800">
                                {schedule.kelas}
                              </span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-zinc-400">
                              <span>{schedule.jamMulai} - {schedule.jamSelesai}</span>
                            </div>
                            <Button 
                              size="sm" 
                              onClick={() => handleViewDetail(schedule)}
                              className="w-full"
                            >
                              Lihat Detail
                            </Button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-zinc-500">
                        <p>Tidak ada jadwal pada tanggal ini</p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-12 text-zinc-500">
                    <p className="text-sm">Pilih tanggal untuk melihat detail jadwal</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default JadwalMengajar;
