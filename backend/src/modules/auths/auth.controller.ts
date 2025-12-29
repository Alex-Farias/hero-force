import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthLoginDto } from './dto/login-auth.dto';
import { AuthRegisterDto } from './dto/register-auth.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({
    summary: 'Realizar login',
    description: 'Autentica um usuário e retorna um token JWT.',
  })
  @ApiResponse({ status: 200, description: 'Login realizado com sucesso.' })
  @ApiResponse({ status: 401, description: 'Credenciais inválidas.' })
  @HttpCode(HttpStatus.OK)
  @Post('login')
  async login(@Body() dto: AuthLoginDto) {
    return this.authService.login(dto);
  }

  @ApiOperation({
    summary: 'Registrar novo usuário',
    description: 'Cria uma nova conta de usuário no sistema.',
  })
  @ApiResponse({ status: 201, description: 'Usuário registrado com sucesso.' })
  @ApiResponse({ status: 400, description: 'Dados inválidos.' })
  @Post('register')
  async register(@Body() dto: AuthRegisterDto) {
    return this.authService.register(dto);
  }
}
