import { Module } from '@nestjs/common';
import { OrderRequestService } from './order-request.service';
import { OrderRequestController } from './order-request.controller';

@Module({
  controllers: [OrderRequestController],
  providers: [OrderRequestService],
})
export class OrderRequestModule {}
