import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Request, UseGuards } from "@nestjs/common";
import { ProjectResponseDto } from "./dto/response-project.dto";
import { ProjectUpdateDto } from "./dto/update-project.dto";
import { ProjectCreateDto } from "./dto/create-project.dto";
import { ProjectService } from "./project.service";
import { AuthGuard } from "@nestjs/passport";

@Controller('projects')
@UseGuards(AuthGuard('jwt'))
export class ProjectController {
    constructor(private readonly userService: ProjectService) {}

    @Get('read/all')
    async findAll(@Request() req): Promise<ProjectResponseDto[]> {
        return this.userService.findAll(req.user);
    }

    @Get('read/:id')
    async findById(@Param('id', ParseIntPipe) id: number, @Request() req): Promise<ProjectResponseDto> {
        return this.userService.findById(id, req.user);
    }

    @Post('create')
    async create(@Body() dto: ProjectCreateDto): Promise<ProjectResponseDto> {
        return this.userService.create(dto);
    }

    @Put('update/:id')
    async update(
        @Param('id', ParseIntPipe) id: number,
        @Body() dto: ProjectUpdateDto,
        @Request() req
    ): Promise<ProjectResponseDto> {
        return this.userService.update(id, dto, req.user);
    }

    @Delete('delete/:id')
    async remove(@Param('id', ParseIntPipe) id: number, @Request() req): Promise<boolean> {
        return this.userService.remove(id, req.user);
    }
}