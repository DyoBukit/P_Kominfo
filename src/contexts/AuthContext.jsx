import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

const ADMIN_USERNAME = import.meta.env.VITE_ADMIN_USERNAME || 'admin';
const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD || 'admin123';
const USER_USERNAME = import.meta.env.VITE_USER_USERNAME || 'user'; // PASTIKAN NILAI INI
const USER_PASSWORD = import.meta.env.VITE_USER_PASSWORD || 'user123'; // PASTIKAN NILAI INI

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);

  useEffect(() => {
    console.log('AuthContext useEffect: Memuat dari localStorage...');
    try {
      const storedAdminAuth = localStorage.getItem('adminAuth');
      const storedUserAuth = localStorage.getItem('userAuth');

      if (storedAdminAuth) {
        const { isAuthenticated: authStatus, user: storedUser, role: storedRole } = JSON.parse(storedAdminAuth);
        if (authStatus && storedRole === 'admin') {
          setIsAuthenticated(authStatus);
          setUser(storedUser);
          setRole(storedRole);
          console.log('AuthContext useEffect: Admin terautentikasi ditemukan:', storedUser);
          return;
        }
      }

      if (storedUserAuth) {
        const { isAuthenticated: authStatus, user: storedUser, role: storedRole } = JSON.parse(storedUserAuth);
        if (authStatus && storedRole === 'user') {
          setIsAuthenticated(authStatus);
          setUser(storedUser);
          setRole(storedRole);
          console.log('AuthContext useEffect: User terautentikasi ditemukan:', storedUser);
        }
      }
    } catch (error) {
      console.error('AuthContext useEffect: Gagal memuat data autentikasi dari localStorage', error);
      localStorage.removeItem('adminAuth');
      localStorage.removeItem('userAuth');
    }
  }, []);

  const login = async (username, password, selectedRole) => {
    console.log(`Login attempt: user='${username}', pass='${password}', role='${selectedRole}'`);
    let success = false;
    let userData = null;

    if (selectedRole === 'admin') {
      console.log(`Admin check (comparing with ADMIN_USERNAME/PASSWORD): ${username === ADMIN_USERNAME && password === ADMIN_PASSWORD}`);
      console.log(`Expected Admin: Username: '${ADMIN_USERNAME}', Password: '${ADMIN_PASSWORD}'`);
      if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
        userData = { username, role: 'admin' };
        success = true;
      }
    } else if (selectedRole === 'user') {
      // --- PERBAIKAN DI SINI ---
      console.log(`User check (comparing with USER_USERNAME/PASSWORD): ${username === USER_USERNAME && password === USER_PASSWORD}`);
      console.log(`Expected User: Username: '${USER_USERNAME}', Password: '${USER_PASSWORD}'`); // <--- BARIS INI DIPERBAIKI
      if (username === USER_USERNAME && password === USER_PASSWORD) {
        userData = { username, role: 'user' };
        success = true;
      }
    }

    if (success) {
      setIsAuthenticated(true);
      setUser(userData);
      setRole(selectedRole);
      console.log('Login SUKSES! State:', { isAuthenticated: true, user: userData, role: selectedRole });

      if (selectedRole === 'admin') {
        localStorage.setItem('adminAuth', JSON.stringify({ isAuthenticated: true, user: userData, role: 'admin' }));
        localStorage.removeItem('userAuth');
        console.log('localStorage: adminAuth disimpan, userAuth dihapus.');
      } else if (selectedRole === 'user') {
        localStorage.setItem('userAuth', JSON.stringify({ isAuthenticated: true, user: userData, role: 'user' }));
        localStorage.removeItem('adminAuth');
        console.log('localStorage: userAuth disimpan, adminAuth dihapus.');
      }
      return true;
    }
    console.log('Login GAGAL!');
    return false;
  };

  const logout = () => {
    console.log('Logging out...');
    setIsAuthenticated(false);
    setUser(null);
    setRole(null);
    localStorage.removeItem('adminAuth');
    localStorage.removeItem('userAuth');
    console.log('Logout berhasil, localStorage dibersihkan.');
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, role, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);