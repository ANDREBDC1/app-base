import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './product.entity';
import { Batch } from './batch.entity';
import { CreateProductDto } from './dto/createProduts.dto';

@Injectable()
export class StockService {
  constructor(
    @InjectRepository(Product)
    private products: Repository<Product>,
    @InjectRepository(Batch)
    private batches: Repository<Batch>,
  ) {}

  async createProduct(dto: CreateProductDto) {
    const product = this.products.create({ ...dto, batches: [] });
    return this.products.save(product);
  }

  private async findProduct(id: string): Promise<Product | null> {
    return this.products.findOne({
      where: { id },
      relations: ['batches'],
    });
  }

  async addStock(productId: string, amount: number, expiryDate: Date) {
    const product = await this.findProduct(productId);
    if (!product) {
      throw new NotFoundException('Product not found');
    }

    if (amount <= 0) {
      throw new BadRequestException('Invalid amount');
    }

    const batch = this.batches.create({
      productId,
      quantity: amount,
      expiryDate,
    });

    await this.batches.save(batch);
    return { success: true };
  }

  async removeStock(productId: string, amount: number) {
    const product = await this.findProduct(productId);

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    const now = new Date();
    // Obter lotes válidos ordenados por data de validade (FEFO)
    const validBatches = await this.batches.find({
      where: {
        productId,
      },
      order: { expiryDate: 'ASC' },
    });

    // Filtrar apenas lotes válidos
    const activeBatches = validBatches.filter(
      (batch) => batch.expiryDate > now,
    );

    if (activeBatches.length === 0) {
      throw new BadRequestException('No valid stock available');
    }

    const totalStock = activeBatches.reduce((sum, batch) => sum + batch.quantity, 0);

    if (amount > totalStock) {
      throw new BadRequestException('Insufficient stock');
    }

    let remainingAmount = amount;

    // Remover estoque seguindo FEFO
    for (const batch of activeBatches) {
      if (remainingAmount <= 0) break;

      if (batch.quantity >= remainingAmount) {
        batch.quantity -= remainingAmount;
        remainingAmount = 0;
      } else {
        remainingAmount -= batch.quantity;
        batch.quantity = 0;
      }

      if (batch.quantity === 0) {
        await this.batches.remove(batch);
      } else {
        await this.batches.save(batch);
      }
    }

    return { success: true };
  }

  async getStock(productId: string): Promise<number> {
    const product = await this.findProduct(productId);
    if (!product) {
      throw new NotFoundException('Product not found');
    }

    const now = new Date();
    const validBatches = product.batches.filter(
      (batch) => batch.expiryDate > now,
    );

    return validBatches.reduce((sum, batch) => sum + batch.quantity, 0);
  }

  async getBatches(productId: string): Promise<Batch[]> {
    return this.batches.find({
      where: {
        productId,
      },
      order: { expiryDate: 'ASC' },
    });
  }

  async getProductById(productId: string): Promise<Product | null> {
    return this.findProduct(productId);
  }

  async updateProduct(product: Product): Promise<Product> {
    return this.products.save(product);
  }
}