import { Entity } from "typeorm";

@Entity('user')
export class User{
    id_user: number;
    name: string;
    email: string;
    password: string;
    persona: string; //TODO - transformar em model
}