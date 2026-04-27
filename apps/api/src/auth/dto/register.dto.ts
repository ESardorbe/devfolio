import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength, MaxLength, Matches, IsOptional } from 'class-validator';
 
export class RegisterDto {
  @ApiProperty({ example: 'john@example.com' })
  @IsEmail({}, { message: 'Email to\'g\'ri formatda bo\'lishi kerak' })
  email: string;
 
  @ApiProperty({ example: 'john_dev' })
  @IsString()
  @MinLength(3)
  @MaxLength(30)
  @Matches(/^[a-z0-9_-]+$/, {
    message: 'Username faqat kichik harf, raqam, _ va - bo\'lishi mumkin',
  })
  username: string;
 
  @ApiProperty({ example: 'Secret123!' })
  @IsString()
  @MinLength(8)
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, {
    message: 'Parol katta, kichik harf va raqam o\'z ichiga olishi kerak',
  })
  password: string;
 
  @ApiProperty({ example: 'John Doe', required: false })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  name?: string;
}