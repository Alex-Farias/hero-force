import { Body, Controller, HttpCode, HttpStatus, Post } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthLoginDto } from "./dto/login-auth.dto";
import { AuthRegisterDto } from "./dto/register-auth.dto";

@Controller("auth")
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @HttpCode(HttpStatus.OK)
    @Post("login")
    async login(@Body() dto: AuthLoginDto) {
        return this.authService.login(dto);
    }

    @Post("register")
    async register(@Body() dto: AuthRegisterDto) {
        return this.authService.register(dto);
    }
}