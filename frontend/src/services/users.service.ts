import api from './api';
import { MockFactory } from '../mocks/factory';
import { Role } from '../types/auth';
import type { User } from '../types/auth';

export const UsersService = {
  getAll: async (): Promise<User[]> => {
    try {
      const response = await api.get<User[]>('/users/read/all');
      const users = response.data;
      const isDev = import.meta.env.DEV;
      const nonAdminUsers = users.filter(u => u.role !== Role.ADMIN);

      if (isDev && nonAdminUsers.length === 0) { return MockFactory.generateUsers(12) as unknown as User[] }

      return users;
    } catch (error) {
      if (import.meta.env.DEV) {
        console.warn('API failed in dev mode, returning mocks');
        return MockFactory.generateUsers(12) as unknown as User[];
      }
      throw error;
    }
  },

  getById: async (id: number): Promise<User> => {
    const response = await api.get<User>(`/users/read/${id}`);
    return response.data;
  },

  update: async (id: number, data: Partial<User> & { password?: string }): Promise<User> => {
    const response = await api.put<User>(`/users/update/${id}`, data);
    return response.data;
  },

  create: async (data: Omit<User, 'id' | 'createdAt' | 'updatedAt' | 'isActive'> & { password?: string }): Promise<User> => {
    const response = await api.post<User>('/users/create', data);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/users/delete/${id}`);
  }
};
