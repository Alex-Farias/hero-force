import { Test, TestingModule } from '@nestjs/testing';
import { ProjectController } from './project.controller';
import { ProjectService } from './project.service';
import { ProjectCreateDto } from './dto/create-project.dto';
import { ProjectUpdateDto } from './dto/update-project.dto';
import { ProjectStatus } from './entities/project.entity';

describe('ProjectController', () => {
  let controller: ProjectController;
  let service: ProjectService;

  const mockProjectService = {
    findAll: jest.fn(),
    findById: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  const mockUser = { id: 1, role: 'hero' };
  const mockProject = {
    id: 1,
    name: 'Project 1',
    status: ProjectStatus.PENDING,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProjectController],
      providers: [
        {
          provide: ProjectService,
          useValue: mockProjectService,
        },
      ],
    }).compile();

    controller = module.get<ProjectController>(ProjectController);
    service = module.get<ProjectService>(ProjectService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of projects', async () => {
      const result = [mockProject];
      mockProjectService.findAll.mockResolvedValue(result);

      expect(await controller.findAll({ user: mockUser })).toEqual(result);
    });
  });

  describe('findById', () => {
    it('should return a single project', async () => {
      mockProjectService.findById.mockResolvedValue(mockProject);

      expect(await controller.findById(1, { user: mockUser })).toEqual(
        mockProject,
      );
    });
  });

  describe('create', () => {
    it('should create a new project', async () => {
      const createDto: ProjectCreateDto = {
        name: 'New Project',
        description: 'Desc',
        status: ProjectStatus.PENDING,
        goals: 'Goal',
      };
      mockProjectService.create.mockResolvedValue({ id: 2, ...createDto });

      expect(await controller.create(createDto, { user: mockUser })).toEqual({
        id: 2,
        ...createDto,
      });
    });
  });

  describe('update', () => {
    it('should update a project', async () => {
      const updateDto: ProjectUpdateDto = { name: 'Updated Project' };
      const updatedProject = { ...mockProject, ...updateDto };
      mockProjectService.update.mockResolvedValue(updatedProject);

      expect(await controller.update(1, updateDto, { user: mockUser })).toEqual(
        updatedProject,
      );
    });
  });

  describe('remove', () => {
    it('should remove a project', async () => {
      mockProjectService.remove.mockResolvedValue(true);

      expect(await controller.remove(1, { user: mockUser })).toBe(true);
    });
  });
});
