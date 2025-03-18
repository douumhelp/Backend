import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OrderDeal } from './order-deal.entity';
import { CreateOrderDealDto } from './dto/create-order-deal.dto';
import { UpdateOrderDealDto } from './dto/update-order-deal.dto';
import { UserPJ } from 'src/userpj/userpj.entity';
import { OrderRequest } from '../order-request/order-request.entity';
import { Order, OrderStatus } from 'src/order/order.entity';

@Injectable()
export class OrderDealService {
  constructor(
    @InjectRepository(OrderDeal)
    private readonly orderDealRepository: Repository<OrderDeal>,
    @InjectRepository(UserPJ)
    private readonly userPJRepository: Repository<UserPJ>,
    @InjectRepository(OrderRequest)
    private readonly orderRequestRepository: Repository<OrderRequest>,
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>
  ) {}

  async create(createOrderDealDto: CreateOrderDealDto): Promise<OrderDeal> {
    const { userPJId, orderRequestId, freelancerPrice, scheduledDate, categoryId, estimatedDuration } = createOrderDealDto;

    
    const userPJ = await this.userPJRepository.findOne({ where: { id: userPJId } });
    if (!userPJ) {
      throw new NotFoundException(`UserPJ com ID ${userPJId} não encontrado`);
    }

    
    const orderRequest = await this.orderRequestRepository.findOne({ where: { id: orderRequestId } });
    if (!orderRequest) {
      throw new NotFoundException(`OrderRequest com ID ${orderRequestId} não encontrado`);
    }

    
    const existingDeal = await this.orderDealRepository.findOne({
      where: {
        userPJ: { id: userPJId },
        orderRequest: { id: orderRequestId },
      },
    });

    if (existingDeal) {
      throw new ConflictException(`UserPJ com ID ${userPJId} já enviou uma Deal para essa OrderRequest`);
    }

    // criar o OrderDeal
    const orderDeal = this.orderDealRepository.create({
      userPJ: userPJ,
      orderRequest: orderRequest,
      freelancerPrice,
      scheduledDate,
      estimatedDuration,
      category: orderRequest.category, 
    });

    
    return await this.orderDealRepository.save(orderDeal);
  }

  
  async findAll(): Promise<OrderDeal[]> {
    return await this.orderDealRepository.find({ relations: ['userPJ', 'category', 'orderRequest', 'order'] });
  }

  
  async findOne(id: string): Promise<OrderDeal> {
    const orderDeal = await this.orderDealRepository.findOne({
      where: { id },
      relations: ['userPJ', 'category', 'orderRequest', 'order'],
    });

    if (!orderDeal) {
      throw new NotFoundException(`OrderDeal com ID ${id} não encontrada`);
    }

    return orderDeal;
  }

  
  async update(id: string, updateOrderDealDto: UpdateOrderDealDto): Promise<OrderDeal> {
    const orderDeal = await this.findOne(id);
    Object.assign(orderDeal, updateOrderDealDto);
    return await this.orderDealRepository.save(orderDeal);
  }

  
  async remove(id: string): Promise<void> {
    const result = await this.orderDealRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`OrderDeal com ID ${id} não encontrada`);
    }
  }

  async acceptOrderDeal(id: string): Promise<Order> {
    const orderDeal = await this.findOne(id);

    if (orderDeal.clientAcceptance !== 'accepted') {
      throw new ConflictException('O OrderDeal ainda não foi aceito');
    }

    // Criar o Order com os dados do OrderDeal
    const order = new Order();
    order.description = `Serviço para ${orderDeal.userPJ.firstName} - Valor: ${orderDeal.freelancerPrice}`;
    order.price = orderDeal.freelancerPrice;
    order.requestDate = new Date();
    order.status = OrderStatus.PENDING; 

    order.deal = orderDeal;

    return await this.orderRepository.save(order);
  }
}
