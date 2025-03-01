import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserPF } from './userpf.entity';
import { UserPFService } from './userpf.service';
import { Category } from 'src/categories/category.entity';
import { CategoriesModule } from 'src/categories/categories.module';
import { OrderRequestModule } from 'src/orderRequest/orderRequest.module';  

@Module({
  imports: [    
    TypeOrmModule.forFeature([UserPF, Category]),
    forwardRef(() => CategoriesModule),
    forwardRef(() => OrderRequestModule), 
  ],
  providers: [UserPFService],
  exports: [UserPFService],  
})
export class UserPFModule {}