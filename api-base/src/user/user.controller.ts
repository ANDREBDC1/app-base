import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  UseGuards,
} from '@nestjs/common';

import { UsersService } from './user.service';
import { UserDto }  from './dto/user.dto';
import { PermissionsGuard } from 'src/security/permissions.guard';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Permissions } from "../security/permissions.decorator"
import  { 
  PermissionAdmin,
  PermissionUserCreate,
  PermissionUserDelete,
  PermissionUserList,
  PermissionUserUpdate,
} from "../security/allPermissions"
import { CurrentUser } from './current-user.decorator';

@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @Permissions(PermissionAdmin, PermissionUserCreate)
  create(@Body() dto: UserDto) {
    return this.usersService.create(dto);
  }

  @Get()
  @Permissions(PermissionAdmin, PermissionUserList)
  async findAll(@CurrentUser() user) {
    return await this.usersService.findAll(user.id);
  }

  @Get(':id')
  @Permissions(PermissionAdmin, PermissionUserList)
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Put(':id')
  @Permissions(PermissionAdmin, PermissionUserUpdate)
  update(
    @Param('id') id: string,
    @Body() dto: UserDto,
  ) {
    return this.usersService.update(id, dto);
  }

  @Delete(':id')
  @Permissions(PermissionAdmin, PermissionUserDelete)
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}
