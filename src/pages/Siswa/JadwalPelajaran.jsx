import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../components/common/Sidebar';
import Card from '../../components/common/Card';
import { getCurrentUser } from '../../utils/helpers';
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

  // Mock data jadwal pelajaran berdasarkan tanggal
  const jadwalData = {
    '2025-12-01': [
      { id: 1, mataPelajaran: 'Matematika', kelas: 'X-1', waktu: '08:50 - 10:30', ruang: 'Kelas X-1', sesi: '12: Report and Abstract writing', status: 'Offline' },
    ],
    '2025-12-02': [
      { id: 2, mataPelajaran: 'Bahasa Indonesia', kelas: 'XI-1', waktu: '07:30 - 09:00', ruang: 'Kelas X-1', sesi: 'Teks Eksposisi', status: 'Offline' },
    ],
    '2025-12-05': [
      { id: 3, mataPelajaran: 'Fisika', kelas: 'XII-1', waktu: '09:15 - 10:45', ruang: 'Kelas X-1', sesi: 'Hukum Newton', status: 'Online' },
    ],
    '2025-12-08': [
      { id: 4, mataPelajaran: 'Kimia', kelas: 'XI-1', waktu: '10:45 - 12:15', ruang: 'Kelas X-1', sesi: 'Reaksi Kimia', status: 'Offline' },
    ],
    '2025-12-09': [
      { id: 5, mataPelajaran: 'Biologi', kelas: 'X-1', waktu: '12:45 - 14:15', ruang: 'Kelas X-1', sesi: 'Sel dan Jaringan', status: 'Offline' },
    ],
    '2025-12-12': [
      { id: 6, mataPelajaran: 'Sejarah', kelas: 'XII-1', waktu: '07:30 - 09:00', ruang: 'Kelas X-1', sesi: 'Kemerdekaan Indonesia', status: 'Offline' },
    ],
    '2025-12-15': [
      { id: 7, mataPelajaran: 'Matematika', kelas: 'X-1', waktu: '09:15 - 10:45', ruang: 'Kelas X-1', sesi: 'Kalkulus Integral', status: 'Offline' },
    ],
    '2025-12-16': [
      { id: 8, mataPelajaran: 'Bahasa Inggris', kelas: 'XI-1', waktu: '08:50 - 10:30', ruang: 'Kelas X-1', sesi: '12: Report and Abstract writing', status: 'Offline' },
    ],
    '2025-12-19': [
      { id: 9, mataPelajaran: 'Geografi', kelas: 'XII-1', waktu: '10:45 - 12:15', ruang: 'Kelas X-1', sesi: 'Peta dan Atlas', status: 'Online' },
    ],
    '2025-12-22': [
      { id: 10, mataPelajaran: 'Ekonomi', kelas: 'X-1', waktu: '12:45 - 14:15', ruang: 'Kelas X-1', sesi: 'Pasar Modal', status: 'Offline' },
    ],
    '2025-12-23': [
      { id: 11, mataPelajaran: 'Sosiologi', kelas: 'XII-1', waktu: '07:30 - 09:00', ruang: 'Kelas X-1', sesi: 'Interaksi Sosial', status: 'Offline' },
    ],
    '2025-12-26': [
      { id: 12, mataPelajaran: 'Pendidikan Agama', kelas: 'X-1', waktu: '09:15 - 10:45', ruang: 'Kelas X-1', sesi: 'Akhlak Mulia', status: 'Offline' },
    ],
    '2025-12-29': [
      { id: 13, mataPelajaran: 'Seni Budaya', kelas: 'X-1', waktu: '10:45 - 12:15', ruang: 'Kelas X-1', sesi: 'Seni Rupa', status: 'Offline' },
    ],
    '2025-12-30': [
      { id: 14, mataPelajaran: 'Pendidikan Jasmani', kelas: 'XI-1', waktu: '12:45 - 14:15', ruang: 'Lapangan', sesi: 'Bola Basket', status: 'Offline' },
    ],
  };

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
    return jadwalData[dateStr] !== undefined;
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
  const selectedSchedule = jadwalData[dateStr] || [];

  return (
    <div className="bg-ink-900 min-h-screen text-white">
      <Sidebar role="siswa" />
      
      <main className="px-4 sm:px-6 lg:px-10 pt-12 sm:pt-16 lg:pt-12 pb-12 lg:ml-72">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Header */}
          <div className="flex items-center gap-4 mb-6">
            <button
              onClick={() => navigate(-1)}
              className="text-white hover:text-primary-400 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <h1 className="text-2xl font-bold">Jadwal</h1>
          </div>

          {/* Main Content - Calendar and Schedule Side by Side */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Side - Calendar */}
            <div>
              <Card padding="lg" className="bg-white text-gray-900">
                {/* Month Navigation */}
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <p className="text-sm text-gray-500">{currentMonth.getFullYear()}</p>
                    <h2 className="text-2xl font-bold text-gray-200">{monthNames[currentMonth.getMonth()]}</h2>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handlePrevMonth}
                      className="w-10 h-10 rounded-lg hover:bg-gray-100 flex items-center justify-center transition-colors"
                    >
                      <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                    </button>
                    <button
                      onClick={handleNextMonth}
                      className="w-10 h-10 rounded-lg hover:bg-gray-100 flex items-center justify-center transition-colors"
                    >
                      <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </div>
                </div>

                {/* Day Headers */}
                <div className="grid grid-cols-7 gap-2 mb-3">
                  {dayNames.map((day) => (
                    <div key={day} className="text-center text-xs font-semibold text-white py-2">
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
                          relative aspect-square rounded-lg text-sm md:text-base font-medium transition-all
                          ${!day ? 'invisible' : ''}
                          ${today && !selected ? 'ring-2 ring-emerald-500' : ''}
                          ${selected ? 'bg-emerald-600 text-white shadow-lg' : ''}
                          ${!selected && day ? 'hover:bg-gray-100 text-gray-400' : ''}
                          ${!day ? '' : 'cursor-pointer'}
                        `}
                      >
                        {day && (
                          <>
                            <span className="relative z-10">{day.getDate()}</span>
                            {hasJadwal && (
                              <div className="absolute top-0.5 right-0.5 md:top-1 md:right-1 w-1 h-1 md:w-1.5 md:h-1.5 rounded-full bg-red-500"></div>
                            )}
                          </>
                        )}
                      </button>
                    );
                  })}
                </div>
              </Card>
            </div>

            {/* Right Side - Schedule Details */}
            <div className="space-y-4">
              {selectedDate && (
                <>
                  <div className="bg-white/5 rounded-lg p-4 border-b-2 border-gray-700">
                    <p className="text-sm text-white/60">Jadwal Kelas</p>
                    <h3 className="text-lg font-bold">
                      {selectedDate.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long' })}
                    </h3>
                  </div>

                  {selectedSchedule.length > 0 ? (
                    <div className="space-y-4">
                      {selectedSchedule.map((jadwal) => (
                        <Card key={jadwal.id} padding="lg" className="bg-white text-gray-900">
                          <div className="space-y-3">
                            <div className="flex items-start justify-between">
                              <h4 className="text-lg font-bold text-gray-200">{jadwal.mataPelajaran}</h4>
                              <span className="px-3 py-1 bg-amber-100 text-amber-800 rounded-full text-xs font-semibold">
                                {jadwal.status} - {jadwal.ruang}
                              </span>
                            </div>
                            
                            <div className="flex items-center gap-4 text-sm text-gray-200">
                              <div className="flex items-center gap-2">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                </svg>
                                <span>{jadwal.kelas}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <span>{jadwal.waktu}</span>
                              </div>
                            </div>

                            <div className="text-sm text-gray-200">
                              Sesi {jadwal.sesi}
                            </div>

                            <button 
                              onClick={() => navigate('/siswa/detail-pelajaran', { 
                                state: { 
                                  jadwal,
                                  tanggal: selectedDate.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
                                } 
                              })}
                              className="w-full mt-4 bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-lg font-semibold transition-colors"
                            >
                              Lihat Detail
                            </button>
                          </div>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <Card padding="lg" className="bg-white/5 text-center">
                      <div className="py-8">
                        <div className="text-4xl mb-3">📅</div>
                        <p className="text-white/70">Tidak ada jadwal untuk tanggal ini</p>
                      </div>
                    </Card>
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
