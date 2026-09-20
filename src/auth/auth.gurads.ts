import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { PrismaService } from 'src/prisma/prisma.service';
import { jwtConstants } from './constants';

/** What a verified token carries. `is_agent` marks the on-device agent. */
export interface TokenPayload {
  sub: string;
  email: string;
  is_agent?: boolean;
  /** Which agent key this token was minted against; agent tokens only. */
  akid?: string;
}

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const token = this.extractTokenFromHeader(request);

    if (!token) throw new UnauthorizedException('You are not logged in');

    let payload: TokenPayload;
    try {
      payload = await this.jwtService.verifyAsync<TokenPayload>(token, {
        secret: jwtConstants.secret,
      });
    } catch {
      throw new UnauthorizedException('Your session has expired, login again');
    }

    // An agent token is only good while it matches the key currently stored
    // on the user, so revoking the agent does not require the secret to change.
    if (payload.is_agent) {
      const user = await this.prisma.user.findUnique({
        where: { id: payload.sub },
        select: { agent_key_id: true, status: true },
      });

      if (!user || !user.agent_key_id || user.agent_key_id !== payload.akid)
        throw new UnauthorizedException('This agent access has been revoked');

      if (user.status !== 'active')
        throw new UnauthorizedException('This account is inactive');
    }

    request['user'] = payload;
    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
