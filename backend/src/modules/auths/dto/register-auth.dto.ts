import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { UserCreateDto } from 'src/modules/users/dto/create-user.dto';

export class AuthRegisterDto extends UserCreateDto {}