import { forwardRef, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserPJ } from "src/userpj/userpj.entity";
import { Scheduling } from "./scheduling.entity";
import { UserPJModule } from "src/userpj/userpj.module";
import { SchedulingService } from "./scheduling.service";
import { SchedulingController } from "./scheduling.controller";

@Module({
    imports: [TypeOrmModule.forFeature([UserPJ, Scheduling]),
        forwardRef(() => UserPJModule),
    ],
    controllers: [SchedulingController],
    providers: [SchedulingService],
    exports: [SchedulingModule],
}) 
export class SchedulingModule {}

