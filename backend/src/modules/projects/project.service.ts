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

    async findAll(currentUser: UserResponseDto): Promise<ProjectResponseDto[]> {
        const where: any = { isActive: true };
        if(await this.checkPermission(currentUser) === false) { where.user = { id_user: currentUser.id } }

        const projects = await this.projectRepository.find({ where, relations: ['user'] });
        if(!projects || projects.length === 0) { return [] }
        return Promise.all(projects.map(project => new ProjectResponseDto(project)));
    }

    async findById(id: number, currentUser: UserResponseDto): Promise<ProjectResponseDto> {
        if(await this.checkPermission(currentUser) === false) { throw new Error('User not authorized') }

        const project = await this.projectRepository.findOne({ where: { id_project: id }, relations: ['user'] });
        if(!project) {throw new Error('Project not found');}
        return new ProjectResponseDto(project);
    }

    async create(dto: ProjectCreateDto, currentUser: UserResponseDto): Promise<ProjectResponseDto> {
        const finalId = await this.checkPermission(currentUser) && dto.user ? dto.user : currentUser.id;
        const newProject = this.projectRepository.create({
            name: dto.name,
            description: dto.description,
            goals: dto.goals,
            status: dto.status,
            user: { id_user: finalId } as any,
        });
        await this.projectRepository.save(newProject);
        return new ProjectResponseDto(newProject);
    }

    async update(id: number, dto: ProjectUpdateDto, currentUser: UserResponseDto): Promise<ProjectResponseDto> {
        const check = await this.checkPermission(currentUser, dto.user) === false;
        if(check) { throw new Error('User not authorized') }

        const oldProject = await this.projectRepository.findOneBy({ id_project: id, isActive: true });
        if(!oldProject) { throw new Error('Project not found or already inactive') }

        if(await this.remove(id, currentUser, dto.user)) {
            const finalId = await !check && dto.user ? dto.user : currentUser.id;
            const updatedProject = await this.projectRepository.create({
                ...oldProject,
                ...dto,
                id_project: undefined,
                user: { id_user: finalId } as any,
            });
            
            const savedProject = await this.projectRepository.save(updatedProject);
            if(!savedProject) { throw new Error('Project not updated') };
            return new ProjectResponseDto(savedProject);
        }
        throw new Error('Project not found');
    }

    async remove(id: number, currentUser: UserResponseDto, userId?: number): Promise<boolean> {
        if(await this.checkPermission(currentUser, userId) === false) { throw new Error('User not authorized') }

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