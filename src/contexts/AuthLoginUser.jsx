import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthUserContext = createContext(null);

const USER_USERNAME = import.meta.env.VITE_USER_USERNAME || 'user';
const USER_PASSWORD = import.meta.env.VITE_USER_PASSWORD || 'user123';

export const AuthUserProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);

  useEffect(() => {
    try {
      const storedAuth = localStorage.getItem('userAuth');
      if (storedAuth) {
        const { isAuthenticated: authStatus, user: storedUser, role: storedRole } = JSON.parse(storedAuth);
        setIsAuthenticated(authStatus);
        setUser(storedUser);
        setRole(storedRole);
      }
    } catch (error) {
      console.error('Gagal memuat data userAuth dari localStorage', error);
      localStorage.removeItem('userAuth');
    }
  }, []);

  const login = async (username, password) => {
    if (username === 'user' && password === 'user123') {
      const userData = { username, role: 'user' };
      setIsAuthenticated(true);
      setUser(userData);
      setRole('user');
      localStorage.setItem('userAuth', JSON.stringify({ isAuthenticated: true, user: userData, role: 'user' }));
      localStorage.removeItem('adminAuth');
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
    setRole(null);
    localStorage.removeItem('userAuth');
    localStorage.removeItem('adminAuth'); // bersihkan juga
  };

  return (
    <AuthUserContext.Provider value={{ isAuthenticated, user, role, login, logout }}>
      {children}
    </AuthUserContext.Provider>
  );
};

export const useAuthUser = () => useContext(AuthUserContext);
