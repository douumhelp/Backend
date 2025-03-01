import { Controller, Get, Post, Body, Param, Delete, UseGuards, ForbiddenException } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { AddCategoriesToUserDto } from './dto/addCategoriesToUser.dto';
import { UserCategoriesResponseDto } from './dto/userCategoriesResponse.dto';
import { AllCategoriesResponseDto } from './dto/allCategoriesResponse.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('categories')
@UseGuards(JwtAuthGuard)
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post('add')
  async addCategories(@Body() body: AddCategoriesToUserDto) {
    const { userId, categoryIds } = body;

    try {
      return await this.categoriesService.addCategoriesToUserPJ(userId, categoryIds);
    } catch (error) {
      if (error instanceof ForbiddenException) {
        throw new ForbiddenException('PF users cannot be associated with categories');
      }

      throw error;
    }
  }

  @Get(':categoryId/users')
  async getUsersByCategory(@Param('categoryId') categoryId: string) {
    return this.categoriesService.getUsersByCategory(categoryId);
  }

  @Get('user/:userId')
  async getUserCategories(
    @Param('userId') userId: string,
  ): Promise<UserCategoriesResponseDto[]> {
    return this.categoriesService.getAllCategoriesForUser(userId);
  }

  @Get()
  async getAllCategories(): Promise<AllCategoriesResponseDto[]> {
    return this.categoriesService.getAllCategories();
  }

  @Delete('remove/:userId/:categoryId')
  async removeCategoryFromUser(
    @Param('userId') userId: string,
    @Param('categoryId') categoryId: string,
  ) {
    return this.categoriesService.removeCategoryFromUser(userId, categoryId);
  }
}
