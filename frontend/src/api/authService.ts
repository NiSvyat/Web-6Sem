import axiosInstance from './axiosInstance';
import { LoginData, RegisterData } from '../types';

export const login = async (data: LoginData) => {
  const response = await axiosInstance.post('/auth/login', data);
  return response.data;
};

export const register = async (data: RegisterData) => {
  const response = await axiosInstance.post('/auth/register', data);
  return response.data;
};

export const getCurrentUser = async () => {
  const response = await axiosInstance.get('/auth/me');
  return response.data;
};