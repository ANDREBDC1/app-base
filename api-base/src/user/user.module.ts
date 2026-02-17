import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PermissionsModule } from '../security/permissions.module';
import { User } from './user.entity';
import { UsersService } from './user.service';
import { UsersController } from './user.controller';



@Module({
  imports: [TypeOrmModule.forFeature([User]), PermissionsModule],
  providers: [UsersService],
  exports: [UsersService],
  controllers: [UsersController]
})
export class UsersModule {}
