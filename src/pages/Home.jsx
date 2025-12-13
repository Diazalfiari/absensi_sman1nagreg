import React from 'react';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import logoSmansan from '../assets/images/logosmansan.png';
import heroImage from '../assets/images/smansan2.jpg';

const Home = () => {

  return (
    <div className="relative min-h-screen text-white overflow-hidden">
      <div className="absolute inset-0 bg-slate-900 opacity-95"></div>
      <div className="absolute inset-0">
        
      </div>
      <Navbar transparent={true} />

      <main className="relative z-10 max-w-6xl mx-auto px-6 pb-16 pt-20">
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
                <h1 className="text-4xl sm:text-5xl font-display">Presensi Siswa Digital</h1>
              </div>
            </div>

            <p className="text-lg text-white/70 max-w-md">
              Satu sentuhan untuk memulai kehadiran digital.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-md">
            </div>
          </div>

          <div className="relative">
            <div className="rounded-[32px] border border-white/15 bg-white/5 backdrop-blur-xl overflow-hidden">
              <img
                src={heroImage}
                alt="SMAN 1 Nagreg"
                className="w-full h-[420px] object-cover"
              />
            </div>
          </div>
        </section>
      </main>

      <Footer containerClassName="relative z-10 max-w-6xl mx-auto px-6" />
    </div>
  );
};

export default Home;
