// experiences.controller.ts
import {
  Controller, Get, Post, Put, Delete,
  Body, Param, UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { ExperiencesService } from './experiences.service';
import { CreateExperienceDto } from './dto/create-experience.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@ApiTags('💼 Experience')
@Controller('experiences')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class ExperiencesController {
  constructor(private readonly experiencesService: ExperiencesService) {}

  @Get()
  @ApiOperation({ summary: 'Ish tajribalarini olish' })
  findAll(@CurrentUser() userId: string) {
    return this.experiencesService.findAll(userId);
  }

  @Post()
  @ApiOperation({ summary: 'Ish tajribasi qo\'shish' })
  create(@CurrentUser() userId: string, @Body() dto: CreateExperienceDto) {
    return this.experiencesService.create(userId, dto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Ish tajribasini tahrirlash' })
  update(
    @Param('id') id: string,
    @CurrentUser() userId: string,
    @Body() dto: Partial<CreateExperienceDto>,
  ) {
    return this.experiencesService.update(id, userId, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Ish tajribasini o\'chirish' })
  remove(@Param('id') id: string, @CurrentUser() userId: string) {
    return this.experiencesService.remove(id, userId);
  }
}