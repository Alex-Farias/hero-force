import { IsBoolean, IsNotEmpty, IsNumber, IsString } from "class-validator";

export class ProjectCreateDto {
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
    userId: number;
}