import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { UserEntity, UserRole } from '../modules/users/entities/user.entity';

@Injectable()
export class SeedService implements OnModuleInit {
  private readonly logger = new Logger(SeedService.name);

  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async onModuleInit() {
    await this.seedAdminUser();
  }

  private async seedAdminUser() {
    const adminEmail = 'arqueiro@heroforce.com';
    const adminExists = await this.userRepository.findOneBy({ email: adminEmail });

    if (!adminExists) {
      this.logger.log('Seeding admin user...');
      
      const salt = await bcrypt.genSalt();
      const hashedPassword = await bcrypt.hash('Arrow&Quiver.2001', salt);

      const adminUser = this.userRepository.create({
        name: 'Admin Hero Force',
        email: adminEmail,
        password: hashedPassword,
        role: UserRole.ADMIN,
        isActive: true,
        persona: 'Arqueiro Verde',
      });

      await this.userRepository.save(adminUser);
      this.logger.log('Admin user created successfully.');
    } else {
      this.logger.log('Admin user already exists.');
    }
  }
}
