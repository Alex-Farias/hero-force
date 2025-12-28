import { IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";
import { ProjectStatus } from "../entities/project.entity";
import { UserResponseDto } from "src/modules/users/dto/response-user.dto";

export class ProjectCreateDto {
    @IsString()
    @IsNotEmpty()
    name: string;
    
    @IsString()
    @IsNotEmpty()
    description: string;
    
    @IsOptional()
    status: ProjectStatus;
    
    @IsString()
    @IsNotEmpty()
    goals: string;
    
    @IsNumber()
    @IsNotEmpty()
    userId: UserResponseDto;
}