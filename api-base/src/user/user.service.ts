import {
  Injectable,
  NotFoundException
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Not } from 'typeorm';

import { User } from './user.entity';
import { UserDto } from './dto/user.dto';
import { PermissionsService } from 'src/security/permissions.service';
import { hash } from '../commun/hashString';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly permissionsService: PermissionsService
  ) {}

  async create(dto: UserDto) {
    const passwordHash = await hash(dto.password);

    const user = this.userRepository.create({
      name: dto.name,
      email: dto.email,
      password: passwordHash,
    });

    const newUser  = await this.userRepository.save(user)

    if(dto.permissions.length > 0){
        const permisionsDto = dto.permissions.map(permisssao => {
          permisssao.userId =  newUser.id
          return permisssao;
        })
       await this.permissionsService.create(permisionsDto)
    }
  
    return newUser;
  }

  async findAll(userIdCurrent: string) {
    return await this.userRepository.find({
      where:{
        isAdmin: false,
        id: Not(userIdCurrent)
      }
    });
  }

  async findOne(id: string) {
    const user = await this.userRepository.findOne({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }

    const { password, ...result } = user;
    return result;
  }

  async update(id: string, dto: UserDto) {
    const user = await this.userRepository.findOne({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }

    if (dto.password) {
      dto.password = await hash(dto.password);
    }

    Object.assign(user, dto);
    return await this.userRepository.save(user);
  }

  async remove(id: string) {
    const user = await this.userRepository.findOne({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }

    await this.userRepository.remove(user);

    return { message: 'Usuário removido com sucesso' };
  }
}