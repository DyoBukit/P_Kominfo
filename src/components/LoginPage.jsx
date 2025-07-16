// src/components/LoginPage.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import InputField from './InputField';
import ErrorMessage from './ErrorMessage';
import { useAuth } from '../contexts/AuthLoginAdmin';
import { useAuthUser } from '../contexts/AuthLoginUser';

function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login: adminLogin } = useAuth();
  const { login: userLogin } = useAuthUser();
  const [loading, setLoading] = useState(false);

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
      if (username.toLowerCase() === 'admin') {
        const success = await adminLogin(username, password);
        if (success) {
          navigate('/admin/dashboard');
        } else {
          setError('Invalid admin credentials.');
        }
      } else {
        const success = await userLogin(username, password);
        if (success) {
          navigate('/user/dashboard');
        } else {
          setError('Invalid user credentials.');
        }
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
        className="bg-white p-8 sm:p-10 md:p-12 rounded-xl shadow-2xl text-center w-full max-w-md animate-fade-in"
        // Keyframe fade-in bisa didefinisikan di global CSS (index.css) atau sebagai utility khusus di tailwind.config.js
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
        <button disabled={loading}
          type="submit"
          className="bg-black text-white cursor-pointer w-full py-3 px-6 mt-6 rounded-lg text-xl font-semibold hover:bg-secondary transition-all duration-300"
        >
          Login
        </button>
        <p className="mt-4 text-sm text-gray-600">Aplikasi Form Evaluasi - Diskominfo</p>
      </form>
    </div>
  );
}

export default LoginPage;