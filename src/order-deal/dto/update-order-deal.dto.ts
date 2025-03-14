import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, IsUUID, IsDate, IsInt, Min } from 'class-validator';
import { ClientAcceptance } from '../order-deal.entity';
import { Type } from 'class-transformer';

export class UpdateOrderDealDto {
    @IsEnum(ClientAcceptance)
    @IsOptional()
    clientAcceptance?: ClientAcceptance;

    @IsNumber()
    @IsOptional()
    freelancerPrice?: number;

    @IsOptional()
    @IsDate()
    @Type(() => Date) 
    scheduledDate?: Date;

    @IsOptional()
    @IsInt()
    @Min(15, { message: 'A duração estimada deve ser de pelo menos 1 minuto.' })
    estimatedDuration?: number;
}