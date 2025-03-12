import { Controller, Get, Post, Body, Patch, Param, Delete, Put, UseGuards } from '@nestjs/common';
import { OrderRequestService } from './order-request.service';
import { CreateOrderRequestDto } from './dto/create-order-request.dto';
import { UpdateOrderRequestDto } from './dto/update-order-request.dto';
import { CurrentUser } from 'src/common/decorator/current-user.decorator';
import { UpdateOrderDto } from 'src/order/dto/UpdateOrder.dto';
import { Order } from 'src/order/order.entity';
import { OrderRequest } from './order-request.entity';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('order-request')
@UseGuards(JwtAuthGuard)
export class OrderRequestController {
  constructor(private readonly orderRequestService: OrderRequestService) {}

  @Post()
  create(@Body() createOrderRequestDto: CreateOrderRequestDto) {
    return this.orderRequestService.createOrderRequest(createOrderRequestDto);
  }

  @Put(':id')
  async updateStatus(
      @Param('id') id: string,
      @Body() updateOrderRequestDto: UpdateOrderRequestDto,
    ): Promise<OrderRequest> {
      return this.orderRequestService.updateOrderRequestStatus(id, updateOrderRequestDto);
  }

  @Get()
  async getAllOrderRequests(): Promise<OrderRequest[]> {
    return this.orderRequestService.getAllOrderRequest();
  }
  
}
