// src/pages/UnauthorizedPage.jsx
import React from 'react';
import { Link } from 'react-router-dom';

function UnauthorizedPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-center p-6">
      <h1 className="text-6xl font-bold text-red-500 mb-4">403</h1>
      <h2 className="text-2xl font-semibold mb-2">Akses Ditolak</h2>
      <p className="text-gray-600 mb-8">
        Maaf, Anda tidak memiliki izin untuk mengakses halaman ini.
      </p>
      <Link
        to="/login"
        className="bg-black text-white py-3 px-6 rounded-lg font-semibold hover:bg-gray-800 transition-all duration-300"
      >
        Kembali ke Halaman Login
      </Link>
    </div>
  );
}

export default UnauthorizedPage;