import { Controller, Get, Put, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // GET /users/me — o'z to'liq profili
  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'O\'z to\'liq profilini olish' })
  getMyProfile(@CurrentUser() userId: string) {
    return this.usersService.getMyProfile(userId);
  }

  // GET /users/:username — public profil
  @Get(':username')
  @ApiOperation({ summary: 'Public profil ko\'rish (/u/username)' })
  getPublicProfile(@Param('username') username: string) {
    return this.usersService.getPublicProfile(username);
  }

  // PUT /users/me — profilni yangilash
  @Put('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Profilni yangilash' })
  updateProfile(
    @CurrentUser() userId: string,
    @Body() dto: UpdateProfileDto,
  ) {
    return this.usersService.updateProfile(userId, dto);
  }

  // GET /users/me/views — profil ko'rishlar statistikasi
  @Get('me/views')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Profil ko\'rishlar statistikasi' })
  getViews(@CurrentUser() userId: string) {
    return this.usersService.getProfileViews(userId);
  }
}