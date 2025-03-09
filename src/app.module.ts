import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserPFModule } from './userpf/userpf.module';
import { UserPJModule } from './userpj/userpj.module';
import { AuthModule } from './auth/auth.module';  
import { UserPF } from './userpf/userpf.entity';
import { UserPJ } from './userpj/userpj.entity';
import { JwtModule } from '@nestjs/jwt';
import { CategoriesModule } from './categories/categories.module';
import { Category } from './categories/category.entity';
import { Order } from './order/order.entity';
import { OrderModule } from './order/order.module';
import { OrderRequestModule } from './order-request/order-request.module';
import { OrderRequest } from './order-request/order-request.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'root',
      password: 'password',
      database: 'postgres',
      entities: [UserPF, UserPJ, Category, Order, OrderRequest],
      synchronize: true,
    }),
    JwtModule.register({
      secret: "XU2U9Fxq7QdfXG+uL5yPz4DkMvZQkXr8Ml79pWQcM1os2dNw/txEaDp2k6iG9+uh" , 
      signOptions: { expiresIn: '60m' },  
    }),
    UserPFModule,
    UserPJModule,
    AuthModule,
    CategoriesModule,
    OrderModule,
    OrderRequestModule,
  ],
})
export class AppModule {}
