import { Controller, Get, Post, Body, Patch, Param, Delete, Put, UseGuards } from '@nestjs/common';
import { OrderRequestService } from './orderRequest.service';
import { CreateOrderRequestDto } from './dto/createOrderRequest.dto';
import { UpdateOrderRequestDto } from './dto/updateOrderRequest.dto';
import { OrderRequest } from './orderRequest.entity';
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

  @Get(':id')
  async findOneById(@Param('id') id: string){
    return this.orderRequestService.findOne(id)
  }


  
}