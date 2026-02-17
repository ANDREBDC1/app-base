import { IsEmail, IsOptional, IsString, MinLength, IsNotEmpty } from 'class-validator';
import { PermissionDto } from 'src/security/dto/permisson.dto';

export class UserDto {
    
    @IsNotEmpty()
    name: string

    @IsEmail()
    email?: string;
    
    @MinLength(6)
    password: string;

    @IsOptional()
    isActive?: boolean;
    
    @IsOptional()
    permissions: PermissionDto[]
}
