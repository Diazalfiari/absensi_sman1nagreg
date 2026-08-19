import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../components/common/Sidebar';
import { getCurrentUser } from '../../utils/helpers';
import { jadwalPelajaranSiswa } from '../../data/mockData';
import Footer from '../../components/common/Footer';

const JadwalPelajaran = () => {
  const navigate = useNavigate();
  const currentUser = getCurrentUser();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());

  useEffect(() => {
    if (!currentUser || currentUser.role !== 'siswa') {
      navigate('/login');
    }
  }, [currentUser, navigate]);

  const monthNames = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
  ];

  const dayNames = ['MIN', 'SEN', 'SEL', 'RAB', 'KAM', 'JUM', 'SAB'];

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

  const hasSchedule = (date) => {
    if (!date) return false;
    const dateStr = date.toISOString().split('T')[0];
    return jadwalPelajaranSiswa[dateStr] !== undefined;
  };

  const isToday = (date) => {
    if (!date) return false;
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const isSelected = (date) => {
    if (!date || !selectedDate) return false;
    return date.toDateString() === selectedDate.toDateString();
  };

  const handlePrevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
  };

  const handleDateClick = (date) => {
    if (date) {
      setSelectedDate(date);
    }
  };

  const days = getDaysInMonth(currentMonth);
  const dateStr = selectedDate ? selectedDate.toISOString().split('T')[0] : '';
  const selectedSchedule = jadwalPelajaranSiswa[dateStr] || [];

  return (
    <div className="bg-zinc-950 min-h-[100dvh] text-zinc-50 selection:bg-primary-500/30">
      <Sidebar role="siswa" />
      
      <main className="px-4 sm:px-6 lg:px-10 pt-12 sm:pt-16 lg:pt-12 pb-12 lg:ml-72">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Header */}
          <div className="flex items-center gap-4 mb-6">
            <button
              onClick={() => navigate(-1)}
              className="text-zinc-400 hover:text-zinc-50 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <h1 className="text-3xl md:text-4xl font-display tracking-tight">Jadwal</h1>
          </div>

          {/* Main Content - Calendar and Schedule Side by Side */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Side - Calendar */}
            <div>
              <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
                {/* Month Navigation */}
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <p className="text-sm font-medium text-zinc-400">{currentMonth.getFullYear()}</p>
                    <h2 className="text-2xl font-semibold text-zinc-50">{monthNames[currentMonth.getMonth()]}</h2>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handlePrevMonth}
                      className="w-10 h-10 rounded-lg bg-zinc-950 hover:bg-zinc-800 flex items-center justify-center transition-colors border border-zinc-800"
                    >
                      <span className="text-xl">‹</span>
                    </button>
                    <button
                      onClick={handleNextMonth}
                      className="w-10 h-10 rounded-lg bg-zinc-950 hover:bg-zinc-800 flex items-center justify-center transition-colors border border-zinc-800"
                    >
                      <span className="text-xl">›</span>
                    </button>
                  </div>
                </div>

                {/* Day Headers */}
                <div className="grid grid-cols-7 gap-2 mb-3">
                  {dayNames.map((day) => (
                    <div key={day} className="text-center text-xs font-medium text-zinc-500 py-2">
                      {day}
                    </div>
                  ))}
                </div>

                {/* Calendar Days */}
                <div className="grid grid-cols-7 gap-1 md:gap-2">
                  {days.map((day, index) => {
                    const hasJadwal = hasSchedule(day);
                    const today = isToday(day);
                    const selected = isSelected(day);
                    
                    return (
                      <button
                        key={index}
                        onClick={() => handleDateClick(day)}
                        disabled={!day}
                        className={`
                          relative aspect-square rounded-lg text-sm md:text-base font-medium transition-colors
                          ${!day ? 'invisible' : ''}
                          ${today && !selected ? 'ring-1 ring-emerald-500' : ''}
                          ${selected ? 'bg-emerald-600 text-zinc-50' : ''}
                          ${!selected && day ? 'hover:bg-zinc-800 text-zinc-400 bg-zinc-950' : ''}
                          ${!day ? '' : 'cursor-pointer'}
                        `}
                      >
                        {day && (
                          <>
                            <span className="relative z-10">{day.getDate()}</span>
                            {hasJadwal && (
                              <div className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-red-500"></div>
                            )}
                          </>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Right Side - Schedule Details */}
            <div className="space-y-4">
              {selectedDate && (
                <>
                  <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
                    <p className="text-sm font-medium text-zinc-400 mb-1">Jadwal Kelas</p>
                    <h3 className="text-xl font-medium text-zinc-50">
                      {selectedDate.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long' })}
                    </h3>
                  </div>

                  {selectedSchedule.length > 0 ? (
                    <div className="space-y-4">
                      {selectedSchedule.map((jadwal) => (
                        <div key={jadwal.id} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
                          <div className="space-y-4">
                            <div className="flex items-start justify-between">
                              <h4 className="text-lg font-medium text-zinc-50">{jadwal.mataPelajaran}</h4>
                              <span className="px-3 py-1 bg-zinc-950 text-zinc-300 border border-zinc-800 rounded-full text-xs font-medium">
                                {jadwal.status} - {jadwal.ruang}
                              </span>
                            </div>
                            
                            <div className="flex items-center gap-4 text-sm text-zinc-400">
                              <div className="flex items-center gap-2">
                                <span className="font-medium text-zinc-300">Kelas</span>
                                <span>{jadwal.kelas}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="font-medium text-zinc-300">Waktu</span>
                                <span>{jadwal.waktu}</span>
                              </div>
                            </div>

                            <div className="text-sm text-zinc-300">
                              <span className="text-zinc-500 mr-2">Sesi</span>
                              {jadwal.sesi}
                            </div>

                            <button 
                              onClick={() => navigate('/siswa/detail-pelajaran', { 
                                state: { 
                                  jadwal,
                                  tanggal: selectedDate.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
                                } 
                              })}
                              className="w-full mt-4 bg-emerald-600 hover:bg-emerald-500 text-zinc-50 py-3 rounded-lg font-medium transition-colors"
                            >
                              Lihat Detail
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 text-center">
                      <div className="py-12">
                        <p className="text-zinc-500">Tidak ada jadwal untuk tanggal ini</p>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default JadwalPelajaran;
