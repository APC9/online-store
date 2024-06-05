import { Module } from '@nestjs/common';
import { EmailService } from './email.service';
import { MailerModule } from '@nestjs-modules/mailer';

@Module({
  controllers: [],
  providers: [EmailService],
  exports: [EmailService],
  imports: [MailerModule],
})
export class EmailModule {}
