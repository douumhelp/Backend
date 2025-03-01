import { IsEnum } from 'class-validator';
import { OrderStatus } from '../orderRequest.entity';

export class UpdateOrderRequestDto {
  @IsEnum(OrderStatus)
  status: OrderStatus;
}
