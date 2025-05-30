import axiosInstance from './axiosInstance';
import type { Event } from '../types';

export const getEvents = async (category?: string): Promise<Event[]> => {
  const params = category ? { category } : {};
  const response = await axiosInstance.get('/events', { params });
  return response.data;
};