import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCertificateDto } from './dto/create-certificate.dto';

@Injectable()
export class CertificatesService {
  constructor(private readonly prisma: PrismaService) {}

  getAll(userId: string) {
    return this.prisma.certificate.findMany({
      where: { userId },
      orderBy: { order: 'asc' },
    });
  }

  create(
    userId: string,
    dto: CreateCertificateDto,
    file?: { fileUrl: string; fileType: string },
  ) {
    return this.prisma.certificate.create({
      data: {
        userId,
        title: dto.title,
        issuer: dto.issuer,
        issueDate: dto.issueDate ? new Date(dto.issueDate) : undefined,
        expiryDate: dto.expiryDate ? new Date(dto.expiryDate) : undefined,
        url: dto.url,
        fileUrl: file?.fileUrl,
        fileType: file?.fileType,
      },
    });
  }

  async update(
    id: string,
    userId: string,
    dto: Partial<CreateCertificateDto>,
    file?: { fileUrl: string; fileType: string },
  ) {
    await this.checkOwner(id, userId);
    return this.prisma.certificate.update({
      where: { id },
      data: {
        ...dto,
        issueDate: dto.issueDate !== undefined
          ? (dto.issueDate ? new Date(dto.issueDate) : null)
          : undefined,
        expiryDate: dto.expiryDate !== undefined
          ? (dto.expiryDate ? new Date(dto.expiryDate) : null)
          : undefined,
        ...(file && { fileUrl: file.fileUrl, fileType: file.fileType }),
      },
    });
  }

  async remove(id: string, userId: string) {
    await this.checkOwner(id, userId);
    return this.prisma.certificate.delete({ where: { id } });
  }

  private async checkOwner(id: string, userId: string) {
    const cert = await this.prisma.certificate.findUnique({ where: { id } });
    if (!cert) throw new NotFoundException('Sertifikat topilmadi');
    if (cert.userId !== userId) throw new ForbiddenException();
  }
}
