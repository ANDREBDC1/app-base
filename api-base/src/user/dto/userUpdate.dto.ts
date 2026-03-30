import { IsEmail, IsOptional, IsString, MinLength, IsNotEmpty } from 'class-validator';
import { PermissionDto } from '../../security/dto/permisson.dto';

export class UserUpdateDto {
    
    @IsNotEmpty()
    name: string

    @IsEmail()
    email?: string;
    
    @IsOptional()
    password: string;

    @IsOptional()
    isActive?: boolean;
    
    @IsOptional()
    permissions: PermissionDto[]
}
