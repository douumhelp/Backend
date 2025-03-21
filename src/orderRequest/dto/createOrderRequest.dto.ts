import { IsString, IsDecimal, IsUUID, IsEnum, MaxLength, IsNotEmpty } from 'class-validator';


export class CreateOrderRequestDto {
    @IsString()
    @IsNotEmpty()
    orderName: string;

    @IsString()
    @IsNotEmpty()
    description: string;

    @IsDecimal()
    minValue: number;

    @IsDecimal()
    maxValue: number;

    @IsUUID()
    @IsNotEmpty()
    userPFId: string;

    @IsString()
    @IsNotEmpty()
    categoryId: string;

    @IsString()
    @IsNotEmpty()
    address: string;

}