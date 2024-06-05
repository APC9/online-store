import { SetMetadata } from '@nestjs/common';
import {
  META_ROLES,
  RoleProtected,
} from '@src/auth/decorators/role-protected.decorator';
import { Roles } from '../../../src/interfaces/dbTypes.enum';

// Mock de la función SetMetadata
jest.mock('@nestjs/common', () => ({
  SetMetadata: jest.fn(),
}));

describe('RoleProtected Decorator', () => {
  it('should set metadata with roles', () => {
    const roles = [Roles.ADMIN_ROLE, Roles.USER_ROLE];
    RoleProtected(...roles);
    expect(SetMetadata).toHaveBeenCalledWith(META_ROLES, roles);
  });
});
