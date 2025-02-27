import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from 'src/categories/entities/category.entity';
import { UserPJ } from 'src/userpj/userpj.entity';
import { Repository } from 'typeorm';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(UserPJ)
    private readonly userPJRepository: Repository<UserPJ>,

    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}
  
  async addCategoriesToUserPJ(userId: string, categoryIds: string[]): Promise<UserPJ> {
    const user = await this.userPJRepository.findOne({
      where: { id: userId },
      relations: ['categories'],
    });

    if (!user) {
      throw new Error('User not found');
    }

    const categories = await this.categoryRepository.findByIds(categoryIds);
    user.categories = [...user.categories, ...categories];

    return await this.userPJRepository.save(user);
  }

  async onModuleInit() {
    const fixedCategories = ['Encanamento', 'Eletrônicos', 'Eletrodomésticos'];
    for (const name of fixedCategories) {
      const categoryExists = await this.categoryRepository.findOne({ where: { name } });
      if (!categoryExists) {
        const category = this.categoryRepository.create({ name });
        await this.categoryRepository.save(category);
      }
    }
  }

}
