import { IsString, IsDecimal, IsUUID, IsEnum, MaxLength, IsNotEmpty } from 'class-validator';
import { Decimal128 } from 'typeorm';


export class CreateOrderRequestDto {
    @IsString()
    orderName: string;

    @IsString()
    @IsNotEmpty()
    description: string;

    @IsDecimal()
    minValue: number;

    @IsDecimal()
    maxValue: number;

    @IsUUID()
    userPFId: string;

    @IsString()
    categoryId: string;

    @IsString()
    address: string;

}
