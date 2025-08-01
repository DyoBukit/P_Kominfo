// src/contexts/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../utils/Api'; 

// Hanya perlu satu deklarasi Context
export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // useEffect untuk memuat status autentikasi dari sessionStorage saat aplikasi pertama kali dimuat
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');

    if (storedToken && storedUser) {
      const userObject = JSON.parse(storedUser);
      // Set state dari data yang tersimpan
      setToken(storedToken);
      setUser(userObject);
      setIsAuthenticated(true);
      
      // Atur header Authorization default untuk semua request Axios selanjutnya
      api.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
      console.log('AuthContext: Sesi ditemukan dari sessionStorage untuk user:', userObject.username);
    }
  }, []);

  // Fungsi login yang memanggil backend
  const login = async (credentials, role) => {
    // Tentukan endpoint API berdasarkan peran yang dipilih saat login
    const endpoint = role === 'admin' ? 'admin/login' : '/login';
    
    try {
      console.log(`Mencoba login ke endpoint: ${endpoint}`);
      const response = await api.post(endpoint, credentials);

      // Jika berhasil, backend akan mengembalikan token dan data user (termasuk peran)
      const { access_token, user: userData } = response.data;

      // >>> PERBAIKAN: Simpan token dan data user ke sessionStorage <<<
      localStorage.setItem('token', access_token);
      localStorage.setItem('user', JSON.stringify(userData));
      
      // Perbarui state aplikasi
      setToken(access_token);
      setUser(userData);
      setIsAuthenticated(true);

      // Atur header Authorization default untuk semua request Axios selanjutnya
      api.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;

      console.log(`Login berhasil sebagai ${userData.role}:`, userData);

    } catch (error) {
      console.error(`Login gagal untuk peran ${role}:`, error.response ? error.response.data : error.message);
      
      throw error;
    }
  };

  const logout = async () => {
    if (token) {
      const endpoint = user?.role === 'admin' ? '/admin/logout' : '/logout';
      
      try {
        await api.post(endpoint);
        console.log('Token berhasil dibatalkan di server.');
      } catch (error) {
        if (error.response && error.response.status === 401) {
          console.log("Token sudah expired, logout di sisi klien tetap dilanjutkan.");
        } else {
          console.error("Panggilan API logout gagal, tetap melanjutkan logout di sisi klien:", error);
        }
      }
    } else {
        console.log("Tidak ada token, melanjutkan logout di sisi klien.");
    }

    localStorage.removeItem('token');
    localStorage.removeItem('user');
      
    setToken(null);
    setUser(null);
    setIsAuthenticated(false);

    delete api.defaults.headers.common['Authorization'];
    console.log('Logout berhasil, sesi klien dibersihkan.');
    
  };

  // Nilai yang akan disediakan oleh Context Provider
  const value = {
    isAuthenticated,
    user, // Objek user berisi semua data, termasuk user.name, user.email, dan user.role
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook untuk mempermudah penggunaan context
export const useAuth = () => useContext(AuthContext);