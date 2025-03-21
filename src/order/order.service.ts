import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from './order.entity';
import { UpdateOrderDto } from './dto/UpdateOrder.dto';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
  ) {}

  async updateOrderStatus(id: string, updateOrderDto: UpdateOrderDto, userPJId: string): Promise<Order> {
    const order = await this.orderRepository.findOne({ where: { id }, relations: ['userPJ'] });
    if (!order) {
      throw new NotFoundException('Order not found');
    }

    if (order.userPJ.id !== userPJId) {
      throw new BadRequestException('You are not authorized to change the status of this order');
    }

    order.status = updateOrderDto.status;
    return this.orderRepository.save(order);
  }

  async getAllOrders(){
    return this.orderRepository.find();
  }
}
