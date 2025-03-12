import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoriesService } from './categories.service';
import { Category } from './category.entity';
import { CategoriesController } from './categories.controller';
import { UserPJ } from 'src/userpj/userpj.entity';
import { UserPJModule } from 'src/userpj/userpj.module';  
import { UserPF } from 'src/userpf/userpf.entity';
import { UserPFModule } from 'src/userpf/userpf.module';
import { OrderModule } from 'src/orderRequest/order.module';  

@Module({
  imports: [
    TypeOrmModule.forFeature([Category, UserPJ, UserPF]),
    forwardRef(() => UserPJModule), 
    forwardRef(() => UserPFModule), 
    forwardRef(() => OrderModule),  
  ],
  providers: [CategoriesService],
  controllers: [CategoriesController],
  exports: [TypeOrmModule, CategoriesService],
})
export class CategoriesModule {}