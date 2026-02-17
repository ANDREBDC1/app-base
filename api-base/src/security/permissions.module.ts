import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Permission } from './permission.entity';
import { PermissionsGuard } from './permissions.guard';
import { PermissionsController } from './permissions.controller';
import { PermissionsService } from './permissions.service';
import { User  } from '../user/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Permission, User])],
  providers: [PermissionsGuard, PermissionsService],
  exports: [PermissionsGuard, PermissionsService],
  controllers: [PermissionsController]
})
export class PermissionsModule {}
