import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';

import { META_ROLES } from '../decorators/role-protected.decorator';
import { User } from '../entities/user.entity';

@Injectable()
export class UserRoleGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly jwtService: JwtService,
  ) {}

  async canActivate(context: ExecutionContext) {
    //Recibo los Roles que estableci en la metadata con el role-protected
    const validRole: string[] = this.reflector.getAllAndOverride<string[]>(
      META_ROLES,
      [context.getHandler(), context.getClass()],
    );

    // Aqui recibimos el usuario de los header la request
    // que se envian gracias al AuthGuard()
    const req = context.switchToHttp().getRequest();
    const user = req.user as User;

    //  verificamos si tenemos el usuario y comparamos si tienen el rol valido
    if (!user) throw new BadRequestException('User not found');

    for (const role of user.roles) {
      if (validRole.includes(role)) return true;
    }

    throw new BadRequestException('User does not have the required role');
  }
}
