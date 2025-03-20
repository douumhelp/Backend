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
import { Scheduling } from 'src/scheduling/scheduling.entity';
import { SchedulingService } from 'src/scheduling/scheduling.service';

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
    private readonly schedulingService: SchedulingService,
  ) {}

  async createOrder(createOrderDto: CreateOrderDto): Promise<Order> {
    const { userPFId, userPJId, categoryId, description, price, startTime } = createOrderDto;
  
    const userPF = await this.userPFRepository.findOne({ where: { id: userPFId } });
    if (!userPF) throw new NotFoundException('User PF not found');
  
    const userPJ = await this.userPJRepository.findOne({ where: { id: userPJId } });
    if (!userPJ) throw new NotFoundException('User PJ not found');
  
    const category = await this.categoryRepository.findOne({ where: { id: categoryId } });
    if (!category) throw new NotFoundException('Category not found');
  
    let parsedStartTime: Date | undefined;
    if (startTime) {
      parsedStartTime = new Date(startTime);
      if (isNaN(parsedStartTime.getTime())) {
        throw new BadRequestException('Invalid startTime format');
      }
      
      const isAvailable = await this.schedulingService.isTimeAvailable(userPJId, parsedStartTime);
      if (!isAvailable) {
        throw new BadRequestException('Selected time is not available');
      }
    }
  
    const order = this.orderRepository.create({
      description,
      price,
      userPF,
      userPJ,
      category,
      status: OrderStatus.PENDING, 
      requestDate: new Date(), 
    });
  
    const savedOrder = await this.orderRepository.save(order);
  
    if (parsedStartTime) {
      await this.schedulingService.addScheduledTime(userPJId, parsedStartTime);
    }
  
    return savedOrder;
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