import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Request,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UserCreateDto } from './dto/create-user.dto';
import { UserResponseDto } from './dto/response-user.dto';
import { UserUpdateDto } from './dto/update-user.dto';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('users')
@ApiBearerAuth('access-token')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOperation({
    summary: 'Listar todos os usuários',
    description: 'Retorna uma lista de todos os usuários cadastrados.',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de usuários retornada com sucesso.',
    type: [UserResponseDto],
  })
  @Get('read/all')
  @UseGuards(AuthGuard('jwt'))
  async findAll(@Request() req): Promise<UserResponseDto[]> {
    return this.userService.findAll(req.user);
  }

  @ApiOperation({
    summary: 'Buscar usuário por ID',
    description: 'Retorna os detalhes de um usuário específico.',
  })
  @ApiResponse({
    status: 200,
    description: 'Usuário encontrado.',
    type: UserResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Usuário não encontrado.' })
  @Get('read/:id')
  @UseGuards(AuthGuard('jwt'))
  async findById(
    @Param('id', ParseIntPipe) id: number,
    @Request() req,
  ): Promise<UserResponseDto | null> {
    const user = await this.userService.findById(id, req.user);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  @ApiOperation({
    summary: 'Criar novo usuário',
    description: 'Cria um novo usuário (Herói) no sistema.',
  })
  @ApiResponse({
    status: 201,
    description: 'Usuário criado com sucesso.',
    type: UserResponseDto,
  })
  @Post('create')
  async create(@Body() dto: UserCreateDto): Promise<UserResponseDto> {
    return this.userService.create(dto);
  }

  @ApiOperation({
    summary: 'Atualizar usuário',
    description: 'Atualiza os dados de um usuário existente.',
  })
  @ApiResponse({
    status: 200,
    description: 'Usuário atualizado com sucesso.',
    type: UserResponseDto,
  })
  @Put('update/:id')
  @UseGuards(AuthGuard('jwt'))
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UserUpdateDto,
    @Request() req,
  ): Promise<UserResponseDto> {
    return this.userService.update(id, dto, req.user);
  }

  @ApiOperation({
    summary: 'Remover usuário',
    description: 'Remove um usuário do sistema.',
  })
  @ApiResponse({ status: 200, description: 'Usuário removido com sucesso.' })
  @Delete('delete/:id')
  @UseGuards(AuthGuard('jwt'))
  async remove(
    @Param('id', ParseIntPipe) id: number,
    @Request() req,
  ): Promise<boolean> {
    return this.userService.remove(id, req.user);
  }
}
