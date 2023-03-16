import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ERole } from '../auth/enums/role.enum';
import { CreateUserDto } from './dto/createUser.dto';
import { User } from './users.entity';
import { RolesService } from '../roles/roles.service';
import { Role } from '../roles/roles.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private rolesService: RolesService,
  ) {}

  findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }

  findOne(id: number): Promise<User> {
    return this.usersRepository
      .createQueryBuilder('user')
      .where('user.id = :id', { id: id })
      .leftJoinAndSelect('user.roles', 'role')
      .getOne();
  }

  findOneEmail(email: string): Promise<User> {
    return this.usersRepository
      .createQueryBuilder('user')
      .where('user.email = :email', { email: email })
      .leftJoinAndSelect('user.roles', 'role')
      .getOne();
  }

  async remove(id: number): Promise<void> {
    await this.usersRepository.delete(id);
  }

  async create(user: CreateUserDto): Promise<User> {
    let role: Role = await this.rolesService.findByName(ERole.User);

    if (!role) {
      console.log('init roles');

      role = this.rolesService.initializeRoles();
    }

    const newUser: User = await this.usersRepository.save(user);
    newUser.roles = [role];

    return this.usersRepository.save(newUser);
  }
}
