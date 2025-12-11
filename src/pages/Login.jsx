import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { users } from '../data/mockData';
import { saveToLocalStorage } from '../utils/helpers';
import Button from '../components/common/Button';
import Loading from '../components/common/Loading';

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [rememberPassword, setRememberPassword] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
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
        saveToLocalStorage('currentUser', user);

        // Keep loading state while navigating
        setTimeout(() => {
          switch (user.role) {
            case 'admin':
              navigate('/admin');
              break;
            case 'guru':
              navigate('/guru');
              break;
            case 'siswa':
              navigate('/siswa');
              break;
            default:
              navigate('/');
          }
        }, 500);
      } else {
        setError('Username atau password salah');
        setLoading(false);
      }
    }, 1000);
  };

  return (
    <>
      {loading && <Loading fullscreen text="Sedang memproses login..." />}
      <div className="min-h-screen flex items-center justify-center px-6 py-12 relative text-white">
      <div className="absolute inset-0 bg-gradient-to-br from-ink-950 via-ink-900 to-primary-900 opacity-95"></div>
      <div className="absolute inset-0">
        <img
          src="/images/smansan.jpg"
          alt="SMAN 1 Nagreg"
          className="w-full h-full object-cover opacity-20"
        />
      </div>
      <div className="absolute inset-y-10 inset-x-10 shimmer-border"></div>
      <div className="relative z-10 grid lg:grid-cols-2 gap-12 w-full max-w-6xl">
        <div className="space-y-6 flex flex-col justify-center">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center">
              <img
                src="/images/logosmansan.png"
                alt="Logo SMAN 1 Nagreg"
                className="w-12 h-12 object-contain drop-shadow-lg"
              />
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.5em] text-white/60">SMAN 1 Nagreg</p>
              <h1 className="font-display text-3xl sm:text-4xl">Digital Attendance Hub</h1>
            </div>
          </div>
          <p className="text-white/75 max-w-md">
            Masuk dan kelola seluruh perjalanan kehadiran dengan nuansa visual yang lebih hidup.
          </p>
          <div className="glass-panel p-6 space-y-3">
            <p className="text-xs uppercase tracking-[0.4em] text-white/60">Kredensial Demo</p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
              <div className="bg-white/5 p-3 rounded-xl">
                <p className="text-white/60">Admin</p>
                <p className="font-mono">admin / admin123</p>
              </div>
              <div className="bg-white/5 p-3 rounded-xl">
                <p className="text-white/60">Guru</p>
                <p className="font-mono">guru / guru123</p>
              </div>
              <div className="bg-white/5 p-3 rounded-xl">
                <p className="text-white/60">Siswa</p>
                <p className="font-mono">siswa / siswa123</p>
              </div>
            </div>
          </div>
        </div>

        <div className="glass-panel p-8 self-center">
          <div className="text-center mb-8">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center mx-auto mb-4 shadow-glow">
              <span className="text-3xl font-bold">S</span>
            </div>
            <h2 className="text-3xl font-semibold">Masuk</h2>
            <p className="text-sm text-white/70">Sistem Absensi SMAN 1 Nagreg</p>
          </div>

          {error && (
            <div className="bg-rose-500/10 border border-rose-500/50 text-rose-200 px-4 py-3 rounded-xl mb-4">
              <p className="text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm text-white/70 mb-2">Username</label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-2xl bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-primary-400 placeholder-white/40"
                placeholder="Masukkan username"
              />
            </div>

            <div>
              <label className="block text-sm text-white/70 mb-2">Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-2xl bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-primary-400 placeholder-white/40"
                placeholder="Masukkan password"
              />
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="rememberPassword"
                checked={rememberPassword}
                onChange={(e) => setRememberPassword(e.target.checked)}
                className="w-4 h-4 rounded border-white/20 bg-white/5 text-primary-500 focus:ring-2 focus:ring-primary-400 focus:ring-offset-0 cursor-pointer"
              />
              <label htmlFor="rememberPassword" className="ml-2 text-sm text-white/70 cursor-pointer">
                Ingat password saya
              </label>
            </div>

            <Button type="submit" variant="primary" fullWidth disabled={loading}>
              {loading ? 'Memproses...' : 'Masuk'}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={() => navigate('/')}
              className="text-white/70 hover:text-white font-medium text-sm"
            >
              ← Kembali ke Beranda
            </button>
          </div>
        </div>
      </div>
    </div>
    </>
  );
};

export default Login;
