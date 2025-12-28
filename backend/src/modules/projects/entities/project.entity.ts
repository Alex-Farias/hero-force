import { UserEntity } from "src/modules/users/entities/user.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

export enum ProjectStatus {
    PENDING = 'pending',
    IN_PROGRESS = 'in_progress',
    COMPLETED = 'completed',
}

@Entity('project')
export class ProjectEntity{
    @PrimaryGeneratedColumn('increment', {name: 'id_project'})
    id_project: number;
    
    @Column({type: 'varchar', length: 255, nullable: false})
    name: string;
    
    @Column({type: 'varchar', length: 255, nullable: false})
    description: string;
    
    @Column({type: 'enum', enum: ProjectStatus, default: ProjectStatus.PENDING})
    status: ProjectStatus;
    
    @Column({type: 'varchar', length: 255, nullable: false})
    goals: string;
    
    @Column({type: 'timestamp', default: () => 'CURRENT_TIMESTAMP'})
    createdAt: Date;
    
    @Column({type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP'})
    updatedAt: Date;
    
    @Column({type: 'boolean', default: true})
    isActive: boolean;
    
    @ManyToOne(() => UserEntity, { nullable: false })
    @JoinColumn({name: 'id_user'})
    user: UserEntity;
}