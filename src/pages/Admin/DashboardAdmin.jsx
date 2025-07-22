// src/pages/Admin/DashboardAdmin.jsx
import React from 'react';
import Navbar from '../../components/Navbar';
import { useAuth } from '../../contexts/AuthContext'; // <--- PASTIKAN INI IMPORT DARI AUTHCONTEXT YANG DIGABUNG
import { Link } from 'react-router-dom';

// Jika Anda ingin menggunakan ikon, instal react-icons: npm install react-icons
// import { FaUsers, FaClipboardList } from 'react-icons/fa';

function DashboardAdmin() {
  const { user, logout } = useAuth();

  return (
    <div className="py-6 min-h-screen bg-gradient-to-br from-gray-800 via-gray-900 to-black flex flex-col">
      <Navbar role="admin" /> {/* Navbar tetap menerima role sebagai prop */}
      <main className="flex-grow p-8 md:p-12 max-w-6xl mx-auto w-full">
        <h1 className="py-4 text-4xl md:text-5xl py- font-bold text-white mb-10 text-center">
          Welcome, <span className="text-primary">{user?.username || 'Admin'}</span>!
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <Link
            to="/admin/users"
            className="bg-white p-8 rounded-xl shadow-lg flex flex-col items-center justify-center text-center transform transition-transform duration-300 hover:scale-105 hover:shadow-xl text-dark"
          >
            {/* <FaUsers className="text-primary text-5xl mb-4" /> */}
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-primary mb-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
            <h3 className="text-accent text-2xl font-bold mt-4">Manage Users</h3>
            <p className="text-gray-600 mt-2 text-lg">Add, edit, or remove user accounts.</p>
          </Link>
          <Link
            to="/admin/forms"
            className="bg-white p-8 rounded-xl shadow-lg flex flex-col items-center justify-center text-center transform transition-transform duration-300 hover:scale-105 hover:shadow-xl text-dark"
          >
            {/* <FaClipboardList className="text-primary text-5xl mb-4" /> */}
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-primary mb-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><path d="M14 2v6h6"/><path d="M9 15h6"/><path d="M9 9h6"/></svg>
            <h3 className="text-accent text-2xl font-bold mt-4">Manage Evaluation Forms</h3>
            <p className="text-gray-600 mt-2 text-lg">Create, view, and manage evaluation forms.</p>
          </Link>
        </div>
      </main>
    </div>
  );
}

export default DashboardAdmin;