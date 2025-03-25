import { Module } from '@nestjs/common';
import { MaintenanceService } from './maintenance.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [PrismaModule, UsersModule],
  providers: [MaintenanceService],
  exports: [MaintenanceService],
})
export class MaintenanceModule {}
