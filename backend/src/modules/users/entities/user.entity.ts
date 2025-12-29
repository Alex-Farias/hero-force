import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

export enum UserRole {
  ADMIN = 'admin',
  HERO = 'hero',
}

@Entity('user')
export class UserEntity {
  @PrimaryGeneratedColumn('increment', { name: 'id_user' })
  id_user: number;

  @Column({ type: 'enum', enum: UserRole, default: UserRole.HERO })
  role: UserRole;

  @Column({ type: 'varchar', length: 255, nullable: false })
  name: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  email: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  password: string;

  @Column({ type: 'varchar', length: 255, nullable: true, unique: true })
  persona: string;

  @Column({ type: 'varchar', length: 255, nullable: true, unique: true })
  persona_id: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;

  @Column({ type: 'boolean', default: true })
  isActive: boolean;
}
