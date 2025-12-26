import { IsEmail, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";
import { UserEntity } from "src/modules/users/entities/user.entity";

export class AuthLoginDto {
    @IsNumber()
    @IsOptional()
    id?: number;

    @IsEmail()
    @IsNotEmpty()
    email: string;
    
    @IsString()
    @IsNotEmpty()
    password: string;

    constructor(user?: Partial<UserEntity>) {
        if (user) {
            this.id = user.id_user;
            this.email = user.email!;
            this.password = user.password!;
        }
    }
}