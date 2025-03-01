import { IsArray, IsString, ArrayNotEmpty } from 'class-validator';

export class AddCategoriesToUserDto {
  @IsString()
  userId: string;

  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  categoryIds: string[];
}
