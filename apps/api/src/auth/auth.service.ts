import {
  Injectable,
  ConflictException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcryptjs';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
  ) {}

  // --- Ro'yxatdan o'tish ---
  async register(dto: RegisterDto) {
    // Email va username band emasligini tekshirish
    const exists = await this.prisma.user.findFirst({
      where: {
        OR: [{ email: dto.email }, { username: dto.username }],
      },
    });

    if (exists) {
      if (exists.email === dto.email) {
        throw new ConflictException('Bu email allaqachon ro\'yxatdan o\'tgan');
      }
      throw new ConflictException('Bu username band, boshqasini tanlang');
    }

    const hashedPassword = await bcrypt.hash(dto.password, 12);

    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        username: dto.username.toLowerCase(),
        password: hashedPassword,
        name: dto.name,
      },
    });

    return this.generateTokens(user);
  }

  // --- Tizimga kirish ---
  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (!user || !user.password) {
      throw new UnauthorizedException('Email yoki parol noto\'g\'ri');
    }

    const isValid = await bcrypt.compare(dto.password, user.password);
    if (!isValid) {
      throw new UnauthorizedException('Email yoki parol noto\'g\'ri');
    }

    return this.generateTokens(user);
  }

  // --- Joriy foydalanuvchi ---
  async getMe(userId: string) {
    return this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        username: true,
        name: true,
        avatar: true,
        headline: true,
        bio: true,
        location: true,
        website: true,
        github: true,
        linkedin: true,
        telegram: true,
        twitter: true,
        isPublic: true,
        isOpenToWork: true,
        createdAt: true,
      },
    });
  }

  // --- Token yaratish ---
  private generateTokens(user: { id: string; email: string; username: string }) {
    const payload = { sub: user.id, email: user.email, username: user.username };

    const accessToken = this.jwt.sign(payload);
    const refreshToken = this.jwt.sign(payload, {
      secret: process.env.JWT_REFRESH_SECRET,
      expiresIn: '30d',
    });

    return { accessToken, refreshToken };
  }
}