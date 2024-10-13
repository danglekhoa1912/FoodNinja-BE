import {
  ConflictException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import * as argon from 'argon2';
import { AuthDto, RegisterDto } from './dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private prismaService: PrismaService,
    private jwtService: JwtService,
  ) {}
  async login(authDTO: AuthDto) {
    const user = await this.prismaService.user.findUnique({
      where: {
        email: authDTO.email,
      },
    });
    if (!user) {
      throw new ForbiddenException('User not found');
    }
    const passwordMatched = await argon.verify(user.password, authDTO.password);
    if (!passwordMatched) {
      throw new ForbiddenException('Password not matched');
    }
    return await this.generateToken(user.id, user.email);
  }

  async register(body: RegisterDto) {
    const hashedPassword = await argon.hash(body.password);

    try {
      const user = await this.prismaService.user.create({
        data: {
          email: body.email,
          password: hashedPassword,
          avatar: body.avatar,
          firstName: body.firstName,
          lastName: body.lastName,
          address: {
            create: {
              latitude: body.latitude,
              longitude: body.longitude,
              city: '',
              street: '',
              country: '',
              state: '',
              zip: '',
              createdAt: new Date(),
              updatedAt: new Date(),
            },
          },
          paymentMethodId: body.paymentMethod,
          phone: body.phone,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      });
      return this.generateToken(user.id, user.email);
    } catch (error) {
      // Handle specific error types
      console.error(error);
      if (error.code === 'P2002') {
        // Unique constraint violation
        if (error.meta.target.includes('email')) {
          throw new ConflictException('Email already exists.');
        } else if (error.meta.target.includes('phone')) {
          throw new ConflictException('Phone number already exists.');
        }
      } else {
        // Handle any other unexpected errors
        throw new InternalServerErrorException(
          'An unexpected error occurred. Please try again later.',
        );
      }
    }
  }

  async generateToken(userId: string, email: string) {
    const payload = { email: email, sub: userId };
    const token = await this.jwtService.signAsync(payload, {
      expiresIn: '30d',
      secret: process.env.JWT_SECRET,
    });
    return {
      access_token: token,
    };
  }
}
