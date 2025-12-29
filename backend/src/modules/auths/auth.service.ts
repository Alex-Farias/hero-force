import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt/dist';
import { UserService } from '../users/user.service';
import { AuthLoginDto } from './dto/login-auth.dto';
import { AuthRegisterDto } from './dto/register-auth.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async login(dto: AuthLoginDto) {
    const user = await this.userService.findForAuth(dto.email);
    if (user) {
      if (await bcrypt.compare(dto.password, user.password)) {
        const payload = { sub: user.id, email: user.email, role: user.role };
        return {
          access_token: this.jwtService.sign(payload),
        };
      }
    }
    throw new UnauthorizedException('Invalid credentials');
  }

  async register(dto: AuthRegisterDto) {
    const createdUser = await this.userService.create(dto);
    if (dto) {
      return await this.login({
        id: createdUser.id,
        email: createdUser.email,
        password: dto.password,
      });
    }
    throw new UnauthorizedException('Registration failed');
  }
}
