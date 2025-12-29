import { IsBoolean, IsDate, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";
import { ProjectEntity } from "../entities/project.entity";
import { UserResponseDto } from "src/modules/users/dto/response-user.dto";
import { UserEntity } from "src/modules/users/entities/user.entity";

export class ProjectResponseDto {
    @IsNumber()
    @IsNotEmpty()
    id: number;

    @IsString()
    @IsNotEmpty()
    name: string;
    
    @IsString()
    @IsNotEmpty()
    description: string;
    
    @IsString()
    @IsNotEmpty()
    status: string;
    
    @IsString()
    @IsNotEmpty()
    goals: string;
    
    @IsNumber()
    @IsNotEmpty()
    user: UserResponseDto;

    @IsDate()
    @IsOptional()
    createdAt?: Date;

    @IsBoolean()
    @IsOptional()
    isActive?: boolean;

    constructor(project?: Partial<ProjectEntity>) {
        if(project) {
            this.id = project.id_project!;
            this.name = project.name!;
            this.description = project.description!;
            this.status = project.status!;
            this.goals = project.goals!;
            this.user = new UserResponseDto(project.user!);
            this.createdAt = project.createdAt;
            this.isActive = project.isActive;
        }
    }
}