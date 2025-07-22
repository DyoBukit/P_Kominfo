// src/components/Navbar.jsx
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext'; // Ini sudah benar

function Navbar() {
  const navigate = useNavigate();


  const { isAuthenticated, user, role, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-black/30 text-slate-300 px-6 py-4 flex flex-col sm:flex-row justify-between items-center shadow-md">
      <Link to="/" className="text-3xl font-bold text-white uppercase tracking-wider mb-4 sm:mb-0">
        Eval<span className="text-blue-400">App</span>
      </Link>
      <ul className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 w-full sm:w-auto">
        {/* Tampilkan link navigasi hanya jika pengguna terautentikasi */}
        {isAuthenticated && role === 'admin' && ( // Pastikan hanya tampil jika terautentikasi dan role admin
          <>
            <li><Link to="/admin/dashboard" className="text-lg py-2 px-4 rounded-lg hover:bg-white/10 transition-colors duration-300">Dashboard</Link></li>
            <li><Link to="/admin/users" className="text-lg py-2 px-4 rounded-lg hover:bg-white/10 transition-colors duration-300">Manage Users</Link></li>
            <li><Link to="/admin/forms" className="text-lg py-2 px-4 rounded-lg hover:bg-white/10 transition-colors duration-300">Manage Forms</Link></li>
          </>
        )}
        {isAuthenticated && role === 'user' && ( // Pastikan hanya tampil jika terautentikasi dan role user
          <>
          </>
        )}
        {/* Tampilkan tombol Logout hanya jika pengguna terautentikasi */}
        {isAuthenticated && (
          <li>
            <button
              onClick={handleLogout}
              className="cursor-pointer text-lg border border-white px-4 py-2 py-1 rounded hover:bg-white hover:text-black transition duration-300"
            >
              Logout
            </button>
          </li>
        )}
        {/* Opsional: Tampilkan tombol Login jika tidak terautentikasi */}
        {!isAuthenticated && (
          <li>
            <Link to="/login" className="cursor-pointer text-lg border border-white px-4 py-2 py-1 rounded hover:bg-white hover:text-black transition duration-300">
              Login
            </Link>
          </li>
        )}
      </ul>
    </nav>
  );
}

export default Navbar;