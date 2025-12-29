import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { NotFoundException } from '@nestjs/common';
import { UserCreateDto } from './dto/create-user.dto';
import { UserUpdateDto } from './dto/update-user.dto';
import { UserRole } from './entities/user.entity';

describe('UserController', () => {
  let controller: UserController;
  let service: UserService;

  const mockUserService = {
    findAll: jest.fn(),
    findById: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  const mockUser = {
    id: 1,
    name: 'Test User',
    email: 'test@test.com',
    role: UserRole.HERO,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: mockUserService,
        },
      ],
    }).compile();

    controller = module.get<UserController>(UserController);
    service = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of users', async () => {
      const result = [mockUser];
      mockUserService.findAll.mockResolvedValue(result);

      expect(await controller.findAll({ user: mockUser })).toEqual(result);
    });
  });

  describe('findById', () => {
    it('should return a single user', async () => {
      mockUserService.findById.mockResolvedValue(mockUser);

      expect(await controller.findById(1, { user: mockUser })).toEqual(
        mockUser,
      );
    });

    it('should throw NotFoundException if user not found', async () => {
      mockUserService.findById.mockResolvedValue(null);

      await expect(
        controller.findById(999, { user: mockUser }),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('create', () => {
    it('should create a new user', async () => {
      const createDto: UserCreateDto = {
        name: 'New',
        email: 'new@test.com',
        password: 'pass',
        role: UserRole.HERO,
      };
      mockUserService.create.mockResolvedValue({ id: 2, ...createDto });

      expect(await controller.create(createDto)).toEqual({
        id: 2,
        ...createDto,
      });
    });
  });

  describe('update', () => {
    it('should update a user', async () => {
      const updateDto: UserUpdateDto = { name: 'Updated' };
      const updatedUser = { ...mockUser, ...updateDto };
      mockUserService.update.mockResolvedValue(updatedUser);

      expect(await controller.update(1, updateDto, { user: mockUser })).toEqual(
        updatedUser,
      );
    });
  });

  describe('remove', () => {
    it('should remove a user', async () => {
      mockUserService.remove.mockResolvedValue(true);

      expect(await controller.remove(1, { user: mockUser })).toBe(true);
    });
  });
});
