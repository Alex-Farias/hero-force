import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('user')
export class UserEntity{
    @PrimaryGeneratedColumn('increment', {name: 'id_user'})
    id_user: number;
    @Column({type: 'varchar', length: 255, nullable: false})
    name: string;
    @Column({type: 'varchar', length: 255, nullable: false})
    email: string;
    @Column({type: 'varchar', length: 255, nullable: false})
    password: string;
    @Column({type: 'varchar', length: 255, nullable: false})
    persona: string; //TODO - transformar em model
    @Column({type: 'timestamp', default: () => 'CURRENT_TIMESTAMP'})
    createdAt: Date;
    @Column({type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP'})
    updatedAt: Date;
    @Column({type: 'boolean', default: true})
    isActive: boolean;
}