import { UserEntity } from "src/modules/users/entities/user.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity('project')
export class ProjectEntity{
    @PrimaryGeneratedColumn('increment', {name: 'id_project'})
    id_project: number;
    @Column({type: 'varchar', length: 255, nullable: false})
    name: string;
    @Column({type: 'varchar', length: 255, nullable: false})
    description: string;
    @Column({type: 'varchar', length: 255, nullable: false})
    status: string; //TODO - transformar em model
    @Column({type: 'varchar', length: 255, nullable: false})
    goals: string;
    @Column({type: 'timestamp', default: () => 'CURRENT_TIMESTAMP'})
    createdAt: Date;
    @Column({type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP'})
    updatedAt: Date;
    @Column({type: 'boolean', default: true})
    isActive: boolean;
    @Column({ name: 'id_user', type: 'int', nullable: false })
    userId: number;
    @ManyToOne(() => UserEntity, { nullable: false })
    @JoinColumn({name: 'id_user'})
    user: UserEntity;
}