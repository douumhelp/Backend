import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToOne } from 'typeorm';
import { UserPF } from '../userpf/userpf.entity';
import { UserPJ } from '../userpj/userpj.entity';
import { Category } from '../categories/category.entity';
import { OrderDeal } from 'src/orderDeal/orderDeal.entity';

export enum OrderStatus {
  ACCEPTED = 'Aceito',
  COMPLETED = 'Concluido'
}

@Entity('orders')
export class Order {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 300 })
  description: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  requestDate: Date;

  @Column({
    type: 'enum',
    enum: OrderStatus,
    default: OrderStatus.ACCEPTED,
  })
  status: OrderStatus;

  @ManyToOne(() => UserPF, (userPF) => userPF.order)
  userPF: UserPF;

  @ManyToOne(() => UserPJ, (userPJ) => userPJ.order)
  userPJ: UserPJ;

  @ManyToOne(() => Category)
  category: Category;

  @OneToOne(() => OrderDeal, (orderDeal) => orderDeal.order)
  deal: OrderDeal;
}

