import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderDealService } from './order-deal.service';
import { OrderDealController } from './order-deal.controller';
import { OrderDeal } from './order-deal.entity';
import { UserPJ } from '../userpj/userpj.entity';
import { Category } from '../categories/category.entity';
import { OrderRequest } from '../order-request/order-request.entity';
import { Order } from '../order/order.entity';
import { OrderRequestModule } from 'src/order-request/order-request.module';

@Module({
  imports: [TypeOrmModule.forFeature([OrderDeal, UserPJ, Category, OrderRequest, Order]), OrderRequestModule],
  controllers: [OrderDealController],
  providers: [OrderDealService],
  exports: [OrderDealService],
})
export class OrderDealModule {}
