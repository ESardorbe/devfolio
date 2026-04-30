import { ApiProperty } from '@nestjs/swagger';
import {
  IsString, IsNotEmpty, MaxLength, IsOptional,
  IsBoolean, IsDateString, IsInt, Min,
} from 'class-validator';

export class CreateExperienceDto {
  @ApiProperty({ example: 'Uzum Bank' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  company: string;

  @ApiProperty({ example: 'Senior Backend Developer' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  position: string;

  @ApiProperty({ required: false, example: 'NestJS va PostgreSQL bilan backend qurdim' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ example: '2023-01-01' })
  @IsDateString()
  startDate: string;

  @ApiProperty({ required: false, example: '2024-12-31' })
  @IsOptional()
  @IsDateString()
  endDate?: string;

  @ApiProperty({ default: false })
  @IsOptional()
  @IsBoolean()
  isCurrent?: boolean;

  @ApiProperty({ required: false, example: 'Toshkent, O\'zbekiston' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  location?: string;

  @ApiProperty({ default: 0 })
  @IsOptional()
  @IsInt()
  @Min(0)
  order?: number;
}