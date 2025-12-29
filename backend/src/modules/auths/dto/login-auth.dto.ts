import {
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsEnum,
} from 'class-validator';
import { UserEntity, UserRole } from '../../users/entities/user.entity';
import { ApiProperty } from '@nestjs/swagger';

export class AuthLoginDto {
  @ApiProperty({ description: 'ID do usuário (opcional)', required: false })
  @IsNumber()
  @IsOptional()
  id?: number;

  @ApiProperty({
    description: 'Email do usuário',
    example: 'arqueiro@heroforce.com',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    description: 'Senha do usuário',
    example: 'Arrow&Quiver.2001',
  })
  @IsString()
  @IsNotEmpty()
  password: string;

  @ApiProperty({
    description: 'Papel do usuário',
    enum: UserRole,
    required: false,
  })
  @IsEnum(UserRole)
  @IsOptional()
  role?: UserRole;

  constructor(user?: Partial<UserEntity>) {
    if (user) {
      this.id = user.id_user;
      this.email = user.email!;
      this.password = user.password!;
      this.role = user.role;
    }
  }
}
