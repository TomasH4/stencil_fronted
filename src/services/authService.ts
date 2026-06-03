import api from './api';
import { RegisterDto, LoginDto, AuthResponse } from '../types/auth.types';

export const authService = {
  register: async (dto: RegisterDto): Promise<AuthResponse> => {
    const { data } = await api.post<{data: AuthResponse}>('/auth/register', dto);
    return data.data;
  },
  
  login: async (dto: LoginDto): Promise<AuthResponse> => {
    const { data } = await api.post<{data: AuthResponse}>('/auth/login', dto);
    return data.data;
  },
  
  logout: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
  }
};
