import {
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { ProjectEntity, ProjectStatus } from '../entities/project.entity';
import { UserResponseDto } from '../../users/dto/response-user.dto';
import { ApiProperty } from '@nestjs/swagger';

export class ProjectCreateDto {
  @ApiProperty({
    description: 'Nome da Missão/Projeto',
    example: 'Ultron Initiative',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'Descrição detalhada da missão',
    example: 'Build a suit of armor around the world',
  })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({
    description: 'Status da missão',
    enum: ProjectStatus,
    default: ProjectStatus.PENDING,
    example: 'in_progress',
  })
  @IsOptional()
  @IsEnum(ProjectStatus)
  status: ProjectStatus;

  @ApiProperty({ description: 'Objetivos da missão', example: 'World Peace' })
  @IsString()
  @IsNotEmpty()
  goals: string;

  @ApiProperty({
    description: 'ID do Herói responsável (opcional)',
    required: false,
    example: 1,
  })
  @IsNumber()
  @IsOptional()
  user?: number;

  constructor(project?: Partial<ProjectEntity>) {
    if (project) {
      this.name = project.name!;
      this.description = project.description!;
      this.status = project.status!;
      this.goals = project.goals!;
      this.user = project.user?.id_user;
    }
  }
}
