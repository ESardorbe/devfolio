import { IsString, IsOptional, IsISO8601, MaxLength, IsUrl } from 'class-validator';

export class CreateCertificateDto {
  @IsString() @MaxLength(200) title: string;
  @IsOptional() @IsString() @MaxLength(200) issuer?: string;
  @IsOptional() @IsISO8601() issueDate?: string;
  @IsOptional() @IsISO8601() expiryDate?: string;
  @IsOptional() @IsUrl() url?: string;
}
