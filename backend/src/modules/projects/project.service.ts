import { InjectRepository } from "@nestjs/typeorm";
import { ProjectEntity } from "./entities/project.entity";
import { Repository } from "typeorm";
import { Injectable } from "@nestjs/common";
import { ProjectResponseDto } from "./dto/response-project.dto";
import { ProjectCreateDto } from "./dto/create-project.dto";
import { ProjectUpdateDto } from "./dto/update-project.dto";
import { UserRole } from "../users/entities/user.entity";
import { UserResponseDto } from "../users/dto/response-user.dto";

@Injectable()
export class ProjectService {
    constructor(
        @InjectRepository(ProjectEntity)
        private readonly projectRepository: Repository<ProjectEntity>,
    ) {}

    async findAll(role: UserResponseDto): Promise<ProjectResponseDto[]> {
        if(await this.checkPermission(role) === false) { throw new Error('User not authorized') }

        const projects = await this.projectRepository.find({ where: { isActive: true }, relations: ['user'] });
        if(!projects || projects.length === 0) { return [] }
        return Promise.all(projects.map(project => new ProjectResponseDto(project)));
    }

    async findById(id: number, role: UserResponseDto): Promise<ProjectResponseDto> {
        if(await this.checkPermission(role) === false) { throw new Error('User not authorized') }

        const project = await this.projectRepository.findOne({ where: { id_project: id }, relations: ['user'] });
        if(!project) {throw new Error('Project not found');}
        return new ProjectResponseDto(project);
    }

    async create(dto: ProjectCreateDto): Promise<ProjectResponseDto> {
        const newProject = this.projectRepository.create(dto);
        await this.projectRepository.save(newProject);
        return new ProjectResponseDto(newProject);
    }

    async update(id: number, dto: ProjectUpdateDto, role: UserResponseDto): Promise<ProjectResponseDto> {
        if(await this.checkPermission(role) === false) { throw new Error('User not authorized') }

        const oldProject = await this.projectRepository.findOneBy({ id_project: id, isActive: true });
        if(!oldProject) { throw new Error('Project not found or already inactive') }

        if(await this.remove(id, role)) {
            const updatedProject = await this.projectRepository.create({
                ...oldProject,
                ...dto,
                id_project: undefined,
                isActive: true
            });
            
            const savedProject = await this.projectRepository.save(updatedProject);
            if(!savedProject) { throw new Error('Project not updated') };
            return new ProjectResponseDto(savedProject);
        }
        throw new Error('Project not found');
    }

    async remove(id: number, role: UserResponseDto): Promise<boolean> {
        if(await this.checkPermission(role) === false) { throw new Error('User not authorized') }

        if (await this.projectRepository.update(
            { id_project: id }, 
            { isActive: false }
        )) {
            return true;
        }
        throw new Error('Project not found');
    }

    async checkPermission(reqUser: UserResponseDto, userId?: number): Promise<boolean> {
        if(reqUser.role === UserRole.ADMIN) { return true }
        if(userId && reqUser.id === userId) { return true }
        return false;
    }
}