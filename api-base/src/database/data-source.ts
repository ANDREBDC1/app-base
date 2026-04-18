import { DataSource, DataSourceOptions } from 'typeorm';
import { User } from '../user/user.entity';
import { Permission } from '../security/permission.entity';
import { Product } from '../stock/product.entity';
import { Batch } from '../stock/batch.entity';

const isProduction = (process.env.NODE_ENV || 'dev') === 'production';

// Array com todas as entidades
const entities = [User, Permission, Product, Batch];

// Usa sempre arquivos .js compilados para migrations
const migrations = ['dist/database/migrations/*.js'];

export const dataSourceOptions: DataSourceOptions = isProduction
  ? {
    type: "postgres",
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT ?? '5432'),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    synchronize: false,
    migrationsRun: false,
    entities,
    migrations,
    logging: true,
  }
  : {
    type: 'sqlite',
    database: 'database.sqlite',
    synchronize: true,
    migrationsRun: false,
    entities,
    migrations,
    logging: true,
  };

export const dataSource = new DataSource(dataSourceOptions);