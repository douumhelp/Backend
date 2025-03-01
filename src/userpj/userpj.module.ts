import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserPJ } from './userpj.entity';
import { Category } from 'src/categories/category.entity';
import { UserPJService } from './userpj.service';
import { CategoriesModule } from 'src/categories/categories.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserPJ, Category]),
    forwardRef(() => CategoriesModule),
  ],
  providers: [UserPJService],
  exports: [UserPJService, TypeOrmModule], 
})
export class UserPJModule {}

