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
import { ChatModule } from './chat/chat.module';
import { Message } from './chat/message.entity';
import { Scheduling } from './scheduling/scheduling.entity';
import { SchedulingModule } from './scheduling/scheduling.module';
import { OrderDeal } from './orderDeal/orderDeal.entity';
import { OrderRequest } from './orderRequest/orderRequest.entity';
import { OrderDealModule } from './orderDeal/orderDeal.module';
import { OrderRequestModule } from './orderRequest/orderRequest.module';


@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'root',
      password: 'password',
      database: 'postgres',
      entities: [UserPF, UserPJ, Category, Order, Message, Scheduling, OrderDeal, OrderRequest],
      synchronize: true,
    }),
    JwtModule.register({
      secret: "XU2U9Fxq7QdfXG+uL5yPz4DkMvZQkXr8Ml79pWQcM1os2dNw/txEaDp2k6iG9+uh", 
      signOptions: { expiresIn: '60m' },  
    }),
    UserPFModule,
    UserPJModule,
    AuthModule,
    CategoriesModule,
    OrderModule,
    OrderRequestModule,
    OrderDealModule,
    ChatModule,
    SchedulingModule,
    OrderDealModule,
    OrderRequestModule,
  ],
})
export class AppModule {}
