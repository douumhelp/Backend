import { Controller, Post, Body, Param, Put, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard'; 
import { OrderRequestService } from './orderRequest.service';
import { CreateOrderRequestDto } from './dto/CreateOrderRequest.dto';
import { UpdateOrderRequestDto } from './dto/UpdateOrderRequest.dto';
import { OrderRequest } from './orderRequest.entity';
import { CurrentUser } from '../common/decorator/current-user.decorator'; 

@Controller('order-request')
@UseGuards(JwtAuthGuard)
export class OrderRequestController {
  constructor(private readonly orderRequestService: OrderRequestService) {}

  @Post()
  async create(@Body() createOrderRequestDto: CreateOrderRequestDto, @CurrentUser() user: any): Promise<OrderRequest> {
    createOrderRequestDto.userPFId = user.id; 
    return this.orderRequestService.createOrderRequest(createOrderRequestDto);
  }

  @Put(':id')
  async updateStatus(
    @Param('id') id: string,
    @Body() updateOrderRequestDto: UpdateOrderRequestDto,
    @CurrentUser() user: any, 
  ): Promise<OrderRequest> {
    return this.orderRequestService.updateOrderRequestStatus(id, updateOrderRequestDto, user.id);
  }
}
