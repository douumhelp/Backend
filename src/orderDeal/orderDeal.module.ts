import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderDealService } from './orderDeal.service';
import { OrderDealController } from './orderDeal.controller';
import { OrderDeal } from './orderDeal.entity';
import { UserPJ } from '../userpj/userpj.entity';
import { Category } from '../categories/category.entity';
import { OrderRequest } from '../orderRequest/orderRequest.entity';
import { Order } from '../order/order.entity';
import { OrderRequestModule } from 'src/orderRequest/orderRequest.module';
import { Scheduling } from 'src/scheduling/scheduling.entity';
import { SchedulingService } from 'src/scheduling/scheduling.service';

@Module({
  imports: [TypeOrmModule.forFeature([OrderDeal, UserPJ, Category, OrderRequest, Order, Scheduling]), OrderRequestModule],
  controllers: [OrderDealController],
  providers: [OrderDealService, SchedulingService],
  exports: [OrderDealService],
})
export class OrderDealModule {}