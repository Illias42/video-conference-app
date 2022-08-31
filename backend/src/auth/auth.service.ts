import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { SignInDto, SignUpDto, UpdateDto } from './dto';
import * as argon from 'argon2';
import { JwtPayload, Tokens } from './types';
import { JwtService } from '@nestjs/jwt';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { AwsService } from 'src/aws/aws.service';
import { customAlphabet } from "nanoid";

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService, private jwtService: JwtService, private aws: AwsService) {}

  private nanoid = customAlphabet('1234567890abcdef', 10);

  async signup(dto: SignUpDto, avatar: any): Promise<any> {

    let avatarLocation;

    if (avatar) {
      avatarLocation = await this.aws.uploadFile(avatar);
    }

    const hash = await argon.hash(dto.password);
    const user = await this.prisma.user.create({
      data: {
        name: dto.name,
        email: dto.email,
        tag: this.nanoid(5),
        avatar: avatarLocation ?? null,
        hash
      }
    })
    .catch((error) => {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ForbiddenException({
            field: 'email',
            details: 'Email already in use'
          });
        }
      }
      throw error;
    });

    const tokens = await this.getTokens(user.id, user.name, user.email);
    await this.updateRtHash(user.id, tokens.refresh_token)

    return {
      user_data: {
        id: user.id,
        name: user.name,
        email: user.email,
        tag: user.tag,
        avatar: user.avatar
      },
      ...tokens
    };
  }
  
  async signin(dto: SignInDto): Promise<any> {
    const user = await this.prisma.user.findUnique({
      where: {
        email: dto.email
      }
    });

    if (!user) throw new ForbiddenException({
      field: 'email',
      details: 'User not found'
    });

    const passwordMatches = await argon.verify(user.hash, dto.password);
    if (!passwordMatches) throw new ForbiddenException({
      field: 'password',
      details: 'Password incorrect'
    });

    const tokens = await this.getTokens(user.id, user.name, user.email);
    await this.updateRtHash(user.id, tokens.refresh_token);

    return {
      user_data: {
        id: user.id,
        name: user.name,
        email: user.email,
        tag: user.tag,
        avatar: user.avatar
      },
      ...tokens
    };
  }

  async update(dto: UpdateDto, avatar: any): Promise<any> {
    const user = await this.prisma.user.findUnique({
      where: {
        email: dto.email
      }
    });

    if (!user) throw new ForbiddenException({
      field: 'email',
      details: 'User not found'
    });

    const passwordMatches = await argon.verify(user.hash, dto.password);
    if (!passwordMatches) throw new ForbiddenException({
      field: 'password',
      details: 'Password incorrect'
    });
    
    let newAvatar;
    if (avatar) {
      newAvatar = await this.aws.uploadFile(avatar);
    }

    let newHash;
    if (dto.newPassword) {
      newHash = await argon.hash(dto.newPassword);
    }

    const userUpdated = await this.prisma.user.update({
      where: {
        email: dto.email
      },
      data: {
        name: dto.name,
        email: dto.email,
        tag: dto.tag,
        avatar: newAvatar ?? user.avatar,
        hash: newHash ?? user.hash
      }
    })
    .catch((error) => {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ForbiddenException('Credentials incorrect');
        }
      }
      throw error;
    });

    const tokens = await this.getTokens(userUpdated.id, userUpdated.name, userUpdated.email);
    await this.updateRtHash(userUpdated.id, tokens.refresh_token)

    return {
      user_data: {
        id: userUpdated.id,
        name: userUpdated.name,
        email: userUpdated.email,
        avatar: userUpdated.avatar
      },
      ...tokens
    };
  }

  async refresh(userId: string, rt: string): Promise<Tokens> {
    const user = await this.prisma.user.findUnique({
      where: {
        id: userId
      }
    });
    if (!user || !user.hashedRt) throw new ForbiddenException('Access Denied');

    const rtMatches = await argon.verify(user.hashedRt, rt);
    if (!rtMatches) throw new ForbiddenException('Access Denied');

    const tokens = await this.getTokens(user.id, user.name, user.email);
    await this.updateRtHash(user.id, tokens.refresh_token);

    return tokens;
  }

  async logout(userId: string): Promise<boolean> {
    await this.prisma.user.updateMany({
      where: {
        id: userId,
        hashedRt: {
          not: null,
        },
      },
      data: {
        hashedRt: null,
      },
    });
    return true;
  }


  async updateRtHash(userId: string, rt: string): Promise<void> {
    const hash = await argon.hash(rt);
    await this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        hashedRt: hash,
      },
    });
  }

  async getTokens(userId: string, name: string, email: string) {
    const payload: JwtPayload = {
      sub: userId,
      name,
      email
    }
    
    const [at, rt] = await Promise.all([
      this.jwtService.signAsync(
        payload,
        {
          secret: process.env.AT_SECRET_KEY,
          expiresIn: '24h'
        }
      ),
      this.jwtService.signAsync(
        payload,
        {
          secret: process.env.RT_SECRET_KEY,
          expiresIn: '7d'
        }
      )
    ]);

    return {
      access_token: at,
      refresh_token: rt
    }
  } 

}
