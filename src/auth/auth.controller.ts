import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Request,
  HttpStatus,
  Param,
  Render,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { AuthService } from './auth.service';
import {
  ChangePasswordDto,
  CreateUserDto,
  LoginUserDto,
  RecoverPasswordDto,
} from './dto';
import { Auth } from './decorators/auth.decorator';

import { Roles } from '../interfaces/dbTypes.enum';
import { GoogleOAuthGuard } from './guards/google-oauth.guard';
import { AuthGuard } from '@nestjs/passport';
import { User } from './entities/user.entity';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // REGISTRO DE USUARIOS CON EMAIL
  @Post('register')
  @ApiResponse({
    status: 201,
    description: 'Correctly registered user, please verify your email.',
  })
  @ApiResponse({ status: 400, description: 'Bad  Request' })
  registerUserWithEmail(@Body() createUserDto: CreateUserDto) {
    return this.authService.registerUserWithEmail(createUserDto);
  }

  @Get('confirm-registration/:jwtToken')
  @Render('confirm.hbs')
  @ApiResponse({
    status: 200,
    description: 'Return Template.Html',
  })
  @ApiResponse({ status: 400, description: 'Bad  Request' })
  async confirRegisterWithEmail(@Param('jwtToken') jwtToken: string) {
    const user = await this.authService.confirRegisterWithEmail(jwtToken);
    return { user };
  }

  @Post('login')
  @ApiResponse({
    status: 201,
    description: 'Return { User, token: string}',
    type: User,
  })
  @ApiResponse({ status: 400, description: 'Bad  Request' })
  async loginWithEmail(@Body() loginUserDto: LoginUserDto) {
    return await this.authService.loginWithEmail(loginUserDto);
  }

  // RESTABLECER CONTRESEÑA
  @Post('recover-password')
  @ApiResponse({
    status: 201,
    description: 'Please verify your email.',
  })
  @ApiResponse({ status: 400, description: 'Bad  Request' })
  recoverPassword(@Body() recoverPasswordDto: RecoverPasswordDto) {
    return this.authService.recoverPassword(recoverPasswordDto);
  }

  @Get('reset-password/:jwtToken')
  @Render('changePassword.hbs')
  @ApiResponse({
    status: 200,
    description: 'Return Template.Html with Form',
  })
  @ApiResponse({ status: 400, description: 'Bad  Request' })
  async sendEmailrecoverPassword(@Param('jwtToken') jwtToken: string) {
    const user = await this.authService.sendEmailrecoverPassword(jwtToken);
    return { email: user.email, password: user.password };
  }

  @Post('change-password')
  @Render('confirmChangePassword.hbs')
  @ApiResponse({
    status: 200,
    description: 'Return Template.Html',
  })
  @ApiResponse({ status: 400, description: 'Bad  Request' })
  async changePassword(@Body() changePasswordDto: ChangePasswordDto) {
    const user = await this.authService.changePassword(changePasswordDto);
    return { email: user.email };
  }

  //REGISTRO DE USUARIOS CON GOOGLE
  //probar en el navegador directamente (no usar postman)
  @Get('google-oauth')
  @UseGuards(GoogleOAuthGuard)
  @ApiResponse({ status: 200, description: 'Register with Google' })
  async googleAuth() {}

  @Get('google-redirect')
  @UseGuards(GoogleOAuthGuard)
  @ApiResponse({ status: 200, description: 'Login with GOOGLE' })
  googleAuthRedirect(@Request() request: Express.Request) {
    return this.authService.oAuthLogin(request);
  }

  //REGISTRO DE USUARIOS CON FACEBOOK
  //probar en el navegador directamente (no usar postman)
  @Get('/facebook')
  @UseGuards(AuthGuard('facebook'))
  @ApiResponse({ status: 200, description: 'Register with faceBook' })
  async facebookLogin() {
    return HttpStatus.OK;
  }

  @Get('/facebook/redirect')
  @UseGuards(AuthGuard('facebook'))
  @ApiResponse({ status: 200, description: 'Login with faceBook' })
  async facebookLoginRedirect(@Request() request: Express.Request) {
    return this.authService.oAuthLogin(request);
  }

  @Get()
  @Auth(Roles.ADMIN_ROLE, Roles.USER_ROLE)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get All User, IMPORTANT REQUIRED JWT TOKEN' })
  findAll() {
    return { msg: 'All users' };
  }
}
