import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';

import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';

import {
  ChangePasswordDto,
  CreateUserDto,
  LoginUserDto,
  OAuthProviderDto,
  OAuthType,
  RecoverPasswordDto,
} from './dto';

import { User } from './entities/user.entity';
import { JwtPayload } from '../interfaces/jwt.payload.interface';
import { EmailService } from '../email/email.service';
import { GetUserByEmailDto } from './dto/getUserByEmail.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class AuthService {
  private readonly logger = new Logger('AuthService');

  @InjectRepository(User)
  private readonly userRepository: Repository<User>;

  constructor(
    private readonly jwtService: JwtService,
    private readonly emailService: EmailService,
  ) {}

  // REGISTRO DE USUARIOS CON EMAIL
  async registerUserWithEmail(createUserDto: CreateUserDto) {
    const { email, password, ...userData } = createUserDto;

    try {
      const exitUserInDB = await this.userRepository.findOneBy({ email });

      if (exitUserInDB) {
        return new BadRequestException(
          'There is already a user with that email',
        );
      }

      const user = this.userRepository.create({
        ...userData,
        email,
        password: bcrypt.hashSync(password, 10),
      });

      //Envio de correo de verificacion
      this.sendVerificationEmail(email, user);

      await this.userRepository.save(user);

      return 'Correctly registered user, please verify your email.';
    } catch (error) {
      this.logger.error(error);
      return new InternalServerErrorException(error);
    }
  }

  async confirRegisterWithEmail(token: string) {
    const payload = this.jwtService.decode(token);
    const { email } = payload;
    try {
      const user = await this.userRepository.findOneBy({ email });

      user.isActive = true;

      await this.userRepository.save(user);

      return user;
    } catch (error) {
      throw new BadRequestException('Your email account could not be verified');
    }
  }

  async loginWithEmail(loginUserDto: LoginUserDto) {
    const { email, password } = loginUserDto;

    const user = await this.userRepository.findOne({
      where: { email, isActive: true },
      select: {
        email: true,
        password: true,
        id: true,
        first_name: true,
        last_Name: true,
      }, // Retorna solo estos valore
    });

    if (!user) {
      throw new UnauthorizedException('Invalid user credentials');
    }

    if (!bcrypt.compareSync(password, user.password)) {
      throw new UnauthorizedException('Invalid user credentials');
    }

    delete user.password;
    return {
      ...user,
      token: this.getJwtToken({ id: user.id }),
    };
  }

  //RECUPERAR CONTRASEÑAS
  async recoverPassword(recoverPassword: RecoverPasswordDto) {
    const email = recoverPassword.email;
    const user = await this.findOneByEmail(email);

    const token = this.jwtService.sign({ email });
    this.emailService.sendEmailRecoverPassword({ ...user }, token);
    return 'Please verify your email';
  }

  async sendEmailrecoverPassword(token: string) {
    const payload = this.jwtService.decode(token);
    const email = payload.email;

    const user = await this.findOneByEmail(email);

    return user;
  }

  async changePassword(changePasswordDto: ChangePasswordDto) {
    const { email, password } = changePasswordDto;

    const user = await this.findOneByEmail(email);

    user.password = bcrypt.hashSync(password, 10);

    this.userRepository.save(user);

    return user;
  }

  // REGISTRO DE USUARIO CON GOOGLE-FACEBOOK ETC ...
  async registerUserWithGoogle(oAuthProviderDto: OAuthProviderDto) {
    const { email, oauthType, ...userData } = oAuthProviderDto;

    try {
      const exitUserInDB = await this.userRepository.findOneBy({ email });

      if (!exitUserInDB) {
        const user = this.userRepository.create({
          ...userData,
          email,
          isActive: true,
          password: bcrypt.hashSync(userData.first_name, 10),
          google: oauthType === OAuthType.GOOGLE,
          faceBook: oauthType === OAuthType.FACEBOOK,
        });

        //Guardar usuario en BBDD
        await this.userRepository.save(user);

        return {
          ...user,
          token: this.getJwtToken({ id: user.id }),
        };
      }

      return {
        ...exitUserInDB,
        token: this.getJwtToken({ id: exitUserInDB.id }),
      };
    } catch (error) {
      this.logger.error(error);
      return new InternalServerErrorException(error.message);
    }
  }

  oAuthLogin(req: Express.Request) {
    if (!req.user) {
      throw new BadRequestException('User not valid');
    }

    const user = req.user;
    delete user['password'];

    return {
      ...user,
    };
  }

  private sendVerificationEmail(email: string, user: User) {
    const token = this.jwtService.sign({ email });
    this.emailService.sendEmailRegistration({ ...user }, token);
  }

  private getJwtToken(payload: JwtPayload) {
    const { id } = payload;
    return this.jwtService.sign({ id });
  }

  async findOneByEmail(email: string) {
    const user = await this.userRepository.findOneBy({ email, isActive: true });

    if (!user)
      throw new NotFoundException(`User with email ${email} not found`);

    return { ...user };
  }

  async findOneById(id: number) {
    const user = await this.userRepository.findOneBy({ id, isActive: true });

    if (!user) throw new NotFoundException(`User with Id ${id} not found`);

    return { ...user };
  }

  async findByEmail({ email }: GetUserByEmailDto) {
    const user = await this.userRepository.findOne({
      where: {
        email,
        isActive: true,
      },
    });

    if (!user)
      throw new NotFoundException(`User with Email ${email} not found`);

    return { ...user };
  }

  async findAllUsers() {
    return await this.userRepository.find();
  }

  async updateUser(
    updateUserDto: UpdateUserDto,
    email: GetUserByEmailDto,
    user: User,
  ) {
    const { first_name, last_Name, phone_number } = updateUserDto;
    if (email.email !== user.email) {
      throw new UnauthorizedException(
        'You are not allowed to update this user',
      );
    }

    try {
      const user = await this.findByEmail(email);

      const firstName = first_name ? first_name.toLowerCase() : user.first_name;
      const lastName = last_Name ? last_Name.toLowerCase() : user.last_Name;
      const phoneNumber = phone_number ? phone_number : user.phone;

      const userUpdated = {
        ...user,
        first_name: firstName,
        last_Name: lastName,
        phone: phoneNumber,
        updated_at: new Date(),
      };

      return await this.userRepository.save(userUpdated);
    } catch (error) {
      this.logger.error(error.message);
      return new InternalServerErrorException('Contact administrator');
    }
  }

  async deleteUser(email: GetUserByEmailDto, user: User) {
    if (email.email !== user.email) {
      throw new UnauthorizedException(
        'You are not allowed to delete this user',
      );
    }

    try {
      const user = await this.findByEmail(email);
      user.isActive = false;
      await this.userRepository.save(user);
      return `User with email: ${user.email} deleted successfully`;
    } catch (error) {
      this.logger.error(error.message);
      return new InternalServerErrorException('Contact administrator');
    }
  }
}
