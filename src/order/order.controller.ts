import { Controller, Post, Body, Param, Put, UseGuards, Get } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard'; 
import { OrderService } from './order.service';
import { UpdateOrderDto } from './dto/UpdateOrder.dto';
import { Order } from './order.entity';
import { CurrentUser } from '../common/decorator/current-user.decorator'; 

@Controller('order')
@UseGuards(JwtAuthGuard)
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Put(':id')
  async updateStatus(
    @Param('id') id: string,
    @Body() updateOrderDto: UpdateOrderDto,
    @CurrentUser() user: any, 
  ): Promise<Order> {
    return this.orderService.updateOrderStatus(id, updateOrderDto, user.id);
  }

  @Get()
  async getAllOrders(){
    return this.orderService.getAllOrders();
  }
}
