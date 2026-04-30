import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { SkillsModule } from './skills/skills.module';
import { EmailModule } from './email/email.module';
import { ProjectsModule } from './projects/projects.module';
import { ExperiencesModule } from './experiences/experiences.module';
import { EducationsModule } from './educations/educations.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,  
    AuthModule,
    UsersModule,
    SkillsModule,
    EmailModule,
    ProjectsModule,
    ExperiencesModule,
    EducationsModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}