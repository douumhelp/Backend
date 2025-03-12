import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateOrderRequestDto } from './dto/create-order-request.dto';
import { UpdateOrderRequestDto } from './dto/update-order-request.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { OrderRequest, OrderStatus } from './order-request.entity';
import { Repository } from 'typeorm';
import { Category } from 'src/categories/category.entity';
import { UserPF } from 'src/userpf/userpf.entity';
import { UserPJ } from 'src/userpj/userpj.entity';


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
  ){}


  async createOrderRequest(createOrderRequestDto: CreateOrderRequestDto) {
    const { orderName, description, userPFId, minValue, maxValue, categoryId, address } = createOrderRequestDto

    const userPF = await this.userPFRepository.findOne({ where: { id: userPFId } });
        if (!userPF) {
          throw new NotFoundException('User PF not found');
    }

    const category = await this.categoryRepository.findOne({ where: { id: categoryId } });
    if (!category) {
      throw new NotFoundException('Category not found');
    }

    const orderReq = this.orderRequestRepository.create({
      orderName,
      description,
      userPF,
      minValue,
      maxValue,
      category,
      address,
      status: OrderStatus.PENDING,
    })

    return this.orderRequestRepository.save(orderReq)
  }

  async updateOrderRequestStatus(id: string, updateOrderDto: UpdateOrderRequestDto): Promise<OrderRequest> {
      const orderRequest = await this.orderRequestRepository.findOne({ where: { id } });
      if (!orderRequest) {
        throw new NotFoundException('Order not found');
      }
  
  
      orderRequest.status = updateOrderDto.status;
      return this.orderRequestRepository.save(orderRequest);
    }

  async getAllOrderRequest(): Promise<OrderRequest[]>{
    return this.orderRequestRepository.find({
      relations: ['userPF', 'category'],
    });
  }
}
