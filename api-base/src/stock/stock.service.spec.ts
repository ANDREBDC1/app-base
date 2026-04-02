import { Test } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StockService } from './stock.service';
import { Product } from './product.entity';

describe('StockService', () => {
  let service: StockService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: 'sqlite',
          database: ':memory:',
          entities: [Product],
          synchronize: true, // cria schema automático
          dropSchema: true, // limpa o banco a cada teste
        }),
        TypeOrmModule.forFeature([Product]),
      ],
      providers: [
        StockService,
      ],
    }).compile();

    service = moduleRef.get(StockService);
  });

  it('should add stock to a product', async () => {
    const product = await service.createProduct({ name: 'Produto A', price: 10.99 } as any);

    await service.addStock(product.id, 10);

    expect(service.getStock(product.id)).resolves.toBe(10);
  });

  it('should remove stock from a product', async () => {
    
    const product = await service.createProduct({name: 'Produto A', price: 10.99} as any);
    await service.addStock(product.id, 10);

    await service.removeStock(product.id, 4);

    expect(service.getStock(product.id)).resolves.toBe(6);
  });

  it('should not allow negative stock', async () => {
    const product = await service.createProduct({ name: 'Produto A', price: 10.99 } as any);

    expect(() => service.removeStock(product.id, 15)).rejects.toThrow(
      'Insufficient stock',
    );
  });

  it('should throw if product does not exist', async () => {
    expect(() => service.addStock('invalid-id', 10)).rejects.toThrow(
      'Product not found',
    );
  });

});