import axiosInstance from './axiosInstance';
import { clearAuthToken, setAuthToken } from '../utils/auth';
import type { LoginData, RegisterData, User, AuthResponse } from '../types';

export const login = async (data: LoginData): Promise<User> => {
  const response = await axiosInstance.post<AuthResponse>('/auth/login', data);
  setAuthToken(response.data.token);
  return response.data.user;
};

export const logout = async (): Promise<void> => {
  await axiosInstance.post('/auth/logout');
  clearAuthToken();
};

export const register = async (data: RegisterData): Promise<User> => {
  const response = await axiosInstance.post<{
    user: User;
    token: string;
  }>('/auth/register', {
    email: data.email,
    password: data.password,
    name: data.name
  });

  setAuthToken(response.data.token);
  return response.data.user;
};

export const getCurrentUser = async (): Promise<User> => {
  const response = await axiosInstance.get<User>('/auth/me');
  return response.data;
};