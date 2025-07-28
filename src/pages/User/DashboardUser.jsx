// src/pages/User/EvaluationIntroPage.jsx
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import { HiClipboardList } from 'react-icons/hi';

// Import gambar background utama
import backgroundImage from '../../assets/bg.png';
// Import gambar pola jaringan (siluet) untuk di dalam kotak
import networkPattern from '../../assets/network_pattern.jpg';

function EvaluationIntroPage() {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate('/user/dashboard');
  };

  return (
    // Lapisan Paling Luar: Container utama dengan posisi relatif
    <div className="relative min-h-screen w-full flex flex-col">

      {/* Layer 1: Background Gambar yang di-Blur */}
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          backgroundAttachment: 'fixed',
        }}
      >
        <div className="absolute inset-0 bg-black/70 backdrop-blur-md"></div> {/* Overlay dan blur */}
      </div>

      {/* Layer 2: Konten Halaman (Navbar & Main) - paling atas */}
      <div className="relative z-10 flex-grow flex flex-col py-6">
        <Navbar role="user" />
        <main className="flex-grow p-8 md:p-12 max-w-4xl mx-auto w-full text-center text-white">
          {/* Box utama - Efek Frosted Glass - Sekarang posisinya relative */}
          <div className="bg-white/5 text-gray-100 p-10 md:p-14 rounded-xl shadow-2xl mt-6 relative border border-white/20 overflow-hidden">

            {/* Siluet samar jaringan digital di sini */}
            <img
              src={networkPattern}
              alt="Network Pattern"
              className="absolute inset-0 w-full h-full object-cover opacity-5 pointer-events-none"
            />

            {/* Konten utama di dalam kotak - harus di atas background pattern */}
            <div className="mt-10 relative z-10">
              {/* Ikon */}
              <HiClipboardList className="text-blue-300 text-6xl mb-4 mx-auto" />

              {/* Judul */}
              <h2 className="text-center text-3xl text-gray-200 md:text-4xl font-bold mb-6">
                Pengantar Evaluasi SPBE Tahun 2024
              </h2>

              {/* Deskripsi/Instruksi */}
              <p className="text-gray-200 text-justify text-base mb-6 leading-relaxed mb-10">
                Selamat datang di Form Evaluasi Sistem Pemerintahan Berbasis Elektronik (SPBE) Tahun 2024.
                Formulir ini bertujuan untuk mengumpulkan data dukung evaluasi mandiri SPBE sesuai dengan unit kerja Anda. Mohon siapkan dokumen-dokumen relevan.
                Waktu pengisian diperkirakan membutuhkan sekitar **15-20 menit**, tergantung kelengkapan data dukung yang Anda miliki. Pastikan semua kolom yang bertanda bintang (*) diisi dengan benar.
                Terima kasih atas partisipasi Anda dalam upaya peningkatan digitalisasi pemerintah daerah.
              </p>

              {/* Tombol Mulai Form */}
              <Link
                to="/user/evaluasi/form"
                className="inline-block bg-gradient-to-br from-blue-500 via-blue-600 to-blue-500 text-white py-3 px-8 rounded-lg text-lg font-semibold hover:bg-blue-800 transition-colors duration-300 transform hover:-translate-y-1"
              >
                Mulai Isi Formulir
              </Link>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default EvaluationIntroPage;