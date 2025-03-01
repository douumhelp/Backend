import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, OneToMany } from 'typeorm';
import { UserPJ } from '../userpj/userpj.entity';
import { OrderRequest } from 'src/orderRequest/orderRequest.entity';

@Entity('category')
export class Category {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @ManyToMany(() => UserPJ, (userPJ) => userPJ.categories)
  userPJs: UserPJ[];

  @OneToMany(() => OrderRequest, (orderRequest) => orderRequest.category)
  orderRequests: OrderRequest[];
}