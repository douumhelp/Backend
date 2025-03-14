import { Injectable } from '@nestjs/common';
import { CreateOrderDealDto } from './dto/create-order-deal.dto';
import { UpdateOrderDealDto } from './dto/update-order-deal.dto';

@Injectable()
export class OrderDealService {
  create(createOrderDealDto: CreateOrderDealDto) {
    return 'This action adds a new orderDeal';
  }

  findAll() {
    return `This action returns all orderDeal`;
  }

  findOne(id: number) {
    return `This action returns a #${id} orderDeal`;
  }

  update(id: number, updateOrderDealDto: UpdateOrderDealDto) {
    return `This action updates a #${id} orderDeal`;
  }

  remove(id: number) {
    return `This action removes a #${id} orderDeal`;
  }
}
