import { InjectRepository } from "@nestjs/typeorm";
import { UserEntity } from "./entities/user.entity";
import { Repository } from "typeorm";
import { Injectable } from "@nestjs/common";
import { UserResponseDto } from "./dto/response-user.dto";
import { UserCreateDto } from "./dto/create-user.dto";
import { UserUpdateDto } from "./dto/update-user.dto";
import * as bcrypt from 'bcrypt';
import { AuthLoginDto } from "../auths/dto/login-auth.dto";

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(UserEntity)
        private readonly userRepository: Repository<UserEntity>,
    ) {}

    async findAll(): Promise<UserResponseDto[]> {
        const users = await this.userRepository.find({ where: { isActive: true } });
        if(!users || users.length === 0) { return [] }
        return Promise.all(users.map(user => new UserResponseDto(user)));
    }

    async findById(id: number): Promise<UserResponseDto | null> {
        const user = await this.userRepository.findOneBy({ id_user: id, isActive: true });
        if(!user) { return null }
        return new UserResponseDto(user);
    }

    async findByEmail(email: string): Promise<UserResponseDto | null> {
        const user = await this.userRepository.findOneBy({ email: email, isActive: true });
        if(!user) { return null }
        return new UserResponseDto(user);
    }

    async findForAuth(email: string): Promise<AuthLoginDto> {
        const user =  await this.userRepository.findOneBy({ email: email, isActive: true });
        if(!user) { throw new Error('User not found')}
        return new AuthLoginDto(user);
    }

    async create(dto: UserCreateDto): Promise<UserResponseDto> {
        if(await this.checkEmailExists(dto.email)) { throw new Error('Email already exists') }

        const password = await bcrypt.hash(dto.password, 10);
        const newUser = this.userRepository.create({ ...dto, password: password });
        await this.userRepository.save(newUser);
        return new UserResponseDto(newUser);
    }

    async update(id: number, dto: UserUpdateDto): Promise<UserResponseDto> {
        const oldEntity = await this.userRepository.findOneBy({ id_user: id, isActive: true });
        if(!oldEntity) { throw new Error('User not found or already inactive') }
        if(!await this.remove(id)) { throw new Error('User not found') }

        const updatedUser = await this.userRepository.create({
            ...oldEntity,
            ...dto,
            id_user: undefined,
            isActive: true
        });
        const savedUser = await this.userRepository.save(updatedUser);
        
        if(!savedUser) throw new Error('User not updated');
        
        return new UserResponseDto(savedUser);   
    }

    async remove(id: number): Promise<boolean> {
        const result = await this.userRepository.update(
            { id_user: id, isActive: true }, 
            { isActive: false }
        )
        return result.affected ? result.affected > 0 : false;
    }
    
    async checkEmailExists(email: string): Promise<boolean> {
        const user = await this.findByEmail(email);
        return !!user;
    }
}