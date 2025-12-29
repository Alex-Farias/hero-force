import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ProjectResponseDto } from './dto/response-project.dto';
import { ProjectUpdateDto } from './dto/update-project.dto';
import { ProjectCreateDto } from './dto/create-project.dto';
import { ProjectService } from './project.service';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('projects')
@ApiBearerAuth('access-token')
@Controller('projects')
@UseGuards(AuthGuard('jwt'))
export class ProjectController {
  constructor(private readonly userService: ProjectService) {}

  @ApiOperation({
    summary: 'Listar todos os projetos',
    description: 'Retorna uma lista de todos os projetos/missões.',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de projetos retornada com sucesso.',
    type: [ProjectResponseDto],
  })
  @Get('read/all')
  async findAll(@Request() req): Promise<ProjectResponseDto[]> {
    return this.userService.findAll(req.user);
  }

  @ApiOperation({
    summary: 'Buscar projeto por ID',
    description: 'Retorna os detalhes de um projeto específico.',
  })
  @ApiResponse({
    status: 200,
    description: 'Projeto encontrado.',
    type: ProjectResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Projeto não encontrado.' })
  @Get('read/:id')
  async findById(
    @Param('id', ParseIntPipe) id: number,
    @Request() req,
  ): Promise<ProjectResponseDto> {
    return this.userService.findById(id, req.user);
  }

  @ApiOperation({
    summary: 'Criar novo projeto',
    description: 'Cria um novo projeto/missão no sistema.',
  })
  @ApiResponse({
    status: 201,
    description: 'Projeto criado com sucesso.',
    type: ProjectResponseDto,
  })
  @Post('create')
  async create(
    @Body() dto: ProjectCreateDto,
    @Request() req,
  ): Promise<ProjectResponseDto> {
    console.log('Received DTO in ProjectController.create:', dto);
    return this.userService.create(dto, req.user);
  }

  @ApiOperation({
    summary: 'Atualizar projeto',
    description: 'Atualiza os dados de um projeto existente.',
  })
  @ApiResponse({
    status: 200,
    description: 'Projeto atualizado com sucesso.',
    type: ProjectResponseDto,
  })
  @Put('update/:id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: ProjectUpdateDto,
    @Request() req,
  ): Promise<ProjectResponseDto> {
    return this.userService.update(id, dto, req.user);
  }

  @ApiOperation({
    summary: 'Remover projeto',
    description: 'Remove um projeto do sistema.',
  })
  @ApiResponse({ status: 200, description: 'Projeto removido com sucesso.' })
  @Delete('delete/:id')
  async remove(
    @Param('id', ParseIntPipe) id: number,
    @Request() req,
  ): Promise<boolean> {
    return this.userService.remove(id, req.user);
  }
}
