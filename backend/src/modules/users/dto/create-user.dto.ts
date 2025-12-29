import { IsEnum, IsNotEmpty, IsOptional, IsString } from "class-validator";
import { UserEntity, UserRole } from "../entities/user.entity";

export class UserCreateDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsOptional()
    @IsEnum(UserRole)
    role?: UserRole;

    @IsString()
    @IsNotEmpty()
    email: string;
    
    @IsString()
    @IsNotEmpty()
    password: string;
    
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