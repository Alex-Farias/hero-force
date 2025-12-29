import { IsBoolean, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";
import { ProjectEntity, ProjectStatus } from "../entities/project.entity";
import { UserResponseDto } from "src/modules/users/dto/response-user.dto";

export class ProjectCreateDto {
    @IsString()
    @IsNotEmpty()
    name: string;
    
    @IsString()
    @IsNotEmpty()
    description: string;
    
    @IsOptional()
    @IsEnum(ProjectStatus)
    status: ProjectStatus;
    
    @IsString()
    @IsNotEmpty()
    goals: string;
    
    @IsNumber()
    @IsOptional()
    user?: number;
    
    constructor(project?: Partial<ProjectEntity>) {
        if(project) {
            this.name = project.name!;
            this.description = project.description!;
            this.status = project.status!;
            this.goals = project.goals!;
            this.user = project.user?.id_user;
        }
    }
}