import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  HttpCode,
  HttpStatus,
  Query,
  Req,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login-auth.dto';
import { GetUsersDto } from './dto/get-users.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { AuthGuard } from './auth.gurads';
import { UpdateUserDto } from './dto/update-user.dto';

@ApiBearerAuth('jwt-auth')
@Controller('')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  create(@Body() createUserDto: CreateUserDto) {
    return this.authService.createUser(createUserDto);
  }

  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  @Get('users')
  getAllUsers(@Query() getUsersDto: GetUsersDto) {
    return this.authService.getAllUsers(getUsersDto);
  }

  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  @Get('users/:id')
  getUserById(@Param('id') id: string) {
    return this.authService.getUserById(id);
  }

  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  @Patch('users/:id/update')
  updateUser(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.authService.updateUser(id, updateUserDto);
  }

  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  @Patch('users/:id/status')
  canActivateOrDeactivateUser(@Param('id') id: string) {
    return this.authService.CanActivateOrDeactivateUser(id);
  }

  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  @Delete('users/:id/delete')
  deleteUser(@Param('id') id: string) {
    return this.authService.deleteUser(id);
  }

  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  @Post('agent/token')
  issueAgentToken(@Req() req) {
    return this.authService.issueAgentToken(req.user.sub);
  }

  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  @Delete('agent/token')
  revokeAgentToken(@Req() req) {
    return this.authService.revokeAgentToken(req.user.sub);
  }

  @HttpCode(HttpStatus.OK)
  @Post('login')
  signIn(@Body() body: LoginDto) {
    return this.authService.signIn(body.email, body.password);
  }
}
