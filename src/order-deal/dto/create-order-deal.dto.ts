import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, IsUUID, IsDate } from 'class-validator';
import { ClientAcceptance } from '../order-deal.entity';

export class CreateOrderDealDto {
    @IsUUID()
    @IsNotEmpty()
    id: string;

    @IsEnum(ClientAcceptance)
    @IsOptional()
    clientAcceptance?: ClientAcceptance;

    @IsNumber()
    @IsNotEmpty()
    freelancerPrice: number;

    @IsDate()
    @IsOptional()
    scheduledDate?: Date;

    @IsUUID()
    @IsNotEmpty()
    userPJId: string;

    @IsUUID()
    @IsNotEmpty()
    categoryId: string;

    @IsUUID()
    @IsNotEmpty()
    orderRequestId: string;
}