import { UseGuards, applyDecorators } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { Roles } from '../../interfaces/dbTypes.enum';
import { RoleProtected } from './role-protected.decorator';
import { UserRoleGuard } from '../guards/user-role.guard';

export function Auth(...roles: Roles[]) {
  return applyDecorators(
    // son los decoradores
    RoleProtected(...roles), // recibe un array de roles y los establece en la metadata
    // AuthGuard() establece la información del usuario en el header
    UseGuards(AuthGuard(), UserRoleGuard), //recibe los roles de la metadata y los compara
  );
}

// Esto es un composition decoration: para agrupar decoradores y usar un solo decorador
// en vez de usar varios en un mismo metodo.

// Tambien puedes usar esto mismo decoradores sin agrupar de forma individual
