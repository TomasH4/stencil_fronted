import { useState, useEffect, useCallback } from 'react';
import { AuthUser, LoginDto, RegisterDto } from '../types/auth.types';
import { authService } from '../services/authService';

export const useAuth = () => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedToken = localStorage.getItem('token');
      const storedUser = localStorage.getItem('user');

      setTimeout(() => {
        if (storedToken && storedUser && storedToken !== 'undefined' && storedUser !== 'undefined') {
          try {
            const parsedUser = JSON.parse(storedUser);
            setToken(storedToken);
            setUser(parsedUser);
          } catch (e: unknown) {
            console.error('Failed to parse user from localStorage', e);
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            setToken(null);
          }
        } else {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
        }
        setIsLoading(false);
      }, 0);
    }
  }, []);

  const login = useCallback(async (dto: LoginDto) => {
    setIsLoading(true);
    try {
      const data = await authService.login(dto);
      setToken(data.token);
      setUser(data.user);
      if (typeof window !== 'undefined') {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
      }
      return data;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const register = useCallback(async (dto: RegisterDto) => {
    setIsLoading(true);
    try {
      const data = await authService.register(dto);
      return data;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    authService.logout();
    setToken(null);
    setUser(null);
  }, []);

  return {
    user,
    token,
    isLoading,
    isAuthenticated: !!token,
    login,
    register,
    logout,
  };
};
