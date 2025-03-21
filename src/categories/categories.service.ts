import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from 'src/categories/category.entity';
import { UserPJ } from 'src/userpj/userpj.entity';
import { In, Repository } from 'typeorm';
import { AllCategoriesResponseDto } from './dto/allCategoriesResponse.dto';
import { UserCategoriesResponseDto } from './dto/userCategoriesResponse.dto';
import { UserPF } from 'src/userpf/userpf.entity';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(UserPJ)
    private readonly userPJRepository: Repository<UserPJ>,

    @InjectRepository(UserPF)
    private readonly userPFRepository: Repository<UserPF>,

    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  async getAllCategories(): Promise<AllCategoriesResponseDto[]> {
    const categories = await this.categoryRepository.find();

    return categories.map(category => ({
      id: category.id,
      name: category.name,
    }));
  }

  async getAllCategoriesForUser(userId: string): Promise<UserCategoriesResponseDto[]> {
    const user = await this.userPJRepository.findOne({
      where: { id: userId },
      relations: ['categories'],
    });

    if (!user) {
      throw new Error('User not found');
    }

    return user.categories.map(category => ({
      id: category.id,
      name: category.name,
    }));
  }

  async addCategoriesToUserPJ(userId: string, categoryIds: string[]): Promise<UserPJ> {
    const user = await this.userPJRepository.findOne({
      where: { id: userId },
      relations: ['categories'],
    });
  
    if (!user) {
      const userPF = await this.userPFRepository.findOne({
        where: { id: userId },
      });
  
      if (userPF) {
        throw new ForbiddenException('PF users cannot be associated with categories');
      }
  
      throw new NotFoundException('User not found');
    }
  
    const categories = await this.categoryRepository.findBy({
      id: In(categoryIds),
    });
  
    const newCategories = categories.filter(category => {
      return !user.categories.some(userCategory => userCategory.id === category.id);
    });
  
    if (newCategories.length > 0) {
      user.categories = [...user.categories, ...newCategories];
    } else {
      throw new ForbiddenException('All selected categories are already associated with the user');
    }
  
    return await this.userPJRepository.save(user);
  }  

  async removeCategoryFromUser(userId: string, categoryId: string): Promise<UserPJ> {
    const user = await this.userPJRepository.findOne({
      where: { id: userId },
      relations: ['categories'],
    });

    if (!user) {
      throw new Error('User not found');
    }

    const categoryIndex = user.categories.findIndex(cat => cat.id === categoryId);

    if (categoryIndex === -1) {
      throw new Error('Category not associated with the user');
    }

    user.categories.splice(categoryIndex, 1);

    return await this.userPJRepository.save(user);
  }

  async getUsersByCategory(categoryId: string): Promise<UserPJ[]> {
    const category = await this.categoryRepository.findOne({
      where: { id: categoryId },
      relations: ['userPJs'],
    });
  
    if (!category) {
      throw new NotFoundException('Category not found');
    }
  
    return category.userPJs;
  }

  async onModuleInit() {
    const fixedCategories = [ 

      "Babá",
      "Limpeza Residencial",
      "Conserto de Eletrodomésticos",
      "Reparos Elétricos",
      "Transporte de Pequenas Cargas",
      "Passeio com Cães",
      "Pet Sitter",
      "Corte de Cabelo",
      "Massoterapia",
      "Fisioterapia",
      "Personal Organizer",
      "Acompanhante para Idosos",
      "Consultoria",
      "Manutenção de Ar Condicionado",
      "Lavagem de Carros",
      "Pintura Residencial",
      "Serviço de Buffet",
      "Encanador",
      "Manobrista",
      "Diarista Comercial",
      "Segurança",
      "Pedreiro",
      "Fotografia e Filmagem",
      "Professor Particular",
      "Cozinheiro",
      "Jardinagem",
      "ÁudioVisual",
      "Acompanhante",
      "Produtor Musical(DJ)",
      "Instalador de Eletrônicos",
      "Personal Trainer",
      "Contador",
      "Cuidador de Pessoa com Deficiência",
      "Manutenção de Pisicna",
      "Manicure",
      "Mecãnico",
      "Carpinteiro e Marceneiro",
      "Soldador",
      "Técnido de TI",
      "Agência de Frete"
  
    ];
    for (const name of fixedCategories) {
      const categoryExists = await this.categoryRepository.findOne({ where: { name } });
      if (!categoryExists) {
        const category = this.categoryRepository.create({ name });
        await this.categoryRepository.save(category);
      }
    }
  }
}
