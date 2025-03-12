import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, OneToMany } from 'typeorm';
import { UserPJ } from '../userpj/userpj.entity';
import { Order } from 'src/orderRequest/order.entity';

@Entity('category')
export class Category {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @ManyToMany(() => UserPJ, (userPJ) => userPJ.categories)
  userPJs: UserPJ[];

  @OneToMany(() => Order, (order) => order.category)
  order: Order[];
}