// educations.controller.ts
import {
  Controller, Get, Post, Put, Delete,
  Body, Param, UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { EducationsService } from './educations.service';
import { CreateEducationDto } from './dto/create-education.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@ApiTags('🎓 Education')
@Controller('educations')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class EducationsController {
  constructor(private readonly educationsService: EducationsService) {}

  @Get()
  @ApiOperation({ summary: 'Ta\'lim ma\'lumotlarini olish' })
  findAll(@CurrentUser() userId: string) {
    return this.educationsService.findAll(userId);
  }

  @Post()
  @ApiOperation({ summary: 'Ta\'lim ma\'lumoti qo\'shish' })
  create(@CurrentUser() userId: string, @Body() dto: CreateEducationDto) {
    return this.educationsService.create(userId, dto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Ta\'lim ma\'lumotini tahrirlash' })
  update(
    @Param('id') id: string,
    @CurrentUser() userId: string,
    @Body() dto: Partial<CreateEducationDto>,
  ) {
    return this.educationsService.update(id, userId, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Ta\'lim ma\'lumotini o\'chirish' })
  remove(@Param('id') id: string, @CurrentUser() userId: string) {
    return this.educationsService.remove(id, userId);
  }
}