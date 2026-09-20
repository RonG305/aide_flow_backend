import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { TasksModule } from './tasks/tasks.module';
import { RemindersModule } from './reminders/reminders.module';

@Module({
  imports: [PrismaModule, AuthModule, TasksModule, RemindersModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
