import { InjectRepository } from "@nestjs/typeorm";
import { UserEntity } from "./entities/user.entity";
import { Repository } from "typeorm";
import { Injectable } from "@nestjs/common";
import { UserResponseDto } from "./dto/response-user.dto";
import { UserCreateDto } from "./dto/create-user.dto";
import { UserUpdateDto } from "./dto/update-user.dto";

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

    async findOne(id: number): Promise<UserResponseDto> {
        const user = await this.userRepository.findOneBy({ id_user: id });
        if(!user) {throw new Error('User not found');}
        return new UserResponseDto(user);
    }

    async create(dto: UserCreateDto): Promise<UserResponseDto> {
        const newUser = this.userRepository.create(dto);
        await this.userRepository.save(newUser);
        return new UserResponseDto(newUser);
    }

    async update(id: number, dto: UserUpdateDto): Promise<UserResponseDto> {
        const oldEntity = await this.userRepository.findOneBy({ id_user: id, isActive: true });
        if(!oldEntity) { throw new Error('User not found or already inactive') }
        
        if(await this.remove(id)) {
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
        throw new Error('User not found');
    }

    async remove(id: number): Promise<boolean> {
        if (await this.userRepository.update(
            { id_user: id }, 
            { isActive: false }
        )) {
            return true;
        }
        throw new Error('User not found');
    }
    
}