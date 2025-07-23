// src/components/LoginPage.jsx
import React, { useState } from 'react';
import { Navigate } from 'react-router-dom'; // Ganti useNavigate dengan Navigate
import { useAuth } from '../contexts/AuthContext';
import ErrorMessage from './ErrorMessage';
import { FaUser, FaLock } from 'react-icons/fa';

function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  // Ambil juga state isAuthenticated dan user dari context untuk navigasi yang aman
  const { login, isAuthenticated, user } = useAuth();
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!username || !password) {
      setError('Username dan password harus diisi.');
      setLoading(false);
      return;
    }

    // --- LOGIKA BARU YANG LEBIH FLEKSIBEL ---
    // Kita akan mencoba login sebagai admin terlebih dahulu jika username mengandung kata "admin"
    const isPotentiallyAdmin = username.toLowerCase().includes('admin');
    // --- PERBAIKAN DI SINI ---
    // Menggunakan 'user' sesuai dengan backend yang sudah diperbarui
    const roleToTry = isPotentiallyAdmin ? 'admin' : 'user';

    try {
      // Panggil login dengan peran yang kita coba.
      // AuthContext akan memanggil endpoint yang sesuai.
      await login({ username, password }, roleToTry);
      
    } catch (err) {
      // Jika percobaan pertama gagal, dan itu adalah percobaan admin,
      // kita bisa coba lagi sebagai pengguna biasa secara otomatis.
      if (roleToTry === 'admin') {
        console.log("Percobaan login admin gagal, mencoba sebagai pengguna...");
        try {
          // --- PERBAIKAN DI SINI ---
          // Menggunakan 'user' sesuai dengan backend yang sudah diperbarui
          await login({ username, password }, 'user');
        } catch (finalErr) {
          setError(finalErr.response?.data?.message || 'Kredensial tidak valid.');
        }
      } else {
        setError(err.response?.data?.message || 'Kredensial tidak valid.');
      }
    } finally {
      setLoading(false);
    }
  };

  // --- LOGIKA NAVIGASI YANG BENAR (MENGHINDARI RACE CONDITION) ---
  // Jika state isAuthenticated sudah true, komponen ini akan me-render ulang
  // dan menjalankan blok ini untuk navigasi yang aman.
  if (isAuthenticated) {
    const targetDashboard = user?.role === 'admin' ? '/admin/dashboard' : '/user/dashboard';
    return <Navigate to={targetDashboard} replace />;
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-black p-6">
      <form
        onSubmit={handleSubmit}
        className="bg-gray-800 p-8 sm:p-10 md:p-12 rounded-xl shadow-2xl text-center w-full max-w-md animate-fade-in bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700"
      >
        <h2 className="text-white text-5xl font-extrabold mb-10 tracking-wide">Login</h2>
        
        <div className="mb-6 relative">
          <FaUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Username"
            className="w-full pl-12 pr-4 py-3 rounded-full bg-gray-700 text-white placeholder-gray-400 border border-gray-600 shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
          />
        </div>
        <div className="mb-6 relative">
          <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="w-full pl-12 pr-4 py-3 rounded-full bg-gray-700 text-white placeholder-gray-400 border border-gray-600 shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
          />
        </div>
        {error && <ErrorMessage message={error} />}
        <button disabled={loading}
          type="submit"
          className="bg-blue-600 text-white cursor-pointer w-full py-3 px-6 mt-8 rounded-full text-xl font-bold hover:bg-blue-700 transition-all duration-300 shadow-lg transform active:scale-98 disabled:opacity-50"
        >
          {loading ? 'Loading...' : 'Login'}
        </button>
        <p className="mt-6 text-sm text-gray-500">Aplikasi Form Evaluasi - Diskominfo</p>
      </form>
    </div>
  );
}

export default LoginPage;