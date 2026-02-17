import { MigrationInterface, QueryRunner } from "typeorm";

export class InitSchema1770230967599 implements MigrationInterface {
    name = 'InitSchema1770230967599'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "users" ("id" varchar PRIMARY KEY NOT NULL, "email" varchar NOT NULL, "password" varchar NOT NULL, "isActive" boolean NOT NULL DEFAULT (1), "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"))`);
        await queryRunner.query(`CREATE TABLE "permissions" ("id" varchar PRIMARY KEY NOT NULL, "tipo" varchar NOT NULL, "descricao" varchar NOT NULL, "isActive" boolean NOT NULL DEFAULT (1), "userId" varchar NOT NULL)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "permissions"`);
        await queryRunner.query(`DROP TABLE "users"`);
    }

}
