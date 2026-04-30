// dto/create-education.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import {
  IsString, IsNotEmpty, MaxLength, IsOptional,
  IsBoolean, IsDateString, IsInt, Min,
} from 'class-validator';

export class CreateEducationDto {
  @ApiProperty({ example: 'Toshkent Axborot Texnologiyalari Universiteti' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  institution: string;

  @ApiProperty({ example: 'Bakalavr' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  degree: string;

  @ApiProperty({ example: 'Dasturiy injiniring' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  field: string;

  @ApiProperty({ example: '2020-09-01' })
  @IsDateString()
  startDate: string;

  @ApiProperty({ required: false, example: '2024-06-30' })
  @IsOptional()
  @IsDateString()
  endDate?: string;

  @ApiProperty({ default: false })
  @IsOptional()
  @IsBoolean()
  isCurrent?: boolean;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ default: 0 })
  @IsOptional()
  @IsInt()
  @Min(0)
  order?: number;
}