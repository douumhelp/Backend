import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserPF } from './userpf.entity';
import { UserPFService } from './userpf.service';

@Module({
  imports: [TypeOrmModule.forFeature([UserPF])],
  providers: [UserPFService],
  exports: [UserPFService],  
})
export class UserPFModule {}
