# Sistem Informasi Presensi Siswa SMAN 1 Nagreg (Frontend)

Aplikasi web presensi digital modern berbasis **React.js** dan **Tailwind CSS** yang dirancang untuk mengelola dan memantau kehadiran siswa di SMAN 1 Nagreg secara terpusat, cepat, dan akurat. Dilengkapi dengan antarmuka responsif, dukungan tema gelap/terang (*Dark/Light Mode*), manajemen berbasis peran (*Role-Based Access*), serta integrasi ekspor dan impor dokumen spreadsheet Excel.

---

## 📑 Daftar Isi

- [Fitur Utama](#-fitur-utama)
- [Peran Pengguna & Hak Akses](#-peran-pengguna--hak-akses)
- [Akun Pengujian (Mock Data)](#-akun-pengujian-mock-data)
- [Struktur Rute (Routing)](#-struktur-rute-routing)
- [Struktur Direktori Proyek](#-struktur-direktori-proyek)
- [Teknologi yang Digunakan](#-teknologi-yang-digunakan)
- [Panduan Instalasi & Menjalankan](#-panduan-instalasi--menjalankan)
- [Format Template Spreadsheet](#-format-template-spreadsheet)

---

## ✨ Fitur Utama

### 1. 🌐 Tampilan & Pengalaman Pengguna (UI/UX)
- **Landing Page Interaktif**: Halaman beranda yang elegan dan informatif dengan navigasi portal sekolah.
- **Dark Mode & Light Mode**: Dukungan perpindahan tema otomatis/manual menggunakan React Context dan Tailwind Dark Theme.
- **Desain Responsif**: Tampilan optimal di berbagai resolusi layar (Desktop, Tablet, dan Smartphone).
- **Komponen Interaktif**: Dilengkapi *Skeleton Loader*, *Modal Dialog*, *Toast Notification*, dan *Confirmation Dialog*.

### 2. 👨‍💼 Fitur Administrator
- **Dashboard Eksekutif**: Statistik total siswa, guru, kelas aktif, serta ringkasan persentase kehadiran harian/mingguan.
- **Rekapitulasi Presensi**: Pemfilteran data kehadiran berdasarkan kelas dan rentang tanggal dengan tabel status (Hadir, Izin, Sakit, Alpa).
- **Laporan Bulanan**: Laporan matriks presensi bulanan lengkap dengan filter bulan, tahun, dan kelas.
- **Ekspor Excel (.xlsx)**: Unduh laporan bulanan dan rekap kehadiran dalam format Excel resmi menggunakan `ExcelJS`.
- **Manajemen Pengguna**:
  - Tambah, edit, dan hapus akun pengguna (Admin, Guru, Siswa).
  - **Import Data Pengguna**: Unggah massal data pengguna dari file Excel beserta validasi dan pratinjau (*preview*) sebelum disimpan.
- **Manajemen Kelas & Siswa**:
  - Pemetaan kelas tingkat X, XI, dan XII.
  - Pengaturan Wali Kelas.
  - Pengelolaan daftar siswa dan mutasi siswa per kelas.
- **Manajemen Jadwal**: Pembuatan dan pengaturan jadwal mata pelajaran, alokasi jam mengajar, dan penugasan guru.

### 3. 👨‍🏫 Fitur Guru
- **Dashboard Guru**: Ringkasan jadwal mengajar hari ini dan status sesi kelas yang diampu.
- **Jadwal Mengajar**: Informasi lengkap jadwal mengajar harian dan mingguan.
- **Input Presensi Sesi**: Form pencatatan kehadiran siswa per sesi pelajaran secara *real-time* (Hadir, Sakit, Izin, Alpa, dan catatan guru).
- **Riwayat Mengajar**: Log riwayat sesi presensi yang telah dicatat sebelumnya.

### 4. 👨‍🎓 Fitur Siswa
- **Dashboard Siswa**: Kartu persentase kehadiran pribadi, riwayat status absensi terakhir, dan informasi kelas.
- **Jadwal Pelajaran**: Daftar jadwal mata pelajaran mingguan.
- **Detail Mata Pelajaran**: Rincian informasi guru pengampu, waktu kelas, dan catatan kehadiran pada mata pelajaran terkait.
- **Riwayat Kehadiran**: Log lengkap riwayat absensi siswa.

---

## 👥 Peran Pengguna & Hak Akses

| Peran (Role) | Hak Akses Utama |
| :--- | :--- |
| **Admin** | Akses penuh: Manajemen Pengguna, Manajemen Kelas, Laporan Bulanan, Rekapitulasi Presensi, Tambah Jadwal, Import/Export Excel. |
| **Guru** | Dashboard Pengajar, Jadwal Mengajar, Input & Edit Presensi Sesi Kelas, Riwayat Presensi Mengajar. |
| **Siswa** | Dashboard Kehadiran Pribadi, Jadwal Pelajaran Mingguan, Detail Mata Pelajaran, Riwayat Presensi Pribadi. |

---

## 🔑 Akun Pengujian (Mock Data)

Aplikasi saat ini berjalan menggunakan data simulasi (*Mock Data* / *Front-end Only*). Anda dapat menggunakan akun berikut untuk menguji sistem:

| Peran | Username | Password | Deskripsi / Nama Pengguna |
| :--- | :--- | :--- | :--- |
| **Admin** | `admin` | `admin123` | Administrator Sekolah |
| **Guru** | `guru` | `guru123` | Budi Santoso, S.Pd (Guru Matematika) |
| **Siswa** | `siswa` | `siswa123` | Ahmad Rizki (Kelas X-1) |

---

## 🗺️ Struktur Rute (Routing)

| Path URL | Akses | Komponen / Halaman | Deskripsi |
| :--- | :--- | :--- | :--- |
| `/` | Publik | `Home.jsx` | Halaman utama / Landing page |
| `/login` | Publik | `Login.jsx` | Form login multi-role |
| `/admin` | Admin | `AdminDashboard.jsx` | Ringkasan statistik & metrik absensi |
| `/admin/rekapitulasi` | Admin | `AdminRekap.jsx` | Rekapitulasi kehadiran & filter tanggal |
| `/admin/laporan-bulanan` | Admin | `LaporanBulanan.jsx` | Rekapitulasi bulanan & fitur Export Excel |
| `/admin/tambah-jadwal` | Admin | `TambahJadwal.jsx` | Form pembuatan jadwal pelajaran baru |
| `/admin/manajemen-pengguna` | Admin | `ManajemenPengguna.jsx` | Kelola akun & Import pengguna via Excel |
| `/admin/manajemen-kelas` | Admin | `ManajemenKelas.jsx` | Daftar kelas & pengaturan wali kelas |
| `/admin/manajemen-kelas/:kelasId` | Admin | `DetailKelas.jsx` | Daftar siswa & kelola siswa per kelas |
| `/guru` | Guru | `GuruDashboard.jsx` | Dashboard pengajar & jadwal aktif hari ini |
| `/guru/Jadwal-mengajar` | Guru | `JadwalMengajar.jsx` | Kalender/tabel jadwal mengajar guru |
| `/guru/detail-sesi` | Guru | `DetailSesi.jsx` | Form input presensi siswa per sesi pelajaran |
| `/guru/riwayat` | Guru | `GuruRiwayat.jsx` | Log riwayat sesi presensi guru |
| `/siswa` | Siswa | `SiswaDashboard.jsx` | Dashboard statistik kehadiran siswa |
| `/siswa/jadwal` | Siswa | `JadwalPelajaran.jsx` | Jadwal mata pelajaran siswa |
| `/siswa/detail-pelajaran` | Siswa | `DetailPelajaran.jsx` | Detail mata pelajaran & guru pengampu |
| `/siswa/riwayat` | Siswa | `SiswaRiwayat.jsx` | Riwayat log presensi siswa |

---

## 📁 Struktur Direktori Proyek

```plaintext
absensi_sman1nagreg/
├── public/                     # Static assets & HTML template
├── src/
│   ├── assets/                 # Gambar, logo, dan aset visual
│   │   └── images/
│   ├── components/             # Komponen UI modular
│   │   ├── admin/              # Komponen khusus panel Admin
│   │   │   ├── class/          # Card kelas, modal tambah siswa & wali kelas
│   │   │   ├── reports/        # Tabel laporan bulanan & filter laporan
│   │   │   └── user/           # Form pengguna, modal, & import Excel
│   │   ├── common/             # Komponen reusable (Navbar, Sidebar, Modal, Button, Toast, dll.)
│   │   └── guru/               # Komponen khusus panel Guru (Form Presensi)
│   ├── contexts/               # React Context (ThemeContext untuk Dark/Light mode)
│   ├── data/                   # Mock Data simulasi pengguna, kelas, mapel, & presensi
│   │   └── mockData.js
│   ├── pages/                  # Halaman aplikasi
│   │   ├── Admin/              # Halaman dashboard & manajemen Admin
│   │   ├── Guru/               # Halaman dashboard & presensi Guru
│   │   ├── Siswa/              # Halaman dashboard & jadwal Siswa
│   │   ├── Home.jsx            # Landing page
│   │   └── Login.jsx           # Halaman login
│   ├── services/               # Layanan API (siap untuk integrasi backend)
│   ├── utils/                  # Utility helper, format tanggal, export Excel, import user
│   │   ├── attendanceReport.js
│   │   ├── exportMonthlyReport.js
│   │   ├── helpers.js
│   │   ├── reportHelpers.js
│   │   └── userImport.js
│   ├── App.jsx                 # Routing utama & Protected Route wrapper
│   ├── index.css               # Konfigurasi Tailwind CSS & custom styling
│   └── index.js                # Entry point React
├── package.json                # Dependensi & script proyek
├── tailwind.config.js          # Konfigurasi tema Tailwind CSS
└── README.md                   # Dokumentasi proyek
```

---

## 🛠️ Teknologi yang Digunakan

- **Frontend Core**: [React.js 18](https://react.dev/)
- **Routing**: [React Router DOM v6](https://reactrouter.com/)
- **CSS & Styling**: [Tailwind CSS v3](https://tailwindcss.com/) dengan dukungan Dark Mode
- **Spreadsheet Processing**: [ExcelJS](https://github.com/exceljs/exceljs) (Export format `.xlsx` & styling cell)
- **Icons & Visuals**: SVG Icons modern & teroptimasi
- **Build Tool**: [Create React App (react-scripts)](https://create-react-app.dev/)

---

## 🚀 Panduan Instalasi & Menjalankan

### Prasyarat
Pastikan Anda telah menginstal:
- [Node.js](https://nodejs.org/) (versi 16.x atau lebih baru disarankan)
- [npm](https://www.npmjs.com/) atau [yarn](https://yarnpkg.com/)

### Langkah-langkah

1. **Clone repository atau buka direktori proyek**:
   ```bash
   cd absensi_sman1nagreg
   ```

2. **Install seluruh dependensi**:
   ```bash
   npm install
   ```

3. **Jalankan development server**:
   ```bash
   npm start
   ```

4. **Buka di browser**:
   Aplikasi akan otomatis terbuka di [http://localhost:3000](http://localhost:3000).

5. **Build untuk produksi**:
   ```bash
   npm run build
   ```

---

## 📊 Format Template Spreadsheet

### 1. Import Data Pengguna (Admin)
Fitur import pengguna pada menu **Manajemen Pengguna** mendukung file `.xlsx` / `.xls` / `.csv` dengan susunan kolom:

| Kolom Header | Wajib? | Keterangan / Contoh Nilai |
| :--- | :--- | :--- |
| `Username` | Ya | `budi123` / `ahmad2021` |
| `Nama` | Ya | Nama lengkap pengguna |
| `Role` | Ya | `admin`, `guru`, atau `siswa` |
| `Password` | Ya | Password default akun |
| `NIP` | Opsional (Guru) | Nomor Induk Pegawai |
| `NIPD` | Opsional (Siswa) | Nomor Induk Peserta Didik |
| `Kelas` | Opsional (Siswa) | Contoh: `X-1`, `XI-2`, `XII-1` |

### 2. Ekspor Laporan Bulanan (Admin)
Laporan bulanan diekspor dalam format spreadsheet `.xlsx` dengan:
- Kop identitas sekolah (SMAN 1 Nagreg), nama kelas, bulan, dan tahun.
- Kolom matriks tanggal (1 s.d. 31) beserta simbol status kehadiran (`H`, `S`, `I`, `A`).
- Kolom total rekapitulasi dan persentase kehadiran per siswa.

---

## 📝 Catatan Tambahan

- Proyek ini saat ini berfokus pada sisi **Frontend** dengan penyimpanan status sesi pada `localStorage` dan data awal dari `mockData.js`.
- Arsitektur folder `services/` dan utility fungsi telah disiapkan agar mudah diintegrasikan dengan backend REST API (seperti Node.js/Express.js, Laravel, dsb.).
