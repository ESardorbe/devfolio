import { IsString, MinLength, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ResetPasswordDto {
  @ApiProperty({ description: 'verifyResetOtp dan kelgan token' })
  @IsString()
  resetToken: string;
 
  @ApiProperty({ example: 'NewSecret123!' })
  @IsString()
  @MinLength(8)
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, {
    message: 'Parol katta, kichik harf va raqam o\'z ichiga olishi kerak',
  })
  newPassword: string;
}