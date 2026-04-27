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
        isOpenToWork: true,
        createdAt: true,
        // Bog'liq jadvallar
        skills: {
          orderBy: { order: 'asc' },
        },
        projects: {
          where: { featured: true },
          orderBy: { order: 'asc' },
        },
        experiences: {
          orderBy: { order: 'asc' },
        },
        educations: {
          orderBy: { order: 'asc' },
        },
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
      },
      select: {
        id: true, username: true, name: true, avatar: true,
        bio: true, headline: true, location: true, website: true,
        github: true, linkedin: true, telegram: true, twitter: true,
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
}