import { Module } from '@nestjs/common';
import { StockService } from './stock.service';
import { StockController } from './stock.controller';
import { Product } from './product.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PermissionsModule } from '../security/permissions.module';

@Module({
  imports: [TypeOrmModule.forFeature([Product]), PermissionsModule],
  providers: [StockService],
  controllers: [StockController]
})
export class StockModule {}
