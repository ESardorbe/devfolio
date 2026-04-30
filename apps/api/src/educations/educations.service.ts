import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateEducationDto } from './dto/create-education.dto';

@Injectable()
export class EducationsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(userId: string) {
    return this.prisma.education.findMany({
      where: { userId },
      orderBy: [{ isCurrent: 'desc' }, { order: 'asc' }, { startDate: 'desc' }],
    });
  }

  async create(userId: string, dto: CreateEducationDto) {
    return this.prisma.education.create({
      data: {
        ...dto,
        startDate: new Date(dto.startDate),
        endDate: dto.endDate ? new Date(dto.endDate) : null,
        userId,
      },
    });
  }

  async update(id: string, userId: string, dto: Partial<CreateEducationDto>) {
    await this.checkOwner(id, userId);
    return this.prisma.education.update({
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
    await this.prisma.education.delete({ where: { id } });
    return { message: 'Ta\'lim ma\'lumoti o\'chirildi' };
  }

  private async checkOwner(id: string, userId: string) {
    const edu = await this.prisma.education.findUnique({ where: { id } });
    if (!edu) throw new NotFoundException('Ta\'lim ma\'lumoti topilmadi');
    if (edu.userId !== userId) throw new ForbiddenException('Ruxsat yo\'q');
    return edu;
  }
}