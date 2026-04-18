import { Module } from '@nestjs/common';
import { StockService } from './stock.service';
import { StockController } from './stock.controller';
import { Product } from './product.entity';
import { Batch } from './batch.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PermissionsModule } from '../security/permissions.module';
import { UploadModule } from '../upload/upload.module';

@Module({
  imports: [TypeOrmModule.forFeature([Product, Batch]), PermissionsModule, UploadModule],
  providers: [StockService],
  controllers: [StockController]
})
export class StockModule {}
