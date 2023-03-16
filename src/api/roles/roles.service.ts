import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { ERole } from '../auth/enums/role.enum'
import { Role } from './roles.entity'

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Role)
    private rolesRepository: Repository<Role>
  ) {}

  findAll(): Promise<Role[]> {
    return this.rolesRepository.find()
  }

  findOne(id: number): Promise<Role> {
    return this.rolesRepository.findOne(id)
  }

  findByName(role: ERole): Promise<Role> {
    return this.rolesRepository
      .createQueryBuilder('role')
      .where('role.role = :role', { role: role })
      .getOne()
  }

  initializeRoles(): Role {
    let roles: Role[] = []
    for (const role in ERole) {
      const newRole: Role = new Role()
      newRole.role = ERole[role]
      roles = [...roles, newRole]
    }

    this.rolesRepository.save(roles)
    return roles.find((role) => role.role === 'user')
  }
}
