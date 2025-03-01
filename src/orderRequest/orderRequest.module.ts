import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderRequest } from './orderRequest.entity';
import { OrderRequestController } from './orderRequest.controller';
import { OrderRequestService } from './orderRequest.service';
import { UserPF } from '../userpf/userpf.entity';
import { UserPJ } from '../userpj/userpj.entity';
import { Category } from '../categories/category.entity';
import { UserPJModule } from 'src/userpj/userpj.module';
import { UserPFModule } from 'src/userpf/userpf.module';
import { CategoriesModule } from 'src/categories/categories.module';

@Module({
  imports: [TypeOrmModule.forFeature([OrderRequest, UserPF, UserPJ, Category]),
    forwardRef(() => UserPJModule), 
    forwardRef(() => UserPFModule), 
    forwardRef(() => CategoriesModule),
],
  controllers: [OrderRequestController],
  providers: [OrderRequestService],
  exports: [OrderRequestService], 
})
export class OrderRequestModule {}
