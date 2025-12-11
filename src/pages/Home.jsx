import React from 'react';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import logoSmansan from '../assets/images/logosmansan.png';
import heroImage from '../assets/images/smansan.jpg';

const Home = () => {

  return (
    <div className="relative min-h-screen text-white overflow-hidden">
      <div className="absolute inset-0 opacity-40 bg-grid-radial pointer-events-none"></div>
      <Navbar transparent={true} />

      <main className="max-w-6xl mx-auto px-6 pb-16 pt-20">
        <section className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-10">
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 rounded-3xl bg-white/10 border border-white/20 flex items-center justify-center">
                <img
                  src={logoSmansan}
                  alt="Logo SMAN 1 Nagreg"
                  className="w-14 h-14 object-contain drop-shadow-lg"
                />
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.5em] text-white/60">SMAN 1 Nagreg</p>
                <h1 className="text-4xl sm:text-5xl font-display">Absensi Siswa Digital</h1>
              </div>
            </div>

            <p className="text-lg text-white/70 max-w-md">
              Satu sentuhan untuk memulai kehadiran digital yang elegan dan presisi.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-md">
            </div>
          </div>

          <div className="relative">
            <div className="rounded-[32px] border border-white/15 bg-white/5 backdrop-blur-xl shadow-glow overflow-hidden">
              <img
                src={heroImage}
                alt="SMAN 1 Nagreg"
                className="w-full h-[420px] object-cover"
              />
            </div>
            <div className="absolute -left-8 -bottom-8 w-32 h-32 bg-primary-500/30 blur-3xl"></div>
            <div className="absolute -right-6 -top-10 w-24 h-24 bg-accent-400/30 blur-3xl"></div>
          </div>
        </section>
      </main>

      <Footer containerClassName="max-w-6xl mx-auto px-6" />
    </div>
  );
};

export default Home;
