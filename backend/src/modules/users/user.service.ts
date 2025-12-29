import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity, UserRole } from './entities/user.entity';
import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { UserResponseDto } from './dto/response-user.dto';
import { UserCreateDto } from './dto/create-user.dto';
import { UserUpdateDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';
import { AuthLoginDto } from '../auths/dto/login-auth.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async findAll(role: UserResponseDto): Promise<UserResponseDto[]> {
    if ((await this.checkPermission(role)) === false) {
      throw new Error('User not authorized');
    }

    const users = await this.userRepository.find({ where: { isActive: true } });
    if (!users || users.length === 0) {
      return [];
    }
    return Promise.all(users.map((user) => new UserResponseDto(user)));
  }

  async findById(
    id: number,
    role: UserResponseDto,
  ): Promise<UserResponseDto | null> {
    if ((await this.checkPermission(role)) === false) {
      throw new Error('User not authorized');
    }

    const user = await this.userRepository.findOneBy({
      id_user: id,
      isActive: true,
    });
    if (!user) {
      return null;
    }
    return new UserResponseDto(user);
  }

  async findByEmail(email: string): Promise<UserResponseDto | null> {
    const user = await this.userRepository.findOneBy({
      email: email,
      isActive: true,
    });
    if (!user) {
      return null;
    }
    return new UserResponseDto(user);
  }

  async findForAuth(email: string): Promise<AuthLoginDto | null> {
    const user = await this.userRepository.findOneBy({
      email: email,
      isActive: true,
    });
    if (!user) {
      return null;
    }
    return new AuthLoginDto(user);
  }

  async create(dto: UserCreateDto): Promise<UserResponseDto> {
    if (await this.checkEmailExists(dto.email)) {
      throw new Error('Email already exists');
    }

    const password = await bcrypt.hash(dto.password, 10);
    const newUser = this.userRepository.create({ ...dto, password: password });
    await this.userRepository.save(newUser);
    return new UserResponseDto(newUser);
  }

  async update(
    id: number,
    dto: UserUpdateDto,
    role: UserResponseDto,
  ): Promise<UserResponseDto> {
    if ((await this.checkPermission(role, id)) === false) {
      throw new Error('User not authorized');
    }

    const oldEntity = await this.userRepository.findOneBy({
      id_user: id,
      isActive: true,
    });
    if (!oldEntity) {
      throw new Error('User not found or already inactive');
    }
    if (!(await this.remove(id, role))) {
      throw new Error('User not found');
    }

    const updatedUser = await this.userRepository.create({
      ...oldEntity,
      ...dto,
      id_user: undefined,
      isActive: true,
    });
    const savedUser = await this.userRepository.save(updatedUser);

    if (!savedUser) throw new Error('User not updated');

    return new UserResponseDto(savedUser);
  }

  async remove(id: number, role: UserResponseDto): Promise<boolean> {
    if ((await this.checkPermission(role)) === false) {
      throw new Error('User not authorized');
    }

    const result = await this.userRepository.update(
      { id_user: id, isActive: true },
      { isActive: false },
    );
    return result.affected ? result.affected > 0 : false;
  }

  async checkPermission(
    reqUser: UserResponseDto,
    userId?: number,
  ): Promise<boolean> {
    if (reqUser.role === UserRole.ADMIN) {
      return true;
    }
    if (userId && reqUser.id === userId) {
      return true;
    }
    return false;
  }

  async checkEmailExists(email: string): Promise<boolean> {
    const user = await this.findByEmail(email);
    return !!user;
  }
}
