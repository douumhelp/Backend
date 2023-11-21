import { IsEnum } from 'class-validator';
import { OrderStatus } from '../order-request.entity';

export class UpdateOrderRequestDto {
    @IsEnum(OrderStatus)
    status: OrderStatus;
}
