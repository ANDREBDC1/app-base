import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from '../src/app.module';
import { DataSource } from 'typeorm';
import { User } from '../src/user/user.entity';
import { hash } from '../src/commun/hashString';

// Mock do Cloudinary
jest.mock('cloudinary', () => ({
  v2: {
    config: jest.fn(),
    uploader: {
      upload_stream: jest.fn((options, callback) => {
        return {
          end: jest.fn((buffer) => {
            // Simular sucesso do upload
            callback(null, {
              secure_url: 'https://res.cloudinary.com/test/image/upload/v1234567890/test.png',
              public_id: 'test/image',
            });
          }),
        };
      }),
      destroy: jest.fn(() => Promise.resolve()),
    },
  },
}));

describe('StockController (e2e)', () => {
  let app: INestApplication<App>;
  let token: string;
  let productId: string;

  beforeAll(async () => {
    process.env.JWT_SECRET = 'test-secret';
    process.env.ADM_EMAIL = 'admin@teste.com';
    process.env.ADM_PASSWORD = 'admin';
    process.env.CLOUDINARY_CLOUD_NAME = 'test-cloud';
    process.env.CLOUDINARY_API_KEY = 'test-key';
    process.env.CLOUDINARY_API_SECRET = 'test-secret';

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    // Ensure admin user exists
    const dataSource = app.get(DataSource);
    const userRepo = dataSource.getRepository(User);
    const existingUser = await userRepo.findOneBy({ email: 'admin@teste.com' });
    if (!existingUser) {
      const hashedPassword = await hash('admin');
      await userRepo.save({
        name: 'admin',
        email: 'admin@teste.com',
        password: hashedPassword,
        isAdmin: true,
        
      });
    }

    // Login to get token
    const loginResponse = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        email: 'admin@teste.com',
        password: 'admin',
      })
      .expect(201);

    token = loginResponse.body.access_token;
  });

  afterAll(async () => {
    await app.close();
  });

  describe('Product Management with Batches', () => {
    it('should create a product', async () => {
      const createProductDto = {
        name: 'Test Product',
        description: 'A test product',
        price: 10.99,
      };

      const response = await request(app.getHttpServer())
        .post('/stock')
        .set('Authorization', `Bearer ${token}`)
        .send(createProductDto)
        .expect(201);

      productId = response.body.id;
      expect(response.body).toHaveProperty('id');
      expect(response.body.name).toBe(createProductDto.name);
      expect(response.body.batches).toEqual([]);
    });

    it('should add stock with expiry date (create batch)', async () => {
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 30);

      const addStockDto = {
        productId: productId,
        amount: 50,
        expiryDate: futureDate.toISOString(),
      };

      await request(app.getHttpServer())
        .post('/stock/add')
        .set('Authorization', `Bearer ${token}`)
        .send(addStockDto)
        .expect(201);
    });

    it('should get total valid stock', async () => {
      const response = await request(app.getHttpServer())
        .get(`/stock/${productId}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(response.body.quantity).toBe(50);
    });

    it('should add multiple batches with different expiry dates', async () => {
      const futureDate1 = new Date();
      futureDate1.setDate(futureDate1.getDate() + 15);

      const futureDate2 = new Date();
      futureDate2.setDate(futureDate2.getDate() + 45);

      // Add first batch
      await request(app.getHttpServer())
        .post('/stock/add')
        .set('Authorization', `Bearer ${token}`)
        .send({
          productId: productId,
          amount: 30,
          expiryDate: futureDate1.toISOString(),
        })
        .expect(201);

      // Add second batch
      await request(app.getHttpServer())
        .post('/stock/add')
        .set('Authorization', `Bearer ${token}`)
        .send({
          productId: productId,
          amount: 20,
          expiryDate: futureDate2.toISOString(),
        })
        .expect(201);

      // Total should be 50 + 30 + 20 = 100
      const response = await request(app.getHttpServer())
        .get(`/stock/${productId}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(response.body.quantity).toBe(100);
    });

    it('should list all batches ordered by expiry date', async () => {
      const response = await request(app.getHttpServer())
        .get(`/stock/${productId}/batches`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);

      // Verify batches are ordered by expiry date (FEFO)
      for (let i = 0; i < response.body.length - 1; i++) {
        expect(
          new Date(response.body[i].expiryDate).getTime() <=
            new Date(response.body[i + 1].expiryDate).getTime(),
        ).toBe(true);
      }
    });

    it('should remove stock following FEFO (First Expire First Out)', async () => {
      // Current state: 100 units (50 from batch 1, 30 from batch 2-expiring sooner, 20 from batch 3)
      // Remove 40 units - should remove from batch 2 first (earlier expiry)

      await request(app.getHttpServer())
        .post('/stock/remove')
        .set('Authorization', `Bearer ${token}`)
        .send({
          productId: productId,
          amount: 40,
        })
        .expect(201);

      const response = await request(app.getHttpServer())
        .get(`/stock/${productId}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      // Should have 100 - 40 = 60 remaining
      expect(response.body.quantity).toBe(60);
    });

    it('should throw error when trying to remove more than available', async () => {
      await request(app.getHttpServer())
        .post('/stock/remove')
        .set('Authorization', `Bearer ${token}`)
        .send({
          productId: productId,
          amount: 1000,
        })
        .expect(400);
    });

    it('should not count expired batches in total stock', async () => {
      // Create a new product for this test
      const createProductDto = {
        name: 'Product with Expired Batch',
        description: 'Test expired batches',
        price: 5.99,
      };

      const createResponse = await request(app.getHttpServer())
        .post('/stock')
        .set('Authorization', `Bearer ${token}`)
        .send(createProductDto)
        .expect(201);

      const testProductId = createResponse.body.id;

      // Add expired batch
      const expiredDate = new Date();
      expiredDate.setDate(expiredDate.getDate() - 1); // Yesterday

      await request(app.getHttpServer())
        .post('/stock/add')
        .set('Authorization', `Bearer ${token}`)
        .send({
          productId: testProductId,
          amount: 100,
          expiryDate: expiredDate.toISOString(),
        })
        .expect(201);

      // Add valid batch
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 30);

      await request(app.getHttpServer())
        .post('/stock/add')
        .set('Authorization', `Bearer ${token}`)
        .send({
          productId: testProductId,
          amount: 50,
          expiryDate: futureDate.toISOString(),
        })
        .expect(201);

      // Total should only count valid batch (50, not 150)
      const response = await request(app.getHttpServer())
        .get(`/stock/${testProductId}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(response.body.quantity).toBe(50);
    });

    // Image Upload Tests
    describe('Product Image Upload', () => {
      let productWithoutImageId: string;

      beforeEach(async () => {
        // Create a product for image upload tests
        const createProductDto = {
          name: 'Product for Image Upload',
          description: 'Test product for image upload',
          price: 15.99,
        };

        const createResponse = await request(app.getHttpServer())
          .post('/stock')
          .set('Authorization', `Bearer ${token}`)
          .send(createProductDto)
          .expect(201);

        productWithoutImageId = createResponse.body.id;
      });

      it('should upload image successfully', async () => {
        const fs = require('fs');
        const path = require('path');

        // Create a dummy image file (1x1 pixel PNG)
        const dummyImageBuffer = Buffer.from([
          0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0x00, 0x00, 0x00, 0x0d, 0x49, 0x48, 0x44, 0x52,
          0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x01, 0x08, 0x02, 0x00, 0x00, 0x00, 0x90, 0x77, 0x53,
          0xde, 0x00, 0x00, 0x00, 0x0c, 0x49, 0x44, 0x41, 0x54, 0x08, 0x99, 0x63, 0x00, 0x01, 0x00, 0x00,
          0x05, 0x00, 0x01, 0x0d, 0x0a, 0x2d, 0xb4, 0x00, 0x00, 0x00, 0x00, 0x49, 0x45, 0x4e, 0x44, 0xae,
          0x42, 0x60, 0x82,
        ]);

        const response = await request(app.getHttpServer())
          .post(`/stock/${productWithoutImageId}/image`)
          .set('Authorization', `Bearer ${token}`)
          .attach('image', dummyImageBuffer, 'test-image.png')
          .expect(201);

        expect(response.body).toHaveProperty('success', true);
        expect(response.body).toHaveProperty('imageUrl');
        expect(response.body.imageUrl).toContain('cloudinary');
        expect(response.body.message).toBe('Imagem atualizada com sucesso');
      });

      it('should reject file without image', async () => {
        await request(app.getHttpServer())
          .post(`/stock/${productWithoutImageId}/image`)
          .set('Authorization', `Bearer ${token}`)
          .expect(400);
      });

      it('should reject invalid file type', async () => {
        const response = await request(app.getHttpServer())
          .post(`/stock/${productWithoutImageId}/image`)
          .set('Authorization', `Bearer ${token}`)
          .attach('image', Buffer.from('invalid content'), 'test.txt')
          .expect(400);

        expect(response.body.message).toContain('inválido');
      });

      it('should require authentication', async () => {
        const dummyImageBuffer = Buffer.from([
          0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0x00, 0x00, 0x00, 0x0d, 0x49, 0x48, 0x44, 0x52,
        ]);

        await request(app.getHttpServer())
          .post(`/stock/${productWithoutImageId}/image`)
          .attach('image', dummyImageBuffer, 'test.png')
          .expect(401);
      });

      it('should return 404 for non-existent product', async () => {
        const dummyImageBuffer = Buffer.from([
          0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0x00, 0x00, 0x00, 0x0d, 0x49, 0x48, 0x44, 0x52,
        ]);

        await request(app.getHttpServer())
          .post(`/stock/non-existent-id/image`)
          .set('Authorization', `Bearer ${token}`)
          .attach('image', dummyImageBuffer, 'test.png')
          .expect(404);
      });
    });
  });
});