import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  Relation,
} from 'typeorm';
import { Roles } from '../../interfaces/dbTypes.enum';
import { ApiProperty } from '@nestjs/swagger';
import { Store } from '@src/store/entities/store.entity';

@Entity({ name: 'users' })
export class User {
  @ApiProperty({
    example: '1',
    description: 'Product ID auto increment',
    uniqueItems: true,
  })
  @PrimaryGeneratedColumn('increment')
  id: number;

  @ApiProperty({
    example: 'Fulanito',
    description: 'User name',
  })
  @Column({
    type: 'varchar',
  })
  first_name: string;

  @ApiProperty({
    example: 'Perez',
    description: 'User last_name',
  })
  @Column({
    type: 'varchar',
  })
  last_Name: string;

  @ApiProperty({
    example: 'Fulanito@mail.com',
    description: 'User email',
    uniqueItems: true,
  })
  @Column({
    type: 'varchar',
  })
  email: string;

  @ApiProperty({
    example: 'any_password@123',
    description: 'User password',
  })
  @Column({
    type: 'varchar',
    select: false, //No retorna el password en la petición
  })
  password: string;

  @ApiProperty({
    example: '+34111111111',
    description: 'User phone',
    required: false,
  })
  @Column({
    type: 'varchar',
    nullable: true,
  })
  phone?: string;

  @ApiProperty({
    example: 'https://encrypted-tbn0.gstatic.com/images',
    description: 'User picture',
    required: false,
  })
  @Column({
    type: 'varchar',
    nullable: true,
  })
  picture?: string;

  @ApiProperty({
    example: [Roles.USER_ROLE],
    description: `[${Roles.USER_ROLE}, ${Roles.ADMIN_ROLE}]`,
    uniqueItems: true,
    default: Roles.USER_ROLE,
    enum: [Roles.ADMIN_ROLE, Roles.USER_ROLE],
  })
  @Column({
    type: 'enum',
    array: true,
    enum: Roles,
    default: [Roles.USER_ROLE],
  })
  roles: Roles[];

  @ApiProperty({
    example: 'true',
    description: 'User created with Google ',
    uniqueItems: true,
    default: true,
    required: false,
  })
  @Column({
    type: 'boolean',
    default: false,
  })
  google?: boolean;

  @ApiProperty({
    example: 'true',
    description: 'User created with faceBook ',
    uniqueItems: true,
    default: true,
    required: false,
  })
  @Column({
    type: 'boolean',
    default: false,
  })
  faceBook?: boolean;

  @ApiProperty({
    example: 'true',
    description: 'User status, { isActive: removed=false }',
    uniqueItems: true,
    default: false,
    required: false,
  })
  @Column({
    type: 'boolean',
    default: false,
  })
  isActive: boolean;

  @ApiProperty({
    example: '2024-03-26T17:21:11.195Z',
    description: 'User creation date',
    uniqueItems: true,
  })
  @Column({
    type: 'timestamp',
    default: new Date(),
  })
  created_at: Date;

  @ApiProperty({
    example: '2024-11-26T17:20:15.195Z',
    description: 'User update date',
    uniqueItems: true,
  })
  @Column({
    type: 'timestamp',
    default: new Date(),
  })
  updated_at: Date;

  @OneToMany(() => Store, (store) => store.userId)
  store: Relation<Store>;

  //antes de insertar en BBDD convertir a minustculas
  @BeforeInsert()
  checkFieldsBeforeInsert() {
    this.email = this.email.toLowerCase().trim();
    this.first_name = this.first_name.toLowerCase().trim();
    this.last_Name = this.last_Name.toLocaleLowerCase().trim();
  }

  @BeforeUpdate()
  checkFieldsBeforeUpdate() {
    this.checkFieldsBeforeInsert();
  }
}
