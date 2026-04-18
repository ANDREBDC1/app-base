import { MigrationInterface, QueryRunner, Table, TableForeignKey, TableColumn } from 'typeorm';

export class CreateBatchesTable1774923456789 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'batches',
        columns: [
          {
            name: 'id',
            type: 'varchar',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid()',
          },
          {
            name: 'productId',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'quantity',
            type: 'int',
            isNullable: false,
          },
          {
            name: 'expiryDate',
            type: 'datetime',
            isNullable: false,
          },
          {
            name: 'createdAt',
            type: 'datetime',
            default: 'CURRENT_TIMESTAMP',
          },
        ],
      }),
      true,
    );

    await queryRunner.createForeignKey(
      'batches',
      new TableForeignKey({
        columnNames: ['productId'],
        referencedTableName: 'products',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
      }),
    );

    // Remove quantity column from products table (it's now calculated from batches)
    if (
      (await queryRunner.hasColumn('products', 'quantity'))
    ) {
      await queryRunner.dropColumn('products', 'quantity');
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Add back the quantity column
    await queryRunner.addColumn(
      'products',
      new TableColumn({
        name: 'quantity',
        type: 'int',
        default: 0,
      }),
    );

    // Drop foreign key and table
    const table = await queryRunner.getTable('batches');
    const foreignKey = table.foreignKeys.find(
      (fk) => fk.columnNames.indexOf('productId') !== -1,
    );
    if (foreignKey) {
      await queryRunner.dropForeignKey('batches', foreignKey);
    }

    await queryRunner.dropTable('batches', true);
  }
}
