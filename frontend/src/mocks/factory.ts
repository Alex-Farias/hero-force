export interface Project {
  id: number;
  title: string;
  status: 'Em Andamento' | 'Concluído' | 'Pendente' | 'Cancelado';
  date: string;
  description: string;
  priority: 'Alta' | 'Média' | 'Baixa';
  teamSize: number;
}

export interface User {
  id: number;
  name: string;
  email: string;
  role: 'Admin' | 'User' | 'Guest';
  status: 'Active' | 'Inactive';
  lastLogin: string;
  avatarUrl: string;
}

const STATUSES = ['Em Andamento', 'Concluído', 'Pendente', 'Cancelado'] as const;
const PRIORITIES = ['Alta', 'Média', 'Baixa'] as const;
const ROLES = ['Admin', 'User', 'Guest'] as const;
const USER_STATUSES = ['Active', 'Inactive'] as const;

const TITLES = [
  'Sistema de Gestão Hero', 'App Mobile Vingadores', 'Portal da Justiça', 
  'Monitoramento Global', 'Protocolo Sokovia', 'Iniciativa Ultron',
  'Defesa Planetária', 'Rede Neural Stark', 'Arquivo X-Mansion',
  'Projeto T.A.H.I.T.I.', 'Sentinela Mark IV', 'Cérebro 2.0',
  'Reconstrução de Asgard', 'Defesa de Wakanda', 'Rastreamento de Joias',
  'Academia Jovens Vingadores', 'Protocolo Clean Slate', 'Torre Baxter OS'
];

const DESCRIPTIONS = [
  'Desenvolvimento de ERP completo para gestão de heróis e recursos logísticos.',
  'Aplicativo criptografado para comunicação segura entre membros da equipe em campo.',
  'Portal público para denúncias anônimas e solicitações de ajuda emergencial.',
  'Sistema de rastreamento de ameaças extraterrestres em tempo real via satélite.',
  'Protocolo de segurança automatizado para contenção de danos colaterais em áreas urbanas.',
  'Inteligência artificial preditiva para análise de riscos globais e prevenção de catástrofes.',
  'Interface neural para controle remoto de armaduras e drones de defesa.',
  'Banco de dados genético para identificação de novos mutantes e inumanos.',
  'Sistema de vigilância mágica para detecção de anomalias dimensionais.',
  'Plataforma de treinamento virtual para simulação de cenários de combate.'
];

const NAMES = [
  'Tony Stark', 'Steve Rogers', 'Natasha Romanoff', 'Bruce Banner', 
  'Thor Odinson', 'Clint Barton', 'Wanda Maximoff', 'Vision', 
  'Sam Wilson', 'Bucky Barnes', 'Peter Parker', 'Stephen Strange'
];

const getRandomElement = <T>(arr: readonly T[]): T => arr[Math.floor(Math.random() * arr.length)];
const getRandomDate = (start: Date, end: Date) => new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime())).toISOString().split('T')[0];

export const MockFactory = {
  createProject: (id: number): Project => ({
    id,
    title: getRandomElement(TITLES),
    status: getRandomElement(STATUSES),
    date: getRandomDate(new Date(2023, 0, 1), new Date()),
    description: getRandomElement(DESCRIPTIONS),
    priority: getRandomElement(PRIORITIES),
    teamSize: Math.floor(Math.random() * 10) + 1,
  }),

  createUser: (id: number): User => {
    const name = getRandomElement(NAMES);
    return {
      id,
      name,
      email: `${name.toLowerCase().replace(' ', '.')}@heroforce.com`,
      role: getRandomElement(ROLES),
      status: getRandomElement(USER_STATUSES),
      lastLogin: getRandomDate(new Date(2023, 0, 1), new Date()),
      avatarUrl: `https://ui-avatars.com/api/?name=${name.replace(' ', '+')}&background=random`,
    };
  },

  generateProjects: (count: number): Project[] => Array.from({ length: count }, (_, i) => MockFactory.createProject(i + 1)),
  generateUsers: (count: number): User[] => Array.from({ length: count }, (_, i) => MockFactory.createUser(i + 1)),
};
