import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IndustryChangeApplicationsService } from './industry-change-applications/industry-change-applications.service';
import { MigrationService } from './migration/migration.service';
import { Resident } from './entities/resident.entity';
import { IndustryChangeApplication } from './entities/industryChangeApplication.entity';
import * as dotenv from 'dotenv';
import { MigrationController } from './migration/migration.controller';
import { IndustryChangeApplicationsController } from './industry-change-applications/industry-change-applications.controller';

dotenv.config();

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT, 10),
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: [Resident, IndustryChangeApplication],
      synchronize: true,
    }),
  ],
  controllers: [AppController, IndustryChangeApplicationsController, MigrationController],
  providers: [AppService, MigrationService, IndustryChangeApplicationsService],
})
export class AppModule { }
