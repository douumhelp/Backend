import { IsString, IsDecimal, IsUUID, IsEnum, MaxLength } from 'class-validator';

export class CreateOrderDto {
  @IsString()
  @MaxLength(300)
  description: string;

  @IsDecimal()
  price: number;

  @IsUUID()
  userPFId: string;

  @IsUUID()
  userPJId: string;

  @IsUUID()
  categoryId: string;
}
