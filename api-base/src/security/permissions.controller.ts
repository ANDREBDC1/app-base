import { Body, Controller, Get, Param, Post, Put, UseGuards, HttpCode, HttpStatus } from '@nestjs/common';
import { PermissionsService } from './permissions.service';
import { PermissionsGuard } from './permissions.guard';
import { Permissions } from "./permissions.decorator"
import { PermissionDto } from './dto/permisson.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { 
    PermissionAdmin,
    PermissionUserCreate 
} from "./allPermissions"


@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('permissions')
export class PermissionsController {
    constructor(
        private readonly permissionsService: PermissionsService
    ) { }

    @Permissions(PermissionAdmin, PermissionUserCreate)
    @Get()
    getAll() {
        return this.permissionsService.getPermissons();
    }

    @Permissions(PermissionAdmin)
    @Get(":userId")
    get( @Param('userId') userId: string,) {
        return this.permissionsService.get(userId);
    }

    @Permissions(PermissionAdmin)
    @Post()
    @HttpCode(HttpStatus.CREATED)
    Create(@Body() dto: PermissionDto[]) {
        return this.permissionsService.create(dto);
    }

    @HttpCode(HttpStatus.OK)
    @Permissions(PermissionAdmin)
    @Put(':userId')
    update(
        @Param('userId') userId: string,
        @Body() dto: PermissionDto,
    ) {
        return this.permissionsService.update(userId, dto);
    }


}
