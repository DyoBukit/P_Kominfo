// src/pages/User/EndPage.jsx
import React from 'react';
import Navbar from '../../components/Navbar';
import { Link } from 'react-router-dom';

function EndPage() {
  return (
    <>
      <Navbar role="user" /> {/* Bisa dihilangkan jika ingin halaman final bersih */}
      <div className="min-h-screen bg-gradient-to-br from-gray-800 via-gray-900 to-black flex flex-col justify-center items-center text-center p-8">
        <div className="bg-blue-300 p-8 md:p-16 rounded-3xl shadow-2xl max-w-2xl w-full animate-scale-in">
          {/* Keyframe scale-in bisa didefinisikan di global CSS (index.css) atau sebagai utility khusus di tailwind.config.js */}
          <h1 className="text-primary text-5xl md:text-6xl font-extrabold mb-6 leading-tight">Terima Kasih!</h1>
          <p className="text-lg md:text-xl text-gray-900 mb-10 leading-relaxed">Evaluasi Anda telah berhasil dikirim. Masukan Anda sangat berarti bagi kami.</p>
          <Link
            to="/user/dashboard"
            className="inline-block bg-accent text-white py-3 px-8 rounded-xl text-xl font-bold bg-gradient-to-br from-gray-800 via-gray-900 to-gray-800 transition-all duration-300 transform hover:-translate-y-1"
          >
            Kembali ke Dashboard
          </Link>
        </div>
      </div>
    </>
  );
}

export default EndPage;