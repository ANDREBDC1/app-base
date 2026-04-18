import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Batch } from './batch.entity';

@Entity('products')
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  description: string;

  @Column('decimal', { precision: 10, scale: 2, default: 0 })
  price: number;

  @Column({ nullable: true })
  category: string;

  @Column({ nullable: true })
  imageUrl: string;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  @Column({ nullable: true })
  barcode: string;

  @Column({ nullable: true })
  qrCode: string;

  @OneToMany(() => Batch, (batch) => batch.product, {
    cascade: true,
    eager: true,
  })
  batches: Batch[];
}