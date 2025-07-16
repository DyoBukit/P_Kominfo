// src/components/ProtectedRoute.jsx
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from './AuthLoginAdmin';
import { useAuthUser } from './AuthLoginUser';

const ProtectedRoute = ({ allowedRoles }) => {
  const { isAuthenticated: isAdminAuthenticated, role: adminRole } = useAuth();
  const { isAuthenticated: isUserAuthenticated, role: userRole } = useAuthUser();

  let isAuthenticated = false;
  let currentUserRole = null;

  if (isAdminAuthenticated && adminRole === 'admin') {
    isAuthenticated = true;
    currentUserRole = 'admin';
  } else if (isUserAuthenticated && userRole === 'user') {
    isAuthenticated = true;
    currentUserRole = 'user';
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(currentUserRole)) {
    return <Navigate to={`/${currentUserRole}/dashboard`} replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;