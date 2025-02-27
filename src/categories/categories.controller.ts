import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CategoriesService } from './categories.service';


@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post('add-categories')
  async addCategories(@Body() body: { userId: string; categoryIds: string[] }) {
    const { userId, categoryIds } = body;
    return await this.categoriesService.addCategoriesToUserPJ(userId, categoryIds);
  }
}
