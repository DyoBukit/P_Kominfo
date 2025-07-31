// src/pages/Admin/DashboardAdmin.jsx
import React, { useEffect, useState } from 'react';
import Navbar from '../../components/Navbar';
import { useAuth } from '../../contexts/AuthContext';
import { Link } from 'react-router-dom';
import backgroundImage from '../../assets/bg.png';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import api from '../../utils/Api'; // pastikan file ini ada

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

function DashboardAdmin() {
  const { user, logout } = useAuth();

  return (
    <div className="relative min-h-screen w-full flex flex-col">
      {/* Background */}
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
        <div className="absolute inset-0 bg-black/60 backdrop-blur-md"></div>
      </div>

      {/* Konten */}
      <div className="relative z-10 flex-grow flex flex-col justify-start items-center">
        <Navbar role="admin" />
        <main className="p-8 md:p-12 max-w-6xl mx-auto w-full">
          <h1 className="py-4 text-4xl md:text-5xl font-bold text-white mb-10 text-center">
            Welcome, <span className="text-blue-400">{user?.username || 'Admin'}</span>!
          </h1>

          {/* Cards Fitur */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            <Link
              to="/admin/users"
              className="bg-white/10 p-8 rounded-xl shadow-xl flex flex-col items-center justify-center text-center transform transition-transform duration-300 hover:scale-105 hover:bg-white/20 text-white backdrop-blur-sm border border-white/20"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-blue-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/>
              </svg>
              <h3 className="text-2xl font-bold mt-4">Manage Users</h3>
              <p className="text-gray-200 mt-2 text-lg">Add, edit, or remove user accounts.</p>
            </Link>

            <Link
              to="/admin/form"
              className="bg-white/10 p-8 rounded-xl shadow-xl flex flex-col items-center justify-center text-center transform transition-transform duration-300 hover:scale-105 hover:bg-white/20 text-white backdrop-blur-sm border border-white/20"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-blue-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path d="M14.5 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V7.5L14.5 2z"/><path d="M14 2v6h6"/><path d="M9 15h6"/><path d="M9 9h6"/>
              </svg>
              <h3 className="text-2xl font-bold mt-4">Result of Evaluation Forms</h3>
              <p className="text-gray-200 mt-2 text-lg">Create, view, and manage evaluation forms.</p>
            </Link>

            <Link
              to="/admin/forms/create"
              className="bg-white/10 p-8 rounded-xl shadow-xl flex flex-col items-center justify-center text-center transform transition-transform duration-300 hover:scale-105 hover:bg-white/20 text-white backdrop-blur-sm border border-white/20"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-blue-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" />
              </svg>
              <h3 className="text-2xl font-bold mt-4">Manage Questions</h3>
              <p className="text-gray-200 mt-2 text-lg">Add, edit, or delete form questions.</p>
            </Link>

          </div>

        </main>
      </div>
    </div>
  );
}

export default DashboardAdmin;
