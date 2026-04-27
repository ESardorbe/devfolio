import { ApiProperty } from '@nestjs/swagger';
import { IsUrl, IsBoolean } from 'class-validator';
import { IsString, MaxLength, Matches, IsOptional } from 'class-validator';
 
export class UpdateProfileDto {
  @IsOptional() @IsString() @MaxLength(30)
  @Matches(/^[a-z0-9_-]+$/) username?: string;
 
  @IsOptional() @IsString() @MaxLength(100) name?: string;
  @IsOptional() @IsString() @MaxLength(200) headline?: string;
  @IsOptional() @IsString() @MaxLength(500) bio?: string;
  @IsOptional() @IsString() @MaxLength(100) location?: string;
  @IsOptional() @IsUrl() website?: string;
  @IsOptional() @IsUrl() github?: string;
  @IsOptional() @IsUrl() linkedin?: string;
  @IsOptional() @IsString() telegram?: string;
  @IsOptional() @IsString() twitter?: string;
  @IsOptional() @IsBoolean() isPublic?: boolean;
  @IsOptional() @IsBoolean() isOpenToWork?: boolean;
}