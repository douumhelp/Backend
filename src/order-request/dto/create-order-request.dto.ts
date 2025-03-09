import { IsString, IsDecimal, IsUUID, IsEnum, MaxLength } from 'class-validator';
import { Decimal128 } from 'typeorm';


export class CreateOrderRequestDto {
    @IsString()
    orderName: string;

    @IsString()
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
