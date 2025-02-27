import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoriesService } from './categories.service';
import { Category } from './entities/category.entity';
import { CategoriesController } from './categories.controller';
import { UserPJ } from 'src/userpj/userpj.entity';
import { UserPJModule } from 'src/userpj/userpj.module';  // Importando UserPJModule com forwardRef

@Module({
  imports: [
    TypeOrmModule.forFeature([Category, UserPJ]),
    forwardRef(() => UserPJModule), // Usando forwardRef para evitar dependência circular
  ],
  providers: [CategoriesService],
  controllers: [CategoriesController],
})
export class CategoriesModule {}
