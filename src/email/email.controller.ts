import { Controller } from '@nestjs/common';
import { EmailService } from './email.service';

@Controller('mailer')
export class EmailController {
  constructor(private readonly emailService: EmailService) {}
}
