import { Message } from 'src/chat/message.entity';
import { Order } from 'src/order/order.entity';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';

@Entity('user_pf')
export class UserPF {
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
  cpf: string;

  @Column()
  telephone: string;

  @OneToMany(() => Order, (order) => order.userPF)
  order: Order[];

  @OneToMany(() => Message, (message) => message.senderPF)
  sentMessages: Message[];
}