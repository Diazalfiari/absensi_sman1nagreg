import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { users } from '../data/mockData';
import { saveToLocalStorage } from '../utils/helpers';
import Button from '../components/common/Button';
import Loading from '../components/common/Loading';
import logoSmansan from '../assets/images/logosmansan.png';
import schoolImage from '../assets/images/smansan2.jpg';

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!formData.username || !formData.password) {
      setError('Username dan password tidak boleh kosong');
      setLoading(false);
      return;
    }

    setTimeout(() => {
      const user = users.find(
        (u) => u.username === formData.username && u.password === formData.password
      );

      if (user) {
        const sessionUser = { ...user };
        delete sessionUser.password;
        saveToLocalStorage('currentUser', sessionUser);
        setLoading(false);
        switch (user.role) {
          case 'admin': navigate('/admin'); break;
          case 'guru': navigate('/guru'); break;
          case 'siswa': navigate('/siswa'); break;
          default: navigate('/');
        }
      } else {
        setError('Username atau password salah');
        setLoading(false);
      }
    }, 1000);
  };

  return (
    <>
      {loading && <Loading fullscreen text="Sedang memproses login..." />}
      <div className="min-h-[100dvh] overflow-hidden bg-zinc-950 text-zinc-50 selection:bg-[#29438f]/20">
        <main className="mx-auto grid min-h-[100dvh] max-w-[1600px] lg:grid-cols-[0.9fr_1.1fr]">
          <aside className="hidden min-h-[100dvh] grid-rows-[minmax(0,1fr)_auto] gap-8 p-6 lg:grid xl:p-8">
            <figure className="min-h-0 overflow-hidden rounded-3xl border border-zinc-800/70 bg-zinc-900 shadow-[0_24px_70px_rgba(15,23,42,0.16)] dark:shadow-[0_24px_70px_rgba(0,0,0,0.3)]">
              <img
                src={schoolImage}
                alt="Lingkungan SMAN 1 Nagreg"
                className="h-full w-full object-cover grayscale-[10%] transition duration-700 hover:scale-[1.02] hover:grayscale-0"
              />
            </figure>
            <div className="max-w-xl pb-3 pl-2 xl:pb-6 xl:pl-4">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#29438f] dark:text-[#9eafff]">SMAN 1 Nagreg</p>
              <h2 className="mt-4 max-w-lg font-display text-3xl font-semibold leading-tight tracking-[-0.035em] text-zinc-50 xl:text-4xl">
                Kehadiran dimulai dari akses yang sederhana.
              </h2>
              <p className="mt-4 max-w-md text-sm leading-7 text-zinc-500 dark:text-zinc-400">
                Satu sistem untuk siswa, guru, dan admin dalam menjalankan alur presensi sekolah.
              </p>
            </div>
          </aside>

          <section className="flex min-h-[100dvh] items-center justify-center border-l border-zinc-800/70 px-6 py-12 sm:px-10 lg:px-16 xl:px-24">
            <div className="w-full max-w-md">
              <div className="mb-10 flex items-center justify-between gap-4">
                <Link to="/" className="group flex items-center gap-3" aria-label="Kembali ke beranda SMAN 1 Nagreg">
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl border border-zinc-800/80 bg-zinc-900/80 p-1.5 transition duration-200 group-hover:border-[#e5ba4b]/70">
                    <img src={logoSmansan} alt="Logo SMAN 1 Nagreg" className="h-full w-full object-contain" />
                  </span>
                  <span>
                    <span className="block font-display text-base font-semibold tracking-[-0.02em] text-zinc-50">SMAN 1 Nagreg</span>
                    <span className="hidden text-[0.65rem] font-medium uppercase tracking-[0.16em] text-zinc-500 sm:block">Sistem presensi</span>
                  </span>
                </Link>
                <Link to="/" className="text-sm font-medium text-zinc-500 transition-colors hover:text-zinc-50">
                  Beranda
                </Link>
              </div>

              <div className="mb-8">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#29438f] dark:text-[#9eafff]">Portal kehadiran sekolah</p>
                <h1 className="mt-4 font-display text-4xl font-semibold leading-tight tracking-[-0.04em] text-zinc-50 sm:text-5xl">
                  Masuk ke akun Anda.
                </h1>
                <p className="mt-5 max-w-sm text-base leading-7 text-zinc-500 dark:text-zinc-400">
                  Gunakan akun yang terdaftar untuk mengakses panel presensi.
                </p>
              </div>

              <div className="rounded-2xl border border-zinc-800/80 bg-zinc-900 p-6 shadow-[0_20px_60px_rgba(15,23,42,0.1)] dark:shadow-[0_20px_60px_rgba(0,0,0,0.22)] sm:p-8">
                {error && (
                  <div className="mb-6 rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-rose-400" role="alert">
                    <p className="text-sm leading-6">{error}</p>
                  </div>
                )}
                <form onSubmit={handleSubmit} className="space-y-5" autoComplete="on">
                  <div>
                    <label htmlFor="username" className="mb-2 block text-sm font-medium text-zinc-300">Username</label>
                    <input
                      id="username"
                      type="text"
                      name="username"
                      value={formData.username}
                      onChange={handleChange}
                      autoComplete="username"
                      className="w-full rounded-xl border border-zinc-700 bg-zinc-800 px-4 py-3 text-zinc-50 placeholder-zinc-500 transition-colors focus:border-[#29438f] focus:outline-none focus:ring-2 focus:ring-[#29438f]/40"
                      placeholder="Masukkan username"
                    />
                  </div>
                  <div>
                    <label htmlFor="password" className="mb-2 block text-sm font-medium text-zinc-300">Password</label>
                    <input
                      id="password"
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      autoComplete="current-password"
                      className="w-full rounded-xl border border-zinc-700 bg-zinc-800 px-4 py-3 text-zinc-50 placeholder-zinc-500 transition-colors focus:border-[#29438f] focus:outline-none focus:ring-2 focus:ring-[#29438f]/40"
                      placeholder="Masukkan password"
                    />
                  </div>
                  <div className="pt-2">
                    <Button
                      type="submit"
                      variant="primary"
                      fullWidth
                      disabled={loading}
                      className="!rounded-xl !bg-[#29438f] !text-white shadow-[0_12px_28px_rgba(41,67,143,0.24)] hover:!bg-[#203674]"
                    >
                      {loading ? 'Memproses...' : 'Login'}
                    </Button>
                  </div>
                </form>
              </div>

              <div className="mt-8 flex items-center justify-between gap-4 text-sm">
                <span className="text-zinc-500">Gunakan akun sesuai peran Anda.</span>
                <Link to="/" className="shrink-0 font-medium text-zinc-400 transition-colors hover:text-zinc-50">
                  Kembali
                </Link>
              </div>
            </div>
          </section>
        </main>
      </div>
    </>
  );
};

export default Login;
