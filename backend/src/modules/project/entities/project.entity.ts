import { Entity } from "typeorm";

@Entity('project')
export class Project{
    id_project: number;
    name: string;
    description: string;
    status: string; //TODO - transformar em model
    goals: string;
    user_id: number;
}