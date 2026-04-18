import { Controller, Post, Body, Get, Param, UseInterceptors, UploadedFile, NotFoundException, BadRequestException } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { StockService } from './stock.service';
import { UploadService } from '../upload/upload.service';
import { CreateProductDto } from './dto/createProduts.dto';
import { AddStockDto } from './dto/addStock.dto';
import { RemoveStockDto } from './dto/removeStock.dto';
import { Permissions } from '../security/permissions.decorator';
import { PermissionProductCreate, PermissionProductList, PermissionProductUpdate } from '../security/allPermissions';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { PermissionsGuard } from '../security/permissions.guard';

@Controller('stock')
export class StockController {
  constructor(
    private service: StockService,
    private uploadService: UploadService,
  ) {}

  @Post()
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permissions(PermissionProductCreate)
  create(@Body() dto: CreateProductDto) {
    return this.service.createProduct(dto);
  }

  @Post('add')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permissions(PermissionProductList)
  addStock(@Body() body: AddStockDto) {
    return this.service.addStock(
      body.productId,
      body.amount,
      new Date(body.expiryDate),
    );
  }

  @Post('remove')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permissions(PermissionProductList)
  removeStock(@Body() body: RemoveStockDto) {
    return this.service.removeStock(body.productId, body.amount);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permissions(PermissionProductList)
  async getStock(@Param('id') id: string) {
    const quantity = await this.service.getStock(id);
    return { quantity };
  }

  @Get(':id/batches')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permissions(PermissionProductList)
  getBatches(@Param('id') id: string) {
    return this.service.getBatches(id);
  }

  @Post(':id/image')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permissions(PermissionProductUpdate)
  @UseInterceptors(FileInterceptor('image'))
  async uploadProductImage(
    @Param('id') productId: string,
    @UploadedFile() file: any,
  ) {
    // Validar se produto existe
    const product = await this.service.getProductById(productId);
    if (!product) {
      throw new NotFoundException('Produto não encontrado');
    }

    // Deletar imagem anterior se existir
    if (product.imageUrl) {
      await this.uploadService.deleteImage(product.imageUrl);
    }

    // Upload da nova imagem
    const imageUrl = await this.uploadService.uploadImage(file, productId);

    // Atualizar produto com a nova URL
    product.imageUrl = imageUrl;
    await this.service.updateProduct(product);

    return {
      success: true,
      imageUrl,
      message: 'Imagem atualizada com sucesso',
    };
  }
}