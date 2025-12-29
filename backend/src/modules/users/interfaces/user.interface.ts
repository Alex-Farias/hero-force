export interface IUser {
  id: number;
  name: string;
  email: string;
  password: string;
  persona: string;
  createdAt: Date;
  updatedAt: Date;
  isActive: boolean;
}
