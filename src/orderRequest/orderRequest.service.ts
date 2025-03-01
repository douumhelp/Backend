import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OrderRequest } from './orderRequest.entity';
import { UserPF } from '../userpf/userpf.entity';
import { UserPJ } from '../userpj/userpj.entity';
import { Category } from '../categories/category.entity';
import { CreateOrderRequestDto } from './dto/CreateOrderRequest.dto';
import { UpdateOrderRequestDto } from './dto/UpdateOrderRequest.dto';
import { OrderStatus } from './orderRequest.entity';

@Injectable()
export class OrderRequestService {
  constructor(
    @InjectRepository(OrderRequest)
    private orderRequestRepository: Repository<OrderRequest>,
    @InjectRepository(UserPF)
    private userPFRepository: Repository<UserPF>,
    @InjectRepository(UserPJ)
    private userPJRepository: Repository<UserPJ>,
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
  ) {}

  async createOrderRequest(createOrderRequestDto: CreateOrderRequestDto): Promise<OrderRequest> {
    const { userPFId, userPJId, categoryId, description, price } = createOrderRequestDto;

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

    const orderRequest = this.orderRequestRepository.create({
      description,
      price,
      userPF,
      userPJ,
      category,
      status: OrderStatus.PENDING,
    });

    return this.orderRequestRepository.save(orderRequest);
  }

  async updateOrderRequestStatus(id: string, updateOrderRequestDto: UpdateOrderRequestDto, userPJId: string): Promise<OrderRequest> {
    const orderRequest = await this.orderRequestRepository.findOne({ where: { id }, relations: ['userPJ'] });
    if (!orderRequest) {
      throw new NotFoundException('OrderRequest not found');
    }

    if (orderRequest.userPJ.id !== userPJId) {
      throw new BadRequestException('You are not authorized to change the status of this order request');
    }

    orderRequest.status = updateOrderRequestDto.status;
    return this.orderRequestRepository.save(orderRequest);
  }
}
