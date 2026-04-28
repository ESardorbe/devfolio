import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, Length } from 'class-validator';
 
export class VerifyEmailDto {
  @ApiProperty({ example: 'john@example.com' })
  @IsEmail()
  email: string;
 
  @ApiProperty({ example: '847291', description: '6 raqamli OTP kod' })
  @IsString()
  @Length(6, 6, { message: 'Kod 6 ta raqamdan iborat bo\'lishi kerak' })
  code: string;
}