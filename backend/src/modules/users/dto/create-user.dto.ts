import { IsNotEmpty, IsString } from "class-validator";
import { UserEntity } from "../entities/user.entity";

export class UserCreateDto {
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

    constructor(user?: Partial<UserEntity>) {
        if (user) {
            this.name = user.name!;
            this.email = user.email!;
            this.password = user.password!;
            this.persona = user.persona!;
        }
    }
}