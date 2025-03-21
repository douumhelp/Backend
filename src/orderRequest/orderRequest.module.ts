import { forwardRef, Module } from '@nestjs/common';
import { OrderRequestService } from './orderRequest.service';
import { OrderRequestController } from './orderRequest.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoriesModule } from 'src/categories/categories.module';
import { Category } from 'src/categories/category.entity';
import { Order } from 'src/order/order.entity';
import { UserPF } from 'src/userpf/userpf.entity';
import { UserPFModule } from 'src/userpf/userpf.module';
import { UserPJ } from 'src/userpj/userpj.entity';
import { UserPJModule } from 'src/userpj/userpj.module';
import { OrderRequest } from './orderRequest.entity';
import { OrderModule } from 'src/order/order.module';

@Module({
  imports: [TypeOrmModule.forFeature([Order, OrderRequest, UserPF, UserPJ, Category]),
      forwardRef(() => UserPJModule), 
      forwardRef(() => UserPFModule), 
      forwardRef(() => CategoriesModule),
      forwardRef(() => OrderModule),
  ],
  controllers: [OrderRequestController],
  providers: [OrderRequestService],
  exports: [OrderRequestService],
})
export class OrderRequestModule {}