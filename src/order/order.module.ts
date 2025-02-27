import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './order.entity';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { UserPF } from '../userpf/userpf.entity';
import { UserPJ } from '../userpj/userpj.entity';
import { Category } from '../categories/category.entity';
import { UserPJModule } from 'src/userpj/userpj.module';
import { UserPFModule } from 'src/userpf/userpf.module';
import { CategoriesModule } from 'src/categories/categories.module';

@Module({
  imports: [TypeOrmModule.forFeature([Order, UserPF, UserPJ, Category]),
    forwardRef(() => UserPJModule), 
    forwardRef(() => UserPFModule), 
    forwardRef(() => CategoriesModule),
],
  controllers: [OrderController],
  providers: [OrderService],
  exports: [OrderService], 
})
export class OrderModule {}
