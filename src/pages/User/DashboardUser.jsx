// src/pages/User/DashboardUser.jsx
import React from 'react';
import { HiClipboardList } from 'react-icons/hi'; // Ikon tema evaluasi
import Navbar from '../../components/Navbar';
import { useAuthUser } from '../../contexts/AuthLoginUser';
import { Link } from 'react-router-dom';

function DashboardUser() {
  const { user } = useAuthUser();

  return (
    <div className="py-6 min-h-screen bg-gradient-to-br from-gray-800 via-gray-900 to-black flex flex-col">
      <Navbar role="user" />
      <main className="flex-grow p-8 md:p-12 max-w-3xl mx-auto w-full text-center text-white">
        {/* Sapaan */}
        <h1 className="text-4xl md:text-5xl font-bold mb-6">
          Halo, <span className="text-primary">{user?.username || 'User'}</span> 👋
        </h1>

        {/* Box utama */}
        <div className="bg-blue-300 text-gray-800 p-8 md:p-12 rounded-xl shadow-xl mt-6">
          {/* Ikon */}
          <HiClipboardList className="text-blue-600 text-6xl mb-4 mx-auto" />

          {/* Judul */}
          <h2 className="text-center text-2xl md:text-3xl font-bold mb-2">
            EVALUASI SISTEM PEMERINTAHAN BERBASIS ELEKTRONIK (SPBE) Tahun 2024
          </h2>

          {/* Deskripsi */}
          <p className="text-gray-900 text-center text-base mb-6 leading-relaxed">
            Silakan lengkapi evaluasi mandiri SPBE sesuai dengan unit kerja Anda.
            Data yang dikumpulkan akan menjadi bagian dari penilaian digitalisasi pemerintah daerah.
          </p>

          {/* Tombol Aksi */}
          <Link
            to="/user/evaluasi"
            className="inline-block bg-gradient-to-br from-gray-800 via-gray-900 to-gray-800 text-white py-3 px-8 rounded-lg text-lg font-semibold hover:bg-blue-800 transition-colors duration-300 transform hover:-translate-y-1"
          >
            Mulai Evaluasi Sekarang
          </Link>
        </div>
      </main>
    </div>
  );
}

export default DashboardUser;
