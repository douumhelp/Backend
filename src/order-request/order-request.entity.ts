import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { UserPF } from '../userpf/userpf.entity';
import { UserPJ } from '../userpj/userpj.entity';
import { Category } from '../categories/category.entity';

export enum OrderStatus {
  PENDING = 'Pendente',
  ACCEPTED = 'Aceito',
  REJECTED = 'Recusado',
}

@Entity('order-request')
export class OrderRequest {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 100 })
  orderName: string

  @Column({ length: 300 })
  description: string;

  @Column()
  address: string

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  maxValue: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  minValue: number;

  @Column({ type: 'timestamp', nullable: true })
  scheduledDate: Date | null; 

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  requestDate: Date;

  @Column({
    type: 'enum',
    enum: OrderStatus,
    default: OrderStatus.PENDING,
  })
  status: OrderStatus;

  @ManyToOne(() => UserPF, (userPF) => userPF.order)
  userPF: UserPF;

  @ManyToOne(() => UserPJ, (userPJ) => userPJ.order)
  userPJ: UserPJ;

  @ManyToOne(() => Category)
  category: Category;
}
