import {
  Controller, Get, Post, Put, Delete, Body, Param,
  UseGuards, UseInterceptors, UploadedFile, BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiBearerAuth, ApiConsumes } from '@nestjs/swagger';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import { existsSync, mkdirSync } from 'fs';
import { CertificatesService } from './certificates.service';
import { CreateCertificateDto } from './dto/create-certificate.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

const certStorage = diskStorage({
  destination: (_req, _file, cb) => {
    const p = join(process.cwd(), 'uploads', 'certificates');
    if (!existsSync(p)) mkdirSync(p, { recursive: true });
    cb(null, p);
  },
  filename: (_req, file, cb) => {
    cb(null, `${Date.now()}-${Math.round(Math.random() * 1e9)}${extname(file.originalname)}`);
  },
});

const certFilter = (_req: any, file: Express.Multer.File, cb: any) => {
  const allowed = /\/(jpg|jpeg|png|gif|webp|pdf)$/;
  if (!file.mimetype.match(allowed)) {
    return cb(new BadRequestException('Faqat rasm yoki PDF fayllar qabul qilinadi'), false);
  }
  cb(null, true);
};

@ApiTags('certificates')
@Controller('certificates')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class CertificatesController {
  constructor(private readonly service: CertificatesService) {}

  @Get()
  getAll(@CurrentUser() userId: string) {
    return this.service.getAll(userId);
  }

  @Post()
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file', {
    storage: certStorage,
    limits: { fileSize: 10 * 1024 * 1024 },
    fileFilter: certFilter,
  }))
  create(
    @CurrentUser() userId: string,
    @Body() dto: CreateCertificateDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    const fileInfo = file ? {
      fileUrl: `/uploads/certificates/${file.filename}`,
      fileType: file.mimetype === 'application/pdf' ? 'pdf' : 'image',
    } : undefined;
    return this.service.create(userId, dto, fileInfo);
  }

  @Put(':id')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file', {
    storage: certStorage,
    limits: { fileSize: 10 * 1024 * 1024 },
    fileFilter: certFilter,
  }))
  update(
    @Param('id') id: string,
    @CurrentUser() userId: string,
    @Body() dto: Partial<CreateCertificateDto>,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    const fileInfo = file ? {
      fileUrl: `/uploads/certificates/${file.filename}`,
      fileType: file.mimetype === 'application/pdf' ? 'pdf' : 'image',
    } : undefined;
    return this.service.update(id, userId, dto, fileInfo);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @CurrentUser() userId: string) {
    return this.service.remove(id, userId);
  }
}
