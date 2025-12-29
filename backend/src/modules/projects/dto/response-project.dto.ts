import {
  IsBoolean,
  IsDate,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { ProjectEntity } from '../entities/project.entity';
import { UserResponseDto } from '../../users/dto/response-user.dto';
import { UserEntity } from '../../users/entities/user.entity';
import { ApiProperty } from '@nestjs/swagger';

export class ProjectResponseDto {
  @ApiProperty({ description: 'ID do projeto' })
  @IsNumber()
  @IsNotEmpty()
  id: number;

  @ApiProperty({ description: 'Nome da Missão/Projeto' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ description: 'Descrição da missão' })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ description: 'Status da missão' })
  @IsString()
  @IsNotEmpty()
  status: string;

  @ApiProperty({ description: 'Objetivos da missão' })
  @IsString()
  @IsNotEmpty()
  goals: string;

  @ApiProperty({
    description: 'Herói responsável',
    type: () => UserResponseDto,
  })
  @IsNumber()
  @IsNotEmpty()
  user: UserResponseDto;

  @ApiProperty({ description: 'Data de criação' })
  @IsDate()
  @IsOptional()
  createdAt?: Date;

  @ApiProperty({ description: 'Status de atividade' })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  constructor(project?: Partial<ProjectEntity>) {
    if (project) {
      this.id = project.id_project!;
      this.name = project.name!;
      this.description = project.description!;
      this.status = project.status!;
      this.goals = project.goals!;
      this.user = new UserResponseDto(project.user);
      this.createdAt = project.createdAt;
      this.isActive = project.isActive;
    }
  }
}
