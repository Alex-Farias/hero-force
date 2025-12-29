import { 
  STATUSES, 
  ROLES, 
  TITLES, 
  DESCRIPTIONS, 
  NAMES 
} from './data';

export interface User {
  id: number;
  role: typeof ROLES[number];
  name: string;
  email: string;
  persona?: string;
  persona_id?: string;
  createdAt: Date;
  updatedAt: Date;
  isActive: boolean;
}

export interface Project {
  id: number;
  name: string;
  description: string;
  status: typeof STATUSES[number];
  goals: string;
  createdAt: Date;
  updatedAt: Date;
  isActive: boolean;
  user: User;
}

const getRandomElement = <T>(arr: readonly T[]): T => arr[Math.floor(Math.random() * arr.length)];
const getRandomDate = (start: Date, end: Date) => new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime())).toISOString().split('T')[0];

export const MockFactory = {
  createProject: (id: number): Project => ({
    id,
    name: getRandomElement(TITLES),
    status: getRandomElement(STATUSES),
    createdAt: new Date(getRandomDate(new Date(2023, 0, 1), new Date())),
    updatedAt: new Date(),
    description: getRandomElement(DESCRIPTIONS),
    goals: 'Meta gerada automaticamente pelo mock factory para testes de interface.',
    isActive: true,
    user: MockFactory.createUser(1)
  }),

  createUser: (id: number): User => {
    const name = getRandomElement(NAMES);
    return {
      id,
      name,
      email: `${name.toLowerCase().replace(' ', '.')}@heroforce.com`,
      role: getRandomElement(ROLES),
      isActive: true,
      createdAt: new Date(getRandomDate(new Date(2023, 0, 1), new Date())),
      updatedAt: new Date(),
      persona: 'Mock Persona',
      persona_id: 'MOCK-001'
    };
  },

  generateProjects: (count: number): Project[] => Array.from({ length: count }, (_, i) => MockFactory.createProject(i + 1)),
  generateUsers: (count: number): User[] => Array.from({ length: count }, (_, i) => MockFactory.createUser(i + 1)),
};
