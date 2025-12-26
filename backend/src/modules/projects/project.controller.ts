import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, UseGuards } from "@nestjs/common";
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
    async findAll(): Promise<ProjectResponseDto[]> {
        return this.userService.findAll();
    }

    @Get('read/:id')
    async findById(@Param('id', ParseIntPipe) id: number): Promise<ProjectResponseDto> {
        return this.userService.findById(id);
    }

    @Post('create')
    async create(@Body() dto: ProjectCreateDto): Promise<ProjectResponseDto> {
        return this.userService.create(dto);
    }

    @Put('update/:id')
    async update(
        @Param('id', ParseIntPipe) id: number,
        @Body() dto: ProjectUpdateDto
    ): Promise<ProjectResponseDto> {
        return this.userService.update(id, dto);
    }

    @Delete('delete/:id')
    async remove(@Param('id', ParseIntPipe) id: number): Promise<boolean> {
        return this.userService.remove(id);
    }
}