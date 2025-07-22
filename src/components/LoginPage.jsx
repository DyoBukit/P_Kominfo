import React, { useState, useContext } from 'react';
import { Navigate } from 'react-router-dom'; // Ganti useNavigate dengan Navigate
import { useAuth } from '../contexts/AuthContext';
import InputField from './InputField';
import ErrorMessage from './ErrorMessage';

function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  // Ambil juga state isAuthenticated dan user dari context
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

    const selectedRole = username.toLowerCase() === 'admin' ? 'admin' : 'user';

    try {
      // Cukup panggil login, jangan navigasi di sini
      await login({ username, password }, selectedRole);
      // Biarkan komponen me-render ulang untuk melakukan navigasi
    } catch (err) {
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError('Terjadi kesalahan saat login. Silakan coba lagi.');
      }
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  };

  // --- LOGIKA BARU UNTUK NAVIGASI ---
  // Jika state isAuthenticated sudah true (setelah login berhasil),
  // maka komponen ini akan me-render ulang dan menjalankan blok ini.
  if (isAuthenticated) {
    // Tentukan tujuan berdasarkan peran dari user yang sudah ada di context
    const targetDashboard = user?.role === 'admin' ? '/admin/dashboard' : '/user/dashboard';
    // Gunakan komponen Navigate untuk mengarahkan pengguna
    return <Navigate to={targetDashboard} replace />;
  }

  // Jika belum login, tampilkan form seperti biasa
  return (
    <div className="flex items-center justify-center min-h-screen bg-black p-6">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 sm:p-10 md:p-12 rounded-xl shadow-2xl text-center w-full max-w-md animate-fade-in"
      >
        <h2 className="text-primary text-4xl font-bold mb-8">Login</h2>
        <InputField
          label="Username"
          type="text"
          id="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Enter your username"
        />
        <InputField
          label="Password"
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter your password"
        />
        {error && <ErrorMessage message={error} />}
        <button
          disabled={loading}
          type="submit"
          className="bg-black text-white cursor-pointer w-full py-3 px-6 mt-6 rounded-lg text-xl font-semibold hover:bg-gray-800 transition-all duration-300 disabled:opacity-50"
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>
        <p className="mt-4 text-sm text-gray-600">Aplikasi Form Evaluasi - Diskominfo</p>
      </form>
    </div>
  );
}

export default LoginPage;
