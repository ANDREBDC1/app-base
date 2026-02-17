import { MigrationInterface, QueryRunner } from "typeorm";

import { User } from "../../user/user.entity";
import { Permission } from "../../security/permission.entity";
import { PermissionAdmin } from "../../security/allPermissions";
import { hash } from "../../commun/hashString";

export class CriarUserAdmin1770233924192 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        const email = process.env.ADM_EMAIL || "admin@teste.com"
        const passwordHash = await hash(process.env.ADM_PASSWORD || "admin");
        await queryRunner.manager.upsert<User>('users',
            {
                name: 'admin',
                email: email,
                password: passwordHash,
                isAdmin: true
            }, ["email"]);

        const user =  await queryRunner.manager.findOne<User>( 'users', {
            where: {
                email: email,
                isAdmin: true
            }
        })

        const permisionAdmin = await queryRunner.manager.count<Permission>( 'permissions', {
            where: {
                userId: user?.id
            }
        } )

        if(permisionAdmin > 0)
            return;

        await queryRunner.manager.insert<Permission>('permissions', {
            tipo: PermissionAdmin,
            descricao: PermissionAdmin,
            isActive: true,
            userId: user?.id
        })


    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }

}
