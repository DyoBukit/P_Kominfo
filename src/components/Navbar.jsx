// src/components/Navbar.jsx
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthLoginAdmin';
import { useAuthUser } from '../contexts/AuthLoginUser';

function Navbar() {
  const navigate = useNavigate();

  const { logout: adminLogout, role: adminRole, isAuthenticated: isAdmin } = useAuth();
  const { logout: userLogout, role: userRole, isAuthenticated: isUser } = useAuthUser();

  const handleLogout = () => {
    adminLogout();
    userLogout();
    navigate('/login');
  };

  // Tentukan role yang sedang aktif
  const role = isAdmin ? adminRole : isUser ? userRole : null;


  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-black/30 text-slate-300 px-6 py-4 flex flex-col sm:flex-row justify-between items-center shadow-md">
      <Link to="/" className="text-3xl font-bold text-white uppercase tracking-wider mb-4 sm:mb-0">
        Eval<span className="text-blue-400">App</span>
      </Link>
      <ul className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 w-full sm:w-auto">
        {role === 'admin' && (
          <>
            <li><Link to="/admin/dashboard" className="text-lg py-2 px-4 rounded-lg hover:bg-white/10 transition-colors duration-300">Dashboard</Link></li>
            <li><Link to="/admin/users" className="text-lg py-2 px-4 rounded-lg hover:bg-white/10 transition-colors duration-300">Manage Users</Link></li>
            <li><Link to="/admin/forms" className="text-lg py-2 px-4 rounded-lg hover:bg-white/10 transition-colors duration-300">Manage Forms</Link></li>
          </>
        )}
        {role === 'user' && (
          <>
            <li><Link to="/user/dashboard" className="text-lg py-2 px-4 rounded-lg hover:bg-white/10 transition-colors duration-300">Dashboard</Link></li>
            <li><Link to="/user/evaluasi" className="text-lg py-2 px-4 rounded-lg hover:bg-white/10 transition-colors duration-300">Isi Evaluasi</Link></li>
          </>
        )}
        <li>
          <button
            onClick={handleLogout}
            className="cursor-pointer text-lg border border-white px-4 py-2 py-1 rounded hover:bg-white hover:text-black transition duration-300"
          >
            Logout
          </button>
        </li>
      </ul>
    </nav>
  );
}

export default Navbar;