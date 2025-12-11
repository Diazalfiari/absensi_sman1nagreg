import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../components/common/Sidebar';
import Card from '../../components/common/Card';
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
    <div className="bg-ink-900 min-h-screen text-white">
      <Sidebar role="guru" />
      <main className="px-4 sm:px-6 lg:px-10 pt-12 sm:pt-16 lg:pt-12 pb-12 lg:ml-72">
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="flex flex-col gap-2">
            <div>
              <p className="text-xs uppercase tracking-[0.4em] text-white/60">Jadwal Guru</p>
              <h1 className="text-3xl md:text-4xl font-display">Jadwal Mengajar</h1>
              <p className="text-white/70">Lihat jadwal mengajar Anda dalam kalender bulanan</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Calendar Section */}
            <div className="lg:col-span-2">
              <Card padding="lg">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-semibold">
                    {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
                  </h2>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handlePrevMonth}
                      className="w-10 h-10 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors border border-white/10"
                    >
                      <span className="text-xl">‹</span>
                    </button>
                    <button
                      onClick={handleNextMonth}
                      className="w-10 h-10 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors border border-white/10"
                    >
                      <span className="text-xl">›</span>
                    </button>
                  </div>
                </div>

                {/* Calendar Grid */}
                <div>
                  {/* Day Headers */}
                  <div className="grid grid-cols-7 gap-2 mb-3">
                    {['MIN', 'SEN', 'SEL', 'RAB', 'KAM', 'JUM', 'SAB'].map((day) => (
                      <div key={day} className="text-center text-xs font-semibold text-white/50 py-2">
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
                            relative aspect-square rounded-xl text-base font-medium transition-all
                            ${!day ? 'invisible' : ''}
                            ${!hasClass && day ? 'bg-white/5 text-white/40 cursor-default' : ''}
                            ${hasClass ? 'cursor-pointer hover:scale-105' : ''}
                            ${today && !isSelected ? 'ring-2 ring-emerald-500' : ''}
                            ${isSelected ? 'bg-emerald-600 text-white shadow-lg scale-105' : ''}
                            ${hasClass && !isSelected ? 'bg-white/10 text-white hover:bg-white/15' : ''}
                          `}
                        >
                          {day ? (
                            <>
                              <span className="relative z-10">{day.getDate()}</span>
                              {hasClass && !isSelected && (
                                <div className="absolute top-1 right-1 w-2 h-2 rounded-full bg-red-500"></div>
                              )}
                            </>
                          ) : ''}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Legend */}
                <div className="mt-6 pt-6 border-t border-white/10 flex flex-wrap gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded bg-white/10 border-2 border-emerald-500"></div>
                    <span className="text-white/70">Hari Ini</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded bg-white/10 relative">
                      <div className="absolute top-0 right-0 w-1.5 h-1.5 rounded-full bg-red-500"></div>
                    </div>
                    <span className="text-white/70">Ada Jadwal Mengajar</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded bg-emerald-600"></div>
                    <span className="text-white/70">Tanggal Terpilih</span>
                  </div>
                </div>
              </Card>
            </div>

            {/* Schedule Details Section */}
            <div className="lg:col-span-1">
              <Card padding="lg" className="sticky top-24">
                <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  📋 Detail Jadwal
                </h3>
                
                {selectedDate ? (
                  <div className="space-y-4">
                    <div className="glass-panel p-4 bg-primary-500/10 border-primary-500/30 rounded-xl">
                      <p className="text-sm text-white/60 mb-1">Tanggal Terpilih</p>
                      <p className="text-lg font-semibold">
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
                        <p className="text-sm font-medium text-white/70">
                          {selectedSchedules.length} Jadwal Mengajar
                        </p>
                        {selectedSchedules.map((schedule, idx) => (
                          <div 
                            key={idx}
                            className="glass-panel p-4 bg-white/5 border-white/10 rounded-xl space-y-3"
                          >
                            <div className="flex items-start justify-between">
                              <h4 className="font-semibold text-white">
                                {schedule.mataPelajaran}
                              </h4>
                              <span className="text-xs px-2 py-1 rounded-lg bg-primary-500/20 text-primary-300 border border-primary-500/30">
                                {schedule.kelas}
                              </span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-white/70">
                              <span>🕐</span>
                              <span>{schedule.jamMulai} - {schedule.jamSelesai}</span>
                            </div>
                            <Button 
                              size="sm" 
                              onClick={() => handleViewDetail(schedule)}
                              className="w-full"
                            >
                              📝 Lihat Detail
                            </Button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-white/50">
                        <p>Tidak ada jadwal pada tanggal ini</p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-12 text-white/50">
                    <div className="text-4xl mb-3">📅</div>
                    <p className="text-sm">Klik tanggal dengan penanda merah</p>
                    <p className="text-xs mt-1">untuk melihat detail jadwal</p>
                  </div>
                )}
              </Card>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default JadwalMengajar;
