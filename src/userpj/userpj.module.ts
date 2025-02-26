import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserPJ } from './userpj.entity';
import { UserPJService } from './userpj.service';

@Module({
  imports: [TypeOrmModule.forFeature([UserPJ])],
  providers: [UserPJService],
  exports: [UserPJService],  
})
export class UserPJModule {}
