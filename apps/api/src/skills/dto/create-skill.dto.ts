import { IsEnum } from 'class-validator';
import { IsString, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';


enum SkillLevel {
  BEGINNER = 'BEGINNER',
  INTERMEDIATE = 'INTERMEDIATE',
  ADVANCED = 'ADVANCED',
  EXPERT = 'EXPERT',
}
 
export class CreateSkillDto {
  @ApiProperty({ example: 'TypeScript' })
  @IsString()
  name: string;
 
  @ApiProperty({ enum: SkillLevel, default: SkillLevel.INTERMEDIATE })
  @IsEnum(SkillLevel)
  level: SkillLevel;
 
  @ApiProperty({ example: 'Backend', required: false })
  @IsOptional()
  @IsString()
  category?: string;
}