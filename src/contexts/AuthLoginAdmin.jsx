import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

const ADMIN_USERNAME = import.meta.env.VITE_ADMIN_USERNAME || 'admin';
const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD || 'admin123';

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);

  useEffect(() => {
    try {
      const storedAuth = localStorage.getItem('adminAuth');
      if (storedAuth) {
        const { isAuthenticated: authStatus, user: storedUser, role: storedRole } = JSON.parse(storedAuth);
        setIsAuthenticated(authStatus);
        setUser(storedUser);
        setRole(storedRole);
      }
    } catch (error) {
      console.error('Gagal memuat data adminAuth dari localStorage', error);
      localStorage.removeItem('adminAuth');
    }
  }, []);

  const login = async (username, password) => {
    if (username === 'admin' && password === 'admin123') {
      const adminData = { username, role: 'admin' };
      setIsAuthenticated(true);
      setUser(adminData);
      setRole('admin');
      localStorage.setItem('adminAuth', JSON.stringify({ isAuthenticated: true, user: adminData, role: 'admin' }));
      localStorage.removeItem('userAuth')
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
    setRole(null);
    localStorage.removeItem('adminAuth');
    localStorage.removeItem('userAuth'); // bersihkan juga
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, role, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
