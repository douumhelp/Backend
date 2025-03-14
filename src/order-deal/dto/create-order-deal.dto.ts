import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsInt, IsUUID, IsDate, Min } from 'class-validator';
import { ClientAcceptance } from '../order-deal.entity';
import { Type } from 'class-transformer';

export class CreateOrderDealDto {

    @IsEnum(ClientAcceptance)
    @IsOptional()
    clientAcceptance?: ClientAcceptance;

    @IsNumber()
    @IsNotEmpty()
    freelancerPrice: number;

    @IsOptional()
    @IsDate()
    @Type(() => Date) 
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

    @IsInt()
    @Min(15, { message: 'A duração estimada deve ser de pelo menos 15 minutos.' })
    estimatedDuration: number;

}