// experiences.service.ts
import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateExperienceDto } from './dto/create-experience.dto';

@Injectable()
export class ExperiencesService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(userId: string) {
    return this.prisma.experience.findMany({
      where: { userId },
      orderBy: [{ isCurrent: 'desc' }, { order: 'asc' }, { startDate: 'desc' }],
    });
  }

  async create(userId: string, dto: CreateExperienceDto) {
    return this.prisma.experience.create({
      data: {
        ...dto,
        startDate: new Date(dto.startDate),
        endDate: dto.endDate ? new Date(dto.endDate) : null,
        userId,
      },
    });
  }

  async update(id: string, userId: string, dto: Partial<CreateExperienceDto>) {
    await this.checkOwner(id, userId);
    return this.prisma.experience.update({
      where: { id },
      data: {
        ...dto,
        startDate: dto.startDate ? new Date(dto.startDate) : undefined,
        endDate: dto.endDate ? new Date(dto.endDate) : undefined,
      },
    });
  }

  async remove(id: string, userId: string) {
    await this.checkOwner(id, userId);
    await this.prisma.experience.delete({ where: { id } });
    return { message: 'Tajriba o\'chirildi' };
  }

  private async checkOwner(id: string, userId: string) {
    const exp = await this.prisma.experience.findUnique({ where: { id } });
    if (!exp) throw new NotFoundException('Tajriba topilmadi');
    if (exp.userId !== userId) throw new ForbiddenException('Ruxsat yo\'q');
    return exp;
  }
}