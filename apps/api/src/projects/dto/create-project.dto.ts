import { ApiProperty } from '@nestjs/swagger';
import {
  IsString, IsNotEmpty, MaxLength, IsArray,
  IsOptional, IsUrl, IsBoolean, IsInt, Min,
} from 'class-validator';

export class CreateProjectDto {
  @ApiProperty({ example: 'DevFolio Platform' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  title: string;

  @ApiProperty({ example: 'IT mutaxassislari uchun portfolio platforma' })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ example: ['NestJS', 'React', 'PostgreSQL'] })
  @IsArray()
  @IsString({ each: true })
  techs: string[];

  @ApiProperty({ required: false, example: 'https://github.com/user/repo' })
  @IsOptional()
  @IsUrl()
  github?: string;

  @ApiProperty({ required: false, example: 'https://devfolio.uz' })
  @IsOptional()
  @IsUrl()
  demo?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  image?: string;

  @ApiProperty({ default: false })
  @IsOptional()
  @IsBoolean()
  featured?: boolean;

  @ApiProperty({ default: 0 })
  @IsOptional()
  @IsInt()
  @Min(0)
  order?: number;
}