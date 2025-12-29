import {
  IsBoolean,
  IsDate,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { UserEntity, UserRole } from '../entities/user.entity';
import { ApiProperty } from '@nestjs/swagger';

export class UserResponseDto {
  @ApiProperty({ description: 'ID do usuário' })
  @IsNumber()
  @IsNotEmpty()
  id: number;

  @ApiProperty({ description: 'Papel do usuário', enum: UserRole })
  @IsString()
  @IsNotEmpty()
  role: UserRole;

  @ApiProperty({ description: 'Nome do Herói' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ description: 'Email do Herói' })
  @IsString()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    description: 'Senha (não deve ser retornada em produção)',
    required: false,
  })
  @IsString()
  @IsNotEmpty()
  password: string;

  @ApiProperty({ description: 'Persona/Identidade Secreta' })
  @IsString()
  @IsNotEmpty()
  persona: string;

  @ApiProperty({ description: 'Data de criação' })
  @IsDate()
  @IsOptional()
  createdAt?: Date;

  @ApiProperty({ description: 'Status de atividade' })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  constructor(user?: Partial<UserEntity>) {
    if (user) {
      this.id = user.id_user!;
      this.role = user.role!;
      this.name = user.name!;
      this.email = user.email!;
      this.persona = user.persona!;
      this.createdAt = user.createdAt;
      this.isActive = user.isActive;
    }
  }
}
