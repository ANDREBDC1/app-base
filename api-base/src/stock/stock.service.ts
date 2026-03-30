import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './product.entity';
import { CreateProductDto } from './dto/CreateProduts.dto';


@Injectable()
export class StockService {
 constructor(
    @InjectRepository(Product)
    private products: Repository<Product>,
  ) {}

  async createProduct(dto: CreateProductDto) {
    const product = this.products.create({ ...dto, quantity: 0 });
    return this.products.save(product);
  }

  private async findProduct(id: string): Promise<Product | null> {
    return this.products.findOneBy({ id });
  }

  async addStock(productId: string, amount: number) {
    const product = await this.findProduct(productId);
    if (!product) {
      throw new Error('Product not found');
    }
    product.quantity += amount;
    await this.products.save(product);
  }

  async removeStock(productId: string, amount: number) {
    const product = await this.findProduct(productId);
    
    if (!product) {
      throw new Error('Product not found');
    }

    if (amount > product.quantity) {
        console.error(`Attempt to remove ${amount} from product ${productId} with only ${product.quantity} in stock`);
      throw new Error('Insufficient stock');
    }

    product.quantity -= amount;
    await this.products.save(product);
  }

  async getStock(productId: string): Promise<number> {
    const product = await this.findProduct(productId);
    if (!product) {
      throw new Error('Product not found');
    }
    return product.quantity;
  }
}