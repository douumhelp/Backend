import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable, OneToMany } from 'typeorm';
import { Category } from '../categories/category.entity';
import { Order } from 'src/order/order.entity';
import { OrderDeal } from 'src/order-deal/order-deal.entity';
import { Message } from 'src/chat/message.entity';

@Entity('user_pj')
export class UserPJ {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  email: string;

  @Column()
  hashPassword: string;

  @Column()
  cnpj: string;

  @Column()
  telephone: string;

  @ManyToMany(() => Category, (category) => category.userPJs)
  @JoinTable({
    name: 'user_pj_categories', 
    joinColumn: {
      name: 'user_pj_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'category_id',
      referencedColumnName: 'id',
    },
  })
  categories: Category[];

  @OneToMany(() => Order, (order) => order.userPJ)
  order: Order[];

  @OneToMany(() => OrderDeal, (orderDeal) => orderDeal.userPJ)
  orderDeals: OrderDeal[];
  @OneToMany(() => Message, (message) => message.senderPJ)
  sentMessages: Message[];
} 
