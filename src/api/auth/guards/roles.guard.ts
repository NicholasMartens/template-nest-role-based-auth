import { Injectable, ExecutionContext } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { AuthGuard } from '@nestjs/passport'
import { UsersService } from 'src/api/users/users.service'
import { ROLES_KEY } from '../decorators/roles.decorator'
import { ERole } from '../enums/role.enum'

@Injectable()
export class RolesGuard extends AuthGuard('jwt') {
  constructor(
    private usersService: UsersService,
    private reflector: Reflector
  ) {
    super()
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<ERole[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ])

    if (!requiredRoles) {
      return true
    }

    // call AuthGuard in order to ensure user is injected in request
    const baseGuardResult = await super.canActivate(context)
    if (!baseGuardResult) {
      // unsuccessful authentication return false
      return false
    }

    // successfull authentication, user is injected
    const { user } = context.switchToHttp().getRequest()

    const userFull = await this.usersService.findOne(user.id)

    return requiredRoles.some((requiredRole) =>
      userFull.roles?.some((role) => role.role === requiredRole)
    )
  }
}
