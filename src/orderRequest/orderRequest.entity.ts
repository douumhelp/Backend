import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { UserPF } from '../userpf/userpf.entity';
import { UserPJ } from '../userpj/userpj.entity';
import { Category } from '../categories/category.entity';
import { DateTransformer } from 'src/common/transformers/DateTransformer';

export enum OrderStatus {
  PENDING = 'Pendente',
  ACCEPTED = 'Aceito',
  REJECTED = 'Recusado',
}

@Entity('order_request')
export class OrderRequest {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 300 })
  description: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', transformer: new DateTransformer() })
  requestDate: Date;

  @Column({
    type: 'enum',
    enum: OrderStatus,
    default: OrderStatus.PENDING,
  })
  status: OrderStatus;

  @ManyToOne(() => UserPF, (userPF) => userPF.orderRequests)
  userPF: UserPF;

  @ManyToOne(() => UserPJ, (userPJ) => userPJ.orderRequests)
  userPJ: UserPJ;

  @ManyToOne(() => Category)
  category: Category;
}
