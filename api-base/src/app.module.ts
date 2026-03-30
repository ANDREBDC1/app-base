import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module'
import { PermissionsModule } from "./security/permissions.module"
import { UsersModule } from './user/user.module'
import { dataSourceOptions } from "./database/data-source"
import { StockModule } from './stock/stock.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(dataSourceOptions),
    AuthModule,
    PermissionsModule,
    UsersModule,
    StockModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
