import { PartialType } from '@nestjs/swagger';
import { ProjectCreateDto } from './create-project.dto';

export class ProjectUpdateDto extends PartialType(ProjectCreateDto) {}
