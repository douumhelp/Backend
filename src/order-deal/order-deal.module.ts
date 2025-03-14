import { Module } from '@nestjs/common';
import { OrderDealService } from './order-deal.service';
import { OrderDealController } from './order-deal.controller';

@Module({
  controllers: [OrderDealController],
  providers: [OrderDealService],
})
export class OrderDealModule {}
