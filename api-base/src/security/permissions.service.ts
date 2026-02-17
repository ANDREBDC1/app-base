import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { AllPermissions } from './allPermissions';
import { PermissionDto } from './dto/permisson.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Permission } from './permission.entity';
import { In, Repository } from 'typeorm';
import { User } from 'src/user/user.entity';

@Injectable()
export class PermissionsService {

    constructor(
        @InjectRepository(Permission)
        private readonly permissionRepository: Repository<Permission>,

        @InjectRepository(User)
        private readonly userRepository: Repository<User>,

    ) { }

    getPermissons() {
        return AllPermissions;
    }

    async create( dto: PermissionDto[]) {
        
        if (!dto || dto.length === 0) {
            throw new BadRequestException(
                'Lista de permissões vazia',
            );
        }

        const user = await this.userRepository.findOneBy({
            id: dto.filter(user => !!user.userId)[0].userId,
            isActive: true
        });

        if (!user) {
            throw new NotFoundException(
                'Usuário não encontrado',
            );
        }

        const permissionsDb = await this.permissionRepository.findBy({
            userId: user.id,
            tipo: In(dto.map(p => p.tipo))
        })

        const permissionsToAdd = dto.filter(p => !permissionsDb.map(p => p.tipo).includes(p.tipo))
        .map(p =>
            this.permissionRepository.create({
                userId: user.id,
                tipo: p.tipo,
                descricao: p.descricao,
                isActive: true,
            }),
        );

        return this.permissionRepository.save(permissionsToAdd);
    }

    async update(id: string, dto: PermissionDto) {

        const permission = await this.permissionRepository.findOne({
            where: { id: id },
        });

        if (!permission) {
            throw new NotFoundException('permissão não encontrado');
        }

        permission.isActive = dto.isActive;
        return await this.permissionRepository.save(permission);
    }

    async get(userId: string) {

        return await this.permissionRepository.find({
            where: { userId: userId },
        });
    }

    async validatePermissions(userId: string, requiredPermissions: string[]) {

        return await this.permissionRepository.count({
            where: {
                userId,
                tipo: In(requiredPermissions),
                isActive: true
            },
        });
    }


}
