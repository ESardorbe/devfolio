import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEnum, IsOptional, IsInt, Min, MaxLength } from 'class-validator';

export enum SkillLevel {
  BEGINNER     = 'BEGINNER',
  INTERMEDIATE = 'INTERMEDIATE',
  ADVANCED     = 'ADVANCED',
  EXPERT       = 'EXPERT',
}

export class CreateSkillDto {
  @ApiProperty({
    example: 'TypeScript',
    description: 'Ko\'nikma nomi',
    maxLength: 50,
  })
  @IsString()
  @MaxLength(50)
  name: string;

  @ApiProperty({
    enum: SkillLevel,
    enumName: 'SkillLevel',
    default: SkillLevel.INTERMEDIATE,
    description: 'Ko\'nikma darajasi',
    example: SkillLevel.INTERMEDIATE,
  })
  @IsEnum(SkillLevel)
  level: SkillLevel;

  @ApiProperty({
    example: 'Backend',
    description: 'Ko\'nikma kategoriyasi (ixtiyoriy)',
    required: false,
    enum: ['Frontend', 'Backend', 'DevOps', 'Mobile', 'Database', 'Other'],
  })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  category?: string;

  @ApiProperty({
    example: 0,
    description: 'Ko\'rsatish tartibi (kichik son — oldin ko\'rsatiladi)',
    required: false,
    default: 0,
  })
  @IsOptional()
  @IsInt()
  @Min(0)
  order?: number;
}