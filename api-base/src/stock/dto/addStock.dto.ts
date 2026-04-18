import { IsNotEmpty, IsDateString, IsInt, Min } from 'class-validator';

export class AddStockDto {
  @IsNotEmpty()
  productId: string;

  @IsInt()
  @Min(1, { message: 'Amount must be at least 1' })
  @IsNotEmpty()
  amount: number;

  @IsDateString()
  @IsNotEmpty()
  expiryDate: string;
}
