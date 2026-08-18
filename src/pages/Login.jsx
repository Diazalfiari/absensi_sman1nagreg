import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { users } from '../data/mockData';
import { saveToLocalStorage } from '../utils/helpers';
import Button from '../components/common/Button';
import Loading from '../components/common/Loading';
import logoSmansan from '../assets/images/logosmansan.png';

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
        saveToLocalStorage('currentUser', user);
        setTimeout(() => {
          switch (user.role) {
            case 'admin': navigate('/admin'); break;
            case 'guru': navigate('/guru'); break;
            case 'siswa': navigate('/siswa'); break;
            default: navigate('/');
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
      <div className="min-h-[100dvh] flex items-center justify-center px-6 py-12 bg-zinc-950 text-zinc-50 selection:bg-primary-500/30">
        <div className="w-full max-w-md">
          <div className="text-center mb-10 space-y-4">
            <Link to="/" className="inline-block">
              <div className="w-16 h-16 rounded-2xl bg-zinc-800 border border-zinc-700 flex items-center justify-center mx-auto mb-6">
                <img src={logoSmansan} alt="Logo SMAN 1 Nagreg" className="w-10 h-10 object-contain" />
              </div>
            </Link>
            <h1 className="text-3xl font-display tracking-tight leading-[1.1]">Masuk Sistem</h1>
            <p className="text-zinc-400">Gunakan akun yang terdaftar untuk mengakses panel.</p>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 sm:p-8">
            {error && (
              <div className="bg-rose-500/10 border border-rose-500/30 text-rose-400 px-4 py-3 rounded-xl mb-6">
                <p className="text-sm">{error}</p>
              </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-2">Username</label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl bg-zinc-800 border border-zinc-700 text-zinc-50 focus:outline-none focus:ring-2 focus:ring-primary-500/50 placeholder-zinc-500 transition-colors"
                  placeholder="Masukkan username"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-2">Password</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl bg-zinc-800 border border-zinc-700 text-zinc-50 focus:outline-none focus:ring-2 focus:ring-primary-500/50 placeholder-zinc-500 transition-colors"
                  placeholder="Masukkan password"
                />
              </div>
              <div className="pt-2">
                <Button type="submit" variant="primary" fullWidth disabled={loading}>
                  {loading ? 'Memproses...' : 'Login'}
                </Button>
              </div>
            </form>
          </div>
          <div className="mt-8 text-center">
            <Link to="/" className="text-zinc-400 hover:text-zinc-100 font-medium text-sm transition-colors">
              &larr; Kembali ke Beranda
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
