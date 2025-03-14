import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, IsUUID, IsDate } from 'class-validator';
import { ClientAcceptance } from '../order-deal.entity';

export class UpdateOrderDealDto {
    @IsEnum(ClientAcceptance)
    @IsOptional()
    clientAcceptance?: ClientAcceptance;

    @IsNumber()
    @IsOptional()
    freelancerPrice?: number;

    @IsDate()
    @IsOptional()
    scheduledDate?: Date;
}