import { SetMetadata } from '@nestjs/common';
import { Roles } from '../../interfaces/dbTypes.enum';

export const META_ROLES = 'roles';

export const RoleProtected = (...args: Roles[]) => {
  // recibe un array de roles y los establece en la metadata con el nombre de  META_ROLES
  return SetMetadata(META_ROLES, args);
};
