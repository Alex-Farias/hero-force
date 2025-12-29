export const Role = {
  ADMIN: 'admin',
  HERO: 'hero'
} as const;

export type Role = typeof Role[keyof typeof Role];

export interface User {
  id: number;
  role: Role;
  name: string;
  email: string;
  persona?: string;
  persona_id?: number;
  createdAt: Date;
  updatedAt: Date;
  isActive: boolean;
}
