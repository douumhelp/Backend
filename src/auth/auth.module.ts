import { forwardRef, Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserPFService } from '../userpf/userpf.service';
import { UserPJService } from '../userpj/userpj.service';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.strategy';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserPF } from '../userpf/userpf.entity';
import { UserPJ } from '../userpj/userpj.entity';
import { UserPFModule } from 'src/userpf/userpf.module';
import { UserPJModule } from 'src/userpj/userpj.module';
import { CategoriesModule } from 'src/categories/categories.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserPF, UserPJ]),
    JwtModule.register({
      secret: "XU2U9Fxq7QdfXG+uL5yPz4DkMvZQkXr8Ml79pWQcM1os2dNw/txEaDp2k6iG9+uh",  
      signOptions: { expiresIn: '60m' },  
    }),
    forwardRef(() => UserPFModule),
    forwardRef(() => UserPJModule),
    forwardRef(() => CategoriesModule),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, UserPFService, UserPJService],
})
export class AuthModule {}
