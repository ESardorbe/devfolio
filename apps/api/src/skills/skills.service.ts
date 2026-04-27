import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateSkillDto } from './dto/create-skill.dto';

@Injectable()
export class SkillsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(userId: string) {
    return this.prisma.skill.findMany({
      where: { userId },
      orderBy: { order: 'asc' },
    });
  }

  async create(userId: string, dto: CreateSkillDto) {
    return this.prisma.skill.create({
      data: { ...dto, userId },
    });
  }

  async update(id: string, userId: string, dto: Partial<CreateSkillDto>) {
    await this.checkOwner(id, userId);
    return this.prisma.skill.update({ where: { id }, data: dto });
  }

  async remove(id: string, userId: string) {
    await this.checkOwner(id, userId);
    await this.prisma.skill.delete({ where: { id } });
  }

  async reorder(userId: string, orderedIds: string[]) {
    const updates = orderedIds.map((id, index) =>
      this.prisma.skill.updateMany({
        where: { id, userId },
        data: { order: index },
      }),
    );
    await Promise.all(updates);
  }

  private async checkOwner(id: string, userId: string) {
    const skill = await this.prisma.skill.findUnique({ where: { id } });
    if (!skill) throw new NotFoundException('Ko\'nikma topilmadi');
    if (skill.userId !== userId) throw new ForbiddenException('Ruxsat yo\'q');
    return skill;
  }
}