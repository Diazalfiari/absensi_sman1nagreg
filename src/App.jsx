import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { getCurrentUser } from './utils/helpers';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import AdminDashboard from './pages/Admin/AdminDashboard';
import AdminRekap from './pages/Admin/AdminRekap';
import LaporanBulanan from './pages/Admin/LaporanBulanan';
import TambahJadwal from './pages/Admin/TambahJadwal';
import GuruDashboard from './pages/Guru/GuruDashboard';
import JadwalMengajar from './pages/Guru/JadwalMengajar';
import DetailSesi from './pages/Guru/DetailSesi';
import GuruRiwayat from './pages/Guru/GuruRiwayat';
import SiswaDashboard from './pages/Siswa/SiswaDashboard';
import SiswaRiwayat from './pages/Siswa/SiswaRiwayat';
import AbsensiMandiri from './pages/Siswa/AbsensiMandiri';
import JadwalPelajaran from './pages/Siswa/JadwalPelajaran';
import DetailPelajaran from './pages/Siswa/DetailPelajaran';

// Protected Route Component
const ProtectedRoute = ({ children, allowedRole }) => {
  const currentUser = getCurrentUser();

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRole && currentUser.role !== allowedRole) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />

        {/* Admin Routes */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRole="admin">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/rekapitulasi"
          element={
            <ProtectedRoute allowedRole="admin">
              <AdminRekap />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/laporan-bulanan"
          element={
            <ProtectedRoute allowedRole="admin">
              <LaporanBulanan />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/tambah-jadwal"
          element={
            <ProtectedRoute allowedRole="admin">
              <TambahJadwal />
            </ProtectedRoute>
          }
        />

        {/* Guru Routes */}
        <Route
          path="/guru"
          element={
            <ProtectedRoute allowedRole="guru">
              <GuruDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/guru/input-absensi"
          element={
            <ProtectedRoute allowedRole="guru">
              <JadwalMengajar />
            </ProtectedRoute>
          }
        />
        <Route
          path="/guru/detail-sesi"
          element={
            <ProtectedRoute allowedRole="guru">
              <DetailSesi />
            </ProtectedRoute>
          }
        />
        <Route
          path="/guru/riwayat"
          element={
            <ProtectedRoute allowedRole="guru">
              <GuruRiwayat />
            </ProtectedRoute>
          }
        />

        {/* Siswa Routes */}
        <Route
          path="/siswa"
          element={
            <ProtectedRoute allowedRole="siswa">
              <SiswaDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/siswa/jadwal"
          element={
            <ProtectedRoute allowedRole="siswa">
              <JadwalPelajaran />
            </ProtectedRoute>
          }
        />
        <Route
          path="/siswa/detail-pelajaran"
          element={
            <ProtectedRoute allowedRole="siswa">
              <DetailPelajaran />
            </ProtectedRoute>
          }
        />
        <Route
          path="/siswa/absensi"
          element={
            <ProtectedRoute allowedRole="siswa">
              <AbsensiMandiri />
            </ProtectedRoute>
          }
        />
        <Route
          path="/siswa/riwayat"
          element={
            <ProtectedRoute allowedRole="siswa">
              <SiswaRiwayat />
            </ProtectedRoute>
          }
        />

        {/* Fallback Route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
