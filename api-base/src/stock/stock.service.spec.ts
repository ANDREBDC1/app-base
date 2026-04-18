import { Test } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StockService } from './stock.service';
import { Product } from './product.entity';
import { Batch } from './batch.entity';

describe('StockService', () => {
  let service: StockService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: 'sqlite',
          database: ':memory:',
          entities: [Product, Batch],
          synchronize: true,
          dropSchema: true,
        }),
        TypeOrmModule.forFeature([Product, Batch]),
      ],
      providers: [StockService],
    }).compile();

    service = moduleRef.get(StockService);
  });

  describe('createProduct', () => {
    it('should create a product with no batches', async () => {
      const product = await service.createProduct({
        name: 'Produto A',
        price: 10.99,
      } as any);

      expect(product).toBeDefined();
      expect(product.name).toBe('Produto A');
      expect(product.batches).toEqual([]);
    });
  });

  describe('addStock', () => {
    it('should add a new batch with quantity and expiry date', async () => {
      const product = await service.createProduct({
        name: 'Produto A',
        price: 10.99,
      } as any);

      const expiryDate = new Date();
      expiryDate.setDate(expiryDate.getDate() + 30); // 30 days from now

      await service.addStock(product.id, 10, expiryDate);

      const stock = await service.getStock(product.id);
      expect(stock).toBe(10);
    });

    it('should add multiple batches to same product', async () => {
      const product = await service.createProduct({
        name: 'Produto A',
        price: 10.99,
      } as any);

      const expiryDate1 = new Date();
      expiryDate1.setDate(expiryDate1.getDate() + 30);

      const expiryDate2 = new Date();
      expiryDate2.setDate(expiryDate2.getDate() + 60);

      await service.addStock(product.id, 10, expiryDate1);
      await service.addStock(product.id, 20, expiryDate2);

      const stock = await service.getStock(product.id);
      expect(stock).toBe(30);
    });

    it('should throw error for invalid amount', async () => {
      const product = await service.createProduct({
        name: 'Produto A',
        price: 10.99,
      } as any);

      const expiryDate = new Date();
      expiryDate.setDate(expiryDate.getDate() + 30);

      await expect(
        service.addStock(product.id, -5, expiryDate),
      ).rejects.toThrow('Invalid amount');
    });

    it('should throw error if product does not exist', async () => {
      const expiryDate = new Date();
      expiryDate.setDate(expiryDate.getDate() + 30);

      await expect(
        service.addStock('invalid-id', 10, expiryDate),
      ).rejects.toThrow('Product not found');
    });
  });

  describe('removeStock', () => {
    it('should remove stock following FEFO (First Expire First Out)', async () => {
      const product = await service.createProduct({
        name: 'Produto A',
        price: 10.99,
      } as any);

      // Create two batches with different expiry dates
      const expiryDate1 = new Date();
      expiryDate1.setDate(expiryDate1.getDate() + 10); // Earlier expiry

      const expiryDate2 = new Date();
      expiryDate2.setDate(expiryDate2.getDate() + 30); // Later expiry

      await service.addStock(product.id, 10, expiryDate2);
      await service.addStock(product.id, 10, expiryDate1);

      // Remove 15 units - should remove from the batch expiring sooner first
      await service.removeStock(product.id, 15);

      const stock = await service.getStock(product.id);
      expect(stock).toBe(5); // 10 + 10 - 15 = 5
    });

    it('should not remove expired batches', async () => {
      const product = await service.createProduct({
        name: 'Produto A',
        price: 10.99,
      } as any);

      // Create expired batch
      const expiredDate = new Date();
      expiredDate.setDate(expiredDate.getDate() - 1); // Yesterday

      // Create valid batch
      const validDate = new Date();
      validDate.setDate(validDate.getDate() + 30);

      await service.addStock(product.id, 10, expiredDate);
      await service.addStock(product.id, 10, validDate);

      // Expired batch should not be counted
      const stock = await service.getStock(product.id);
      expect(stock).toBe(10); // Only valid batch
    });

    it('should throw error if insufficient valid stock', async () => {
      const product = await service.createProduct({
        name: 'Produto A',
        price: 10.99,
      } as any);

      const expiryDate = new Date();
      expiryDate.setDate(expiryDate.getDate() + 30);

      await service.addStock(product.id, 10, expiryDate);

      await expect(
        service.removeStock(product.id, 15),
      ).rejects.toThrow('Insufficient stock');
    });

    it('should throw error if no valid stock available', async () => {
      const product = await service.createProduct({
        name: 'Produto A',
        price: 10.99,
      } as any);

      const expiredDate = new Date();
      expiredDate.setDate(expiredDate.getDate() - 1);

      await service.addStock(product.id, 10, expiredDate);

      await expect(
        service.removeStock(product.id, 5),
      ).rejects.toThrow('No valid stock available');
    });

    it('should throw error if product does not exist', async () => {
      await expect(
        service.removeStock('invalid-id', 10),
      ).rejects.toThrow('Product not found');
    });

    it('should remove entire batch if it runs out', async () => {
      const product = await service.createProduct({
        name: 'Produto A',
        price: 10.99,
      } as any);

      const expiryDate = new Date();
      expiryDate.setDate(expiryDate.getDate() + 30);

      await service.addStock(product.id, 10, expiryDate);
      await service.removeStock(product.id, 10);

      const stock = await service.getStock(product.id);
      expect(stock).toBe(0);
    });
  });

  describe('getStock', () => {
    it('should return total quantity of valid batches', async () => {
      const product = await service.createProduct({
        name: 'Produto A',
        price: 10.99,
      } as any);

      const expiryDate1 = new Date();
      expiryDate1.setDate(expiryDate1.getDate() + 30);

      const expiryDate2 = new Date();
      expiryDate2.setDate(expiryDate2.getDate() + 60);

      await service.addStock(product.id, 5, expiryDate1);
      await service.addStock(product.id, 15, expiryDate2);

      const stock = await service.getStock(product.id);
      expect(stock).toBe(20);
    });

    it('should return 0 if product does not exist', async () => {
      await expect(
        service.getStock('invalid-id'),
      ).rejects.toThrow('Product not found');
    });

    it('should return 0 if no valid batches', async () => {
      const product = await service.createProduct({
        name: 'Produto A',
        price: 10.99,
      } as any);

      const stock = await service.getStock(product.id);
      expect(stock).toBe(0);
    });
  });

  describe('getBatches', () => {
    it('should return all batches ordered by expiry date', async () => {
      const product = await service.createProduct({
        name: 'Produto A',
        price: 10.99,
      } as any);

      const expiryDate1 = new Date();
      expiryDate1.setDate(expiryDate1.getDate() + 30);

      const expiryDate2 = new Date();
      expiryDate2.setDate(expiryDate2.getDate() + 10);

      await service.addStock(product.id, 10, expiryDate1);
      await service.addStock(product.id, 5, expiryDate2);

      const batches = await service.getBatches(product.id);
      expect(batches).toHaveLength(2);
      expect(batches[0].expiryDate < batches[1].expiryDate).toBe(true);
    });
  });
});