import api from './api';
import { MockFactory } from '../mocks/factory';
import type { Project } from '../mocks/factory';

export const ProjectsService = {
  getAll: async (): Promise<Project[]> => {
    try {
      const response = await api.get<Project[]>('/projects/read/all');
      const projects = response.data;
      const isDev = import.meta.env.DEV;
      
      if (isDev && projects.length === 0) { return MockFactory.generateProjects(24) }

      return projects;
    } catch (error) {
       if (import.meta.env.DEV) {
        console.warn('API failed in dev mode, returning mocks');
        return MockFactory.generateProjects(24);
      }
      throw error;
    }
  },

  getById: async (id: number): Promise<Project> => {
    const response = await api.get<Project>(`/projects/read/${id}`);
    return response.data;
  },

  create: async (data: Omit<Project, 'id'>): Promise<Project> => {
    const response = await api.post<Project>('/projects/create', data);
    return response.data;
  },

  update: async (id: number, data: Partial<Project>): Promise<Project> => {
    const response = await api.put<Project>(`/projects/update/${id}`, data);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/projects/delete/${id}`);
  }
};
