import {
  Injectable, ConflictException, UnauthorizedException,
  BadRequestException, NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { EmailService } from '../email/email.service';
import * as bcrypt from 'bcryptjs';
import { randomInt } from 'crypto';

enum OtpType {
  EMAIL_VERIFY = 'EMAIL_VERIFY',
  PASSWORD_RESET = 'PASSWORD_RESET',
}

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
    private readonly email: EmailService,
  ) {}

  // ─── 1. Ro'yxatdan o'tish ──────────────────────────────────
  async register(dto: { email: string; username: string; password: string; name?: string }) {
    const exists = await this.prisma.user.findFirst({
      where: { OR: [{ email: dto.email }, { username: dto.username }] },
    });

    if (exists?.email === dto.email)
      throw new ConflictException('Bu email allaqachon ro\'yxatdan o\'tgan');
    if (exists?.username === dto.username)
      throw new ConflictException('Bu username band, boshqasini tanlang');

    const hashedPassword = await bcrypt.hash(dto.password, 12);

    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        username: dto.username.toLowerCase(),
        password: hashedPassword,
        name: dto.name,
      },
    });

    await this.sendOtp(user.email, OtpType.EMAIL_VERIFY, user.id, user.name ?? undefined);

    return {
      message: 'Emailingizga tasdiqlash kodi yuborildi',
      email: user.email,
    };
  }

  // ─── 2. Email tasdiqlash ───────────────────────────────────
  async verifyEmail(dto: { email: string; code: string }) {
    const otp = await this.validateOtp(dto.email, dto.code, OtpType.EMAIL_VERIFY);

    const user = await this.prisma.user.update({
      where: { email: dto.email },
      data: { isEmailVerified: true },
    });

    await this.prisma.otpCode.update({
      where: { id: otp.id },
      data: { used: true },
    });

    return this.generateTokens(user);
  }

  // ─── 3. OTP qayta yuborish ─────────────────────────────────
  async resendOtp(email: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) throw new NotFoundException('Foydalanuvchi topilmadi');
    if (user.isEmailVerified) throw new BadRequestException('Email allaqachon tasdiqlangan');

    await this.sendOtp(email, OtpType.EMAIL_VERIFY, user.id, user.name ?? undefined);
    return { message: 'Yangi kod yuborildi' };
  }

  // ─── 4. Tizimga kirish ─────────────────────────────────────
  async login(dto: { email: string; password: string }) {
    const user = await this.prisma.user.findUnique({ where: { email: dto.email } });

    if (!user || !user.password)
      throw new UnauthorizedException('Email yoki parol noto\'g\'ri');

    const isValid = await bcrypt.compare(dto.password, user.password);
    if (!isValid)
      throw new UnauthorizedException('Email yoki parol noto\'g\'ri');

    if (!user.isEmailVerified)
      throw new UnauthorizedException('Email tasdiqlanmagan. Emailingizni tekshiring');

    return this.generateTokens(user);
  }

  // ─── 5. Parolni tiklash — 1-qadam ─────────────────────────
  async forgotPassword(email: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) return { message: 'Agar email ro\'yxatda bo\'lsa, xat yuborildi' };

    await this.sendOtp(email, OtpType.PASSWORD_RESET, user.id, user.name ?? undefined);
    return { message: 'Parolni tiklash kodi emailingizga yuborildi' };
  }

  // ─── 6. Reset OTP tekshirish — 2-qadam ────────────────────
  async verifyResetOtp(dto: { email: string; code: string }) {
    await this.validateOtp(dto.email, dto.code, OtpType.PASSWORD_RESET);

    const resetToken = this.jwt.sign(
      { email: dto.email, purpose: 'reset' },
      { secret: process.env.JWT_SECRET, expiresIn: '15m' },
    );
    return { resetToken };
  }

  // ─── 7. Yangi parol — 3-qadam ─────────────────────────────
  async resetPassword(dto: { resetToken: string; newPassword: string }) {
    let payload: any;
    try {
      payload = this.jwt.verify(dto.resetToken, { secret: process.env.JWT_SECRET });
    } catch {
      throw new BadRequestException('Token yaroqsiz yoki muddati o\'tgan');
    }

    if (payload.purpose !== 'reset')
      throw new BadRequestException('Token yaroqsiz');

    const hashed = await bcrypt.hash(dto.newPassword, 12);

    await this.prisma.user.update({
      where: { email: payload.email },
      data: { password: hashed },
    });

    await this.prisma.otpCode.updateMany({
      where: { email: payload.email, type: OtpType.PASSWORD_RESET },
      data: { used: true },
    });

    return { message: 'Parol muvaffaqiyatli yangilandi' };
  }

  // ─── 8. Parolni o'zgartirish ──────────────────────────────
  async changePassword(userId: string, dto: { oldPassword: string; newPassword: string }) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });

    if (!user?.password)
      throw new BadRequestException('OAuth orqali kirgansiz, parol yo\'q');

    const isValid = await bcrypt.compare(dto.oldPassword, user.password);
    if (!isValid) throw new BadRequestException('Eski parol noto\'g\'ri');

    const hashed = await bcrypt.hash(dto.newPassword, 12);
    await this.prisma.user.update({ where: { id: userId }, data: { password: hashed } });

    return { message: 'Parol muvaffaqiyatli o\'zgartirildi' };
  }

  // ─── 9. Joriy foydalanuvchi ────────────────────────────────
  async getMe(userId: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) return null;
    const { password, githubAccessToken, ...rest } = user;
    return rest;
  }

  // ─── 10. GitHub / Google OAuth login ──────────────────────
  async oauthLogin(profile: {
    githubId?: string;
    googleId?: string;
    email: string;
    name?: string;
    avatar?: string;
    username?: string;
    accessToken?: string;
  }) {
    // Email bo'yicha mavjud foydalanuvchini topamiz
    let user = await this.prisma.user.findUnique({
      where: { email: profile.email },
    });

    if (user) {
      // Mavjud foydalanuvchiga OAuth ma'lumotlarini bog'laymiz
      user = await this.prisma.user.update({
        where: { id: user.id },
        data: {
          ...(profile.githubId && {
            githubId: profile.githubId,
            githubAccessToken: profile.accessToken,
          }),
          ...(profile.googleId && { googleId: profile.googleId }),
          avatar: user.avatar || profile.avatar,
          isEmailVerified: true,
        },
      });
    } else {
      // Yangi foydalanuvchi yaratamiz
      const baseUsername = profile.username || profile.email.split('@')[0];
      const username = await this.generateUniqueUsername(baseUsername);

      user = await this.prisma.user.create({
        data: {
          email: profile.email,
          username,
          name: profile.name,
          avatar: profile.avatar,
          isEmailVerified: true,
          ...(profile.githubId && {
            githubId: profile.githubId,
            githubAccessToken: profile.accessToken,
          }),
          ...(profile.googleId && { googleId: profile.googleId }),
        },
      });
    }

    return this.generateTokens(user);
  }

  // ─── Yordamchi: Unique username yaratish ──────────────────
  private async generateUniqueUsername(base: string): Promise<string> {
    // Faqat ruxsat etilgan belgilar
    const clean = base.toLowerCase().replace(/[^a-z0-9_]/g, '_');
    let username = clean;
    let counter = 1;

    while (await this.prisma.user.findUnique({ where: { username } })) {
      username = `${clean}${counter++}`;
    }
    return username;
  }

  // ─── Yordamchi: OTP yuborish ───────────────────────────────
  private async sendOtp(
    email: string,
    type: OtpType,
    userId?: string,
    name?: string,
  ) {
    await this.prisma.otpCode.deleteMany({
      where: { email, type, used: false },
    });

    const code = randomInt(100000, 1000000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    await this.prisma.otpCode.create({
      data: { email, code, type, expiresAt, userId },
    });

    await this.email.sendOtp(email, code, name);
  }

  // ─── Yordamchi: OTP tekshirish ─────────────────────────────
  private async validateOtp(email: string, code: string, type: OtpType) {
    const otp = await this.prisma.otpCode.findFirst({
      where: { email, code, type, used: false },
      orderBy: { createdAt: 'desc' },
    });

    if (!otp) throw new BadRequestException('Kod noto\'g\'ri');
    if (otp.expiresAt < new Date()) throw new BadRequestException('Kod muddati o\'tgan');

    return otp;
  }

  // ─── 11. Refresh token ────────────────────────────────────────
  async refreshToken(token: string) {
    let payload: any;
    try {
      payload = this.jwt.verify(token, { secret: process.env.JWT_REFRESH_SECRET });
    } catch {
      throw new UnauthorizedException('Refresh token yaroqsiz yoki muddati o\'tgan');
    }
    const user = await this.prisma.user.findUnique({ where: { id: payload.sub } });
    if (!user) throw new UnauthorizedException('Foydalanuvchi topilmadi');
    return this.generateTokens(user);
  }

  // ─── Yordamchi: Token yaratish ─────────────────────────────
  private generateTokens(user: { id: string; email: string; username: string }) {
    const payload = { sub: user.id, email: user.email, username: user.username };
    return {
      accessToken: this.jwt.sign(payload),
      refreshToken: this.jwt.sign(payload, {
        secret: process.env.JWT_REFRESH_SECRET,
        expiresIn: '30d',
      }),
    };
  }
}