import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  // --- Public profil (/u/username) ---
  async getPublicProfile(username: string) {
    const user = await this.prisma.user.findFirst({
      where: {
        username: username.toLowerCase(),
        isPublic: true,
      },
      select: {
        id: true,
        username: true,
        name: true,
        avatar: true,
        bio: true,
        headline: true,
        location: true,
        website: true,
        github: true,
        linkedin: true,
        telegram: true,
        twitter: true,
        phone: true,
        birthDate: true,
        isOpenToWork: true,
        createdAt: true,
        skills: { orderBy: { order: 'asc' } },
        projects: { orderBy: { order: 'asc' } },
        experiences: { orderBy: { order: 'asc' } },
        educations: { orderBy: { order: 'asc' } },
        certificates: { orderBy: { order: 'asc' } },
      },
    });

    if (!user) {
      throw new NotFoundException(`/u/${username} profili topilmadi yoki yopiq`);
    }

    return user;
  }

  // --- O'z profilini olish (barcha loyihalar) ---
  async getMyProfile(userId: string) {
    return this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        skills: { orderBy: { order: 'asc' } },
        projects: { orderBy: { order: 'asc' } },
        experiences: { orderBy: { order: 'asc' } },
        educations: { orderBy: { order: 'asc' } },
      },
    });
  }

  // --- Sitemap uchun public username lar ---
  async getSitemapList() {
    return this.prisma.user.findMany({
      where: { isPublic: true },
      select: { username: true },
      orderBy: { createdAt: 'desc' },
      take: 5000,
    });
  }

  // --- Profilni yangilash ---
  async updateProfile(userId: string, dto: UpdateProfileDto) {
    // Username o'zgartirilayotgan bo'lsa
    if (dto.username) {
      const existing = await this.prisma.user.findFirst({
        where: {
          username: dto.username.toLowerCase(),
          NOT: { id: userId },
        },
      });
      if (existing) throw new ConflictException('Bu username band');
    }

    return this.prisma.user.update({
      where: { id: userId },
      data: {
        ...dto,
        username: dto.username?.toLowerCase(),
        birthDate: dto.birthDate !== undefined
          ? (dto.birthDate ? new Date(dto.birthDate) : null)
          : undefined,
      },
      select: {
        id: true, username: true, name: true, avatar: true,
        bio: true, headline: true, location: true, website: true,
        github: true, linkedin: true, telegram: true, twitter: true,
        phone: true, birthDate: true,
        isPublic: true, isOpenToWork: true,
      },
    });
  }

  // --- Ko'rishlar sonini saqlash ---
  async recordProfileView(userId: string, meta: {
    ip?: string;
    country?: string;
    city?: string;
    source?: string;
    userAgent?: string;
  }) {
    await this.prisma.profileView.create({
      data: { userId, ...meta },
    });
  }

  // --- Ko'rishlar statistikasi ---
  async getProfileViews(userId: string) {
    const total = await this.prisma.profileView.count({ where: { userId } });
    const last30days = await this.prisma.profileView.count({
      where: {
        userId,
        createdAt: { gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) },
      },
    });
    return { total, last30days };
  }

  // --- Avatar yangilash ---
  async updateAvatar(userId: string, avatarUrl: string) {
    return this.prisma.user.update({
      where: { id: userId },
      data: { avatar: avatarUrl },
      select: { id: true, avatar: true },
    });
  }

  // --- Hisobni o'chirish ---
  async deleteAccount(userId: string) {
    await this.prisma.user.delete({ where: { id: userId } });
    return { message: 'Hisob muvaffaqiyatli o\'chirildi' };
  }
}