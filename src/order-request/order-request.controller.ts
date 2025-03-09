import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { OrderRequestService } from './order-request.service';
import { CreateOrderRequestDto } from './dto/create-order-request.dto';
import { UpdateOrderRequestDto } from './dto/update-order-request.dto';

@Controller('order-request')
export class OrderRequestController {
  constructor(private readonly orderRequestService: OrderRequestService) {}

  @Post()
  create(@Body() createOrderRequestDto: CreateOrderRequestDto) {
    return this.orderRequestService.createOrderRequest(createOrderRequestDto);
  }

  
}
