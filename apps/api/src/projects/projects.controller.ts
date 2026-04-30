import {
  Controller, Get, Post, Put, Delete, Patch,
  Body, Param, UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { ProjectsService } from './projects.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@ApiTags('🚀 Projects')
@Controller('projects')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Get()
  @ApiOperation({ summary: 'O\'z loyihalarini olish' })
  findAll(@CurrentUser() userId: string) {
    return this.projectsService.findAll(userId);
  }

  @Post()
  @ApiOperation({ summary: 'Yangi loyiha qo\'shish' })
  create(@CurrentUser() userId: string, @Body() dto: CreateProjectDto) {
    return this.projectsService.create(userId, dto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Loyihani tahrirlash' })
  update(
    @Param('id') id: string,
    @CurrentUser() userId: string,
    @Body() dto: Partial<CreateProjectDto>,
  ) {
    return this.projectsService.update(id, userId, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Loyihani o\'chirish' })
  remove(@Param('id') id: string, @CurrentUser() userId: string) {
    return this.projectsService.remove(id, userId);
  }

  @Patch('reorder')
  @ApiOperation({ summary: 'Loyihalar tartibini o\'zgartirish' })
  reorder(
    @CurrentUser() userId: string,
    @Body() body: { orderedIds: string[] },
  ) {
    return this.projectsService.reorder(userId, body.orderedIds);
  }
}