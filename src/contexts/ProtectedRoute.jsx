import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from './AuthContext';

// Komponen ini menggunakan pola "Layout Route" dari react-router-dom v6
const ProtectedRoute = ({ allowedRoles }) => {
  const { isAuthenticated, user } = useAuth();

  // 1. Periksa apakah pengguna sudah terautentikasi.
  // Jika tidak, arahkan ke halaman login.
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // 2. Jika sudah login, periksa apakah perannya diizinkan.
  // Pastikan objek 'user' ada sebelum mencoba membaca 'user.role'.
  const isAllowed = user && allowedRoles && allowedRoles.includes(user.role);

  if (!isAllowed) {
    // Jika peran tidak diizinkan, arahkan ke halaman "Unauthorized" untuk umpan balik yang jelas.
    return <Navigate to="/unauthorized" replace />;
  }

  // 3. Jika semua pemeriksaan lolos, tampilkan halaman anak yang diminta (melalui <Outlet />).
  return <Outlet />;
};

export default ProtectedRoute;