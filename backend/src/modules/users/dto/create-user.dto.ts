import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { UserEntity, UserRole } from '../entities/user.entity';
import { ApiProperty } from '@nestjs/swagger';

export class UserCreateDto {
  @ApiProperty({ description: 'Nome do Herói', example: 'Tony Stark' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'Papel do usuário',
    enum: UserRole,
    default: UserRole.HERO,
    required: false,
    example: 'hero',
  })
  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole;

  @ApiProperty({ description: 'Email do Herói', example: 'tony@stark.com' })
  @IsString()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ description: 'Senha de acesso', example: 'jarvis123' })
  @IsString()
  @IsNotEmpty()
  password: string;

  @ApiProperty({
    description: 'Persona/Identidade Secreta',
    example: 'Iron Man',
    required: false,
  })
  @IsString()
  @IsOptional()
  persona?: string;

  constructor(user?: Partial<UserEntity>) {
    if (user) {
      this.name = user.name!;
      this.email = user.email!;
      this.password = user.password!;
      this.persona = user.persona;
    }
  }
}
