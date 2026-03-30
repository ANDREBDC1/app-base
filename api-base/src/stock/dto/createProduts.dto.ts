import { IsOptional, IsNotEmpty, IsInt, Min } from 'class-validator';
export class CreateProductDto {

    @IsNotEmpty()
    name: string;

    @IsOptional()
    description: string;

    @Min(0, { message: 'Quantity must be a non-negative integer' })
    @IsNotEmpty()
    price: number;

    @IsOptional()
    category: string;

    @IsOptional()
    imageUrl: string;

    @IsOptional()
    barcode: string;

    @IsOptional()
    qrCode: string;

    @Min(0, { message: 'Quantity must be a non-negative integer' })
    @IsInt({ message: 'Quantity must be an integer' })
    @IsOptional()
    quantity: number;
}