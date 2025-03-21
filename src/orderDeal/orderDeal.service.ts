import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OrderDeal } from './orderDeal.entity';
import { CreateOrderDealDto } from './dto/createOrderDeal.dto';
import { UpdateOrderDealDto } from './dto/updateOrderDeal.dto';
import { UserPJ } from 'src/userpj/userpj.entity';
import { OrderRequest } from '../orderRequest/orderRequest.entity';
import { Order} from 'src/order/order.entity';
import { OrderRequestService } from 'src/orderRequest/orderRequest.service';
import { SchedulingService } from 'src/scheduling/scheduling.service';

@Injectable()
export class OrderDealService {
  constructor(
    private readonly orderRequestService: OrderRequestService,
    @InjectRepository(OrderDeal)
    private readonly orderDealRepository: Repository<OrderDeal>,
    @InjectRepository(UserPJ)
    private readonly userPJRepository: Repository<UserPJ>,
    @InjectRepository(OrderRequest)
    private readonly orderRequestRepository: Repository<OrderRequest>,
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    private readonly schedulingService: SchedulingService
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

    const wasAccepted = orderDeal.clientAcceptance === 'accepted';
    
    Object.assign(orderDeal, updateOrderDealDto);

    const updatedOrderDeal = await this.orderDealRepository.save(orderDeal);

    if (!wasAccepted && updatedOrderDeal.clientAcceptance === 'accepted') {
        await this.acceptOrderDeal(id);
    }

    return updatedOrderDeal;
}
  
  async remove(id: string): Promise<void> {
    const result = await this.orderDealRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`OrderDeal com ID ${id} não encontrada`);
    }
  }

  async acceptOrderDeal(id: string) {
    console.log("[DEBUG] Iniciando acceptOrderDeal para OrderDeal ID:", id);

    const orderDeal = await this.findOne(id);
    console.log("[DEBUG] OrderDeal encontrado:", orderDeal);

    if (orderDeal.clientAcceptance !== 'accepted') {
        console.error("[ERRO] O OrderDeal ainda não foi aceito. Status:", orderDeal.clientAcceptance);
        throw new ConflictException('O OrderDeal ainda não foi aceito');
    }

    const orderRequest = await this.orderRequestService.findOne(orderDeal.orderRequest.id);
    console.log("[DEBUG] OrderRequest encontrado:", orderRequest);

    const order = new Order();
    order.description = `Serviço para ${orderDeal.userPJ.firstName, orderDeal.userPJ.lastName} - Valor: ${orderDeal.freelancerPrice}`;
    order.price = orderDeal.freelancerPrice;
    order.userPJ = orderDeal.userPJ;
    order.category = orderDeal.category;
    order.userPF = orderRequest.userPF;

    console.log("[DEBUG] Criando novo Order:", order);
    const savedOrder = await this.orderRepository.save(order);
    console.log("[DEBUG] Order criada e salva com sucesso:", savedOrder);

    orderDeal.order = savedOrder;
    await this.orderDealRepository.save(orderDeal);
    console.log("[DEBUG] OrderDeal atualizado com Order associada:", orderDeal);

    const startTime = orderDeal.scheduledDate;
    if (!startTime) {
        console.error("[ERRO] scheduledDate é nulo. O agendamento não será criado.");
        throw new Error("Scheduled date is null.");
    }

    console.log("[DEBUG] Agendando horário para o PJ:", orderDeal.userPJ.id, "Horário:", startTime);

    try {
        await this.schedulingService.bookTimeSlot(orderDeal.userPJ.id, startTime);
        console.log("[DEBUG] Agendamento criado com sucesso para a Order.");
    } catch (error) {
        console.error("[ERRO] Erro ao criar agendamento:", error);
        throw new ConflictException('Erro ao criar agendamento');
    }
    }

}