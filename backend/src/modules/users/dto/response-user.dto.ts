import { IsBoolean, IsDate, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";
import { UserEntity, UserRole } from "../entities/user.entity";

export class UserResponseDto {
    @IsNumber()
    @IsNotEmpty()
    id: number;

    @IsString()
    @IsNotEmpty()
    role: UserRole;

    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    @IsNotEmpty()
    email: string;
    
    @IsString()
    @IsNotEmpty()
    password: string;
    
    @IsString()
    @IsNotEmpty()
    persona: string;
    
    @IsDate()
    @IsOptional()
    createdAt?: Date;

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
