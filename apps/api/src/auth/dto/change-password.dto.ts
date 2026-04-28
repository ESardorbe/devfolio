import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength, Matches } from 'class-validator';

export class ChangePasswordDto {
  @ApiProperty({ example: 'OldSecret123!' })
  @IsString()
  oldPassword: string;
 
  @ApiProperty({ example: 'NewSecret123!' })
  @IsString()
  @MinLength(8)
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, {
    message: 'Parol katta, kichik harf va raqam o\'z ichiga olishi kerak',
  })
  newPassword: string;
}