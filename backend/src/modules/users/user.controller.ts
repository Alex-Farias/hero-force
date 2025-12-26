import { Body, Controller, Delete, Get, NotFoundException, Param, ParseIntPipe, Post, Put, UseGuards } from "@nestjs/common";
import { UserService } from "./user.service";
import { UserCreateDto } from "./dto/create-user.dto";
import { UserResponseDto } from "./dto/response-user.dto";
import { UserUpdateDto } from "./dto/update-user.dto";
import { AuthGuard } from "@nestjs/passport";

@Controller('users')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Get('read/all')
    @UseGuards(AuthGuard('jwt'))
    async findAll(): Promise<UserResponseDto[]> {
        return this.userService.findAll();
    }

    @Get('read/:id')
    @UseGuards(AuthGuard('jwt'))
    async findById(@Param('id', ParseIntPipe) id: number): Promise<UserResponseDto | null> {
        const user = await this.userService.findById(id);
        if(!user) { throw new NotFoundException('User not found') }
        return user;
    }

    @Post('create')
    async create(@Body() dto: UserCreateDto): Promise<UserResponseDto> {
        return this.userService.create(dto);
    }

    @Put('update/:id')
    @UseGuards(AuthGuard('jwt'))
    async update(
        @Param('id', ParseIntPipe) id: number,
        @Body() dto: UserUpdateDto
    ): Promise<UserResponseDto> {
        return this.userService.update(id, dto);
    }

    @Delete('delete/:id')
    @UseGuards(AuthGuard('jwt'))
    async remove(@Param('id', ParseIntPipe) id: number): Promise<boolean> {
        return this.userService.remove(id);
    }
}