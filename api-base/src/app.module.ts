import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module'
import { PermissionsModule } from "./security/permissions.module"
import { UsersModule } from './user/user.module'
import { dataSourceOptions } from "./database/data-source"
import { StockModule } from './stock/stock.module';
import { UploadModule } from './upload/upload.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(dataSourceOptions),
    AuthModule,
    PermissionsModule,
    UsersModule,
    StockModule,
    UploadModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
