export interface IProject {
    id: number;
    name: string;
    description: string;
    status: string;
    goals: string;
    userId: number;
    createdAt: Date;
    updatedAt: Date;
    isActive: boolean;
}