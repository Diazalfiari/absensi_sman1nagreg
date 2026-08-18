import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import heroImage from '../assets/images/smansan2.jpg';
import Button from '../components/common/Button';

const Home = () => {
  return (
    <div className="min-h-[100dvh] bg-zinc-950 text-white selection:bg-primary-500/30">
      <Navbar transparent={true} />
      <main className="max-w-7xl mx-auto px-6 pt-24 pb-16">
        <section className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-8 max-w-xl">
            <h1 className="text-5xl md:text-6xl font-display tracking-tight leading-[1.1]">
              Presensi Siswa Digital
            </h1>
            <p className="text-lg text-zinc-400 max-w-md leading-relaxed">
              Satu sentuhan untuk memulai kehadiran digital.
            </p>
            <div className="pt-2">
              <Link to="/login">
                <Button size="lg" className="w-full sm:w-auto px-8">
                  Masuk Sistem
                </Button>
              </Link>
            </div>
          </div>
          <div className="relative isolate">
            <div className="rounded-2xl overflow-hidden bg-zinc-900 border border-white/10 ring-1 ring-white/5">
              <img
                src={heroImage}
                alt="SMAN 1 Nagreg"
                className="w-full h-[480px] object-cover"
              />
            </div>
          </div>
        </section>
      </main>
      <Footer containerClassName="max-w-7xl mx-auto px-6" />
    </div>
  );
};

export default Home;
