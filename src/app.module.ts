import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './api/auth/auth.module';

const dbUrl = process.env.DATABASE_URL;
const ssl = dbUrl.includes('localhost') ? false : { rejectUnauthorized: false };

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: dbUrl,
      entities: ['dist/**/*.entity{.ts,.js}'],
      synchronize: true,
      migrationsRun: true,
      ssl: ssl,
    }),
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
