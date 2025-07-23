// src/pages/User/DashboardUser.jsx
import React from 'react';
import { HiClipboardList } from 'react-icons/hi';
import Navbar from '../../components/Navbar';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext'; 

import backgroundImage from '../../assets/bg.png';

function DashboardUser() {
  const { user } = useAuth(); 

  return (
    <div className="relative min-h-screen w-full flex flex-col"> 
      
      {/* Layer 1: Background Gambar yang di-Blur */}
      <div 
        className="absolute inset-0 z-0" // Memposisikan div ini absolut menutupi seluruh parent
        style={{
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          backgroundAttachment: 'fixed',
        }}
      >

        <div className="absolute inset-0 bg-black/70 backdrop-blur"></div> 
      </div>
      <div className="relative z-10 flex-grow flex flex-col py-6"> 
        <Navbar role="user" />
        <main className="flex-grow p-8 md:p-12 max-w-4xl mx-auto w-full text-center text-white">
          {/* Sapaan */}
          <h1 className="py-4 text-4xl md:text-5xl font-bold mb-6">
            Halo, <span className="text-blue-400">{user?.username || 'User'}</span> 👋 {/* Warna teks aksen */}
          </h1>

          <div className="bg-white/5 text-gray-100 p-8 md:p-12 rounded-xl shadow-xl mt-6 backdrop-blur-lg border border-white/20"> {/* Background transparan, text lebih terang, backdrop-blur, border halus */}
            {/* Ikon */}
            <HiClipboardList className="text-blue-300 text-6xl mb-4 mx-auto" /> {/* Warna ikon disesuaikan */}

            {/* Judul */}
            <h2 className="text-center text-2xl md:text-3xl font-bold mb-3">
              EVALUASI SISTEM PEMERINTAHAN BERBASIS ELEKTRONIK (SPBE) Tahun 2024
            </h2>

            {/* Deskripsi */}
            <p className="text-gray-100 text-center text-base mb-8 leading-relaxed"> {/* Warna teks disesuaikan */}
              Silakan lengkapi evaluasi mandiri SPBE sesuai dengan unit kerja Anda.
              Data yang dikumpulkan akan menjadi bagian dari penilaian digitalisasi pemerintah daerah.
            </p>

            {/* Tombol Aksi - Transparan dengan border */}
            <Link
              to="/user/evaluasi"
              className="inline-block bg-white/10 border border-white/20 text-white py-3 px-8 rounded-lg text-lg font-semibold hover:bg-white/50 transition-colors duration-300 transform hover:-translate-y-1 backdrop-blur-sm" 
            >
              Mulai Evaluasi Sekarang
            </Link>
          </div>
        </main>
      </div>
    </div>
  );
}

export default DashboardUser;