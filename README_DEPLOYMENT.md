# Panduan Deploy ke Vercel

## Metode 1: Deploy melalui Vercel CLI (Rekomendasi)

### 1. Install Vercel CLI

```bash
npm install -g vercel
```

### 2. Login ke Vercel

```bash
vercel login
```

Ikuti instruksi untuk login dengan akun GitHub, GitLab, Bitbucket, atau email.

### 3. Deploy Project

Di folder project, jalankan:

```bash
vercel
```

Ikuti prompt:

- **Set up and deploy?** → Yes
- **Which scope?** → Pilih akun Anda
- **Link to existing project?** → No (untuk deploy pertama kali)
- **What's your project's name?** → absensi-sman1nagreg (atau nama yang Anda inginkan)
- **In which directory is your code located?** → ./ (tekan Enter)
- **Want to override the settings?** → No (konfigurasi sudah di vercel.json)

### 4. Deploy Production

Setelah deploy preview berhasil, deploy ke production:

```bash
vercel --prod
```

---

## Metode 2: Deploy melalui Vercel Dashboard

### 1. Buka Vercel Dashboard

- Kunjungi [https://vercel.com](https://vercel.com)
- Login dengan akun GitHub Anda

### 2. Import Project

- Klik **"Add New..."** → **"Project"**
- Pilih **"Import Git Repository"**
- Pilih repository **absensi_sman1nagreg**

### 3. Configure Project

Vercel akan otomatis mendeteksi Create React App. Pastikan:

- **Framework Preset**: Create React App
- **Build Command**: `npm run build` atau `react-scripts build`
- **Output Directory**: `build`
- **Install Command**: `npm install`

### 4. Deploy

- Klik **"Deploy"**
- Tunggu proses build selesai (biasanya 1-3 menit)

---

## Setelah Deploy Berhasil

### URL yang Akan Anda Dapatkan:

- **Production URL**: `https://absensi-sman1nagreg.vercel.app` (atau nama yang Anda pilih)
- **Preview URLs**: Setiap push ke branch akan mendapat preview URL

### Environment Variables (Jika Diperlukan Nanti)

Jika Anda menambahkan backend API, set environment variables di:

1. Dashboard Vercel → Pilih project
2. **Settings** → **Environment Variables**
3. Tambahkan variabel seperti `REACT_APP_API_URL`

### Custom Domain (Opsional)

1. Dashboard Vercel → Pilih project
2. **Settings** → **Domains**
3. Tambahkan domain custom Anda

---

## Update Deployment

### Otomatis (Recommended)

Setiap kali Anda push ke GitHub:

```bash
git add .
git commit -m "Update feature"
git push origin main
```

Vercel otomatis akan build dan deploy.

### Manual via CLI

```bash
vercel --prod
```

---

## Troubleshooting

### Build Gagal

Cek:

1. Pastikan `npm run build` berjalan sukses di local
2. Cek error logs di Vercel Dashboard → Project → Deployments → Klik deployment → View Build Logs

### Routing 404

- File `vercel.json` sudah dikonfigurasi untuk handle client-side routing React Router
- Semua route akan diarahkan ke `index.html`

### Geolocation Tidak Bekerja

- Vercel secara otomatis menyediakan HTTPS
- Geolocation memerlukan HTTPS atau localhost
- Setelah deploy, fitur lokasi akan bekerja normal di domain Vercel

---

## Status Deployment

✅ File `vercel.json` sudah dibuat
✅ `.gitignore` sudah di-update dengan `.vercel`
✅ Project siap untuk di-deploy

Silakan pilih metode deploy yang Anda inginkan!
