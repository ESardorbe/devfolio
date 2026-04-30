import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProjectDto } from './dto/create-project.dto';

@Injectable()
export class ProjectsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(userId: string) {
    return this.prisma.project.findMany({
      where: { userId },
      orderBy: [{ featured: 'desc' }, { order: 'asc' }, { createdAt: 'desc' }],
    });
  }

  async create(userId: string, dto: CreateProjectDto) {
    return this.prisma.project.create({
      data: { ...dto, userId },
    });
  }

  async update(id: string, userId: string, dto: Partial<CreateProjectDto>) {
    await this.checkOwner(id, userId);
    return this.prisma.project.update({ where: { id }, data: dto });
  }

  async remove(id: string, userId: string) {
    await this.checkOwner(id, userId);
    await this.prisma.project.delete({ where: { id } });
    return { message: 'Loyiha o\'chirildi' };
  }

  async reorder(userId: string, orderedIds: string[]) {
    const updates = orderedIds.map((id, index) =>
      this.prisma.project.updateMany({
        where: { id, userId },
        data: { order: index },
      }),
    );
    await Promise.all(updates);
    return { message: 'Tartib yangilandi' };
  }

  private async checkOwner(id: string, userId: string) {
    const project = await this.prisma.project.findUnique({ where: { id } });
    if (!project) throw new NotFoundException('Loyiha topilmadi');
    if (project.userId !== userId) throw new ForbiddenException('Ruxsat yo\'q');
    return project;
  }
}