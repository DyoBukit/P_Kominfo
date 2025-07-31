// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import { AuthProvider } from './contexts/AuthContext';
import LoginPage from './components/LoginPage';
import ProtectedRoute from './contexts/ProtectedRoute';

// Import halaman Admin
import DashboardAdmin from './pages/Admin/DashboardAdmin';
import ManageUsersPage from './pages/Admin/ManageUsersPage';
import FormTable from './pages/Admin/FormTable';
import ManageQuestionsPage from './pages/Admin/ManageQuestionPage';

// Import halaman User
import DashboardUser from './pages/User/DashboardUser';
import FormEvaluasiPage from './pages/User/FormEvaluasiPage';
import EndPage from './pages/User/EndPage'; 
import DaftarForm from './pages/Admin/DaftarForm';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/login" element={<LoginPage />} />

          <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
            <Route path="/admin/dashboard" element={<DashboardAdmin />} />
            <Route path="/admin/users" element={<ManageUsersPage />} />
            <Route path="/admin/form" element={<FormTable />} />
            <Route path="/admin/view" element={<DaftarForm />} />
            <Route path="/admin/forms/create" element={<ManageQuestionsPage />} />
          </Route>

          <Route element={<ProtectedRoute allowedRoles={['user']} />}>
            <Route path="/user/dashboard" element={<DashboardUser />} />     
            <Route path="/user/evaluasi/form" element={<FormEvaluasiPage />} /> 
            <Route path="/user/evaluasi/complete" element={<EndPage />} />
          </Route>

          <Route path="*" element={<div className="min-h-screen flex items-center justify-center text-2xl font-bold text-gray-700">404 Not Found</div>} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;