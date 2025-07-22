// src/pages/User/EvaluationIntroPage.jsx
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import { HiClipboardList } from 'react-icons/hi'; 

function EvaluationIntroPage() {
  const navigate = useNavigate(); 

  // Fungsi untuk kembali ke halaman sebelumnya (dashboard user)
  const handleGoBack = () => {
    navigate('/user/dashboard'); 
  };

  return (
    <div className="py-6 min-h-screen bg-gradient-to-br from-gray-800 via-gray-900 to-black flex flex-col">
      <Navbar role="user" />
      <main className="flex-grow p-8 md:p-12 max-w-3xl mx-auto w-full text-center text-white">
        {/* Box utama */}
        {/* >>>>>> PERUBAHAN DI SINI: Tambahkan 'relative' pada div ini <<<<<< */}
        <div className="bg-blue-300 text-gray-800 p-8 md:p-12 rounded-xl shadow-xl mt-6 relative"> 
          {/* Tombol Kembali di sini, dengan posisi absolut */}
          <button
            onClick={handleGoBack}
            className="absolute top-4 left-4 flex items-center text-black px-3 py-1.5 rounded-md bg-blue-700 hover:bg-black transition duration-300 border border-blue-800 text-sm" // Gaya tombol lebih kecil
          >
            {/* Ikon panah kiri */}
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Kembali
          </button>

          {/* Konten utama di dalam kotak (ikon, judul, deskripsi, tombol mulai) */}
          {/* >>>>>> PERBAIKAN: Tambahkan margin-top agar tidak tertutup tombol kembali <<<<<< */}
          <div className="mt-10"> 
            {/* Ikon */}
            <HiClipboardList className="text-blue-600 text-6xl mb-4 mx-auto" />

            {/* Judul */}
            <h2 className="text-center text-2xl md:text-3xl font-bold mb-4">
              Pengantar Evaluasi SPBE Tahun 2024
            </h2>

            {/* Deskripsi/Instruksi */}
            <p className="text-gray-900 text-center text-base mb-6 leading-relaxed">
              Selamat datang di Form Evaluasi Sistem Pemerintahan Berbasis Elektronik (SPBE) Tahun 2024.
              <br/><br/>
              Formulir ini bertujuan untuk mengumpulkan data dukung evaluasi mandiri SPBE sesuai dengan unit kerja Anda. Mohon siapkan dokumen-dokumen relevan.
              <br/><br/>
              Waktu pengisian diperkirakan membutuhkan sekitar **15-20 menit**, tergantung kelengkapan data dukung yang Anda miliki. Pastikan semua kolom yang bertanda bintang (*) diisi dengan benar.
              <br/><br/>
              Terima kasih atas partisipasi Anda dalam upaya peningkatan digitalisasi pemerintah daerah.
            </p>

            {/* Tombol Mulai Form */}
            <Link
              to="/user/evaluasi/form" 
              className="inline-block bg-gradient-to-br from-gray-800 via-gray-900 to-gray-800 text-white py-3 px-8 rounded-lg text-lg font-semibold hover:bg-blue-800 transition-colors duration-300 transform hover:-translate-y-1"
            >
              Mulai Isi Formulir
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}

export default EvaluationIntroPage;