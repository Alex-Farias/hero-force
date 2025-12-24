import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put } from "@nestjs/common";
import { UserService } from "./user.service";
import { UserCreateDto } from "./dto/create-user.dto";
import { UserResponseDto } from "./dto/response-user.dto";
import { UserUpdateDto } from "./dto/update-user.dto";

@Controller('users')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Get('read/all')
    async findAll(): Promise<UserResponseDto[]> {
        return this.userService.findAll();
    }

    @Get('read/:id')
    async findOne(@Param('id', ParseIntPipe) id: number): Promise<UserResponseDto> {
        return this.userService.findOne(id);
    }

    @Post('create')
    async create(@Body() dto: UserCreateDto): Promise<UserResponseDto> {
        return this.userService.create(dto);
    }

    @Put('update/:id')
    async update(
        @Param('id', ParseIntPipe) id: number,
        @Body() dto: UserUpdateDto
    ): Promise<UserResponseDto> {
        return this.userService.update(id, dto);
    }

    @Delete('delete/:id')
    async remove(@Param('id', ParseIntPipe) id: number): Promise<boolean> {
        return this.userService.remove(id);
    }
}