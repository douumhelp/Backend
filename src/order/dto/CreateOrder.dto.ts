import { IsString, IsUUID, MaxLength, IsNumber, IsPositive, IsEnum } from 'class-validator';
import { OrderStatus } from '../order.entity'; 

export class CreateOrderDto {
  @IsString()
  @MaxLength(300)
  description: string;

  @IsNumber()
  @IsPositive()
  price: number;

  @IsUUID()
  userPFId: string;

  @IsUUID()
  userPJId: string;

  @IsUUID()
  categoryId: string;

  @IsEnum(OrderStatus)
  status: OrderStatus = OrderStatus.PENDING; 

  startTime?: Date;
}