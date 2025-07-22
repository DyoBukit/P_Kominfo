// src/components/ProtectedRoute.jsx
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext'; // <--- DIUBAH: Import dari AuthContext yang digabung

const ProtectedRoute = ({ allowedRoles }) => {
  // Ambil isAuthenticated dan role langsung dari satu AuthContext
  const { isAuthenticated, role: currentUserRole } = useAuth(); 

  if (!isAuthenticated) {
    // Jika tidak terautentikasi sama sekali, arahkan ke halaman login
    return <Navigate to="/login" replace />;
  }

  // Jika terautentikasi tapi peran tidak diizinkan untuk route ini
  if (allowedRoles && !allowedRoles.includes(currentUserRole)) {
    // Anda bisa mengarahkan ke halaman "unauthorized" atau dashboard yang sesuai
    // Jika role-nya admin, arahkan ke dashboard admin
    // Jika role-nya user, arahkan ke dashboard user
    if (currentUserRole === 'admin') {
      return <Navigate to="/admin/dashboard" replace />;
    } else if (currentUserRole === 'user') {
      return <Navigate to="/user/dashboard" replace />;
    }
    // Fallback jika role tidak dikenali atau halaman unauthorized khusus
    return <Navigate to="/unauthorized" replace />; // Anda bisa membuat halaman unauthorized ini
  }

  // Jika terautentikasi dan peran diizinkan, lanjutkan ke halaman yang diminta
  return <Outlet />;
};

export default ProtectedRoute;