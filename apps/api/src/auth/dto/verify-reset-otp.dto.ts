import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, Length } from 'class-validator';


export class VerifyResetOtpDto {
  @ApiProperty({ example: 'john@example.com' })
  @IsEmail()
  email: string;
 
  @ApiProperty({ example: '847291' })
  @IsString()
  @Length(6, 6)
  code: string;
}