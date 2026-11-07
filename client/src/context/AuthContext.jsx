import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem('driveease_user');
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      return null;
    }
  });

  const [token, setToken] = useState(() => {
    return localStorage.getItem('driveease_token') || null;
  });

  const [loading, setLoading] = useState(true);

  // Synchronize on load: verify token with /api/auth/me
  useEffect(() => {
    const verifySession = async () => {
      const storedToken = localStorage.getItem('driveease_token');
      if (storedToken) {
        try {
          const res = await authService.getMe();
          if (res.data?.success && res.data?.user) {
            setUser(res.data.user);
            localStorage.setItem('driveease_user', JSON.stringify(res.data.user));
          }
        } catch (err) {
          console.warn('[Auth] Session validation failed; logging out.');
          logout();
        }
      }
      setLoading(false);
    };

    verifySession();

    // Listen for unauthorized events emitted by API interceptor
    const handleUnauthorized = () => {
      logout();
    };

    window.addEventListener('auth:unauthorized', handleUnauthorized);
    return () => window.removeEventListener('auth:unauthorized', handleUnauthorized);
  }, []);

  const login = async (email, password) => {
    const res = await authService.login({ email, password });
    if (res.data?.success) {
      const { token: receivedToken, user: receivedUser } = res.data;
      localStorage.setItem('driveease_token', receivedToken);
      localStorage.setItem('driveease_user', JSON.stringify(receivedUser));
      setToken(receivedToken);
      setUser(receivedUser);
      return receivedUser;
    }
    throw new Error(res.data?.message || 'Login failed');
  };

  const register = async (userData) => {
    const res = await authService.register(userData);
    if (res.data?.success) {
      const { token: receivedToken, user: receivedUser } = res.data;
      localStorage.setItem('driveease_token', receivedToken);
      localStorage.setItem('driveease_user', JSON.stringify(receivedUser));
      setToken(receivedToken);
      setUser(receivedUser);
      return receivedUser;
    }
    throw new Error(res.data?.message || 'Registration failed');
  };

  const updateProfile = async (profileData) => {
    const res = await authService.updateProfile(profileData);
    if (res.data?.success && res.data?.user) {
      setUser(res.data.user);
      localStorage.setItem('driveease_user', JSON.stringify(res.data.user));
      return res.data.user;
    }
    throw new Error(res.data?.message || 'Profile update failed');
  };

  const logout = () => {
    localStorage.removeItem('driveease_token');
    localStorage.removeItem('driveease_user');
    setToken(null);
    setUser(null);
  };

  const isAuthenticated = !!token && !!user;
  const isAdmin = isAuthenticated && user?.role === 'admin';

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        register,
        updateProfile,
        logout,
        isAuthenticated,
        isAdmin
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
