import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { CreateUserDto } from '@src/auth/dto';

import {
  confirRegistrationTemplate,
  emailRecoverPasswordTemplate,
} from './email-templates';

@Injectable()
export class EmailService {
  private readonly logger = new Logger('EmailService');

  constructor(private readonly mailerService: MailerService) {}

  sendEmailRegistration(createUserDto: CreateUserDto, token: string) {
    const { email } = createUserDto;
    const template = confirRegistrationTemplate(token);

    try {
      this.mailerService.sendMail({
        to: email,
        from: 'no-reply',
        subject: 'VERIFICACION DE CUENTA',
        html: template,
      });
    } catch (error) {
      this.logger.error(error.message);
      throw new InternalServerErrorException(error.message);
    }
  }

  sendEmailRecoverPassword(createUserDto: CreateUserDto, token: string) {
    const { email } = createUserDto;
    const template = emailRecoverPasswordTemplate(token);

    try {
      this.mailerService.sendMail({
        to: email,
        from: 'no-reply',
        subject: 'RECUPERAR CONTRESEÑA',
        html: template,
      });
    } catch (error) {
      this.logger.error(error.message);
      throw new InternalServerErrorException(error.message);
    }
  }
}
