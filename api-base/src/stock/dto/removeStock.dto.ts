import { IsNotEmpty, IsInt, Min } from 'class-validator';

export class RemoveStockDto {
  @IsNotEmpty()
  productId: string;

  @IsInt()
  @Min(1, { message: 'Amount must be at least 1' })
  @IsNotEmpty()
  amount: number;
}
