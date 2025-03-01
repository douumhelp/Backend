import { OrderRequest } from 'src/orderRequest/orderRequest.entity';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';

@Entity('user_pf')
export class UserPF {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  username: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  email: string;

  @Column()
  hashPassword: string;

  @Column()
  cpf: string;

  @Column()
  telephone: string;

  @OneToMany(() => OrderRequest, (orderRequest) => orderRequest.userPF)
  orderRequests: OrderRequest[];
}
