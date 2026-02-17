import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class CriarCampoTabelaUser1770233924191 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {

        queryRunner.addColumns("users", [
            new TableColumn({
                name: 'isAdmin',
                type: 'boolean',
                isNullable: true,
                default: false
            }),
            new TableColumn({
                name: 'name',
                length: '100',
                type: 'varchar',
                isNullable: true,  // sempre criar um novo campo com esse cara true
            })
        ])
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
         await queryRunner.dropColumns('users', ["isAdmin", "name"]);
    }

}
