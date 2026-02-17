import { IsOptional, IsNotEmpty } from 'class-validator';

export class PermissionDto {

    @IsNotEmpty()
    tipo: string;

    @IsOptional()
    descricao: string;

    @IsOptional()
    isActive: boolean;

    @IsOptional()
    userId: string;
}
