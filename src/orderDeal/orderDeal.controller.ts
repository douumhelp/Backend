import { Controller, Get, Post, Body, Patch, Param, Delete, UsePipes, ValidationPipe, UseGuards} from '@nestjs/common';
  import { OrderDealService } from './orderDeal.service';
  import { CreateOrderDealDto } from './dto/createOrderDeal.dto';
  import { UpdateOrderDealDto } from './dto/updateOrderDeal.dto';
  import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
  
  @Controller('order-deal')
  @UseGuards(JwtAuthGuard)
  export class OrderDealController {
    constructor(private readonly orderDealService: OrderDealService) {}
  
    @Post()
    @UsePipes(ValidationPipe)
    create(@Body() createOrderDealDto: CreateOrderDealDto) {
      return this.orderDealService.create(createOrderDealDto);
    }
  
    @Get()
    findAll() {
      return this.orderDealService.findAll();
    }
  
    @Get(':id')
    findOne(@Param('id') id: string) {
      return this.orderDealService.findOne(id);
    }
  
    @Patch(':id')
    @UsePipes(ValidationPipe)
    update(@Param('id') id: string, @Body() updateOrderDealDto: UpdateOrderDealDto) {
        return this.orderDealService.update(id, updateOrderDealDto);
    }
  
    @Delete(':id')
    remove(@Param('id') id: string) {
      return this.orderDealService.remove(id);
    }
  }