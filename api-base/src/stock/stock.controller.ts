import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { StockService } from './stock.service';
import { CreateProductDto } from './dto/createProduts.dto';
import { Permissions } from '../security/permissions.decorator';
import { PermissionProductCreate, PermissionProductList } from '../security/allPermissions';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { PermissionsGuard } from '../security/permissions.guard';

@Controller('stock')
export class StockController {
  constructor(private service: StockService) {}

  @Post()
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permissions(PermissionProductCreate)
  create(@Body() dto: CreateProductDto) {
    return this.service.createProduct(dto);
  }

  @Post('add')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permissions(PermissionProductList)
  addStock(@Body() body:  { productId: string; amount: number }) {
    return this.service.addStock(body.productId, body.amount);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permissions(PermissionProductList)
  getStock(@Param('id') id: string) {
    return this.service.getStock(id);
  }
}