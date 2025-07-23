// src/components/LoginPage.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Ini untuk navigasi imperatif (fungsi navigate)
// import InputField from './InputField'; // Baris ini sudah bisa dihapus karena InputField di-inline

import ErrorMessage from './ErrorMessage';
import { useAuth } from '../contexts/AuthContext'; 

// Import ikon dari react-icons
import { FaUser, FaLock } from 'react-icons/fa'; // Import ikon user dan lock

function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate(); // Inisialisasi useNavigate
  const { login } = useAuth(); // Ambil fungsi login dari AuthContext
  const [loading, setLoading] = useState(false);

  // Perhatikan: `isAuthenticated` dan `user` tidak diambil dari `useAuth()` di sini
  // karena navigasi sudah langsung di-handle di `handleSubmit`

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!username || !password) {
      setError('Username and password are required.');
      setLoading(false);
      return;
    }

    try {
      const selectedRole = username.toLowerCase() === 'admin' ? 'admin' : 'user';
      console.log(`LoginPage: Mencoba login untuk peran: ${selectedRole}, username: '${username}', password: '${password}'`);
      
      const success = await login(username, password, selectedRole); 
      console.log(`LoginPage: Fungsi login mengembalikan success: ${success}`);

      if (success) {
        if (selectedRole === 'admin') {
          navigate('/admin/dashboard');
        } else { // selectedRole === 'user'
          navigate('/user/dashboard');
        }
      } else {
        setError('Kredensial tidak valid.'); 
      }
    } catch (err) {
      setError('An error occurred during login. Please try again.');
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-black p-6">
      <form
        onSubmit={handleSubmit}
        className="bg-gray-800 p-8 sm:p-10 md:p-12 rounded-xl shadow-2xl text-center w-full max-w-md animate-fade-in
                   bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700" /* Perubahan: Background gelap, border */
      >
        <h2 className="text-white text-5xl font-extrabold mb-10 tracking-wide">Login</h2> {/* Perubahan: Teks putih, lebih besar, bold, tracking */}
        
        {/* Input Username dengan ikon */}
        <div className="mb-6 relative">
          <FaUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" /> {/* Ikon user */}
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Username"
            className="w-full pl-12 pr-4 py-3 rounded-full bg-gray-700 text-white placeholder-gray-400 border border-gray-600 shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300" /* Gaya input pill-shaped */
          />
        </div>

        {/* Input Password dengan ikon */}
        <div className="mb-6 relative">
          <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" /> {/* Ikon lock */}
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="w-full pl-12 pr-4 py-3 rounded-full bg-gray-700 text-white placeholder-gray-400 border border-gray-600 shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300" /* Gaya input pill-shaped */
          />
        </div>

        {error && <ErrorMessage message={error} />}
        
        <button disabled={loading}
          type="submit"
          className="bg-blue-600 text-white cursor-pointer w-full py-3 px-6 mt-8 rounded-full text-xl font-bold hover:bg-blue-700 transition-all duration-300 shadow-lg transform active:scale-98" /* Gaya tombol pill-shaped, shadow, dan efek aktif */
        >
          {loading ? 'Loading...' : 'Login'} {/* Tampilkan loading state */}
        </button>
        
        <p className="mt-6 text-sm text-gray-500">Aplikasi Form Evaluasi - Diskominfo</p>
      </form>
    </div>
  );
}

export default LoginPage;