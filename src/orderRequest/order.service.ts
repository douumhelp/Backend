import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from './order.entity';
import { UserPF } from '../userpf/userpf.entity';
import { UserPJ } from '../userpj/userpj.entity';
import { Category } from '../categories/category.entity';
import { CreateOrderDto } from './dto/CreateOrder.dto';
import { UpdateOrderDto } from './dto/UpdateOrder.dto';
import { OrderStatus } from './order.entity';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
    @InjectRepository(UserPF)
    private userPFRepository: Repository<UserPF>,
    @InjectRepository(UserPJ)
    private userPJRepository: Repository<UserPJ>,
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
  ) {}

  async createOrder(createOrderDto: CreateOrderDto): Promise<Order> {
    const { userPFId, userPJId, categoryId, description, price } = createOrderDto;

    const userPF = await this.userPFRepository.findOne({ where: { id: userPFId } });
    if (!userPF) {
      throw new NotFoundException('User PF not found');
    }

    const userPJ = await this.userPJRepository.findOne({ where: { id: userPJId } });
    if (!userPJ) {
      throw new NotFoundException('User PJ not found');
    }

    const category = await this.categoryRepository.findOne({ where: { id: categoryId } });
    if (!category) {
      throw new NotFoundException('Category not found');
    }

    const order = this.orderRepository.create({
      description,
      price,
      userPF,
      userPJ,
      category,
      status: OrderStatus.PENDING,
    });

    return this.orderRepository.save(order);
  }

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
}