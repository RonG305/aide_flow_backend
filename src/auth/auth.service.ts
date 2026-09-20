import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { GetUsersDto } from './dto/get-users.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { randomUUID } from 'node:crypto';
import { CreateUserDto } from './dto/create-user.dto';
import { paginate } from 'src/common/pagination/paginate';
import Fuse from 'fuse.js';
import { successResponse } from 'src/common/utils/api-response';
import { Status } from 'src/generated/prisma/enums';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  private async hashPassword(password: string): Promise<string> {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    return hashedPassword;
  }
  async createUser(createUserDto: CreateUserDto) {
    const {
      first_name,
      last_name,
      email,
      password,
      confirm_password,
      gender,
      date_of_birth,
      accept_terms_conditions,
    } = createUserDto;

    if (password !== confirm_password) {
      throw new UnauthorizedException('Passwords do not match!');
    }

    if (!accept_terms_conditions) {
      throw new UnauthorizedException('You must accept terms and conditions');
    }

    const existingUser = await this.prisma.user.findUnique({
      where: { email },
    });
    if (existingUser) {
      throw new UnauthorizedException(
        'An account with this email already exists',
      );
    }

    const hashedPassword = await this.hashPassword(password);

    const user = await this.prisma.user.create({
      data: {
        first_name,
        last_name,
        email,
        password: hashedPassword,
        date_of_birth: date_of_birth || undefined,
        accept_terms_conditions,
        gender,
      },
    });
    return user;
  }

  async signIn(email: string, password: string) {
    const user = await this.prisma.user.findUnique({
      where: { email },
      omit: { password: false },
    });
    if (!user)
      throw new UnauthorizedException('Account Not found! Register to login');
    if (user.status !== 'active')
      throw new UnauthorizedException('Your account is inactive');
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) throw new UnauthorizedException('Invalid password');

    const payload = {
      sub: user.id,
      email: user.email,
    };

    const accessToken = this.jwtService.sign(payload);

    return {
      accessToken,
      user_id: user.id,
    };
  }

  /**
   * Mints a long-lived token for the on-device agent, acting for this user.
   * Each mint rotates the stored key, so an older agent token stops working.
   */
  async issueAgentToken(userId: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundException('Account not found');

    const agentKeyId = randomUUID();
    await this.prisma.user.update({
      where: { id: userId },
      data: { agent_key_id: agentKeyId },
    });

    const agentToken = this.jwtService.sign(
      {
        sub: user.id,
        email: user.email,
        is_agent: true,
        akid: agentKeyId,
      },
      { expiresIn: '365d' },
    );

    return successResponse('Agent token issued succesifully', {
      agentToken,
      user_id: user.id,
    });
  }

  async revokeAgentToken(userId: string) {
    await this.prisma.user.update({
      where: { id: userId },
      data: { agent_key_id: null },
    });

    return successResponse('Agent access revoked succesifully', null);
  }

  async getAllUsers({ search, limit, page }: GetUsersDto) {
    if (!page) page = 1;
    if (!limit) limit = 10;

    const totalUsers = await this.prisma.user.count();

    const pagination = paginate(totalUsers, page, limit);
    const users = await this.prisma.user.findMany({
      skip: Number((page - 1) * limit),
      take: Number(limit),
      orderBy: {
        created_at: 'desc',
      },
    });

    const options = {
      keys: ['email'],
      threshold: 0.3,
    };

    const fuse = new Fuse(users, options);
    if (search) {
      const result = fuse.search(search);
      const filteredUsers = result.map((user) => user.item);
      return {
        data: filteredUsers,
        ...pagination,
      };
    }

    return {
      data: users,
      ...pagination,
    };
  }

  async getUserById(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    return user;
  }

  async updateUser(id: string, updateUserDto: UpdateUserDto) {
    const user = await this.prisma.user.update({
      where: { id },
      data: { ...updateUserDto },
    });
    return successResponse('User details updated succesifully', user);
  }

  async deleteUser(id: string) {
    const user = await this.prisma.user.delete({
      where: { id },
    });
    return successResponse('User account deleted succesifully', user);
  }

  async CanActivateOrDeactivateUser(userId: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundException('Account not found');

    const status =
      user.status === Status.active ? Status.inactive : Status.active;

    const updatedUser = await this.prisma.user.update({
      where: { id: userId },
      data: { status },
    });

    return successResponse(
      status === Status.active
        ? 'User account activated succesifully'
        : 'User account deactivated succesifully',
      updatedUser,
    );
  }
}
