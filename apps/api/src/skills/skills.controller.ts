// skills.controller.ts
import {
  Controller, Get, Post, Put, Delete, Patch,
  Body, Param, UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { SkillsService } from './skills.service';
import { CreateSkillDto } from './dto/create-skill.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@ApiTags('skills')
@Controller('skills')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class SkillsController {
  constructor(private readonly skillsService: SkillsService) {}

  @Get()
  @ApiOperation({ summary: 'O\'z ko\'nikmalarini olish' })
  findAll(@CurrentUser() userId: string) {
    return this.skillsService.findAll(userId);
  }

  @Post()
  @ApiOperation({ summary: 'Ko\'nikma qo\'shish' })
  create(@CurrentUser() userId: string, @Body() dto: CreateSkillDto) {
    return this.skillsService.create(userId, dto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Ko\'nikmani tahrirlash' })
  update(
    @Param('id') id: string,
    @CurrentUser() userId: string,
    @Body() dto: Partial<CreateSkillDto>,
  ) {
    return this.skillsService.update(id, userId, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Ko\'nikmani o\'chirish' })
  remove(@Param('id') id: string, @CurrentUser() userId: string) {
    return this.skillsService.remove(id, userId);
  }

  @Patch('reorder')
  @ApiOperation({ summary: 'Ko\'nikmalar tartibini o\'zgartirish' })
  reorder(
    @CurrentUser() userId: string,
    @Body() body: { orderedIds: string[] },
  ) {
    return this.skillsService.reorder(userId, body.orderedIds);
  }
}