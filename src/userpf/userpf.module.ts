import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserPF } from './userpf.entity';
import { UserPFService } from './userpf.service';
import { Category } from 'src/categories/category.entity';
import { CategoriesModule } from 'src/categories/categories.module';

@Module({
  imports: [    
    TypeOrmModule.forFeature([UserPF, Category]),
    forwardRef(() => CategoriesModule),
  ],
  providers: [UserPFService],
  exports: [UserPFService],  
})
export class UserPFModule {}
