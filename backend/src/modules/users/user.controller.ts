import { Body, Controller, Delete, Get, NotFoundException, Param, ParseIntPipe, Post, Put, Request, UseGuards } from "@nestjs/common";
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
    async findAll(@Request() req): Promise<UserResponseDto[]> {
        return this.userService.findAll(req.user);
    }

    @Get('read/:id')
    @UseGuards(AuthGuard('jwt'))
    async findById(@Param('id', ParseIntPipe) id: number, @Request() req): Promise<UserResponseDto | null> {
        const user = await this.userService.findById(id, req.user);
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
        @Body() dto: UserUpdateDto,
        @Request() req
    ): Promise<UserResponseDto> {
        return this.userService.update(id, dto, req.user);
    }

    @Delete('delete/:id')
    @UseGuards(AuthGuard('jwt'))
    async remove(@Param('id', ParseIntPipe) id: number, @Request() req): Promise<boolean> {
        return this.userService.remove(id, req.user);
    }
}