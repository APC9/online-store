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
  Query,
  ParseIntPipe,
  Patch,
  Delete,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiExcludeEndpoint,
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
import { GetUserByEmailDto } from './dto/getUserByEmail.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { GetUser } from './decorators/get-user.decorator';

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
  @ApiOperation({ summary: 'Create or register a new user' })
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
  @ApiExcludeEndpoint() //este método no aparecerá en Swagger
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
  @ApiOperation({ summary: 'User Login' })
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
  @ApiOperation({ summary: 'Recover Password' })
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
  @ApiExcludeEndpoint() //este método no aparecerá en Swagger
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
  @ApiOperation({ summary: 'Change Password' })
  async changePassword(@Body() changePasswordDto: ChangePasswordDto) {
    const user = await this.authService.changePassword(changePasswordDto);
    return { email: user.email };
  }

  //REGISTRO DE USUARIOS CON GOOGLE
  //probar en el navegador directamente (no usar postman)
  @Get('google-oauth')
  @UseGuards(GoogleOAuthGuard)
  @ApiResponse({ status: 200, description: 'Register with Google' })
  @ApiOperation({ summary: 'Google Authentication' })
  async googleAuth() {}

  @Get('google-redirect')
  @UseGuards(GoogleOAuthGuard)
  @ApiResponse({ status: 200, description: 'Login with GOOGLE' })
  @ApiExcludeEndpoint() //este método no aparecerá en Swagger
  googleAuthRedirect(@Request() request: Express.Request) {
    return this.authService.oAuthLogin(request);
  }

  //REGISTRO DE USUARIOS CON FACEBOOK
  //probar en el navegador directamente (no usar postman)
  @Get('/facebook')
  @UseGuards(AuthGuard('facebook'))
  @ApiResponse({ status: 200, description: 'Register with faceBook' })
  @ApiOperation({ summary: 'faceBook Authentication' })
  async facebookLogin() {
    return HttpStatus.OK;
  }

  @Get('/facebook/redirect')
  @UseGuards(AuthGuard('facebook'))
  @ApiResponse({ status: 200, description: 'Login with faceBook' })
  @ApiExcludeEndpoint() //este método no aparecerá en Swagger
  async facebookLoginRedirect(@Request() request: Express.Request) {
    return this.authService.oAuthLogin(request);
  }

  @Get()
  @Auth(Roles.ADMIN_ROLE)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get All Users, Access only to administrators' })
  findAll() {
    return this.authService.findAllUsers();
  }

  @Get('/user_by_email')
  @Auth(Roles.ADMIN_ROLE)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get User By Email, Access only to administrators' })
  findUserByEmail(@Query() email: GetUserByEmailDto) {
    return this.authService.findByEmail(email);
  }

  @Get('/:id')
  @Auth(Roles.ADMIN_ROLE)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get User By Id, Access only to administrators' })
  findUserById(@Param('id', ParseIntPipe) id: number) {
    return this.authService.findOneById(id);
  }

  @Patch('/update_user')
  @Auth(Roles.ADMIN_ROLE)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Update User By Email, Access only to administrators',
  })
  updateUser(
    @Body() updateUserDto: UpdateUserDto,
    @Query() email: GetUserByEmailDto,
    @GetUser() user: User,
  ) {
    return this.authService.updateUser(updateUserDto, email, user);
  }

  @Delete('/delete_user')
  @Auth(Roles.ADMIN_ROLE)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Delete User By Email, Access only to administrators',
  })
  deleteUser(@Query() email: GetUserByEmailDto, @GetUser() user: User) {
    return this.authService.deleteUser(email, user);
  }
}
