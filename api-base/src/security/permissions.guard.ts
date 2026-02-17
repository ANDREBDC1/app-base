import {Injectable, CanActivate, ExecutionContext, ForbiddenException, Logger} from "@nestjs/common"
import { Reflector } from "@nestjs/core"
import { PERMISSIONS_KEY } from "./permissions.decorator"
import { PermissionsService } from "./permissions.service";

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private readonly permisionsService: PermissionsService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
      const requiredPermissions =
        this.reflector.getAllAndOverride<string[]>(
          PERMISSIONS_KEY,
          [
            context.getHandler(),
            context.getClass(),
          ],
        );

      // Rota sem permissão definida → libera
      if (!requiredPermissions || requiredPermissions.length === 0) {
        return true;
      }
      
      const request = context.switchToHttp().getRequest();

      if(!request.user?.id){
        throw new ForbiddenException('acesso negado');
      }

  
      const userId = request.user.id;

      const countPermissions = await this.permisionsService.validatePermissions(userId, requiredPermissions);

      if (countPermissions > 0) {
        return true;
      }

      throw new ForbiddenException('acesso negado');
    
  }
}